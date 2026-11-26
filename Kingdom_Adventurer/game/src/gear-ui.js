import { attackDamage, maxHealth } from './growth.js?v=5';
import { attackInterval, buyItem, canEquipItem, defenseRating, equippedId, equipItem, items, ringSlots, slots, unequipSlot } from './equipment.js?v=15';

export function setupGearMenus(state, input) {
  const shop = document.querySelector('#equipment-shop');
  const inventory = document.querySelector('#inventory');
  const shopList = document.querySelector('#shop-stock');
  const inventoryList = document.querySelector('#inventory-items');
  const shopGold = document.querySelector('#shop-gold');
  const feedback = document.querySelector('#shop-feedback');
  const empty = document.querySelector('#inventory-empty');
  const hp = document.querySelector('#gear-hp');
  const attack = document.querySelector('#gear-attack');
  const defense = document.querySelector('#gear-defense');
  const slotButtons = document.querySelectorAll('[data-gear-slot]');
  const inventoryHeading = document.querySelector('#equipment-inventory-title');
  let shopFilter = 'all';
  let inventoryFilter = 'all';

  function row(list, text, actions) {
    const item = document.createElement('li');
    const description = document.createElement('span');
    description.textContent = text;
    item.append(description);
    for (const { label, onClick, disabled = false } of actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      button.addEventListener('click', onClick);
      item.append(button);
    }
    list.append(item);
    return item;
  }

  function filters(selector, onChange) {
    const group = document.querySelector(selector);
    const buttons = new Map();
    for (const [key, label] of [['all', '全種類'], ...slots]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => onChange(key));
      group.append(button);
      buttons.set(key, button);
    }
    return active => {
      for (const [key, button] of buttons) button.setAttribute('aria-pressed', String(key === active));
    };
  }

  const details = item => item.slot === 'weapon'
    ? `${item.name}　攻撃+${item.bonus} / 射程${item.range} / 攻撃間隔${attackInterval(item).toFixed(2)}秒`
    : `${item.name}　防御+${item.defense}`;

  const markShopFilter = filters('#shop-tabs', key => {
    shopFilter = key;
    renderShop();
  });
  const markInventoryFilter = filters('#inventory-tabs', key => {
    inventoryFilter = key;
    renderInventory();
  });

  const shopButtons = new Map();
  function refreshShopBalance() {
    shopGold.textContent = `所持金 ${state.gold}G`;
    for (const [id, button] of shopButtons) {
      button.disabled = state.gold < items.get(id).price;
    }
  }

  function renderShop() {
    markShopFilter(shopFilter);
    shopList.replaceChildren();
    shopButtons.clear();
    for (const [id, item] of items) {
      if (shopFilter !== 'all' && shopFilter !== item.slot) continue;
      const entry = row(shopList, details(item), [{
        label: `${item.price}Gで買う`,
        onClick: () => {
          if (buyItem(state, id)) feedback.textContent = `${item.name}を購入しました`;
          refreshShopBalance();
        },
      }]);
      shopButtons.set(id, entry.querySelector('button'));
    }
    refreshShopBalance();
  }

  function renderInventory() {
    const player = state.player;
    const weapon = items.get(player.weaponId);
    hp.textContent = `${Math.ceil(player.hp * 10) / 10} / ${maxHealth(player.level)}`;
    attack.textContent = attackDamage(player.level) + (weapon?.bonus ?? 0);
    defense.textContent = defenseRating(player);
    for (const button of slotButtons) {
      const slot = button.dataset.gearSlot;
      const item = items.get(equippedId(player, slot));
      button.querySelector('small').textContent = item?.name ?? (slot === 'weapon' ? '素手' : '未装備');
    }

    markInventoryFilter(inventoryFilter);
    inventoryList.replaceChildren();
    for (const [id, quantity] of player.inventory) {
      const item = items.get(id);
      if (inventoryFilter !== 'all' && inventoryFilter !== item.slot) continue;
      const destinations = item.slot === 'ring' ? [...ringSlots] : [[item.slot, '']];
      const rowIndex = inventoryList.children.length;
      const actions = destinations.map(([slot, label], buttonIndex) => {
        const active = equippedId(player, slot) === id;
        return {
          label: active ? (label ? `${label}から外す` : '外す') : `${label ? `${label}に` : ''}装備する`,
          disabled: !active && !canEquipItem(player, id, slot),
          onClick: () => {
            if (active) unequipSlot(player, slot);
            else equipItem(player, id, slot);
            renderInventory();
            inventoryList.children[rowIndex]?.querySelectorAll('button')[buttonIndex]?.focus();
          },
        };
      });
      row(inventoryList, `${details(item)} ×${quantity}`, actions);
    }
    empty.hidden = inventoryList.children.length > 0;
  }

  for (const button of slotButtons) {
    button.addEventListener('click', () => {
      const slot = button.dataset.gearSlot;
      inventoryFilter = ringSlots.has(slot) ? 'ring' : slot;
      renderInventory();
      inventoryHeading.focus();
    });
  }

  document.querySelector('#open-inventory').addEventListener('click', () => {
    if (document.querySelector('dialog[open]') || state.player.hp <= 0) return;
    input.clear();
    inventoryFilter = 'all';
    renderInventory();
    inventory.showModal();
  });

  return () => {
    input.clear();
    shopFilter = 'all';
    feedback.textContent = '';
    renderShop();
    shop.showModal();
  };
}
