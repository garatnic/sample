import { harvestSeconds, harvestSource, sourceQuantity } from './trees.js?v=53';
import { exactGameMinutes, firstMinuteOfDay, gameDay } from './clock.js?v=34';
import { nationLayouts } from './nation-layout.js?v=53';
import { capacity, reserves, settleNationDay, storageRoom, updateNationDemand } from './nation-economy.js?v=53';
import { nationSettings as config } from './nation-settings.js?v=53';

import { tradeGoods, tradeSettings } from './trade-settings.js?v=53';
import { reservedProduction, tradeRoom } from './trade-stock.js?v=53';

export const actionNames = {
  idle: '待機', wander: '自由徘徊', gatherWood: '木材収集', gatherFood: '食料収集',
  craftTrade: '特産品加工', haul: '運搬', buildHouse: '民家建築', buildWarehouse: '倉庫建築',
};

export { capacity };

function finishBuilding(nation, city, site) {
  city.buildings.push(site);
  if (site.kind !== 'house') return;
  for (let i = 0; i < config.house.residents; i++) {
    city.residents.push({
      id: `${site.id}-resident-${i + 1}`, nationId: nation.id, cityId: city.id,
      homeId: site.id, ...site.door, action: 'idle', targetId: null, carrying: null, task: null,
    });
  }
}

export function createNationSimulation(minute = 0) {
  return {
    layoutVersion: 2,
    minute,
    nations: nationLayouts.map(layout => {
      const city = {
        id: layout.cityId, name: layout.cityName, x: layout.x, y: layout.y,
        buildings: [{ ...layout.center }], residents: [],
        tradePost: layout.facilities.find(building => building.kind === 'trade-post'),
        sources: layout.sources.map(source => ({ ...source, readyAt: minute, remaining: config.harvest[source.kind].yield })), project: null,
      };
      const nation = { id: layout.id, name: layout.name, cities: [city],
        stock: { ...config.initialStock }, treasury: config.initialTreasury, finance: null, lastDay: gameDay(minute), nextMinute: minute };
      const specialty = [...tradeGoods].find(([, good]) => good.origin === layout.id)?.[0];
      nation.trade = { specialty, stock: new Map(), produced: 0, sales: 0, purchases: 0 };
      const kinds = Array(config.warehouse.initial).fill('warehouse').concat(Array(config.house.initial).fill('house'));
      kinds.forEach((kind, index) => finishBuilding(nation, city, { ...layout.plots[index], kind }));
      assignRoles(city);
      refreshNationDemand(nation, minute);
      return nation;
    }),
  };
}

export function modeFor(city, viewpoint) {
  return viewpoint && Math.hypot(city.x - viewpoint.x, city.y - viewpoint.y) <= config.nearRadius ? 'near' : 'far';
}

function route(from, to, spine) {
  return from.y === to.y ? [to] : [{ x: spine, y: from.y }, { x: spine, y: to.y }, to];
}

function travelMinutes(from, to, spine) {
  const distance = from.y === to.y ? Math.abs(from.x - to.x)
    : Math.abs(from.x - spine) + Math.abs(from.y - to.y) + Math.abs(to.x - spine);
  return Math.ceil(distance / config.walkingSpeed);
}

export function taskSchedule(resident, city, target, minute, workMinutes) {
  const point = target.door ?? target;
  const startWork = minute + travelMinutes(resident, point, city.x);
  return { depart: minute, startWork, end: Math.max(minute + 1, startWork + workMinutes) };
}

export function gatherAction(action) {
  return action === 'gatherFood' || action === 'gatherWood';
}

export function nextPick(after, kind) {
  return Math.round((after + exactGameMinutes(harvestSeconds[kind])) * 1e6) / 1e6;
}

function startTask(resident, city, action, target, minute, workMinutes = 0) {
  resident.action = action;
  resident.targetId = target.id;
  resident.task = taskSchedule(resident, city, target, minute, workMinutes);
  if (gatherAction(action)) {
    resident.task.end = nextPick(resident.task.startWork, target.kind);
  }
}

function targetFor(city, resident) {
  if (resident.action === 'wander') return wanderPoints(city).get(resident.targetId);
  if (resident.action === 'craftTrade') return city.tradePost;
  return city.buildings.find(b => b.id === resident.targetId)
    ?? city.sources.find(s => s.id === resident.targetId)
    ?? (city.project?.site.id === resident.targetId ? city.project.site : null);
}

export function residentPosition(city, resident, minute) {
  if (!resident.task) return resident;
  const target = targetFor(city, resident);
  const point = target.door ?? target;
  if (minute >= resident.task.startWork) return point;
  const path = route(resident, point, city.x);
  let distance = (minute - resident.task.depart) * config.walkingSpeed;
  let previous = resident;
  for (const step of path) {
    const leg = Math.hypot(step.x - previous.x, step.y - previous.y);
    if (distance < leg) {
      return { x: previous.x + (step.x - previous.x) * distance / leg,
        y: previous.y + (step.y - previous.y) * distance / leg };
    }
    distance -= leg;
    previous = step;
  }
  return point;
}

function resetJob(resident) {
  Object.assign(resident, { action: 'idle', targetId: null, carrying: null, task: null, wanderUntil: null, gatherLimit: null, gatherGeneration: null });
}

function completeTask(nation, city, resident, minute) {
  const target = targetFor(city, resident);
  const { x, y } = target.door ?? target;
  if (!gatherAction(resident.action)) Object.assign(resident, { x, y });
  switch (resident.action) {
    case 'wander':
      if (minute < resident.wanderUntil) {
        continueWander(city, resident, minute);
        return;
      }
      break;
    case 'gatherFood':
    case 'gatherWood': {
      const quantity = resident.gatherGeneration === target.readyAt
        ? harvestSource(target, minute, 1) : 0;
      const collected = (resident.carrying?.quantity ?? 0) + quantity;
      if (!collected) {
        Object.assign(resident, { x, y });
        break;
      }
      resident.carrying = { kind: target.kind, quantity: collected };
      if (quantity && collected < resident.gatherLimit && sourceQuantity(target, minute) > 0) {
        resident.task.end = nextPick(minute, target.kind);
        return;
      }
      Object.assign(resident, { x, y });
      const storage = city.buildings.filter(b => b.kind === 'warehouse')
        .sort((a, b) => Math.hypot(a.door.x - x, a.door.y - y) - Math.hypot(b.door.x - x, b.door.y - y))[0];
      resident.gatherLimit = null;
      resident.gatherGeneration = null;
      startTask(resident, city, 'haul', storage, minute);
      return;
    }
    case 'craftTrade': {
      const { surplus } = reserves(nation);
      // Living and construction needs may have increased while the worker travelled.
      if (surplus.food > 0 && surplus.wood > 0) {
        nation.stock.food--;
        nation.stock.wood--;
        const { specialty, stock } = nation.trade;
        stock.set(specialty, (stock.get(specialty) ?? 0) + 1);
        nation.trade.produced++;
      }
      break;
    }
    case 'haul': {
      const { kind, quantity } = resident.carrying;
      nation.stock[kind] += quantity;
      break;
    }
    case 'buildHouse':
    case 'buildWarehouse':
      finishBuilding(nation, city, city.project.site);
      city.project = null;
      assignRoles(city);
      break;
  }
  resetJob(resident);
}

export function assignRoles(city) {
  for (const person of city.residents) person.role ??= 'general';
  for (const kind of ['food', 'wood']) {
    const assigned = city.residents.filter(person => person.role === kind);
    for (const person of assigned.slice(config.specialists[kind])) person.role = 'general';
    for (let i = assigned.length; i < config.specialists[kind]; i++) {
      const candidate = city.residents.find(person => person.role === 'general')
        ?? (kind === 'food' ? city.residents.find(person => person.role === 'wood') : null);
      if (candidate) candidate.role = kind;
    }
  }
}

const cityWanderPoints = new Map(nationLayouts.map(layout => {
  const points = new Map([...layout.plots, layout.center, ...layout.facilities]
    .filter(({ door }) => Math.max(Math.abs(door.x - layout.x), Math.abs(door.y - layout.y)) <= config.wanderRadius)
    .map(({ id, door }) => [id, { ...door, id }]));
  for (const source of layout.sources) {
    const id = `road-${source.id}`;
    const x = layout.x + Math.sign(source.x - layout.x) * config.wanderRadius;
    points.set(id, { id, x, y: source.y });
  }
  return [layout.cityId, points];
}));

export function wanderPoints(city) {
  return cityWanderPoints.get(city.id);
}

// An event-local random draw keeps batching and save/load reproducible.
function draw(person, minute, purpose) {
  let hash = 2166136261;
  for (const character of `${person.id}/${minute}/${purpose}`) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  return ((hash ^ (hash >>> 16)) >>> 0) / 2 ** 32;
}

function continueWander(city, person, minute) {
  const points = [...wanderPoints(city).values()];
  const candidates = points.filter(point => (point.x !== person.x || point.y !== person.y)
    && minute + travelMinutes(person, point, city.x) <= person.wanderUntil);
  const target = candidates[Math.floor(draw(person, minute, 'destination') * candidates.length)];
  if (target) {
    startTask(person, city, 'wander', target, minute);
    return;
  }
  // End the leg at the deadline if there is no time left to reach another door.
  const here = points.find(point => point.x === person.x && point.y === person.y);
  if (here) {
    startTask(person, city, 'wander', here, minute, person.wanderUntil - minute);
    return;
  }
  const nearest = points.reduce((best, point) => travelMinutes(person, point, city.x)
    < travelMinutes(person, best, city.x) ? point : best);
  startTask(person, city, 'wander', nearest, minute);
}

function startWander(city, person, minute, retry) {
  const [min, max] = retry ? config.retryMinutes : config.leisureMinutes;
  person.wanderUntil = minute + min + Math.floor(draw(person, minute, 'duration') * (max - min + 1));
  continueWander(city, person, minute);
}

export function refreshNationDemand(nation, minute, targets) {
  const reserved = { food: 0, wood: 0 };
  for (const city of nation.cities) {
    for (const person of city.residents) {
      if (!gatherAction(person.action)) {
        if (person.carrying) reserved[person.carrying.kind] += person.carrying.quantity;
        continue;
      }
      const source = targetFor(city, person);
      const carried = person.carrying?.quantity ?? 0;
      const available = person.gatherGeneration === source.readyAt
        ? Math.min(person.gatherLimit, carried + sourceQuantity(source, minute)) : carried;
      reserved[source.kind] += available;
    }
  }
  return updateNationDemand(nation, reserved, targets);
}

export function craftChance(nation, demand) {
  const reserved = reservedProduction(nation);
  return nation.trade.specialty && tradeRoom(nation) > 0
    && (nation.trade.stock.get(nation.trade.specialty) ?? 0) + reserved < tradeSettings.domesticProductionLimit
    && demand.surplus.food > reserved && demand.surplus.wood > reserved
    ? demand.leisure * tradeSettings.leisureShare : 0;
}

function assignWork(nation, city, minute, demand) {
  const idle = city.residents.filter(person => !person.task);
  const plan = demand.plans.get(city.id);
  const hasGeneral = city.residents.some(person => person.role === 'general');
  const worker = plan && idle.find(person => person.role === 'general' || !hasGeneral);
  if (worker && nation.stock.wood - reservedProduction(nation) >= config[plan.kind].cost) {
    city.project = { site: plan, workerId: worker.id };
    nation.stock.wood -= config[plan.kind].cost;
    startTask(worker, city, plan.kind === 'house' ? 'buildHouse' : 'buildWarehouse',
      plan, minute, config[plan.kind].minutes);
    demand = updateNationDemand(nation, demand.reserved);
  }
  if (idle.length === 0) return demand;
  const claimed = new Set(city.residents.filter(person => gatherAction(person.action)).map(person => person.targetId));
  for (const person of idle) {
    if (person.task) continue;
    const general = person.role === 'general';
    const leisure = draw(person, minute, 'leisure');
    if (general && leisure < demand.leisure) {
      if (leisure < craftChance(nation, demand)) {
        startTask(person, city, 'craftTrade', city.tradePost, minute, tradeSettings.workMinutes);
      } else {
        startWander(city, person, minute, false);
      }
      continue;
    }
    const kind = general ? (draw(person, minute, 'resource') < demand.labor.food ? 'food' : 'wood') : person.role;
    const room = storageRoom(demand, kind);
    const source = room > 0 && city.sources.find(entry => entry.kind === kind
      && !claimed.has(entry.id) && sourceQuantity(entry, minute) > 0);
    if (source) {
      const amount = Math.min(config.carry, room, sourceQuantity(source, minute));
      person.gatherLimit = amount;
      person.gatherGeneration = source.readyAt;
      startTask(person, city, kind === 'wood' ? 'gatherWood' : 'gatherFood', source, minute);
      claimed.add(source.id);
      demand = updateNationDemand(nation, { ...demand.reserved, [kind]: demand.reserved[kind] + amount }, demand);
    } else {
      startWander(city, person, minute, true);
    }
  }
  return demand;
}

export function advanceNations(simulation, toMinute, refresh = false, settleShops) {
  if (toMinute < simulation.minute || (!refresh && toMinute === simulation.minute)) return;
  for (const nation of simulation.nations) {
    for (let minute = nation.nextMinute; minute <= toMinute;) {
      const day = gameDay(minute);
      settleNationDay(nation, day, settleShops);
      let next = firstMinuteOfDay(day + 1);
      for (const city of nation.cities) {
        for (const resident of city.residents) {
          if (resident.task?.end === minute) completeTask(nation, city, resident, minute);
        }
      }
      let demand = refreshNationDemand(nation, minute);
      for (const city of nation.cities) {
        demand = assignWork(nation, city, minute, demand);
        for (const resident of city.residents) {
          if (resident.task) next = Math.min(next, resident.task.end);
        }
        for (const source of city.sources) {
          if (source.readyAt > minute) next = Math.min(next, source.readyAt);
        }
      }
      nation.nextMinute = next;
      minute = next;
    }
  }
  simulation.minute = toMinute;
}

export function settlementBuildings(simulation) {
  return simulation.nations.flatMap(nation => nation.cities.flatMap(city => city.buildings));
}

export function removeResident(nation, city, resident, minute) {
  if (city.project?.workerId === resident.id) {
    city.project = null;
  }
  city.residents.splice(city.residents.indexOf(resident), 1);
  assignRoles(city);
  // Re-evaluate jobs and their claims at the next simulation step.
  nation.nextMinute = Math.min(nation.nextMinute, minute);
}
