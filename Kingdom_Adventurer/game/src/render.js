import { settings } from './settings.js';
import { buildings, innDoor, shopDoor, terrainAt } from './world.js';

const colors = { grass: '#658753', forest: '#41664a', road: '#b7a276', town: '#999365' };

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  function tile(x, y, size) {
    const variation = ((x * 37) ^ (y * 53)) & 15;
    const px = x * size;
    const py = y * size;
    const terrain = terrainAt(px + size / 2, py + size / 2);
    rect(px, py, size, size, colors[terrain]);
    if (terrain === 'forest') {
      rect(px + 7, py + 17, 21, 12, '#31533e');
      rect(px + 8 + variation % 4, py + 5, 12, 17, '#527c53');
      rect(px + 5 + variation % 4, py + 12, 18, 8, '#527c53');
      rect(px + 11 + variation % 4, py + 6, 5, 4, '#82a36e');
    } else {
      rect(px + 4 + variation, py + 8 + variation, 5, 2,
        { road: '#aa936c', town: '#aaa47a', grass: '#75945f' }[terrain]);
    }
  }

  function building({ x, y, w, h, kind }) {
    const inn = kind === 'inn';
    const shop = kind === 'weapon-shop';
    rect(x + 3, y + 6, w + 4, h, '#363e30');
    rect(x, y + 14, w, h - 14, '#d1b087');
    rect(x - 3, y, w + 6, h - 17, inn ? '#85533e' : '#666c51');
    rect(x - 3, y + 5, w + 6, 4, inn ? '#a77353' : '#81886b');
    rect(x - 3, y + h - 22, w + 6, 5, '#4c4637');
    rect(x + w / 2 - 7, y + h - 17, 14, 17, '#443729');
    rect(x + 8, y + h - 13, 8, 7, '#e3ce93');
    rect(x + w - 16, y + h - 13, 8, 7, '#e3ce93');
    if (!inn && !shop) return;
    rect(x + w / 2 - 17, y + 10, 34, 24, '#f0dbad');
    ctx.fillStyle = '#493821';
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px system-ui';
    ctx.fillText(inn ? '宿' : '武器', x + w / 2, y + 28);
    const door = inn ? innDoor : shopDoor;
    rect(door.x - 10, door.y - 6, 20, 12, '#cfbb8b');
  }

  function actor({ x, y, hp, flash, moving }, player, time) {
    rect(x - 11, y + 4, 22, 5, '#24352c88');
    if (player) {
      const step = moving ? Math.floor(time / 105) % 2 * 3 : 0;
      rect(x - 6, y - 3, 4, 9 - step, '#252d2e');
      rect(x + 2, y - 3, 4, 6 + step, '#252d2e');
      rect(x - 9, y - 15, 18, 15, flash ? '#fff0dc' : '#275064');
      rect(x - 6, y - 22, 12, 10, '#f2c694');
      rect(x - 7, y - 24, 14, 5, '#573b2c');
      return;
    }
    rect(x - 11, y - 12, 22, 15, flash ? '#ffd38b' : '#923f46');
    rect(x - 7, y - 17, 14, 5, '#703941');
    rect(x - 6, y - 10, 3, 3, '#f3d585');
    rect(x + 3, y - 10, 3, 3, '#f3d585');
    rect(x - 11, y - 23, 22, 3, '#30252a');
    rect(x - 11, y - 23, 22 * hp / settings.enemy.maxHp, 3, '#f1a678');
  }

  return function render(state, time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    rect(0, 0, width, height, '#192623');
    const { player, encounters, strike } = state;
    const left = Math.round(player.x - width / 2);
    const top = Math.round(player.y - height / 2);
    ctx.translate(-left, -top);
    const { tile: size, mapWidth, mapHeight } = settings;
    for (let y = Math.max(0, Math.floor(top / size)); y * size < Math.min(mapHeight, top + height); y++) {
      for (let x = Math.max(0, Math.floor(left / size)); x * size < Math.min(mapWidth, left + width); x++) {
        tile(x, y, size);
      }
    }
    for (const entry of buildings) building(entry);
    for (const { x, y } of state.goldDrops) {
      rect(x - 5, y - 5, 10, 10, '#654319');
      rect(x - 4, y - 4, 8, 8, '#f2bc35');
      rect(x - 2, y - 3, 3, 2, '#fff1a0');
    }
    for (const { enemy } of encounters) {
      if (enemy) actor(enemy, false, time);
    }
    actor(player, true, time);
    if (strike) {
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 8);
      ctx.lineTo(strike.x, strike.y - 8);
      ctx.strokeStyle = '#fae2a2';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };
}
