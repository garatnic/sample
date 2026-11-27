import { settings } from './settings.js?v=49';
import { nationSettings as config } from './nation-settings.js?v=50';

const names = [['楡の国', '楡の宿場町'], ['紫峰の国', '紫峰の開拓町']];
const origin = { x: 1112, y: 1856 };
const columns = [-96, 96, -192, 192, -288, 288];
const facilityRow = 384;
const facilityTypes = [[-192, 'inn'], [-96, 'goods-shop'], [96, 'weapon-shop'], [192, 'guild']];
const rows = [0, -96, 96, -192, 192, 288];

function plot(id, x, row, kind) {
  return { id, x: x - 27, y: row - 67, w: 54, h: 42, door: { x, y: row }, kind };
}

export function createNationLayouts() {
  const columnsAvailable = Math.max(1, 1 + Math.floor((settings.mapWidth - config.sourceRadius - origin.x) / config.spacing.x));
  return Array.from({ length: config.count }, (_, index) => {
    const id = `nation-${index + 1}`;
    const cityId = `${id}-city-1`;
    const x = origin.x + config.spacing.x * (index % columnsAvailable);
    const y = origin.y + config.spacing.y * (Math.floor(index / columnsAvailable) + (index % columnsAvailable) % 2);
    if (x + config.sourceRadius >= settings.mapWidth || y + facilityRow + settings.tile >= settings.mapHeight) {
      throw new RangeError('The map is too small for the configured national settlements');
    }
    const [name, cityName] = names[index] ?? [`第${index + 1}国家`, `第${index + 1}都市`];
    const plots = rows.flatMap(dy => columns
      .filter(dx => Math.max(Math.abs(dx), Math.abs(dy)) <= config.buildingRadius && (dx !== -96 || dy !== 0))
      .map(dx => plot(`${cityId}-plot-${dx}-${dy}`, x + dx, y + dy)));
    const sources = ['food', 'wood'].flatMap((kind, side) => Array.from(
      { length: config.sourcesPerResource }, (_, i) => ({
        id: `${cityId}-${kind}-${i}`,
        kind,
        x: x + (side ? 1 : -1) * (config.sourceRadius - (i % 2) * 64),
        y: y + rows[Math.floor(i / 2)],
      }),
    ));
    const facilities = facilityTypes.map(([dx, kind]) => {
      const firstCityId = { inn: 'inn-crossroads', guild: 'house-southwest' }[kind] ?? kind;
      return plot(index === 0 ? firstCityId : `${cityId}-${kind}`, x + dx, y + facilityRow, kind);
    });
    return { id, name, cityId, cityName, x, y, plots, sources, facilities,
      arrival: { x, y: y + facilityRow },
      center: plot(`${cityId}-center`, x - 96, y, 'center') };
  });
}

export const nationLayouts = createNationLayouts();

export function inSettlement(city, { x, y }) {
  return Math.abs(x - city.x) <= config.buildingRadius + 32 && y >= city.y - 265 && y <= city.y + facilityRow + 17;
}

export function nationTerrainAt(x, y) {
  for (const city of nationLayouts) {
    const dx = Math.abs(x - city.x);
    const dy = y - city.y;
    if (dx < 17 && dy >= -205 && dy <= facilityRow + 15) return 'road';
    if (dx <= config.sourceRadius + 12 && (rows.some(row => Math.abs(dy - row) < 12) || Math.abs(dy - facilityRow) < 12)) return 'road';
    if (inSettlement(city, { x, y })) return 'town';
  }
  return null;
}
