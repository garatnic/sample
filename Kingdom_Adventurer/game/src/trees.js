import { settings } from './settings.js';
import { terrainAt } from './world.js?v=24';

const capacity = 20;
export const harvestSeconds = 1;
const contactRadius = settings.player.radius + 8;

export function createTrees(day) {
  const trees = [];
  for (let row = 0; row < 16; row++) {
    for (let column = 0; column < 23; column++) {
      const variation = (column * 73 + row * 151 + column * row * 19) % 97;
      const x = 52 + column * 94 + variation % 37;
      const y = 48 + row * 94 + (variation * 7) % 37;
      const terrain = terrainAt(x, y);
      if (terrain !== 'forest' && (terrain !== 'grass' || variation % 4 !== 0)) continue;
      trees.push({ id: `tree-${column}-${row}`, x, y, category: 'food',
        itemId: variation % 2 ? 'apple' : 'tree-nut', remaining: capacity, capacity });
    }
  }
  return { trees, day, harvest: null };
}

export function takeFruit(tree, inventory) {
  if (tree.remaining <= 0) return false;
  inventory.set(tree.itemId, (inventory.get(tree.itemId) ?? 0) + 1);
  tree.remaining--;
  return true;
}

export function updateTrees(resources, player, dt, day) {
  if (resources.day !== day) {
    resources.day = day;
    for (const tree of resources.trees) tree.remaining = tree.capacity;
    resources.harvest = null;
  }

  const tree = resources.trees.find(entry => entry.remaining > 0
    && Math.hypot(player.x - entry.x, player.y - entry.y) <= contactRadius);
  if (!tree) {
    resources.harvest = null;
    return null;
  }
  if (resources.harvest?.tree !== tree) resources.harvest = { tree, elapsed: 0 };
  resources.harvest.elapsed += dt;
  if (resources.harvest.elapsed + 1e-9 < harvestSeconds) return null;

  takeFruit(tree, player.inventory);
  resources.harvest.elapsed = Math.max(0, resources.harvest.elapsed - harvestSeconds);
  if (tree.remaining === 0) resources.harvest = null;
  return tree.itemId;
}
