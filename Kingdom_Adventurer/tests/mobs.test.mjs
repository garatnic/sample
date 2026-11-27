import assert from 'node:assert/strict';
import test from 'node:test';
import { createSkills } from '../game/src/skills.js?v=32';
import { nextMorningMinute } from '../game/src/clock.js?v=34';
import { createEncounters } from '../game/src/combat.js?v=47';
import { chunkAt, advanceMobWorld, createMobWorld, mobGroup, removeMob } from '../game/src/mob-world.js?v=47';
import { mobSettings } from '../game/src/mob-settings.js?v=41';
import { advanceNations, createNationSimulation, residentPosition } from '../game/src/nation-simulation.js?v=47';
import { areas, makeSave, restoreSave } from '../game/src/save-data.js?v=47';
import { mobTypes } from '../game/src/settings.js?v=39';
import { cave, field, inTown, legacyFieldSpawns, shopDoors, start, terrainAt } from '../game/src/world.js?v=47';

function rng(seed = 28) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function animalAt(id, kind, x, y) {
  const maxHp = mobTypes[kind].maxHp;
  return { id: `field-${id}`, kind, x, y, hp: maxHp, maxHp, angle: 0, turnIn: 6,
    cooldown: 0, flash: 0, flee: 0, hunted: false };
}

function gameState(nations, mobWorld) {
  return { nations, mobWorld, area: cave, gold: 30, harvest: null, guilds: new Map(),
    shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 100])),
    player: { ...cave.caveArrival, level: 1, hp: 100, mp: 100, experience: 0, cooldown: 0, pendingPoison: 0,
      skills: createSkills(), inventory: new Map(), armor: new Map(), weaponId: null } };
}

test('MOB-01: chunk borders, initial density, terrain and occupied spawn tiles', () => {
  const nations = createNationSimulation();
  const world = createMobWorld(0);
  advanceMobWorld(world, nations, 0, start, rng());
  assert.equal(world.chunks.length, 256);
  assert.equal(world.chunks.filter(chunk => chunk.protected).length, 18);
  assert.equal(world.chunks.reduce((sum, chunk) => sum + chunk.tiles.length, 0), 65536);
  assert.notEqual(chunkAt(world, 511, 1).id, chunkAt(world, 512, 1).id);
  assert.equal(chunkAt(world, 8192, 0), undefined);
  assert.equal(world.counts.animal, 1024);
  assert.ok(world.counts.enemy >= 478 && world.counts.enemy <= 480);
  assert.ok(world.protectedCounts.enemy <= 4);
  assert.equal(new Set([...world.mobs.values()].map(mob => `${mob.x}:${mob.y}`)).size, world.mobs.size);
  for (const mob of world.mobs.values()) {
    const chunk = chunkAt(world, mob.x, mob.y);
    assert.equal(mob.chunkId, chunk.id);
    assert.ok(chunk.mobs[mobGroup(mob.kind)].has(mob));
    assert.ok(mobSettings.terrain[terrainAt(mob.x, mob.y)][mobGroup(mob.kind)][mob.kind] > 0);
    assert.ok(chunk.blockers.every(b => mob.x < b.x || mob.x > b.x + b.w || mob.y < b.y || mob.y > b.y + b.h));
  }
});

test('MOB-02: offscreen movement crosses chunks and carries a hostile into town', () => {
  const nations = createNationSimulation();
  const animal = animalAt(1, 'rabbit', 510, 500);
  let edge = start.x;
  while (inTown({ x: edge, y: 2100 })) edge--;
  const enemy = animalAt(2, 'wolf', edge - 1, 2100);
  const world = createMobWorld(0, { tick: 1, individuals: [animal, enemy], nextId: 3 });
  advanceMobWorld(world, nations, 0.4, null, rng());
  assert.equal(animal.chunkId, chunkAt(world, 520, 500).id);
  assert.equal(world.chunks[0].mobs.animal.size, 0);
  assert.ok(inTown(enemy));
  assert.equal(world.mobs.get(enemy.id), enemy);
});

test('MOB-03: resident combat in an unloaded region persists through save and releases claims', () => {
  const nations = createNationSimulation();
  const nation = nations.nations[0];
  const city = nation.cities[0];
  const resident = city.residents[0];
  advanceNations(nations, 0.1);
  const contact = residentPosition(city, resident, 0.4);
  const world = createMobWorld(0, { tick: 1, individuals: [animalAt(1, 'wolf', contact.x, contact.y)], nextId: 2 });
  advanceMobWorld(world, nations, 0.4, null, rng());
  assert.equal(resident.hp, 41);
  const enemy = world.mobs.get('field-1');
  assert.ok(enemy.hp < enemy.maxHp);
  resident.hp = 1;
  resident.cooldown = 1;
  enemy.cooldown = 0;
  const secondContact = residentPosition(city, resident, 0.8);
  assert.equal(chunkAt(world, secondContact.x, secondContact.y).id, enemy.chunkId);
  Object.assign(enemy, secondContact === resident ? { x: resident.x, y: resident.y } : secondContact);
  advanceMobWorld(world, nations, 0.8, null, rng());
  assert.ok(!city.residents.includes(resident));
  assert.ok(city.buildings.some(b => b.id === resident.homeId));
  const areaStates = new Map(areas.map(area => [area, { encounters: createEncounters(area.spawns), lootDrops: [] }]));
  const state = gameState(nations, world);
  const data = makeSave(state, areaStates, nations.minute);
  const restored = restoreSave(JSON.parse(JSON.stringify(data)));
  assert.deepEqual(makeSave(restored, restored.areaStates, restored.clock), data);
  assert.ok(restored.mobWorld.chunks[enemy.chunkId].mobs.enemy.has(restored.mobWorld.mobs.get(enemy.id)));
});

test('MOB-04: overnight replenishment remains finite, and old cave and field individuals migrate', () => {
  const nations = createNationSimulation();
  const world = createMobWorld(0);
  const random = rng();
  advanceMobWorld(world, nations, 0, start, random);
  for (const mob of [...world.mobs.values()].filter(mob => mobGroup(mob.kind) === 'enemy').slice(0, 60)) removeMob(world, mob);
  const result = world.counts.enemy;
  advanceMobWorld(world, nations, nextMorningMinute(0), null, random);
  assert.ok(world.counts.enemy > result);
  for (const group of ['animal', 'enemy']) {
    const count = world.chunks.reduce((sum, chunk) => sum + chunk.mobs[group].size, 0);
    assert.equal(count, world.counts[group]);
    assert.ok(count <= world.limits[group].maximum);
  }

  const areaStates = new Map(areas.map(area => [area, { encounters: createEncounters(area.spawns), lootDrops: [] }]));
  const old = makeSave(gameState(createNationSimulation(), createMobWorld(0)), areaStates, 0);
  old.version = 9;
  delete old.mobs;
  old.areas[0].encounters = legacyFieldSpawns.map(({ id, x, y }, index) => ({
    id, remaining: 0, generation: index === 8 ? 1 : 0,
    enemy: index === 8 ? { x, y, hp: 8, cooldown: 0, flee: 2, hunted: true } : null,
  }));
  old.areas[1].encounters[0] = { id: cave.spawns[0].id, remaining: 5, generation: 2, enemy: null };
  const restored = restoreSave(old);
  const deer = restored.mobWorld.mobs.get('field-1');
  assert.deepEqual([deer.kind, deer.hp, deer.flee, deer.hunted], ['deer', 8, 2, true]);
  assert.equal(restored.areaStates.get(cave).encounters[0].remaining, 5);
  assert.equal(restored.areaStates.get(field).encounters.length, 0);
});
