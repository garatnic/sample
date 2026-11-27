import { firstMinuteOfDay, gameDay } from './clock.js?v=34';
import { nationLayouts } from './nation-layout.js?v=34';
import { actionNames, capacity, createNationSimulation, taskSchedule } from './nation-simulation.js?v=34';
import { nationSettings as config } from './nation-settings.js?v=34';

function requireValid(condition) {
  if (!condition) throw new Error('Invalid nation simulation data');
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
        buildings: city.buildings.map(({ id, kind }) => ({ id, kind })),
        sources: city.sources.map(({ readyAt }) => readyAt),
        project: city.project && { id: city.project.site.id, kind: city.project.site.kind, workerId: city.project.workerId },
        residents: city.residents.map(({ id, homeId, x, y, action, targetId, carrying, task }) =>
          ({ id, homeId, x, y, action, targetId, carrying, task })),
        nextMinute: nation.nextMinute,
      };
    }),
  };
}

export function restoreNations(data, minute) {
  const simulation = createNationSimulation(minute);
  requireValid(data?.layoutVersion === simulation.layoutVersion && data.minute === minute
    && Array.isArray(data.nations) && data.nations.length === simulation.nations.length);
  for (const [index, nation] of simulation.nations.entries()) {
    const saved = data.nations[index];
    const [city] = nation.cities;
    const layout = nationLayouts[index];
    requireValid(saved?.id === nation.id && saved.cityId === city.id
      && Array.isArray(saved.buildings) && Array.isArray(saved.residents) && Array.isArray(saved.sources)
      && saved.sources.length === city.sources.length);
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
      && saved.residents.length === counts.house * config.house.residents);
    const limit = capacity(nation);
    requireValid(integer(saved.stock?.wood, 0, limit) && integer(saved.stock?.food, 0, limit - saved.stock.wood));
    nation.stock = { wood: saved.stock.wood, food: saved.stock.food };
    city.sources.forEach((source, i) => {
      requireValid(integer(saved.sources[i], 0, minute + config.harvest[source.kind].regrow));
      source.readyAt = saved.sources[i];
    });
    if (saved.project !== null) {
      const site = readBuilding(saved.project, true);
      requireValid(counts[site.kind] < config[site.kind].max);
      city.project = { site, workerId: saved.project.workerId };
    }
    const positions = [...city.buildings.map(b => b.door), ...city.sources];
    const people = new Set();
    const claimed = new Set();
    let reserved = 0;
    city.residents = saved.residents.map(person => {
      const home = city.buildings.find(b => b.id === person?.homeId && b.kind === 'house');
      requireValid(home && !people.has(person.id) && Array.from({ length: config.house.residents },
        (_, i) => `${home.id}-resident-${i + 1}`).includes(person.id)
        && positions.some(point => point.x === person.x && point.y === person.y)
        && Object.hasOwn(actionNames, person.action));
      people.add(person.id);
      const { id, homeId, x, y, action, targetId, carrying, task } = person;
      if (action === 'idle') {
        requireValid(task === null && targetId === null && carrying === null);
      } else {
        requireValid(integer(task?.depart, 0, minute) && task.end > minute);
        let target;
        let workMinutes = 0;
        if (action === 'haul') {
          target = city.buildings.find(b => b.id === targetId && b.kind === 'warehouse');
          requireValid(target && Object.hasOwn(config.harvest, carrying?.kind)
            && carrying.quantity === Math.min(config.carry, config.harvest[carrying.kind].yield));
          reserved += carrying.quantity;
        } else {
          requireValid(carrying === null);
          if (action === 'gatherFood' || action === 'gatherWood') {
            const source = city.sources.find(s => s.id === targetId);
            requireValid(source?.kind === (action === 'gatherFood' ? 'food' : 'wood')
              && source.readyAt <= task.depart && !claimed.has(targetId));
            target = source;
            workMinutes = config.harvest[source.kind].minutes;
            claimed.add(targetId);
            reserved += Math.min(config.carry, config.harvest[source.kind].yield);
          } else {
            requireValid(city.project?.workerId === id && city.project.site.id === targetId
              && city.project.site.kind === (action === 'buildHouse' ? 'house' : 'warehouse'));
            target = city.project.site;
            workMinutes = config[target.kind].minutes;
          }
        }
        const expectedTask = taskSchedule(person, city, target, task.depart, workMinutes);
        requireValid(task.startWork === expectedTask.startWork && task.end === expectedTask.end);
      }
      return { id, homeId, x, y, action, targetId, carrying, task, nationId: nation.id, cityId: city.id };
    });
    requireValid(!city.project || city.residents.some(p => p.id === city.project.workerId && p.targetId === city.project.site.id));
    requireValid(nation.stock.wood + nation.stock.food + reserved <= limit);
    const eventMinute = Math.min(firstMinuteOfDay(gameDay(minute) + 1),
      ...city.residents.filter(p => p.task).map(p => p.task.end),
      ...city.sources.filter(s => s.readyAt > minute).map(s => s.readyAt));
    requireValid(saved.nextMinute === eventMinute || (saved.nextMinute === minute
      && !city.project && city.residents.every(p => p.action === 'idle')));
    nation.nextMinute = saved.nextMinute;
  }
  return simulation;
}
