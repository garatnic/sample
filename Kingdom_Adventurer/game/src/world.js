import { settings } from './settings.js?v=49';

import { inSettlement, nationLayouts, nationTerrainAt } from './nation-layout.js?v=53';

export const start = { ...nationLayouts[0].arrival };
export const buildings = nationLayouts.flatMap(city => city.facilities);

function doorsFor(matches) {
  return Object.fromEntries(buildings.filter(matches).map(({ id, door }) => [id, door]));
}

export const innDoors = doorsFor(b => b.kind === 'inn');
export const guildDoors = doorsFor(b => b.kind === 'guild');
export const tradeDoors = doorsFor(b => b.kind === 'trade-post');
export const shopDoors = doorsFor(b => b.kind.endsWith('-shop'));

export function inTown({ x, y }) {
  return nationLayouts.some(city => inSettlement(city, { x, y }));
}

const [elmCity, violetCity, cedarCity] = nationLayouts;
const junctionY = 3440;

function roadSection(x1, y1, x2, y2) {
  // Tile boundaries keep the route continuous in both terrain sampling and the map.
  const tile = settings.tile;
  const firstEdge = coordinate => Math.floor(coordinate / tile) * tile;
  return {
    left: firstEdge(Math.min(x1, x2)), right: firstEdge(Math.max(x1, x2)) + tile,
    top: firstEdge(Math.min(y1, y2)), bottom: firstEdge(Math.max(y1, y2)) + tile,
  };
}

const nationalRoads = [
  roadSection(elmCity.x, elmCity.y, cedarCity.x, cedarCity.y),
  roadSection(cedarCity.x, junctionY, violetCity.x, junctionY),
  roadSection(violetCity.x, junctionY, violetCity.x, violetCity.y),
];

export function terrainAt(x, y) {
  if (nationalRoads.some(road => x >= road.left && x < road.right
    && y >= road.top && y < road.bottom)) return 'road';
  const civicTerrain = nationTerrainAt(x, y);
  if (civicTerrain) return civicTerrain;
  const easternCity = nationLayouts[1];
  const fraction = easternCity ? Math.max(0, Math.min(1, (x - 2240) / (easternCity.x - 2240))) : 0;
  const roadY = 800 + fraction * ((easternCity?.y ?? 800) - 800);
  if (Math.abs(y - roadY - (1 - fraction) * Math.sin((x - 1120) / 200) * 37 * Math.min(1, Math.abs(x - 1120) / 300)) < 23
    || (Math.abs(x - 1112) < 18 && y >= 720 && y <= (nationLayouts[0]?.y ?? 928))) return 'road';
  const woods = Math.sin(x / 177) + Math.cos(y / 123) + Math.sin((x + y) / 271);
  return woods > 0.5 ? 'forest' : 'grass';
}

function overlapDepth(b, x, y, radius) {
  return Math.min(x - b.x + radius, b.x + b.w + radius - x,
    y - b.y + radius, b.y + b.h + radius - y);
}

export function facilityAt({ x, y }) {
  return buildings.find(b => overlapDepth(b, x, y, settings.player.radius) > 0);
}

function walkable(x, y, previous, settlementBuildings) {
  const { radius } = settings.player;
  return !facilityAt({ x, y })
    && !settlementBuildings.some(b => {
      const depth = overlapDepth(b, x, y, radius);
      // A player standing on a just-completed site can always step out.
      return depth > 0 && depth > overlapDepth(b, previous.x, previous.y, radius);
    });
}

export const cave = {
  id: 'cave-spider',
  name: '岩陰の洞窟',
  width: 768,
  height: 576,
  entrance: { x: 1376, y: 496 },
  fieldArrival: { x: 1376, y: 536 },
  exit: { x: 384, y: 512 },
  caveArrival: { x: 384, y: 472 },
  spawns: [
    { id: 'cave-west', kind: 'rat', x: 192, y: 320 },
    { id: 'cave-east', kind: 'spider', x: 568, y: 288 },
    { id: 'cave-north', kind: 'spider', x: 384, y: 144 },
  ],
};

export const field = { id: 'field', width: settings.mapWidth, height: settings.mapHeight, spawns: [] };
export const portalRadius = 19;

export function movePlayer(player, dx, dy, dt, area = field, settlementBuildings = []) {
  const length = Math.max(1, Math.hypot(dx, dy));
  const step = settings.player.speed * dt / length;
  const margin = settings.player.radius + (area === cave ? settings.tile : 0);
  const x = Math.max(margin, Math.min(area.width - margin, player.x + dx * step));
  const y = Math.max(margin, Math.min(area.height - margin, player.y + dy * step));
  if (area === cave || walkable(x, player.y, player, settlementBuildings)) player.x = x;
  if (area === cave || walkable(player.x, y, player, settlementBuildings)) player.y = y;
}
