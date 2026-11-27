import { attackDamage } from './growth.js?v=32';
import { gainSkillExperience, initialSkill } from './skills.js?v=32';

const oneHanded = 'one-handed';

export function playerAttack(player, weapon) {
  const bonus = weapon?.bonus ?? 0;
  const value = player.skills?.get(oneHanded)?.value ?? initialSkill;
  const multiplier = weapon?.skill === oneHanded ? 1 + value / 200 : 1;
  return attackDamage(player.level) + bonus * multiplier;
}

export function recordWeaponHit(player, weapon, physicalDamage) {
  if (weapon?.skill === oneHanded && physicalDamage > 0) {
    gainSkillExperience(player, oneHanded, weapon.bonus * 6);
  }
}
