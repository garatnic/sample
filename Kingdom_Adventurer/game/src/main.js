import { createSkills } from './skills.js?v=32';
import { setupSkillMenu } from './skill-menu.js?v=32';
import { settings } from './settings.js?v=34';
import { cave, field, guildDoors, innDoors, shopDoors, movePlayer, portalRadius, start } from './world.js?v=35';
import { createEncounters, inCombat, updateCombat } from './combat.js?v=35';
import { experienceToNextLevel, maxHealth } from './growth.js?v=32';
import { createInput } from './input.js?v=6';
import { createRenderer } from './render.js?v=35';
import { setupGearMenus } from './gear-ui.js?v=35';
import { exactGameMinutes, gameDateTime, gameDay, gameMinutes, nextMorningMinute } from './clock.js?v=34';
import { maxMp } from './consumables.js?v=27';

import { setupQuestMenus } from './quests.js?v=27';

import { collectLoot } from './loot.js?v=27';

import { createTrees, updateTrees } from './trees.js?v=28';
import { items } from './equipment.js?v=32';
import { areas, makeSave, restoreSave } from './save-data.js?v=35';
import { setupSaveMenu } from './save-menu.js?v=31';

import { advanceNations, createNationSimulation, settlementBuildings } from './nation-simulation.js?v=35';
import { inSettlement } from './nation-layout.js?v=35';
import { setupNationMenu } from './nation-menu.js?v=35';

import { startingShopGold } from './shop.js?v=35';

const inn = document.querySelector('#inn');
const death = document.querySelector('#death');
const innOffer = document.querySelector('#inn-offer');
const innConfirm = document.querySelector('#inn-confirm');
const gold = document.querySelector('#gold');
const progress = document.querySelector('#progress');
const hudToggle = document.querySelector('#hud-toggle');
const hudDetails = document.querySelector('#hud-details');
hudToggle.addEventListener('click', () => {
  hudDetails.hidden = !hudDetails.hidden;
  hudToggle.setAttribute('aria-expanded', String(!hudDetails.hidden));
  hudToggle.setAttribute('aria-label', hudDetails.hidden ? '詳細を表示' : '詳細を閉じる');
});
const mp = document.querySelector('#hud-mp');
const hp = document.querySelector('#hp');
const health = document.querySelector('#health');
const locationLabel = document.querySelector('#location');
const clockDate = document.querySelector('#clock-date');
const clockTime = document.querySelector('#clock-time');
const notice = document.querySelector('#notice');
const canvas = document.querySelector('canvas');
const input = createInput(canvas);
const render = createRenderer(canvas);

function createPlayer({ level = 1, experience = 0, inventory = new Map(), weaponId = null, armor = new Map(), skills = createSkills() } = {}) {
  return { id: 'player', ...start, level, experience, inventory, weaponId, armor, skills, hp: maxHealth(level), mp: maxMp, pendingPoison: 0, cooldown: 0, flash: 0, moving: false };
}

const areaStates = new Map(areas.map(area => [
  area, { encounters: createEncounters(area.spawns), lootDrops: [] },
]));
const startingWeaponId = 'iron-dagger';
const state = {
  player: createPlayer({ inventory: new Map([[startingWeaponId, 1]]), weaponId: startingWeaponId }),
  area: field,
  nations: createNationSimulation(),
  centerContact: null,
  get encounters() { return areaStates.get(this.area).encounters; },
  get lootDrops() { return areaStates.get(this.area).lootDrops; },
  strike: null, resources: createTrees(gameDay(0)),
  notice: null, innContact: null, gold: settings.currency.startingGold, shopContact: null, shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, startingShopGold])) };
Object.assign(state, { guilds: new Map(), guildContact: null });
function applySave({ areaStates: savedAreas, clock, ...savedState }) {
  Object.assign(state, savedState, { strike: null, notice: null });
  for (const [area, value] of savedAreas) areaStates.set(area, value);
  clockBaseMinute = clock;
  elapsedPlaySeconds = 0;
  state.centerContact = nearbyCenter()?.id ?? null;
  state.innContact = nearbyDoor(innDoors);
  state.shopContact = nearbyDoor(shopDoors);
  state.guildContact = nearbyDoor(guildDoors);
  input.clear();
}

function saveNotice(text) {
  state.notice = { text, remaining: 4 };
}

inn.addEventListener('close', () => {
  if (inn.returnValue === 'yes' && state.gold >= settings.inn.price) {
    state.gold -= settings.inn.price;
    state.player.hp = maxHealth(state.player.level);
    state.player.flash = 0;
    clockBaseMinute = nextMorningMinute(currentGameMinute());
    elapsedPlaySeconds = 0;
    advanceNations(state.nations, clockBaseMinute);
    state.notice = { text: `翌朝6時になり、HPが全回復しました（−${settings.inn.price}G）`, remaining: 2 };
    void saves.autoSave();
  }
});
death.addEventListener('cancel', event => event.preventDefault());
death.addEventListener('close', () => {
  state.player = createPlayer(state.player);
  state.area = field;
  state.resources.harvest = null;
  state.strike = null;
  state.notice = null;
  state.innContact = null;
  state.centerContact = null;
  state.shopContact = null;
  state.guildContact = null;
});

function nearbyDoor(doors) {
  if (state.area !== field) return null;
  return Object.keys(doors).find(id => {
    const door = doors[id];
    return Math.hypot(state.player.x - door.x, state.player.y - door.y) <= 19;
  }) ?? null;
}

function nearbyCenter() {
  if (state.area !== field) return null;
  return state.nations.nations.find(nation => {
    const { door } = nation.cities[0].buildings.find(b => b.kind === 'center');
    return Math.hypot(state.player.x - door.x, state.player.y - door.y) <= 19;
  });
}

function update(dt) {
  const { player } = state;
  const direction = input.read();
  const { x, y } = player;
  movePlayer(player, direction.x, direction.y, dt, state.area, state.area === field ? settlementBuildings(state.nations) : []);
  player.moving = x !== player.x || y !== player.y;
  player.flash = Math.max(0, player.flash - dt);
  if (state.notice && (state.notice.remaining -= dt) <= 0) state.notice = null;
  if (state.strike && (state.strike.remaining -= dt) <= 0) state.strike = null;

  const outdoors = state.area === field;
  const portal = outdoors ? cave.entrance : cave.exit;
  if (Math.hypot(player.x - portal.x, player.y - portal.y) <= portalRadius) {
    state.area = outdoors ? cave : field;
    Object.assign(player, outdoors ? cave.caveArrival : cave.fieldArrival);
    state.resources.harvest = null;
    state.strike = null;
    state.notice = null;
    player.moving = false;
    void saves.autoSave();
    return;
  }

  const center = nearbyCenter();
  const enteringCenter = center && center.id !== state.centerContact;
  state.centerContact = center?.id ?? null;
  if (enteringCenter) {
    openNation(center);
    return;
  }

  collectLoot(state);

  const touchingInn = nearbyDoor(innDoors);
  const enteringInn = touchingInn && touchingInn !== state.innContact;
  state.innContact = touchingInn;
  if (enteringInn) {
    input.clear();
    const price = settings.inn.price;
    innConfirm.disabled = state.gold < price;
    setText(innOffer, innConfirm.disabled
      ? `宿泊料は${price}Gです。所持金が足りません（所持金 ${state.gold}G）。`
      : `${price}Gを払って翌朝6時まで休み、HPを全回復しますか？（所持金 ${state.gold}G）`);
    inn.returnValue = 'no';
    inn.showModal();
    return;
  }

  const touchingShop = nearbyDoor(shopDoors);
  const enteringShop = touchingShop && touchingShop !== state.shopContact;
  state.shopContact = touchingShop;
  if (enteringShop) {
    try {
      openShop(touchingShop);
      return;
    } catch (error) {
      console.error('Shop menu failed to open', error);
      state.notice = { text: '店のメニューを開けませんでした。入口に入り直してください。', remaining: 3 };
    }
  }

  const touchingGuild = nearbyDoor(guildDoors);
  const enteringGuild = touchingGuild && touchingGuild !== state.guildContact;
  state.guildContact = touchingGuild;
  if (enteringGuild) {
    openGuild(touchingGuild, gameDay(currentGameMinute()));
    return;
  }

  updateCombat(state, dt);
  if (outdoors && player.hp > 0) {
    const fruit = updateTrees(state.resources, player, dt, gameDay(currentGameMinute()));
    if (fruit && !state.notice?.leveledUp) {
      state.notice = { text: `${items.get(fruit).name}を1個採取しました`, remaining: 1.2 };
    }
  }
  if (player.hp === 0) {
    state.resources.harvest = null;
    input.clear();
    player.moving = false;
    death.showModal();
  }
}

function setText(element, value) {
  if (element.textContent !== value) element.textContent = value;
}

let previous = performance.now();
let elapsedPlaySeconds = 0;
let clockBaseMinute = 0;

function currentGameMinute() {
  return clockBaseMinute + gameMinutes(elapsedPlaySeconds);
}

let previousClockMinute = -1;
function frame(time) {
  const dt = Math.min((time - previous) / 1000, 0.04);
  previous = time;
  if (!document.querySelector('dialog[open]') && state.player.hp > 0) {
    elapsedPlaySeconds += dt;
    advanceNations(state.nations, currentGameMinute());
    update(dt);
  }
  const minute = currentGameMinute();
  if (minute !== previousClockMinute) {
    previousClockMinute = minute;
    const clock = gameDateTime(minute);
    setText(clockDate, clock.date);
    setText(clockTime, clock.time);
  }
  const { level, experience, hp: currentHp } = state.player;
  const maxHp = maxHealth(level);
  if (health.max !== maxHp) health.max = maxHp;
  health.value = currentHp;
  setText(progress, `Lv.${level} · XP ${experience} / ${experienceToNextLevel(level)}`);
  setText(gold, `${state.gold}G`);
  setText(mp, `MP ${state.player.mp} / ${maxMp}`);
  setText(hp, `${Math.ceil(currentHp * 10) / 10} / ${maxHp}`);
  const city = state.nations.nations.find(nation => inSettlement(nation.cities[0], state.player))?.cities[0];
  setText(locationLabel, state.area === cave ? cave.name : city?.name ?? '街道とその周辺');
  setText(notice, state.notice?.text ?? '');
  render(state, time, clockBaseMinute + exactGameMinutes(elapsedPlaySeconds));
  requestAnimationFrame(frame);
}

const saves = setupSaveMenu({
  input,
  canSave: () => state.player.hp > 0 && !inCombat(state),
  capture: () => makeSave(state, areaStates, currentGameMinute()),
  decode: restoreSave,
  restore: applySave,
  notify: saveNotice,
});
await saves.loadOnStart();
const openNation = setupNationMenu(state, input, field);
const openGuild = setupQuestMenus(state, input);
const openShop = setupGearMenus(state, input);
setupSkillMenu(state, input);
previous = performance.now();
requestAnimationFrame(frame);
