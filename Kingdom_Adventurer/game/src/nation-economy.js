import { nationLayouts } from './nation-layout.js?v=53';
import { nationSettings as config } from './nation-settings.js?v=53';

import { tradeSettings } from './trade-settings.js?v=53';
import { settleTrade } from './trade-stock.js?v=62';

const resources = ['food', 'wood'];

const byResource = calculate => Object.fromEntries(resources.map(kind => [kind, calculate(kind)]));

export function capacity(nation) {
  return nation.cities.reduce((total, city) =>
    total + city.buildings.filter(b => b.kind === 'warehouse').length * config.warehouse.capacity, 0);
}

// Buildings are appended on completion or replaced as a list during load.
const reserveTargets = new WeakMap();

function targetsFor(nation) {
  const cached = reserveTargets.get(nation);
  if (cached && cached.cities.length === nation.cities.length && nation.cities.every((city, index) => {
    const state = cached.cities[index];
    return city === state.city && city.residents.length === state.population && city.buildings === state.buildings
      && city.buildings.length === state.buildingCount && city.project === state.project;
  })) return cached.targets;

  const cities = nation.cities.map(city => ({
    city, population: city.residents.length, buildings: city.buildings, buildingCount: city.buildings.length,
    project: city.project, warehouses: city.buildings.filter(building => building.kind === 'warehouse').length,
  }));
  const population = cities.reduce((sum, city) => sum + city.population, 0);
  const daily = byResource(kind => population * config.dailyPerResident[kind]);
  const minimum = byResource(kind => daily[kind] * config.minimumDays);
  const ideal = byResource(kind => daily[kind] * config.targetDays);
  const limit = cities.reduce((sum, city) => sum + city.warehouses * config.warehouse.capacity, 0);
  const plans = new Map();
  const warehouseReserve = cities.some(city => city.warehouses < config.warehouse.max) ? config.warehouse.cost : 0;
  const requiredCapacity = ideal.food + ideal.wood + daily.food + daily.wood + warehouseReserve;
  let projectedCapacity = limit + cities.filter(city => city.project?.site.kind === 'warehouse').length * config.warehouse.capacity;
  let buildingWood = 0;
  for (const { city, warehouses, project, population } of cities) {
    if (project || population === 0) continue;
    const layout = nationLayouts.find(entry => entry.cityId === city.id);
    const plot = layout.plots.find(entry => !city.buildings.some(b => b.id === entry.id));
    if (!plot) continue;
    const houses = city.buildings.filter(b => b.kind === 'house').length;
    const expand = warehouses < config.warehouse.max && projectedCapacity < requiredCapacity;
    const kind = expand ? 'warehouse' : houses < config.house.max ? 'house' : null;
    if (!kind) continue;
    if (kind === 'warehouse') projectedCapacity += config.warehouse.capacity;
    plans.set(city.id, { ...plot, kind });
    buildingWood += config[kind].cost;
  }
  ideal.wood += buildingWood;
  const livingRoom = Math.max(0, limit - buildingWood);
  const livingTotal = ideal.food + ideal.wood - buildingWood;
  const food = livingTotal > livingRoom ? Math.floor(livingRoom * ideal.food / livingTotal) : ideal.food;
  const effective = { food, wood: Math.min(ideal.wood, limit - food) };
  const targets = { population, daily, minimum, ideal, effective, limit, requiredCapacity, buildingWood, plans };
  reserveTargets.set(nation, { cities, targets });
  return targets;
}

export function reserves(nation) {
  const targets = targetsFor(nation);
  const surplus = byResource(kind => Math.max(0, nation.stock[kind] - targets.ideal[kind]));
  return { ...targets, surplus };
}

export function updateNationDemand(nation, reserved, targets = reserves(nation)) {
  const { effective } = targets;
  const expected = byResource(kind => nation.stock[kind] + reserved[kind]);
  const fill = byResource(kind => effective[kind] ? Math.min(1, expected[kind] / effective[kind]) : 1);
  const least = Math.min(fill.food, fill.wood);
  const upper = config.leisureCurve.findIndex(([ratio]) => ratio >= least);
  const [left, low] = config.leisureCurve[Math.max(0, upper - 1)];
  const [right, high] = config.leisureCurve[upper];
  const leisure = left === right ? high : low + (least - left) / (right - left) * (high - low);
  const weights = byResource(kind => 1 - fill[kind] + Math.max(0, config.shortageBonusBelow - fill[kind]));
  const total = weights.food + weights.wood;
  const labor = byResource(kind => total ? weights[kind] / total : 0);
  nation.demand = { ...targets, reserved: { ...reserved }, expected, leisure, labor };
  return nation.demand;
}

export function storageRoom(demand, kind) {
  const other = kind === 'food' ? 'wood' : 'food';
  return Math.max(0, demand.limit - demand.expected[kind] - Math.max(demand.expected[other], demand.effective[other]));
}

export function settleNationDay(nation, day, settleShops) {
  if (day <= nation.lastDay) return;
  const { daily, population } = targetsFor(nation);
  const finance = { day, base: population * tradeSettings.dailyGoldPerResident,
    imports: 0, tradeSales: 0, tradePurchases: 0, supplied: 0, bought: 0 };
  for (const kind of resources) nation.stock[kind] = Math.max(0, nation.stock[kind] - daily[kind]);
  nation.treasury += finance.base;
  settleTrade(nation, finance);
  settleShops?.(nation, day, finance);
  nation.finance = finance;
  nation.lastDay = day;
}
