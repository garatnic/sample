import { settings } from './settings.js';
import { inTown, spawns } from './world.js';

export function createEncounters() {
  return spawns.map(home => ({ home, enemy: null, remaining: 0, generation: 0 }));
}

export function updateCombat(state, dt) {
  const { player, encounters } = state;
  const config = settings.enemy;
  const safe = inTown(player);
  player.cooldown = Math.max(0, player.cooldown - dt);

  for (const encounter of encounters) {
    const { home } = encounter;
    if (!encounter.enemy) {
      encounter.remaining -= dt;
      if (encounter.remaining <= 0) {
        encounter.enemy = { id: `enemy-${home.id}-${++encounter.generation}`,
          x: home.x, y: home.y, hp: config.maxHp, cooldown: 0, flash: 0 };
      }
    }

    const enemy = encounter.enemy;
    if (!enemy) continue;
    enemy.flash = Math.max(0, enemy.flash - dt);
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    const chasing = !safe && distance < config.aggro
      && Math.hypot(player.x - home.x, player.y - home.y) < config.leash;
    if (chasing && distance <= config.reach) {
      if (enemy.cooldown === 0) {
        player.hp = Math.max(0, player.hp - config.damage);
        player.flash = 0.22;
        enemy.cooldown = config.attackDelay;
        if (player.hp === 0) return;
      }
    } else {
      const goal = chasing ? player : home;
      const dx = goal.x - enemy.x;
      const dy = goal.y - enemy.y;
      const length = Math.hypot(dx, dy);
      if (length > 0) {
        const step = Math.min(config.speed * dt, length) / length;
        const next = { x: enemy.x + dx * step, y: enemy.y + dy * step };
        if (!inTown(next)) Object.assign(enemy, next);
      }
    }
  }

  if (safe || player.cooldown > 0) return;
  let nearest = null;
  let range = settings.player.range;
  for (const encounter of encounters) {
    if (!encounter.enemy) continue;
    const distance = Math.hypot(player.x - encounter.enemy.x, player.y - encounter.enemy.y);
    if (distance > range) continue;
    range = distance;
    nearest = encounter;
  }
  if (!nearest) return;
  const enemy = nearest.enemy;
  player.cooldown = settings.player.attackDelay;
  state.strike = { x: enemy.x, y: enemy.y, remaining: 0.16 };
  enemy.hp -= settings.player.damage;
  enemy.flash = 0.18;
  if (enemy.hp <= 0) {
    nearest.enemy = null;
    nearest.remaining = config.spawnDelay;
    state.notice = { text: '魔物を撃破', remaining: 1.7 };
  }
}
