import { settings } from './settings.js?v=49';
import { chunkAt } from './mob-world.js?v=52';
import { cave, field } from './world.js?v=52';

const colors = { grass: '#658753', forest: '#41664a', road: '#b7a276', town: '#999365' };

export function discoverLocation(state) {
  if (state.area !== field) return;
  const chunk = chunkAt(state.mobWorld, state.player.x, state.player.y);
  if (chunk) state.exploredChunks.add(chunk.id);
}

export function setupWorldMap(state, input) {
  const button = document.querySelector('#open-map');
  const dialog = document.querySelector('#world-map');
  const canvas = dialog.querySelector('canvas');
  const context = canvas.getContext('2d');
  const location = dialog.querySelector('#map-location');
  const scale = 4 / settings.tile;
  canvas.width = field.width * scale;
  canvas.height = field.height * scale;

  button.addEventListener('click', () => {
    input.clear();
    const underground = state.area === cave;
    const point = underground ? cave.entrance : state.player;
    const chunk = chunkAt(state.mobWorld, point.x, point.y);
    if (chunk) state.exploredChunks.add(chunk.id);

    context.fillStyle = '#202b28';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (const id of state.exploredChunks) {
      for (const tile of state.mobWorld.chunks[id].tiles) {
        context.fillStyle = colors[tile.terrain];
        context.fillRect(tile.x * scale - 2, tile.y * scale - 2, 4, 4);
      }
    }

    const x = point.x * scale;
    const y = point.y * scale;
    context.beginPath();
    context.arc(x, y, 14, 0, 2 * Math.PI);
    context.fillStyle = '#ffd36d';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#151c18';
    context.stroke();
    location.textContent = underground ? '現在地：岩陰の洞窟（地図上は入口）' : '● 現在地';
    dialog.showModal();
  });
}
