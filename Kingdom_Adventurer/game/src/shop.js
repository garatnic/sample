import { buildings, shopDoors } from './world.js?v=41';
import { equippedId, items, ringSlots, slots } from './equipment.js?v=39';

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

const defaultCatalogs = Object.fromEntries(Object.keys(shops).map(shopId => [
  shopId, [...items].filter(([, item]) => acceptsItem(shopId, item) && !item.sellOnly).map(([id]) => id),
]));

function defaultStock(shopId) {
  return new Map(defaultCatalogs[shopId].map(id => [id, 1]));
}

export function createShopStock() {
  return Object.fromEntries(Object.keys(shops).map(id => [id, defaultStock(id)]));
}

export function settleShops(state) {
  for (const shopId of Object.keys(shops)) {
    const current = state.shopStock[shopId];
    const baseline = defaultStock(shopId);
    let change = 0;
    for (const [id, target] of baseline) {
      const shortage = Math.max(0, target - (current.get(id) ?? 0));
      change -= shortage * salePrice(items.get(id));
    }
    for (const [id, count] of current) {
      if (!baseline.has(id)) change += items.get(id).price * count;
    }
    state.shopGold[shopId] += change;
    state.shopStock[shopId] = baseline;
  }
}

export function buyItem(state, shopId, id) {
  const item = items.get(id);
  if (!acceptsItem(shopId, item) || state.gold < item.price) return false;
  const stock = state.shopStock[shopId];
  const count = stock.get(id) ?? 0;
  if (!count) return false;
  if (count === 1) stock.delete(id);
  else stock.set(id, count - 1);
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
  const stock = state.shopStock[shopId];
  stock.set(id, (stock.get(id) ?? 0) + 1);
  state.shopGold[shopId] -= price;
  state.gold += price;
  return true;
}
