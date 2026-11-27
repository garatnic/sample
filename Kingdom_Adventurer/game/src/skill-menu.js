import { maxSkill, skillDefinitions, skillGroups } from './skills.js?v=32';

export function setupSkillMenu(state, input) {
  const dialog = document.querySelector('#skill-menu');
  const groups = document.querySelector('#skill-groups');
  document.querySelector('#open-skills').addEventListener('click', () => {
    if (document.querySelector('dialog[open]') || state.player.hp <= 0) return;
    input.clear();
    groups.replaceChildren();
    for (const group of skillGroups) {
      const heading = document.createElement('h3');
      const list = document.createElement('ul');
      heading.textContent = group.name;
      for (const [id, name] of group.skills) {
        const item = document.createElement('li');
        const requiredXp = skillDefinitions.get(id).requiredXp;
        item.textContent = name;
        if (requiredXp) {
          const { value, experience } = state.player.skills.get(id);
          item.textContent += value === maxSkill ? ` ${value}（上限）`
            : ` ${value} · XP ${experience} / ${requiredXp(value)}`;
        }
        list.append(item);
      }
      groups.append(heading, list);
    }
    dialog.showModal();
  });
}
