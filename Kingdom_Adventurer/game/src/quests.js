import { enemyTypes } from './settings.js?v=15';

export const questLimit = 5;
export const quests = [
  { id: 'rats', title: '大ネズミの討伐', targets: { rat: 2 }, reward: 14 },
  { id: 'wolves', title: 'オオカミの討伐', targets: { wolf: 2 }, reward: 18 },
  { id: 'crabs', title: '泥ガニの討伐', targets: { crab: 2 }, reward: 18 },
  { id: 'spiders', title: '小型クモの討伐', targets: { spider: 2 }, reward: 16 },
  { id: 'patrol', title: '街道周辺の見回り', targets: { rat: 1, wolf: 1, crab: 1, spider: 1 }, reward: 34 },
];

export function acceptQuest(state, quest) {
  if (state.activeQuests.size >= questLimit || state.activeQuests.has(quest.id) || state.completedQuests.has(quest.id)) return false;
  state.activeQuests.set(quest.id, {});
  return true;
}

export function recordDefeat(state, kind) {
  for (const quest of quests) {
    const progress = state.activeQuests.get(quest.id);
    const target = quest.targets[kind];
    if (progress && target) progress[kind] = Math.min(target, (progress[kind] ?? 0) + 1);
  }
}

function ready(quest, progress) {
  return Object.entries(quest.targets).every(([kind, count]) => (progress[kind] ?? 0) >= count);
}

export function reportQuest(state, quest) {
  const progress = state.activeQuests.get(quest.id);
  if (!progress || !ready(quest, progress) || state.guildGold < quest.reward) return false;
  state.activeQuests.delete(quest.id);
  state.completedQuests.add(quest.id);
  state.guildGold -= quest.reward;
  state.gold += quest.reward;
  return true;
}

export function setupQuestMenus(state, input) {
  const feedback = document.querySelector('#guild-feedback');
  const journal = document.querySelector('#quest-journal');

  function render(dialog, atGuild) {
    const list = dialog.querySelector('ul');
    list.replaceChildren();
    dialog.querySelector('.quest-count').textContent = `受注中 ${state.activeQuests.size} / ${questLimit}`;
    for (const quest of quests) {
      const progress = state.activeQuests.get(quest.id);
      const done = state.completedQuests.has(quest.id);
      if (!atGuild && !progress && !done) continue;
      const entry = document.createElement('li');
      const description = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = quest.title;
      const goals = document.createElement('div');
      goals.textContent = Object.entries(quest.targets).map(([kind, count]) =>
        `${enemyTypes[kind].name} ${done ? count : progress?.[kind] ?? 0}/${count}`).join('、');
      const complete = progress && ready(quest, progress);
      const details = document.createElement('div');
      details.textContent = `報酬 ${quest.reward}G · ${done ? '報告済み' : complete ? '報告可能' : progress ? '討伐中' : '未受注'}`;
      description.append(title, goals, details);
      entry.append(description);
      if (atGuild && !done && (!progress || complete)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = complete ? '報告' : '受注';
        button.disabled = complete ? state.guildGold < quest.reward : state.activeQuests.size >= questLimit;
        button.addEventListener('click', () => {
          const action = complete ? reportQuest : acceptQuest;
          if (!action(state, quest)) return;
          feedback.textContent = complete ? `報酬 ${quest.reward}Gを受け取りました。` : `${quest.title}を受注しました。`;
          render(dialog, true);
          feedback.focus();
        });
        entry.append(button);
      }
      list.append(entry);
    }
    dialog.querySelector('.quest-empty').hidden = list.children.length > 0;
  }

  document.querySelector('#open-quests').addEventListener('click', () => {
    if (document.querySelector('dialog[open]') || state.player.hp <= 0) return;
    input.clear();
    render(journal, false);
    journal.showModal();
  });

  const guild = document.querySelector('#guild');
  return () => {
    input.clear();
    feedback.textContent = '';
    render(guild, true);
    guild.showModal();
  };
}
