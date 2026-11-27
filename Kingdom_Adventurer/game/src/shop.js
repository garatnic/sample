import { buildings, shopDoors } from './world.js?v=35';
import { equippedId, items, ringSlots, slots } from './equipment.js?v=27';

const equipmentTabs = [...slots];
export const goodsTabs = [['medicine', '薬'], ['food', '食べ物'], ['materials', '素材'], ['misc', 'その他']];

const shopTypes = {
  'weapon-shop': { name: '装備品屋', tabs: equipmentTabs },
  'goods-shop': { name: '道具屋', tabs: goodsTabs },
};

export const shops = Object.fromEntries(buildings
  .filter(b => Object.hasOwn(shopDoors, b.id))
  .map(b => [b.id, shopTypes[b.kind]]));
export const startingShopGold = 100;

export function itemGroup(item) {
  return item.slot ?? item.category;
}

export function acceptsItem(shopId, item) {
  return Boolean(item && shops[shopId]?.tabs.some(([group]) => group === itemGroup(item)));
}

export function buyItem(state, shopId, id) {
  const item = items.get(id);
  if (!acceptsItem(shopId, item) || item.sellOnly || state.gold < item.price) return false;
  const inventory = state.player.inventory;
  inventory.set(id, (inventory.get(id) ?? 0) + 1);
  state.gold -= item.price;
  state.shopGold[shopId] += item.price;
  return true;
}

export function salePrice(item) {
  return Math.max(1, Math.floor(item.price / 2));
}

export function sellableQuantity(player, id) {
  const item = items.get(id);
  const count = player.inventory.get(id) ?? 0;
  if (!item?.slot) return count;
  const occupied = item.slot === 'ring'
    ? [...ringSlots.keys()].filter(slot => equippedId(player, slot) === id).length
    : Number(equippedId(player, item.slot) === id);
  return count - occupied;
}

export function sellItem(state, shopId, id) {
  const item = items.get(id);
  if (!acceptsItem(shopId, item) || sellableQuantity(state.player, id) <= 0) return false;
  const price = salePrice(item);
  if (state.shopGold[shopId] < price) return false;
  const inventory = state.player.inventory;
  const count = inventory.get(id);
  if (count === 1) inventory.delete(id);
  else inventory.set(id, count - 1);
  state.shopGold[shopId] -= price;
  state.gold += price;
  return true;
}
