import { nationLayouts } from './nation-layout.js?v=53';
import { buildings, shopDoors } from './world.js?v=55';
import { equippedId, items, ringSlots, slots } from './equipment.js?v=53';

import { tradePrice } from './trade-settings.js?v=53';
import { tradeRoom } from './trade-stock.js?v=62';

const equipmentTabs = [...slots];
const goodsTabs = [['medicine', '薬'], ['food', '食べ物'], ['materials', '素材'], ['misc', 'その他']];

const tradeTab = ['trade', '交易品'];
export const inventoryTabs = [...goodsTabs, tradeTab];

const tradeOwners = new Map(nationLayouts.map(layout => [
  layout.facilities.find(b => b.kind === 'trade-post').id, layout.id,
]));

export function tradeNation(state, shopId) {
  const owner = tradeOwners.get(shopId);
  return owner && state.nations.nations.find(nation => nation.id === owner);
}

export function shopInventory(state, shopId) {
  return tradeNation(state, shopId)?.trade.stock ?? state.shopStock[shopId];
}

export function shopBalance(state, shopId) {
  return tradeNation(state, shopId)?.treasury ?? state.shopGold[shopId];
}

export function shopPrice(shopId, id, buying) {
  const owner = tradeOwners.get(shopId);
  return owner ? tradePrice(owner, id, buying) : buying ? items.get(id).price : salePrice(items.get(id));
}

export function shopCanAcceptStock(state, shopId) {
  const nation = tradeNation(state, shopId);
  return !nation || tradeRoom(nation) > 0;
}

const shopTypes = {
  'trade-post': { name: '交易所', tabs: [tradeTab] },
  'weapon-shop': { name: '装備品屋', tabs: equipmentTabs },
  'goods-shop': { name: '道具屋', tabs: goodsTabs },
};

export const shops = Object.fromEntries(buildings
  .filter(b => Object.hasOwn(shopTypes, b.kind))
  .map(b => [b.id, shopTypes[b.kind]]));
export const startingShopGold = 100;

export function itemGroup(item) {
  return item.slot ?? item.category;
}

export function acceptsItem(shopId, item) {
  return Boolean(item && shops[shopId]?.tabs.some(([group]) => group === itemGroup(item)));
}

const defaultCatalogs = Object.fromEntries(Object.keys(shopDoors).map(shopId => [
  shopId, [...items].filter(([, item]) => acceptsItem(shopId, item) && !item.sellOnly).map(([id]) => id),
]));

function defaultStock(shopId) {
  return new Map(defaultCatalogs[shopId].map(id => [id, 1]));
}

export function createShopStock() {
  return Object.fromEntries(Object.keys(shopDoors).map(id => [id, defaultStock(id)]));
}

const shopsByNation = new Map(nationLayouts.map(layout => [layout.id,
  layout.facilities.map(b => b.id).filter(id => Object.hasOwn(shopDoors, id)).sort()]));

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
      const quantity = Math.min(Math.max(0, baseline.get(id) - count), Math.floor(state.shopGold[shopId] / price));
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
  if (!acceptsItem(shopId, item)) return false;
  const price = shopPrice(shopId, id, true);
  if (state.gold < price) return false;
  const stock = shopInventory(state, shopId);
  const count = stock.get(id) ?? 0;
  if (!count) return false;
  if (count === 1) stock.delete(id);
  else stock.set(id, count - 1);
  const inventory = state.player.inventory;
  inventory.set(id, (inventory.get(id) ?? 0) + 1);
  state.gold -= price;
  const nation = tradeNation(state, shopId);
  if (nation) {
    nation.treasury += price;
    nation.trade.sales += price;
  } else {
    state.shopGold[shopId] += price;
  }
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
  const price = shopPrice(shopId, id, false);
  if (shopBalance(state, shopId) < price || !shopCanAcceptStock(state, shopId)) return false;
  const inventory = state.player.inventory;
  const count = inventory.get(id);
  if (count === 1) inventory.delete(id);
  else inventory.set(id, count - 1);
  const stock = shopInventory(state, shopId);
  stock.set(id, (stock.get(id) ?? 0) + 1);
  const nation = tradeNation(state, shopId);
  if (nation) {
    nation.treasury -= price;
    nation.trade.purchases += price;
  } else {
    state.shopGold[shopId] -= price;
  }
  state.gold += price;
  return true;
}
