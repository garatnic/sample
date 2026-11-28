import { discoverLocation, setupWorldMap } from './world-map.js?v=62';
import { createSkills } from './skills.js?v=49';
import { setupSkillMenu } from './skill-menu.js?v=49';
import { settings } from './settings.js?v=49';
import { cave, field, guildDoors, innDoors, shopDoors, tradeDoors, movePlayer, portalRadius, start } from './world.js?v=55';
import { createEncounters, inCombat, markHuntedAnimal, updateCombat } from './combat.js?v=62';
import { experienceToNextLevel, maxHealth } from './growth.js?v=49';
import { createInput } from './input.js?v=42';
import { createRenderer } from './render.js?v=62';
import { setupGearMenus } from './gear-ui.js?v=62';
import { exactGameMinutes, gameDateTime, gameDay, nextMorningMinute } from './clock.js?v=34';
import { maxMp } from './consumables.js?v=53';

import { setupQuestMenus } from './quests.js?v=53';

import { collectLoot } from './loot.js?v=56';

import { updateTrees } from './trees.js?v=53';
import { items } from './equipment.js?v=53';
import { areas, makeSave, restoreSave } from './save-data.js?v=62';
import { setupSaveMenu } from './save-menu.js?v=62';

import { createNationSimulation, settlementBuildings } from './nation-simulation.js?v=62';
import { advanceMobWorld, createMobWorld } from './mob-world.js?v=62';
import { inSettlement } from './nation-layout.js?v=53';
import { setupNationMenu } from './nation-menu.js?v=62';

import { createShopStock, settleShops, startingShopGold } from './shop.js?v=62';

import { advanceAdventurers, createAdventurers, moveAdventurers } from './adventurers.js?v=62';

let huntRequested = false;
window.addEventListener('keydown', event => {
  if (event.code === 'KeyF' && !event.repeat && !document.querySelector('dialog[open]')) huntRequested = true;
});

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
const input = createInput(canvas, event => {
  if (state.area !== field || document.querySelector('dialog[open]')) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left + Math.round(state.player.x - canvas.clientWidth / 2);
  const y = event.clientY - rect.top + Math.round(state.player.y - canvas.clientHeight / 2);
  markHuntedAnimal(state.mobWorld, x, y);
});
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
  exploredChunks: new Set(),
  nations: createNationSimulation(),
  mobWorld: createMobWorld(0),
  adventurers: createAdventurers(),
  centerContact: null,
  get encounters() { return areaStates.get(this.area).encounters; },
  get lootDrops() { return areaStates.get(this.area).lootDrops; },
  strike: null, harvest: null,
  notice: null, innContact: null, gold: settings.currency.startingGold, shopContact: null, shopStock: createShopStock(), shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, startingShopGold])) };
Object.assign(state, { guilds: new Map(), guildContact: null });
function applySave({ areaStates: savedAreas, clock, ...savedState }) {
  Object.assign(state, savedState, { strike: null, notice: null });
  for (const [area, value] of savedAreas) areaStates.set(area, value);
  clockBaseMinute = clock;
  elapsedPlaySeconds = 0;
  state.centerContact = nearbyCenter()?.id ?? null;
  state.innContact = nearbyDoor(innDoors);
  state.shopContact = nearbyDoor(retailDoors);
  state.guildContact = nearbyDoor(guildDoors);
  huntRequested = false;
  discoverLocation(state);
  input.clear();
}

function saveNotice(text) {
  state.notice = { text, remaining: 4 };
}

const retailDoors = { ...shopDoors, ...tradeDoors };
const fieldLoot = () => areaStates.get(field).lootDrops;
const updateAdventurers = (minute, dt) => advanceAdventurers(state, fieldLoot(), minute, dt);
function skipAdventurers(minute, dt) {
  moveAdventurers(state, fieldLoot(), dt, settlementBuildings(state.nations));
  updateAdventurers(minute, dt);
}
const settleNationShops = (nation, day, finance) => settleShops(state, nation, day, finance);

let resting = false;
inn.addEventListener('cancel', event => {
  if (resting) event.preventDefault();
});
inn.querySelector('form').addEventListener('submit', async event => {
  if (event.submitter?.value !== 'yes' || state.gold < settings.inn.price || resting) return;
  event.preventDefault();
  resting = true;
  state.gold -= settings.inn.price;
  const buttons = [...inn.querySelectorAll('button')];
  for (const button of buttons) button.disabled = true;
  setText(innOffer, '翌朝まで休んでいます…');
  const morning = nextMorningMinute(Math.floor(currentGameMinute()));
  // Break time skips into small steps so the dialog remains responsive on mobile.
  while (state.nations.minute < morning) {
    await new Promise(resolve => setTimeout(resolve, 0));
    const budgetEnd = performance.now() + 10;
    do {
      advanceMobWorld(state.mobWorld, state.nations, Math.min(morning, state.nations.minute + 4), null, Math.random, settleNationShops, skipAdventurers, state.adventurers.individuals);
    } while (state.nations.minute < morning && performance.now() < budgetEnd);
    clockBaseMinute = state.nations.minute;
    elapsedPlaySeconds = 0;
  }
  state.player.hp = maxHealth(state.player.level);
  state.player.flash = 0;
  state.notice = { text: `翌朝6時になり、HPが全回復しました（−${settings.inn.price}G）`, remaining: 2 };
  resting = false;
  for (const button of buttons) button.disabled = false;
  inn.close('yes');
  void saves.autoSave();
});
death.addEventListener('cancel', event => event.preventDefault());
death.addEventListener('close', () => {
  state.player = createPlayer(state.player);
  state.area = field;
  state.harvest = null;
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

function update(dt, minute, blockers) {
  const hunt = huntRequested;
  huntRequested = false;
  const { player } = state;
  const direction = input.read();
  const { x, y } = player;
  movePlayer(player, direction.x, direction.y, dt, state.area, blockers);
  discoverLocation(state);
  player.moving = x !== player.x || y !== player.y;
  player.flash = Math.max(0, player.flash - dt);
  if (state.notice && (state.notice.remaining -= dt) <= 0) state.notice = null;
  if (state.strike && (state.strike.remaining -= dt) <= 0) state.strike = null;

  const outdoors = state.area === field;
  const portal = outdoors ? cave.entrance : cave.exit;
  if (Math.hypot(player.x - portal.x, player.y - portal.y) <= portalRadius) {
    state.area = outdoors ? cave : field;
    Object.assign(player, outdoors ? cave.caveArrival : cave.fieldArrival);
    state.harvest = null;
    state.strike = null;
    state.notice = null;
    player.moving = false;
    discoverLocation(state);
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

  const touchingShop = nearbyDoor(retailDoors);
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
    openGuild(touchingGuild, gameDay(minute));
    return;
  }

  updateCombat(state, dt, hunt);
  if (outdoors && player.hp > 0) {
    const collected = updateTrees(state, dt);
    if (collected && !state.notice?.leveledUp) {
      state.notice = { text: `${items.get(collected.itemId).name}を${collected.quantity}個入手しました`, remaining: 1.2 };
    }
  }
  if (player.hp === 0) {
    state.harvest = null;
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
  return clockBaseMinute + exactGameMinutes(elapsedPlaySeconds);
}

let previousClockMinute = -1;
function frame(time) {
  const dt = Math.min((time - previous) / 1000, 0.04);
  previous = time;
  const playing = !document.querySelector('dialog[open]') && state.player.hp > 0;
  if (playing) elapsedPlaySeconds += dt;
  const exactMinute = currentGameMinute();
  const minute = Math.floor(exactMinute);
  if (playing) {
    advanceMobWorld(state.mobWorld, state.nations, exactMinute,
      state.area === field ? state.player : null, Math.random, settleNationShops, updateAdventurers, state.adventurers.individuals);
    const blockers = settlementBuildings(state.nations);
    moveAdventurers(state, fieldLoot(), dt, blockers);
    update(dt, minute, blockers);
  }
  if (minute !== previousClockMinute) {
    previousClockMinute = minute;
    const clock = gameDateTime(minute);
    setText(clockDate, clock.date);
    setText(clockTime, clock.time);
  }
  const { level, experience, hp: currentHp } = state.player;
  const maxHp = maxHealth(level);
  if (health.max !== maxHp) health.max = maxHp;
  if (health.value !== currentHp) health.value = currentHp;
  setText(progress, `Lv.${level} · XP ${experience} / ${experienceToNextLevel(level)}`);
  setText(gold, `${state.gold}G`);
  setText(mp, `MP ${state.player.mp} / ${maxMp}`);
  setText(hp, `${Math.ceil(currentHp * 10) / 10} / ${maxHp}`);
  if (state.area === cave) {
    setText(locationLabel, cave.name);
  } else {
    const city = state.nations.nations.find(nation => inSettlement(nation.cities[0], state.player))?.cities[0];
    setText(locationLabel, city?.name ?? '街道とその周辺');
  }
  setText(notice, state.notice?.text ?? '');
  if (!resting) render(state, time, exactMinute);
  requestAnimationFrame(frame);
}

const saves = setupSaveMenu({
  input,
  canSave: () => state.player.hp > 0 && !inCombat(state),
  capture: () => makeSave(state, areaStates, state.nations.minute),
  decode: restoreSave,
  restore: applySave,
  notify: saveNotice,
});
await saves.loadOnStart();
const openNation = setupNationMenu(state, input, field);
const openGuild = setupQuestMenus(state, input);
const openShop = setupGearMenus(state, input);
setupSkillMenu(state, input);
setupWorldMap(state, input);
previous = performance.now();
requestAnimationFrame(frame);
