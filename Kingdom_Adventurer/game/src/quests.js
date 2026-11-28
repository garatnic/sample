import { enemyTypes } from './settings.js?v=49';
import { items } from './equipment.js?v=53';

const templates = [
  { id: 'rats', title: '大ネズミの討伐', targets: { rat: 2 }, reward: 14 },
  { id: 'wolves', title: 'オオカミの討伐', targets: { wolf: 2 }, reward: 18 },
  { id: 'crabs', title: '泥ガニの討伐', targets: { crab: 2 }, reward: 18 },
  { id: 'spiders', title: '小型クモの討伐', targets: { spider: 2 }, reward: 16 },
  { id: 'patrol', title: '街道周辺の見回り', targets: { rat: 1, wolf: 1, crab: 1, spider: 1 }, reward: 34 },
];

// Only materials from the current starter enemies are eligible.
const collectionPool = ['rat', 'wolf', 'crab', 'spider']
  .flatMap(kind => enemyTypes[kind].materials);
const huntSlots = 3;
const collectionSlots = 2;

function choose(pool) {
  return pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
}

export function refreshGuild(state, guildId, day) {
  let board = state.guilds.get(guildId);
  if (!board) {
    board = { day: null, quests: [], gold: 0 };
    state.guilds.set(guildId, board);
  }
  if (board.day !== null && day <= board.day) return board;

  const held = board.quests.filter(quest => quest.status === 'active');
  const hunts = templates.filter(template => !held.some(quest => quest.templateId === template.id));
  const materials = collectionPool.filter(id => !held.some(quest => quest.material === id));
  board.quests = Array.from({ length: huntSlots + collectionSlots }, (_, index) => {
    const earlier = board.quests[index];
    if (earlier?.status === 'active') return earlier;
    const base = { id: `${guildId}:${day}:${index}`, status: 'offered', progress: {} };
    if (index >= huntSlots) {
      const material = choose(materials);
      const quantity = 1 + Math.floor(Math.random() * 2);
      return { ...base, material, quantity, title: `${items.get(material).name}の収集`, reward: 8 + quantity * 5 };
    }
    const template = choose(hunts);
    const targets = Object.fromEntries(Object.entries(template.targets).map(([kind, count]) =>
      [kind, count === 1 ? 1 : count + Math.floor(Math.random() * 2)]));
    return { ...template, ...base, templateId: template.id, targets };
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
      const target = quest.targets?.[kind];
      if (quest.status === 'active' && target) {
        quest.progress[kind] = Math.min(target, (quest.progress[kind] ?? 0) + 1);
      }
    }
  }
}

function ready(quest, inventory) {
  if (quest.status !== 'active') return false;
  if (quest.material) return (inventory.get(quest.material) ?? 0) >= quest.quantity;
  return Object.entries(quest.targets).every(([kind, count]) => (quest.progress[kind] ?? 0) >= count);
}

export function reportQuest(state, board, quest) {
  const inventory = state.player.inventory;
  if (!board.quests.includes(quest) || !ready(quest, inventory) || board.gold < quest.reward) return false;
  if (quest.material) {
    const remaining = inventory.get(quest.material) - quest.quantity;
    if (remaining > 0) inventory.set(quest.material, remaining);
    else inventory.delete(quest.material);
  }
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
      const inventory = state.player.inventory;
      goals.textContent = quest.material
        ? `${items.get(quest.material).name} ${done ? quest.quantity : inventory.get(quest.material) ?? 0}/${quest.quantity}個`
        : Object.entries(quest.targets).map(([kind, count]) =>
          `${enemyTypes[kind].name} ${done ? count : quest.progress[kind] ?? 0}/${count}`).join('、');
      const complete = ready(quest, inventory);
      const details = document.createElement('div');
      details.textContent = `報酬 ${quest.reward}G · ${done ? '報告済み' : complete ? '報告可能' : accepted ? (quest.material ? '収集中' : '討伐中') : '未受注'}`;
      description.append(title, goals, details);
      entry.append(description);
      if (board && (quest.status === 'offered' || complete)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = complete ? (quest.material ? '納品' : '報告') : '受注';
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
