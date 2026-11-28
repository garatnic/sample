import { playerAttack } from './weapon-skill.js?v=49';
import { maxHealth } from './growth.js?v=49';
import { attackInterval, canEquipItem, defenseRating, equippedId, equipItem, items, ringSlots, slots, unequipSlot } from './equipment.js?v=53';
import { acceptsItem, buyItem, inventoryTabs, itemGroup, sellableQuantity, sellItem, shops, shopBalance, shopCanAcceptStock, shopInventory, shopPrice, tradeNation } from './shop.js?v=55';
import { canUseItem, maxMp, useItem } from './consumables.js?v=53';

export function setupGearMenus(state, input) {
  const shop = document.querySelector('#equipment-shop');
  const inventory = document.querySelector('#inventory');
  const shopTitle = document.querySelector('#shop-title');
  const balanceLabel = document.querySelector('#shop-balance');
  const shopEmpty = document.querySelector('#shop-empty');
  const buyButton = document.querySelector('#shop-buy');
  const sellButton = document.querySelector('#shop-sell');
  const shopList = document.querySelector('#shop-stock');
  const inventoryList = document.querySelector('#inventory-items');
  const shopGold = document.querySelector('#shop-gold');
  const feedback = document.querySelector('#shop-feedback');
  const empty = document.querySelector('#inventory-empty');
  const itemFeedback = document.querySelector('#item-feedback');
  const mp = document.querySelector('#gear-mp');
  const hp = document.querySelector('#gear-hp');
  const attack = document.querySelector('#gear-attack');
  const defense = document.querySelector('#gear-defense');
  const slotButtons = document.querySelectorAll('[data-gear-slot]');
  const inventoryHeading = document.querySelector('#equipment-inventory-title');
  let shopId;
  let shopMode;
  let markShopFilter;
  let shopFilter = 'all';
  let inventoryFilter = 'all';
  let equipmentOnly = true;
  let markInventoryFilter;

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

  function filters(selector, tabs, onChange) {
    const group = document.querySelector(selector);
    group.replaceChildren();
    const buttons = new Map();
    for (const [key, label] of [['all', '全種類'], ...tabs]) {
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

  const itemStats = item => item.slot === 'weapon'
    ? `攻撃+${item.bonus} / 射程${item.range} / 攻撃間隔${attackInterval(item).toFixed(2)}秒`
    : item.slot ? `防御+${item.defense}` : '';
  const effectText = ({ hp, mp, poison } = {}) => {
    if (poison) return `次の通常攻撃で毒ダメージ+${poison}`;
    return [hp && `HP+${hp}`, mp && `MP+${mp}`].filter(Boolean).join(' / ');
  };
  const details = item => [item.name, itemStats(item) || effectText(item.effect)].filter(Boolean).join('　');

  function setShopMode(mode) {
    shopMode = mode;
    buyButton.setAttribute('aria-pressed', String(mode === 'buy'));
    sellButton.setAttribute('aria-pressed', String(mode === 'sell'));
    feedback.textContent = '';
    renderShop();
  }

  buyButton.addEventListener('click', () => setShopMode('buy'));
  sellButton.addEventListener('click', () => setShopMode('sell'));

  function renderShop(expandedId, focusId) {
    markShopFilter(shopFilter);
    shopList.replaceChildren();
    shopGold.textContent = `所持金 ${state.gold}G`;
    const balance = shopBalance(state, shopId);
    balanceLabel.textContent = `${tradeNation(state, shopId) ? '国庫' : '店の所持金'} ${balance}G`;
    const buying = shopMode === 'buy';
    const stock = shopInventory(state, shopId);
    let focusTarget = buying ? buyButton : sellButton;
    for (const [id, item] of items) {
      if (!acceptsItem(shopId, item) || (shopFilter !== 'all' && shopFilter !== itemGroup(item))) continue;
      const inStock = stock.get(id) ?? 0;
      const owned = state.player.inventory.get(id) ?? 0;
      if (!(buying ? inStock : owned)) continue;
      const price = shopPrice(shopId, id, buying);
      const equipped = !buying && sellableQuantity(state.player, id) <= 0;
      const entry = document.createElement('li');
      const disclosure = document.createElement('details');
      disclosure.name = 'shop-product';
      disclosure.dataset.itemId = id;
      disclosure.open = expandedId === id;
      const summary = document.createElement('summary');
      const ownedLabel = owned ? `、所持${owned}` : '';
      summary.textContent = `${item.name}（在庫${inStock}${ownedLabel}）`;
      const facts = document.createElement('p');
      const group = shops[shopId].tabs.find(([key]) => key === itemGroup(item))[1];
      const stats = itemStats(item) || effectText(item.effect);
      facts.textContent = [group, stats].filter(Boolean).join(' / ');

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${price}G`;
      button.setAttribute('aria-label', `${item.name}を${price}Gで${buying ? '買う' : '売る'}`);
      const insufficient = (buying ? state.gold : balance) < price;
      const full = !buying && !shopCanAcceptStock(state, shopId);
      button.disabled = equipped || insufficient || full;
      disclosure.append(summary, facts);
      if (button.disabled) {
        const reason = document.createElement('small');
        reason.textContent = equipped ? '装備中のため売却できません' : insufficient ? '所持金が足りません' : '交易所在庫が満杯です';
        disclosure.append(reason);
      }
      button.addEventListener('click', () => {
        const transact = buying ? buyItem : sellItem;
        if (!transact(state, shopId, id)) return;
        feedback.textContent = `${item.name}を${buying ? '購入' : '売却'}しました`;
        renderShop(shopList.querySelector('details[open]')?.dataset.itemId, id);
      });
      entry.append(disclosure, button);
      shopList.append(entry);
      if (focusId === id) focusTarget = button.disabled ? summary : button;
    }
    if (focusId) focusTarget.focus({ preventScroll: true });
    shopEmpty.hidden = shopList.children.length > 0;
    shopEmpty.textContent = buying ? '該当する商品はありません。' : 'この分類で買い取れる所持品はありません。';
  }

  function renderInventory() {
    const player = state.player;
    const weapon = items.get(player.weaponId);
    hp.textContent = `${Math.ceil(player.hp * 10) / 10} / ${maxHealth(player.level)}`;
    mp.textContent = `${player.mp} / ${maxMp}`;
    attack.textContent = Number(playerAttack(player, weapon).toFixed(2));
    defense.textContent = defenseRating(player);
    for (const button of slotButtons) {
      const slot = button.dataset.gearSlot;
      const item = items.get(equippedId(player, slot));
      button.classList.toggle('is-equipped', Boolean(item));
      button.querySelector('small').textContent = item ? `✓ ${item.name}` : (slot === 'weapon' ? '素手' : '未装備');
    }

    markInventoryFilter(inventoryFilter);
    inventoryList.replaceChildren();
    for (const [id, quantity] of player.inventory) {
      const item = items.get(id);
      if (Boolean(item.slot) !== equipmentOnly) continue;
      if (inventoryFilter !== 'all' && inventoryFilter !== itemGroup(item)) continue;
      if (!item.slot) {
        const index = inventoryList.children.length;
        const actions = item.effect ? [{
          label: '使う',
          disabled: !canUseItem(player, id),
          onClick: () => {
            if (!useItem(player, id)) return;
            itemFeedback.textContent = item.effect.poison
              ? `${item.name}を使いました。次の攻撃に毒が乗ります。`
              : `${item.name}を使いました。`;
            renderInventory();
            const next = inventoryList.children[index]?.querySelector('button');
            (next && !next.disabled ? next : inventoryHeading).focus();
          },
        }] : [];
        row(inventoryList, `${details(item)} ×${quantity}`, actions);
        continue;
      }
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

  function openInventory(showEquipment) {
    if (document.querySelector('dialog[open]') || state.player.hp <= 0) return;
    input.clear();
    inventoryFilter = 'all';
    equipmentOnly = showEquipment;
    inventory.classList.toggle('inventory-goods', !showEquipment);
    document.querySelector('#inventory-title').textContent = showEquipment ? '装備' : '道具';
    markInventoryFilter = filters('#inventory-tabs', showEquipment ? slots : inventoryTabs, key => {
      inventoryFilter = key;
      renderInventory();
    });
    itemFeedback.textContent = !showEquipment && state.player.pendingPoison ? '次の攻撃に毒が乗ります。' : '';
    renderInventory();
    inventory.showModal();
  }

  document.querySelector('#open-inventory').addEventListener('click', () => openInventory(true));
  document.querySelector('#open-items').addEventListener('click', () => openInventory(false));

  return id => {
    input.clear();
    shopId = id;
    shopTitle.textContent = shops[id].name;
    shopFilter = 'all';
    markShopFilter = filters('#shop-tabs', shops[id].tabs, key => {
      shopFilter = key;
      renderShop();
    });
    setShopMode('buy');
    shop.showModal();
  };
}
