import { settings } from './settings.js';

const capacity = 20;
export const harvestSeconds = 1;
const contactRadius = settings.player.radius + 8;

const treeLocations = [
  { id: 'tree-3-2', x: 350, y: 237, itemId: 'apple' },
  { id: 'tree-7-9', x: 733, y: 907, itemId: 'tree-nut' },
  { id: 'tree-13-5', x: 1303, y: 536, itemId: 'apple' },
  { id: 'tree-14-11', x: 1374, y: 1087, itemId: 'tree-nut' },
  { id: 'tree-17-6', x: 1661, y: 615, itemId: 'apple' },
];

export function createTrees(day) {
  const trees = treeLocations.map(location => ({
    ...location, category: 'food', remaining: capacity, capacity,
  }));
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
