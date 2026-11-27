import { gainExperience } from './growth.js?v=32';

export const initialSkill = 15;
export const maxSkill = 100;
export const skillGroups = [
  { name: '戦闘系', skills: [
    ['one-handed', '片手武器', value => Math.ceil(2 * value ** 1.95)],
    ['two-handed', '両手武器'], ['archery', '弓術'], ['block', '防御'], ['heavy-armor', '重装'], ['smithing', '鍛冶'],
  ] },
  { name: '魔法系', skills: [
    ['destruction', '破壊'], ['restoration', '回復'], ['conjuration', '召喚'], ['illusion', '幻惑'],
    ['alteration', '変性'], ['enchanting', '付呪'],
  ] },
  { name: '隠密系', skills: [
    ['sneak', '隠密'], ['lockpicking', '開錠'], ['pickpocket', 'スリ'], ['speech', '話術'],
    ['light-armor', '軽装'], ['alchemy', '錬金術'],
  ] },
];

export const skillDefinitions = new Map(skillGroups.flatMap(group => group.skills.map(([id, name, requiredXp]) =>
  [id, { name, group: group.name, requiredXp }])));

export function createSkills() {
  return new Map([...skillDefinitions.keys()].map(id => [id, { value: initialSkill, experience: 0 }]));
}

export function gainSkillExperience(player, id, amount) {
  const requiredXp = skillDefinitions.get(id)?.requiredXp;
  const skill = player.skills?.get(id);
  if (!requiredXp || !skill || skill.value >= maxSkill || !Number.isFinite(amount) || amount <= 0) return 0;
  skill.experience += amount;
  let characterExperience = 0;
  while (skill.value < maxSkill && skill.experience >= requiredXp(skill.value)) {
    skill.experience -= requiredXp(skill.value);
    skill.value++;
    characterExperience += skill.value;
  }
  if (skill.value === maxSkill) skill.experience = 0;
  if (characterExperience > 0) gainExperience(player, characterExperience);
  return characterExperience;
}
