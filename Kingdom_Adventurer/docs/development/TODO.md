# 累積型開発TODO

完了項目は削除しない。IDは再利用しない。追加・修正・再設計・詳細化・不具合も登録する。各項目に対象Phase、関連仕様ID（着手前に実資料から確認）、依存関係、完了条件を記録し、完了時に日付・コミット・検証結果を追記する。チェックは当該項目の完了のみを意味し、最終仕様の完成とは別。取り消し・置換は理由と後継IDを残す。優先順位は変更可能。未登録仕様を定期照合する。

## Phase 1 — 最小ゲーム
- [x] DEV-001 参考ゲームの確認・技術選定：Kingdom Observer と森のサバイバルの実物・コードを確認し、流用可否、操作方式、実行環境、構成を決める。重要な未決定は確認する。
  - 関連仕様 GAME-001・SYSTEM-006・SYSTEM-007・SYSTEM-008。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。参考元2本のコードと公開画面を確認し、構成と流用箇所をゲームREADMEに記録。
- [x] DEV-002 フィールドと描画：移動可能なマップを表示する。依存 DEV-001。
  - 関連仕様 WORLD-001・WORLD-002・WORLD-006。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。草原・森林・街道がある固定フィールド。構文検査と地形判定を確認。
- [x] DEV-003 プレイヤー移動・カメラ：操作して移動しカメラが追従する。依存 DEV-002。
  - 関連仕様 SYSTEM-007・SYSTEM-008・EXPLORE-004。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。直接移動と追従描画。Nodeで移動と街境界通過を確認。
- [x] DEV-004 固定の街・宿の配置：街に移動して宿へ接触できる。依存 DEV-002,003。
  - 関連仕様 WORLD-004・HOUSING-002。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。固定街・宿の入口と建物衝突を実装。街の開始位置と接触動線を確認。
- [x] DEV-005 HP・敵出現・簡易AI：敵が出現し基本行動を行い、HPを管理できる。依存 DEV-002,003。
  - 関連仕様 ECO-001・COMBAT-006・COMBAT-007。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。Nodeで8地点の自動出現、再出現、街の安全、被弾を確認。
- [x] DEV-006 基本戦闘：攻撃・被弾・敵撃破が成立する。依存 DEV-005。
  - 関連仕様 COMBAT-001・COMBAT-010。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。Nodeで接近時の自動攻撃と撃破を確認。手動対象指定は将来対象。
- [x] DEV-007 簡易宿泊：接触でYES/NO、YESで無料全回復、NOで回復なし。依存 DEV-004,005。
  - 関連仕様 SYSTEM-003。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。Chromiumで入口に触れ、NOでHP 52のまま、再接触してYESで100に全回復。
- [x] DEV-008 最低限のUI・死亡再開：HP確認と死亡後の再開が可能。依存 DEV-005,006。
  - 関連仕様 SYSTEM-001・SYSTEM-006。2026-11-25 Phase 1実装コミット [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。ChromiumでHP 0の戦闘不能画面から街で再開し、HP 100を確認。
- [x] DEV-009 最小ゲームの統合確認：探索→戦闘→帰還→回復を実際に確認し、初期対象外機能を含めず、遊べる状態を保存する。依存 DEV-002〜008。

  - 関連仕様 WORLD-002・COMBAT-001・SYSTEM-001・SYSTEM-003。2026-11-25 統合確認コミット `Verify Kingdom Adventurer Phase 1 and record handoff`。
  - Chromiumで開始 → 街の外へ移動 → 自動戦闘・被弾・撃破 → 帰還 → 宿でNO・YES → 再探索 → 戦闘不能 → 街で再開を確認。JavaScriptの未捕捉エラーなし。
  - GitHub Pagesの初期画面の表示を確認。公開HTML・CSS・全JSが操作試験版と一致。

## Phase 2以降 — 将来の対象（粗粒度、順序未確定）
- [ ] DEV-010 ゲーム基本構想の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第1分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-011 世界・マップの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第2分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-012 冒険・探索の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第3分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-013 戦闘の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第4分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-014 キャラクター成長の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第5分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-015 装備・アイテムの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第6分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-016 NPC・生活AIの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第7分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-017 仲間・組織の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第8分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-018 魔物・生態系の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第9分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-019 経済・産業の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第10分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-020 建築・領地・住宅の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第11分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-021 国家・政治・戦争の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第12分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-022 社会・人口の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第13分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-023 クエスト・歴史の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第14分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-024 ゲーム基盤の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第15分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-025 全仕様・実装・TODOの照合と不足解消（Phase 3）
- [ ] DEV-026 最終調整・完成確認（Phase 4）

- [x] DEV-027 撃破時の貨幣ドロップ・有料宿泊（Phase 2の個別先行対応）。依存 DEV-005〜009。
  - 関連仕様 CUR-COMBAT-001/006/007、CUR-INN-001/002、CUR-SYS-002/003、CUR-LIFE-001、CUR-UI-001/004、ITEM-006、ECONOMY-008/013、SYSTEM-003。
  - 完了条件：撃破地点の貨幣を一度だけ拾える。料金と所持金を表示し、承諾時に残高が足りれば支払いと全回復、不足・辞退ではHPと残高を維持する。
  - 2026-11-25 実装 [`29051f1a7d13302348baa3fc51682904a33fec43`](https://github.com/garatnic/sample/commit/29051f1a7d13302348baa3fc51682904a33fec43)。Nodeの簡易DOMで被弾・撃破・拾得・二重加算防止・宿の辞退・支払い・残高不足・料金と残高が同額の場合を確認。ブラウザ実機は未検証。
- [ ] DEV-028 貨幣と宿泊の詳細化。依存 DEV-027。初期所持金・敵の貨幣・宿泊料金を調整し、経済主体間の移転、宿泊時の時間経過（DEV-061で実装）、死亡時の所持金損失と接続する。関連 ITEM-006、ECONOMY-008/013、SYSTEM-001/003。

- [x] DEV-029 スマホ用の仮想スティックを下中央へ移動（Phase 2の個別先行対応）。
  - 関連仕様 CUR-INPUT-002、CUR-UI-001、SYSTEM-006/008/009。完了条件：下中央に配置し、通知をスティックの上に表示する。
  - 2026-11-25 実装 [`6e00387b8c0948a0a2f82eef4dab42ea4d0f058c`](https://github.com/garatnic/sample/commit/6e00387b8c0948a0a2f82eef4dab42ea4d0f058c)。CSSの配置条件と、Nodeでタッチ移動・指を離したときの入力解除を確認。スマホ実機での新配置は未確認。

- [x] DEV-030 公開ゲームのCSSキャッシュ対策（Phase 2の個別先行対応）。関連 CUR-SYS-001、SYSTEM-006。CSSの内容に対応する版付きURLをHTMLから読み込む。
  - 2026-11-25 実装 [`2b528d93655baa2ffb915e81ce53907161b6b3d0`](https://github.com/garatnic/sample/commit/2b528d93655baa2ffb915e81ce53907161b6b3d0)。CSS参照とハッシュの一致を検証。

- [x] DEV-031 ゲーム画面に ver.4 を表示し、ゲーム修正ごとに表示版を1つ上げる手順を整備する。関連 CUR-UI-001、SYSTEM-009。
  - 2026-11-25 実装 [`9042c597db6cc2933f1b069cc505f3742a2387fe`](https://github.com/garatnic/sample/commit/9042c597db6cc2933f1b069cc505f3742a2387fe)。HTMLの表示文字列と手順を確認。

- [x] DEV-032 討伐経験値とレベルアップ。関連 GROWTH-001、CUR-GROWTH-001、CUR-COMBAT-005/006、CUR-INN-002、CUR-LIFE-001、CUR-UI-001。経験値取得・基礎能力の上昇・表示・宿回復・戦闘不能後の維持を確認する。
  - 2026-11-26 ver.5 実装 [`52fe7fedb94556ffa29bbd47c07e0dffeafe3489`](https://github.com/garatnic/sample/commit/52fe7fedb94556ffa29bbd47c07e0dffeafe3489)。討伐、成長、HUD、宿、復帰ハンドラーをNodeで確認。熟練度はDEV-014で扱う。

- [x] DEV-033 フィールド全域でスワイプ移動。固定スティックを削除し、指を離すと停止する。関連 CUR-INPUT-002、CUR-UI-001/005、SYSTEM-008。
  - 2026-11-26 ver.6 実装 [`e280e4d4b037f3612c69d4666481939eafeca6c4`](https://github.com/garatnic/sample/commit/e280e4d4b037f3612c69d4666481939eafeca6c4)。Nodeで移動入力と解除、キーボード併用を確認。

- [x] DEV-034 素手の通常攻撃を接触距離まで短縮。関連 CUR-COMBAT-003/004/005、COMBAT-001。射程内外、敵の接近、討伐報酬を確認する。武器別射程は OPEN-041。
  - 2026-11-26 ver.7 実装 [`fca7186223acf76a114f58303c18072a9b579218`](https://github.com/garatnic/sample/commit/fca7186223acf76a114f58303c18072a9b579218)。Nodeで射程境界、接近と討伐、経験値・硬貨を確認。

- [x] DEV-035 武器屋・武器装備・容量無制限の所持品。購入、残高不足、装備・解除、戦闘と復帰を検証。関連 ITEM-001/003、ECONOMY-007/008、OPEN-041。
  - 2026-11-26 ver.8 [`f3954fde0dbe8b8453b53d3321d46623df6d8da8`](https://github.com/garatnic/sample/commit/f3954fde0dbe8b8453b53d3321d46623df6d8da8)。Nodeで購入、残高不足、1000個の所持、装備・解除のUIイベント、射程とダメージ、入口への接近を確認。スマホ実機は未検証。

- [x] DEV-036 装備画面の部位表示と4ステータス。関連 CUR-ITEM-001、CUR-UI-005、ITEM-008、SYSTEM-006。
  - 2026-11-26 ver.9 [`e590549d7b9cbb24a58d9533961c413a3451d3bd`](https://github.com/garatnic/sample/commit/e590549d7b9cbb24a58d9533961c413a3451d3bd)。HTMLの部位枠・4項目、JS構文、CSS版を検証。スマホ実機は未検証。

- [x] DEV-037 左上HUDの折りたたみ。初期状態はHP・MPのみ、アイコンで詳細を開閉。関連 CUR-UI-001、SYSTEM-009。
  - 2026-11-26 ver.10 [`0c67242591d865d91edc11a09f66a79e375e6f40`](https://github.com/garatnic/sample/commit/0c67242591d865d91edc11a09f66a79e375e6f40)。初期状態と開閉イベントを確認。

- [x] DEV-038 防具・装備品屋・部位別タブ。全種類を初期表示し、防御力を被ダメージに反映する。関連 CUR-SHOP-001、CUR-ITEM-001/002、CUR-COMBAT-004、ITEM-001/008。
  - 2026-11-26 ver.11 [`16f8b05f283584c439b7071c4cb8e136117c0429`](https://github.com/garatnic/sample/commit/16f8b05f283584c439b7071c4cb8e136117c0429)。購入・交換・解除・戦闘計算を検証。

- [x] DEV-039 指輪の装備枠を2つにする。枠ごとの着脱、所持数制限、指輪タブ、既存装備の回帰を確認する。関連 CUR-ITEM-001/002、CUR-SHOP-001、ITEM-008。
  - 2026-11-26 ver.12 [1db72d245d4bd49c162802f6e4e4deb1687423d9](https://github.com/garatnic/sample/commit/1db72d245d4bd49c162802f6e4e4deb1687423d9)。2枠の同時装備、数量制限、個別解除、指輪タブ、武器・防具の回帰を確認。

- [x] DEV-040 武器ジャンル別の攻撃間隔と槌。素手・各武器の連続攻撃、個別値の優先、槌の購入と装備、既存防具を確認する。関連 CUR-COMBAT-005、CUR-SHOP-001、CUR-ITEM-001/002、ITEM-001。
  - 2026-11-26 ver.13 [dc9fb7d5c55cc94c14a68662340605ed2b83e452](https://github.com/garatnic/sample/commit/dc9fb7d5c55cc94c14a68662340605ed2b83e452)。素手と武器の連続攻撃、個別値の優先、槌の購入・装備、防具と指輪の回帰をNodeで確認。

- [x] DEV-041 弱い野外敵4種。8地点・各1体の出現と再出現、種別の能力・描画、戦闘と報酬の回帰を確認する。関連 CUR-COMBAT-001/003/004/006、CUR-UI-004、COMBAT-002、ECO-001。
  - 2026-11-26 ver.14 [34ce7f3fa96bb875c927ee01236f5be70f96828a](https://github.com/garatnic/sample/commit/34ce7f3fa96bb875c927ee01236f5be70f96828a)。8体・4種、戦闘・報酬・再出現、HPバー描画を確認。

- [x] DEV-042 共通の物理ダメージ式、敵防御、防具の実防御表示、敵味方別の与ダメージ倍率。双方の適用と軽減上限を確認。関連 CUR-COMBAT-004/005、CUR-ITEM-002、COMBAT-003、ITEM-001。
  - 2026-11-26 ver.15 [0ad251107ddd1683c58fb547c47c0ab417796b2d](https://github.com/garatnic/sample/commit/0ad251107ddd1683c58fb547c47c0ab417796b2d)。共通式、軽減上限、実防御、倍率の適用をNodeで確認。

- [x] DEV-043 道具屋と店別の買取。入口、分類タブ、購入・売却、取扱外・所持数・残高チェックを検証する。関連 CUR-WORLD-004、CUR-SHOP-001、CUR-ITEM-001/002、ECONOMY-007/008、ITEM-009。
  - 2026-11-26 ver.16 [21f98777ee44cc584725b6b17593e4bea36d5a54](https://github.com/garatnic/sample/commit/21f98777ee44cc584725b6b17593e4bea36d5a54)。分類、取引、残高、装備保護をNodeで確認。

- [x] DEV-044 店の入口で停止する不具合。入口から両店を開け、開店処理失敗時も移動に戻れることを確認する。関連 CUR-SYS-003、CUR-SHOP-001/002/003。
  - 2026-11-26 ver.17 [1b7da0543a1736b153fc77b75243831be106d86b](https://github.com/garatnic/sample/commit/1b7da0543a1736b153fc77b75243831be106d86b)。両店の入口からの開店、商品表示、失敗後の再入店を確認。

- [x] DEV-045 両店の商品名を押すと取引詳細を開く。購入・売却と分類の回帰を確認する。関連 CUR-SHOP-001/002/003。
  - 2026-11-26 ver.18 [ad59c0fd7ecfec204571c1d1776fbeceea9f3569](https://github.com/garatnic/sample/commit/ad59c0fd7ecfec204571c1d1776fbeceea9f3569)。両店の詳細、分類、購入・売却を確認。

- [x] DEV-046 両店の一覧に品名と価格を表示し、詳細を閉じたまま売買できるようにする。関連 CUR-SHOP-001/002/003。
  - 2026-11-26 ver.19 [9279d6aea6149a333c9deb68ac768c970e4de1c3](https://github.com/garatnic/sample/commit/9279d6aea6149a333c9deb68ac768c970e4de1c3)。両店で詳細を開かず売買できることを確認。

- [x] DEV-047 道具の使用効果。回復上限、消費数、毒の次回攻撃適用を検証する。関連 CUR-ITEM-001/002、CUR-COMBAT-005、COMBAT-001。
  - 2026-11-26 ver.20 [435b36c918522fd1d825dac6c838cd1f88583389](https://github.com/garatnic/sample/commit/435b36c918522fd1d825dac6c838cd1f88583389)。消費・回復上限・毒の適用を確認。

- [x] DEV-048 冒険者ギルドと討伐依頼5件。入口、受注上限、戦闘からの進捗、報告と報酬、クエストウィンドウを確認する。関連 CUR-COMBAT-006、QUEST-002/005。
  - 2026-11-27 ver.21 [628148e1847fdb9ddc2da090788264503a7904b3](https://github.com/garatnic/sample/commit/628148e1847fdb9ddc2da090788264503a7904b3)。入口、受注、討伐、報告、報酬、一覧を確認。

- [x] DEV-049 商店一覧の所持数と装備枠の状態表示。売買・装着・解除後の表示を確認する。関連 CUR-SHOP-003、CUR-ITEM-002。
  - 2026-11-27 ver.22 [d9698a94dffe64729027274c6cf7c6b6499ecaa1](https://github.com/garatnic/sample/commit/d9698a94dffe64729027274c6cf7c6b6499ecaa1)。所持数と装備状態の更新を確認。

- [x] DEV-050 商店は未所持数を非表示とし、右上にゲーム内年月日・曜日・時刻を表示する。関連 CUR-SHOP-003、CUR-SYS-003、SYSTEM-002。
  - 2026-11-27 ver.23 [6b509681f8cfe2757cc830124029a8d4187b9c74](https://github.com/garatnic/sample/commit/6b509681f8cfe2757cc830124029a8d4187b9c74)。時計の初期値、日・月・年の繰り上げを確認。

- [x] DEV-051 ギルド別に5枠を開いた日付で更新し、受注中の依頼を保持する。個人上限を撤廃。関連 CUR-QUEST-001/002、CUR-SYS-005、QUEST-002/005。
  - 2026-11-27 ver.24 [129acb34908a26c11476d45d55d72e9c48389f3c](https://github.com/garatnic/sample/commit/129acb34908a26c11476d45d55d72e9c48389f3c)。独立更新、日付境界、持越しと個人上限撤廃を確認。

- [x] DEV-052 非人型の素材ドロップ、拾得、道具屋の素材買取。関連 CUR-COMBAT-007、CUR-SHOP-003、ITEM-006。
  - 2026-11-27 ver.25 [71e37b9985fe3330988700d704720da10652eb41](https://github.com/garatnic/sample/commit/71e37b9985fe3330988700d704720da10652eb41)。撃破、素材拾得、換金、上限を確認。

- [x] DEV-053 装備と道具の表示を分離し、ギルドに低難度の収集依頼を追加する。関連 CUR-ITEM-002/003、CUR-QUEST-001/002、QUEST-002/005。
  - 2026-11-27 ver.26 [5c02f0affa716f7c39fa0eb2603808241f9781fb](https://github.com/garatnic/sample/commit/5c02f0affa716f7c39fa0eb2603808241f9781fb)。候補範囲、更新、納品、表示分離を確認。

- [x] DEV-054 果樹を生成し、接触採取・枯渇表示・日付更新での補充を実装する。関連 CUR-WORLD-005、CUR-SYS-005、ECO-008、EXPLORE-006。

  - 2026-11-27 ver.27 [5e392413ad7bbe04d991fc8f8b5e7a9ac7a620ba](https://github.com/garatnic/sample/commit/5e392413ad7bbe04d991fc8f8b5e7a9ac7a620ba)。配置、採取、枯渇、日次補充をNodeで確認。端末実機は未確認。

- [x] DEV-055 採取できる果樹をマップ全体で5本に減らす。関連 CUR-WORLD-005。採取・枯渇・日次補充も確認する。

  - ver.28 [37d114337509006f706980e7a06fff16ee6e7b37](https://github.com/garatnic/sample/commit/37d114337509006f706980e7a06fff16ee6e7b37)。5本の配置、採取、枯渇、日次補充を確認。

- [x] DEV-056 セーブ・ロード機能を実装する。[セーブ・ロード機能仕様書](../specifications/SAVE_LOAD_SPECIFICATION.md)に従い、PC・スマートフォンでIndexedDBの単一枠に保存・復元する。手動・自動保存、保存禁止条件、保存失敗時の既存データ保持、JSONのエクスポート・インポート、確認付き削除を確認する。関連 SYSTEM-011、CUR-SYS-004。
  - ver.31 [aeba7fca18c61d791665565467037f17f5cd317e](https://github.com/garatnic/sample/commit/aeba7fca18c61d791665565467037f17f5cd317e)。PC版Chromiumの実IndexedDBで、手動保存・読み込み、装備・果樹・別マップ戦利品の復元、宿泊・洞窟往復のオートセーブ、戦闘制限、トランザクション中断時の旧データ保持、JSON書き出し・正常/不正取り込み、削除確認の取消・実行、起動時復元と削除後の初期起動を確認。スマートフォン実機は未確認。

- [ ] DEV-057 緊急脱出機能を追加する。地形への埋没などの移動不能から、セーブデータを巻き戻さずに復帰できることを確認する。詳細仕様は未確定。[セーブ・ロード機能仕様書の第10節](../specifications/SAVE_LOAD_SPECIFICATION.md#10-緊急脱出機能との関係)を参照。

- [x] DEV-058 開発管理資料の整合性監査と完了条件の強化。現行仕様とコード、双方向索引、ID、テスト登録、ゲーム実装履歴、進捗を照合する。

  - 2026-11-27 [314d87a09ffa9402882fa0dcf28955dcaab77019](https://github.com/garatnic/sample/commit/314d87a09ffa9402882fa0dcf28955dcaab77019)。現行仕様39件、実装ファイル18件、履歴28件を静的に照合。ゲームの実行検証は今回未実施。

- [x] DEV-059 固定1チャンクの洞窟、入口と出口、フィールドと独立した敵配置を実装する。関連 CUR-WORLD-006、EXPLORE-002。往復と戦闘、マップ別状態、死亡復帰を確認する。
  - ver.29 [6ce2ec496d99a05c1b31d7021572c53a6448e8bf](https://github.com/garatnic/sample/commit/6ce2ec496d99a05c1b31d7021572c53a6448e8bf)。Nodeの模擬DOMで往復、マップ別の敵・戦利品と再出現待ち、戦闘・素材拾得・経験値、外周制限、死亡復帰、宿の接触を確認。端末実機は未検証。
- [ ] DEV-060 ダンジョンの動的生成、複数階層、ボスを実装する。関連 DEV-012、DEV-018、EXPLORE-002。生成と階層間移動、ボス遭遇を確認する。攻略後の世界変化・永続化は EXPLORE-003 と DEV-056 の進捗を確認する。

- [x] DEV-061 宿泊成立で翌日06:00に進める。関連 DEV-028、CUR-INN-002、CUR-SYS-005、SYSTEM-003。承諾・取消・料金不足と暦境界を確認する。
  - ver.30 [88b1d3e230933dc30a276fe5e369234182d35044](https://github.com/garatnic/sample/commit/88b1d3e230933dc30a276fe5e369234182d35044)。Nodeの模擬DOMで宿泊成功・取消・料金不足、HP、連泊、果樹補充、通常時計の再開、年末の繰り上がりを確認。ブラウザ・端末実機は未検証。

- [x] DEV-062 18技能一覧・片手武器の命中と補正・技能経由のキャラクター成長・旧セーブ移行を実装し、成長・保存・画面・戦闘を検証する。関連 DEV-014、CUR-GROWTH-001、CUR-SYS-004。

  - ver.32 [da3d85ac9c98fb98dfaee1191af71cd0ca01b092](https://github.com/garatnic/sample/commit/da3d85ac9c98fb98dfaee1191af71cd0ca01b092)。SKILL-01〜04 合格。
- [ ] DEV-063 残り16技能を個別に設計・実装する（DEV-014）。戦闘：弓術・防御・重装・鍛冶。魔法：破壊・回復・召喚・幻惑・変性・付呪。隠密：隠密・開錠・スリ・話術・軽装・錬金術。各技能の条件・効果・保存・キャラクターXPを確認する。
- [ ] DEV-064 パークポイント・技能別ツリー・前提条件・取得効果・保存を実装する（DEV-014）。基礎ステータス強化やNPCへの適用は詳細を決めてから着手する。

- [x] DEV-065 新規ゲームで鉄の短剣を1本所持・装備して開始する。既存セーブと戦闘不能後の装備保持を確認する。関連 CUR-SYS-002、CUR-ITEM-001。

  - ver.33 [57be0a26fafd8ff19bc45b4642e44429df4381e3](https://github.com/garatnic/sample/commit/57be0a26fafd8ff19bc45b4642e44429df4381e3)。既存テスト4件が合格。Nodeの模擬DOMで新規所持・装備、保存復元、既存の素手セーブと戦闘不能後の装備保持を確認。

- [x] DEV-066 世界シミュレーション Phase 1。256×256フィールド、2国家、個体住民、採集・運搬・建築・日次消費、距離切替、国家情報、セーブ移行を実装する。旧機能と上限・満杯時の挙動を検証する。関連 WORLD-001/002/003/006/008、NPC-001、ECO-008、HOUSING-001/002/006、SOCIETY-005、SYSTEM-011/012/013/014、CUR-WORLD-001〜004、CUR-SYS-003〜005。

  - ver.34 [07327469ed6b40689e348c604f38752b99362da4](https://github.com/garatnic/sample/commit/07327469ed6b40689e348c604f38752b99362da4)。保存済み自動テスト8件合格。公開版の結果と残る端末確認は DEV-067。

- [ ] DEV-067 世界 Phase 1の端末検証。公開ブラウザで第二国家の戸口まで移動して建物・住民を目視し、スマートフォン実機で国家画面、タッチ移動、保存を確認する。
  - 公開版Chromiumで ver.34、両国の初期値、第一国家の宿泊後に遠方の第二国家も人口40・民家20・倉庫4になること、再読み込みで翌朝の時刻を復元すること、装備品屋と戦闘が動くことを確認した。Nodeの単発確認では発展後の第二国家の戸口まで通常の移動・衝突処理で到達し、近距離への切替、25棟、住民40人の描画座標を確認した。
- [ ] DEV-068 世界シミュレーション Phase 1以降の拡張。ランダム生成とシード保存、3段階処理、複数都市、住民ライフサイクル、産業と物流、外交・戦争・交易を各分野の目標仕様・未決事項から着手順に分解する。

- [x] DEV-069 両国に宿・道具屋・装備品屋・ギルドを配置し、旧施設区の撤去、新規開始地点、旧セーブ互換と施設の独立動作を確認する。関連 CUR-WORLD-002〜004、CUR-INN-001、CUR-QUEST-001、CUR-SHOP-001〜003、CUR-SYS-004。

  - ver.35 [34aa05bb376d858b09ab756bc1426125bd04eee6](https://github.com/garatnic/sample/commit/34aa05bb376d858b09ab756bc1426125bd04eee6)。Nodeの保存済み自動テスト9件合格。

- [x] DEV-070 果樹と伐採木を住民・プレイヤーで共有する。競合、復活、入手品とセーブ互換を検証する。関連 CUR-WORLD-005、CUR-NATION-002、CUR-SYS-004。

  - ver.36 [bfff84c6835aa9ac5cd4df532325c7798ddbc9fd](https://github.com/garatnic/sample/commit/bfff84c6835aa9ac5cd4df532325c7798ddbc9fd)。Nodeの保存済み自動テスト10件合格。

- [x] DEV-071 プレイヤーの採集を1個ずつに変更し、1本8個の共有残量・再生・保存を検証する。関連 CUR-WORLD-005、CUR-NATION-002、CUR-SYS-004。

  - ver.37 [4bf43ef131bf37dda3fcbefca24643fc740c3faa](https://github.com/garatnic/sample/commit/4bf43ef131bf37dda3fcbefca24643fc740c3faa)。Nodeの保存済み自動テスト10件合格。

- [x] DEV-072 住民の採集を到着後1個ずつに変更し、共有残量と途中保存を確認する。関連 CUR-NATION-002、CUR-WORLD-005、CUR-SYS-004。

  - ver.38 [e7f651e0687053560f412bb66bcead85ae55cfaa](https://github.com/garatnic/sample/commit/e7f651e0687053560f412bb66bcead85ae55cfaa)。Nodeの保存済み自動テスト10件合格。

- [x] DEV-073 非敵性のシカ・ウサギ・キツネと逃走、狩猟、素材、セーブ互換。関連 CUR-COMBAT-001〜007、CUR-SYS-004、ECO-005/007。

  - ver.39 [c4e6d799463c5259644caed98358cf9a45a18f3a](https://github.com/garatnic/sample/commit/c4e6d799463c5259644caed98358cf9a45a18f3a)。Nodeの自動テスト11件合格。

- [x] DEV-074 チャンク発生・徘徊・住民戦闘・保存移行を実装する。関連 CUR-WORLD-001、CUR-COMBAT-001〜006、CUR-NATION-002、CUR-SYS-004、ECO-001/005/007。個体数上限・宿泊・画面外・セーブ往復を検証する。

  - ver.41 [c2e06e3b81e3459555f56efbef2dbdb64b8817e3](https://github.com/garatnic/sample/commit/c2e06e3b81e3459555f56efbef2dbdb64b8817e3)。自動テスト15件とゲーム内7日のシミュレーション。実機負荷・長期調整は DEV-076。

- [x] DEV-075 狩猟開始後の自動追撃、動物HPバーとメニューの狩猟ボタン削除。関連 CUR-COMBAT-005、CUR-SYS-004、CUR-UI-001/004。

  - ver.40 [1f3570001db141629b087271ec0aab98ff0928fb](https://github.com/garatnic/sample/commit/1f3570001db141629b087271ec0aab98ff0928fb)。Nodeの自動テスト11件合格。

- [ ] DEV-076 フィールドMOBの地域密度、宿泊時の処理時間、住民戦闘の長期バランスをスマートフォン実機と複数条件で測定する。空き住宅への住民補充の扱いを OPEN_QUESTIONS と照合する。関連 CUR-WORLD-007、CUR-COMBAT-001〜003。

- [x] DEV-077 タップ狩猟と現在地付き世界地図を実装する。関連 CUR-INPUT-002、CUR-COMBAT-005、EXPLORE-001。タップとスワイプの区別、射程、地図開示と保存を検証する。
  - ver.42。実装コミットは CHANGELOG を参照。

- [x] DEV-078 タップ時に距離にかかわらず狩猟対象へ指定し、接近時に自動攻撃する。関連 CUR-INPUT-002、CUR-COMBAT-005、CUR-SYS-004。射程外指定、攻撃待ち、接近後の攻撃を検証する。
  - ver.43。SKILL-06で指定、射程、攻撃待ち、接近後の初撃を確認。

- [x] DEV-079 商店ごとの在庫・日次精算・保存を実装する。関連 CUR-SHOP-001〜003、CUR-SYS-004/005、ECONOMY-007/008。
  - ver.44。NATION-07で売買・精算・セーブの互換性を確認。

- [x] DEV-080 住民の役割・行動分散、二資源備蓄、国家財政と商店精算を統合する。関連 CUR-NATION-002〜005、CUR-SHOP-004、CUR-SYS-004/005。
  - ver.45 [90444a0ce5401726f17af780bb2937c47878eb23](https://github.com/garatnic/sample/commit/90444a0ce5401726f17af780bb2937c47878eb23)。自動テスト22件と、野外MOBを含む30日・100日運転を確認。公開ブラウザで ver.45 と国家画面を確認。

- [ ] DEV-081 スマートフォン実機での国家画面・宿泊負荷、余剰換金と専属職の長期バランスを確認する。測定結果はDEV-076および未決事項と併せて管理する。

- [x] DEV-082 形式10以前から移行した待機者が最初の進行で仕事を選ぶようにする。関連 CUR-SYS-004、CUR-NATION-002。
  - ver.46 [修正コミット](https://github.com/garatnic/sample/commit/a26360910883697865be9fa8d73cac43d3dd0915)。ECON-04で、翌日まで待つ旧保存状態を即時に再保存しても、仕事が次の進行で始まることを確認。

- [x] DEV-083 必要倉庫容量と建設用木材を見直す。関連 CUR-NATION-002〜005。人口別境界、満杯からの回復、着工・完成・セーブ互換、公開を確認する。

  - ver.47 [29e208c8482b1c3ef93bd251195d39f7f50e71b6](https://github.com/garatnic/sample/commit/29e208c8482b1c3ef93bd251195d39f7f50e71b6)。自動テスト24件合格。ECON-06/07で容量、満杯からの回復、日次処理と復元を確認。NATION-02で100日後に各国人口40人、民家20軒、倉庫4軒。

- [x] DEV-084 両手武器の命中XPを実装する。関連 CUR-GROWTH-001〜003、CUR-SYS-004。

  - ver.48 [a43636a7fe58b8ef4d1301d911efaf88368ac63b](https://github.com/garatnic/sample/commit/a43636a7fe58b8ef4d1301d911efaf88368ac63b)。SKILL-07と既存テストで命中XP、技能上昇、セーブ復元を確認。

- [x] DEV-085 盗賊の出現と装備・貨幣ドロップを追加する。関連 CUR-WORLD-007、CUR-COMBAT-006/007、CUR-SYS-004。

  - ver.49 [11052d23320e57df6f3fdb7134c878b5fab222f3](https://github.com/garatnic/sample/commit/11052d23320e57df6f3fdb7134c878b5fab222f3)。MOB-05で出現・抽選・撃破・拾得・保存を確認。

- [x] DEV-086 民家定員1人、消費2個、消費量ベースの倉庫計算と旧セーブ移行を確認する。関連 CUR-NATION-001〜005、CUR-SYS-004。

  - ver.50 [4050fadb347559b59aaef2c4a05e3eeab61c18a7](https://github.com/garatnic/sample/commit/4050fadb347559b59aaef2c4a05e3eeab61c18a7)。27件合格。日次消費、備蓄容量、建築中の旧保存の移行と100日の国家進行を確認。

- [x] DEV-087 フィールドMOBを約20%に削減し、地域別発生比率・再POP上限・新規セーブ往復を検証する。関連 CUR-WORLD-007、CUR-COMBAT-001/006、CUR-SYS-004。

  - ver.51 [758dd354599091d8c81947d3132d9eaa9845c476](https://github.com/garatnic/sample/commit/758dd354599091d8c81947d3132d9eaa9845c476)。MOB-01/04/06 と6シードの2ゲーム日試行。実機での長期検証は DEV-076。

- [x] DEV-088 旧セーブ移行処理の棚卸し、依存分析、削除計画（今回のPhase 1〜3）。関連 CUR-SYS-004、SYSTEM-011。
  - [調査報告書](LEGACY_SAVE_AUDIT.md)と[削除実施計画](LEGACY_SAVE_REMOVAL_PLAN.md)を保存。150ファイルを対象に静的確認。形式12の旧高密度MOBの読込上限も記録。ゲーム・テストは未変更。

- [x] DEV-089 旧セーブ専用コードとテストを整理し、現行保存・復元の回帰検証と資料・公開を行う（今回のPhase 4〜6）。形式13、ver.52。Node 28件、Chromiumと実IndexedDBで起動・保存・復元・失敗時の枠保護を確認。関連 CUR-SYS-004、SYSTEM-011。[削除実施計画](LEGACY_SAVE_REMOVAL_PLAN.md)を参照。

## 登録漏れの確認
分野別項目と個別作業を登録済み。目標仕様全体の個別TODO対応は未確認。着手時およびPhase移行時に照合し、必要な項目を追加する。

## Phase 2 — 国家経済・国際交易・自由民
目標仕様：[TRADE-001〜006](../specifications/TRADE_FREE_PEOPLE_SPECIFICATION.md)。既存の世界・経済・NPC関連TODOを置換しない。
- [x] DEV-090 工程1：三国・交易所・特産品・住民加工・国庫改修。関連 TRADE-001〜003、CUR-NATION-001〜006、CUR-SHOP-004/005、CUR-WORLD-001〜005/007、CUR-SYS-004/005。依存 DEV-066、080、089。三国間売買、余剰保護、予約、在庫、日次収支、遠景、保存、回帰検証を完了する。ver.53の実装・Node 32件・100ゲーム日2条件を確認済み。公開版の起動・国家画面、Chromiumの売買・保存・宿泊・狭幅タッチ操作を確認。スマートフォン実機は未検証。
- [ ] DEV-091 工程2：行商人。TRADE-004、依存090。永続個体の利益判断・移動・実売買を検証。
- [x] DEV-092 工程3：冒険者。TRADE-005。交易と独立。狩猟・戦闘・戦利品売却・永続個体を検証。
- [x] DEV-093 工程4：冒険者成長・装備更新。TRADE-005、依存092。プレイヤー共通成長と固定武器カテゴリを検証。
- [ ] DEV-094 工程5：護衛雇用。TRADE-006、依存091・092・093。実在個体の契約・同行・報酬・終了を検証。
- [ ] DEV-095 工程6：住民の自由民転向。TRADE-006、依存091・092。人口・住宅・予約・個体の整合を検証。

- [x] DEV-096 商店・交易所の商品名に在庫数と所持数を併記し、売買後に更新する。関連 CUR-SHOP-001〜003、CUR-SHOP-005。既存32件と模擬DOMの売買・交易表示を確認。

- [x] DEV-097 三国の市街路を共通の辻で接続する。関連 CUR-WORLD-003。地形・衝突判定で街道の連続性、既存MOBと保存の回帰を確認する。NATION-01と全32件合格。

- [x] DEV-098 冒険者の行動判断と移動を分離。共通衝突処理と通常フレーム移動、追跡・退却・拾得・売買・宿泊を確認。CUR-ADV-001、ADV-03/04、全36件合格。

## 全ソースコードの棚卸しと整理

- [x] DEV-099 現行の全ソースコード棚卸しと個別検証。45件調査、Node 36件・ChromiumのPC/狭幅確認。 [調査報告](SOURCE_CODE_AUDIT.md)
- [x] DEV-100 未使用部分の削除（A01〜03・A05〜06）。Node 36件合格。ver.58。
- [x] DEV-101 旧採集時間の削除（A04）。Node 36件合格。ver.59。
- [x] DEV-102 重複 import・CSS・フレーム内時計を整理（B01〜03）。B04は売買の条件と更新先を明示する現行処理を維持するため見送り。Node 36件合格。ver.60。
- [ ] DEV-103 国家復元の次回イベント計算を再利用（B05実施済み、ver.61）。Node 36件合格。D01〜05は仕様・保存・テストへの影響を避けるため保留。工程は部分実施として管理する。
- [x] DEV-104 C01〜07の実測・採否判断・回帰検証（工程5、ver.62 / 形式15）。C01〜04・C06を実施、C05は見送り、C07は規模拡大時まで保留。Node 37件合格。対象はCUR-MOVE-002、CUR-ADV-001、CUR-WORLD-003/007、CUR-UI-001/003/006、CUR-SYS-003、CUR-NATION-005/006、CUR-SHOP-004/005。[条件・測定値・引き継ぎ](SOURCE_CODE_AUDIT.md#dev-104-処理負荷の測定と実施結果)。
- [ ] DEV-105 各工程の後に全体回帰・資料整合・公開を確認（工程6）。
- 工程の詳細は [コード整理計画](SOURCE_CODE_CLEANUP_PLAN.md)。
