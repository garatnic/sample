# 旧セーブ移行処理の調査報告書

対象作業 DEV-088（この作業内の Phase 1〜3）。後続手順は[削除実施計画](LEGACY_SAVE_REMOVAL_PLAN.md)。

## 基準と調査範囲

- 対象は `garatnic/sample` の `main`、調査基準は [de1d05766ae9dc73b158c3058b59c07c9ea3d4b9](https://github.com/garatnic/sample/commit/de1d05766ae9dc73b158c3058b59c07c9ea3d4b9)。表示は `game/index.html` の ver.51。データ形式は `save-data.js` の `kingdom-adventurer`・12。IndexedDBのDBスキーマは別の番号1、国家レイアウト識別子も別の番号1。
- [AGENTS](../../AGENTS.md)、[開発基本方針](DEVELOPMENT_POLICY.md)、[現行仕様](../specifications/current/CURRENT_SPECIFICATIONS.md)、[対応表](../architecture/IMPLEMENTATION_MAP.md)、[変更履歴](CHANGELOG.md)、TODO・開発状況・ロードマップ・未決事項、[世界の保存構想](../specifications/15_game_system.md#system-011)、[セーブ仕様](../specifications/SAVE_LOAD_SPECIFICATION.md)、[原資料 v1.8](../history/v1.8.md)、[チャンク移行の原資料](../history/2026-11-27-field-mobs.md)と[密度調整の原資料](../history/2026-11-28-field-mob-density.md)を照合した。完成後も開発途中のデータを引き継ぐ前提を置かないという今回の指示を計画に反映した。
- 基準時点の追跡150ファイルを確認。実行コード・テストでは、入出力の生成側から各フィールドの読込側、復元後に消費する処理まで追った。配置、HTML、CSS、設定、README、統合仕様、開発資料、構想履歴は役割と関連箇所を確認し、旧MOB定義・復元関数・永続化API・旧形式の比較条件や欠損許容の参照先を突き合わせた。コミットの差分と blame で版ごとの追加経緯を確認した。
- 基準ツリー内に未調査ファイルなし（末尾に対象一覧）。過去の全ツリー・リポジトリの他ゲーム・実際の利用者ブラウザと旧実データは範囲外。テストコードは読解。今回の範囲は静的監査であり、動作・回帰試験は後続作業。

## 呼び出しと出力の経路

1. `main.js:62–83,297–305` が現行のプレイヤー・国家・商店・探索・MOB・エリアを初期化。`save-menu.js:36–46,56,106–111` は手動・宿泊・エリア切替から共通の `makeSave` を使い、`save-store.js:26–45` の単一枠に保存する。
2. 起動ロード、手動ロード、JSON取り込みが `restoreSave` を共有。形式、プレイヤー、各エリア、依頼、商店、国家、採取、MOB、探索の順に検証・復元する。国家は `captureNations` / `restoreNations` を使用。取り込みは `decode → 確認 → writeSave → applySave` の順で、現行実装では取り込んだ元JSONを書き込む。旧JSONを変換してもこの時点で枠の内容は原形式のまま。
3. `main.js:85–97` の `applySave` がエリア・時計・接触状態を同期し、探索と入力を更新する。住民の建物・担当・作業予約・次回時刻、MOBの所属チャンクと地域集計は復元後の通常シミュレーションにつながる。

## 分類と数え方

コードパスや目的が分かれる単位を1件とした。行が重なる項目がある。Aは専用ブロック・定義として全削除、Bは共用関数の旧分岐のみ整理、Cは維持、Dは旧専用と断定できない箇所。**旧移行処理は A 3件・B 20件の計23件。** 保護・保留を含む台帳は **A 3、B 20、C 9、D 2の計34件**。テスト、コメント、資料の変更箇所は別集計。

### 参照キー

- S = `game/src/save-data.js`、N = `game/src/nation-save.js`、W = `game/src/world.js`。行は基準コミット時点。表の全項目は CUR-SYS-004 に関連し、追加IDを併記。
- 「現行側」は形式12。「移行テストなし」は専用の保存済みケースを確認できなかったもの。検証欄の実施は後続作業。
- 完全SHAは下の出典表。該当する導入・改訂を示し、当時の導入処理がそのまま残っているとは限らない。

## A　完全削除可能

| 調査ID | 処理・箇所 | 旧形式・根拠・出典 | 削除時の依存・影響・検証 |
|---|---|---|---|
| LS-A01 | W:16–31 `legacyFieldSpawns` と専用コメント | 1〜9の固定枠のID・座標・種別。CHUNK。現行の `field.spawns` は空、洞窟は独立。ゲームの全参照はS、ほかは旧フィクスチャ3ファイル。CUR-WORLD-007、CUR-COMBAT-001 | LS-B05と3テストのimport・フィクスチャを先に外す。洞窟の `cave.spawns` と地形・国家配置は残す。SKILL-04、NATION-05、MOB-04。野外初期発生・洞窟固定枠を検証。 |
| LS-A02 | S:142–152 `restoreMobs` の固定枠から個体への変換 | 1〜9。CHUNK。固定枠の生存敵・動物を `field-連番`、徘徊初期値と境界クランプ付きで移し、従来の復活待ちを捨てる。現行個体読込は153行以降。CUR-WORLD-007、CUR-COMBAT-005/006 | 旧 `fieldState` 引数と呼出元S:239からの受け渡しも整理。MOB-04旧ケースを外し、MOB-03/06で現行個体、狩猟、方向、HP、時刻、次IDを検証。 |
| LS-A03 | N:183–198 `legacyHousing` の住民集約と担当ID書換 | 国家が保存される形式3〜11。HOUSE。建築担当を優先、次いでID順で1人を残し、第1枠IDに付け替える。形式12の現住民はそのまま。CUR-NATION-001/002/003 | LS-B19/B20とまとめて削除。NATION-08の旧定員フィクスチャは現行の有効・不正ケースへ置換。在庫、稼働中工事、建物と担当ID、空き家、予約を検証。 |

## B　部分削除可能

| 調査ID | 処理・箇所 | 旧形式と経緯・出典 | 残す依存・影響・検証 |
|---|---|---|---|
| LS-B01 | S:200–206 `restoreSave` の1〜11許可リストと下位の版引数 | 1〜11。BASE以降段階追加、最後はHOUSE。現行と同一の入口。 | 現行版の一致判定・clock等の検証を残す。起動、手動、JSONで12を受理し1〜11と未知版は失敗、枠は維持。 |
| LS-B02 | S:77–99 `restorePlayer` の技能初期化 | 1、SKILL。形式1にない技能を `createSkills()` で補完。CUR-GROWTH-002 | S内の旧用呼出・importを外し `restoreSkills` を保持。 `main.js` の新規技能は必要。SKILL-04、技能値/XP往復・不正値拒否。 |
| LS-B03 | S:78–82,102–106 旧必要XPと進捗の比例換算 | 1、SKILL。旧30＋レベル補正の進捗割合を新曲線に換算。CUR-GROWTH-001 | `experienceToNextLevel`、現行HP/MP/XP検証は残す。SKILL-04、現行XPとレベルがそのまま復元されることを確認。 |
| LS-B04 | S:84–94 移設施設から戸口への座標補正 | 1〜3、TOWN。 `facilityAt(data)` で施設内の位置を補正。CUR-WORLD-002/004、CUR-MOVE-002 | Sの旧用importだけ外す。W:54–64 `facilityAt` は現行の移動衝突でも使用。NATION-05、正常位置と範囲外・施設内の不正位置を検証。 |
| LS-B05 | S:110–119 `restoreArea` の旧固定枠選択・動物枠挿入 | 1〜9のフィールド固定枠と1〜7の動物枠なし読込（HUNT、CHUNK）。CUR-WORLD-006/007 | `area.spawns`、洞窟の順序・ID・タイマー・世代を保持。旧定義・変換はLS-A01/02。SKILL-04、NATION-05、MOB-04。 |
| LS-B06 | S:111,121–127 逃走値の検証スキップと0補完 | 1〜7、HUNT。動物追加前の形式。CUR-COMBAT-005 | 現行の `flee` 範囲検証と `makeSave` の現用シリアライズを維持。MOB-04と洞窟現行復元、野外動物の逃走往復。 |
| LS-B07 | S:124–128 `hunted` 欠損許容・負傷動物の狩猟推定 | 1〜8、MARK。負傷した動物を狩猟開始済みとして補完。CUR-COMBAT-005 | 真偽値検証は残す。Sの `animalTypes` が未使用になる。MOB-04は形式9の明示値を使用し、形式8推定の専用テストなし。MOB-06と現行狩猟フラグの往復を検証。 |
| LS-B08 | S:231 国家データがない場合の初期化 | 1〜2、NATION。旧時刻で国家を生成。CUR-NATION-001 | `restoreNations` と新規開始・Nの復元骨格に使う `createNationSimulation` を保持。Sの `makeSave` もこの関数を参照。SKILL-04、保存済み国家を初期化しないことを確認。 |
| LS-B09 | S:209–214 未記録の新店舗を100Gに補完 | 1〜3、TOWN。楡2店舗は保存値を要求、追加店舗のみ補う。CUR-SHOP-001/002/004 | 各店の残高検証と新規開始時の `startingShopGold` は保持。Sの旧用importを外す。NATION-05/07。負残高の扱いはLS-D01。 |
| LS-B10 | S:232–238 プレイヤー専用果樹の進捗廃棄 | 1〜4、SHARED。旧 `resources` は現在読まれず、形式によって `harvest` を空にする。CUR-WORLD-005 | 版条件だけ外し、`null` と現行の共有資源ID・進捗検証を保持。専用旧テストなし。NATION-06と現行採取途中・洞窟側拒否を検証。 |
| LS-B11 | S:215–230 商店在庫の初期補完 | 1〜9、及びstock追加前の形式10。STOCK。現行の在庫検証を同じブロックで実施。CUR-SHOP-004 | 形式12のライターは常に `shopStock` を出す。従来の欠損受理の厳格化はLS-D01。現行Map再構築・販売可否・重複検証・新規在庫は保持。NATION-07。 |
| LS-B12 | S:241–244 探索索引の世代分岐 | 1〜9と地図追加前の形式10、MAP。旧→空集合。CUR-UI-006 | 範囲検証、Set化、`applySave` の現在地開示を保持。欠損の扱いはLS-D01。専用旧テストなし。現行の空・非空・範囲外を検証。 |
| LS-B13 | N:43,52–55,86–92 共有資源の残量復元 | 国家ありの3〜5。REMAIN。 `readyAt` から満量／0へ変換、欠損を許容。CUR-WORLD-005、CUR-NATION-002 | 現行配列の長さ、各残量・再生時刻整合性を残す。NATION-05が旧条件を通過するが旧残量の精密な回帰例はなし。NATION-06で採取中／枯渇／回復を検証。 |
| LS-B14 | N:44,109,133–158,181 旧住民タスクの時刻換算・運搬制限・イベント検証省略 | 国家ありの3〜6、PICK。一括採取の終了時刻を1個目の時刻に付け替え、旧採取中は運搬なしを期待。CUR-NATION-002 | `taskSchedule` と `nextPick`、現行分数時刻、採取途中運搬・作業待ち・ターゲットの検証を残す。 `task` 再代入がなくなる。NATION-04/06、ECON-01/02。 |
| LS-B15 | N:71–74 旧住民数の完全一致要件 | 国家ありの3〜9、CHUNK。戦死導入前の家数×人数と一致することを要求。CUR-COMBAT-002、CUR-NATION-001 | 現行の居住上限を残し、戦死後の空き家／住民ゼロを許容。NATION-05、MOB-03。LS-B20の旧2人上限と同時整理。 |
| LS-B16 | N:161–171 旧形式の住民戦闘値を読まない分岐 | 国家ありの3〜9、CHUNK。戦闘導入前の形式にHP・待ちなし。CUR-COMBAT-002/004 | 形式12でも未戦闘住民はHP未設定で保存される。版条件だけ外し、値が存在する場合の検証と正常な省略を維持。MOB-03。 |
| LS-B17 | N:45,78–85 国庫・日次精算の初期値 | 国家ありの3〜10、ECON。復元骨格が初期国庫10,000G、当日と空の精算情報を与える。CUR-NATION-005、CUR-SHOP-004 | 形式12の国庫0G、financeのnullと実績、lastDayの検証を全件に適用。新規ゲームの初期国庫は保持。ECON-03/04、NATION-07。 |
| LS-B18 | N:110,114,199 旧住民の役割補完 | 国家ありの3〜10、ECON。全員をgeneralとしてから `assignRoles` が割り当てる。CUR-NATION-002 | 年代分岐だけ外す。現行の役割検証・割当の共用依存はLS-C04。ECON-01/04と専属死亡・交代、役割往復を確認。 |
| LS-B19 | N:175–181,202–203 待機者の旧セーブ補正 | WAKEで旧待機者を起こす処理を追加し、HOUSEで形式3〜11を `legacyHousing` 経由で再判定。CUR-NATION-002 | `legacyHousing` 側を外す一方、正当な `nextMinute===minute` と待機住民がいる現行の即時再判定、時刻チェックは保持。ECON-04、MOB-03、NATION-04。 |
| LS-B20 | N:40–44,73–74,102–105 旧住宅上限と第2枠ID | 国家ありの3〜11、HOUSE。2人上限で旧IDをいったん受け付ける。CUR-NATION-001/003 | 旧上限だけ外す。現行 `config.house.residents`、家ID、名前と一意性を保持。NATION-08の現行側の第2枠拒否を残す。 |

## C　維持必須

| 調査ID | 対象・箇所 | 根拠・関連テストと検証 |
|---|---|---|
| LS-C01 | S:17–75,175–198,200–245の共通エンコード・検証と `main.js:62–97,297–305` | ライター、形式番号、位置・所持品・技能・依頼・探索の値検証、Map/Set化、適用処理は12で使用。BASE/SKILL/MAP。SKILL-04、NATION-05/07。手動・起動・現行JSONを確認。 |
| LS-C02 | S:110–139,153–172、`mob-world.js` の `createMobWorld` / `indexSettlement` | 現行の洞窟枠と野外個体の妥当性、タイマー・個体ID・派生チャンク索引、装備ドロップと一般ドロップの差を保つ。CHUNK/LOOT。CUR-COMBAT-006/007、CUR-WORLD-006/007。MOB-03/04/05/06。 |
| LS-C03 | N:19–38,45–77,86–107,117–160,172–181,200–205 | 国家レイアウト、建物・資源ID、工事担当、位置、運搬経路、次イベント、`refreshNationDemand` と容量整合。国家モデルを新規作成するのはデコードの骨格準備でもある。NATION/ECON/HOUSE。CUR-NATION-001〜005。NATION-02/04/06、ECON-02/06/07。 |
| LS-C04 | N:199と `nation-simulation.js:25–41,156–173,319–327` の `assignRoles` | 現行の復元に呼ばれ、新規開始・建築完了・戦死時にも呼ばれる。旧移行と同時に導入されたが割当・交代は現行機能。ECON。CUR-NATION-002。ECON-01/04、MOB-03。 |
| LS-C05 | N:32–33,111–116,142–143,161–172、`nation-simulation.js:14–22,110–143,238–275` | 未徘徊の期限、未採取の採集枠・資源世代は正当な `null`。未戦闘住民のHP/攻撃待ちは省略できる。JSONはundefinedを省く。現行の保存側null正規化・任意戦闘状態を保持。ECON/CHUNK。CUR-NATION-002、CUR-COMBAT-002。NATION-04、MOB-03。 |
| LS-C06 | N:175–181,202–203、`nation-simulation.js:25–41,285–327` | 初期保存や予定の即時再判定を守る。旧限定の起床補正を外す際に現行の `pendingDecision` を巻き込まない。WAKE/HOUSE。CUR-NATION-002。ECON-04、NATION-04、MOB-03と混在する待機・作業の現行フィクスチャ。 |
| LS-C07 | `game/src/save-store.js` 全体、`save-menu.js:36–112`、`main.js` の宿泊と切替の `autoSave` | IndexedDB version 1/upgrade/abort、確認つき削除、JSON出力・検証後の取込は現行機能。BASE。CUR-INN-002。保存／取込失敗・キャンセル時の既存枠、現行の手動と自動保存をブラウザで検証。 |
| LS-C08 | `world.js:49–65`、`skills.js`、`growth.js`、`shop.js` の現行初期値と支援関数 | `facilityAt`、`createSkills`、現行XP曲線、`startingShopGold`、`createShopStock` はゲーム動作に使用。TOWN/SKILL/STOCK。CUR-MOVE-002、CUR-GROWTH-001/002、CUR-SHOP-001/002/004。NATION-05/07、SKILL-01〜04。 |
| LS-C09 | S:110–138 の洞窟 `enemy` なしと任意装備、N:78–85 の `finance=null`、S:232〜238の `harvest=null` | 現行ライターが出す空の状態。装備がない素材ドロップも正常。BASE/ECON/LOOT。CUR-WORLD-006、CUR-COMBAT-006/007、CUR-NATION-005。MOB-04/05、ECON-04、静止中と採取中の保存。 |

## D　判断保留・付随リスク

| 調査ID | 対象・箇所 | 現時点の判断と後続確認 |
|---|---|---|
| LS-D01 | 同じ形式番号の緩い受理。S:212,215–230,241、N:111–113,142–143 | STOCK/MAP/ECON。 `shopStock` と `exploredChunks` は旧形式10内の互換として導入されたが、欠損補完は版12にも到達する。現在の出力には両方ある。 `wanderUntil/gatherLimit/gatherGeneration` の明示nullと欠損は区別する。旧仕事に由来するnull採集予約が移行後に形式12へ再保存された例の取り扱いを決めるまで、実行側の採集予備経路や `assignRoles` を削除しない。店舗の負残高はECON以前の経済に由来するが、S:212の符号付き安全整数チェックと現行の日次回復は形式12にも到達する。経済側を今回の削除単位に含めない。NATION-04/07、ECON-04/07と実シリアライズを用いて、欠落／明示null／数値0／負値を別々に検証する。 |
| LS-D02 | 同一形式12の旧高密度MOBデータ。S:153–159／`mob-settings.js:9–10` | HOUSEとDENSITY。両ゲーム版とも形式12だが、個体配列の検証上限は ver.50 の1536から ver.51で512に下がった（256×(ceil(0.36)+ceil(0.84))）。旧通常開始は1,503〜1,504体で拒否。512体以下で他の検証も通る旧データは保存数で復元される。版番号だけでどちらで生成されたかは判定不能。MOB-06は現行密度の往復であり旧高密度は対象外。上限の緩和や削除で救済すると意図しない旧密度も復元されるため、この監査で変更しない。Phase 4前に計画の同一形式境界を確認する。 |

### 同一形式12についての訂正

ver.51の告知と現行仕様の「旧セーブを読み込むと保存数が復元される」は**読込検証に通る場合**に限られる。高密度の通常の旧保存は上の上限で起動時に読み込めず、手動ロード／取り込みも同じデコーダーで失敗する。起動時の失敗は通知後に新規状態でゲームを開始するが、失敗処理自体で既存枠は消えない。以後の通常の宿泊・エリア移動・手動保存は同じ枠に書ける。現行仕様書・対応表を整合させる作業は依頼のPhase 6に含める。

### 導入・改訂のコミット

| キー | 完全SHA | 内容 |
|---|---|---|
| BASE | `aeba7fca18c61d791665565467037f17f5cd317e` | 初期セーブ枠と形式1 |
| SKILL | `da3d85ac9c98fb98dfaee1191af71cd0ca01b092` | 技能とXP換算、形式2 |
| NATION | `07327469ed6b40689e348c604f38752b99362da4` | 国と世界拡張、形式3 |
| TOWN | `34aa05bb376d858b09ab756bc1426125bd04eee6` | 施設移設、形式4 |
| SHARED | `bfff84c6835aa9ac5cd4df532325c7798ddbc9fd` | 共有資源、形式5 |
| REMAIN | `4bf43ef131bf37dda3fcbefca24643fc740c3faa` | 共有資源残量、形式6 |
| PICK | `e7f651e0687053560f412bb66bcead85ae55cfaa` | 住民1個採取・時刻、形式7 |
| HUNT | `c4e6d799463c5259644caed98358cf9a45a18f3a` | 動物と逃走、形式8 |
| MARK | `1f3570001db141629b087271ec0aab98ff0928fb` | 狩猟状態、形式9 |
| CHUNK | `c2e06e3b81e3459555f56efbef2dbdb64b8817e3` | 野外MOB・住民戦闘、形式10 |
| MAP | `37ed4fb6685a0eabe0977371b21f6887cb67cc65` | 形式10の探索項目 |
| STOCK | `c3ab0776cdac540dd9a90262ad603216482e75a7` | 形式10の商店在庫 |
| ECON | `90444a0ce5401726f17af780bb2937c47878eb23` | 国庫・住民役割・採集予約、形式11 |
| WAKE | `a26360910883697865be9fa8d73cac43d3dd0915` | 旧待機住民の行動再開 |
| LOOT | `11052d23320e57df6f3fdb7134c878b5fab222f3` | 盗賊の装備ドロップ、形式11の任意戦利品 |
| HOUSE | `4050fadb347559b59aaef2c4a05e3eeab61c18a7` | 民家1人、形式12 |
| DENSITY | `758dd354599091d8c81947d3132d9eaa9845c476` | 密度低下と検証上限への影響、形式12を継続 |

## 調査済みファイル一覧

基準時点の `git ls-files`。新設した今回の資料は件数に含めない。

<details>
<summary>150ファイル（ルート2、builds 1、docs 107、game 34、tests 5、tools 1）</summary>

```text
AGENTS.md
README.md
builds/README.md
docs/README.md
docs/architecture/IMPLEMENTATION_MAP.md
docs/architecture/README.md
docs/development/CHANGELOG.md
docs/development/DEVELOPMENT_POLICY.md
docs/development/DEVELOPMENT_STATUS.md
docs/development/OPEN_QUESTIONS.md
docs/development/README.md
docs/development/ROADMAP.md
docs/development/TODO.md
docs/history/2026-11-26-weapon-speed.md
docs/history/2026-11-27-field-mobs.md
docs/history/2026-11-28-field-mob-density.md
docs/history/README.md
docs/history/option-index.md
docs/history/v0.1.md
docs/history/v0.2.md
docs/history/v0.3.md
docs/history/v0.4.md
docs/history/v0.5.md
docs/history/v0.6.md
docs/history/v0.7.md
docs/history/v0.8.md
docs/history/v0.9.md
docs/history/v1.0.md
docs/history/v1.1.md
docs/history/v1.2.md
docs/history/v1.3.md
docs/history/v1.4.md
docs/history/v1.5.md
docs/history/v1.6.md
docs/history/v1.7.md
docs/history/v1.8.md
docs/history/v1.9.md
docs/history/v2.0.md
docs/history/v2.1.md
docs/history/v2.2.md
docs/history/v2.3.md
docs/history/v2.4.md
docs/history/v2.5.md
docs/history/v2.6.md
docs/history/v2.7.md
docs/history/v2.8.md
docs/history/v2.9.md
docs/history/v3.0.md
docs/history/v3.1.md
docs/history/v3.2.md
docs/history/v3.3.md
docs/history/v3.4.md
docs/history/v3.5.md
docs/history/v3.6.md
docs/history/v3.7.md
docs/history/v3.8.md
docs/history/v3.9.md
docs/history/v4.0.md
docs/history/v4.1.md
docs/history/v4.2.md
docs/history/v4.3.md
docs/history/v4.4.md
docs/history/v4.5.md
docs/history/v4.6.md
docs/history/v4.7.md
docs/history/v4.8.md
docs/history/v4.9.md
docs/history/v5.0.md
docs/history/v5.1.md
docs/history/v5.2.md
docs/history/v5.3.md
docs/history/v5.4.md
docs/history/v5.5.md
docs/history/v5.6.md
docs/history/v5.7.md
docs/history/v5.8.md
docs/history/v5.9.md
docs/history/v6.0.md
docs/history/v6.1.md
docs/history/v6.2.md
docs/history/v6.3.md
docs/history/v6.4.md
docs/history/v6.5.md
docs/history/v6.6.md
docs/history/v6.7.md
docs/history/v6.8.md
docs/history/v6.9.md
docs/history/v7.0.md
docs/history/v7.1.md
docs/history/v7.2.md
docs/specifications/01_game_overview.md
docs/specifications/02_world.md
docs/specifications/03_exploration.md
docs/specifications/04_combat.md
docs/specifications/05_character_growth.md
docs/specifications/06_items_equipment.md
docs/specifications/07_npc_ai.md
docs/specifications/08_companions_guilds.md
docs/specifications/09_ecosystem.md
docs/specifications/10_economy.md
docs/specifications/11_building_housing.md
docs/specifications/12_nations_warfare.md
docs/specifications/13_population_society.md
docs/specifications/14_quests_history.md
docs/specifications/15_game_system.md
docs/specifications/README.md
docs/specifications/SAVE_LOAD_SPECIFICATION.md
docs/specifications/coverage-index.md
docs/specifications/current/CURRENT_SPECIFICATIONS.md
docs/specifications/current/README.md
game/README.md
game/index.html
game/package.json
game/src/clock.js
game/src/combat.js
game/src/consumables.js
game/src/equipment.js
game/src/gear-ui.js
game/src/growth.js
game/src/input.js
game/src/loot.js
game/src/main.js
game/src/mob-settings.js
game/src/mob-world.js
game/src/nation-economy.js
game/src/nation-layout.js
game/src/nation-menu.js
game/src/nation-save.js
game/src/nation-settings.js
game/src/nation-simulation.js
game/src/quests.js
game/src/render.js
game/src/save-data.js
game/src/save-menu.js
game/src/save-store.js
game/src/settings.js
game/src/shop.js
game/src/skill-menu.js
game/src/skills.js
game/src/trees.js
game/src/weapon-skill.js
game/src/world-map.js
game/src/world.js
game/style.css
tests/README.md
tests/economy.test.mjs
tests/mobs.test.mjs
tests/nations.test.mjs
tests/skills.test.mjs
tools/README.md
```

</details>

## DEV-089 実施結果

実装基準は ver.52・形式13、コミット `8831d1c24f09de42f94634b67b6dc374a84b224a`。上記本文は形式12時点の監査記録。

- LS-A01〜03を削除。LS-B01〜20の旧形式分岐と不要になった引数・参照を削除。LS-C01〜09の現行の責務を維持。
- LS-D01は現行出力から、在庫・探索・住民の役割・徘徊／採集の項目を必須化。採集中の予約値は仕事割当時に常に設定されるため、旧予約なし用の計算を撤去。資金を減らす経路はいずれも残高内で支払うため、旧負残高の受理と補助クランプを撤去。未徘徊・未採取の明示null、未戦闘住民の任意HP等、0G、装備なし戦利品を保持。
- LS-D02は形式13への繰り上げで解消。形式12の個体数にかかわらず共通判定で拒否。形式13のMOB個体配列の現行検証とDBスキーマ1は維持。詳細は計画の実施結果を参照。
