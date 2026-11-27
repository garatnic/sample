export const slots = new Map([
  ['weapon', '武器'], ['head', '頭'], ['body', '胴'], ['arm-r', '右腕'],
  ['arm-l', '左腕'], ['waist', '腰'], ['legs', '脚'], ['feet', '足'],
  ['shield', '盾'], ['cloak', 'マント'], ['neck', '首飾り'], ['ring', '指輪'],
]);

export const ringSlots = new Map([['ring', '指輪1'], ['ring-2', '指輪2']]);

const attackIntervals = {
  unarmed: 0.58,
  dagger: 0.50,
  sword: 0.64,
  axe: 0.70,
  mace: 0.76,
  hammer: 0.90,
};

export function attackInterval(weapon) {
  return weapon?.attackInterval ?? attackIntervals[weapon?.category] ?? attackIntervals.unarmed;
}

const armorPieceBonus = 25;

export const items = new Map([
  ['iron-dagger', { slot: 'weapon', category: 'dagger', skill: 'one-handed', name: '鉄の短剣', price: 10, range: 22, bonus: 2 }],
  ['iron-sword', { slot: 'weapon', category: 'sword', skill: 'one-handed', name: '鉄の剣', price: 20, range: 30, bonus: 5 }],
  ['iron-mace', { slot: 'weapon', category: 'mace', skill: 'one-handed', name: '鉄のメイス', price: 30, range: 30, bonus: 8 }],
  ['iron-hammer', { slot: 'weapon', category: 'hammer', skill: 'two-handed', name: '鉄の槌', price: 40, range: 34, bonus: 14 }],
  ['iron-helmet', { slot: 'head', name: '鉄の兜', price: 20, defense: armorPieceBonus + 12 }],
  ['leather-armor', { slot: 'body', name: '革の鎧', price: 20, defense: armorPieceBonus + 18 }],
  ['iron-armor', { slot: 'body', name: '鉄の鎧', price: 40, defense: armorPieceBonus + 25 }],
  ['leather-right', { slot: 'arm-r', name: '革の右腕当て', price: 5, defense: armorPieceBonus + 4 }],
  ['leather-left', { slot: 'arm-l', name: '革の左腕当て', price: 5, defense: armorPieceBonus + 4 }],
  ['leather-belt', { slot: 'waist', name: '革のベルト', price: 5, defense: 0 }],
  ['leather-leggings', { slot: 'legs', name: '革の脚絆', price: 10, defense: armorPieceBonus + 7 }],
  ['leather-boots', { slot: 'feet', name: '革のブーツ', price: 10, defense: armorPieceBonus + 7 }],
  ['iron-shield', { slot: 'shield', name: '鉄の盾', price: 25, defense: armorPieceBonus + 20 }],
  ['travel-cloak', { slot: 'cloak', name: '旅人のマント', price: 10, defense: 0 }],
  ['bronze-necklace', { slot: 'neck', name: '青銅の首飾り', price: 10, defense: 0 }],
  ['bronze-ring', { slot: 'ring', name: '青銅の指輪', price: 10, defense: 0 }],
  ['healing-potion', { category: 'medicine', name: '回復薬', price: 8, effect: { hp: 25 } }],
  ['weak-poison', { category: 'medicine', name: '弱い毒', price: 6, effect: { poison: 8 } }],
  ['apple', { category: 'food', name: 'リンゴ', price: 2, effect: { hp: 1 }, sellOnly: true }],
  ['tree-nut', { category: 'food', name: '木の実', price: 2, effect: { hp: 1 }, sellOnly: true }],
  ['bread', { category: 'food', name: 'パン', price: 4, effect: { hp: 2, mp: 1 } }],
  ['water', { category: 'food', name: '水', price: 2, effect: { hp: 1, mp: 1 } }],
  ['wooden-trinket', { category: 'misc', name: '木彫りの置物', price: 4 }],
  ['wolf-hide', { category: 'materials', name: 'オオカミの革', price: 6, sellOnly: true }],
  ['wolf-fang', { category: 'materials', name: 'オオカミの牙', price: 4, sellOnly: true }],
  ['rat-meat', { category: 'materials', name: '大ネズミの肉', price: 6, sellOnly: true }],
  ['small-bone', { category: 'materials', name: '小さな骨', price: 4, sellOnly: true }],
  ['crab-shell', { category: 'materials', name: '泥ガニの甲羅', price: 10, sellOnly: true }],
  ['spider-silk', { category: 'materials', name: 'クモの糸', price: 6, sellOnly: true }],
  ['venom-sac', { category: 'materials', name: 'クモの毒液', price: 4, sellOnly: true }],
]);

export function equippedId(player, slot) {
  return slot === 'weapon' ? player.weaponId : player.armor.get(slot);
}

export function canEquipItem(player, id, slot = items.get(id)?.slot) {
  const item = items.get(id);
  const quantity = player.inventory.get(id) ?? 0;
  if (!item?.slot || quantity < 1) return false;
  if (item.slot !== 'ring') return slot === item.slot;
  if (!ringSlots.has(slot)) return false;
  for (const otherSlot of ringSlots.keys()) {
    if (otherSlot !== slot && equippedId(player, otherSlot) === id && quantity < 2) return false;
  }
  return true;
}

export function equipItem(player, id, slot = items.get(id)?.slot) {
  if (!canEquipItem(player, id, slot)) return;
  if (slot === 'weapon') player.weaponId = id;
  else player.armor.set(slot, id);
}

export function unequipSlot(player, slot) {
  if (slot === 'weapon') player.weaponId = null;
  else player.armor.delete(slot);
}

export function defenseRating(player) {
  let rating = 0;
  for (const id of player.armor.values()) rating += items.get(id).defense;
  return rating;
}
