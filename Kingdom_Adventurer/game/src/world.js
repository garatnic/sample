import { settings } from './settings.js?v=49';

import { inSettlement, nationLayouts, nationTerrainAt } from './nation-layout.js?v=50';

export const start = { ...nationLayouts[0].arrival };
export const buildings = nationLayouts.flatMap(city => city.facilities);

function doorsFor(matches) {
  return Object.fromEntries(buildings.filter(matches).map(({ id, door }) => [id, door]));
}

export const innDoors = doorsFor(b => b.kind === 'inn');
export const guildDoors = doorsFor(b => b.kind === 'guild');
export const shopDoors = doorsFor(b => b.kind.endsWith('-shop'));

// Fixed slot definitions used only to read pre-chunk saves.
export const legacyFieldSpawns = [
  { id: 'east-road', kind: 'wolf', x: 1436, y: 800 },
  { id: 'west-road', kind: 'rat', x: 812, y: 800 },
  { id: 'north-grove', kind: 'spider', x: 1112, y: 460 },
  { id: 'south-field', kind: 'crab', x: 1112, y: 1060 },
  { id: 'east-grove', kind: 'spider', x: 1505, y: 670 },
  { id: 'east-field', kind: 'crab', x: 1510, y: 925 },
  { id: 'far-grove', kind: 'wolf', x: 1800, y: 580 },
  { id: 'far-west', kind: 'rat', x: 514, y: 650 },
  ...nationLayouts.flatMap(city => [
    { id: `${city.id}-deer`, kind: 'deer', x: city.x + 420, y: city.y + 420 },
    { id: `${city.id}-rabbit`, kind: 'rabbit', x: city.x - 365, y: city.y + 440 },
    { id: `${city.id}-fox`, kind: 'fox', x: city.x + 380, y: city.y - 315 },
  ]),
];

export function inTown({ x, y }) {
  return nationLayouts.some(city => inSettlement(city, { x, y }));
}

export function terrainAt(x, y) {
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
