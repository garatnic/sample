import { settings } from './settings.js';
import { innDoor, inTown, movePlayer, start, town } from './world.js';
import { createEncounters, updateCombat } from './combat.js';
import { createInput } from './input.js';
import { createRenderer } from './render.js';

const inn = document.querySelector('#inn');
const death = document.querySelector('#death');
const hp = document.querySelector('#hp');
const health = document.querySelector('#health');
const locationLabel = document.querySelector('#location');
const notice = document.querySelector('#notice');
const input = createInput(document.querySelector('#stick'), document.querySelector('#knob'));
const render = createRenderer(document.querySelector('canvas'));

function createPlayer() {
  return { id: 'player', ...start, hp: settings.player.maxHp, cooldown: 0, flash: 0, moving: false };
}

const state = { player: createPlayer(), encounters: createEncounters(), strike: null,
  notice: null, innContact: false };

inn.addEventListener('close', () => {
  if (inn.returnValue === 'yes') {
    state.player.hp = settings.player.maxHp;
    state.player.flash = 0;
    state.notice = { text: 'HPが全回復しました', remaining: 2 };
  }
});
death.addEventListener('cancel', event => event.preventDefault());
death.addEventListener('close', () => {
  state.player = createPlayer();
  state.strike = null;
  state.notice = null;
  state.innContact = false;
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

  const touchingInn = Math.hypot(player.x - innDoor.x, player.y - innDoor.y) <= 19;
  if (touchingInn && !state.innContact) {
    state.innContact = true;
    input.clear();
    inn.returnValue = 'no';
    inn.showModal();
    return;
  }
  state.innContact = touchingInn;

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

health.max = settings.player.maxHp;
let previous = performance.now();
function frame(time) {
  const dt = Math.min((time - previous) / 1000, 0.04);
  previous = time;
  if (!inn.open && !death.open && state.player.hp > 0) update(dt);
  health.value = state.player.hp;
  setText(hp, `${state.player.hp} / ${settings.player.maxHp}`);
  setText(locationLabel, inTown(state.player) ? town.name : '街道とその周辺');
  setText(notice, state.notice?.text ?? '');
  render(state, time);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
