import { createSkills, initialSkill, maxSkill, skillDefinitions } from './skills.js?v=32';
import { cave, facilityAt, field, guildDoors, movePlayer, shopDoors } from './world.js?v=35';
import { enemyTypes, settings } from './settings.js?v=34';
import { canEquipItem, items } from './equipment.js?v=36';
import { experienceToNextLevel, maxHealth } from './growth.js?v=32';
import { maxMp } from './consumables.js?v=36';
import { gameDay } from './clock.js?v=34';
import { findSource, harvestSeconds } from './trees.js?v=36';

import { createNationSimulation } from './nation-simulation.js?v=36';
import { captureNations, restoreNations } from './nation-save.js?v=36';

import { startingShopGold } from './shop.js?v=36';

const format = 'kingdom-adventurer';
const version = 5;
export const areas = [field, cave];

export function makeSave(state, areaStates, clock) {
  const { player, harvest } = state;
  return structuredClone({
    format, version, clock, nations: captureNations(state.nations ?? createNationSimulation(clock)), area: state.area.id, gold: state.gold,
    player: { x: player.x, y: player.y, hp: player.hp, mp: player.mp,
      level: player.level, experience: player.experience, weaponId: player.weaponId,
      inventory: [...player.inventory], armor: [...player.armor], skills: [...player.skills],
      pendingPoison: player.pendingPoison, cooldown: player.cooldown },
    areas: areas.map(area => {
      const { encounters, lootDrops } = areaStates.get(area);
      return { id: area.id, lootDrops, encounters: encounters.map(({ home, enemy, remaining, generation }) => ({
        id: home.id, remaining, generation,
        enemy: enemy && { x: enemy.x, y: enemy.y, hp: enemy.hp, cooldown: enemy.cooldown },
      })) };
    }),
    guilds: [...state.guilds], shopGold: state.shopGold,
    harvest: harvest ? { id: harvest.source.id, elapsed: harvest.elapsed } : null,
  });
}

function check(condition) {
  if (!condition) throw new Error('Invalid save data');
}

const integer = (n, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(n) && n >= min && n <= max;
const number = (n, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isFinite(n) && n >= min && n <= max;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const position = (value, area) => record(value) && number(value.x, 0, area.width) && number(value.y, 0, area.height);

function entries(value) {
  check(Array.isArray(value) && value.every(entry => Array.isArray(entry) && entry.length === 2));
  const result = new Map(value);
  check(result.size === value.length);
  return result;
}

function restoreSkills(data) {
  const skills = entries(data);
  check(skills.size === skillDefinitions.size);
  for (const [id, { requiredXp }] of skillDefinitions) {
    const skill = skills.get(id);
    check(record(skill) && integer(skill.value, initialSkill, maxSkill));
    if (!requiredXp) check(skill.value === initialSkill && skill.experience === 0);
    else if (skill.value === maxSkill) check(skill.experience === 0);
    else check(integer(skill.experience, 0, requiredXp(skill.value) - 1));
  }
  return structuredClone(skills);
}

function restorePlayer(data, area, savedVersion) {
  const legacy = savedVersion === 1;
  const requiredXp = legacy ? 30 + 10 * (data?.level - 1) : experienceToNextLevel(data?.level);
  check(position(data, area) && integer(data.level, 1) && integer(data.experience, 0, requiredXp - 1)
    && number(data.hp, Number.MIN_VALUE, maxHealth(data.level)) && number(data.mp, 0, maxMp)
    && number(data.pendingPoison) && number(data.cooldown));
  const { hp, mp, level, experience, weaponId, pendingPoison, cooldown } = data;
  const displaced = savedVersion < 4 && area === field && facilityAt(data);
  const { x, y } = displaced ? displaced.door : data;
  const bounded = { x, y };
  movePlayer(bounded, 0, 0, 0, area);
  check(bounded.x === x && bounded.y === y);
  if (area === field) {
    // A valid position must also be able to move to itself with the normal collision rules.
    const probe = { x: x - 0.001, y };
    movePlayer(probe, 1, 0, 0.001 / settings.player.speed, area);
    check(Math.abs(probe.x - x) < 1e-8);
  }
  const inventory = entries(data.inventory);
  for (const [id, count] of inventory) check(items.has(id) && integer(count, 1));
  const armor = entries(data.armor);
  const player = { id: 'player', x, y, hp, mp, level, experience, weaponId, pendingPoison, cooldown,
    inventory, armor, skills: legacy ? createSkills() : restoreSkills(data.skills), flash: 0, moving: false };
  check(weaponId === null || canEquipItem(player, weaponId, 'weapon'));
  for (const [slot, id] of armor) check(slot !== 'weapon' && canEquipItem(player, id, slot));
  if (legacy) {
    // Preserve the fraction of progress towards the next level.
    const next = experienceToNextLevel(level);
    player.experience = Math.min(next - 1, Math.floor(experience / requiredXp * next));
  }
  return player;
}

function restoreArea(data, area) {
  check(data?.id === area.id && Array.isArray(data.encounters) && data.encounters.length === area.spawns.length
    && Array.isArray(data.lootDrops));
  const encounters = area.spawns.map((home, index) => {
    const { id, remaining, generation, enemy } = data.encounters[index];
    check(id === home.id && integer(generation) && number(remaining, 0, settings.enemy.spawnDelay));
    const maxHp = enemyTypes[home.kind].maxHp;
    check(enemy === null || (generation > 0 && position(enemy, area)
      && number(enemy.hp, Number.MIN_VALUE, maxHp) && number(enemy.cooldown)));
    return { home, remaining, generation, enemy: enemy && {
      id: `enemy-${home.id}-${generation}`, kind: home.kind, x: enemy.x, y: enemy.y,
      hp: enemy.hp, maxHp, cooldown: enemy.cooldown, flash: 0,
    } };
  });
  const lootDrops = data.lootDrops.map(drop => {
    check(position(drop, area) && integer(drop.gold) && Array.isArray(drop.materials)
      && drop.materials.length <= 5 && drop.materials.every(id => items.get(id)?.category === 'materials'));
    return { x: drop.x, y: drop.y, gold: drop.gold, materials: [...drop.materials] };
  });
  return { encounters, lootDrops };
}

function restoreGuilds(data, day) {
  const guilds = entries(data);
  for (const [id, board] of guilds) {
    check(Object.hasOwn(guildDoors, id) && record(board) && integer(board.gold)
      && integer(board.day, gameDay(0), day) && Array.isArray(board.quests) && board.quests.length === 5);
    const ids = new Set();
    for (const quest of board.quests) {
      check(record(quest) && typeof quest.id === 'string' && !ids.has(quest.id)
        && typeof quest.title === 'string' && integer(quest.reward)
        && ['active', 'offered', 'reported'].includes(quest.status) && record(quest.progress));
      ids.add(quest.id);
      if (quest.material) {
        check(items.get(quest.material)?.category === 'materials' && integer(quest.quantity, 1));
      } else {
        check(typeof quest.templateId === 'string' && record(quest.targets) && Object.keys(quest.targets).length > 0);
        for (const [kind, count] of Object.entries(quest.targets)) check(Object.hasOwn(enemyTypes, kind) && integer(count, 1));
        for (const [kind, count] of Object.entries(quest.progress)) {
          check(Object.hasOwn(quest.targets, kind) && integer(count, 0, quest.targets[kind]));
        }
      }
    }
  }
  return structuredClone(guilds);
}

export function restoreSave(data) {
  check(data?.format === format && [1, 2, 3, 4, version].includes(data.version) && integer(data.clock, 0, 1_000_000_000_000)
    && integer(data.gold) && record(data.shopGold));
  const area = areas.find(entry => entry.id === data.area);
  check(area && Array.isArray(data.areas) && data.areas.length === areas.length);
  const player = restorePlayer(data.player, area, data.version);
  const areaStates = new Map(areas.map((entry, index) => [entry, restoreArea(data.areas[index], entry)]));
  const day = gameDay(data.clock);
  const guilds = restoreGuilds(data.guilds, day);
  const shopGold = Object.fromEntries(Object.keys(shopDoors).map(id => {
    if (data.version < 4 && !Object.hasOwn(data.shopGold, id)
      && id !== 'goods-shop' && id !== 'weapon-shop') return [id, startingShopGold];
    check(integer(data.shopGold[id]));
    return [id, data.shopGold[id]];
  }));
  const nations = data.version >= 3 ? restoreNations(data.nations, data.clock) : createNationSimulation(data.clock);
  let harvest = null;
  if (data.version === version && data.harvest !== null) {
    const source = findSource(nations, entry => entry.id === data.harvest?.id)?.source;
    check(area === field && source && source.readyAt <= data.clock
      && number(data.harvest.elapsed, 0, harvestSeconds[source.kind]));
    harvest = { source, elapsed: data.harvest.elapsed };
  }
  return { player, area, areaStates, nations, gold: data.gold, guilds, shopGold, harvest, clock: data.clock };
}
