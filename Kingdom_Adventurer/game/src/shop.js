import { nationLayouts } from './nation-layout.js?v=47';
import { buildings, shopDoors } from './world.js?v=47';
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

const shopsByNation = new Map(nationLayouts.map(layout => [layout.id,
  layout.facilities.map(b => b.id).filter(id => Object.hasOwn(shops, id)).sort()]));

export function settleShops(state, nation, day, finance) {
  const ids = shopsByNation.get(nation.id);
  if (!ids?.length) return;
  const offset = day % ids.length;
  const ordered = [...ids.slice(offset), ...ids.slice(0, offset)];
  for (const shopId of ordered) {
    const stock = state.shopStock[shopId];
    const baseline = defaultStock(shopId);
    for (const id of [...stock.keys()].sort()) {
      const count = stock.get(id);
      const price = items.get(id).price;
      const quantity = Math.min(Math.max(0, count - (baseline.get(id) ?? 0)), Math.floor(nation.treasury / price));
      if (!quantity) continue;
      const payment = price * quantity;
      nation.treasury -= payment;
      state.shopGold[shopId] += payment;
      finance.bought += payment;
      if (count === quantity) stock.delete(id);
      else stock.set(id, count - quantity);
    }
  }
  for (const shopId of ordered) {
    const stock = state.shopStock[shopId];
    const baseline = defaultStock(shopId);
    for (const id of [...baseline.keys()].sort()) {
      const count = stock.get(id) ?? 0;
      const price = salePrice(items.get(id));
      const availableGold = Math.max(0, state.shopGold[shopId]);
      const quantity = Math.min(Math.max(0, baseline.get(id) - count), Math.floor(availableGold / price));
      if (!quantity) continue;
      const payment = price * quantity;
      state.shopGold[shopId] -= payment;
      nation.treasury += payment;
      finance.supplied += payment;
      stock.set(id, count + quantity);
    }
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
