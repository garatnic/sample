# 矛盾・保留・要確認事項

v6.3の5設問はユーザー判断により保留。実装時に判断を要する場合のみ確認する。ほかの項目も根拠のない決定を置かず、確認結果を履歴と関連仕様へ反映する。

## OPEN-001 家賃改定提案の年内枠の扱い

暦年1回の枠を両当事者でどのように使い、拒否時に消費するかが未決定。

- 関連仕様 [HOUSING-020](../specifications/11_building_housing.md#housing-020)・[HOUSING-020](../specifications/11_building_housing.md#housing-020)
- 原資料 [v6.3.md Q1](../history/v6.3.md#q1)・[v6.1.md Q2](../history/v6.1.md#q2)・[v6.2.md Q2](../history/v6.2.md#q2)

## OPEN-002 改定提案への回答期限

回答期限と無回答時の契約処理が未決定。

- 関連仕様 [HOUSING-020](../specifications/11_building_housing.md#housing-020)・[HOUSING-020](../specifications/11_building_housing.md#housing-020)
- 原資料 [v6.3.md Q2](../history/v6.3.md#q2)・[v6.1.md Q3](../history/v6.1.md#q3)・[v6.2.md Q1](../history/v6.2.md#q1)

## OPEN-003 改定交渉の合意判定

家賃改定をNPCが受け入れる判定条件が未決定。

- 関連仕様 [HOUSING-020](../specifications/11_building_housing.md#housing-020)・[NPC-011](../specifications/07_npc_ai.md#npc-011)
- 原資料 [v6.3.md Q3](../history/v6.3.md#q3)・[v6.2.md Q1](../history/v6.2.md#q1)・[v2.8.md Q2](../history/v2.8.md#q2)

## OPEN-004 月次支払日が来る前の転居

新家賃の適用前に退去した場合の請求処理が未決定。

- 関連仕様 [HOUSING-020](../specifications/11_building_housing.md#housing-020)・[HOUSING-023](../specifications/11_building_housing.md#housing-023)
- 原資料 [v6.3.md Q4](../history/v6.3.md#q4)・[v6.2.md Q3](../history/v6.2.md#q3)・[v5.7.md Q3](../history/v5.7.md#q3)

## OPEN-005 賃貸契約の交渉履歴の公開範囲

交渉履歴と個人資産の公開範囲が未決定。

- 関連仕様 [HOUSING-020](../specifications/11_building_housing.md#housing-020)・[HOUSING-027](../specifications/11_building_housing.md#housing-027)
- 原資料 [v6.3.md Q5](../history/v6.3.md#q5)・[v6.2.md Q5](../history/v6.2.md#q5)・[v5.9.md Q5](../history/v5.9.md#q5)

## OPEN-006 世界の規模

標準規模は中規模。面積・同時処理人数・設定上限は性能検証後に確定する。

- 関連仕様 [WORLD-003](../specifications/02_world.md#world-003)・[WORLD-007](../specifications/02_world.md#world-007)・[SYSTEM-014](../specifications/15_game_system.md#system-014)
- 原資料 [v0.2.md Q3](../history/v0.2.md#q3)・[v1.9.md Q5](../history/v1.9.md#q5)・[v2.0.md Q4](../history/v2.0.md#q4)

## OPEN-007 ゲーム内時間の進み方

通常速度は現実30分でゲーム1日。安全な場所の判定、待機・長期スキップの上限は要確認。

- 関連仕様 [SYSTEM-002](../specifications/15_game_system.md#system-002)・[SYSTEM-003](../specifications/15_game_system.md#system-003)・[SYSTEM-005](../specifications/15_game_system.md#system-005)
- 原資料 [v0.3.md Q4](../history/v0.3.md#q4)・[v0.4.md Q5](../history/v0.4.md#q5)・[v1.5.md Q5](../history/v1.5.md#q5)

## OPEN-008 領地の管理方法

領地はNPC自動運営を基本とする。プレイヤーが直接操作できる範囲は要確認。

- 関連仕様 [HOUSING-004](../specifications/11_building_housing.md#housing-004)・[HOUSING-004](../specifications/11_building_housing.md#housing-004)
- 原資料 [v1.1.md Q4](../history/v1.1.md#q4)・[v3.0.md Q3](../history/v3.0.md#q3)

## OPEN-009 国家の変化

解決済み。v4.2で反乱・独立を除外し、v4.5「整合性と懸念」で国家の増減を建国・統合・征服・滅亡で表現すると明記した。

- 関連仕様 [NATION-002](../specifications/12_nations_warfare.md#nation-002)・[NATION-006](../specifications/12_nations_warfare.md#nation-006)・[NATION-006](../specifications/12_nations_warfare.md#nation-006)・[NATION-031](../specifications/12_nations_warfare.md#nation-031)
- 原資料 [v1.2.md Q1](../history/v1.2.md#q1)・[v1.2.md Q5](../history/v1.2.md#q5)・[v4.2.md Q4](../history/v4.2.md#q4)・[v4.4.md Q5](../history/v4.4.md#q5)・[v4.5.md](../history/v4.5.md#整合性と懸念)

## OPEN-010 兵士の募集・補充

補給の概念は設けず、国庫・軍事予算は維持する。軍維持費の詳細と戦時徴兵・国庫支出が民間に波及しないための境界は要確認。

- 関連仕様 [NATION-019](../specifications/12_nations_warfare.md#nation-019)・[NATION-024](../specifications/12_nations_warfare.md#nation-024)・[NATION-030](../specifications/12_nations_warfare.md#nation-030)・[NATION-017](../specifications/12_nations_warfare.md#nation-017)
- 原資料 [v4.0.md Q1](../history/v4.0.md#q1)・[v4.1.md Q2](../history/v4.1.md#q2)・[v4.2.md Q3](../history/v4.2.md#q3)・[v3.9.md Q2](../history/v3.9.md#q2)

## OPEN-011 国家の統合

国家統合・建国に必要な数値や閾値は未確定。

- 関連仕様 [NATION-032](../specifications/12_nations_warfare.md#nation-032)・[NATION-032](../specifications/12_nations_warfare.md#nation-032)・[NATION-004](../specifications/12_nations_warfare.md#nation-004)
- 原資料 [v4.3.md Q4](../history/v4.3.md#q4)・[v4.4.md Q2](../history/v4.4.md#q2)・[v4.4.md Q4](../history/v4.4.md#q4)

## OPEN-012 生産品と在庫の管理

初期版は加工品も実在品とする。後続版の直接製造と、独立した加工品・個別工程の関係を確認する。

- 関連仕様 [ECONOMY-004](../specifications/10_economy.md#economy-004)・[ECONOMY-004](../specifications/10_economy.md#economy-004)
- 原資料 [v2.2.md Q1](../history/v2.2.md#q1)・[v3.7.md Q4](../history/v3.7.md#q4)

## OPEN-013 経済バランスの調整

経済破綻の緩和方針は確定。発動の閾値と具体的な手段は未確定。

- 関連仕様 [ECONOMY-014](../specifications/10_economy.md#economy-014)・[NATION-016](../specifications/12_nations_warfare.md#nation-016)
- 原資料 [v3.8.md Q5](../history/v3.8.md#q5)・[v3.9.md Q1](../history/v3.9.md#q1)

## OPEN-014 年代記の記録粒度

日常記録の期間・保存期間と重要度の判定は未確定。

- 関連仕様 [QUEST-001](../specifications/14_quests_history.md#quest-001)・[QUEST-001](../specifications/14_quests_history.md#quest-001)・[QUEST-001](../specifications/14_quests_history.md#quest-001)
- 原資料 [v4.7.md Q5](../history/v4.7.md#q5)・[v4.8.md Q5](../history/v4.8.md#q5)・[v4.9.md Q5](../history/v4.9.md#q5)

## OPEN-015 移住先の住居と仕事

移住後の自律求職は確定。職を得るまでの時間や求職の再試行、宅地がないときの移住処理の詳細は要確認。

- 関連仕様 [NPC-012](../specifications/07_npc_ai.md#npc-012)・[NPC-012](../specifications/07_npc_ai.md#npc-012)・[HOUSING-008](../specifications/11_building_housing.md#housing-008)
- 原資料 [v4.8.md Q2](../history/v4.8.md#q2)・[v4.9.md Q2](../history/v4.9.md#q2)・[v5.4.md Q5](../history/v5.4.md#q5)

## OPEN-016 魔物の巣

初期の固定配置・種別別生息地域と、後続版の生息域や巣の移動をどう両立するか確認する。増減、移動速度、発生確率の数値も未確定。

- 関連仕様 [ECO-002](../specifications/09_ecosystem.md#eco-002)・[ECO-002](../specifications/09_ecosystem.md#eco-002)・[ECO-007](../specifications/09_ecosystem.md#eco-007)・[ECO-010](../specifications/09_ecosystem.md#eco-010)
- 原資料 [v0.8.md Q2](../history/v0.8.md#q2)・[v2.6.md Q2](../history/v2.6.md#q2)・[v3.6.md Q3](../history/v3.6.md#q3)・[v6.5.md Q1](../history/v6.5.md#q1)

## OPEN-017 世界が変わった後の再探索

地域の再訪更新周期、ダンジョンの再占拠条件と頻度は要確認。

- 関連仕様 [EXPLORE-010](../specifications/03_exploration.md#explore-010)・[EXPLORE-003](../specifications/03_exploration.md#explore-003)
- 原資料 [v6.5.md Q3](../history/v6.5.md#q3)・[v6.7.md Q2](../history/v6.7.md#q2)

## OPEN-018 高速移動

高速移動の具体的な方法・利用条件は実装時確認。

- 関連仕様 [EXPLORE-005](../specifications/03_exploration.md#explore-005)・[EXPLORE-005](../specifications/03_exploration.md#explore-005)
- 原資料 [v1.5.md Q2](../history/v1.5.md#q2)・[v6.7.md Q1](../history/v6.7.md#q1)

## OPEN-019 探索情報の広まり方

プレイヤーの現地接近による発見とNPCへの即時共有は確定。発見判定の具体条件・内部処理、NPC自身の発見からプレイヤーへの共有は要確認。

- 関連仕様 [NPC-009](../specifications/07_npc_ai.md#npc-009)・[EXPLORE-007](../specifications/03_exploration.md#explore-007)・[EXPLORE-014](../specifications/03_exploration.md#explore-014)
- 原資料 [v6.6.md Q1](../history/v6.6.md#q1)・[v7.0.md Q3](../history/v7.0.md#q3)・[v7.1.md Q1](../history/v7.1.md#q1)

## OPEN-020 大きな世界の変化への参加方法

事件ごとの介入条件と開拓地・拠点の価値計算は実装時確認。

- 関連仕様 [GAME-004](../specifications/01_game_overview.md#game-004)・[HOUSING-028](../specifications/11_building_housing.md#housing-028)
- 原資料 [v6.6.md Q2](../history/v6.6.md#q2)・[v6.6.md Q3](../history/v6.6.md#q3)

## OPEN-021 NPCのクエスト参加

受注済み依頼は条件を維持する。NPCの受注・先行確保や世界の変化と衝突するときの内部整合処理は要確認。

- 関連仕様 [QUEST-003](../specifications/14_quests_history.md#quest-003)・[QUEST-004](../specifications/14_quests_history.md#quest-004)・[QUEST-011](../specifications/14_quests_history.md#quest-011)・[EXPLORE-016](../specifications/03_exploration.md#explore-016)
- 原資料 [v1.4.md Q2](../history/v1.4.md#q2)・[v1.4.md Q3](../history/v1.4.md#q3)・[v6.8.md Q3](../history/v6.8.md#q3)・[v7.1.md Q3](../history/v7.1.md#q3)

## OPEN-022 地域の危険度

敵の強さのばらつき、危険度、逃走判定、非戦闘技能の成長率の数値は実装時確認。

- 関連仕様 [ECO-004](../specifications/09_ecosystem.md#eco-004)・[COMBAT-002](../specifications/04_combat.md#combat-002)・[EXPLORE-011](../specifications/03_exploration.md#explore-011)・[GROWTH-011](../specifications/05_character_growth.md#growth-011)
- 原資料 [v0.8.md Q5](../history/v0.8.md#q5)・[v6.9.md Q1](../history/v6.9.md#q1)・[v6.9.md Q2](../history/v6.9.md#q2)・[v6.9.md Q3](../history/v6.9.md#q3)

## OPEN-023 探索中の環境障害

イベント・ダンジョンの障害条件と、隠密・交渉・迂回・仕掛けの具体判定は実装時確認。

- 関連仕様 [EXPLORE-012](../specifications/03_exploration.md#explore-012)・[EXPLORE-013](../specifications/03_exploration.md#explore-013)
- 原資料 [v7.0.md Q1](../history/v7.0.md#q1)・[v7.0.md Q2](../history/v7.0.md#q2)

## OPEN-024 財宝・資源の再配置

通常の宝箱・資源の再出現と、争奪される固有遺物・知識の再出現・所有権・取引の細部は実装時確認。

- 関連仕様 [EXPLORE-006](../specifications/03_exploration.md#explore-006)・[EXPLORE-015](../specifications/03_exploration.md#explore-015)・[EXPLORE-016](../specifications/03_exploration.md#explore-016)
- 原資料 [v2.6.md Q3](../history/v2.6.md#q3)・[v7.1.md Q2](../history/v7.1.md#q2)・[v7.1.md Q3](../history/v7.1.md#q3)

## OPEN-025 NPC冒険者とプレイヤーの競争・協力

非同行NPC冒険者との競争の具体処理、知識で解放する項目、名声の計算・表示は実装時確認。

- 関連仕様 [EXPLORE-014](../specifications/03_exploration.md#explore-014)・[EXPLORE-017](../specifications/03_exploration.md#explore-017)・[SOCIETY-016](../specifications/13_population_society.md#society-016)
- 原資料 [v7.2.md Q1](../history/v7.2.md#q1)・[v7.2.md Q2](../history/v7.2.md#q2)・[v7.2.md Q3](../history/v7.2.md#q3)

## OPEN-026 クエスト報酬

世界状況から独立して生成する依頼と、依頼主の実在財産からの支払いを両立する条件は要確認。

- 関連仕様 [QUEST-005](../specifications/14_quests_history.md#quest-005)・[QUEST-002](../specifications/14_quests_history.md#quest-002)
- 原資料 [v1.4.md Q4](../history/v1.4.md#q4)・[v6.8.md Q1](../history/v6.8.md#q1)

## OPEN-027 戦闘中の回復薬

回復薬は手動使用。自動化の有無と設定条件は別途検討。

- 関連仕様 [COMBAT-001](../specifications/04_combat.md#combat-001)
- 原資料 [v0.7.md](../history/v0.7.md#2-半自動戦闘の基本構造)

## OPEN-028 仲間の戦闘不能からの復帰

永久死亡保護は同行・雇用中に適用する。戦闘不能からの復帰方法は未確定。

- 関連仕様 [GROUP-002](../specifications/08_companions_guilds.md#group-002)
- 原資料 [v0.8.md](../history/v0.8.md#1-v07で確定した戦闘仕様)

## OPEN-029 装備の品質段階と性能数値

品質・性能差は確定。装備の品質段階と具体的な性能値は未確定。

- 関連仕様 [ITEM-001](../specifications/06_items_equipment.md#item-001)
- 原資料 [v0.9.md](../history/v0.9.md#3-アイテムの品質とランダム性能)

## OPEN-030 国家ごとの法律運用

法律は世界共通。運用にどの程度国家差を許すか未確定。

- 関連仕様 [NATION-008](../specifications/12_nations_warfare.md#nation-008)
- 原資料 [v1.4.md](../history/v1.4.md#当時の要件懸念検討の経緯)

## OPEN-031 早送り・高速移動中の戦闘

高速移動中の襲撃の有無と早送り中の戦闘処理は未確定。

- 関連仕様 [SYSTEM-004](../specifications/15_game_system.md#system-004)
- 原資料 [v1.6.md](../history/v1.6.md#当時の要件懸念検討の経緯)

## OPEN-032 種族ごとの差異

種族ごとの具体的な寿命、能力差、文化およびNPCとの関係は未確定。

- 関連仕様 [GROWTH-004](../specifications/05_character_growth.md#growth-004)
- 原資料 [v1.8.md](../history/v1.8.md#当時の要件懸念検討の経緯)

## OPEN-033 定額雇用費の支払周期

雇用費の定額制は確定。契約時一括か定期払いかが未確定。

- 関連仕様 [GROUP-009](../specifications/08_companions_guilds.md#group-009)
- 原資料 [v3.2.md](../history/v3.2.md#当時の要件懸念検討の経緯)

## OPEN-034 成人へ移行する年齢

一定年齢で成人へ移行する方針は確定。具体的な年齢は未確定。

- 関連仕様 [SOCIETY-009](../specifications/13_population_society.md#society-009)
- 原資料 [v3.3.md](../history/v3.3.md#当時の要件懸念検討の経緯)

## OPEN-035 初期値と出身・経歴の補正

初期能力値や出身・経歴ごとの具体的な補正・初期所持品は未確定。

- 関連仕様 [GROWTH-005](../specifications/05_character_growth.md#growth-005)
- 原資料 [v1.7.md](../history/v1.7.md)

## OPEN-036 主人公の財産相続と国家の継承

v3.3で財産は継承し地位は失う。財産相続の競合や国家の継承法が並行する場合の詳細は未確定。

- 関連仕様 [SYSTEM-010](../specifications/15_game_system.md#system-010)
- 原資料 [v1.9.md](../history/v1.9.md)

## OPEN-037 難易度設定が及ぶ範囲

プレイヤー向け補正の対象と、NPC同士の戦争・経済シミュレーションとの分離をどの範囲まで行うかは要確認。

- 関連仕様 [COMBAT-003](../specifications/04_combat.md#combat-003)
- 原資料 [v2.4.md](../history/v2.4.md)

## OPEN-038 会話画面の表示と台詞

状況に応じた選択肢式は決定済み。具体的な画面・台詞は未確定。

- 関連仕様 [NPC-010](../specifications/07_npc_ai.md#npc-010)
- 原資料 [v2.8.md](../history/v2.8.md)

## OPEN-039 開戦のしきい値と例外

外交関係の悪化を主条件とする。具体的なしきい値と例外は未決定。

- 関連仕様 [NATION-021](../specifications/12_nations_warfare.md#nation-021)
- 原資料 [v4.0.md](../history/v4.0.md)

## OPEN-040 和平条件と外交交渉画面

外交は友好・敵対の関係値のみで管理する。暫定占領から最終帰属を確定する和平、領土・賠償・停戦条件の決定と外交画面をどう両立するかは要確認。

- 関連仕様 [NATION-022](../specifications/12_nations_warfare.md#nation-022)・[NATION-011](../specifications/12_nations_warfare.md#nation-011)・[NATION-013](../specifications/12_nations_warfare.md#nation-013)
- 原資料 [v4.0.md Q5](../history/v4.0.md#q5)・[v4.2.md Q5](../history/v4.2.md#q5)・[v4.4.md Q1](../history/v4.4.md#q1)

## OPEN-041 武器別の射程

射程の短い順に、素手 ＜ 短剣 ＜ 剣・斧・メイス ＜ 槍 ＜ 投擲 ＜ 弓を想定。銃器とマップ兵器は採用未定。採用する場合の射程順は弓 ＜ 銃器 ＜ マップ兵器。武器別の具体値は装備を実装するときに調整する。

- 関連仕様 [COMBAT-001](../specifications/04_combat.md#combat-001)、[ITEM-001](../specifications/06_items_equipment.md#item-001)。2026-11-26のユーザー要望。

## Phase 1の暫定設定

- 固定フィールドは2240×1568、宿場町1か所。敵は8地点で出現し、撃破8秒後に復帰。街は安全地帯。
- プレイヤー最大HP100、敵最大HP48。通常攻撃は射程56で一番近い敵を自動選択。戦闘数値はゲーム内の設定ファイルで調整可能。
- 宿は戸口への接触で開き、YESは無料で全回復、NOはそのままフィールドへ戻る。宿泊時間は進行しない。
- 戦闘不能時はボタンで街の開始位置に全回復して復帰。敵とフィールドの進行状態は保持する。ページ再読み込みで初期化。
- Phase 1開始に必要な追加のユーザー判断はなし。世界生成、戦闘・操作の詳細、保存などは後続Phaseで扱う。

## 技能・パークの詳細設計（DEV-063・064）

- 残り17技能の有効な行動、技能XP・能力補正・調整値。
- 個別パーク、各ツリーの分岐・取得条件・効果と進行バランス。
- 将来の基礎ステータス強化方式と、NPCに共通技能処理を適用する条件・処理範囲。
- 既存敵と武器の攻撃周期を踏まえた片手武器の技能XP倍率・必要XPの調整。


## 世界シミュレーション Phase 1から次段階への確認事項

今回の面積、国家数、食料・採集・建築・距離閾値は Phase 1 向け。最終的な自動生成の地形・都市配置、3段階の切替と集約の粒度、産業追加時の物流量の調整は DEV-068 で検討する。住民の生活、国家間の関係は既存の未決事項と目標仕様を参照する。
