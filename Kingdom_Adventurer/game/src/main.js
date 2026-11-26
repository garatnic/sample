import { settings } from './settings.js';
import { innDoor, shopDoor, inTown, movePlayer, start, town } from './world.js?v=14';
import { createEncounters, updateCombat } from './combat.js?v=15';
import { experienceToNextLevel, maxHealth } from './growth.js?v=5';
import { createInput } from './input.js?v=6';
import { createRenderer } from './render.js?v=14';
import { setupGearMenus } from './gear-ui.js?v=15';

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
const hp = document.querySelector('#hp');
const health = document.querySelector('#health');
const locationLabel = document.querySelector('#location');
const notice = document.querySelector('#notice');
const canvas = document.querySelector('canvas');
const input = createInput(canvas);
const render = createRenderer(canvas);

function createPlayer({ level = 1, experience = 0, inventory = new Map(), weaponId = null, armor = new Map() } = {}) {
  return { id: 'player', ...start, level, experience, inventory, weaponId, armor, hp: maxHealth(level), cooldown: 0, flash: 0, moving: false };
}

const state = { player: createPlayer(), encounters: createEncounters(), strike: null,
  notice: null, innContact: false, gold: settings.currency.startingGold, goldDrops: [], shopContact: false, shopGold: 0 };
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
  state.strike = null;
  state.notice = null;
  state.innContact = false;
  state.shopContact = false;
});

function collectGold() {
  let collected = 0;
  for (let i = state.goldDrops.length - 1; i >= 0; i--) {
    const drop = state.goldDrops[i];
    if (Math.hypot(state.player.x - drop.x, state.player.y - drop.y) <= settings.currency.pickupRadius) {
      collected += drop.gold;
      state.goldDrops.splice(i, 1);
    }
  }
  if (collected > 0) {
    state.gold += collected;
    if (!state.notice?.leveledUp) {
      state.notice = { text: `${collected}Gを拾いました`, remaining: 1.7 };
    }
  }
}

function update(dt) {
  const { player } = state;
  const direction = input.read();
  const { x, y } = player;
  movePlayer(player, direction.x, direction.y, dt);
  player.moving = x !== player.x || y !== player.y;
  player.flash = Math.max(0, player.flash - dt);
  if (state.notice && (state.notice.remaining -= dt) <= 0) state.notice = null;
  if (state.strike && (state.strike.remaining -= dt) <= 0) state.strike = null;

  collectGold();

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

  const touchingShop = Math.hypot(player.x - shopDoor.x, player.y - shopDoor.y) <= 19;
  const enteringShop = touchingShop && !state.shopContact;
  state.shopContact = touchingShop;
  if (enteringShop) {
    openShop();
    return;
  }

  updateCombat(state, dt);
  if (player.hp === 0) {
    input.clear();
    player.moving = false;
    death.showModal();
  }
}

function setText(element, value) {
  if (element.textContent !== value) element.textContent = value;
}

let previous = performance.now();
function frame(time) {
  const dt = Math.min((time - previous) / 1000, 0.04);
  previous = time;
  if (!document.querySelector('dialog[open]') && state.player.hp > 0) update(dt);
  const { level, experience, hp: currentHp } = state.player;
  const maxHp = maxHealth(level);
  if (health.max !== maxHp) health.max = maxHp;
  health.value = currentHp;
  setText(progress, `Lv.${level} · XP ${experience} / ${experienceToNextLevel(level)}`);
  setText(gold, `${state.gold}G`);
  setText(hp, `${Math.ceil(currentHp * 10) / 10} / ${maxHp}`);
  setText(locationLabel, inTown(state.player) ? town.name : '街道とその周辺');
  setText(notice, state.notice?.text ?? '');
  render(state, time);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
