import { tradeGoods, tradePrice, tradeSettings } from './trade-settings.js?v=53';

export function reservedProduction(nation) {
  return nation.cities.reduce((sum, city) =>
    sum + city.residents.filter(person => person.action === 'craftTrade').length, 0);
}

export function stockQuantity(stock) {
  return [...stock.values()].reduce((sum, count) => sum + count, 0);
}

export function tradeRoom(nation) {
  return tradeSettings.capacity - stockQuantity(nation.trade.stock) - reservedProduction(nation);
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
