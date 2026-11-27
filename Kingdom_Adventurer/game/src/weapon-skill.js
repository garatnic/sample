import { attackDamage } from './growth.js?v=49';
import { gainSkillExperience, initialSkill } from './skills.js?v=49';

const oneHanded = 'one-handed';

export function playerAttack(player, weapon) {
  const bonus = weapon?.bonus ?? 0;
  const value = player.skills?.get(oneHanded)?.value ?? initialSkill;
  const multiplier = weapon?.skill === oneHanded ? 1 + value / 200 : 1;
  return attackDamage(player.level) + bonus * multiplier;
}

export function recordWeaponHit(player, weapon, physicalDamage) {
  if (weapon?.skill && physicalDamage > 0) {
    gainSkillExperience(player, weapon.skill, weapon.bonus * 6);
  }
}
