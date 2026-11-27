import { settings } from './settings.js?v=49';
import { nationSettings as config } from './nation-settings.js?v=50';

const contactRadius = settings.player.radius + 8;
export const harvestSeconds = { food: 1, wood: 2 };

export function findSource(simulation, matches) {
  for (const nation of simulation.nations) {
    for (const city of nation.cities) {
      const source = city.sources.find(matches);
      if (source) return { source, nation };
    }
  }
  return null;
}

export function sourceQuantity(source, minute) {
  return source.readyAt > minute ? 0 : source.remaining || config.harvest[source.kind].yield;
}

export function harvestSource(source, minute, limit = config.carry) {
  const available = sourceQuantity(source, minute);
  if (!available) return 0;
  const quantity = Math.min(available, limit);
  source.remaining = available - quantity;
  if (!source.remaining) source.readyAt = minute + config.harvest[source.kind].regrow;
  return quantity;
}

export function updateTrees(state, dt) {
  const { player, nations } = state;
  const site = findSource(nations, source => source.readyAt <= nations.minute
    && Math.hypot(player.x - source.x, player.y - source.y) <= contactRadius);
  if (!site) {
    state.harvest = null;
    return null;
  }
  const { source, nation } = site;
  if (state.harvest?.source !== source) state.harvest = { source, elapsed: 0 };
  state.harvest.elapsed += dt;
  if (state.harvest.elapsed + 1e-9 < harvestSeconds[source.kind]) return null;

  const quantity = harvestSource(source, nations.minute, 1);
  if (!source.remaining) nation.nextMinute = Math.min(nation.nextMinute, source.readyAt);
  const itemId = source.kind === 'food' ? 'apple' : 'wood';
  player.inventory.set(itemId, (player.inventory.get(itemId) ?? 0) + quantity);
  state.harvest = source.remaining
    ? { source, elapsed: Math.max(0, state.harvest.elapsed - harvestSeconds[source.kind]) } : null;
  return { itemId, quantity };
}
