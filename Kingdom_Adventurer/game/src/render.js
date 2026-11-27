import { animalTypes, settings } from './settings.js?v=39';
import { buildings, cave, field, terrainAt } from './world.js?v=39';

import { modeFor, residentPosition } from './nation-simulation.js?v=38';

import { harvestSeconds, sourceQuantity } from './trees.js?v=37';

const fruitOffsets = [[-11, -24], [6, -27], [-4, -34], [10, -17], [-9, -15], [1, -21], [11, -32], [-15, -21]];

const colors = { grass: '#658753', forest: '#41664a', road: '#b7a276', town: '#999365' };

const enemySprites = {
  deer: [[-13,-12,20,11,'#99623d'],[-11,-3,3,8,'#593c2c'],[3,-3,3,8,'#593c2c'],
    [4,-20,5,13,'#99623d'],[7,-22,9,6,'#bb8756'],[8,-26,2,6,'#e5ca96'],[13,-28,2,7,'#e5ca96']],
  rabbit: [[-8,-9,13,10,'#c2b7a8'],[2,-12,8,8,'#ddd0bd'],[3,-19,3,8,'#ddd0bd'],
    [7,-18,2,7,'#e8ccbe'],[-11,-7,5,5,'#eee4d6'],[8,-10,2,2,'#3a302c']],
  fox: [[-12,-9,20,10,'#c66836'],[-22,-9,13,6,'#da7841'],[-24,-9,6,5,'#eee1c8'],
    [5,-14,9,9,'#db7840'],[5,-18,3,5,'#ad4d2d'],[11,-17,3,5,'#ad4d2d'],[11,-8,6,4,'#f1dec0']],

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

  function drawTree({ x, y }, quantity) {
    rect(x - 15, y + 1, 30, 6, '#263d3288');
    rect(x - 4, y - 17, 8, 21, '#765037');
    rect(x - 17, y - 29, 34, 15, '#274c36');
    rect(x - 12, y - 39, 24, 23, '#46794a');
    rect(x - 19, y - 30, 33, 12, '#568451');
    for (const [dx, dy] of fruitOffsets.slice(0, quantity)) {
      rect(x + dx, y + dy, 5, 5, '#ec6658');
      rect(x + dx + 1, y + dy, 2, 1, '#fff0c9');
    }
  }

  function building({ x, y, w, h, kind, door }) {
    const inn = kind === 'inn';
    const shop = kind.endsWith('-shop');
    rect(x + 3, y + 6, w + 4, h, '#363e30');
    rect(x, y + 14, w, h - 14, '#d1b087');
    const roof = { inn: '#85533e', center: '#575381', warehouse: '#7b5638', house: '#5c7451' };
    rect(x - 3, y, w + 6, h - 17, roof[kind] ?? '#666c51');
    rect(x - 3, y + 5, w + 6, 4, inn ? '#a77353' : '#81886b');
    rect(x - 3, y + h - 22, w + 6, 5, '#4c4637');
    rect(x + w / 2 - 7, y + h - 17, 14, 17, '#443729');
    rect(x + 8, y + h - 13, 8, 7, '#e3ce93');
    rect(x + w - 16, y + h - 13, 8, 7, '#e3ce93');
    const guild = kind === 'guild';
    const civic = kind === 'center' || kind === 'warehouse';
    if (!inn && !shop && !guild && !civic) return;
    rect(x + w / 2 - 17, y + 10, 34, 24, '#f0dbad');
    ctx.fillStyle = '#493821';
    ctx.textAlign = 'center';
    ctx.font = guild || civic ? 'bold 10px system-ui' : 'bold 15px system-ui';
    const labels = { inn: '宿', guild: 'ギルド', 'goods-shop': '道具', 'weapon-shop': '装備',
      center: '国の中心', warehouse: '倉庫' };
    ctx.fillText(labels[kind], x + w / 2, y + 27);
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
    if (animalTypes[kind]) return;
    rect(x - 11, y - 23, 22, 3, '#30252a');
    rect(x - 11, y - 23, 22 * hp / maxHp, 3, '#f1a678');
  }

  function drawResident({ x, y }, carrying, tint) {
    rect(x - 7, y + 2, 14, 4, '#24352c88');
    rect(x - 5, y - 9, 10, 12, tint);
    rect(x - 4, y - 15, 8, 7, '#ecc18e');
    if (carrying) rect(x + 4, y - 7, 6, 7, carrying.kind === 'wood' ? '#8b5832' : '#dcb759');
  }

  function drawSource(source, minute) {
    const { x, y, kind } = source;
    if (kind === 'food') {
      drawTree(source, sourceQuantity(source, minute));
    } else if (source.readyAt > minute) {
      rect(x - 6, y - 6, 12, 8, '#766049');
    } else {
      rect(x - 3, y - 18, 6, 20, '#765037');
      rect(x - 11, y - 28, 22, 16, '#214e37');
      rect(x - 8, y - 31, 16, 11, '#52885b');
    }
  }

  return function render(state, time, minute) {
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
    const visible = ({ x, y }) =>
      x >= left - 100 && x <= left + width + 100 && y >= top - 80 && y <= top + height + 80;
    for (const entry of outdoors ? buildings : []) {
      if (visible(entry)) building(entry);
    }
    if (outdoors) {
      for (const [index, nation] of state.nations.nations.entries()) {
        for (const city of nation.cities) {
          if (modeFor(city, player) !== 'near') continue;
          for (const source of city.sources) if (visible(source)) drawSource(source, minute);
          for (const entry of city.buildings) if (visible(entry)) building(entry);
          const site = city.project?.site;
          if (site && visible(site)) {
            rect(site.x, site.y, site.w, site.h, '#bfa16d66');
            rect(site.x, site.y + site.h - 5, site.w, 5, '#dec087');
          }
          for (const resident of city.residents) {
            const position = residentPosition(city, resident, minute);
            if (visible(position)) drawResident(position, resident.carrying, index === 0 ? '#80663e' : '#76608c');
          }
        }
      }
    }
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
    const harvest = outdoors && state.harvest;
    if (harvest) {
      const { x, y } = harvest.source;
      rect(x - 22, y - 51, 44, 8, '#202a21');
      rect(x - 20, y - 49, 40 * Math.min(1, harvest.elapsed / harvestSeconds[harvest.source.kind]), 4, '#f3cd75');
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
