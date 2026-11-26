import { buyWeapon, weapons } from './equipment.js';

export function setupGearMenus(state, input) {
  const shop = document.querySelector('#weapon-shop');
  const inventory = document.querySelector('#inventory');
  const shopList = document.querySelector('#weapon-stock');
  const inventoryList = document.querySelector('#inventory-items');
  const shopGold = document.querySelector('#shop-gold');
  const equipped = document.querySelector('#equipped');
  const unequip = document.querySelector('#unequip');
  const feedback = document.querySelector('#shop-feedback');

  function row(list, text, action, onClick) {
    const item = document.createElement('li');
    const description = document.createElement('span');
    description.textContent = text;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action;
    button.addEventListener('click', onClick);
    item.append(description, button);
    list.append(item);
    return button;
  }

  const details = weapon => `${weapon.name}　攻撃+${weapon.bonus} / 射程${weapon.range}`;
  const shopButtons = new Map();

  function refreshShop() {
    shopGold.textContent = `所持金 ${state.gold}G`;
    for (const [id, button] of shopButtons) {
      button.disabled = state.gold < weapons.get(id).price;
    }
  }

  for (const [id, weapon] of weapons) {
    const button = row(shopList, details(weapon), `${weapon.price}Gで買う`, () => {
      if (buyWeapon(state, id)) feedback.textContent = `${weapon.name}を購入しました`;
      refreshShop();
    });
    shopButtons.set(id, button);
  }

  function refreshInventory() {
    const player = state.player;
    equipped.textContent = `装備中: ${weapons.get(player.weaponId)?.name ?? '素手'}`;
    unequip.disabled = player.weaponId === null;
    for (const button of inventoryList.querySelectorAll('button')) {
      const active = button.value === player.weaponId;
      button.textContent = active ? '装備中' : '装備する';
      button.disabled = active;
    }
  }

  document.querySelector('#open-inventory').addEventListener('click', () => {
    if (document.querySelector('dialog[open]') || state.player.hp <= 0) return;
    input.clear();
    inventoryList.replaceChildren();
    document.querySelector('#inventory-empty').hidden = state.player.inventory.size > 0;
    for (const [id, quantity] of state.player.inventory) {
      const button = row(inventoryList, `${details(weapons.get(id))} ×${quantity}`, '装備する', () => {
        state.player.weaponId = id;
        refreshInventory();
      });
      button.value = id;
    }
    refreshInventory();
    inventory.showModal();
  });

  unequip.addEventListener('click', () => {
    state.player.weaponId = null;
    refreshInventory();
  });

  return () => {
    input.clear();
    feedback.textContent = '';
    refreshShop();
    shop.showModal();
  };
}
