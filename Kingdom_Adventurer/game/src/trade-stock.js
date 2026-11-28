import { tradeGoods, tradePrice, tradeSettings } from './trade-settings.js?v=53';

export function reservedProduction(nation) {
  let reserved = 0;
  for (const city of nation.cities) {
    for (const person of city.residents) {
      if (person.action === 'craftTrade') reserved++;
    }
  }
  return reserved;
}

export function stockQuantity(stock) {
  return [...stock.values()].reduce((sum, count) => sum + count, 0);
}

export function tradeRoom(nation, reserved = reservedProduction(nation)) {
  return tradeSettings.capacity - stockQuantity(nation.trade.stock) - reserved;
}

export function settleTrade(nation, finance) {
  const { trade } = nation;
  finance.tradeSales = trade.sales;
  finance.tradePurchases = trade.purchases;
  for (const [id, count] of trade.stock) {
    if (tradeGoods.get(id).origin === nation.id) continue;
    // Reimburse the local buyback tariff without creating a market spread.
    finance.imports += count * tradePrice(nation.id, id, false);
    trade.stock.delete(id);
  }
  nation.treasury += finance.imports;
  trade.sales = 0;
  trade.purchases = 0;
}
