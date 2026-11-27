const tile = 32;

export const settings = {
  tile,
  mapTiles: 256,
  get mapWidth() { return this.mapTiles * this.tile; },
  get mapHeight() { return this.mapTiles * this.tile; },
  player: { maxHp: 100, speed: 180, range: 16, damage: 17, radius: 10 },
  difficulty: { playerDamageMultiplier: 1, enemyDamageMultiplier: 1 },
  currency: { startingGold: 10, pickupRadius: 18 },
  inn: { price: 10 },
  enemy: { reach: 15, aggro: 175, leash: 245, spawnDelay: 8 },
};

export const enemyTypes = {
  wolf: { materials: ['wolf-hide', 'wolf-fang'], name: 'オオカミ', defense: 15, maxHp: 42, speed: 108, damage: 9, attackDelay: 0.82 },
  rat: { materials: ['rat-meat', 'small-bone'], name: '大ネズミ', defense: 0, maxHp: 26, speed: 98, damage: 5, attackDelay: 0.72 },
  crab: { materials: ['crab-shell'], name: '泥ガニ', defense: 60, maxHp: 46, speed: 62, damage: 8, attackDelay: 1.05 },
  spider: { materials: ['spider-silk', 'venom-sac'], name: '小型クモ', defense: 25, maxHp: 34, speed: 86, damage: 7, attackDelay: 0.9 },
};

export const animalTypes = {
  deer: { name: 'シカ', maxHp: 34, defense: 0, speed: 145, materials: ['deer-hide', 'antler'] },
  rabbit: { name: 'ウサギ', maxHp: 20, defense: 0, speed: 155, materials: ['rabbit-fur'] },
  fox: { name: 'キツネ', maxHp: 26, defense: 0, speed: 150, materials: ['fox-fur'] },
};

export const mobTypes = { ...enemyTypes, ...animalTypes };
