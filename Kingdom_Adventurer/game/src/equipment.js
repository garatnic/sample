export const slots = new Map([
  ['weapon', '武器'], ['head', '頭'], ['body', '胴'], ['arm-r', '右腕'],
  ['arm-l', '左腕'], ['waist', '腰'], ['legs', '脚'], ['feet', '足'],
  ['shield', '盾'], ['cloak', 'マント'], ['neck', '首飾り'], ['ring', '指輪'],
]);

export const ringSlots = new Map([['ring', '指輪1'], ['ring-2', '指輪2']]);

export const items = new Map([
  ['iron-dagger', { slot: 'weapon', name: '鉄の短剣', price: 10, range: 22, bonus: 2 }],
  ['iron-sword', { slot: 'weapon', name: '鉄の剣', price: 20, range: 30, bonus: 5 }],
  ['iron-mace', { slot: 'weapon', name: '鉄のメイス', price: 30, range: 30, bonus: 8 }],
  ['iron-helmet', { slot: 'head', name: '鉄の兜', price: 20, defense: 5 }],
  ['leather-armor', { slot: 'body', name: '革の鎧', price: 20, defense: 6 }],
  ['iron-armor', { slot: 'body', name: '鉄の鎧', price: 40, defense: 10 }],
  ['leather-right', { slot: 'arm-r', name: '革の右腕当て', price: 5, defense: 2 }],
  ['leather-left', { slot: 'arm-l', name: '革の左腕当て', price: 5, defense: 2 }],
  ['leather-belt', { slot: 'waist', name: '革のベルト', price: 5, defense: 1 }],
  ['leather-leggings', { slot: 'legs', name: '革の脚絆', price: 10, defense: 3 }],
  ['leather-boots', { slot: 'feet', name: '革のブーツ', price: 10, defense: 3 }],
  ['iron-shield', { slot: 'shield', name: '鉄の盾', price: 25, defense: 6 }],
  ['travel-cloak', { slot: 'cloak', name: '旅人のマント', price: 10, defense: 2 }],
  ['bronze-necklace', { slot: 'neck', name: '青銅の首飾り', price: 10, defense: 0 }],
  ['bronze-ring', { slot: 'ring', name: '青銅の指輪', price: 10, defense: 0 }],
]);

export function buyItem(state, id) {
  const item = items.get(id);
  if (!item || state.gold < item.price) return false;
  const inventory = state.player.inventory;
  inventory.set(id, (inventory.get(id) ?? 0) + 1);
  state.gold -= item.price;
  state.shopGold += item.price;
  return true;
}

export function equippedId(player, slot) {
  return slot === 'weapon' ? player.weaponId : player.armor.get(slot);
}

export function canEquipItem(player, id, slot = items.get(id)?.slot) {
  const item = items.get(id);
  const quantity = player.inventory.get(id) ?? 0;
  if (!item || quantity < 1) return false;
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

export function damageAfterArmor(player, damage) {
  const reduction = Math.min(.75, defenseRating(player) * .03);
  return Math.max(1, Math.round(damage * (1 - reduction)));
}
