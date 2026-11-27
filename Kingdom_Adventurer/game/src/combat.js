import { animalTypes, mobTypes, settings } from './settings.js?v=49';
import { playerAttack, recordWeaponHit } from './weapon-skill.js?v=49';
import { field } from './world.js?v=50';
import { mobsIn, moveNearbyMobs, removeMob } from './mob-world.js?v=51';
import { attackInterval, defenseRating, items } from './equipment.js?v=39';
import { recordDefeat } from './quests.js?v=49';
import { dropLoot } from './loot.js?v=49';

export function physicalDamage(attack, defense, damageMultiplier) {
  const reductionBasisPoints = Math.min(8000, Math.max(0, defense) * 12);
  const remainingFraction = (10000 - reductionBasisPoints) / 10000;
  return attack * damageMultiplier * remainingFraction;
}

export function createEncounters(spawns = field.spawns) {
  return spawns.map(home => ({ home, enemy: null, remaining: 0, generation: 0 }));
}

function canChase(player, enemy, home, config) {
  return Math.hypot(player.x - enemy.x, player.y - enemy.y) < config.aggro
    && Math.hypot(player.x - home.x, player.y - home.y) < config.leash;
}

function* localEncounters(state) {
  if (state.area !== field || !state.mobWorld) {
    yield* state.encounters;
    return;
  }
  const { x, y } = state.player;
  const range = settings.enemy.aggro;
  for (const enemy of mobsIn(state.mobWorld, x - range, y - range, x + range, y + range)) {
    yield { enemy };
  }
}

export function inCombat(state) {
  if (state.strike) return true;
  for (const { home, enemy } of localEncounters(state)) {
    if (!enemy || animalTypes[enemy.kind]) continue;
    if (home ? canChase(state.player, enemy, home, settings.enemy)
      : Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y) < settings.enemy.aggro) return true;
  }
  return false;
}

export function markHuntedAnimal(world, x, y) {
  const hitRadius = 22;
  let nearest = hitRadius;
  let target = null;
  for (const mob of mobsIn(world, x - hitRadius, y - hitRadius, x + hitRadius, y + hitRadius)) {
    if (!Object.hasOwn(animalTypes, mob.kind)) continue;
    const distance = Math.hypot(x - mob.x, y - mob.y);
    if (distance > nearest) continue;
    nearest = distance;
    target = mob;
  }
  if (target) target.hunted = true;
}

export function updateCombat(state, dt, hunt = false) {
  const { player } = state;
  const config = settings.enemy;
  const { playerDamageMultiplier, enemyDamageMultiplier } = settings.difficulty;
  const outdoors = (state.area ?? field) === field;
  if (outdoors && state.mobWorld) moveNearbyMobs(state.mobWorld, player, dt);
  const encounters = [...localEncounters(state)];
  player.cooldown = Math.max(0, player.cooldown - dt);

  for (const encounter of encounters) {
    const { home } = encounter;
    if (home && !encounter.enemy) {
      encounter.remaining = Math.max(0, encounter.remaining - dt);
      if (encounter.remaining <= 0) {
        const type = mobTypes[home.kind];
        encounter.enemy = { id: `enemy-${home.id}-${++encounter.generation}`,
          kind: home.kind, x: home.x, y: home.y, hp: type.maxHp, maxHp: type.maxHp, cooldown: 0, flash: 0, flee: 0, hunted: false };
      }
    }
    const enemy = encounter.enemy;
    if (!enemy || animalTypes[enemy.kind]) continue;
    const type = mobTypes[enemy.kind];
    if (home) {
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    }
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    const chasing = home ? canChase(player, enemy, home, config) : distance < config.aggro;
    if (chasing && distance <= config.reach + 1e-6) {
      if (enemy.cooldown === 0) {
        player.hp = Math.max(0, player.hp - physicalDamage(type.damage, defenseRating(player), enemyDamageMultiplier));
        player.flash = 0.22;
        enemy.cooldown = type.attackDelay;
        if (player.hp === 0) return;
      }
    } else if (home) {
      const goal = chasing ? player : home;
      const dx = goal.x - enemy.x;
      const dy = goal.y - enemy.y;
      const length = Math.hypot(dx, dy);
      if (length > 0) {
        const step = Math.min(type.speed * dt, length) / length;
        const next = { x: enemy.x + dx * step, y: enemy.y + dy * step };
        Object.assign(enemy, next);
      }
    }
  }

  if (player.cooldown > 0) return;
  let nearest = null;
  const weapon = items.get(player.weaponId);
  let range = weapon?.range ?? settings.player.range;
  for (const encounter of encounters) {
    if (!encounter.enemy) continue;
    const animal = Boolean(animalTypes[encounter.enemy.kind]);
    if (hunt ? !animal : animal && !encounter.enemy.hunted) continue;
    const distance = Math.hypot(player.x - encounter.enemy.x, player.y - encounter.enemy.y);
    if (distance > range) continue;
    range = distance;
    nearest = encounter;
  }
  if (!nearest) return;
  const enemy = nearest.enemy;
  player.cooldown = attackInterval(weapon);
  state.strike = { x: enemy.x, y: enemy.y, remaining: 0.16 };
  const attack = playerAttack(player, weapon);
  const levelBeforeHit = player.level;
  const poisonDamage = player.pendingPoison ?? 0;
  player.pendingPoison = 0;
  const damage = physicalDamage(attack, mobTypes[enemy.kind].defense, playerDamageMultiplier);
  enemy.hp -= damage + poisonDamage;
  recordWeaponHit(player, weapon, damage);
  enemy.flash = 0.18;
  if (animalTypes[enemy.kind] && damage + poisonDamage > 0) {
    enemy.hunted = true;
    enemy.flee = 3;
  }
  if (enemy.hp <= 0) {
    if (!animalTypes[enemy.kind]) recordDefeat(state, enemy.kind);
    if (nearest.home) {
      nearest.enemy = null;
      nearest.remaining = config.spawnDelay;
    } else {
      removeMob(state.mobWorld, enemy);
    }
    dropLoot(state, enemy, mobTypes[enemy.kind]);
    state.notice = { text: `${mobTypes[enemy.kind].name}を撃破`, remaining: 1.7 };
  }
  if (player.level > levelBeforeHit) {
    state.notice = { text: `レベルアップ！ Lv.${player.level}`, remaining: 2.5, leveledUp: true };
  }
}
