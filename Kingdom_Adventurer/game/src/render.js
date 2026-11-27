import { settings } from './settings.js';
import { buildings, cave, field, guildDoors, innDoor, shopDoors, terrainAt } from './world.js?v=29';

import { harvestSeconds } from './trees.js?v=28';

const fruitOffsets = [[-11, -24], [6, -27], [-4, -34], [10, -17], [-9, -15]];

const colors = { grass: '#658753', forest: '#41664a', road: '#b7a276', town: '#999365' };

const enemySprites = {
  wolf: [
    [-14, -7, 5, 4, '#495865'], [-8, -1, 4, 6, '#38424f'], [5, -1, 4, 6, '#38424f'],
    [-10, -10, 20, 11, '#8094a6'], [2, -15, 10, 10, '#a8b9c6'],
    [3, -19, 3, 5, '#a8b9c6'], [9, -18, 3, 5, '#a8b9c6'], [11, -10, 5, 4, '#495865'],
    [9, -13, 2, 2, '#ffe293'],
  ],
  rat: [
    [-15, -1, 10, 2, '#daa19b'], [-15, -4, 2, 4, '#daa19b'],
    [-8, -8, 15, 10, '#84654d'], [2, -10, 5, 5, '#d9968d'],
    [4, -6, 7, 6, '#b78a6c'], [8, -5, 2, 2, '#322a32'], [10, -2, 2, 2, '#efb0a2'],
  ],
  crab: [
    [-12, 0, 5, 3, '#874e39'], [7, 0, 5, 3, '#874e39'],
    [-10, -9, 20, 11, '#c97545'], [-6, -12, 12, 5, '#e29a56'],
    [-15, -8, 6, 5, '#e29a56'], [9, -8, 6, 5, '#e29a56'],
    [-14, -11, 3, 4, '#e29a56'], [11, -11, 3, 4, '#e29a56'],
    [-5, -9, 2, 2, '#382c32'], [3, -9, 2, 2, '#382c32'],
  ],
  spider: [
    [-15, -10, 30, 2, '#ae8eb5'], [-15, -5, 30, 2, '#ae8eb5'],
    [-14, 0, 28, 2, '#ae8eb5'], [-12, 4, 24, 2, '#ae8eb5'],
    [-7, -14, 14, 13, '#624469'], [-5, -6, 10, 9, '#8c6299'],
    [-3, -4, 2, 2, '#f3cf7d'], [1, -4, 2, 2, '#f3cf7d'],
  ],
};

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

  function caveTile(x, y, size) {
    const wall = x === 0 || y === 0 || (x + 1) * size === cave.width || (y + 1) * size === cave.height;
    const px = x * size;
    const py = y * size;
    const variation = ((x * 37) ^ (y * 53)) & 15;
    rect(px, py, size, size, wall ? '#292833' : '#51474a');
    rect(px + variation, py + 7 + variation, wall ? 14 : 5, wall ? 5 : 2, wall ? '#403943' : '#65575a');
  }

  function drawPortal({ x, y }, outdoors) {
    rect(x - 23, y - 30, 46, 36, '#4c494e');
    rect(x - 18, y - 39, 36, 16, '#74696d');
    rect(x - 14, y - 24, 28, 30, outdoors ? '#211d28' : '#d6b074');
    rect(x - 20, y + 5, 40, 4, '#a48862');
    ctx.fillStyle = '#fff1cd';
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(outdoors ? '洞窟入口' : '出口', x, y - 48);
  }

  function drawTree({ x, y, itemId, remaining, capacity }) {
    rect(x - 15, y + 1, 30, 6, '#263d3288');
    rect(x - 4, y - 17, 8, 21, '#765037');
    rect(x - 17, y - 29, 34, 15, '#274c36');
    rect(x - 12, y - 39, 24, 23, '#46794a');
    rect(x - 19, y - 30, 33, 12, '#568451');
    const visibleFruit = Math.ceil(remaining / capacity * fruitOffsets.length);
    for (const [dx, dy] of fruitOffsets.slice(0, visibleFruit)) {
      rect(x + dx, y + dy, 5, 5, itemId === 'apple' ? '#ec6658' : '#efbc76');
      rect(x + dx + 1, y + dy, 2, 1, '#fff0c9');
    }
  }

  function building({ id, x, y, w, h, kind }) {
    const inn = kind === 'inn';
    const shop = shopDoors[kind];
    rect(x + 3, y + 6, w + 4, h, '#363e30');
    rect(x, y + 14, w, h - 14, '#d1b087');
    rect(x - 3, y, w + 6, h - 17, inn ? '#85533e' : '#666c51');
    rect(x - 3, y + 5, w + 6, 4, inn ? '#a77353' : '#81886b');
    rect(x - 3, y + h - 22, w + 6, 5, '#4c4637');
    rect(x + w / 2 - 7, y + h - 17, 14, 17, '#443729');
    rect(x + 8, y + h - 13, 8, 7, '#e3ce93');
    rect(x + w - 16, y + h - 13, 8, 7, '#e3ce93');
    const guild = kind === 'guild';
    if (!inn && !shop && !guild) return;
    rect(x + w / 2 - 17, y + 10, 34, 24, '#f0dbad');
    ctx.fillStyle = '#493821';
    ctx.textAlign = 'center';
    ctx.font = guild ? 'bold 10px system-ui' : 'bold 15px system-ui';
    ctx.fillText(inn ? '宿' : guild ? 'ギルド' : kind === 'goods-shop' ? '道具' : '装備', x + w / 2, y + 28);
    const door = inn ? innDoor : guild ? guildDoors[id] : shop;
    rect(door.x - 10, door.y - 6, 20, 12, '#cfbb8b');
  }

  function actor({ x, y, hp, maxHp, flash, moving, kind }, player, time) {
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
    const sprite = enemySprites[kind];
    for (const [left, top, width, height, color] of sprite) {
      rect(x + left, y + top, width, height, flash ? '#ffd38b' : color);
    }
    rect(x - 11, y - 23, 22, 3, '#30252a');
    rect(x - 11, y - 23, 22 * hp / maxHp, 3, '#f1a678');
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
    const { tile: size } = settings;
    const area = state.area ?? field;
    const outdoors = area === field;
    const drawTile = outdoors ? tile : caveTile;
    for (let y = Math.max(0, Math.floor(top / size)); y * size < Math.min(area.height, top + height); y++) {
      for (let x = Math.max(0, Math.floor(left / size)); x * size < Math.min(area.width, left + width); x++) {
        drawTile(x, y, size);
      }
    }
    for (const tree of outdoors ? state.resources.trees : []) {
      if (tree.x >= left - 20 && tree.x <= left + width + 20
        && tree.y >= top - 8 && tree.y <= top + height + 40) drawTree(tree);
    }
    for (const entry of outdoors ? buildings : []) building(entry);
    drawPortal(outdoors ? cave.entrance : cave.exit, outdoors);
    for (const { x, y, materials } of state.lootDrops) {
      rect(x - 5, y - 5, 10, 10, '#654319');
      rect(x - 4, y - 4, 8, 8, materials.length ? '#bc8a55' : '#f2bc35');
      rect(x - 2, y - 3, 3, 2, '#fff1a0');
    }
    for (const { enemy } of encounters) {
      if (enemy) actor(enemy, false, time);
    }
    actor(player, true, time);
    const harvest = outdoors && state.resources.harvest;
    if (harvest) {
      const { x, y } = harvest.tree;
      rect(x - 22, y - 51, 44, 8, '#202a21');
      rect(x - 20, y - 49, 40 * Math.min(1, harvest.elapsed / harvestSeconds), 4, '#f3cd75');
    }
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
