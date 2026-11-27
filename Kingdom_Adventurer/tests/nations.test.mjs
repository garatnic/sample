import test from 'node:test';
import assert from 'node:assert/strict';
import { areas, makeSave, restoreSave } from '../game/src/save-data.js?v=35';
import { buyItem, startingShopGold } from '../game/src/shop.js?v=35';
import { createEncounters } from '../game/src/combat.js?v=35';
import { createSkills } from '../game/src/skills.js?v=32';
import { createTrees } from '../game/src/trees.js?v=28';
import { refreshGuild } from '../game/src/quests.js?v=27';
import { settings } from '../game/src/settings.js?v=34';
import { nationSettings as config } from '../game/src/nation-settings.js?v=34';
import { nationLayouts } from '../game/src/nation-layout.js?v=35';
import { buildings, field, guildDoors, inTown, innDoors, movePlayer, shopDoors, start, terrainAt } from '../game/src/world.js?v=35';
import { firstMinuteOfDay, gameDay, nextMorningMinute } from '../game/src/clock.js?v=34';
import { advanceNations, capacity, createNationSimulation, modeFor, residentPosition, settlementBuildings } from '../game/src/nation-simulation.js?v=35';
import { captureNations, restoreNations } from '../game/src/nation-save.js?v=35';

const count = (city, kind) => city.buildings.filter(b => b.kind === kind).length;
const copy = state => JSON.parse(JSON.stringify(captureNations(state)));

test('NATION-01: expansion, accessible national centers, initial placements and housing', () => {
  assert.deepEqual([field.width / settings.tile, field.height / settings.tile], [256, 256]);
  const simulation = createNationSimulation();
  assert.equal(simulation.nations.length, 2);
  const [west, east] = nationLayouts;
  assert.ok(Math.hypot(west.x - east.x, west.y - east.y) > config.nearRadius * 2);
  assert.ok(west.x + config.sourceRadius < east.x - config.sourceRadius);
  for (const nation of simulation.nations) {
    const [city] = nation.cities;
    assert.deepEqual(['center', 'warehouse', 'house'].map(kind => count(city, kind)), [1, 1, 5]);
    assert.equal(city.residents.length, 10);
    for (const person of city.residents) {
      assert.ok(city.buildings.some(b => b.id === person.homeId && b.kind === 'house'));
    }
  }
  const player = { ...start };
  function follow(x, y) {
    while (Math.hypot(x - player.x, y - player.y) > 1) {
      const dx = x - player.x, dy = y - player.y;
      const length = Math.hypot(dx, dy);
      const before = { ...player };
      movePlayer(player, dx / length, dy / length, Math.min(5, length) / settings.player.speed,
        field, settlementBuildings(simulation));
      assert.notDeepEqual(player, before, 'route must remain open');
    }
  }
  follow(west.x, west.y);
  follow(west.center.door.x, west.center.door.y);
  follow(west.x, west.y);
  follow(west.x, 2400);
  follow(east.x, 2400);
  follow(east.x, east.y);
  follow(east.center.door.x, east.center.door.y);
  assert.equal(modeFor(east, player), 'near');
  assert.equal(modeFor(east, start), 'far');
  const before = { ...player };
  movePlayer(player, 0, -1, 0.2, field, settlementBuildings(simulation));
  assert.deepEqual(player, before, 'government building blocks entrance into the footprint');
});

test('NATION-02: long-run quotas, capacity, parcels and exact event batching', () => {
  const jumped = createNationSimulation();
  const stepped = createNationSimulation();
  const horizon = 144_000;
  advanceNations(jumped, horizon);
  for (let minute = 1; minute <= horizon; minute += 559) advanceNations(stepped, minute);
  advanceNations(stepped, horizon);
  assert.deepEqual(copy(jumped), copy(stepped));
  for (const nation of jumped.nations) {
    const [city] = nation.cities;
    assert.equal(count(city, 'house'), 20);
    assert.equal(city.residents.length, 40);
    assert.equal(count(city, 'warehouse'), config.warehouse.max);
    assert.equal(new Set(city.residents.map(p => p.id)).size, 40);
    assert.ok(nation.stock.food > 0);
    assert.ok(nation.stock.wood + nation.stock.food <= capacity(nation));
    for (const [index, a] of city.buildings.entries()) {
      assert.notEqual(terrainAt(a.x + a.w / 2, a.y + a.h / 2), 'road');
      for (const b of city.buildings.slice(index + 1)) {
        assert.ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
      }
    }
  }
});

test('NATION-03: midnight and lodging advance once per elapsed day, including food shortages', () => {
  const midnight = firstMinuteOfDay(gameDay(0) + 1);
  const simulation = createNationSimulation(midnight - 1);
  const [nation, hungry] = simulation.nations;
  nation.stock.food = 15;
  hungry.stock.food = 1;
  advanceNations(simulation, midnight);
  assert.equal(nation.stock.food, 5);
  assert.equal(hungry.stock.food, 0);
  assert.equal(hungry.cities[0].residents.length, 10);
  advanceNations(simulation, midnight);
  assert.equal(nation.stock.food, 5);
  const morning = nextMorningMinute(midnight);
  advanceNations(simulation, morning);
  assert.equal(nation.lastDay, gameDay(morning));
  assert.ok(hungry.stock.food > 0);
});

test('NATION-04: reserved cargo, capacity recovery and distant city arrival survive save/load', () => {
  const original = createNationSimulation();
  let snapshot;
  for (let time = 1; time < 200; time++) {
    advanceNations(original, time);
    const city = original.nations[1].cities[0];
    if (city.project && city.residents.some(p => p.carrying)) {
      snapshot = copy(original);
      break;
    }
  }
  assert.ok(snapshot);
  const restored = restoreNations(snapshot, snapshot.minute);
  assert.deepEqual(copy(restored), snapshot);
  const [city] = restored.nations[1].cities;
  assert.equal(modeFor(city, start), 'far');
  assert.equal(modeFor(city, city), 'near');
  for (const person of city.residents) {
    const point = residentPosition(city, person, restored.minute + 0.5);
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
  }
  advanceNations(original, 2000);
  advanceNations(restored, 2000);
  assert.deepEqual(copy(restored), copy(original));

  const full = createNationSimulation();
  full.nations[0].stock = { wood: 0, food: 120 };
  advanceNations(full, 10_000);
  const [nation] = full.nations;
  assert.ok(count(nation.cities[0], 'warehouse') > 1);
  assert.equal(nation.cities[0].residents.length, 40);
  assert.ok(nation.stock.wood + nation.stock.food <= capacity(nation));
  snapshot.nations[1].stock.wood = 1000;
  assert.throws(() => restoreNations(snapshot, snapshot.minute), /Invalid nation simulation/);
});

test('NATION-05: all city facilities work independently and version 3 saves migrate', () => {
  assert.equal(buildings.length, 8);
  assert.equal(inTown({ x: 1112, y: 800 }), false);
  assert.deepEqual(start, nationLayouts[0].arrival);
  for (const city of nationLayouts) {
    assert.deepEqual(city.facilities.map(b => b.kind), ['inn', 'goods-shop', 'weapon-shop', 'guild']);
    for (const facility of city.facilities) {
      assert.ok(inTown(facility.door));
      const player = { ...facility.door };
      movePlayer(player, 0, -1, 0.2, field);
      assert.deepEqual(player, facility.door);
    }
  }
  assert.equal(Object.keys(innDoors).length, 2);
  const state = {
    area: field, nations: createNationSimulation(), gold: 50, guilds: new Map(),
    player: { ...start, level: 1, experience: 0, hp: 100, mp: 100, weaponId: null, cooldown: 0,
      pendingPoison: 0, inventory: new Map(), armor: new Map(), skills: createSkills() },
    resources: createTrees(gameDay(0)),
    shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, startingShopGold])),
  };
  const easternShop = nationLayouts[1].facilities.find(b => b.kind === 'weapon-shop').id;
  assert.ok(buyItem(state, easternShop, 'iron-dagger'));
  assert.equal(state.shopGold[easternShop], 110);
  assert.equal(state.shopGold['weapon-shop'], 100);
  for (const id of Object.keys(guildDoors)) refreshGuild(state, id, gameDay(0));
  assert.equal(state.guilds.size, 2);
  const areaStates = new Map(areas.map(area => [area, { encounters: createEncounters(area.spawns), lootDrops: [] }]));
  const current = makeSave(state, areaStates, 0);
  assert.deepEqual(restoreSave(current).shopGold, state.shopGold);

  current.version = 3;
  current.guilds = current.guilds.filter(([id]) => id === 'house-southwest');
  current.shopGold = { 'goods-shop': 63, 'weapon-shop': 105 };
  const facility = nationLayouts[1].facilities[0];
  Object.assign(current.player, { x: facility.x + 15, y: facility.y + 15 });
  const restored = restoreSave(current);
  assert.equal(restored.shopGold['goods-shop'], 63);
  assert.equal(restored.shopGold['weapon-shop'], 105);
  assert.equal(restored.shopGold[easternShop], 100);
  assert.ok(restored.guilds.has('house-southwest'));
  assert.deepEqual({ x: restored.player.x, y: restored.player.y }, facility.door);
  assert.deepEqual(copy(restored.nations), copy(state.nations));
});
