# 全ソースコード棚卸し（DEV-099）

- 対象ブランチ `main`、基準コミット [`d0399ac3d8a87e2e1f7beca751a042ab39c6b2ac`](https://github.com/garatnic/sample/commit/d0399ac3d8a87e2e1f7beca751a042ab39c6b2ac)、ver.57、セーブ形式15、IndexedDBスキーマ1。
- 追跡ファイル159件のうち現行の調査対象45件（game 37、tests 7、tools 1）。確認45、未確認0。ソース・テスト42件と付属README 3件。履歴系・管理資料114件はスコープ確認と根拠照合に使用。内訳はdocs 111、ルートREADME・AGENTS・builds/README 各1。buildsには基準時点で過去版実体なし。別アプリのコードは全体集計外。
- 整理手順は [SOURCE_CODE_CLEANUP_PLAN.md](SOURCE_CODE_CLEANUP_PLAN.md)。調査時点ではゲーム、テスト、配信、ツールを変更していない。

## 集計

| 分野 | ファイル | 物理行 | コード行 | 空行 | コメントのみ |
|---|---:|---:|---:|---:|---:|
| 現行JavaScript | 33 | 3,909 | 3,588 | 307 | 14 |
| HTML・埋め込みSVG | 1 | 158 | 158 | 0 | 0 |
| CSS | 1 | 289 | 278 | 11 | 0 |
| Node/ESM設定 | 1 | 5 | 5 | 0 | 0 |
| Nodeテスト | 6 | 1,202 | 1,136 | 61 | 5 |
| 合計 | 42 | 5,563 | 5,165 | 379 | 19 |

配信・実行側は物理4,361行、コード4,029行。Node v24.22.3のAcornでJSの非EOFトークンを含む行を数えた。HTML/CSSはコメントを改行保持で除いて非空行、JSONは非空行。インラインコメント付きの実行行はコード。README・生成物・過去版を分母から除外。基準時点に独立アセット、バンドル、現行用ビルドスクリプトなし。SVGはHTMLに含む。

| 分類 | 内容 | 件数 | 純減見込み（コード行） |
|---|---|---:|---:|
| A | 削除可能 | 6 | 6 |
| B | 整理・統合推奨 | 5 | 1〜10 |
| C | 処理効率改善推奨 | 7 | 算入外 |
| D | 要検討 | 5 | 算入外 |
| E | 維持必要 | 7 | 0 |

合計7〜16行、全コード5,165行の約0.14〜0.31%。Aは約0.12%。同一行にある設定値やexportキーワードの除去を削減1行とは数えない。Bは候補の事前見積もり。重複する箇所はAとBの見積もりに重ねていない。削除可能ファイル0。効率候補7。リスク分布は低13・中11・高6件（Eのリスクは仮に撤去した場合）。削減率の目標は置かない。

## 調査・検証

1. Gitで45ファイルを列挙し、HTMLのモジュール起点から、拡張子とURLクエリを確認して依存を追跡。Acornの構文木と手作業で静的import/exportを照合。実行JS33/33到達。combat.js ↔ mob-world.js の相互参照は実行時参照で、ブラウザとNodeで初期化。独立した死んだモジュール群は見つからない。
2. モジュール内外の呼出し先、フォールバックの発生条件、設定値が結果に反映される範囲を調べた。ブラウザイベント、CSSクラス、dataset、aria参照、Mapの品目キー、セーブのID復元を個別に考慮。名前の出現回数だけでAと判定していない。
3. ESLint 9.39.5で全39 JS/MJSを解析。no-unused-vars（引数とrest除外）、no-unreachable、no-dupe-keys、no-constant-condition、no-constant-binary-expressionは指摘0。ESLintはexport済み未参照やドメイン条件上の到達不能を検出しないので別途確認。ツールは作業用ディレクトリにのみ配置。
4. AGENTS、開発方針、現行仕様、対応表、変更履歴、TODO、状況、ロードマップ、未決事項を照合。分野別仕様と履歴索引を読み、候補に関係する開発履歴・旧セーブ監査を追跡。既存監査は形式12→13時点の記録として維持し、今回の形式15の再確認結果を本書に記載。明確な旧形式移行処理は見つからない。形式15の復元検証とIndexedDBのスキーマ生成・エラー処理はそれぞれ現用。
5. `node --test tests/*.mjs` は36/36合格。Node実行時間14.995秒は本監査時の全テスト1回の値で、ゲームFPSの指標ではない。テストコードは類似の準備があっても対象と期待結果が異なる。
6. Chromium 145 headless・ローカルHTTP・分離した新規プロファイルで起動。1280×720と390×844のタッチ有効設定で、HUDから装備、道具、クエスト、技能、国家、世界地図、セーブを開き、IndexedDBへの手動保存の成功表示と、ページ再読み込みの例外なしを観測。CDP Precise Coverageで下記の呼出し回数を採取。操作時間とダイアログ停止時間を含む単発値。ロード内容の精密比較・ゲームパッド実機・スマートフォン実機・全UI状態・長時間のフレーム時間・CPU/メモリ量は未計測。A/Bは現行コードの根拠を確認した見込みで、変更後の実測ではない。

| CDP呼出し回数 | PC | 狭幅 |
|---|---:|---:|
| frame | 191 | 188 |
| moveAdventurers | 164 | 161 |
| settlementBuildings | 328 | 322 |
| advanceAdventurers | 5 | 5 |
| advanceNations | 169 | 166 |

### 起動・責務の照合

- index.html → main.js → 入力登録と形式15の起動ロード → UI登録 → requestAnimationFrame。毎フレームの位置更新と、MOBの固定周期と国家のイベント時刻は独立。宿泊時は既存の刻みで早送り。
- 移動・戦闘・成長は E02/E03、資源収集と時間は A01/A04/B03/E04、所持品・商店・経済は A02/B04/C04/C05、行動判断・世界シミュレーションは C01/C03/C07、表示・操作は B02/C02/C06/E05、保存と検証は B05/D02〜05/E01/E06。複製のように見えても入力の契約、プレイヤー向け画面、戦闘者の報酬と時刻の違いを保持する。
- 旧実装から蓄積した箇所は、共有採集へ移行後に残った旧時間値と、HUDの別経路で不要になった日時ヘルパーが中心。最近の変更では、機能を残したまま移動をフレームへ移した結果の配列頻度、索引用地形と描画用地形の計算重複が今後の主な負荷候補。大規模な旧互換群や未使用ファイル群は確認していない。
- 資料ずれを1件補正。対応表 CUR-SYS-003 は未参照の gameMinutes を担当関数としていたので実際の現行関数へ更新。その他の現行仕様・目標・実装基準は変更しない。

## 全ファイルの確認索引

JS/テストの列は物理/コード。依存は直接参照の要約（基準コミットで解決）。各モジュールとテストのソース、設定、エントリ、DOM・CSS・保存ルートを上記分類と合わせて調べた。候補番号のない箇所にも削除可能という判断は付けていない。

| ファイル | 物理 / コード | 直接参照 |
|---|---:|---|
| `game/src/adventurers.js` | 212 / 200 | skills.js, growth.js, consumables.js, clock.js, settings.js, equipment.js, world.js, nation-layout.js, mob-world.js, combat.js, loot.js, shop.js |
| `game/src/clock.js` | 35 / 29 | 外部モジュールなし |
| `game/src/combat.js` | 157 / 147 | settings.js, weapon-skill.js, world.js, mob-world.js, equipment.js, quests.js, loot.js |
| `game/src/consumables.js` | 24 / 20 | equipment.js, growth.js |
| `game/src/equipment.js` | 96 / 85 | trade-settings.js |
| `game/src/gear-ui.js` | 244 / 230 | weapon-skill.js, growth.js, equipment.js, shop.js, consumables.js |
| `game/src/growth.js` | 29 / 24 | settings.js |
| `game/src/input.js` | 81 / 74 | 外部モジュールなし |
| `game/src/loot.js` | 49 / 43 | equipment.js, settings.js |
| `game/src/main.js` | 324 / 295 | world-map.js, skills.js, skill-menu.js, settings.js, world.js, combat.js, growth.js, input.js, render.js, gear-ui.js, clock.js, consumables.js, quests.js, loot.js, trees.js, equipment.js, save-data.js, save-menu.js, nation-simulation.js, mob-world.js, nation-layout.js, nation-menu.js, shop.js, adventurers.js |
| `game/src/mob-settings.js` | 19 / 19 | 外部モジュールなし |
| `game/src/mob-world.js` | 410 / 388 | clock.js, combat.js, mob-settings.js, nation-simulation.js, settings.js, world.js |
| `game/src/nation-economy.js` | 102 / 90 | nation-layout.js, nation-settings.js, trade-settings.js, trade-stock.js |
| `game/src/nation-layout.js` | 62 / 56 | settings.js, nation-settings.js |
| `game/src/nation-menu.js` | 89 / 87 | nation-simulation.js, nation-settings.js, trade-settings.js, trade-stock.js |
| `game/src/nation-save.js` | 195 / 188 | mob-settings.js, clock.js, nation-layout.js, nation-simulation.js, nation-settings.js, trade-settings.js, trade-stock.js |
| `game/src/nation-settings.js` | 24 / 24 | 外部モジュールなし |
| `game/src/nation-simulation.js` | 358 / 326 | trees.js, clock.js, nation-layout.js, nation-economy.js, nation-settings.js, trade-settings.js, trade-stock.js |
| `game/src/quests.js` | 153 / 138 | settings.js, equipment.js |
| `game/src/render.js` | 263 / 247 | mob-world.js, settings.js, world.js, nation-simulation.js, trees.js |
| `game/src/save-data.js` | 260 / 243 | mob-world.js, mob-settings.js, skills.js, world.js, settings.js, equipment.js, growth.js, consumables.js, clock.js, trees.js, nation-simulation.js, nation-save.js, shop.js, adventurers.js, world.js |
| `game/src/save-menu.js` | 129 / 116 | save-data.js, save-store.js |
| `game/src/save-store.js` | 52 / 48 | 外部モジュールなし |
| `game/src/settings.js` | 30 / 26 | 外部モジュールなし |
| `game/src/shop.js` | 170 / 148 | nation-layout.js, world.js, equipment.js, trade-settings.js, trade-stock.js |
| `game/src/skill-menu.js` | 29 / 28 | skills.js |
| `game/src/skills.js` | 43 / 38 | growth.js |
| `game/src/trade-settings.js` | 23 / 21 | 外部モジュールなし |
| `game/src/trade-stock.js` | 29 / 24 | trade-settings.js |
| `game/src/trees.js` | 50 / 44 | settings.js, nation-settings.js |
| `game/src/weapon-skill.js` | 17 / 14 | growth.js, skills.js |
| `game/src/world-map.js` | 51 / 45 | settings.js, mob-world.js, world.js |
| `game/src/world.js` | 100 / 83 | settings.js, nation-layout.js |
| `tests/adventurers.test.mjs` | 132 / 127 | node:test, strict, adventurers.js, combat.js, mob-world.js, equipment.js, shop.js, world.js, clock.js |
| `tests/economy.test.mjs` | 216 / 204 | node:test, strict, clock.js, equipment.js, world.js, nation-layout.js, shop.js, nation-save.js, nation-simulation.js, nation-economy.js, mob-world.js |
| `tests/mobs.test.mjs` | 193 / 179 | strict, node:test, skills.js, clock.js, combat.js, mob-world.js, mob-settings.js, nation-simulation.js, save-data.js, settings.js, loot.js, equipment.js, world.js |
| `tests/nations.test.mjs` | 344 / 327 | node:test, strict, trees.js, save-data.js, shop.js, combat.js, skills.js, quests.js, settings.js, nation-settings.js, nation-layout.js, world.js, clock.js, nation-simulation.js, nation-save.js |
| `tests/skills.test.mjs` | 173 / 162 | mob-world.js, node:test, strict, skills.js, growth.js, weapon-skill.js, combat.js, save-data.js, world.js, equipment.js |
| `tests/trade.test.mjs` | 144 / 137 | node:test, strict, clock.js, nation-simulation.js, nation-save.js, nation-economy.js, shop.js, trade-settings.js, trade-stock.js, world.js |
| `game/index.html` | 158 / 158 | CSS、main、埋め込みSVG、ラベル・ID・イベントの起点 |
| `game/style.css` | 289 / 278 | HTML、動的クラス、PC・狭幅・coarse条件 |
| `game/package.json` | 5 / 5 | ESM宣言。scripts・依存なし |
| `game/README.md` | 文書 | ローカルHTTP、CSSのハッシュ、操作、参照元 |
| `tests/README.md` | 文書 | Node実行方法と36テストの識別子 |
| `tools/README.md` | 文書 | 説明のみ、実行ツールなし |

## 個別判定

行は基準コミットの1始まり。A〜EをIDの接頭辞で表す。負荷は計測記載がある場合のみ実測。候補の経緯で分からない初出は不明とした。

### A01 — game/src/clock.js:5–7 `gameMinutes`

- 内容・経緯　小数ゲーム分を整数に丸める公開関数。現行HUDは main.js:272–274 で丸め、他の呼出し元は exactGameMinutes を使う。導入コミット不明。DEV-050/061以降に時計の責務が拡大。
- 根拠・依存・影響　構文木上は定義のみ。本体・テスト・リポジトリ内に呼出しなし。モジュール副作用なし。
- 仕様　CUR-SYS-005
- 対応・検証　関数の3行を削除。整数時刻・日付変更・宿泊を確認（NATION-03、ECON-04）。
- 純減　3行（数値の場合）。負荷　ほぼなし。リスク　低。確度　高。

### A02 — game/src/gear-ui.js:35–49,181,199 `row`

- 内容・経緯　一覧行を DOM に追加して、その行を返す。装備・道具UI成立時の補助。返却の導入コミット不明。
- 根拠・依存・影響　呼出し2箇所とも式文。生成した行を使う箇所はリストの子要素から改めて参照する。
- 仕様　CUR-ITEM-002/003
- 対応・検証　return item のみ撤去。要素生成、ボタン、操作後フォーカスを両画面で確認。
- 純減　1行（数値の場合）。負荷　なし。リスク　低。確度　高。

### A03 — game/src/growth.js:20–28 `gainExperience`

- 内容・経緯　経験値とHPを更新してレベル上昇の真偽を返す。共有成長はDEV-062、返却値の導入コミット不明。
- 根拠・依存・影響　skills.js:41 と SKILL-02 が双方とも返り値を捨てる。レベル通知は combat.js の事後比較。previousLevel はHPに必要。
- 仕様　CUR-GROWTH-002/003
- 対応・検証　末尾の return 1行だけ撤去。技能XP、複数レベル上昇、HP、通知を確認（SKILL-01/02/07、ADV-01）。
- 純減　1行（数値の場合）。負荷　ほぼなし。リスク　低。確度　高。

### A04 — game/src/nation-settings.js:10 と game/src/nation-save.js:140–164 `harvest.*.minutes`

- 内容・経緯　旧来の採集作業時間を保存検証用の taskSchedule へ渡す。DEV-072で1個ずつの nextPick に変更。
- 根拠・依存・影響　値は taskSchedule の end にしか影響せず、採集中の検証は startWork と nextPick だけを使用。建築・加工は別の minutes で現用。
- 仕様　CUR-NATION-002、CUR-SYS-004
- 対応・検証　harvest 内の2プロパティと読取1行だけ削る。形式15の採集中・枯渇・回復・運搬を確認（NATION-04/06）。
- 純減　1行（数値の場合）。負荷　ほぼなし。リスク　低。確度　高。

### A05 — game/src/growth.js:3、mob-world.js:38、nation-economy.js:7、nation-layout.js:15、quests.js:53/76、shop.js:9、world.js:59

- 内容・経緯　モジュール内で用いる8シンボルを公開。経緯は各分野の分割時、個別の導入SHAは不明。
- 根拠・依存・影響　すべてAST上は外部importなし。DOMイベントは quests.js 内部から呼ぶ。関数・データ自身には実使用あり。
- 仕様　CUR-GROWTH-002、CUR-WORLD-001/004/007、CUR-NATION-003、CUR-QUEST-002、CUR-SHOP-002
- 対応・検証　export キーワードのみ削除。公開範囲の縮小。起動・ギルド・売買・地形・全テスト。
- 純減　0行（数値の場合）。負荷　なし。リスク　低。確度　高（リポジトリ内）。

### A06 — game/src/nation-simulation.js:22、game/src/nation-save.js:176 `resident.nationId / cityId`

- 内容・経緯　生成と復元の両方で、住民に所属IDを追加。帰属はDEV-066の都市・住民モデル。個別導入SHA不明。
- 根拠・依存・影響　呼出し側は都市・国家を引数あるいはインデックス内の別フィールドで受ける。明示シリアライズは住民の所属プロパティを含まない。都市自体の cityId は別物。
- 仕様　CUR-NATION-001/002、CUR-SYS-004
- 対応・検証　両生成経路から住民上の2プロパティだけ除去。国家別人口・住民戦闘・保存往復確認（NATION-01/04、MOB-03）。
- 純減　0行（数値の場合）。負荷　微小なオブジェクト縮小。リスク　低。確度　中高。

### B01 — game/src/save-data.js:4,18 `world.js` import

- 内容・経緯　同一URLから別々に取り込む。冒険者宿の検証をDEV-092で追加。
- 根拠・依存・影響　モジュールURLが同一で既に共有インスタンス。整理対象は宣言行だけ。
- 仕様　CUR-SYS-004、CUR-ADV-001
- 対応・検証　innDoors を既存importへ移す。起動・保存復元。
- 純減　1行（数値の場合）。負荷　なし。リスク　低。確度　高。

### B02 — game/style.css:167–181,189,240–247 `.equipment-slot/.slot-weapon`

- 内容・経緯　武器色を2回記載し、中間の全装備枠ルールが継承色を指定。装備画面・装着色追加に由来、各行の導入SHA不明。
- 根拠・依存・影響　同じ specificity と順序で武器色を再指定。装着済みは2クラスで優先。
- 仕様　CUR-ITEM-002、CUR-UI-005
- 対応・検証　基底ブロックに継承色、武器ブロックに金色、装着済みブロックに装着色。実際の差分は0〜1行程度。PC/狭幅の計算済みCSS確認。
- 純減　0–1行（数値の場合）。負荷　なし。リスク　低。確度　高。

### B03 — game/src/main.js:108–114,132–137,272–305 `現在時刻`

- 内容・経緯　同一フレームで小数時刻を世界更新、HUD用丸め、描画ごとに求める。DEV-061、074、098の連携。
- 根拠・依存・影響　同じ基準と経過秒を読む。フレーム内の宿泊開始は既存の休止順序を残す必要。
- 仕様　CUR-SYS-003/005、CUR-INN-002
- 対応・検証　フレームの小数時刻を共有し、HUDだけ丸める。宿、ワープ、ロード直後、日付境界を確認。純減は保証せず。
- 純減　0–2行（数値の場合）。負荷　微小、未計測。リスク　中。確度　中。

### B04 — game/src/shop.js:23–38,113–169 と冒険者:91–107 `売買残高`

- 内容・経緯　売買で同じ店種別・残高・在庫の解決が繰り返される。DEV-079・090・092。
- 根拠・依存・影響　既に売買本体を共有。店と国庫の振替に共通部分はあるが、販売と買取の制約は異なる。
- 仕様　CUR-SHOP-001〜005、CUR-ADV-001
- 対応・検証　解決済みの店・口座を1取引内で使い回す案だけ比較。新ラッパーで純増なら見送り。全取引・売れ残り・国庫記録を照合。
- 純減　0–6行（数値の場合）。負荷　微小、未計測。リスク　中。確度　中。

### B05 — game/src/nation-save.js:180–192 `nextEvent`

- 内容・経緯　同一配列から次回イベント候補を検証時と代入時に再計算。国家保存復元とDEV-089の厳密化。
- 根拠・依存・影響　間にある assignRoles・refreshNationDemand は参照する task.end と readyAt を変えない。初期空状態の例外は別。
- 仕様　CUR-SYS-004、CUR-NATION-002
- 対応・検証　計算結果をローカル変数で再利用。国家の初期・死亡直後・全滅・採集中の復元。
- 純減　0行（数値の場合）。負荷　ロード時のみ配列生成を削減、未計測。リスク　低。確度　高。

### C01 — game/src/main.js:109,182,282–285、nation-simulation.js:346–348 `settlementBuildings`

- 内容・経緯　冒険者とプレイヤーが建物配列を別々に生成。DEV-098で冒険者をフレームへ移した際に頻度増加。
- 根拠・依存・影響　CDPで通常進行328/164回（PC）、322/161回（狭幅）。建物一覧は両処理の間に変化しない。
- 仕様　CUR-MOVE-002、CUR-ADV-001
- 対応・検証　先に1フレームで共有。必要なら保存復元と建築完了で無効化するキャッシュを検討。建築直後の衝突、洞窟、宿、ロード。
- 純減　対象外行（数値の場合）。負荷　呼出し回数実測、改善時間未計測。リスク　中。確度　高。

### C02 — game/src/render.js:60–75,184–198、mob-world.js:17–29 `地形判定`

- 内容・経緯　各描画で静的地形を判定。起動時にMOB・地図用の同じ地形サンプルも生成。DEV-074/077/097。
- 根拠・依存・影響　静的な同一タイル中心。描画色・境界・表示範囲は既存経路に依存。
- 仕様　CUR-WORLD-003/007、CUR-UI-003/006
- 対応・検証　現存の不変タイル情報の再利用を比較。シーン一致、街道、地図霧、メモリとフレーム時間を測定。
- 純減　対象外行（数値の場合）。負荷　CPU削減の見込みは静的推定。リスク　中。確度　高。

### C03 — game/src/adventurers.js:68–78,156–173 `移動対象・戦利品検索`

- 内容・経緯　フレームごとに拾得対象の有効性を includes で確認。定期判断は filter 後 nearest。DEV-092/098。
- 根拠・依存・影響　戦利品が増えると走査量が増える。対象が他者に拾われた際の追跡中止自体は必要。
- 仕様　CUR-ADV-001
- 対応・検証　まず定期判断の filter と最短検索の一走査化。フレーム走査は山積みケースで計測してから参照管理を検討。
- 純減　対象外行（数値の場合）。負荷　静的推定。通常短時間計測で大量戦利品は未発生。リスク　中。確度　中高。

### C04 — game/src/nation-simulation.js:265–269、trade-stock.js:3–13 `加工枠`

- 内容・経緯　craftChance が予約人数を調べ、tradeRoom で同じ予約人数を再走査。DEV-090。
- 根拠・依存・影響　同じ同期呼出し中は人数と加工状態不変。条件未成立時も先行走査する。
- 仕様　CUR-NATION-006、CUR-SHOP-005
- 対応・検証　当該判定内で値を共有し、住民間では持ち越さない。予約競合・満杯・中断・ロード（TRADE-02/04）。
- 純減　対象外行（数値の場合）。負荷　静的推定、多人口・上限時に比較。リスク　低。確度　高。

### C05 — game/src/shop.js:75–109 `日次商店補充`

- 内容・経緯　各店・日次の両方向で基準在庫を作り、供給側の固定IDを毎回ソート。DEV-079/080。
- 根拠・依存・影響　基準品目と順序は静的。買い取り側の実在庫キー順は動的。
- 仕様　CUR-SHOP-004、CUR-NATION-005
- 対応・検証　読み取り専用の基準情報のみ事前生成。精算2段階・残高ゼロ・低資金・100日検証（ECON-03/04/05、TRADE-04）。
- 純減　対象外行（数値の場合）。負荷　日次処理の割当削減、未計測。リスク　低。確度　高。

### C06 — game/src/main.js:294–304 `HUD`

- 内容・経緯　毎フレーム meter.value を書き、洞窟中でも市街を検索。HUD導入後に複数パネル追加、代入の初出不明。
- 根拠・依存・影響　テキストは既に setText で変更時だけ書く。メーターは同値の代入、市街名は洞窟で未使用。
- 仕様　CUR-UI-001、CUR-SYS-003
- 対応・検証　メーターを変更時のみ書き、市街検索はフィールド側で評価。戦闘ダメージ・回復・レベル上昇・洞窟入退場。
- 純減　対象外行（数値の場合）。負荷　静的推定、DOM時間は未計測。リスク　低。確度　高。

### C07 — game/src/mob-world.js:375–408 `遠景の敵と冒険者`

- 内容・経緯　世界周期で全MOBと各冒険者の候補距離を比較。DEV-074/092。
- 根拠・依存・影響　現在6人で上限は小さい。モブの行動順・乱数や定期発生と結合しており、一律停止は挙動を変える。
- 仕様　CUR-WORLD-007、CUR-ADV-001
- 対応・検証　負荷の増える局面をプロファイルしてから既存チャンク索引で候補限定を検討。目標選択順・同距離・遠景成長・宿泊・再現性。
- 純減　対象外行（数値の場合）。負荷　静的推定、CPU比率未計測。リスク　高。確度　中。

### D01 — game/src/equipment.js:48 `tree-nut`

- 内容・経緯　木の実を食料として登録。共有採集はDEV-070/072でリンゴ中心。個別の導入コミット不明。
- 根拠・依存・影響　新規ゲームの供給元は見つからないが、現行仕様に回復効果が記載され、items 経由で形式15の所持・販売・復元が成立。
- 仕様　CUR-ITEM-003、CUR-SYS-004
- 対応・検証　仕様判断まで保留。削除時は現行形式への影響を明示し、購入・消費・JSON読込を検証。
- 純減　算入外行（数値の場合）。負荷　なし。リスク　高。確度　高（残置根拠）。

### D02 — game/src/save-data.js:25–48 `makeSave の各既定値`

- 内容・経緯　nations、mobWorld、shopStock、冒険者等がない呼出しに既定値を供給。DEV-089後の現行オブジェクト生成も含む。
- 根拠・依存・影響　通常の main.js は項目を持つが、保存済みテストが簡略fixtureで省略し、実際に分岐へ入る。読込の旧形式対応とは別。
- 仕様　CUR-SYS-004
- 対応・検証　テスト入力を現行stateと同じに統一してから個別要否判断。36件とブラウザ手動/自動/失敗系。
- 純減　算入外行（数値の場合）。負荷　通常経路の改善は極小。リスク　中。確度　高（テスト依存）。

### D03 — game/src/mob-settings.js:9–10、mob-world.js:147–151,220、save-data.js:170–171 `worldMaximumFactor`

- 内容・経緯　世界の発生最大数と読込上限の計算に倍率1を使う。DEV-074・087・089。
- 根拠・依存・影響　現在の値では min(round(x),ceil(x)) は round(x)。保存上限の導出にも同設定を利用し、将来の調整契約が不明。
- 仕様　CUR-WORLD-007、CUR-SYS-004
- 対応・検証　発生上限と形式15の読込上限を分離できるか判断。旧形式拒否と現行密度を維持。
- 純減　算入外行（数値の場合）。負荷　通常進行では軽微。リスク　中。確度　中高。

### D04 — game/src/nation-save.js:183–192 `initial / hasIdle`

- 内容・経緯　初期と休止中住民の判定を復元。DEV-089の現行判定整理を参照。
- 根拠・依存・影響　住民0人では every が真かつ some が偽。見かけの二重判定を統合すると受理範囲に差が出る。
- 仕様　CUR-SYS-004、CUR-NATION-002
- 対応・検証　空国・死亡・初期差分を表で再検証。現行受理契約を決めるまで保持。
- 純減　算入外行（数値の場合）。負荷　読み込み時のみ。リスク　高。確度　高（差の存在）。

### D05 — game/src/combat.js:19–35,60–140 と world.js:73–89 `野外フォールバック`

- 内容・経緯　野外は個体、洞窟は固定遭遇。mobWorld 欠落時には encounters を使う。DEV-074で野外が移行。
- 根拠・依存・影響　画面上の field.spawns は空。テストで簡略stateを用いる経路があり、洞窟の既存分岐と交錯。
- 仕様　CUR-COMBAT-001〜007、CUR-WORLD-006/007
- 対応・検証　先に本体・テストの境界を明文化。洞窟と野外の実動作を独立に検証した後、field の欠落フォールバックのみ評価。
- 純減　算入外行（数値の場合）。負荷　軽微。リスク　中。確度　中。

### E01 — game/src/save-data.js:215–260、save-menu.js:8–129、save-store.js:6–52

- 内容・経緯　版判定・不正検証・保存エラー処理。DEV-088/089で旧版専用枝を撤去。
- 根拠・依存・影響　形式15入口で異版を拒否する。IndexedDB DBスキーマ1、失敗時の保存枠維持、エラー通知は現用。
- 仕様　CUR-SYS-004、SYSTEM-011
- 対応・検証　維持。形式不一致・破損・競合・手動/自動、JSON入出力を回帰対象に。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　高。確度　高。

### E02 — game/src/world.js:54–99、mob-world.js:155–180,246–278、nation-simulation.js:56–116、adventurers.js:56–80

- 内容・経緯　MOB・住民・プレイヤー・冒険者の移動。DEV-066/074/098。
- 根拠・依存・影響　プレイヤーと冒険者は movePlayer 共用。MOBはチャンク索引更新、住民は予定時刻に基づく座標補間。異なる更新・衝突契約。
- 仕様　CUR-MOVE-002、CUR-ADV-001、CUR-WORLD-007、CUR-NATION-002
- 対応・検証　無理な単一移動器へ統合しない。境界・家屋から抜ける・衝突・遠景を維持。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　高。確度　高。

### E03 — game/src/combat.js:9–13,142–157、mob-world.js:335–371、adventurers.js:113–123,134–145、weapon-skill.js、skills.js

- 内容・経緯　共有式と別の戦闘主体への適用。DEV-062/074/092。
- 根拠・依存・影響　物理軽減、武器命中・技能XPは共用。住民は武器技能やプレイヤー報酬を持たず、敵側は攻撃待ちと距離判断が異なる。
- 仕様　CUR-COMBAT-001〜007、CUR-GROWTH-002/003、CUR-ADV-001
- 対応・検証　式を維持。役割差を失う統合は見送り。命中、XP、協戦、戦利品優先を保護。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　高。確度　高。

### E04 — game/src/trees.js:17–26,30–50、nation-simulation.js:133–153、nation-save.js:140–164

- 内容・経緯　共有資源の採集と住民予約。DEV-070〜072、089。
- 根拠・依存・影響　残量・再生は共通で、プレイヤーの秒進捗と住民イベントは異なる。値0でも readyAt 到達で再生するため単純な null 合体と等価でない。
- 仕様　CUR-WORLD-005、CUR-NATION-002、CUR-SYS-004
- 対応・検証　現行の枯渇、再生世代、予約、区別された進捗を維持。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　中。確度　高。

### E05 — game/src/gear-ui.js:103–138,148–230、game/index.html:42–143、game/style.css:64,196–203,242–251、input.js:24–80

- 内容・経緯　DOMイベント、動的クラス、レスポンシブ、タップとドラッグ。DEV-046〜050、077、096等。
- 根拠・依存・影響　.inventory-goods/.is-equipped は動的。label/aria/ID はブラウザ・アクセシビリティ参照。タップ・ドラッグ・padは入力源が別。
- 仕様　CUR-INPUT-001/002、CUR-ITEM-002、CUR-SHOP-003、CUR-UI-005
- 対応・検証　見た目や文字列ヒットだけで削除しない。PC・狭幅・タッチ、フォーカス、装備を確認。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　中。確度　高。

### E06 — tests/*.test.mjs 全6本

- 内容・経緯　現行テスト36件。各DEVの保存済み回帰。
- 根拠・依存・影響　似た保存テストでも、技能・戦利品・住民・商店・加工・MOBの状態が違う。ADV-02と04は直接処理と移動連携で役割が異なる。
- 仕様　CUR-SYS-004ほか、テスト索引参照
- 対応・検証　テストを維持し、fixture共通化は必要時に別判断。形式15・旧版拒否の両方を残す。
- 純減　0行（数値の場合）。負荷　製品負荷なし。リスク　中。確度　高。

### E07 — game/package.json:1–5、game/index.html:7,108–110,156、builds/README.md

- 内容・経緯　ESM宣言、CSSと起動スクリプト、埋込みシルエット、過去版保存枠。
- 根拠・依存・影響　HTMLのローカル依存はCSSとmain。外部画像・ビルド不要。ESM宣言はNodeの実行形式にも関係する。buildsは履歴管理。
- 仕様　CUR-SYS-001、CUR-ITEM-002
- 対応・検証　現行アセット・メタデータ維持。過去枠は対象外。
- 純減　0行（数値の場合）。負荷　評価なし。リスク　低。確度　高。
