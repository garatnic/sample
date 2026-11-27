import { harvestSeconds, harvestSource, sourceQuantity } from './trees.js?v=37';
import { exactGameMinutes, firstMinuteOfDay, gameDay } from './clock.js?v=34';
import { nationLayouts } from './nation-layout.js?v=35';
import { nationSettings as config } from './nation-settings.js?v=39';

export const actionNames = {
  idle: '待機', gatherWood: '木材収集', gatherFood: '食料収集',
  haul: '運搬', buildHouse: '民家建築', buildWarehouse: '倉庫建築',
};

export function capacity(nation) {
  return nation.cities.reduce((total, city) =>
    total + city.buildings.filter(b => b.kind === 'warehouse').length * config.warehouse.capacity, 0);
}

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
    layoutVersion: 1,
    minute,
    nations: nationLayouts.map(layout => {
      const city = {
        id: layout.cityId, name: layout.cityName, x: layout.x, y: layout.y,
        buildings: [{ ...layout.center }], residents: [],
        sources: layout.sources.map(source => ({ ...source, readyAt: minute, remaining: config.harvest[source.kind].yield })), project: null,
      };
      const nation = { id: layout.id, name: layout.name, cities: [city],
        stock: { ...config.initialStock }, lastDay: gameDay(minute), nextMinute: minute };
      const kinds = Array(config.warehouse.initial).fill('warehouse').concat(Array(config.house.initial).fill('house'));
      kinds.forEach((kind, index) => finishBuilding(nation, city, { ...layout.plots[index], kind }));
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

export function taskSchedule(resident, city, target, minute, workMinutes) {
  const point = target.door ?? target;
  const path = route(resident, point, city.x);
  let distance = 0;
  let previous = resident;
  for (const step of path) {
    distance += Math.hypot(step.x - previous.x, step.y - previous.y);
    previous = step;
  }
  const startWork = minute + Math.ceil(distance / config.walkingSpeed);
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
  Object.assign(resident, { action: 'idle', targetId: null, carrying: null, task: null });
}

function completeTask(nation, city, resident, minute) {
  const target = targetFor(city, resident);
  const { x, y } = target.door ?? target;
  if (!gatherAction(resident.action)) Object.assign(resident, { x, y });
  switch (resident.action) {
    case 'gatherFood':
    case 'gatherWood': {
      const quantity = harvestSource(target, minute, 1);
      const collected = (resident.carrying?.quantity ?? 0) + quantity;
      if (!collected) {
        Object.assign(resident, { x, y });
        break;
      }
      resident.carrying = { kind: target.kind, quantity: collected };
      if (collected < config.carry && sourceQuantity(target, minute) > 0) {
        resident.task.end = nextPick(minute, target.kind);
        return;
      }
      Object.assign(resident, { x, y });
      const storage = city.buildings.filter(b => b.kind === 'warehouse')
        .sort((a, b) => Math.hypot(a.door.x - x, a.door.y - y) - Math.hypot(b.door.x - x, b.door.y - y))[0];
      startTask(resident, city, 'haul', storage, minute);
      return;
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
      break;
  }
  resetJob(resident);
}

function assignWork(nation, city, minute, limits) {
  const { stock } = nation;
  const layout = nationLayouts.find(entry => entry.cityId === city.id);
  const warehouseCount = city.buildings.filter(b => b.kind === 'warehouse').length;
  const houseCount = city.residents.length / config.house.residents;
  const dailyFood = city.residents.length * config.foodPerResident;
  const canExpandStorage = warehouseCount < config.warehouse.max;
  const storageReserve = canExpandStorage ? config.warehouse.cost : 0;
  const foodTarget = Math.min(dailyFood * config.reserveDays, limits - storageReserve);
  const warehouseNeeded = canExpandStorage
    && (stock.wood + stock.food >= limits * config.warehouse.threshold
      || foodTarget + config.house.cost > limits * config.warehouse.threshold);
  const buildKind = warehouseNeeded ? 'warehouse' : houseCount < config.house.max ? 'house' : null;
  const idle = city.residents.filter(person => !person.task);
  if (!city.project && buildKind && idle.length && stock.wood >= config[buildKind].cost) {
    const plot = layout.plots.find(entry => !city.buildings.some(b => b.id === entry.id));
    if (plot) {
      const worker = idle.shift();
      city.project = { site: { ...plot, kind: buildKind }, workerId: worker.id };
      stock.wood -= config[buildKind].cost;
      startTask(worker, city, buildKind === 'house' ? 'buildHouse' : 'buildWarehouse',
        city.project.site, minute, config[buildKind].minutes);
    }
  }
  const reserved = { wood: 0, food: 0 };
  const claimed = new Set();
  for (const person of city.residents) {
    if (!gatherAction(person.action)) {
      if (person.carrying) reserved[person.carrying.kind] += person.carrying.quantity;
      continue;
    }
    const source = targetFor(city, person);
    claimed.add(source.id);
    reserved[source.kind] += Math.min(config.harvest[source.kind].yield, config.carry);
  }
  for (const person of idle) {
    const food = stock.food + reserved.food;
    const wood = stock.wood + reserved.wood;
    const woodGoal = Math.max(storageReserve, config.house.cost, limits * config.warehouse.threshold - foodTarget + config.carry);
    const priorities = food < foodTarget ? ['food', 'wood'] : ['wood', 'food'];
    for (const kind of priorities) {
      const amount = Math.min(config.harvest[kind].yield, config.carry);
      if (wood + food + amount > limits) continue;
      if (kind === 'food' && (food >= foodTarget || food + amount > limits - storageReserve)) continue;
      if (kind === 'wood' && (wood >= woodGoal || wood + amount > limits - foodTarget)) continue;
      const source = city.sources.find(s => s.kind === kind && s.readyAt <= minute && !claimed.has(s.id));
      if (!source) continue;
      startTask(person, city, kind === 'wood' ? 'gatherWood' : 'gatherFood', source, minute);
      claimed.add(source.id);
      reserved[kind] += amount;
      break;
    }
  }
}

export function advanceNations(simulation, toMinute) {
  if (toMinute <= simulation.minute) return;
  for (const nation of simulation.nations) {
    for (let minute = nation.nextMinute; minute <= toMinute;) {
      const day = gameDay(minute);
      if (day > nation.lastDay) {
        const population = nation.cities.reduce((total, city) => total + city.residents.length, 0);
        nation.stock.food = Math.max(0, nation.stock.food - population * config.foodPerResident);
        nation.lastDay = day;
      }
      let next = firstMinuteOfDay(day + 1);
      for (const city of nation.cities) {
        for (const resident of city.residents) {
          if (resident.task?.end === minute) completeTask(nation, city, resident, minute);
        }
        assignWork(nation, city, minute, capacity(nation));
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
