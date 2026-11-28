import { settings } from './settings.js?v=49';

const growth = {
  hpPerLevel: 10,
  damagePerLevel: 2,
};

export function experienceToNextLevel(level) {
  return 75 + level * 25;
}

export function maxHealth(level) {
  return settings.player.maxHp + (level - 1) * growth.hpPerLevel;
}

export function attackDamage(level) {
  return settings.player.damage + (level - 1) * growth.damagePerLevel;
}

export function gainExperience(player, amount) {
  const previousLevel = player.level;
  player.experience += amount;
  while (player.experience >= experienceToNextLevel(player.level)) {
    player.experience -= experienceToNextLevel(player.level);
    player.level += 1;
  }
  player.hp += maxHealth(player.level) - maxHealth(previousLevel);
}
