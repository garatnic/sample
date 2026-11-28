import test from 'node:test';
import assert from 'node:assert/strict';
import { firstMinuteOfDay, gameDay } from '../game/src/clock.js?v=34';
import { advanceNations, createNationSimulation, removeResident } from '../game/src/nation-simulation.js?v=53';
import { captureNations, restoreNations } from '../game/src/nation-save.js?v=53';
import { settleNationDay } from '../game/src/nation-economy.js?v=53';
import { buyItem, sellItem, shopPrice, settleShops, createShopStock } from '../game/src/shop.js?v=55';
import { tradeSettings } from '../game/src/trade-settings.js?v=53';
import { reservedProduction, stockQuantity, tradeRoom } from '../game/src/trade-stock.js?v=53';
import { shopDoors } from '../game/src/world.js?v=55';

const door = nation => nation.cities[0].tradePost.id;
const snapshot = simulation => JSON.parse(JSON.stringify(captureNations(simulation)));
const makeState = (nations = createNationSimulation()) => ({
  nations, gold: 10, player: { inventory: new Map() }, shopStock: createShopStock(),
  shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 100])),
});

test('TRADE-01: price matrix, native stock, cash constraints and three profitable legs', () => {
  const state = makeState();
  const nations = state.nations.nations;
  const goods = nations.map(n => n.trade.specialty);
  assert.deepEqual(nations.map(n => goods.map(id => shopPrice(door(n), id, true))),
    [[10, 20, 30], [30, 10, 20], [20, 30, 10]]);
  assert.deepEqual(nations.map(n => goods.map(id => shopPrice(door(n), id, false))),
    [[7, 14, 21], [21, 7, 14], [14, 21, 7]]);
  assert.equal(buyItem(state, door(nations[0]), goods[0]), false);
  advanceNations(state.nations, 1440);
  for (const [i, source] of nations.entries()) {
    const dest = nations[(i + 1) % nations.length];
    const id = goods[i];
    assert.ok(buyItem(state, door(source), id));
    const balance = dest.treasury;
    dest.treasury = 20;
    assert.equal(sellItem(state, door(dest), id), false);
    dest.treasury = balance;
    const existing = new Map(dest.trade.stock);
    dest.trade.stock.set(id, tradeSettings.capacity - stockQuantity(existing));
    assert.equal(sellItem(state, door(dest), id), false, 'capacity protects real stock');
    dest.trade.stock = existing;
    assert.ok(sellItem(state, door(dest), id));
    assert.equal(dest.trade.stock.get(id), 1);
  }
  assert.equal(state.gold, 43);
});

test('TRADE-02: processing claims, completion, death, protected reserves and reload', () => {
  const simulation = createNationSimulation();
  const [nation] = simulation.nations;
  const [city] = nation.cities;
  nation.stock = { food: 42, wood: 77 };
  advanceNations(simulation, 1);
  const workers = city.residents.filter(p => p.action === 'craftTrade').sort((a, b) => a.task.end - b.task.end);
  assert.equal(workers.length, 2);
  assert.ok(workers.every(p => p.role === 'general'));
  assert.equal(tradeRoom(nation), tradeSettings.capacity - 2);
  const time = workers[0].task.end;
  advanceNations(simulation, time - 0.01);
  const saved = snapshot(simulation);
  const restored = restoreNations(saved, saved.minute);
  const corrupted = structuredClone(saved);
  corrupted.nations[0].trade.stock.push([nation.trade.specialty, tradeSettings.capacity]);
  corrupted.nations[0].trade.produced = tradeSettings.capacity;
  assert.throws(() => restoreNations(corrupted, saved.minute));
  const stock = { ...nation.stock };
  advanceNations(simulation, time);
  advanceNations(restored, time);
  assert.deepEqual(snapshot(simulation), snapshot(restored));
  assert.deepEqual(nation.stock, { food: stock.food - 1, wood: stock.wood - 1 });
  assert.equal(nation.trade.stock.get(nation.trade.specialty), 1);

  const resumed = restoreNations(saved, saved.minute);
  const other = resumed.nations[0];
  const otherCity = other.cities[0];
  const doomed = otherCity.residents.find(p => p.id === workers[0].id);
  removeResident(other, otherCity, doomed, resumed.minute);
  assert.equal(reservedProduction(other), 1);
  advanceNations(resumed, time);
  assert.equal(other.trade.produced, 0);
  assert.deepEqual(other.stock, stock);

  const shortage = restoreNations(saved, saved.minute);
  const [owner] = shortage.nations;
  owner.stock.food = 40;
  advanceNations(shortage, time);
  assert.equal(owner.trade.produced, 0);
  assert.equal(owner.stock.food, 40);
});

test('TRADE-03: midnight pays imports and population once, retaining local goods', () => {
  const state = makeState();
  const [nation, foreign] = state.nations.nations;
  const imports = foreign.trade.specialty;
  state.player.inventory.set(imports, 1);
  assert.ok(sellItem(state, door(nation), imports));
  const importPrice = shopPrice(door(nation), imports, false);
  nation.trade.stock.set(nation.trade.specialty, 2);
  nation.trade.produced = 2;
  nation.stock = { food: 80, wood: 40 };
  const day = gameDay(0) + 1;
  const settle = (owner, d, ledger) => settleShops(state, owner, d, ledger);
  settleNationDay(nation, day, settle);
  assert.equal(nation.treasury, 10010);
  assert.deepEqual(nation.finance, { day, base: 10, imports: importPrice, tradeSales: 0,
    tradePurchases: importPrice, supplied: 0, bought: 0 });
  assert.deepEqual(nation.stock, { food: 70, wood: 30 });
  assert.deepEqual([...nation.trade.stock], [[nation.trade.specialty, 2]]);
  settleNationDay(nation, day, settle);
  assert.equal(nation.treasury, 10010);
});

test('TRADE-04: 100 days with recurring three-country sales and fully settled treasuries', () => {
  const state = makeState();
  const { nations } = state;
  const results = [];
  const settle = (owner, day, ledger) => settleShops(state, owner, day, ledger);
  for (let day = 1; day <= 100; day++) {
    const boundary = firstMinuteOfDay(gameDay(0) + day + 1);
    advanceNations(nations, boundary - 1, false, settle);
    const cash = state.gold;
    for (const [i, source] of nations.nations.entries()) {
      assert.ok(buyItem(state, door(source), source.trade.specialty));
      assert.ok(sellItem(state, door(nations.nations[(i + 1) % nations.nations.length]), source.trade.specialty));
    }
    assert.equal(state.gold, cash + 33);
    advanceNations(nations, boundary, false, settle);
    for (const owner of nations.nations) {
      assert.equal(owner.finance.imports, shopPrice(door(owner),
        nations.nations.find(n => shopPrice(door(owner), n.trade.specialty, true) === 30).trade.specialty, false));
      assert.equal(owner.finance.tradeSales, 10);
      assert.ok(tradeRoom(owner) >= 0);
      assert.ok(owner.stock.food >= 0 && owner.stock.wood >= 0);
    }
    if ([1, 10, 100].includes(day)) results.push([day, nations.nations.map(owner => ({
      population: owner.cities[0].residents.length, houses: owner.cities[0].buildings.filter(b => b.kind === 'house').length,
      warehouses: owner.cities[0].buildings.filter(b => b.kind === 'warehouse').length, reserves: owner.stock,
      produced: owner.trade.produced, inventory: stockQuantity(owner.trade.stock), treasury: owner.treasury,
      ledger: owner.finance,
    }))]);
  }
  assert.equal(state.gold, 3310);
  assert.ok(nations.nations.every(nation => nation.cities[0].residents.length === 20 && nation.trade.produced >= 100));
  console.log('100-day recurring trade:', JSON.stringify(results));
});
