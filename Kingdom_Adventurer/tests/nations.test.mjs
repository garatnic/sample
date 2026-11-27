import test from 'node:test';
import assert from 'node:assert/strict';
import { updateTrees } from '../game/src/trees.js?v=37';
import { areas, makeSave, restoreSave } from '../game/src/save-data.js?v=46';
import { buyItem, createShopStock, sellItem, settleShops, startingShopGold } from '../game/src/shop.js?v=45';
import { createEncounters } from '../game/src/combat.js?v=43';
import { createSkills } from '../game/src/skills.js?v=32';
import { refreshGuild } from '../game/src/quests.js?v=39';
import { settings } from '../game/src/settings.js?v=39';
import { nationSettings as config } from '../game/src/nation-settings.js?v=45';
import { nationLayouts } from '../game/src/nation-layout.js?v=35';
import { buildings, field, guildDoors, inTown, innDoors, legacyFieldSpawns, movePlayer, shopDoors, start, terrainAt } from '../game/src/world.js?v=41';
import { firstMinuteOfDay, gameDay, nextMorningMinute } from '../game/src/clock.js?v=34';
import { advanceNations, capacity, createNationSimulation, modeFor, residentPosition, settlementBuildings } from '../game/src/nation-simulation.js?v=45';
import { captureNations, restoreNations } from '../game/src/nation-save.js?v=46';

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
    harvest: null,
    shopStock: createShopStock(),
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
  current.areas[0].encounters = legacyFieldSpawns.slice(0, 8).map(({ id }) => ({ id, enemy: null, remaining: 0, generation: 0 }));
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
  for (const [i, nation] of restored.nations.nations.entries()) {
    assert.deepEqual(nation.stock, state.nations.nations[i].stock);
    assert.equal(nation.cities[0].residents.length, state.nations.nations[i].cities[0].residents.length);
    assert.equal(nation.treasury, config.initialTreasury);
  }
});

test('NATION-06: player and residents compete for the same fruit and timber', () => {
  const nations = createNationSimulation();
  const nation = nations.nations[0];
  nation.stock.food = 0;
  advanceNations(nations, 1);
  const city = nation.cities[0];
  const worker = city.residents.find(person => person.action === 'gatherFood');
  const fruit = city.sources.find(source => source.id === worker.targetId);
  const state = { nations, player: { ...fruit, inventory: new Map() }, harvest: null };
  assert.equal(updateTrees(state, 0.6), null);
  assert.deepEqual(updateTrees(state, 0.4), { itemId: 'apple', quantity: 1 });
  assert.equal(fruit.remaining, 7);
  const partial = restoreNations(copy(nations), 1);
  assert.equal(partial.nations[0].cities[0].sources.find(s => s.id === fruit.id).remaining, 7);
  for (let i = 2; i <= 8; i++) {
    assert.deepEqual(updateTrees(state, 1), { itemId: 'apple', quantity: 1 });
    assert.equal(state.player.inventory.get('apple'), i);
    assert.equal(fruit.remaining, 8 - i);
  }
  assert.equal(fruit.readyAt, 26);
  assert.equal(updateTrees(state, 1), null);
  const restored = restoreNations(copy(nations), 1);
  assert.equal(restored.nations[0].cities[0].sources.find(s => s.id === fruit.id).readyAt, 26);
  advanceNations(nations, worker.task.end);
  assert.equal(worker.carrying, null, 'a resident cannot deliver fruit already picked by the player');
  assert.equal(fruit.readyAt, 26);

  const timber = city.sources.find(s => s.kind === 'wood' && s.readyAt <= nations.minute);
  Object.assign(state.player, timber);
  assert.equal(updateTrees(state, 1), null);
  assert.deepEqual(updateTrees(state, 1), { itemId: 'wood', quantity: 1 });
  assert.equal(state.player.inventory.get('wood'), 1);
  assert.equal(timber.remaining, 7);
  for (let i = 2; i <= 8; i++) assert.deepEqual(updateTrees(state, 2), { itemId: 'wood', quantity: 1 });
  assert.equal(timber.readyAt, nations.minute + 30);
  assert.equal(updateTrees(state, 2), null);

  const separate = createNationSimulation();
  const other = separate.nations[0];
  other.stock.food = 0;
  advanceNations(separate, 1);
  const otherCity = other.cities[0];
  const picker = otherCity.residents.find(p => p.action === 'gatherFood');
  const hungryTree = otherCity.sources.find(source => source.id === picker.targetId);
  const secondPlayer = { nations: separate, player: { ...hungryTree, inventory: new Map() }, harvest: null };
  assert.deepEqual(updateTrees(secondPlayer, 1), { itemId: 'apple', quantity: 1 });
  const arrival = picker.task.startWork;
  const timberWorker = otherCity.residents.find(person => person.action === 'gatherWood');
  if (timberWorker) assert.ok(Math.abs(timberWorker.task.end - timberWorker.task.startWork - 1.6) < 1e-8);
  advanceNations(separate, arrival + 0.79);
  assert.equal(picker.carrying, null);
  assert.equal(hungryTree.remaining, 7);
  for (let n = 1; n <= 7; n++) {
    advanceNations(separate, picker.task.end);
    assert.deepEqual(picker.carrying, { kind: 'food', quantity: n });
    assert.equal(hungryTree.remaining, 7 - n);
    assert.equal(picker.action, n < 7 ? 'gatherFood' : 'haul');
    assert.deepEqual(copy(restoreNations(copy(separate), separate.minute)), copy(separate));
  }
  assert.deepEqual(copy(restoreNations(copy(separate), separate.minute)), copy(separate));
  assert.equal(updateTrees(secondPlayer, 1), null, 'the resident already picked the fruit');
  const regrowth = hungryTree.readyAt;
  advanceNations(separate, regrowth);
  assert.deepEqual(updateTrees(secondPlayer, 1), { itemId: 'apple', quantity: 1 });
});

test('NATION-07: shop stock, overnight settlements, and saved inventories', () => {
  const player = { ...start, level: 1, experience: 0, hp: 100, mp: 100, weaponId: null, cooldown: 0,
    pendingPoison: 0, inventory: new Map([['apple', 3]]), armor: new Map(), skills: createSkills() };
  const state = { player, area: field, gold: 100, guilds: new Map(), harvest: null, shopStock: createShopStock(),
    shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, startingShopGold])) };
  assert.equal(buyItem(state, 'weapon-shop', 'iron-dagger'), true);
  assert.equal(buyItem(state, 'weapon-shop', 'iron-dagger'), false);
  assert.equal(state.shopStock['weapon-shop'].has('iron-dagger'), false);
  for (let i = 0; i < 3; i++) assert.equal(sellItem(state, 'goods-shop', 'apple'), true);
  assert.equal(state.shopStock['goods-shop'].get('apple'), 3);
  assert.equal(buyItem(state, 'goods-shop', 'apple'), true);
  assert.equal(state.shopStock['goods-shop'].get('apple'), 2);

  const areaStates = new Map(areas.map(area => [area, { encounters: createEncounters(area.spawns), lootDrops: [] }]));
  const save = makeSave(state, areaStates, 0);
  const reloaded = restoreSave(JSON.parse(JSON.stringify(save)));
  assert.deepEqual(reloaded.shopStock, state.shopStock);
  const old = structuredClone(save);
  old.version = 10;
  delete old.shopStock;
  const legacy = restoreSave(old);
  assert.deepEqual(legacy.shopStock, createShopStock());
  assert.deepEqual(legacy.shopGold, state.shopGold);
  const damaged = structuredClone(save);
  damaged.shopStock['goods-shop'].push(['apple', 0]);
  assert.throws(() => restoreSave(damaged));

  const nation = reloaded.nations.nations[0];
  const settle = (owner, day, finance) => settleShops(reloaded, owner, day, finance);
  advanceNations(reloaded.nations, firstMinuteOfDay(gameDay(0) + 1), false, settle);
  assert.equal(reloaded.shopGold['weapon-shop'], 105);
  assert.equal(reloaded.shopGold['goods-shop'], 103);
  assert.deepEqual(reloaded.shopStock, createShopStock());
  assert.deepEqual([nation.finance.bought, nation.finance.supplied], [4, 5]);
  const savedBalance = nation.treasury;
  advanceNations(reloaded.nations, reloaded.nations.minute, true, settle);
  assert.equal(nation.treasury, savedBalance);

  // Insufficient cash leaves shortages and preserves the store balance.
  buyItem(reloaded, 'weapon-shop', 'iron-dagger');
  reloaded.shopGold['weapon-shop'] = 1;
  advanceNations(reloaded.nations, firstMinuteOfDay(gameDay(0) + 2), false, settle);
  assert.equal(reloaded.shopGold['weapon-shop'], 1);
  assert.equal(reloaded.shopStock['weapon-shop'].has('iron-dagger'), false);
  const overnightSave = makeSave({ ...reloaded, mobWorld: null }, areaStates, reloaded.nations.minute);
  const reload = restoreSave(overnightSave);
  assert.equal(reload.shopGold['weapon-shop'], 1);
  assert.equal(reload.shopStock['weapon-shop'].has('iron-dagger'), false);
});
