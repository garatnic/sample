import test from 'node:test';
import assert from 'node:assert/strict';
import { firstMinuteOfDay, gameDay, nextMorningMinute } from '../game/src/clock.js?v=34';
import { items } from '../game/src/equipment.js?v=39';
import { start, shopDoors } from '../game/src/world.js?v=49';
import { nationLayouts } from '../game/src/nation-layout.js?v=49';
import { createShopStock, salePrice, settleShops, sellItem, buyItem } from '../game/src/shop.js?v=49';
import { captureNations, restoreNations } from '../game/src/nation-save.js?v=49';
import { advanceNations, createNationSimulation, refreshNationDemand, removeResident, residentPosition } from '../game/src/nation-simulation.js?v=49';
import { reserves, settleNationDay, storageRoom, updateNationDemand } from '../game/src/nation-economy.js?v=49';
import { advanceMobWorld, createMobWorld } from '../game/src/mob-world.js?v=49';

const midnight = firstMinuteOfDay(gameDay(0) + 1);
const makeShops = () => ({
  shopStock: createShopStock(),
  shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 100])),
});

test('ECON-01: roles, individual draws, walkable movement and low-population transitions', () => {
  const simulation = createNationSimulation();
  const [nation] = simulation.nations;
  const [city] = nation.cities;
  const food = city.residents.find(person => person.role === 'food');
  const wood = city.residents.find(person => person.role === 'wood');
  nation.stock = { food: 40, wood: 72 };
  // Build consumes real stock first. With the new active project, the remaining
  // stock meets both targets, leaving work to specialists and leisure to others.
  advanceNations(simulation, 1);
  assert.equal(nation.demand.leisure, 1);
  assert.equal(food.action, 'gatherFood');
  assert.equal(wood.action, 'gatherWood');
  const walking = city.residents.find(person => person.action === 'wander');
  assert.ok(walking.wanderUntil - walking.task.depart >= 10);
  assert.notDeepEqual(residentPosition(city, walking, 1), residentPosition(city, walking, 2));
  assert.ok(new Set(city.residents.filter(person => person.action === 'wander').map(person => person.targetId)).size > 1);
  removeResident(nation, city, food, 1);
  assert.equal(city.residents.filter(person => person.role === 'food').length, 1);
  assert.ok(city.residents.includes(wood));
  for (const person of [...city.residents].filter(person => person !== wood)) removeResident(nation, city, person, 1);
  assert.equal(wood.role, 'food');
  advanceNations(simulation, 1, true);
  removeResident(nation, city, wood, 1);
  advanceNations(simulation, 2);
  assert.equal(reserves(nation).daily.food, 0);
  assert.equal(nation.demand.leisure, 1);
});

test('ECON-02: constrained targets, daily consumption, storage claims and construction protection', () => {
  const [nation] = createNationSimulation().nations;
  const [city] = nation.cities;
  city.residents.push(...city.residents);
  const targets = reserves(nation);
  assert.deepEqual(targets.daily, { food: 20, wood: 20 });
  assert.deepEqual(targets.minimum, { food: 40, wood: 40 });
  assert.deepEqual(targets.ideal, { food: 80, wood: 112 });
  assert.deepEqual(targets.effective, { food: 44, wood: 76 });
  nation.stock = { food: 0, wood: 0 };
  assert.equal(refreshNationDemand(nation, 0).leisure, 0);
  assert.equal(reserves(nation).plans.get(city.id).kind, 'warehouse');
  nation.stock = { food: 22, wood: 38 };
  assert.equal(refreshNationDemand(nation, 0).leisure, 0.3);
  const demand = updateNationDemand(nation, { food: 22, wood: 0 }, targets);
  assert.equal(demand.labor.food, 0);
  assert.equal(storageRoom(demand, 'food'), 0);
  assert.equal(storageRoom(demand, 'wood'), 38);
  settleNationDay(nation, nation.lastDay + 1);
  assert.deepEqual(nation.stock, { food: 2, wood: 18 });
  assert.equal(nation.finance.wood, 0);
});

test('ECON-03: treasury isolation, rotation, funding limits and a balanced shop ledger', () => {
  const [nation, other] = createNationSimulation().nations;
  const state = makeShops();
  const day = gameDay(0) + 1;
  for (const shop of ['goods-shop', 'weapon-shop']) state.shopGold[shop] = 0;
  // Both stores have sellable surpluses at 10G. Only one can be bought daily.
  const goods = 'crab-shell';
  state.shopStock['goods-shop'].set(goods, 3);
  state.shopStock['weapon-shop'].set('iron-dagger', 3);
  const combined = () => nation.treasury + state.shopGold['goods-shop'] + state.shopGold['weapon-shop'];
  const first = (day % 2 === 0 ? 'goods-shop' : 'weapon-shop');
  const second = first === 'goods-shop' ? 'weapon-shop' : 'goods-shop';
  for (const [index, expected] of [first, second].entries()) {
    nation.treasury = 10;
    const before = combined();
    const finance = { bought: 0, supplied: 0 };
    const gold = state.shopGold[expected];
    settleShops(state, nation, day + index, finance);
    assert.equal(state.shopGold[expected], gold + 10);
    assert.equal(nation.treasury, 0);
    assert.equal(combined(), before);
    assert.equal(finance.bought, 10);
    assert.equal(finance.supplied, 0);
  }
  assert.equal(other.treasury, 10_000);
  const id = 'iron-sword';
  state.shopStock['weapon-shop'].delete(id);
  state.shopGold['weapon-shop'] = salePrice(items.get(id));
  const finance = { bought: 0, supplied: 0 };
  settleShops(state, nation, day, finance);
  assert.equal(nation.treasury, salePrice(items.get(id)));
  assert.equal(state.shopStock['weapon-shop'].get(id), 1);
  assert.equal(finance.supplied, nation.treasury);
});

test('ECON-04: midnight hooks, multi-day advancement, lodging time and save migration', () => {
  const simulation = createNationSimulation(midnight - 1);
  const [nation] = simulation.nations;
  for (const city of nation.cities) {
    city.residents.length = 0;
  }
  nation.stock = { food: 25, wood: 30 };
  nation.treasury = 0;
  const state = makeShops();
  const seen = [];
  const settle = (owner, day, finance) => {
    seen.push([owner.id, day]);
    settleShops(state, owner, day, finance);
  };
  const world = createMobWorld(midnight - 1);
  advanceMobWorld(world, simulation, nextMorningMinute(midnight - 1), start, () => 0.5, settle);
  assert.equal(seen.length, 2);
  assert.equal(nation.treasury, 55);
  assert.deepEqual(nation.stock, { food: 0, wood: 0 });
  assert.deepEqual(nation.finance, { day: gameDay(midnight), food: 25, wood: 30, bought: 0, supplied: 0 });
  advanceNations(simulation, midnight + 2 * 1440, false, settle);
  assert.equal(seen.length, 6);
  assert.equal(new Set(seen.map(pair => pair.join('/'))).size, 6);
  nation.treasury = 0;
  const snapshot = JSON.parse(JSON.stringify(captureNations(simulation)));
  const restored = restoreNations(snapshot, snapshot.minute);
  assert.equal(restored.nations[0].treasury, 0);
  assert.deepEqual(restored.nations[0].finance, nation.finance);
  const fresh = createNationSimulation();
  const old = captureNations(fresh);
  for (const entry of old.nations) {
    delete entry.treasury;
    delete entry.finance;
    delete entry.lastDay;
    for (const person of entry.residents) delete person.role;
  }
  const migrated = restoreNations(old, 0, 10);
  assert.equal(migrated.nations[0].treasury, 10_000);
  assert.deepEqual(migrated.nations[0].cities[0].residents.slice(0, 2).map(person => person.role), ['food', 'wood']);

  // An old save could put all residents to sleep until the next midnight.
  for (const entry of old.nations) entry.nextMinute = midnight;
  const sleeping = restoreNations(old, 0, 10);
  assert.deepEqual(sleeping.nations[0].stock, fresh.nations[0].stock);
  const immediatelyResaved = restoreNations(captureNations(sleeping), 0);
  advanceNations(immediatelyResaved, 1);
  assert.ok(immediatelyResaved.nations[0].cities[0].residents.every(person => person.action !== 'idle'));
});

test('ECON-05: bulk trades conserve player, shop and treasury gold during partial settlement', () => {
  const [nation] = createNationSimulation().nations;
  const state = { ...makeShops(), gold: 1000, player: { inventory: new Map([['apple', 1000]]) } };
  nation.treasury = 4;
  const total = () => state.gold + Object.values(state.shopGold).reduce((a, b) => a + b, 0) + nation.treasury;
  const before = total();
  let sold = 0;
  while (sellItem(state, 'goods-shop', 'apple')) sold++;
  assert.equal(sold, 100);
  const stock = state.shopStock['weapon-shop'];
  for (const id of [...stock.keys()]) assert.ok(buyItem(state, 'weapon-shop', id));
  const finance = { bought: 0, supplied: 0 };
  settleShops(state, nation, gameDay(0) + 1, finance);
  assert.equal(total(), before);
  assert.equal(state.shopStock['goods-shop'].get('apple'), 98);
  assert.deepEqual(state.shopStock['weapon-shop'], createShopStock()['weapon-shop']);
  assert.equal(nation.treasury, finance.supplied);
});

test('ECON-06: warehouse capacity thresholds depend on population and completed warehouses', () => {
  for (const [population, needed, requiredWarehouses] of [
    [10, 132, 2], [15, 182, 2], [20, 232, 2], [25, 282, 3],
    [30, 332, 3], [35, 382, 4], [40, 432, 4],
  ]) {
    const [nation] = createNationSimulation().nations;
    const [city] = nation.cities;
    city.residents = Array.from({ length: population }, () => city.residents[0]);
    const plots = nationLayouts[0].plots.slice(city.buildings.length - 1);
    for (let warehouses = 1; warehouses <= 4; warehouses++) {
      nation.stock = { food: 90 * warehouses, wood: 0 };
      const targets = reserves(nation);
      assert.equal(targets.requiredCapacity, warehouses < 4 ? needed : population * 10);
      assert.equal(targets.plans.get(city.id).kind, warehouses < requiredWarehouses ? 'warehouse' : 'house');
      assert.equal(targets.buildingWood, warehouses < requiredWarehouses ? 32 : 24);
      if (warehouses < 4) city.buildings.push({ ...plots[warehouses - 1], kind: 'warehouse' });
    }
  }
});

test('ECON-07: full food storage recovers, construction wood is protected, and an active warehouse reloads', () => {
  const simulation = createNationSimulation();
  const [nation] = simulation.nations;
  const [city] = nation.cities;
  nation.stock = { food: 120, wood: 0 };
  advanceNations(simulation, 1);
  assert.equal(nation.demand.plans.get(city.id).kind, 'warehouse');
  assert.equal(nation.demand.buildingWood, 32);
  assert.equal(storageRoom(nation.demand, 'wood'), 0);
  advanceNations(simulation, midnight);
  assert.equal(nation.stock.food, 40);
  assert.equal(nation.finance.food, 70);
  assert.ok(nation.demand.labor.wood > 0);
  for (let minute = midnight + 1; minute <= midnight + 200 && !city.project; minute++) {
    advanceNations(simulation, minute);
  }
  assert.equal(city.project?.site.kind, 'warehouse');
  assert.equal(nation.demand.plans.size, 0);
  assert.equal(nation.demand.buildingWood, 0);
  const worker = city.residents.find(person => person.id === city.project.workerId);
  const finish = worker.task.end;
  const saved = JSON.parse(JSON.stringify(captureNations(simulation)));
  const restored = restoreNations(saved, saved.minute);
  advanceNations(restored, finish);
  advanceNations(simulation, finish);
  assert.deepEqual(captureNations(restored), captureNations(simulation));
  assert.equal(nation.demand.limit, 240);
  assert.equal(city.buildings.filter(building => building.kind === 'warehouse').length, 2);
  assert.notEqual(city.project?.site.kind, 'warehouse');

  const [rich] = createNationSimulation().nations;
  rich.stock = { food: 0, wood: 90 };
  assert.equal(reserves(rich).ideal.wood, 72);
  settleNationDay(rich, rich.lastDay + 1);
  assert.equal(rich.stock.wood, 72);
  assert.equal(rich.finance.wood, 8);
});
