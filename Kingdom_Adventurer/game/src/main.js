import { settings } from './settings.js';
import { guildDoors, innDoor, shopDoors, inTown, movePlayer, start, town } from './world.js?v=24';
import { createEncounters, updateCombat } from './combat.js?v=27';
import { experienceToNextLevel, maxHealth } from './growth.js?v=5';
import { createInput } from './input.js?v=6';
import { createRenderer } from './render.js?v=27';
import { setupGearMenus } from './gear-ui.js?v=27';
import { gameDateTime, gameDay, gameMinutes } from './clock.js?v=24';
import { maxMp } from './consumables.js?v=27';

import { setupQuestMenus } from './quests.js?v=27';

import { collectLoot } from './loot.js?v=27';

import { createTrees, updateTrees } from './trees.js?v=27';
import { items } from './equipment.js?v=27';

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

function createPlayer({ level = 1, experience = 0, inventory = new Map(), weaponId = null, armor = new Map() } = {}) {
  return { id: 'player', ...start, level, experience, inventory, weaponId, armor, hp: maxHealth(level), mp: maxMp, pendingPoison: 0, cooldown: 0, flash: 0, moving: false };
}

const state = { player: createPlayer(), encounters: createEncounters(), strike: null, resources: createTrees(gameDay(0)),
  notice: null, innContact: false, gold: settings.currency.startingGold, lootDrops: [], shopContact: null, shopGold: Object.fromEntries(Object.keys(shopDoors).map(id => [id, 100])) };
Object.assign(state, { guilds: new Map(), guildContact: null });
const openGuild = setupQuestMenus(state, input);
const openShop = setupGearMenus(state, input);

inn.addEventListener('close', () => {
  if (inn.returnValue === 'yes' && state.gold >= settings.inn.price) {
    state.gold -= settings.inn.price;
    state.player.hp = maxHealth(state.player.level);
    state.player.flash = 0;
    state.notice = { text: `HPが全回復しました（−${settings.inn.price}G）`, remaining: 2 };
  }
});
death.addEventListener('cancel', event => event.preventDefault());
death.addEventListener('close', () => {
  state.player = createPlayer(state.player);
  state.resources.harvest = null;
  state.strike = null;
  state.notice = null;
  state.innContact = false;
  state.shopContact = null;
  state.guildContact = null;
});

function update(dt) {
  const { player } = state;
  const direction = input.read();
  const { x, y } = player;
  movePlayer(player, direction.x, direction.y, dt);
  player.moving = x !== player.x || y !== player.y;
  player.flash = Math.max(0, player.flash - dt);
  if (state.notice && (state.notice.remaining -= dt) <= 0) state.notice = null;
  if (state.strike && (state.strike.remaining -= dt) <= 0) state.strike = null;

  collectLoot(state);

  const touchingInn = Math.hypot(player.x - innDoor.x, player.y - innDoor.y) <= 19;
  if (touchingInn && !state.innContact) {
    state.innContact = true;
    input.clear();
    const price = settings.inn.price;
    innConfirm.disabled = state.gold < price;
    setText(innOffer, innConfirm.disabled
      ? `宿泊料は${price}Gです。所持金が足りません（所持金 ${state.gold}G）。`
      : `${price}Gを払ってHPを全回復しますか？（所持金 ${state.gold}G）`);
    inn.returnValue = 'no';
    inn.showModal();
    return;
  }
  state.innContact = touchingInn;

  const touchingShop = Object.keys(shopDoors).find(id => {
    const door = shopDoors[id];
    return Math.hypot(player.x - door.x, player.y - door.y) <= 19;
  }) ?? null;
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

  const touchingGuild = Object.keys(guildDoors).find(id => {
    const door = guildDoors[id];
    return Math.hypot(player.x - door.x, player.y - door.y) <= 19;
  }) ?? null;
  const enteringGuild = touchingGuild && touchingGuild !== state.guildContact;
  state.guildContact = touchingGuild;
  if (enteringGuild) {
    openGuild(touchingGuild, gameDay(gameMinutes(elapsedPlaySeconds)));
    return;
  }

  updateCombat(state, dt);
  if (player.hp > 0) {
    const fruit = updateTrees(state.resources, player, dt, gameDay(gameMinutes(elapsedPlaySeconds)));
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
let previousClockMinute = -1;
function frame(time) {
  const dt = Math.min((time - previous) / 1000, 0.04);
  previous = time;
  if (!document.querySelector('dialog[open]') && state.player.hp > 0) {
    elapsedPlaySeconds += dt;
    update(dt);
  }
  const minute = gameMinutes(elapsedPlaySeconds);
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
  setText(locationLabel, inTown(state.player) ? town.name : '街道とその周辺');
  setText(notice, state.notice?.text ?? '');
  render(state, time);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
