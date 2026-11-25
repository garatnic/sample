# 仕様・実装対応表 — Kingdom Adventurer

基準: DEV-032反映時点。
正本: [現行仕様書](../specifications/current/CURRENT_SPECIFICATIONS.md)。全29仕様を対象とする。パスは `Kingdom_Adventurer/game/` 相対。関数名に加え、匿名イベント・データ・DOM・CSSセレクタも記載する。行番号は固定しない。関連仕様は直接の調査候補であり、変更時には呼出元・依存先も確認する。現行仕様は暫定実装。自動テストコードは未保存のため全行の関連テストは未登録（過去の検証記録は [TODO](../development/TODO.md)・[開発状況](../development/DEVELOPMENT_STATUS.md) 参照）。今回の静的照合は実機検証ではない。

## 仕様から実装を探す

| 現行仕様ID | 機能 | 実装ファイル・関数・役割 | 関連現行仕様ID | 関連テスト |
|---|---|---|---|---|
| `CUR-SYS-001` | 起動 | index.html: module script・版付きstylesheet参照・DOM; package.json: type/private; src/main.js: モジュール初期化; style.css: 基本表示 | CUR-SYS-002, CUR-UI-001 | 未登録 |
| `CUR-SYS-002` | 初期状態 | src/main.js: createPlayer(), state; src/growth.js: maxHealth(); src/world.js: start; src/settings.js: player.maxHp / currency.startingGold; src/combat.js: createEncounters() | CUR-WORLD-002, CUR-COMBAT-001, CUR-LIFE-001 | 未登録 |
| `CUR-SYS-003` | フレーム処理 | src/main.js: frame(), update(), collectGold(), previous, requestAnimationFrame; src/input.js: read(); src/world.js: movePlayer(); src/combat.js: updateCombat(); src/render.js: render() | CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001, CUR-UI-001 | 未登録 |
| `CUR-SYS-004` | 保存なし | src/main.js: state, createPlayer()（メモリ初期化）; index.html: 起動時モジュール読み込み | CUR-SYS-002, CUR-LIFE-001 | 未登録 |
| `CUR-WORLD-001` | 固定マップ | src/settings.js: tile/mapWidth/mapHeight; src/world.js: 固定配置・terrainAt(); src/render.js: render() のタイル範囲 | CUR-WORLD-003, CUR-MOVE-002, CUR-UI-002 | 未登録 |
| `CUR-WORLD-002` | 街 | src/world.js: town, start, inTown(); src/main.js: createPlayer(), frame() の所在地; src/combat.js: updateCombat() の安全判定 | CUR-COMBAT-002, CUR-UI-001, CUR-LIFE-001 | 未登録 |
| `CUR-WORLD-003` | 地形 | src/world.js: terrainAt(), inTown(); src/render.js: tile(), colors; src/world.js: movePlayer(), walkable()（地形を衝突に使わない） | CUR-WORLD-001, CUR-MOVE-002, CUR-UI-003 | 未登録 |
| `CUR-WORLD-004` | 建物 | src/world.js: buildings, inn, innDoor, walkable(); src/render.js: building(); src/main.js: update() の宿判定 | CUR-MOVE-002, CUR-INN-001, CUR-UI-003 | 未登録 |
| `CUR-INPUT-001` | キーボード | src/input.js: directions, createInput(), keys, keydown/keyup/blur, clear(), read(); index.html: footer; style.css: footer/kbd | CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001 | 未登録 |
| `CUR-INPUT-002` | 仮想スティック | src/input.js: createInput(), move(), clear(), pointerイベント, read(); index.html: #stick/#knob; style.css: #stick（下中央）/#knob, @media(pointer:coarse); src/main.js: createInput() 呼出 | CUR-MOVE-001, CUR-UI-005, CUR-INPUT-001 | 未登録 |
| `CUR-INPUT-003` | ゲームパッド | src/input.js: createInput().read() の navigator.getGamepads・axes・閾値; src/main.js: update() の入力取得 | CUR-MOVE-001, CUR-INPUT-001, CUR-INPUT-002 | 未登録 |
| `CUR-MOVE-001` | 移動速度 | src/settings.js: player.speed/radius; src/world.js: movePlayer(); src/input.js: read(); src/main.js: update() の moving; src/render.js: actor() | CUR-MOVE-002, CUR-INPUT-001, CUR-INPUT-002, CUR-INPUT-003, CUR-UI-004 | 未登録 |
| `CUR-MOVE-002` | 境界・衝突 | src/world.js: movePlayer(), walkable(), buildings; src/settings.js: mapWidth/mapHeight/player.radius | CUR-WORLD-001, CUR-WORLD-004, CUR-MOVE-001 | 未登録 |
| `CUR-COMBAT-001` | 敵出現枠 | src/world.js: spawns; src/combat.js: createEncounters(), updateCombat() の生成処理; src/settings.js: enemy.maxHp / gold; src/main.js: state.encounters; src/render.js: render() の敵描画 | CUR-COMBAT-003, CUR-COMBAT-006, CUR-SYS-002 | 未登録 |
| `CUR-COMBAT-002` | 安全地帯 | src/world.js: inTown(), town; src/combat.js: updateCombat() の safe・chasing・移動候補・自動攻撃制限 | CUR-WORLD-002, CUR-COMBAT-003, CUR-COMBAT-005 | 未登録 |
| `CUR-COMBAT-003` | 敵追跡・帰還 | src/combat.js: updateCombat() の chasing/goal/step/next; src/settings.js: enemy.speed/reach/aggro/leash; src/world.js: inTown(), spawns | CUR-COMBAT-002, CUR-COMBAT-004 | 未登録 |
| `CUR-COMBAT-004` | 敵攻撃 | src/combat.js: updateCombat() の敵cooldown/flash・HP減算・早期return; src/settings.js: enemy.damage/attackDelay/reach; src/main.js: update() の player.flash・死亡判定; src/render.js: actor() | CUR-COMBAT-003, CUR-LIFE-001, CUR-UI-004 | 未登録 |
| `CUR-COMBAT-005` | プレイヤー自動攻撃 | src/combat.js: updateCombat() の player.cooldown・nearest/range・HP減算・strike; src/settings.js: player.range/damage/attackDelay; src/growth.js: attackDamage(); src/main.js: update() の戦闘呼出・strike期限; src/render.js: render() の攻撃線・actor() | CUR-COMBAT-002, CUR-COMBAT-006, CUR-UI-004 | 未登録 |
| `CUR-COMBAT-006` | 撃破・再出現 | src/combat.js: updateCombat() の enemy=null/remaining/generation/notice・硬貨配置・経験値付与; src/growth.js: gainExperience(); src/settings.js: enemy.spawnDelay/maxHp; src/main.js: update() の通知期限、frame() の通知表示; src/render.js: render() の生存敵描画 | CUR-COMBAT-001, CUR-COMBAT-005, CUR-COMBAT-007, CUR-UI-001 | 未登録 |
| `CUR-COMBAT-007` | 貨幣ドロップ・拾得 | src/combat.js: updateCombat() の敵所持金・goldDrops; src/main.js: state, collectGold(), update(); src/settings.js: enemy.gold / currency.pickupRadius; src/render.js: render() の硬貨描画 | CUR-COMBAT-001, CUR-COMBAT-006, CUR-SYS-003, CUR-UI-001, CUR-UI-004 | 未登録 |
| `CUR-GROWTH-001` | 討伐経験値・レベル | src/growth.js: growth, experienceToNextLevel(), gainExperience(), maxHealth(), attackDamage(); src/combat.js: 撃破時の付与と通知; src/main.js: createPlayer(), collectGold(), frame() | CUR-COMBAT-005, CUR-COMBAT-006, CUR-INN-002, CUR-LIFE-001, CUR-UI-001 | 未登録 |
| `CUR-INN-001` | 宿接触 | src/world.js: innDoor, buildings; src/main.js: update() の touchingInn/innContact/料金・残高案内/returnValue/showModal; src/input.js: clear(); index.html: #inn; src/render.js: building() の入口マーカー | CUR-WORLD-004, CUR-MOVE-001, CUR-INN-002 | 未登録 |
| `CUR-INN-002` | 宿泊 | src/main.js: inn closeイベント（残高確認・支払い）, frame() の停止条件; src/settings.js: inn.price; src/growth.js: maxHealth(); index.html: #inn/#inn-offer/#inn-confirm/NO; style.css: dialog/button/backdrop; src/render.js: render() の継続描画 | CUR-INN-001, CUR-SYS-003, CUR-UI-001, CUR-UI-005 | 未登録 |
| `CUR-LIFE-001` | 死亡・再開 | src/combat.js: updateCombat() のHP0; src/main.js: update(), createPlayer(), death cancel/closeイベント（所持金・硬貨・成長維持）, frame(); src/input.js: clear(); src/world.js: start; src/settings.js: player.maxHp; index.html: #death; style.css: dialog/button | CUR-SYS-002, CUR-COMBAT-004, CUR-INN-001, CUR-UI-005 | 未登録 |
| `CUR-UI-001` | HUD | index.html: header/h1（タイトル・表示バージョン）/#location/#progress/#hp/#health/#gold/#notice/footer; src/main.js: frame(), setText(), health.max; src/world.js: inTown(), town; src/settings.js: player.maxHp; style.css: header/footer/#notice（coarse時にスティック上）/meter/@media | CUR-WORLD-002, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-002 | 未登録 |
| `CUR-UI-002` | 画面・カメラ | src/render.js: createRenderer(), render() の clientWidth/Height・DPR・setTransform・left/top・タイル走査; src/settings.js: tile/mapWidth/mapHeight; index.html: canvas; style.css: body/canvas | CUR-WORLD-001, CUR-UI-003, CUR-UI-004 | 未登録 |
| `CUR-UI-003` | 地形・建物描画 | src/render.js: colors, rect(), tile(), building(), render(); src/world.js: terrainAt(), buildings, innDoor; src/settings.js: tile | CUR-WORLD-003, CUR-WORLD-004, CUR-UI-002 | 未登録 |
| `CUR-UI-004` | キャラクター・戦闘描画 | src/render.js: actor(), render() の硬貨描画, rect(); src/settings.js: enemy.maxHp; src/main.js: update() の moving/flash/strike; src/combat.js: updateCombat() の flash/strike/hp | CUR-MOVE-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-007, CUR-UI-002 | 未登録 |
| `CUR-UI-005` | ダイアログ・外観 | index.html: #inn/#death/#stick/#knob・form/button; style.css: :root/dialog/backdrop/button/h1/#stick/#knob/@media; src/main.js: showModal/close/cancel; src/input.js: move()/clear() のノブ変位 | CUR-INN-002, CUR-LIFE-001, CUR-INPUT-002 | 未登録 |

## ファイルから仕様を探す（逆引き）

| ファイル | 関連現行仕様ID |
|---|---|
| `index.html` | CUR-SYS-001, CUR-SYS-004, CUR-INPUT-001, CUR-INPUT-002, CUR-INN-001, CUR-INN-002, CUR-LIFE-001, CUR-UI-001, CUR-UI-002, CUR-UI-005 |
| `style.css` | CUR-SYS-001, CUR-INPUT-001, CUR-INPUT-002, CUR-INN-002, CUR-LIFE-001, CUR-UI-001, CUR-UI-002, CUR-UI-005 |
| `package.json` | CUR-SYS-001 |
| `src/settings.js` | CUR-SYS-002, CUR-WORLD-001, CUR-MOVE-001, CUR-MOVE-002, CUR-COMBAT-001, CUR-COMBAT-003, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-002, CUR-LIFE-001, CUR-UI-001, CUR-UI-002, CUR-UI-003, CUR-UI-004 |
| `src/world.js` | CUR-SYS-002, CUR-SYS-003, CUR-WORLD-001, CUR-WORLD-002, CUR-WORLD-003, CUR-WORLD-004, CUR-MOVE-001, CUR-MOVE-002, CUR-COMBAT-001, CUR-COMBAT-002, CUR-COMBAT-003, CUR-INN-001, CUR-LIFE-001, CUR-UI-001, CUR-UI-003 |
| `src/growth.js` | CUR-SYS-002, CUR-COMBAT-005, CUR-COMBAT-006, CUR-GROWTH-001, CUR-INN-002, CUR-LIFE-001, CUR-UI-001 |
| `src/input.js` | CUR-SYS-003, CUR-INPUT-001, CUR-INPUT-002, CUR-INPUT-003, CUR-MOVE-001, CUR-INN-001, CUR-LIFE-001, CUR-UI-005 |
| `src/combat.js` | CUR-SYS-002, CUR-SYS-003, CUR-WORLD-002, CUR-COMBAT-001, CUR-COMBAT-002, CUR-COMBAT-003, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-GROWTH-001, CUR-COMBAT-007, CUR-LIFE-001, CUR-UI-004 |
| `src/main.js` | CUR-SYS-001, CUR-SYS-002, CUR-SYS-003, CUR-SYS-004, CUR-WORLD-002, CUR-WORLD-004, CUR-INPUT-002, CUR-INPUT-003, CUR-MOVE-001, CUR-COMBAT-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-GROWTH-001, CUR-COMBAT-007, CUR-INN-001, CUR-INN-002, CUR-LIFE-001, CUR-UI-001, CUR-UI-004, CUR-UI-005 |
| `src/render.js` | CUR-SYS-003, CUR-WORLD-001, CUR-WORLD-003, CUR-WORLD-004, CUR-MOVE-001, CUR-COMBAT-001, CUR-COMBAT-004, CUR-COMBAT-005, CUR-COMBAT-006, CUR-COMBAT-007, CUR-INN-001, CUR-INN-002, CUR-UI-002, CUR-UI-003, CUR-UI-004 |

## 更新方法

- 新規実装・仕様変更・不具合修正・ファイル移動・関数名変更時に該当行と逆引きを確認し、必要に応じて更新する。
- 現行仕様IDを維持する。新規仕様は現行仕様書に登録後、対応行を追加する。廃止は履歴を残しIDを再利用しない。
- 実装箇所は主要な処理だけでなく、設定・入力・描画・呼出元など変更影響のある箇所を含める。存在しない関数やテストを記載しない。
- テストが保存されたら実在するテストID・パスを追記する。変更履歴は別資料で管理する。
- 逆引きは上表から導出する補助索引であり、矛盾時はコードを確認して両方を修正する。
