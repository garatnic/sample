import { enemyTypes } from './settings.js?v=15';

const templates = [
  { id: 'rats', title: '大ネズミの討伐', targets: { rat: 2 }, reward: 14 },
  { id: 'wolves', title: 'オオカミの討伐', targets: { wolf: 2 }, reward: 18 },
  { id: 'crabs', title: '泥ガニの討伐', targets: { crab: 2 }, reward: 18 },
  { id: 'spiders', title: '小型クモの討伐', targets: { spider: 2 }, reward: 16 },
  { id: 'patrol', title: '街道周辺の見回り', targets: { rat: 1, wolf: 1, crab: 1, spider: 1 }, reward: 34 },
];

export function refreshGuild(state, guildId, day) {
  let board = state.guilds.get(guildId);
  if (!board) {
    board = { day: null, quests: [], gold: 0 };
    state.guilds.set(guildId, board);
  }
  if (board.day !== null && day <= board.day) return board;

  board.quests = templates.map((template, index) => {
    const earlier = board.quests[index];
    if (earlier?.status === 'active') return earlier;
    const targets = Object.fromEntries(Object.entries(template.targets).map(([kind, count]) =>
      [kind, count === 1 ? 1 : count + Math.floor(Math.random() * 2)]));
    return { ...template, id: `${guildId}:${day}:${template.id}`, targets, status: 'offered', progress: {} };
  });
  board.day = day;
  // Set aside funding for the current rewards, including carried-over quests.
  board.gold = board.quests.reduce((total, quest) => total + quest.reward, 0);
  return board;
}

export function acceptQuest(board, quest) {
  if (!board.quests.includes(quest) || quest.status !== 'offered') return false;
  quest.status = 'active';
  return true;
}

export function recordDefeat(state, kind) {
  for (const { quests } of state.guilds.values()) {
    for (const quest of quests) {
      const target = quest.targets[kind];
      if (quest.status === 'active' && target) {
        quest.progress[kind] = Math.min(target, (quest.progress[kind] ?? 0) + 1);
      }
    }
  }
}

function ready(quest) {
  return quest.status === 'active' && Object.entries(quest.targets)
    .every(([kind, count]) => (quest.progress[kind] ?? 0) >= count);
}

export function reportQuest(state, board, quest) {
  if (!board.quests.includes(quest) || !ready(quest) || board.gold < quest.reward) return false;
  quest.status = 'reported';
  board.gold -= quest.reward;
  state.gold += quest.reward;
  return true;
}

export function setupQuestMenus(state, input) {
  const feedback = document.querySelector('#guild-feedback');
  const journal = document.querySelector('#quest-journal');

  function render(dialog, board) {
    const list = dialog.querySelector('ul');
    list.replaceChildren();
    const visible = board ? board.quests : [...state.guilds.values()].flatMap(guild =>
      guild.quests.filter(quest => quest.status !== 'offered'));
    const active = visible.filter(quest => quest.status === 'active').length;
    dialog.querySelector('.quest-count').textContent = board
      ? `掲示 ${visible.length}件 · 受注中 ${active}件` : `受注中 ${active}件`;
    for (const quest of visible) {
      const done = quest.status === 'reported';
      const accepted = quest.status === 'active';
      const entry = document.createElement('li');
      const description = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = quest.title;
      const goals = document.createElement('div');
      goals.textContent = Object.entries(quest.targets).map(([kind, count]) =>
        `${enemyTypes[kind].name} ${done ? count : quest.progress[kind] ?? 0}/${count}`).join('、');
      const complete = ready(quest);
      const details = document.createElement('div');
      details.textContent = `報酬 ${quest.reward}G · ${done ? '報告済み' : complete ? '報告可能' : accepted ? '討伐中' : '未受注'}`;
      description.append(title, goals, details);
      entry.append(description);
      if (board && (quest.status === 'offered' || complete)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = complete ? '報告' : '受注';
        button.disabled = complete && board.gold < quest.reward;
        button.addEventListener('click', () => {
          const success = complete ? reportQuest(state, board, quest) : acceptQuest(board, quest);
          if (!success) return;
          feedback.textContent = complete ? `報酬 ${quest.reward}Gを受け取りました。` : `${quest.title}を受注しました。`;
          render(dialog, board);
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
    render(journal);
    journal.showModal();
  });

  const guild = document.querySelector('#guild');
  return (guildId, day) => {
    input.clear();
    feedback.textContent = '';
    render(guild, refreshGuild(state, guildId, day));
    guild.showModal();
  };
}
