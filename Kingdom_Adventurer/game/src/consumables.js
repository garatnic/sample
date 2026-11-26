import { items } from './equipment.js?v=25';
import { maxHealth } from './growth.js?v=5';

export const maxMp = 100;

export function canUseItem(player, id) {
  const effect = items.get(id)?.effect;
  if (!effect || player.hp <= 0 || !(player.inventory.get(id) > 0)) return false;
  if (effect.poison) return !player.pendingPoison;
  return Boolean((effect.hp && player.hp < maxHealth(player.level)) || (effect.mp && player.mp < maxMp));
}

export function useItem(player, id) {
  if (!canUseItem(player, id)) return false;
  const { effect } = items.get(id);
  if (effect.poison) player.pendingPoison = effect.poison;
  if (effect.hp) player.hp = Math.min(maxHealth(player.level), player.hp + effect.hp);
  if (effect.mp) player.mp = Math.min(maxMp, player.mp + effect.mp);

  const count = player.inventory.get(id);
  if (count === 1) player.inventory.delete(id);
  else player.inventory.set(id, count - 1);
  return true;
}
