import { enemyTypes, settings } from './settings.js?v=15';
import { attackDamage, gainExperience, growth } from './growth.js?v=5';
import { inTown, spawns } from './world.js?v=24';
import { attackInterval, defenseRating, items } from './equipment.js?v=20';
import { recordDefeat } from './quests.js?v=24';

export function physicalDamage(attack, defense, damageMultiplier) {
  const reductionBasisPoints = Math.min(8000, Math.max(0, defense) * 12);
  const remainingFraction = (10000 - reductionBasisPoints) / 10000;
  return attack * damageMultiplier * remainingFraction;
}

export function createEncounters() {
  return spawns.map(home => ({ home, enemy: null, remaining: 0, generation: 0 }));
}

export function updateCombat(state, dt) {
  const { player, encounters } = state;
  const config = settings.enemy;
  const { playerDamageMultiplier, enemyDamageMultiplier } = settings.difficulty;
  const safe = inTown(player);
  player.cooldown = Math.max(0, player.cooldown - dt);

  for (const encounter of encounters) {
    const { home } = encounter;
    const kind = home.kind;
    const type = enemyTypes[kind];
    if (!encounter.enemy) {
      encounter.remaining -= dt;
      if (encounter.remaining <= 0) {
        encounter.enemy = { id: `enemy-${home.id}-${++encounter.generation}`,
          kind, x: home.x, y: home.y, hp: type.maxHp, maxHp: type.maxHp, gold: config.gold, cooldown: 0, flash: 0 };
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
        player.hp = Math.max(0, player.hp - physicalDamage(type.damage, defenseRating(player), enemyDamageMultiplier));
        player.flash = 0.22;
        enemy.cooldown = type.attackDelay;
        if (player.hp === 0) return;
      }
    } else {
      const goal = chasing ? player : home;
      const dx = goal.x - enemy.x;
      const dy = goal.y - enemy.y;
      const length = Math.hypot(dx, dy);
      if (length > 0) {
        const step = Math.min(type.speed * dt, length) / length;
        const next = { x: enemy.x + dx * step, y: enemy.y + dy * step };
        if (!inTown(next)) Object.assign(enemy, next);
      }
    }
  }

  if (safe || player.cooldown > 0) return;
  let nearest = null;
  const weapon = items.get(player.weaponId);
  let range = weapon?.range ?? settings.player.range;
  for (const encounter of encounters) {
    if (!encounter.enemy) continue;
    const distance = Math.hypot(player.x - encounter.enemy.x, player.y - encounter.enemy.y);
    if (distance > range) continue;
    range = distance;
    nearest = encounter;
  }
  if (!nearest) return;
  const enemy = nearest.enemy;
  player.cooldown = attackInterval(weapon);
  state.strike = { x: enemy.x, y: enemy.y, remaining: 0.16 };
  const attack = attackDamage(player.level) + (weapon?.bonus ?? 0);
  const poisonDamage = player.pendingPoison ?? 0;
  player.pendingPoison = 0;
  enemy.hp -= physicalDamage(attack, enemyTypes[enemy.kind].defense, playerDamageMultiplier) + poisonDamage;
  enemy.flash = 0.18;
  if (enemy.hp <= 0) {
    recordDefeat(state, enemy.kind);
    nearest.enemy = null;
    nearest.remaining = config.spawnDelay;
    if (enemy.gold > 0) state.goldDrops.push({ x: enemy.x, y: enemy.y, gold: enemy.gold });
    const leveledUp = gainExperience(player, growth.defeatExperience);
    state.notice = leveledUp
      ? { text: `レベルアップ！ Lv.${player.level}`, remaining: 2.5, leveledUp: true }
      : { text: `${enemyTypes[enemy.kind].name}を撃破（+${growth.defeatExperience} XP）`, remaining: 1.7 };
  }
}
