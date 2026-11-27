import { mobSettings } from './mob-settings.js?v=41';
import { firstMinuteOfDay, gameDay } from './clock.js?v=34';
import { nationLayouts } from './nation-layout.js?v=35';
import { actionNames, assignRoles, capacity, createNationSimulation, gatherAction, nextPick, refreshNationDemand, taskSchedule, wanderPoints } from './nation-simulation.js?v=45';
import { nationSettings as config } from './nation-settings.js?v=45';

function requireValid(condition) {
  if (!condition) throw new Error('Invalid nation simulation data');
}

function time(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function integer(value, min, max) {
  return Number.isSafeInteger(value) && value >= min && value <= max;
}

export function captureNations(simulation) {
  return {
    layoutVersion: simulation.layoutVersion,
    minute: simulation.minute,
    nations: simulation.nations.map(nation => {
      const [city] = nation.cities;
      return {
        id: nation.id, cityId: city.id, stock: nation.stock,
        treasury: nation.treasury, finance: nation.finance, lastDay: nation.lastDay,
        buildings: city.buildings.map(({ id, kind }) => ({ id, kind })),
        sources: city.sources.map(({ readyAt }) => readyAt),
        sourceRemaining: city.sources.map(({ remaining }) => remaining),
        project: city.project && { id: city.project.site.id, kind: city.project.site.kind, workerId: city.project.workerId },
        residents: city.residents.map(({ id, homeId, x, y, action, targetId, carrying, task, hp, cooldown, role, wanderUntil = null, gatherLimit = null, gatherGeneration = null }) =>
          ({ id, homeId, x, y, action, targetId, carrying, task, hp, cooldown, role, wanderUntil, gatherLimit, gatherGeneration })),
        nextMinute: nation.nextMinute,
      };
    }),
  };
}

export function restoreNations(data, minute, saveVersion = 11) {
  const legacy = saveVersion < 6;
  const legacyTasks = saveVersion < 7;
  const simulation = createNationSimulation(minute);
  requireValid(data?.layoutVersion === simulation.layoutVersion && data.minute === minute
    && Array.isArray(data.nations) && data.nations.length === simulation.nations.length);
  for (const [index, nation] of simulation.nations.entries()) {
    const saved = data.nations[index];
    const [city] = nation.cities;
    const layout = nationLayouts[index];
    requireValid(saved?.id === nation.id && saved.cityId === city.id
      && Array.isArray(saved.buildings) && Array.isArray(saved.residents) && Array.isArray(saved.sources)
      && saved.sources.length === city.sources.length
      && (legacy || Array.isArray(saved.sourceRemaining) && saved.sourceRemaining.length === city.sources.length));
    const expected = city.buildings;
    const used = new Set();
    const readBuilding = (entry, project = false) => {
      const plot = entry?.id === layout.center.id ? layout.center : layout.plots.find(p => p.id === entry?.id);
      requireValid(plot && !used.has(entry.id)
        && (plot === layout.center ? entry.kind === 'center' && !project : ['warehouse', 'house'].includes(entry.kind)));
      used.add(entry.id);
      return { ...plot, kind: entry.kind };
    };
    requireValid(saved.buildings.length <= 1 + config.house.max + config.warehouse.max);
    city.buildings = saved.buildings.map(entry => readBuilding(entry));
    const counts = { warehouse: 0, house: 0 };
    for (const building of city.buildings) {
      if (building.kind !== 'center') counts[building.kind]++;
    }
    requireValid(expected.every(b => city.buildings.some(entry => entry.id === b.id && entry.kind === b.kind))
      && counts.house <= config.house.max && counts.warehouse <= config.warehouse.max
      && (saveVersion >= 10 ? saved.residents.length <= counts.house * config.house.residents
        : saved.residents.length === counts.house * config.house.residents));
    const limit = capacity(nation);
    requireValid(integer(saved.stock?.wood, 0, limit) && integer(saved.stock?.food, 0, limit - saved.stock.wood));
    nation.stock = { wood: saved.stock.wood, food: saved.stock.food };
    if (saveVersion >= 11) {
      requireValid(integer(saved.treasury, 0, Number.MAX_SAFE_INTEGER) && saved.lastDay === gameDay(minute));
      requireValid(saved.finance === null || saved.finance?.day === saved.lastDay
        && ['food', 'wood', 'supplied', 'bought'].every(key => integer(saved.finance[key], 0, Number.MAX_SAFE_INTEGER)));
      nation.treasury = saved.treasury;
      nation.lastDay = saved.lastDay;
      nation.finance = saved.finance;
    }
    city.sources.forEach((source, i) => {
      requireValid(time(saved.sources[i], 0, minute + config.harvest[source.kind].regrow));
      source.readyAt = saved.sources[i];
      const max = config.harvest[source.kind].yield;
      source.remaining = legacy ? (source.readyAt > minute ? 0 : max) : saved.sourceRemaining[i];
      requireValid(integer(source.remaining, 0, max) && (source.readyAt <= minute || source.remaining === 0));
    });
    if (saved.project !== null) {
      const site = readBuilding(saved.project, true);
      requireValid(counts[site.kind] < config[site.kind].max);
      city.project = { site, workerId: saved.project.workerId };
    }
    const positions = [...city.buildings.map(b => b.door), ...city.sources, ...wanderPoints(city).values()];
    const people = new Set();
    const claimed = new Set();
    city.residents = saved.residents.map(person => {
      const home = city.buildings.find(b => b.id === person?.homeId && b.kind === 'house');
      requireValid(home && !people.has(person.id) && Array.from({ length: config.house.residents },
        (_, i) => `${home.id}-resident-${i + 1}`).includes(person.id)
        && positions.some(point => point.x === person.x && point.y === person.y)
        && Object.hasOwn(actionNames, person.action));
      people.add(person.id);
      const { id, homeId, x, y, action, targetId, carrying } = person;
      let { task } = person;
      const role = saveVersion >= 11 ? person.role : 'general';
      const wanderUntil = person.wanderUntil ?? null;
      const gatherLimit = person.gatherLimit ?? null;
      const gatherGeneration = person.gatherGeneration ?? null;
      requireValid(['general', 'food', 'wood'].includes(role)
        && (action === 'wander' || wanderUntil === null)
        && (gatherAction(action) || gatherLimit === null && gatherGeneration === null));
      if (action === 'idle') {
        requireValid(task === null && targetId === null && carrying === null);
      } else {
        requireValid(time(task?.depart, 0, minute) && time(task.end, minute, minute + 200) && task.end > minute);
        let target;
        let workMinutes = 0;
        if (action === 'wander') {
          target = wanderPoints(city).get(targetId);
          requireValid(target && carrying === null && time(wanderUntil, minute, minute + config.leisureMinutes[1])
            && wanderUntil > minute);
          if (x === target.x && y === target.y) workMinutes = wanderUntil - task.depart;
        } else if (action === 'haul') {
          target = city.buildings.find(b => b.id === targetId && b.kind === 'warehouse');
          requireValid(target && Object.hasOwn(config.harvest, carrying?.kind)
            && integer(carrying.quantity, 1, Math.min(config.carry, config.harvest[carrying.kind].yield)));
        } else {
          if (gatherAction(action)) {
            const source = city.sources.find(s => s.id === targetId);
            requireValid(source?.kind === (action === 'gatherFood' ? 'food' : 'wood') && !claimed.has(targetId));
            const max = Math.min(config.carry, config.harvest[source.kind].yield);
            requireValid(carrying === null || (!legacyTasks && carrying.kind === source.kind
              && integer(carrying.quantity, 1, max - 1)));
            target = source;
            workMinutes = config.harvest[source.kind].minutes;
            claimed.add(targetId);
            requireValid(gatherLimit === null && gatherGeneration === null
              || integer(gatherLimit, (carrying?.quantity ?? 0) + 1, max) && time(gatherGeneration, 0, task.depart));
          } else {
            requireValid(carrying === null);
            requireValid(city.project?.workerId === id && city.project.site.id === targetId
              && city.project.site.kind === (action === 'buildHouse' ? 'house' : 'warehouse'));
            target = city.project.site;
            workMinutes = config[target.kind].minutes;
          }
        }
        const expectedTask = taskSchedule(person, city, target, task.depart, workMinutes);
        requireValid(task.startWork === expectedTask.startWork);
        if (gatherAction(action) && !legacyTasks) {
          requireValid(task.end <= nextPick(Math.max(task.startWork, minute), target.kind) + 1e-6);
        } else {
          requireValid(task.end === expectedTask.end);
          if (gatherAction(action)) task = { ...task, end: nextPick(Math.max(task.startWork, minute), target.kind) };
        }
      }
      const combatState = {};
      if (saveVersion >= 10) {
        if (person.hp !== undefined) {
          requireValid(time(person.hp, Number.MIN_VALUE, mobSettings.resident.hp));
          combatState.hp = person.hp;
        }
        if (person.cooldown !== undefined) {
          requireValid(time(person.cooldown, 0, mobSettings.resident.interval));
          combatState.cooldown = person.cooldown;
        }
      }
      return { id, homeId, x, y, action, targetId, carrying, task, role, wanderUntil, gatherLimit, gatherGeneration, ...combatState, nationId: nation.id, cityId: city.id };
    });
    requireValid(!city.project || city.residents.some(p => p.id === city.project.workerId && p.targetId === city.project.site.id));
    assignRoles(city);
    const demand = refreshNationDemand(nation, minute);
    requireValid(nation.stock.wood + nation.stock.food + demand.reserved.wood + demand.reserved.food <= limit);
    const eventMinute = Math.min(firstMinuteOfDay(gameDay(minute) + 1),
      ...city.residents.filter(p => p.task).map(p => p.task.end),
      ...city.sources.filter(s => s.readyAt > minute).map(s => s.readyAt));
    const initial = saved.nextMinute === minute && !city.project && city.residents.every(p => p.action === 'idle');
    requireValid(legacyTasks || saved.nextMinute === eventMinute || initial);
    nation.nextMinute = initial ? minute : eventMinute;
  }
  return simulation;
}
