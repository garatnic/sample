# 仕様・実装対応表 — Kingdom Adventurer

基準: 2026-11-27 / ver.31 / DEV-056 / 実装コミット `28972e901561ad7006869257d587e78a38cac5cd`。
正本: [現行仕様書](../specifications/current/CURRENT_SPECIFICATIONS.md)。全40仕様・実装ファイル21件。パスは `Kingdom_Adventurer/game/` 相対。主な処理・設定・呼出箇所・DOM/CSSの目印を示す。目標仕様IDの定義は[分野別統合仕様](../specifications/README.md)を参照。

## 検証の記録

基準時点の [tests/README.md](../../tests/README.md) は案内のみ。保存された実行可能な自動テストと登録済みテストIDはともに0件。過去の実行結果は[変更履歴](../development/CHANGELOG.md)・[TODO](../development/TODO.md)・[開発状況](../development/DEVELOPMENT_STATUS.md)を参照。

- 保存済み自動テスト — 再実行できるテストのIDとファイルを登録する。
- 単発実行 — Nodeの確認コードやブラウザ自動操作など、実行した方法と結果を記録する。保存済みテストIDは付けない。
- 手動検証 — 手操作や端末実機で確認した範囲を記録する。
- 静的確認 — コードや資料、ID、パスの照合などを記録する。
- 未検証 — 実行していない対象と理由を記録する。過去記録から方法を特定できない場合は、その旨を記録する。

## 仕様から実装を探す

| 現行仕様ID | 機能 | 実装ファイル・関数・役割 | 関連現行仕様ID | 関連目標仕様ID | 保存済み自動テスト |
|---|---|---|---|---|---|
| `CUR-SYS-001` | 起動 | index.html: module script・版付きstylesheet参照・DOM; package.json: type/private; src/main.js: モジュール初期化; style.css: 基本表示 | CUR-SYS-002, CUR-UI-001 | — | 未登録 |
| `CUR-SYS-002` | 初期状態 | src/main.js: createPlayer(), state; src/growth.js: maxHealth(); src/world.js: start; src/settings.js: player.maxHp / currency.startingGold; src/combat.js: createEncounters(); src/trees.js: createTrees(); src/consumables.js: maxMp | CUR-WORLD-002, CUR-COMBAT-001, CUR-LIFE-001 | — | 未登録 |
| `CUR-SYS-003` | フレーム処理 | src/main.js: frame(), update(), previous, requestAnimationFrame; src/input.js: read(); src/world.js: movePlayer(); src/combat.js: updateCombat(); src/render.js: render(); src/loot.js: collectLoot(); src/trees.js: updateTrees(); src/clock.js: gameMinutes(), gameDay() | CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001, CUR-UI-001 | — | 未登録 |
| `CUR-SYS-005` | ゲーム内時計 | src/clock.js: gameMinutes(), gameDateTime(), gameDay(), nextMorningMinute(); src/main.js: frame(), currentGameMinute(), clockBaseMinute, elapsedPlaySeconds; index.html: #game-clock; style.css: #game-clock; src/main.js: update() のギルド・果樹への日付渡し | CUR-SYS-003 | SYSTEM-002 | 未登録 |
| `CUR-SYS-004` | セーブ・ロード・削除 | index.html: #open-save/#save-menu; style.css: #open-save のポインター操作; src/main.js: state, applySave(), 宿泊・エリア切替からの自動保存、起動時復元; src/save-data.js: makeSave(), restoreSave(); src/save-store.js: readSave(), writeSave(), deleteSave(); src/save-menu.js: setupSaveMenu(), JSON取り込み・書き出し・確認; src/combat.js: inCombat(); src/world.js: エリア・施設IDと移動境界; src/settings.js: 敵設定・復元範囲; src/equipment.js: 装備整合性; src/growth.js: レベルとHP; src/consumables.js: maxMp; src/clock.js: gameDay(); src/trees.js: createTrees(), harvestSeconds | CUR-SYS-002, CUR-SYS-005, CUR-WORLD-006, CUR-INN-002, CUR-LIFE-001 | SYSTEM-011 | 未登録 |
| `CUR-WORLD-001` | 固定マップ | src/settings.js: tile/mapWidth/mapHeight; src/world.js: 固定配置・terrainAt(); src/render.js: render() のタイル範囲 | CUR-WORLD-003, CUR-MOVE-002, CUR-UI-002 | — | 未登録 |
| `CUR-WORLD-002` | 街 | src/world.js: town, start, inTown(); src/main.js: createPlayer(), frame() の所在地; src/combat.js: updateCombat() の安全判定 | CUR-COMBAT-002, CUR-UI-001, CUR-LIFE-001 | — | 未登録 |
| `CUR-WORLD-003` | 地形 | src/world.js: terrainAt(), inTown(); src/render.js: tile(), colors; src/world.js: movePlayer(), walkable()（地形を衝突に使わない） | CUR-WORLD-001, CUR-MOVE-002, CUR-UI-003 | — | 未登録 |
| `CUR-WORLD-004` | 建物 | src/world.js: buildings, inn, innDoor, shopDoors, guildDoors, walkable(); src/render.js: building(); src/main.js: update() の施設接触判定; index.html: #inn, #equipment-shop, #guild | CUR-MOVE-002, CUR-INN-001, CUR-UI-003 | — | 未登録 |
| `CUR-WORLD-005` | 果樹・採取・日次補充 | src/trees.js: treeLocations, createTrees(), takeFruit(), updateTrees(); src/main.js: update(), 死亡時の採取進捗解除; src/render.js: drawTree(), 採取バー; src/equipment.js: items; src/clock.js: gameDay(), gameMinutes(); src/settings.js: player.radius; src/consumables.js: useItem(); src/shop.js: sellItem() | CUR-SYS-005 | WORLD-006, ECO-008, EXPLORE-006 | 未登録 |
| `CUR-WORLD-006` | 岩陰の洞窟 | src/world.js: cave, field, portalRadius, movePlayer(); src/main.js: areaStates, state.area, update(), frame(), 死亡時の復帰; src/combat.js: createEncounters(), updateCombat(); src/render.js: caveTile(), drawPortal(), render(); src/loot.js: collectLoot(), dropLoot(); src/settings.js: tile, enemyTypes | CUR-WORLD-001, CUR-MOVE-002, CUR-COMBAT-001, CUR-COMBAT-007, CUR-LIFE-001 | EXPLORE-002 | 未登録 |
| `CUR-INPUT-001` | キーボード | src/input.js: directions, createInput(), keys, keydown/keyup/blur, clear(), read(); index.html: footer; style.css: footer/kbd | CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001 | — | 未登録 |
| `CUR-INPUT-002` | スワイプ移動 | src/input.js: createInput(), move(), clearTouch(), clear(), pointerイベント, read(); index.html: canvas; style.css: canvas の touch-action; src/main.js: createInput() 呼出 | CUR-MOVE-001, CUR-UI-005, CUR-INPUT-001 | — | 未登録 |
| `CUR-INPUT-003` | ゲームパッド | src/input.js: createInput().read() の navigator.getGamepads・axes・閾値; src/main.js: update() の入力取得 | CUR-MOVE-001, CUR-INPUT-001, CUR-INPUT-002 | — | 未登録 |
| `CUR-MOVE-001` | 移動速度 | src/settings.js: player.speed/radius; src/world.js: movePlayer(); src/input.js: read(); src/main.js: update() の moving; src/render.js: actor() | CUR-MOVE-002, CUR-INPUT-001, CUR-INPUT-002, CUR-INPUT-003, CUR-UI-004 | — | 未登録 |
| `CUR-MOVE-002` | 境界・衝突 | src/world.js: movePlayer(), walkable(), buildings; src/settings.js: mapWidth/mapHeight/player.radius | CUR-WORLD-001, CUR-WORLD-004, CUR-MOVE-001 | — | 未登録 |
| `CUR-COMBAT-001` | 敵出現枠 | src/world.js: spawns; src/combat.js: createEncounters(), updateCombat() の生成処理; src/settings.js: enemyTypes.maxHp; src/main.js: state.encounters; src/render.js: render() の敵描画 | CUR-COMBAT-003, CUR-COMBAT-006, CUR-SYS-002 | — | 未登録 |
| `CUR-COMBAT-002` | 安全地帯 | src/world.js: inTown(), town; src/combat.js: updateCombat() の safe・chasing・移動候補・自動攻撃制限 | CUR-WORLD-002, CUR-COMBAT-003, CUR-COMBAT-005 | — | 未登録 |
| `CUR-COMBAT-003` | 敵追跡・帰還 | src/combat.js: updateCombat() の chasing/goal/step/next; src/settings.js: enemyTypes.speed / enemy.reach/aggro/leash; src/world.js: inTown(), spawns | CUR-COMBAT-002, CUR-COMBAT-004 | — | 未登録 |
| `CUR-COMBAT-004` | 敵攻撃 | src/combat.js: updateCombat() の敵cooldown/flash・HP減算; src/combat.js: physicalDamage()・早期return; src/equipment.js: defenseRating(); src/settings.js: enemyTypes.damage/attackDelay / enemy.reach / difficulty.enemyDamageMultiplier; src/main.js: update() の player.flash・死亡判定; src/render.js: actor() | CUR-COMBAT-003, CUR-LIFE-001, CUR-UI-004 | — | 未登録 |
| `CUR-COMBAT-005` | プレイヤー自動攻撃 | src/combat.js: updateCombat() の player.cooldown・nearest/range・HP減算・strike、physicalDamage(); src/settings.js: player.range（素手）/damage、enemyTypes.defense、difficulty.playerDamageMultiplier; src/equipment.js: items, attackIntervals, attackInterval(); src/growth.js: attackDamage(); src/main.js: update() の戦闘呼出・strike期限; src/render.js: render() の攻撃線・actor() | CUR-COMBAT-002, CUR-COMBAT-006, CUR-UI-004 | — | 未登録 |
| `CUR-COMBAT-006` | 撃破・再出現 | src/combat.js: updateCombat() の enemy=null/remaining/generation/notice・戦利品配置・経験値付与・recordDefeat(); src/growth.js: gainExperience(); src/settings.js: enemy.spawnDelay / enemyTypes.maxHp; src/main.js: update() の通知期限、frame() の通知表示; src/render.js: render() の生存敵描画; src/quests.js: recordDefeat(); src/loot.js: dropLoot() | CUR-COMBAT-001, CUR-COMBAT-005, CUR-COMBAT-007, CUR-UI-001 | — | 未登録 |
| `CUR-COMBAT-007` | 戦利品ドロップ・拾得 | src/loot.js: dropLoot(), collectLoot(); src/combat.js: 撃破時の呼び出し; src/main.js: state, update(); src/settings.js: enemyTypes.materials, currency.pickupRadius; src/equipment.js: 素材データ; src/render.js: render() の戦利品描画; src/shop.js: sellItem() | CUR-COMBAT-001, CUR-COMBAT-006, CUR-SYS-003, CUR-SHOP-003, CUR-UI-004 | ITEM-006 | 未登録 |
| `CUR-GROWTH-001` | 討伐経験値・レベル | src/growth.js: growth, experienceToNextLevel(), gainExperience(), maxHealth(), attackDamage(); src/combat.js: 撃破時の付与と通知; src/main.js: createPlayer(), frame() | CUR-COMBAT-005, CUR-COMBAT-006, CUR-INN-002, CUR-LIFE-001, CUR-UI-001 | — | 未登録 |
| `CUR-INN-001` | 宿接触 | src/world.js: innDoor, buildings; src/main.js: update() の touchingInn/innContact/料金・残高案内/returnValue/showModal; src/input.js: clear(); index.html: #inn; src/render.js: building() の入口マーカー | CUR-WORLD-004, CUR-MOVE-001, CUR-INN-002 | — | 未登録 |
| `CUR-INN-002` | 宿泊 | src/main.js: inn closeイベント（残高確認・支払い・時計更新）, currentGameMinute(), frame() の停止条件; src/clock.js: nextMorningMinute(); src/settings.js: inn.price; src/growth.js: maxHealth(); index.html: #inn/#inn-offer/#inn-confirm/NO; style.css: dialog/button/backdrop; src/render.js: render() の継続描画 | CUR-INN-001, CUR-SYS-003, CUR-SYS-005, CUR-UI-001, CUR-UI-005 | SYSTEM-003 | 未登録 |
| `CUR-LIFE-001` | 死亡・再開 | src/combat.js: updateCombat() のHP0; src/main.js: update(), createPlayer(), death cancel/closeイベント（所持金・戦利品・成長維持）, frame(); src/input.js: clear(); src/world.js: start; src/settings.js: player.maxHp; index.html: #death; style.css: dialog/button; src/growth.js: maxHealth(); src/consumables.js: maxMp; src/trees.js: harvest | CUR-SYS-002, CUR-COMBAT-004, CUR-INN-001, CUR-UI-005 | — | 未登録 |
| `CUR-QUEST-001` | ギルドの討伐・素材収集依頼 | src/quests.js: templates, collectionPool, refreshGuild(), acceptQuest(), recordDefeat(), reportQuest(), setupQuestMenus(); src/main.js: state, update(); src/world.js: guildDoors, buildings; src/combat.js: updateCombat(); src/render.js: building(); index.html: #guild; src/settings.js: enemyTypes.materials; src/equipment.js: items; src/clock.js: gameDay(), gameMinutes(); src/input.js: clear() | CUR-WORLD-004, CUR-COMBAT-006, CUR-QUEST-002 | QUEST-002, QUEST-005 | 未登録 |
| `CUR-QUEST-002` | クエスト一覧 | src/quests.js: setupQuestMenus(); index.html: #open-quests/#quest-journal; style.css: #open-quests, .gear-menu; src/input.js: clear(); src/equipment.js: items; src/settings.js: enemyTypes | CUR-QUEST-001, CUR-SYS-003 | — | 未登録 |
| `CUR-SHOP-001` | 装備品屋 | src/world.js: buildings, shopDoors; src/main.js: update() の入口判定・失敗通知, state; src/render.js: building(); src/equipment.js: items, slots, attackInterval(); src/shop.js: shops, buyItem(); src/gear-ui.js: setupGearMenus(); index.html: #equipment-shop/#shop-tabs; style.css: .gear-menu | CUR-ITEM-001, CUR-WORLD-004, CUR-SYS-003 | — | 未登録 |
| `CUR-SHOP-002` | 道具屋 | src/world.js: buildings, shopDoors; src/equipment.js: items; src/shop.js: shops, goodsTabs; src/gear-ui.js: renderShop(), renderInventory(); src/render.js: building(); src/main.js: update(), state.shopGold; index.html: #equipment-shop; style.css: .gear-menu | CUR-SHOP-001, CUR-SHOP-003, CUR-ITEM-001 | ECONOMY-007 | 未登録 |
| `CUR-ITEM-003` | 道具の使用 | src/consumables.js: canUseItem(), useItem(), maxMp; src/equipment.js: items.effect; src/gear-ui.js: itemFeedback, renderInventory(); src/combat.js: updateCombat() の pendingPoison; src/main.js: createPlayer(), frame(); index.html: #item-feedback/#hud-mp/#gear-mp/#open-items; style.css: .gear-menu; src/growth.js: maxHealth() | CUR-ITEM-001, CUR-ITEM-002, CUR-SHOP-002, CUR-COMBAT-005 | COMBAT-001 | 未登録 |
| `CUR-SHOP-003` | 分類別買取 | src/shop.js: acceptsItem(), salePrice(), sellableQuantity(), sellItem(); src/main.js: state.shopGold; src/gear-ui.js: setShopMode(), renderShop() の所持数・商品詳細・価格ボタン; index.html: #shop-sell/#shop-balance; style.css: #shop-stock | CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-001 | ECONOMY-007, ECONOMY-008, ITEM-009 | 未登録 |
| `CUR-ITEM-001` | 所持品・装備 | src/main.js: createPlayer(), frame(); src/equipment.js: ringSlots, canEquipItem(), equipItem(), unequipSlot(); src/gear-ui.js: setupGearMenus(); src/combat.js: updateCombat(); index.html: #inventory/#open-inventory; style.css: .gear-menu/#open-inventory | CUR-SHOP-001, CUR-COMBAT-005, CUR-LIFE-001 | — | 未登録 |
| `CUR-ITEM-002` | 部位別の装備画面 | index.html: #inventory・[data-gear-slot]/#inventory-tabs・.equipment-layout; style.css: .equipment-menu、.equipment-slot.is-equipped と幅別グリッド; src/gear-ui.js: setupGearMenus() 内の renderInventory(), openInventory()・details(); src/equipment.js: attackInterval(), defenseRating(), armorPieceBonus; src/growth.js: maxHealth(), attackDamage(); index.html: #open-items; src/shop.js: goodsTabs, itemGroup() | CUR-ITEM-001, CUR-COMBAT-005, CUR-UI-005 | ITEM-008 | 未登録 |
| `CUR-UI-001` | HUD | index.html: header/#hud-toggle/#hud-details/h1（タイトル・表示バージョン）/#location/#progress/#hp/#health/#gold/#notice/#open-inventory/#open-items/#open-quests/footer; src/main.js: frame(), setText(), health.max, hudToggle の click; src/world.js: inTown(), town; src/settings.js: player.maxHp; style.css: header/footer/#notice/meter/@media; src/growth.js: maxHealth(), experienceToNextLevel(); src/consumables.js: maxMp | CUR-WORLD-002, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-002 | — | 未登録 |
| `CUR-UI-002` | 画面・カメラ | src/render.js: createRenderer(), render() の clientWidth/Height・DPR・setTransform・left/top・タイル走査; src/settings.js: tile/mapWidth/mapHeight; index.html: canvas; style.css: body/canvas | CUR-WORLD-001, CUR-UI-003, CUR-UI-004 | — | 未登録 |
| `CUR-UI-003` | 地形・建物描画 | src/render.js: colors, rect(), tile(), building(), render(); src/world.js: terrainAt(), buildings, innDoor; src/settings.js: tile; src/world.js: shopDoors, guildDoors | CUR-WORLD-003, CUR-WORLD-004, CUR-UI-002 | — | 未登録 |
| `CUR-UI-004` | キャラクター・戦闘描画 | src/render.js: actor(), enemySprites, render() の戦利品描画, rect(); src/settings.js: enemyTypes.maxHp（生成時に個体へ設定）; src/main.js: update() の moving/flash/strike; src/combat.js: updateCombat() の flash/strike/hp | CUR-MOVE-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-007, CUR-UI-002 | — | 未登録 |
| `CUR-UI-005` | ダイアログ・外観 | index.html: #inn/#death・form/button; style.css: :root/dialog/backdrop/button/h1/@media; src/main.js: showModal/close/cancel | CUR-INN-002, CUR-LIFE-001 | — | 未登録 |

## ファイルから仕様を探す（逆引き）

| ファイル | 関連現行仕様ID |
|---|---|
| `index.html` | CUR-SYS-001, CUR-SYS-005, CUR-SYS-004, CUR-WORLD-004, CUR-INPUT-001, CUR-INPUT-002, CUR-INN-001, CUR-INN-002, CUR-LIFE-001, CUR-QUEST-001, CUR-QUEST-002, CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-003, CUR-SHOP-003, CUR-ITEM-001, CUR-ITEM-002, CUR-UI-001, CUR-UI-002, CUR-UI-005 |
| `package.json` | CUR-SYS-001 |
| `src/clock.js` | CUR-SYS-003, CUR-SYS-005, CUR-WORLD-005, CUR-QUEST-001, CUR-INN-002, CUR-SYS-004 |
| `src/combat.js` | CUR-SYS-002, CUR-SYS-003, CUR-WORLD-002, CUR-COMBAT-001, CUR-COMBAT-002, CUR-COMBAT-003, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-GROWTH-001, CUR-LIFE-001, CUR-QUEST-001, CUR-ITEM-003, CUR-ITEM-001, CUR-UI-004, CUR-WORLD-006, CUR-SYS-004 |
| `src/consumables.js` | CUR-SYS-002, CUR-WORLD-005, CUR-LIFE-001, CUR-ITEM-003, CUR-UI-001, CUR-SYS-004 |
| `src/equipment.js` | CUR-WORLD-005, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-007, CUR-QUEST-001, CUR-QUEST-002, CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-003, CUR-ITEM-001, CUR-ITEM-002, CUR-SYS-004 |
| `src/gear-ui.js` | CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-003, CUR-SHOP-003, CUR-ITEM-001, CUR-ITEM-002 |
| `src/growth.js` | CUR-SYS-002, CUR-COMBAT-005, CUR-COMBAT-006, CUR-GROWTH-001, CUR-INN-002, CUR-LIFE-001, CUR-ITEM-003, CUR-ITEM-002, CUR-UI-001, CUR-SYS-004 |
| `src/input.js` | CUR-SYS-003, CUR-INPUT-001, CUR-INPUT-002, CUR-INPUT-003, CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001, CUR-QUEST-001, CUR-QUEST-002 |
| `src/loot.js` | CUR-SYS-003, CUR-COMBAT-006, CUR-COMBAT-007, CUR-WORLD-006 |
| `src/main.js` | CUR-SYS-001, CUR-SYS-002, CUR-SYS-003, CUR-SYS-005, CUR-SYS-004, CUR-WORLD-002, CUR-WORLD-004, CUR-WORLD-005, CUR-INPUT-002, CUR-INPUT-003, CUR-MOVE-001, CUR-COMBAT-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-GROWTH-001, CUR-INN-001, CUR-INN-002, CUR-LIFE-001, CUR-QUEST-001, CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-003, CUR-SHOP-003, CUR-ITEM-001, CUR-UI-001, CUR-UI-004, CUR-UI-005, CUR-WORLD-006 |
| `src/quests.js` | CUR-COMBAT-006, CUR-QUEST-001, CUR-QUEST-002 |
| `src/render.js` | CUR-SYS-003, CUR-WORLD-001, CUR-WORLD-003, CUR-WORLD-004, CUR-WORLD-005, CUR-MOVE-001, CUR-COMBAT-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-001, CUR-INN-002, CUR-QUEST-001, CUR-SHOP-001, CUR-SHOP-002, CUR-UI-002, CUR-UI-003, CUR-UI-004, CUR-WORLD-006 |
| `src/save-data.js` | CUR-SYS-004 |
| `src/save-menu.js` | CUR-SYS-004 |
| `src/save-store.js` | CUR-SYS-004 |
| `src/settings.js` | CUR-SYS-002, CUR-WORLD-001, CUR-WORLD-005, CUR-MOVE-001, CUR-MOVE-002, CUR-COMBAT-001, CUR-COMBAT-003, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-002, CUR-LIFE-001, CUR-QUEST-001, CUR-QUEST-002, CUR-UI-001, CUR-UI-002, CUR-UI-003, CUR-UI-004, CUR-WORLD-006, CUR-SYS-004 |
| `src/shop.js` | CUR-WORLD-005, CUR-COMBAT-007, CUR-SHOP-001, CUR-SHOP-002, CUR-SHOP-003, CUR-ITEM-002 |
| `src/trees.js` | CUR-SYS-002, CUR-SYS-003, CUR-WORLD-005, CUR-LIFE-001, CUR-SYS-004 |
| `src/world.js` | CUR-SYS-002, CUR-SYS-003, CUR-WORLD-001, CUR-WORLD-002, CUR-WORLD-003, CUR-WORLD-004, CUR-MOVE-001, CUR-MOVE-002, CUR-COMBAT-001, CUR-COMBAT-002, CUR-COMBAT-003, CUR-INN-001, CUR-LIFE-001, CUR-QUEST-001, CUR-SHOP-001, CUR-SHOP-002, CUR-UI-001, CUR-UI-003, CUR-WORLD-006, CUR-SYS-004 |
| `style.css` | CUR-SYS-001, CUR-SYS-005, CUR-INPUT-001, CUR-INPUT-002, CUR-INN-002, CUR-LIFE-001, CUR-QUEST-002, CUR-SHOP-001, CUR-SHOP-002, CUR-ITEM-003, CUR-SHOP-003, CUR-ITEM-001, CUR-ITEM-002, CUR-UI-001, CUR-UI-002, CUR-UI-005, CUR-SYS-004 |

## 更新方法

順引きのファイルと仕様IDの組から逆引きを導出する。両方向に過不足がないこと、仕様IDと参照先、ファイル・シンボル、件数、基準日・版・実装SHAおよびテストの登録状況が最新であることを完了時に確認する。名称変更・追加・削除・移動の際は両方向を更新する。廃止IDは履歴を残し再利用しない。開発タスクIDはTODOで管理する。
