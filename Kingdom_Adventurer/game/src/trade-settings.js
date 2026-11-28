export const tradeSettings = {
  basePrice: 20,
  purchaseRate: 0.7,
  multipliers: { specialty: 0.5, standard: 1, demand: 1.5 },
  capacity: 40,
  domesticProductionLimit: 30,
  workMinutes: 16,
  leisureShare: 0.5,
  dailyGoldPerResident: 2,
};

export const tradeGoods = new Map([
  ['elm-apple-box', { name: '楡のリンゴ箱', origin: 'nation-1', demand: ['nation-2'] }],
  ['violet-apple-preserves', { name: '紫峰のリンゴ蜜煮', origin: 'nation-2', demand: ['nation-3'] }],
  ['cedar-apple-case', { name: '杉谷のリンゴ細工', origin: 'nation-3', demand: ['nation-1'] }],
]);

export function tradePrice(nationId, itemId, buying) {
  const good = tradeGoods.get(itemId);
  const attribute = good.origin === nationId ? 'specialty' : good.demand.includes(nationId) ? 'demand' : 'standard';
  const price = tradeSettings.basePrice * tradeSettings.multipliers[attribute];
  return buying ? price : Math.floor(price * tradeSettings.purchaseRate);
}
