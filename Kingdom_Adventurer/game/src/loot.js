import { items } from './equipment.js?v=53';
import { settings } from './settings.js?v=49';

const materialDropLimit = 5;

function carriedEquipment(enemy, type) {
  if (!type.equipmentPriceLimit) return undefined;
  const candidates = [...items].filter(([, item]) => item.slot && item.price <= type.equipmentPriceLimit);
  // Assign an item by individual ID so reloading before a kill keeps the same loot.
  let hash = 2166136261;
  for (const ch of enemy.id) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  return candidates[(hash >>> 0) % candidates.length]?.[0];
}

export function dropLoot(state, enemy, type) {
  const materials = [...new Set(type.materials ?? [])].slice(0, materialDropLimit);
  const gold = type.humanoid ? (type.gold ?? 0) : 0;
  const equipment = carriedEquipment(enemy, type);
  if (!materials.length && !gold && !equipment) return;
  state.lootDrops.push({ x: enemy.x, y: enemy.y, materials, gold, ...(equipment ? { equipment } : {}) });
}

export function collectLoot(state) {
  const { player, lootDrops } = state;
  const collected = new Map();
  let gold = 0;
  for (let i = lootDrops.length - 1; i >= 0; i--) {
    const drop = lootDrops[i];
    if (Math.hypot(player.x - drop.x, player.y - drop.y) > settings.currency.pickupRadius) continue;
    const itemIds = drop.equipment ? [...drop.materials, drop.equipment] : drop.materials;
    for (const id of itemIds) {
      player.inventory.set(id, (player.inventory.get(id) ?? 0) + 1);
      collected.set(id, (collected.get(id) ?? 0) + 1);
    }
    gold += drop.gold;
    lootDrops.splice(i, 1);
  }
  state.gold += gold;
  const names = [...collected].map(([id, count]) => `${items.get(id).name}×${count}`);
  if (gold > 0) names.push(`${gold}G`);
  if (names.length && !state.notice?.leveledUp) {
    state.notice = { text: `${names.join('、')}を拾いました`, remaining: 1.7 };
  }
}
