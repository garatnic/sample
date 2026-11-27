import { items } from './equipment.js?v=39';
import { settings } from './settings.js?v=39';

const materialDropLimit = 5;

export function dropLoot(state, enemy, type) {
  const materials = [...new Set(type.materials ?? [])].slice(0, materialDropLimit);
  const gold = type.humanoid ? (type.gold ?? 0) : 0;
  if (!materials.length && !gold) return;
  state.lootDrops.push({ x: enemy.x, y: enemy.y, materials, gold });
}

export function collectLoot(state) {
  const { player, lootDrops } = state;
  const collected = new Map();
  let gold = 0;
  for (let i = lootDrops.length - 1; i >= 0; i--) {
    const drop = lootDrops[i];
    if (Math.hypot(player.x - drop.x, player.y - drop.y) > settings.currency.pickupRadius) continue;
    for (const id of drop.materials) {
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
