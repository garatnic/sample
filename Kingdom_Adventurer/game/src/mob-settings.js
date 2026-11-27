export const mobSettings = {
  chunkTiles: 16,
  centerRadius: 1,
  tickMinutes: 0.4,
  spawnEveryTicks: 16,
  nearDistance: 320,
  spawnClearance: 21,
  collisionRadius: 9,
  animal: { local: 0.36, protected: 0.8, worldMaximumFactor: 1, perCycle: 2, chance: 0.85 },
  enemy: { local: 0.84, protected: 0.04, worldMaximumFactor: 1, perCycle: 5, chance: 0.7 },
  resident: { hp: 50, attack: 10, defense: 0, interval: 1, reach: 15, recoveryPerSecond: 1 },
  wander: { speedFactor: 0.28, minSeconds: 3, extraSeconds: 8, centerDistance: 1100, turnAwayChance: 0.88 },
  terrain: {
    forest: { animal: { deer: 4, rabbit: 2, fox: 3 }, enemy: { wolf: 3, spider: 4 } },
    grass: { animal: { deer: 3, rabbit: 5, fox: 1 }, enemy: { wolf: 3, rat: 5, crab: 1 } },
    road: { animal: { rabbit: 2, fox: 1 }, enemy: { bandit: 1 } },
    town: { animal: {}, enemy: {} },
  },
};
