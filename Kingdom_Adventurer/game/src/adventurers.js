import { createSkills } from './skills.js?v=49';
import { maxHealth } from './growth.js?v=49';
import { maxMp } from './consumables.js?v=53';
import { nextMorningMinute } from './clock.js?v=34';
import { settings, animalTypes, mobTypes } from './settings.js?v=49';
import { equipItem, items, defenseRating } from './equipment.js?v=53';
import { field, movePlayer } from './world.js?v=55';
import { nationLayouts } from './nation-layout.js?v=53';
import { mobsIn, removeMob } from './mob-world.js?v=56';
import { hitMob, physicalDamage } from './combat.js?v=56';
import { dropLoot, takeDrop } from './loot.js?v=56';
import { acceptsItem, buyItem, salePrice, sellItem, sellableQuantity, shopInventory } from './shop.js?v=55';

const range = 520;
const travel = new WeakMap();
export const weaponClasses = ['one-handed', 'two-handed'];
const starters = ['iron-dagger', 'iron-hammer'];
const towns = nationLayouts.map(layout => ({
  spine: layout.x,
  inn: layout.facilities.find(b => b.kind === 'inn'),
  goods: layout.facilities.find(b => b.kind === 'goods-shop'),
  gear: layout.facilities.find(b => b.kind === 'weapon-shop'),
}));

function spawn(id, weaponClass, town) {
  const weaponId = starters[weaponClasses.indexOf(weaponClass)];
  const skills = createSkills();
  skills.get(weaponClass).value = 25;
  return { id, weaponClass, ...town.inn.door, innId: town.inn.id, sleepUntil: null,
    x: town.inn.door.x + (weaponClass === 'one-handed' ? -12 : 12),
    hp: maxHealth(1), mp: maxMp, level: 1, experience: 0, pendingPoison: 0, cooldown: 0,
    weaponId, inventory: new Map([[weaponId, 1]]), armor: new Map(), skills,
    gold: settings.currency.startingGold, destination: null };
}

export function createAdventurers() {
  const individuals = towns.flatMap((town, i) => weaponClasses.map((kind, j) =>
    spawn(i * weaponClasses.length + j + 1, kind, town)));
  return { individuals, nextId: individuals.length + 1 };
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function nearest(actor, candidates, limit = Infinity) {
  let chosen;
  for (const target of candidates) {
    const gap = distance(actor, target);
    if (gap < limit) {
      limit = gap;
      chosen = target;
    }
  }
  return chosen;
}

function walkStep(actor, goal, dt, blockers) {
  const length = distance(actor, goal);
  if (length <= 1) return;
  const angle = Math.atan2(goal.y - actor.y, goal.x - actor.x);
  const step = Math.min(dt, length / settings.player.speed);
  const { x, y } = actor;
  for (const offset of [0, Math.PI / 4, -Math.PI / 4, Math.PI / 2, -Math.PI / 2]) {
    movePlayer(actor, Math.cos(angle + offset), Math.sin(angle + offset), step, field, blockers);
    if (actor.x !== x || actor.y !== y) return;
  }
}

export function moveAdventurers(state, loot, dt, blockers) {
  for (const actor of state.adventurers.individuals) {
    const intent = travel.get(actor);
    if (!intent || actor.sleepUntil !== null) continue;
    const { target, mob, drop, spine } = intent;
    if ((mob && state.mobWorld.mobs.get(target.id) !== target) || (drop && !loot.includes(target))) continue;
    const waypoint = spine !== undefined && actor.y < target.y - 10
      ? { x: spine, y: Math.abs(actor.x - spine) > 6 ? actor.y : target.y }
      : target;
    const steps = Math.ceil(dt * settings.player.speed / settings.player.radius);
    for (let step = 0; step < steps; step++) walkStep(actor, waypoint, dt / steps, blockers);
  }
}

function upgrade(actor, id) {
  const item = items.get(id);
  if (!item.slot) return false;
  if (item.slot === 'weapon') {
    return item.skill === actor.weaponClass && item.bonus > (items.get(actor.weaponId)?.bonus ?? 0);
  }
  return item.defense > (items.get(actor.armor.get(item.slot))?.defense ?? 0);
}

function market(state, actor, shop, buying = false) {
  const customer = { ...state, player: actor, gold: actor.gold };
  const stock = shopInventory(customer, shop.id);
  if (buying) {
    for (const id of stock.keys()) {
      if (upgrade(actor, id) && actor.gold - settings.inn.price >= items.get(id).price
        && buyItem(customer, shop.id, id)) {
        equipItem(actor, id);
        break;
      }
    }
  }
  for (const id of actor.inventory.keys()) {
    while (sellItem(customer, shop.id, id)) {}
  }
  actor.gold = customer.gold;
}

function nearbyThreats(world, actor) {
  return [...mobsIn(world, actor.x - range, actor.y - range, actor.x + range, actor.y + range)];
}

function fight(actor, enemy, world, loot) {
  const gap = distance(actor, enemy);
  if (gap <= items.get(actor.weaponId).range && actor.cooldown === 0) {
    hitMob(actor, enemy);
    if (enemy.hp <= 0) {
      removeMob(world, enemy);
      dropLoot({ lootDrops: loot }, enemy, mobTypes[enemy.kind]);
    }
  } else {
    travel.set(actor, { target: enemy, mob: true });
  }
}

export function advanceAdventurers(state, loot, minute, dt, random = Math.random) {
  const group = state.adventurers;
  const world = state.mobWorld;
  for (const [index, actor] of group.individuals.entries()) {
    travel.delete(actor);
    if (actor.sleepUntil !== null) {
      if (minute < actor.sleepUntil) continue;
      actor.sleepUntil = null;
      actor.hp = maxHealth(actor.level);
    }
    actor.cooldown = Math.max(0, actor.cooldown - dt);
    const nearby = nearbyThreats(world, actor);
    const hostiles = nearby.filter(mob => !animalTypes[mob.kind]);
    for (const enemy of hostiles) {
      if (enemy.cooldown || distance(actor, enemy) > settings.enemy.reach) continue;
      const type = mobTypes[enemy.kind];
      actor.hp = Math.max(0, actor.hp - physicalDamage(type.damage, defenseRating(actor), settings.difficulty.enemyDamageMultiplier));
      enemy.cooldown = type.attackDelay;
      if (!actor.hp) break;
    }
    if (!actor.hp) {
      loot.push({ x: actor.x, y: actor.y, materials: [], gold: actor.gold,
        contents: [...actor.inventory] });
      const town = towns[Math.floor(random() * towns.length)];
      group.individuals[index] = spawn(group.nextId++, actor.weaponClass, town);
      continue;
    }
    const injured = actor.hp <= maxHealth(actor.level) * 0.55;
    const nearbyEnemies = hostiles.filter(mob => distance(actor, mob) < 80);
    const retreat = injured || nearbyEnemies.length >= 3;
    const town = (retreat && towns.find(site => site.inn.id === actor.innId))
      || towns.find(site => site.inn.door === nearest(actor, towns.map(entry => entry.inn.door)));
    if (retreat && actor.gold >= settings.inn.price) {
      if (distance(actor, town.inn.door) <= 12) {
        actor.gold -= settings.inn.price;
        actor.innId = town.inn.id;
        actor.sleepUntil = nextMorningMinute(minute);
        Object.assign(actor, town.inn.door);
      } else {
        travel.set(actor, { target: town.inn.door, spine: town.spine });
      }
      continue;
    }
    if (nearbyEnemies.length >= 3) {
      travel.set(actor, { target: town.inn.door, spine: town.spine });
      continue;
    }
    const drop = nearest(actor, loot.filter(entry => !entry.playerClaim), range);
    if (drop) {
      if (distance(actor, drop) <= settings.currency.pickupRadius) {
        actor.gold += takeDrop(actor.inventory, drop);
        loot.splice(loot.indexOf(drop), 1);
        for (const id of actor.inventory.keys()) if (upgrade(actor, id)) equipItem(actor, id);
      } else {
        travel.set(actor, { target: drop, drop: true });
      }
      continue;
    }
    const shop = [town.goods, town.gear].find(location =>
      [...actor.inventory].some(([id]) => {
        const item = items.get(id);
        return acceptsItem(location.id, item)
          && sellableQuantity(actor, id) > 0 && state.shopGold[location.id] >= salePrice(item);
      }) || location === town.gear && [...state.shopStock[location.id].keys()].some(id =>
        upgrade(actor, id) && actor.gold - settings.inn.price >= items.get(id).price));
    if (shop && !nearbyEnemies.length) {
      if (distance(actor, shop.door) <= 12) market(state, actor, shop, shop === town.gear);
      else travel.set(actor, { target: shop.door, spine: town.spine });
      continue;
    }
    const target = nearest(actor, nearby, range);
    if (target) {
      fight(actor, target, world, loot);
      continue;
    }
    if (!actor.destination || distance(actor, actor.destination) < 32) {
      const angle = random() * 2 * Math.PI;
      const length = 280 + random() * 650;
      actor.destination = {
        x: Math.max(16, Math.min(field.width - 16, actor.x + Math.cos(angle) * length)),
        y: Math.max(16, Math.min(field.height - 16, actor.y + Math.sin(angle) * length)),
      };
      actor.innId = town.inn.id;
    }
    travel.set(actor, { target: actor.destination });
  }
}
