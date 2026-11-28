import { exactGameMinutes } from './clock.js?v=34';
import { physicalDamage } from './combat.js?v=53';
import { mobSettings as config } from './mob-settings.js?v=51';
import { advanceNations, removeResident, residentPosition } from './nation-simulation.js?v=53';
import { animalTypes, mobTypes, settings } from './settings.js?v=49';
import { buildings, cave, field, terrainAt } from './world.js?v=53';

export const mobGroup = kind => Object.hasOwn(animalTypes, kind) ? 'animal' : 'enemy';
const groups = ['animal', 'enemy'];
const chunkSize = config.chunkTiles * settings.tile;
const columns = Math.ceil(field.width / chunkSize);
const rows = Math.ceil(field.height / chunkSize);
const distanceSquared = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const tickSeconds = config.tickMinutes / exactGameMinutes(1);
const angleLimit = 2 * Math.PI;

const tilesByChunk = Array.from({ length: rows * columns }, (_, id) => {
  const x = id % columns * chunkSize;
  const y = Math.floor(id / columns) * chunkSize;
  const right = Math.min(x + chunkSize, field.width);
  const bottom = Math.min(y + chunkSize, field.height);
  const tiles = [];
  for (let py = y + settings.tile / 2; py < bottom; py += settings.tile) {
    for (let px = x + settings.tile / 2; px < right; px += settings.tile) {
      tiles.push({ x: px, y: py, terrain: terrainAt(px, py) });
    }
  }
  const candidates = Object.fromEntries(groups.map(group => [group,
    tiles.filter(tile => Object.keys(config.terrain[tile.terrain]?.[group] ?? {}).length)]));
  return { id, x, y, right, bottom, tiles, candidates };
});

export function chunkAt(world, x, y) {
  if (x < 0 || y < 0 || x >= field.width || y >= field.height) return undefined;
  return world.chunks[Math.floor(y / chunkSize) * columns + Math.floor(x / chunkSize)];
}

export function* chunksIn(world, left, top, right, bottom) {
  for (let y = Math.max(0, Math.floor(top / chunkSize)); y <= Math.min(rows - 1, Math.floor(bottom / chunkSize)); y++) {
    for (let x = Math.max(0, Math.floor(left / chunkSize)); x <= Math.min(columns - 1, Math.floor(right / chunkSize)); x++) {
      yield world.chunks[y * columns + x];
    }
  }
}

export function* mobsIn(world, left, top, right, bottom) {
  for (const chunk of chunksIn(world, left, top, right, bottom)) {
    yield* chunk.mobs.animal;
    yield* chunk.mobs.enemy;
  }
}

export function createMobWorld(minute, saved) {
  const world = {
    chunks: tilesByChunk.map(chunk => ({
      ...chunk, protected: false, mobs: { animal: new Set(), enemy: new Set() },
      targets: {}, blockers: [], residents: [],
    })),
    mobs: new Map(), counts: { animal: 0, enemy: 0 }, protectedCounts: { animal: 0, enemy: 0 },
    limits: {}, nextId: saved?.nextId ?? 1, tick: saved?.tick ?? 0,
    minute: saved?.minute ?? minute,
  };
  for (const mob of saved?.individuals ?? []) addMob(world, mob);
  return world;
}

function addMob(world, mob) {
  const group = mobGroup(mob.kind);
  const chunk = chunkAt(world, mob.x, mob.y);
  mob.chunkId = chunk.id;
  chunk.mobs[group].add(mob);
  world.mobs.set(mob.id, mob);
  world.counts[group]++;
  if (chunk.protected) world.protectedCounts[group]++;
}

export function removeMob(world, mob) {
  if (!world.mobs.delete(mob.id)) return;
  const group = mobGroup(mob.kind);
  const chunk = world.chunks[mob.chunkId];
  chunk.mobs[group].delete(mob);
  world.counts[group]--;
  if (chunk.protected) world.protectedCounts[group]--;
}

function relocate(world, mob, x, y) {
  const from = world.chunks[mob.chunkId];
  const to = chunkAt(world, x, y);
  if (from !== to) {
    const group = mobGroup(mob.kind);
    from.mobs[group].delete(mob);
    to.mobs[group].add(mob);
    world.protectedCounts[group] += Number(to.protected) - Number(from.protected);
    mob.chunkId = to.id;
  }
  mob.x = x;
  mob.y = y;
}

export function indexSettlement(world, nations) {
  let buildingCount = buildings.length;
  for (const nation of nations.nations) {
    for (const city of nation.cities) buildingCount += city.buildings.length;
  }
  if (world.buildingCount === buildingCount) return;
  world.buildingCount = buildingCount;
  for (const chunk of world.chunks) {
    chunk.protected = false;
    chunk.blockers.length = 0;
  }
  const structures = [...buildings];
  world.centers = [];
  for (const nation of nations.nations) {
    for (const city of nation.cities) {
      for (const building of city.buildings) {
        structures.push(building);
        if (building.kind !== 'center') continue;
        const x = building.x + building.w / 2;
        const y = building.y + building.h / 2;
        world.centers.push({ x, y });
        const range = config.centerRadius * chunkSize;
        for (const chunk of chunksIn(world, x - range, y - range, x + range, y + range)) chunk.protected = true;
      }
    }
  }
  const margin = config.collisionRadius;
  for (const building of structures) {
    for (const chunk of chunksIn(world, building.x - margin, building.y - margin,
      building.x + building.w + margin, building.y + building.h + margin)) chunk.blockers.push(building);
  }
  for (const group of groups) {
    let normalTarget = 0;
    let protectedTarget = 0;
    let protectedCount = 0;
    const rule = config[group];
    for (const chunk of world.chunks) {
      const density = chunk.candidates[group].length ? (chunk.protected ? rule.protected : rule.local) : 0;
      chunk.targets[group] = density;
      if (chunk.protected) {
        protectedTarget += density;
        protectedCount += chunk.mobs[group].size;
      } else {
        normalTarget += density;
      }
    }
    world.protectedCounts[group] = protectedCount;
    const target = normalTarget + protectedTarget;
    world.limits[group] = {
      target: Math.round(target), maximum: Math.ceil(target * rule.worldMaximumFactor),
      normalTarget: Math.round(normalTarget), protectedTarget,
    };
  }
}

function obstruction(chunk, x, y) {
  const r = config.collisionRadius;
  let depth = 0;
  for (const b of chunk.blockers) {
    depth = Math.max(depth, Math.min(x - b.x + r, b.x + b.w + r - x, y - b.y + r, b.y + b.h + r - y));
  }
  return depth;
}

function positionAllowed(world, x, y, oldDepth = 0) {
  const margin = config.collisionRadius;
  return x >= margin && y >= margin && x <= field.width - margin && y <= field.height - margin
    && obstruction(chunkAt(world, x, y), x, y) <= oldDepth;
}

function indexResidents(world, nations) {
  for (const chunk of world.chunks) chunk.residents.length = 0;
  for (const nation of nations.nations) {
    for (const city of nation.cities) {
      for (const resident of city.residents) {
        const position = residentPosition(city, resident, world.minute);
        const entry = { ...position, resident, city, nation };
        chunkAt(world, position.x, position.y)?.residents.push(entry);
      }
    }
  }
}

function spawn(world, chunk, group, player, random) {
  const candidates = [...chunk.candidates[group]];
  const range = config.spawnClearance;
  while (candidates.length) {
    const index = Math.floor(random() * candidates.length);
    const tile = candidates[index];
    candidates[index] = candidates.at(-1);
    candidates.pop();
    if (!positionAllowed(world, tile.x, tile.y) || distanceSquared(tile, cave.entrance) <= range ** 2
      || (player && distanceSquared(tile, player) < range ** 2)) continue;
    let occupied = false;
    for (const neighbor of chunksIn(world, tile.x - range, tile.y - range, tile.x + range, tile.y + range)) {
      for (const other of [...neighbor.mobs.animal, ...neighbor.mobs.enemy, ...neighbor.residents]) {
        if (distanceSquared(tile, other) < range ** 2) { occupied = true; break; }
      }
      if (occupied) break;
    }
    if (occupied) continue;
    const weights = Object.entries(config.terrain[tile.terrain][group]);
    let roll = random() * weights.reduce((sum, [, weight]) => sum + weight, 0);
    const [kind] = weights.find(([, weight]) => (roll -= weight) < 0);
    const maxHp = mobTypes[kind].maxHp;
    addMob(world, {
      id: `field-${world.nextId++}`, kind, x: tile.x, y: tile.y,
      hp: maxHp, maxHp, cooldown: 0, flash: 0, flee: 0, hunted: false, angle: 0, turnIn: 0,
    });
    return true;
  }
  return false;
}

function populate(world, player, random, initial) {
  for (const group of groups) {
    const rule = config[group];
    const limit = world.limits[group];
    const floor = Math.floor(limit.protectedTarget);
    const protectedLimit = floor + Number(random() < limit.protectedTarget - floor);
    const worldLimit = Math.min(limit.target, limit.maximum);
    let budget = initial ? worldLimit : rule.perCycle;
    for (const protectedRegion of [true, false]) {
      const regionalLimit = protectedRegion ? protectedLimit : limit.normalTarget;
      const regionalCount = protectedRegion ? world.protectedCounts[group]
        : world.counts[group] - world.protectedCounts[group];
      let remaining = Math.min(budget, regionalLimit - regionalCount, worldLimit - world.counts[group]);
      if (remaining <= 0) continue;
      // A positive fractional target still gives an empty chunk a chance to spawn.
      const candidates = world.chunks.filter(chunk => chunk.protected === protectedRegion
        && chunk.mobs[group].size < Math.ceil(chunk.targets[group]));
      while (candidates.length && remaining > 0) {
        const index = Math.floor(random() * candidates.length);
        const chunk = candidates[index];
        candidates[index] = candidates.at(-1);
        candidates.pop();
        if (!initial && random() >= rule.chance) continue;
        if (spawn(world, chunk, group, player, random)) {
          remaining--;
          budget--;
        }
      }
    }
  }
}

function move(world, mob, angle, amount) {
  const steps = Math.ceil(amount / config.collisionRadius);
  if (steps === 0) return true;
  const offsetX = Math.cos(angle) * amount;
  const offsetY = Math.sin(angle) * amount;
  const finalX = mob.x + offsetX;
  const finalY = mob.y + offsetY;
  const origin = world.chunks[mob.chunkId];
  if (!origin.blockers.length && chunkAt(world, finalX, finalY) === origin
    && positionAllowed(world, finalX, finalY)) {
    mob.x = finalX;
    mob.y = finalY;
    return true;
  }
  const dx = offsetX / steps;
  const dy = offsetY / steps;
  let moved = false;
  for (let i = 0; i < steps; i++) {
    const depth = obstruction(world.chunks[mob.chunkId], mob.x, mob.y);
    const x = mob.x + dx;
    const y = mob.y + dy;
    if (positionAllowed(world, x, y, depth)) {
      relocate(world, mob, x, y);
    } else if (positionAllowed(world, x, mob.y, depth) && Math.abs(dx) > 0.01) {
      relocate(world, mob, x, mob.y);
    } else if (positionAllowed(world, mob.x, y, depth) && Math.abs(dy) > 0.01) {
      relocate(world, mob, mob.x, y);
    } else break;
    moved = true;
  }
  return moved;
}

function residentInReach(world, mob) {
  const range = config.resident.reach;
  const chunk = world.chunks[mob.chunkId];
  const hasContact = entry => entry.resident.hp !== 0 && distanceSquared(mob, entry) <= range ** 2;
  if (chunk.residents.some(hasContact)) return true;
  if (mob.x > chunk.x + range && mob.x < chunk.right - range
    && mob.y > chunk.y + range && mob.y < chunk.bottom - range) return false;
  for (const neighbor of chunksIn(world, mob.x - range, mob.y - range, mob.x + range, mob.y + range)) {
    if (neighbor !== chunk && neighbor.residents.some(hasContact)) return true;
  }
  return false;
}

function moveMob(world, mob, player, dt, random) {
  const type = mobTypes[mob.kind];
  const animal = mobGroup(mob.kind) === 'animal';
  mob.flash = Math.max(0, mob.flash - dt);
  mob.cooldown = Math.max(0, mob.cooldown - dt);
  if (player && animal && mob.flee > 0) {
    mob.flee = Math.max(0, mob.flee - dt);
    const angle = Math.atan2(mob.y - player.y, mob.x - player.x);
    if (!move(world, mob, angle, type.speed * dt)) {
      move(world, mob, angle + (random() < 0.5 ? -1 : 1) * Math.PI / 2, type.speed * dt);
    }
    return;
  }
  mob.flee = Math.max(0, mob.flee - dt);
  const separation = player && !animal ? Math.sqrt(distanceSquared(mob, player)) : Infinity;
  if (separation < settings.enemy.aggro) {
    const angle = Math.atan2(player.y - mob.y, player.x - mob.x);
    move(world, mob, angle, Math.max(0, Math.min(type.speed * dt, separation - settings.enemy.reach)));
    return;
  }
  if (!animal && residentInReach(world, mob)) return;
  mob.turnIn -= dt;
  if (mob.turnIn <= 0) {
    mob.angle = random() * angleLimit;
    if (!animal && world.centers) {
      const center = world.centers.find(center => distanceSquared(mob, center) < config.wander.centerDistance ** 2);
      if (center && random() < config.wander.turnAwayChance) {
        const outward = Math.atan2(mob.y - center.y, mob.x - center.x);
        mob.angle = (outward + (random() - 0.5) * Math.PI + angleLimit) % angleLimit;
      }
    }
    mob.turnIn = config.wander.minSeconds + random() * config.wander.extraSeconds;
  }
  if (!move(world, mob, mob.angle, type.speed * config.wander.speedFactor * dt)) mob.turnIn = 0;
}

export function moveNearbyMobs(world, player, dt, random = Math.random) {
  const range = config.nearDistance;
  for (const mob of [...mobsIn(world, player.x - range, player.y - range, player.x + range, player.y + range)]) {
    if (distanceSquared(mob, player) <= range ** 2) moveMob(world, mob, player, dt, random);
  }
}

function residentCombat(world) {
  const rule = config.resident;
  for (const chunk of world.chunks) {
    for (const contact of chunk.residents) {
      const { resident, city, nation } = contact;
      resident.cooldown = Math.max(0, (resident.cooldown ?? 0) - tickSeconds);
      let nearest;
      let closest = rule.reach ** 2;
      for (const enemy of mobsIn(world, contact.x - rule.reach, contact.y - rule.reach,
        contact.x + rule.reach, contact.y + rule.reach)) {
        if (mobGroup(enemy.kind) !== 'enemy') continue;
        const separation = distanceSquared(contact, enemy);
        if (separation <= closest) {
          nearest = enemy;
          closest = separation;
        }
      }
      if (!nearest) {
        if (resident.hp !== undefined) resident.hp = Math.min(rule.hp, resident.hp + rule.recoveryPerSecond * tickSeconds);
        continue;
      }
      const type = mobTypes[nearest.kind];
      if (!resident.cooldown) {
        nearest.hp -= physicalDamage(rule.attack, type.defense, 1);
        nearest.flash = 0.18;
        resident.cooldown = rule.interval;
        if (nearest.hp <= 0) {
          removeMob(world, nearest);
          continue;
        }
      }
      if (!nearest.cooldown) {
        resident.hp = Math.max(0, (resident.hp ?? rule.hp) - physicalDamage(type.damage, rule.defense, 1));
        nearest.cooldown = type.attackDelay;
        if (!resident.hp) removeResident(nation, city, resident, world.minute);
      }
    }
  }
}

export function advanceMobWorld(world, nations, toMinute, player = null, random = Math.random, settleShops) {
  indexSettlement(world, nations);
  if (!world.tick) {
    indexResidents(world, nations);
    populate(world, player, random, true);
    world.tick = 1;
  }
  while (world.minute + config.tickMinutes <= toMinute) {
    world.minute += config.tickMinutes;
    advanceNations(nations, world.minute, false, settleShops);
    indexSettlement(world, nations);
    indexResidents(world, nations);
    for (const mob of world.mobs.values()) {
      if (!player || distanceSquared(mob, player) > config.nearDistance ** 2) moveMob(world, mob, null, tickSeconds, random);
    }
    residentCombat(world);
    if (nations.nations.some(nation => nation.nextMinute === world.minute)) {
      advanceNations(nations, world.minute, true, settleShops);
    }
    if (++world.tick % config.spawnEveryTicks === 0) {
      populate(world, player, random, false);
    }
  }
  advanceNations(nations, toMinute, false, settleShops);
}
