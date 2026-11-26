export const settings = {
  tile: 32,
  mapWidth: 2240,
  mapHeight: 1568,
  player: { maxHp: 100, speed: 180, range: 16, damage: 17, radius: 10 },
  currency: { startingGold: 10, pickupRadius: 18 },
  inn: { price: 10 },
  enemy: { reach: 15, aggro: 175, leash: 245, spawnDelay: 8, gold: 5 },
};

export const enemyTypes = {
  wolf: { name: 'オオカミ', maxHp: 42, speed: 108, damage: 9, attackDelay: 0.82 },
  rat: { name: '大ネズミ', maxHp: 26, speed: 98, damage: 5, attackDelay: 0.72 },
  crab: { name: '泥ガニ', maxHp: 46, speed: 62, damage: 8, attackDelay: 1.05 },
  spider: { name: '小型クモ', maxHp: 34, speed: 86, damage: 7, attackDelay: 0.9 },
};
