import { settings } from './settings.js?v=34';

import { inSettlement, nationLayouts, nationTerrainAt } from './nation-layout.js?v=34';

export const town = { id: 'town-crossroads', name: '楡の宿場町', x: 928, y: 608, w: 384, h: 320 };
export const start = { x: 1112, y: 800 };
export const buildings = [
  { id: 'inn-crossroads', x: 1070, y: 666, w: 84, h: 59, kind: 'inn' },
  { id: 'house-west', x: 972, y: 697, w: 56, h: 48, kind: 'goods-shop' },
  { id: 'house-east', x: 1204, y: 697, w: 58, h: 49, kind: 'weapon-shop' },
  { id: 'house-southwest', x: 1007, y: 844, w: 58, h: 47, kind: 'guild' },
  { id: 'house-southeast', x: 1174, y: 849, w: 66, h: 50, kind: 'annex' },
];
const inn = buildings.find(building => building.kind === 'inn');
export const innDoor = { x: inn.x + inn.w / 2, y: inn.y + inn.h + 12 };

export const guildDoors = Object.fromEntries(
  buildings.filter(building => building.kind === 'guild').map(({ id, x, y, w, h }) =>
    [id, { x: x + w / 2, y: y + h + 12 }]),
);

export const shopDoors = Object.fromEntries(
  buildings.filter(building => building.kind.endsWith('-shop')).map(({ kind, x, y, w, h }) =>
    [kind, { x: x + w / 2, y: y + h + 12 }]),
);

export const spawns = [
  { id: 'east-road', kind: 'wolf', x: 1436, y: 800 },
  { id: 'west-road', kind: 'rat', x: 812, y: 800 },
  { id: 'north-grove', kind: 'spider', x: 1112, y: 460 },
  { id: 'south-field', kind: 'crab', x: 1112, y: 1060 },
  { id: 'east-grove', kind: 'spider', x: 1505, y: 670 },
  { id: 'east-field', kind: 'crab', x: 1510, y: 925 },
  { id: 'far-grove', kind: 'wolf', x: 1800, y: 580 },
  { id: 'far-west', kind: 'rat', x: 514, y: 650 },
];

export function inTown({ x, y }) {
  return (x >= town.x && x <= town.x + town.w && y >= town.y && y <= town.y + town.h)
    || nationLayouts.some(city => inSettlement(city, { x, y }));
}

export function terrainAt(x, y) {
  const civicTerrain = nationTerrainAt(x, y);
  if (civicTerrain) return civicTerrain;
  const easternCity = nationLayouts[1];
  const fraction = easternCity ? Math.max(0, Math.min(1, (x - 2240) / (easternCity.x - 2240))) : 0;
  const roadY = 800 + fraction * ((easternCity?.y ?? 800) - 800);
  if (Math.abs(y - roadY - (1 - fraction) * Math.sin((x - 1120) / 200) * 37 * Math.min(1, Math.abs(x - 1120) / 300)) < 23
    || (Math.abs(x - 1112) < 18 && y >= 720 && y <= (nationLayouts[0]?.y ?? 928))) return 'road';
  if (x >= town.x && x <= town.x + town.w && y >= town.y && y <= town.y + town.h) return 'town';
  const woods = Math.sin(x / 177) + Math.cos(y / 123) + Math.sin((x + y) / 271);
  return woods > 0.5 ? 'forest' : 'grass';
}

function overlapDepth(b, x, y, radius) {
  return Math.min(x - b.x + radius, b.x + b.w + radius - x,
    y - b.y + radius, b.y + b.h + radius - y);
}

function walkable(x, y, previous, settlementBuildings) {
  const { radius } = settings.player;
  return !buildings.some(b => x > b.x - radius && x < b.x + b.w + radius
    && y > b.y - radius && y < b.y + b.h + radius)
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

export const field = { id: 'field', width: settings.mapWidth, height: settings.mapHeight, spawns };
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
