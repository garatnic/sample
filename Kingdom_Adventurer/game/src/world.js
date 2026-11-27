import { settings } from './settings.js';

export const town = { id: 'town-crossroads', name: '楡の宿場町', x: 928, y: 608, w: 384, h: 320 };
export const start = { x: 1112, y: 800 };
export const buildings = [
  { id: 'inn-crossroads', x: 1070, y: 666, w: 84, h: 59, kind: 'inn' },
  { id: 'house-west', x: 972, y: 697, w: 56, h: 48, kind: 'goods-shop' },
  { id: 'house-east', x: 1204, y: 697, w: 58, h: 49, kind: 'weapon-shop' },
  { id: 'house-southwest', x: 1007, y: 844, w: 58, h: 47, kind: 'guild' },
  { id: 'house-southeast', x: 1174, y: 849, w: 66, h: 50, kind: 'house' },
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
  return x >= town.x && x <= town.x + town.w && y >= town.y && y <= town.y + town.h;
}

export function terrainAt(x, y) {
  if (Math.abs(y - 800 - Math.sin((x - 1120) / 200) * 37 * Math.min(1, Math.abs(x - 1120) / 300)) < 23
    || (Math.abs(x - 1112) < 18 && y >= 720)) return 'road';
  if (inTown({ x, y })) return 'town';
  const woods = Math.sin(x / 177) + Math.cos(y / 123) + Math.sin((x + y) / 271);
  return woods > 0.5 ? 'forest' : 'grass';
}

function walkable(x, y) {
  const { radius } = settings.player;
  return !buildings.some(b => x > b.x - radius && x < b.x + b.w + radius
    && y > b.y - radius && y < b.y + b.h + radius);
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

export function movePlayer(player, dx, dy, dt, area = field) {
  const length = Math.max(1, Math.hypot(dx, dy));
  const step = settings.player.speed * dt / length;
  const margin = settings.player.radius + (area === cave ? settings.tile : 0);
  const x = Math.max(margin, Math.min(area.width - margin, player.x + dx * step));
  const y = Math.max(margin, Math.min(area.height - margin, player.y + dy * step));
  if (area === cave || walkable(x, player.y)) player.x = x;
  if (area === cave || walkable(player.x, y)) player.y = y;
}
