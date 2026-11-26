export const weapons = new Map([
  ['iron-dagger', { name: '鉄の短剣', price: 10, range: 22, bonus: 2 }],
  ['iron-sword', { name: '鉄の剣', price: 20, range: 30, bonus: 5 }],
  ['iron-mace', { name: '鉄のメイス', price: 30, range: 30, bonus: 8 }],
]);

export function buyWeapon(state, id) {
  const weapon = weapons.get(id);
  if (!weapon || state.gold < weapon.price) return false;
  const inventory = state.player.inventory;
  inventory.set(id, (inventory.get(id) ?? 0) + 1);
  state.gold -= weapon.price;
  state.shopGold += weapon.price;
  return true;
}
