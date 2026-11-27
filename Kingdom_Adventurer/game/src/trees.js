import { settings } from './settings.js?v=34';
import { nationSettings as config } from './nation-settings.js?v=34';

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

export function harvestSource(source, minute) {
  if (source.readyAt > minute) return 0;
  const { regrow, yield: amount } = config.harvest[source.kind];
  source.readyAt = minute + regrow;
  return Math.min(amount, config.carry);
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

  const quantity = harvestSource(source, nations.minute);
  nation.nextMinute = Math.min(nation.nextMinute, source.readyAt);
  const itemId = source.kind === 'food' ? 'apple' : 'wood';
  player.inventory.set(itemId, (player.inventory.get(itemId) ?? 0) + quantity);
  state.harvest = null;
  return { itemId, quantity };
}
