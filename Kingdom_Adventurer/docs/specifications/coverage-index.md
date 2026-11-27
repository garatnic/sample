# 原資料と統合仕様の対応表

基準コミット `e7eefefa63175eb1f88fa128be1293244e727b8a`。対象は v0.1〜v7.2 の72版と履歴索引2件。行の単位は各原資料の設問。補足の反映と原資料の再照合の進捗は[作業状況](../development/DEVELOPMENT_STATUS.md)を参照。

| 原資料 | 設問 | 採用内容 | 統合先 | 反映状況 | 後続の変更 | 保留・要確認 |
| --- | --- | --- | --- | --- | --- | --- |
| [v0.1.md Q1](../history/v0.1.md#q1) | 世界の生成方法 | 自動生成された固定世界 | 世界・マップ [WORLD-001](02_world.md#world-001) | 統合先あり | [v0.2.md Q1](../history/v0.2.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.1.md Q2](../history/v0.1.md#q2) | 成長方式 | レベル＋スキル熟練度 | キャラクター成長 [GROWTH-001](05_character_growth.md#growth-001) | 統合先あり | [v3.4.md Q2](../history/v3.4.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.1.md Q3](../history/v0.1.md#q3) | プレイヤー死亡時 | ペナルティ付き復活 | ゲーム基盤 [SYSTEM-001](15_game_system.md#system-001) | 統合先あり | [v3.3.md Q4](../history/v3.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.1.md Q4](../history/v0.1.md#q4) | 仲間のシステム | NPC仲間を雇用・同行可能 | 仲間・組織 [GROUP-001](08_companions_guilds.md#group-001) | 統合先あり | [v1.0.md Q2](../history/v1.0.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.2.md Q1](../history/v0.2.md#q1) | マップの生成と保存 | 新規ゲームごとに別の世界を生成 — 開始時に世界を生成し、以後はその世界で冒険する。新しく始めると違う世界になる。 | 世界・マップ [WORLD-001](02_world.md#world-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.2.md Q2](../history/v0.2.md#q2) | マップの移動方式 | 地上はシームレス、建物やダンジョンは別マップ — 地上を自由に歩ける一方、屋内や地下は専用エリアとして管理する。 | 世界・マップ [WORLD-002](02_world.md#world-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.2.md Q3](../history/v0.2.md#q3) | 世界の規模 | 大規模 — 複数国家、数十の集落、数千人規模のNPC。遠隔地は簡易シミュレーション。 | 世界・マップ [WORLD-003](02_world.md#world-003) | 後続決定を反映 | 変更先 [v1.9.md Q1](../history/v1.9.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.3.md Q1](../history/v0.3.md#q1) | NPCの個人情報 | 全NPCに個人情報を保持 | NPC・生活AI [NPC-001](07_npc_ai.md#npc-001) | 統合先あり | [v2.0.md Q2](../history/v2.0.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.3.md Q2](../history/v0.3.md#q2) | 家族・世代交代 | 結婚・出産・成長・世代交代あり | 社会・人口 [SOCIETY-001](13_population_society.md#society-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.3.md Q3](../history/v0.3.md#q3) | NPCの死亡 | 永久死亡あり | 社会・人口 [SOCIETY-002](13_population_society.md#society-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.3.md Q4](../history/v0.3.md#q4) | ゲーム内時間の進み方 | 現実30分＝ゲーム1日 | ゲーム基盤 [SYSTEM-002](15_game_system.md#system-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.3.md Q5](../history/v0.3.md#q5) | NPC同士の人間関係 | NPC同士も動的に変化 | NPC・生活AI [NPC-002](07_npc_ai.md#npc-002) | 統合先あり | [v2.8.md Q5](../history/v2.8.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.4.md Q1](../history/v0.4.md#q1) | NPCの職業・移住 | 自律的な転職・独立・移住あり | NPC・生活AI [NPC-003](07_npc_ai.md#npc-003) | 統合先あり | [v3.2.md Q1](../history/v3.2.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.4.md Q2](../history/v0.4.md#q2) | 経済シミュレーション | 生産・消費・交易を実際に計算 | 経済・産業 [ECONOMY-001](10_economy.md#economy-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.4.md Q3](../history/v0.4.md#q3) | NPC同士の関係 | 友情・恋愛・対立・協力まで扱う | NPC・生活AI [NPC-002](07_npc_ai.md#npc-002) | 統合先あり | [v2.8.md Q5](../history/v2.8.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.4.md Q4](../history/v0.4.md#q4) | 世界の歴史 | 個人と世界の重要な出来事を記録 | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | [v4.9.md Q5](../history/v4.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.4.md Q5](../history/v0.4.md#q5) | 時間を進める機能 | 宿泊・待機・長期間の時間経過あり | ゲーム基盤 [SYSTEM-003](15_game_system.md#system-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.5.md Q1](../history/v0.5.md#q1) | 住居・建築 | 土地購入・建築・拠点設立まで可能 | 建築・領地・住宅 [HOUSING-001](11_building_housing.md#housing-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.5.md Q2](../history/v0.5.md#q2) | 商売・経営 | 店や工房を経営しNPCを雇用可能 | 経済・産業 [ECONOMY-002](10_economy.md#economy-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.5.md Q3](../history/v0.5.md#q3) | 国家への関与 | 領主になり領地経営まで可能 | 国家・政治・戦争 [NATION-001](12_nations_warfare.md#nation-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.5.md Q4](../history/v0.5.md#q4) | NPCとの交流 | 友情・恋愛・結婚・雇用まで可能 | NPC・生活AI [NPC-004](07_npc_ai.md#npc-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.5.md Q5](../history/v0.5.md#q5) | クエストシステム | 自動生成＋固定クエスト | クエスト・歴史 [QUEST-002](14_quests_history.md#quest-002) | 後続決定を反映 | 変更先 [v6.8.md Q1](../history/v6.8.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.6.md Q1](../history/v0.6.md#q1) | 探索と世界地図 | 未探索地域を探索で開示 | 冒険・探索 [EXPLORE-001](03_exploration.md#explore-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.6.md Q2](../history/v0.6.md#q2) | 半自動戦闘の操作 | 通常攻撃自動・スキルも自動設定可能 | 戦闘 [COMBAT-001](04_combat.md#combat-001) | 統合先あり | [v3.5.md Q2](../history/v3.5.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.6.md Q3](../history/v0.6.md#q3) | ダンジョンの生成 | 固定＋自動生成ダンジョン | 冒険・探索 [EXPLORE-002](03_exploration.md#explore-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.6.md Q4](../history/v0.6.md#q4) | 装備の性能 | 品質・ランダム性能・特殊効果あり | 装備・アイテム [ITEM-001](06_items_equipment.md#item-001) | 統合先あり | [v2.5.md Q2](../history/v2.5.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.6.md Q5](../history/v0.6.md#q5) | キャラクターの成長 | 職業固定なし・自由なスキル成長 | キャラクター成長 [GROWTH-002](05_character_growth.md#growth-002) | 統合先あり | [v3.4.md Q1](../history/v3.4.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.7.md Q1](../history/v0.7.md#q1) | 敵の強さ | 世界環境・種族・成長で決定 | 戦闘 [COMBAT-002](04_combat.md#combat-002) | 統合先あり | [v6.9.md Q1](../history/v6.9.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.7.md Q2](../history/v0.7.md#q2) | 戦闘の難易度 | 適度な危険性・装備や育成が重要 | 戦闘 [COMBAT-003](04_combat.md#combat-003) | 統合先あり | [v3.5.md Q3](../history/v3.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.7.md Q3](../history/v0.7.md#q3) | プレイヤー死亡時 | 拠点で復活・所持品や経験値を損失 | ゲーム基盤 [SYSTEM-001](15_game_system.md#system-001) | 後続決定を反映 | 変更先 [v3.3.md Q4](../history/v3.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.7.md Q4](../history/v0.7.md#q4) | 仲間NPCの死亡 | 仲間は永久死亡しない | 仲間・組織 [GROUP-002](08_companions_guilds.md#group-002) | 統合先あり | [v1.0.md Q5](../history/v1.0.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.7.md Q5](../history/v0.7.md#q5) | 仲間の戦闘AI | 詳細な戦闘方針を設定可能 | 仲間・組織 [GROUP-003](08_companions_guilds.md#group-003) | 統合先あり | [v3.1.md Q5](../history/v3.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.8.md Q1](../history/v0.8.md#q1) | 魔物の発生方法 | 生態系＋補助的なランダム出現 | 魔物・生態系 [ECO-001](09_ecosystem.md#eco-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.8.md Q2](../history/v0.8.md#q2) | 魔物の巣 | 固定配置・定期復活 | 魔物・生態系 [ECO-002](09_ecosystem.md#eco-002) | 統合先あり | [v2.6.md Q2](../history/v2.6.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.8.md Q3](../history/v0.8.md#q3) | ダンジョン攻略後 | 攻略結果を保存し、時間経過で変化 | 冒険・探索 [EXPLORE-003](03_exploration.md#explore-003) | 統合先あり | [v6.7.md Q2](../history/v6.7.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.8.md Q4](../history/v0.8.md#q4) | ボスの扱い | 固有個体と通常の強敵が共存 | 魔物・生態系 [ECO-003](09_ecosystem.md#eco-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.8.md Q5](../history/v0.8.md#q5) | 地域の危険度 | 地域の基本危険度＋強い個体が混在 | 魔物・生態系 [ECO-004](09_ecosystem.md#eco-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.9.md Q1](../history/v0.9.md#q1) | 装備の耐久度 | 耐久度なし | 装備・アイテム [ITEM-002](06_items_equipment.md#item-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.9.md Q2](../history/v0.9.md#q2) | アイテム所持制限 | 重量制限あり | 装備・アイテム [ITEM-003](06_items_equipment.md#item-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.9.md Q3](../history/v0.9.md#q3) | 製作システム | 鍛冶・錬金・裁縫・木工など多様 | 装備・アイテム [ITEM-004](06_items_equipment.md#item-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.9.md Q4](../history/v0.9.md#q4) | 装備の強化 | 数値強化＋特殊効果付与 | 装備・アイテム [ITEM-005](06_items_equipment.md#item-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v0.9.md Q5](../history/v0.9.md#q5) | 市場価格 | 需要・供給・地域で変動 | 経済・産業 [ECONOMY-003](10_economy.md#economy-003) | 統合先あり | [v3.8.md Q1](../history/v3.8.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.0.md Q1](../history/v1.0.md#q1) | 同時に同行できる人数 | 人数制限なし | 仲間・組織 [GROUP-004](08_companions_guilds.md#group-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.0.md Q2](../history/v1.0.md#q2) | 仲間の加入方法 | 傭兵・友情・クエスト・家族など複数 | 仲間・組織 [GROUP-001](08_companions_guilds.md#group-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.0.md Q3](../history/v1.0.md#q3) | 仲間の操作方法 | AI自律行動＋詳細指示 | 仲間・組織 [GROUP-003](08_companions_guilds.md#group-003) | 統合先あり | [v3.1.md Q5](../history/v3.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.0.md Q4](../history/v1.0.md#q4) | 仲間の成長 | プレイヤーと同じ成長システム | 仲間・組織 [GROUP-005](08_companions_guilds.md#group-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.0.md Q5](../history/v1.0.md#q5) | 仲間の死亡保護 | 同行・雇用中のみ保護 | 仲間・組織 [GROUP-002](08_companions_guilds.md#group-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.1.md Q1](../history/v1.1.md#q1) | 建築物の配置 | 土地条件を満たせば自由配置 | 建築・領地・住宅 [HOUSING-002](11_building_housing.md#housing-002) | 統合先あり | [v3.0.md Q1](../history/v3.0.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.1.md Q2](../history/v1.1.md#q2) | 土地の所有権 | 未所有地は自由に占有可能 | 建築・領地・住宅 [HOUSING-003](11_building_housing.md#housing-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.1.md Q3](../history/v1.1.md#q3) | 集落の自律発展 | NPCが自律的に建築・移住・発展 | 社会・人口 [SOCIETY-003](13_population_society.md#society-003) | 統合先あり | [v4.7.md Q2](../history/v4.7.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.1.md Q4](../history/v1.1.md#q4) | 領地の管理方法 | NPCに委任＋直接管理も可能 | 建築・領地・住宅 [HOUSING-004](11_building_housing.md#housing-004) | 統合先あり | [v3.0.md Q3](../history/v3.0.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.1.md Q5](../history/v1.1.md#q5) | 建築物の損傷・破壊 | 損傷・破壊・修復あり | 建築・領地・住宅 [HOUSING-005](11_building_housing.md#housing-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.2.md Q1](../history/v1.2.md#q1) | 国家の変化 | 成立・滅亡・分裂・統合あり | 国家・政治・戦争 [NATION-002](12_nations_warfare.md#nation-002) | 後続決定を反映 | [v4.2.md Q4](../history/v4.2.md#q4)・[v4.5.md 整合性と懸念](../history/v4.5.md#整合性と懸念) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.2.md Q2](../history/v1.2.md#q2) | 戦争の進行 | 宣戦・侵攻・包囲・占領・和平まで自律進行 | 国家・政治・戦争 [NATION-003](12_nations_warfare.md#nation-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.2.md Q3](../history/v1.2.md#q3) | プレイヤーの建国 | 独立国家を建国可能 | 国家・政治・戦争 [NATION-004](12_nations_warfare.md#nation-004) | 統合先あり | [v4.4.md Q4](../history/v4.4.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.2.md Q4](../history/v1.2.md#q4) | 軍隊の指揮 | 直接指揮・NPC委任の両方 | 国家・政治・戦争 [NATION-005](12_nations_warfare.md#nation-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.2.md Q5](../history/v1.2.md#q5) | 政治システム | 法律・税制・外交・継承・反乱など詳細 | 国家・政治・戦争 [NATION-006](12_nations_warfare.md#nation-006) | 後続決定を反映 | 変更先 [v4.2.md Q4](../history/v4.2.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.3.md Q1](../history/v1.3.md#q1) | 犯罪の発覚 | 目撃・証拠・通報に基づく | 国家・政治・戦争 [NATION-007](12_nations_warfare.md#nation-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.3.md Q2](../history/v1.3.md#q2) | 法律の違い | 世界共通の法律 | 国家・政治・戦争 [NATION-008](12_nations_warfare.md#nation-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.3.md Q3](../history/v1.3.md#q3) | 評判の管理 | 個人・集落・国家・組織ごと | 社会・人口 [SOCIETY-004](13_population_society.md#society-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.3.md Q4](../history/v1.3.md#q4) | 犯罪への処罰 | 罰金・投獄・追放・恩赦など | 国家・政治・戦争 [NATION-009](12_nations_warfare.md#nation-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.3.md Q5](../history/v1.3.md#q5) | NPCの犯罪行動 | NPCも自律的に犯罪・捜査・逮捕 | NPC・生活AI [NPC-005](07_npc_ai.md#npc-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.4.md Q1](../history/v1.4.md#q1) | クエストの生成 | 世界状況から自動生成＋固定クエスト | クエスト・歴史 [QUEST-002](14_quests_history.md#quest-002) | 後続決定を反映 | 変更先 [v6.8.md Q1](../history/v6.8.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.4.md Q2](../history/v1.4.md#q2) | NPCのクエスト参加 | NPCも自律的に受注・達成・失敗 | クエスト・歴史 [QUEST-003](14_quests_history.md#quest-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.4.md Q3](../history/v1.4.md#q3) | クエストの期限 | 基本的に期限なし | クエスト・歴史 [QUEST-004](14_quests_history.md#quest-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.4.md Q4](../history/v1.4.md#q4) | クエスト報酬 | 依頼主の実際の財産・資源から支払う | クエスト・歴史 [QUEST-005](14_quests_history.md#quest-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.4.md Q5](../history/v1.4.md#q5) | 世界イベント | 自然発生＋固定イベント | クエスト・歴史 [QUEST-006](14_quests_history.md#quest-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.5.md Q1](../history/v1.5.md#q1) | 移動手段 | 徒歩・騎乗・馬車・船など複数 | 冒険・探索 [EXPLORE-004](03_exploration.md#explore-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.5.md Q2](../history/v1.5.md#q2) | 高速移動 | 発見済みの拠点・都市へ移動可能 | 冒険・探索 [EXPLORE-005](03_exploration.md#explore-005) | 統合先あり | [v6.7.md Q1](../history/v6.7.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.5.md Q3](../history/v1.5.md#q3) | 高速移動中の時間 | 移動距離に応じて時間経過 | 冒険・探索 [EXPLORE-005](03_exploration.md#explore-005) | 統合先あり | [v6.7.md Q1](../history/v6.7.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.5.md Q4](../history/v1.5.md#q4) | 時間の操作 | 一時停止・通常速度・早送り | ゲーム基盤 [SYSTEM-004](15_game_system.md#system-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.5.md Q5](../history/v1.5.md#q5) | 長期間の時間スキップ | 安全な場所でのみ可能 | ゲーム基盤 [SYSTEM-005](15_game_system.md#system-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.6.md Q1](../history/v1.6.md#q1) | 対応環境 | PC・スマホ両対応 | ゲーム基盤 [SYSTEM-006](15_game_system.md#system-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.6.md Q2](../history/v1.6.md#q2) | カメラ操作 | 追従＋ズーム・視点移動可能 | ゲーム基盤 [SYSTEM-007](15_game_system.md#system-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.6.md Q3](../history/v1.6.md#q3) | 移動操作 | 直接移動（キーボード・パッド・仮想スティック） | ゲーム基盤 [SYSTEM-008](15_game_system.md#system-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.6.md Q4](../history/v1.6.md#q4) | 戦闘操作 | 通常攻撃自動＋スキルは手動・自動切替 | 戦闘 [COMBAT-001](04_combat.md#combat-001) | 統合先あり | [v3.5.md Q2](../history/v3.5.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.6.md Q5](../history/v1.6.md#q5) | UIのカスタマイズ | 表示項目・配置・サイズを変更可能 | ゲーム基盤 [SYSTEM-009](15_game_system.md#system-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.7.md Q1](../history/v1.7.md#q1) | 外見のカスタマイズ | 髪型・顔・体格・服装など詳細 | キャラクター成長 [GROWTH-003](05_character_growth.md#growth-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.7.md Q2](../history/v1.7.md#q2) | プレイヤーの種族 | 人間・エルフ・ドワーフなど複数 | キャラクター成長 [GROWTH-004](05_character_growth.md#growth-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.7.md Q3](../history/v1.7.md#q3) | 出身・経歴の影響 | 初期能力・人間関係・所持品に影響 | キャラクター成長 [GROWTH-005](05_character_growth.md#growth-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.7.md Q4](../history/v1.7.md#q4) | ゲーム開始地点 | 生成世界の複数候補から選択 | 世界・マップ [WORLD-004](02_world.md#world-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.7.md Q5](../history/v1.7.md#q5) | 主人公の加齢 | NPCと同じく加齢・寿命あり | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.8.md Q1](../history/v1.8.md#q1) | 主人公が寿命を迎えた後 | 後継者を選び、同じ世界を継続 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.8.md Q2](../history/v1.8.md#q2) | 後継者の候補 | 子供・家族・弟子・仲間など | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.8.md Q3](../history/v1.8.md#q3) | 継承するもの | 財産・地位を相続、能力は後継者自身 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 後続決定を反映 | 変更先 [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.8.md Q4](../history/v1.8.md#q4) | セーブ方式 | オートセーブ＋手動セーブ | ゲーム基盤 [SYSTEM-011](15_game_system.md#system-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.8.md Q5](../history/v1.8.md#q5) | 世代交代後の世界 | 世界の状態・歴史をすべて維持 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.9.md Q1](../history/v1.9.md#q1) | 世界の規模 | 中規模世界（数国家・十数集落） | 世界・マップ [WORLD-003](02_world.md#world-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.9.md Q2](../history/v1.9.md#q2) | 大陸・海の構成 | 巨大な単一大陸中心 | 世界・マップ [WORLD-005](02_world.md#world-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.9.md Q3](../history/v1.9.md#q3) | 気候・資源・生態系 | 地形・気候・資源・生態系を連動生成 | 世界・マップ [WORLD-006](02_world.md#world-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.9.md Q4](../history/v1.9.md#q4) | ゲーム開始時の歴史 | 過去の歴史を事前シミュレーション | クエスト・歴史 [QUEST-007](14_quests_history.md#quest-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v1.9.md Q5](../history/v1.9.md#q5) | 世界生成のカスタマイズ | 世界規模・国家数・地形などを調整可能 | 世界・マップ [WORLD-007](02_world.md#world-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.0.md Q1](../history/v2.0.md#q1) | 世界シミュレーションの処理方式 | 周辺詳細・近隣簡略・遠方集約の3段階 | ゲーム基盤 [SYSTEM-012](15_game_system.md#system-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.0.md Q2](../history/v2.0.md#q2) | NPCの個人データ | 全NPCの個人情報・家族・財産・履歴を保持 | NPC・生活AI [NPC-001](07_npc_ai.md#npc-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.0.md Q3](../history/v2.0.md#q3) | プレイヤー不在地域の出来事 | 経済・出生死亡・移住・戦争など自律進行 | ゲーム基盤 [SYSTEM-013](15_game_system.md#system-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.0.md Q4](../history/v2.0.md#q4) | PC・スマホの処理負荷対策 | 端末性能に応じて更新頻度・描画数を自動調整 | ゲーム基盤 [SYSTEM-014](15_game_system.md#system-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.0.md Q5](../history/v2.0.md#q5) | 世界の歴史の保存 | 重要イベントを永続保存、日常行動は要約 | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | [v4.9.md Q5](../history/v4.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.1.md Q1](../history/v2.1.md#q1) | 人口の増減要因 | 食料・住宅・雇用・治安などに連動 | 社会・人口 [SOCIETY-005](13_population_society.md#society-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.1.md Q2](../history/v2.1.md#q2) | NPCの出生 | 実際の家族関係から子供が誕生 | 社会・人口 [SOCIETY-006](13_population_society.md#society-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.1.md Q3](../history/v2.1.md#q3) | 種族と寿命 | 種族ごとに寿命・成長速度が異なる | 社会・人口 [SOCIETY-007](13_population_society.md#society-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.1.md Q4](../history/v2.1.md#q4) | NPCの移住 | 仕事・生活・安全を考慮して自律移住 | 社会・人口 [SOCIETY-008](13_population_society.md#society-008) | 統合先あり | [v4.9.md Q4](../history/v4.9.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.1.md Q5](../history/v2.1.md#q5) | 集落の発展と衰退 | 人口・資源・経済に応じて自然に変化 | 社会・人口 [SOCIETY-003](13_population_society.md#society-003) | 統合先あり | [v4.7.md Q2](../history/v4.7.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.2.md Q1](../history/v2.2.md#q1) | 生産品と在庫の管理 | 原材料から完成品まで実在アイテムとして管理 | 経済・産業 [ECONOMY-004](10_economy.md#economy-004) | 統合先あり | [v3.7.md Q4](../history/v3.7.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.2.md Q2](../history/v2.2.md#q2) | NPCの生活需要 | 食料・住居・衣服・道具・娯楽など | 経済・産業 [ECONOMY-005](10_economy.md#economy-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.2.md Q3](../history/v2.2.md#q3) | 地域間の交易 | 商隊・船が実際に商品を運搬 | 経済・産業 [ECONOMY-006](10_economy.md#economy-006) | 統合先あり | [v3.7.md Q5](../history/v3.7.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.2.md Q4](../history/v2.2.md#q4) | NPCの商店・工房経営 | 開業・雇用・仕入れ・販売・廃業を自律判断 | 経済・産業 [ECONOMY-007](10_economy.md#economy-007) | 統合先あり | [v3.8.md Q3](../history/v3.8.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.2.md Q5](../history/v2.2.md#q5) | 貨幣と財産の管理 | NPC・商店・国家間で実際に貨幣を移転 | 経済・産業 [ECONOMY-008](10_economy.md#economy-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.3.md Q1](../history/v2.3.md#q1) | キャラクターの成長方式 | レベル＋技能別熟練度 | キャラクター成長 [GROWTH-001](05_character_growth.md#growth-001) | 統合先あり | [v3.4.md Q2](../history/v3.4.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.3.md Q2](../history/v2.3.md#q2) | 技能の成長方法 | 使用経験＋訓練・教育 | キャラクター成長 [GROWTH-006](05_character_growth.md#growth-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.3.md Q3](../history/v2.3.md#q3) | 魔法の種類 | 攻撃・回復・補助・召喚・生活魔法など | 戦闘 [COMBAT-004](04_combat.md#combat-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.3.md Q4](../history/v2.3.md#q4) | 魔法の使用資源 | MP消費＋自然回復 | 戦闘 [COMBAT-005](04_combat.md#combat-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.3.md Q5](../history/v2.3.md#q5) | 敵個体の成長 | 敵個体も経験・戦闘・生存によって成長 | 戦闘 [COMBAT-002](04_combat.md#combat-002) | 統合先あり | [v6.9.md Q1](../history/v6.9.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.4.md Q1](../history/v2.4.md#q1) | 敵AIの判断能力 | 種族・性格・経験・状況に応じて判断 | 戦闘 [COMBAT-006](04_combat.md#combat-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.4.md Q2](../history/v2.4.md#q2) | 敵対行動の発生条件 | 魔物は基本的にすべて敵対 | 戦闘 [COMBAT-007](04_combat.md#combat-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.4.md Q3](../history/v2.4.md#q3) | 逃走・降伏 | NPC・敵とも状況に応じて逃走・降伏 | 戦闘 [COMBAT-008](04_combat.md#combat-008) | 統合先あり | [v3.5.md Q4](../history/v3.5.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.4.md Q4](../history/v2.4.md#q4) | 集団戦での連携 | 敵も仲間と連携し役割分担 | 戦闘 [COMBAT-009](04_combat.md#combat-009) | 統合先あり | [v3.5.md Q5](../history/v3.5.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.4.md Q5](../history/v2.4.md#q5) | 戦闘難易度の調整 | 難易度を調整可能、敵レベル連動はなし | 戦闘 [COMBAT-003](04_combat.md#combat-003) | 統合先あり | [v3.5.md Q3](../history/v3.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.5.md Q1](../history/v2.5.md#q1) | 敵を倒したときの戦利品 | 敵が実際に所有していた装備・財産・素材 | 装備・アイテム [ITEM-006](06_items_equipment.md#item-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.5.md Q2](../history/v2.5.md#q2) | 装備の品質・性能 | 素材・製作者技能・製作条件・個体差で決定 | 装備・アイテム [ITEM-001](06_items_equipment.md#item-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.5.md Q3](../history/v2.5.md#q3) | ユニーク・希少装備 | 固有の伝説装備＋ランダム生成の希少装備 | 装備・アイテム [ITEM-007](06_items_equipment.md#item-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.5.md Q4](../history/v2.5.md#q4) | 装備の使用条件 | 誰でも装備可能、能力・技能で性能が変化 | 装備・アイテム [ITEM-008](06_items_equipment.md#item-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.5.md Q5](../history/v2.5.md#q5) | アイテムの永続性 | 保管・設置・売買したアイテムを世界に保持 | 装備・アイテム [ITEM-009](06_items_equipment.md#item-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.6.md Q1](../history/v2.6.md#q1) | ダンジョン攻略後の変化 | 新勢力の占拠・環境変化などが発生 | 冒険・探索 [EXPLORE-003](03_exploration.md#explore-003) | 統合先あり | [v6.7.md Q2](../history/v6.7.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.6.md Q2](../history/v2.6.md#q2) | 魔物の巣の再出現 | 巣の種類・環境・時間に応じて再出現 | 魔物・生態系 [ECO-002](09_ecosystem.md#eco-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.6.md Q3](../history/v2.6.md#q3) | 財宝・資源の再配置 | 一定期間で宝箱・資源が復活 | 冒険・探索 [EXPLORE-006](03_exploration.md#explore-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.6.md Q4](../history/v2.6.md#q4) | ダンジョンの発見方法 | 探索・噂・地図・NPC情報から発見 | 冒険・探索 [EXPLORE-007](03_exploration.md#explore-007) | 統合先あり | [v7.0.md Q3](../history/v7.0.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.6.md Q5](../history/v2.6.md#q5) | ダンジョン攻略の世界への影響 | 治安・交易・住民生活・勢力関係などに影響 | 冒険・探索 [EXPLORE-008](03_exploration.md#explore-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.7.md Q1](../history/v2.7.md#q1) | NPCの性格 | 複数の性格パラメータを組み合わせる | NPC・生活AI [NPC-006](07_npc_ai.md#npc-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.7.md Q2](../history/v2.7.md#q2) | NPCの人生の目標 | 状況や経験に応じて目標が変化 | NPC・生活AI [NPC-007](07_npc_ai.md#npc-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.7.md Q3](../history/v2.7.md#q3) | NPCの記憶 | 重要な出来事や人物との関係を長期記憶 | NPC・生活AI [NPC-008](07_npc_ai.md#npc-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.7.md Q4](../history/v2.7.md#q4) | NPC同士の人間関係 | 友好度の単一数値 | NPC・生活AI [NPC-002](07_npc_ai.md#npc-002) | 統合先あり | [v2.8.md Q5](../history/v2.8.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.7.md Q5](../history/v2.7.md#q5) | NPCが知っている情報の範囲 | 世界の全情報を把握 | NPC・生活AI [NPC-009](07_npc_ai.md#npc-009) | 統合先あり | [v6.6.md Q1](../history/v6.6.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.8.md Q1](../history/v2.8.md#q1) | NPCとの会話方式 | 状況に応じた選択肢式会話 | NPC・生活AI [NPC-010](07_npc_ai.md#npc-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.8.md Q2](../history/v2.8.md#q2) | 交渉の成否と条件 | 交渉技能・友好度・性格・状況に応じる | NPC・生活AI [NPC-011](07_npc_ai.md#npc-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.8.md Q3](../history/v2.8.md#q3) | NPCとの依頼関係 | プレイヤーとNPCが互いに依頼を出せる | クエスト・歴史 [QUEST-008](14_quests_history.md#quest-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.8.md Q4](../history/v2.8.md#q4) | 噂・情報の扱い | 世界情報は共有し、噂は会話・演出に利用 | NPC・生活AI [NPC-009](07_npc_ai.md#npc-009) | 統合先あり | [v6.6.md Q1](../history/v6.6.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.8.md Q5](../history/v2.8.md#q5) | 友好度の変化 | 行動・会話・取引・時間経過で変化 | NPC・生活AI [NPC-002](07_npc_ai.md#npc-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.9.md Q1](../history/v2.9.md#q1) | 国家の政治体制 | 王国・共和国・部族国家など複数の政治体制 | 国家・政治・戦争 [NATION-010](12_nations_warfare.md#nation-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.9.md Q2](../history/v2.9.md#q2) | 国家間の外交 | 国益・関係・軍事力・経済状況に応じて自律判断 | 国家・政治・戦争 [NATION-011](12_nations_warfare.md#nation-011) | 統合先あり | [v4.2.md Q5](../history/v4.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.9.md Q3](../history/v2.9.md#q3) | 戦争の勝敗を決める要素 | 兵力と能力値中心 | 国家・政治・戦争 [NATION-012](12_nations_warfare.md#nation-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.9.md Q4](../history/v2.9.md#q4) | 領土と国境の変化 | 地図上の領域を占領・割譲して国境が変化 | 国家・政治・戦争 [NATION-013](12_nations_warfare.md#nation-013) | 統合先あり | [v4.5.md Q3](../history/v4.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v2.9.md Q5](../history/v2.9.md#q5) | 国内政治の自律性 | 君主や国家指導者が主に判断 | 国家・政治・戦争 [NATION-014](12_nations_warfare.md#nation-014) | 統合先あり | [v4.6.md Q4](../history/v4.6.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.0.md Q1](../history/v3.0.md#q1) | 建物の配置方法 | 地形・土地条件が許す範囲で自由配置 | 建築・領地・住宅 [HOUSING-002](11_building_housing.md#housing-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.0.md Q2](../history/v3.0.md#q2) | 建築に必要なもの | 資材・労働力・建築時間 | 建築・領地・住宅 [HOUSING-006](11_building_housing.md#housing-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.0.md Q3](../history/v3.0.md#q3) | 領地の管理方式 | 基本的にNPCが自動運営 | 建築・領地・住宅 [HOUSING-004](11_building_housing.md#housing-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.0.md Q4](../history/v3.0.md#q4) | 住民による建築 | 需要・資金・土地に応じてNPCが自律建築 | 社会・人口 [SOCIETY-003](13_population_society.md#society-003) | 統合先あり | [v4.7.md Q2](../history/v4.7.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.0.md Q5](../history/v3.0.md#q5) | 税金の仕組み | 税率・税目を設定し住民や経済に影響 | 国家・政治・戦争 [NATION-015](12_nations_warfare.md#nation-015) | 統合先あり | [v3.9.md Q5](../history/v3.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.1.md Q1](../history/v3.1.md#q1) | ギルド・組織の自律性 | NPCが組織を設立・運営・拡大・解散できる | 仲間・組織 [GROUP-006](08_companions_guilds.md#group-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.1.md Q2](../history/v3.1.md#q2) | 複数組織への所属 | 複数所属可能。ただし対立関係や規則による制約あり | 仲間・組織 [GROUP-007](08_companions_guilds.md#group-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.1.md Q3](../history/v3.1.md#q3) | プレイヤーによる組織設立 | 条件を満たせば自由に設立 | 仲間・組織 [GROUP-008](08_companions_guilds.md#group-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.1.md Q4](../history/v3.1.md#q4) | NPCとの雇用契約 | 定額の雇用費用だけを支払う | 仲間・組織 [GROUP-009](08_companions_guilds.md#group-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.1.md Q5](../history/v3.1.md#q5) | 仲間への行動指示 | 仲間ごとに戦闘・探索・回復・撤退などの方針を設定 | 仲間・組織 [GROUP-003](08_companions_guilds.md#group-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.2.md Q1](../history/v3.2.md#q1) | NPCの職業変更 | 能力・希望・求人・経済状況に応じて自由に転職 | NPC・生活AI [NPC-003](07_npc_ai.md#npc-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.2.md Q2](../history/v3.2.md#q2) | 子供の成長 | 一定年齢で一気に成人 | 社会・人口 [SOCIETY-009](13_population_society.md#society-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.2.md Q3](../history/v3.2.md#q3) | 結婚・家庭形成 | 相性・友好度・生活条件を考慮して自律的に結婚 | 社会・人口 [SOCIETY-010](13_population_society.md#society-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.2.md Q4](../history/v3.2.md#q4) | 死亡時の財産相続 | 家族関係と相続規則に従って継承 | 社会・人口 [SOCIETY-011](13_population_society.md#society-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.2.md Q5](../history/v3.2.md#q5) | 次世代への技能継承 | 親・師匠・学校・仕事を通じて学習 | キャラクター成長 [GROWTH-007](05_character_growth.md#growth-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.3.md Q1](../history/v3.3.md#q1) | プレイヤーの寿命 | 種族ごとの寿命に従い加齢・老衰 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.3.md Q2](../history/v3.3.md#q2) | 後継者の選択範囲 | 家族・子供・弟子・仲間などから自由に選択 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.3.md Q3](../history/v3.3.md#q3) | 財産・地位の継承 | 財産のみ継承し地位は失う | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | [v3.3.md Q5](../history/v3.3.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.3.md Q4](../history/v3.3.md#q4) | 戦闘で死亡した場合 | 拠点で復活し、所持金のみ少額減少 | ゲーム基盤 [SYSTEM-001](15_game_system.md#system-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.3.md Q5](../history/v3.3.md#q5) | 後継者がいない場合 | 同じ世界で新しい冒険者を作成して継続 | ゲーム基盤 [SYSTEM-010](15_game_system.md#system-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.4.md Q1](../history/v3.4.md#q1) | 職業システム | 固定職業なし。技能の組み合わせで自由育成 | キャラクター成長 [GROWTH-002](05_character_growth.md#growth-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.4.md Q2](../history/v3.4.md#q2) | レベルと技能の役割 | レベルで基礎能力、熟練度で専門能力が成長 | キャラクター成長 [GROWTH-001](05_character_growth.md#growth-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.4.md Q3](../history/v3.4.md#q3) | 技能の習得制限 | すべての技能を習得・成長可能 | キャラクター成長 [GROWTH-008](05_character_growth.md#growth-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.4.md Q4](../history/v3.4.md#q4) | 魔法の習得方法 | 魔法書・教師・研究・実践などで習得 | キャラクター成長 [GROWTH-009](05_character_growth.md#growth-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.4.md Q5](../history/v3.4.md#q5) | 技能の成長速度 | 初期は伸びやすく、高熟練度ほど成長が緩やか | キャラクター成長 [GROWTH-010](05_character_growth.md#growth-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.5.md Q1](../history/v3.5.md#q1) | 通常攻撃の対象選択 | 基本は自動選択、手動指定も可能 | 戦闘 [COMBAT-010](04_combat.md#combat-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.5.md Q2](../history/v3.5.md#q2) | スキルの自動使用 | HP・MP・敵の状況などの条件を設定可能 | 戦闘 [COMBAT-001](04_combat.md#combat-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.5.md Q3](../history/v3.5.md#q3) | 戦闘難易度の調整方法 | 敵の能力値・攻撃力・耐久力などを調整 | 戦闘 [COMBAT-003](04_combat.md#combat-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.5.md Q4](../history/v3.5.md#q4) | 敵の撤退・降伏判断 | HP・戦力差・性格・状況に応じて判断 | 戦闘 [COMBAT-008](04_combat.md#combat-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.5.md Q5](../history/v3.5.md#q5) | 敵集団の連携 | 前衛・後衛・支援など役割に応じて連携 | 戦闘 [COMBAT-009](04_combat.md#combat-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.6.md Q1](../history/v3.6.md#q1) | 野生動物の個体数 | 個体数はほぼ一定 | 魔物・生態系 [ECO-005](09_ecosystem.md#eco-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.6.md Q2](../history/v3.6.md#q2) | 食物連鎖・捕食関係 | 食物連鎖は見た目の演出のみ | 魔物・生態系 [ECO-006](09_ecosystem.md#eco-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.6.md Q3](../history/v3.6.md#q3) | 野生動物・魔物の生息地域 | 種類ごとに決まった地域にのみ生息 | 魔物・生態系 [ECO-007](09_ecosystem.md#eco-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.6.md Q4](../history/v3.6.md#q4) | 採集資源の再生 | 木材・植物・鉱石などが条件と時間に応じて再生 | 魔物・生態系 [ECO-008](09_ecosystem.md#eco-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.6.md Q5](../history/v3.6.md#q5) | 環境の長期変化 | 地域環境は基本的に変化しない | 魔物・生態系 [ECO-009](09_ecosystem.md#eco-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.7.md Q1](../history/v3.7.md#q1) | 農業の仕組み | 農地が一定時間ごとに食料を自動生産 | 経済・産業 [ECONOMY-009](10_economy.md#economy-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.7.md Q2](../history/v3.7.md#q2) | 牧畜の仕組み | 牧場施設が一定時間ごとに畜産物を生産 | 経済・産業 [ECONOMY-010](10_economy.md#economy-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.7.md Q3](../history/v3.7.md#q3) | 鉱山・鉱床の資源量 | 採掘量と再生時間を設定し継続採掘可能 | 経済・産業 [ECONOMY-011](10_economy.md#economy-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.7.md Q4](../history/v3.7.md#q4) | 製造・加工工程 | 原材料から完成品を直接製造 | 経済・産業 [ECONOMY-004](10_economy.md#economy-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.7.md Q5](../history/v3.7.md#q5) | 商品の輸送方法 | 近距離は実際に移動、遠距離は簡易計算 | 経済・産業 [ECONOMY-006](10_economy.md#economy-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.8.md Q1](../history/v3.8.md#q1) | 商品価格の決定方法 | 地域の需要・供給・在庫・輸送費で自動変動 | 経済・産業 [ECONOMY-003](10_economy.md#economy-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.8.md Q2](../history/v3.8.md#q2) | NPCが商品を購入する判断 | 生活需要・所持金・価格・在庫に応じて購入 | 経済・産業 [ECONOMY-012](10_economy.md#economy-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.8.md Q3](../history/v3.8.md#q3) | NPCの商店経営 | 仕入れ・販売・雇用・開業・閉店を自律判断 | 経済・産業 [ECONOMY-007](10_economy.md#economy-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.8.md Q4](../history/v3.8.md#q4) | 貨幣システム | 世界共通の単一通貨 | 経済・産業 [ECONOMY-013](10_economy.md#economy-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.8.md Q5](../history/v3.8.md#q5) | 経済バランスの調整 | 極端な物価・資金不足を緩和する仕組みを設ける | 経済・産業 [ECONOMY-014](10_economy.md#economy-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.9.md Q1](../history/v3.9.md#q1) | 国家の国庫 | 実際の資金残高を保有し、収入・支出を記録 | 国家・政治・戦争 [NATION-016](12_nations_warfare.md#nation-016) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.9.md Q2](../history/v3.9.md#q2) | 国家予算の配分 | NPCが自律配分し、プレイヤーは方針変更可能 | 国家・政治・戦争 [NATION-017](12_nations_warfare.md#nation-017) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.9.md Q3](../history/v3.9.md#q3) | 公共事業・公共施設の建設 | 人口・交通・治安・需要・資金に応じて自律建設 | 建築・領地・住宅 [HOUSING-007](11_building_housing.md#housing-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.9.md Q4](../history/v3.9.md#q4) | 財政赤字への対応 | 支出削減・増税・事業延期などで自律対応 | 国家・政治・戦争 [NATION-018](12_nations_warfare.md#nation-018) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v3.9.md Q5](../history/v3.9.md#q5) | 税率が住民に与える影響 | 生活・消費・移住・商業活動などに影響 | 国家・政治・戦争 [NATION-015](12_nations_warfare.md#nation-015) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.0.md Q1](../history/v4.0.md#q1) | 兵士の募集・補充 | 平時は志願兵を雇用し戦時には必要に応じ徴兵も実施 | 国家・政治・戦争 [NATION-019](12_nations_warfare.md#nation-019) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.0.md Q2](../history/v4.0.md#q2) | 軍隊の編成 | 兵士数と総合戦力のみで管理 | 国家・政治・戦争 [NATION-020](12_nations_warfare.md#nation-020) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.0.md Q3](../history/v4.0.md#q3) | 開戦判断 | 外交関係の悪化を主な開戦条件とする | 国家・政治・戦争 [NATION-021](12_nations_warfare.md#nation-021) | 統合先あり | [v4.6.md Q3](../history/v4.6.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.0.md Q4](../history/v4.0.md#q4) | 占領地の統治 | 占領すると即座に通常領地として統治 | 国家・政治・戦争 [NATION-013](12_nations_warfare.md#nation-013) | 統合先あり | [v4.5.md Q3](../history/v4.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.0.md Q5](../history/v4.0.md#q5) | 和平交渉 | 戦況・国力・財政・外交関係に応じて領土・賠償・停戦を交渉 | 国家・政治・戦争 [NATION-022](12_nations_warfare.md#nation-022) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.1.md Q1](../history/v4.1.md#q1) | 軍隊の移動と遠距離処理 | 近距離は部隊を実際に移動、遠距離は移動時間と戦力で簡易計算 | 国家・政治・戦争 [NATION-023](12_nations_warfare.md#nation-023) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.1.md Q2](../history/v4.1.md#q2) | 軍隊の補給 | 補給の概念を設けない | 国家・政治・戦争 [NATION-024](12_nations_warfare.md#nation-024) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.1.md Q3](../history/v4.1.md#q3) | 城・都市への攻撃 | 城壁や守備力を数値化し、包囲と突撃を簡易処理 | 国家・政治・戦争 [NATION-025](12_nations_warfare.md#nation-025) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.1.md Q4](../history/v4.1.md#q4) | 大規模戦闘の処理 | プレイヤー付近は実戦闘、遠方は兵数・戦力・地形などで簡易決着 | 国家・政治・戦争 [NATION-026](12_nations_warfare.md#nation-026) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.1.md Q5](../history/v4.1.md#q5) | プレイヤーの戦争参加 | 一兵士・傭兵・指揮官・国家指導者など立場に応じ参加可能 | 国家・政治・戦争 [NATION-027](12_nations_warfare.md#nation-027) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.2.md Q1](../history/v4.2.md#q1) | 国家間の同盟 | 国家が利害・外交関係に応じて同盟を自律締結・破棄 | 国家・政治・戦争 [NATION-028](12_nations_warfare.md#nation-028) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.2.md Q2](../history/v4.2.md#q2) | 同盟国の参戦 | 同盟国は国益・関係・戦力を考慮して援軍を判断 | 国家・政治・戦争 [NATION-029](12_nations_warfare.md#nation-029) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.2.md Q3](../history/v4.2.md#q3) | 戦争による民間経済への影響 | 戦争は軍事と領土だけに影響 | 国家・政治・戦争 [NATION-030](12_nations_warfare.md#nation-030) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.2.md Q4](../history/v4.2.md#q4) | 反乱・独立 | 反乱・独立は発生しない | 国家・政治・戦争 [NATION-006](12_nations_warfare.md#nation-006) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.2.md Q5](../history/v4.2.md#q5) | 外交交渉の手段 | 友好・敵対の関係値のみ管理 | 国家・政治・戦争 [NATION-011](12_nations_warfare.md#nation-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.3.md Q1](../history/v4.3.md#q1) | 新しい国家の成立 | 未所属の土地にNPCやプレイヤーが建国できる | 国家・政治・戦争 [NATION-004](12_nations_warfare.md#nation-004) | 統合先あり | [v4.4.md Q4](../history/v4.4.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.3.md Q2](../history/v4.3.md#q2) | 国家の滅亡条件 | すべての領土を失うと滅亡する | 国家・政治・戦争 [NATION-031](12_nations_warfare.md#nation-031) | 統合先あり | [v4.4.md Q5](../history/v4.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.3.md Q3](../history/v4.3.md#q3) | 国家間の領土移動 | 戦争による占領と和平で領土が変わる | 国家・政治・戦争 [NATION-013](12_nations_warfare.md#nation-013) | 統合先あり | [v4.5.md Q3](../history/v4.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.3.md Q4](../history/v4.3.md#q4) | 国家の統合 | 外交関係に応じて国家同士が自律的に統合できる | 国家・政治・戦争 [NATION-032](12_nations_warfare.md#nation-032) | 統合先あり | [v4.4.md Q2](../history/v4.4.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.3.md Q5](../history/v4.3.md#q5) | 国家指導者の交代 | 死亡・任期・政治体制に応じて自律交代する | 国家・政治・戦争 [NATION-033](12_nations_warfare.md#nation-033) | 統合先あり | [v4.4.md Q3](../history/v4.4.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.4.md Q1](../history/v4.4.md#q1) | 領土の占領と和平の関係 | 占領時点で通常統治を開始し、和平時に最終帰属を確定 | 国家・政治・戦争 [NATION-013](12_nations_warfare.md#nation-013) | 統合先あり | [v4.5.md Q3](../history/v4.5.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.4.md Q2](../history/v4.4.md#q2) | 国家統合の成立条件 | 友好関係・国力差・指導者判断に応じて自律統合 | 国家・政治・戦争 [NATION-032](12_nations_warfare.md#nation-032) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.4.md Q3](../history/v4.4.md#q3) | 指導者交代の継承ルール | 政治体制ごとに世襲・選挙・指名などを使い分ける | 国家・政治・戦争 [NATION-033](12_nations_warfare.md#nation-033) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.4.md Q4](../history/v4.4.md#q4) | 建国に必要な条件 | 未所属地・人口・資金などの条件を満たすと建国できる | 国家・政治・戦争 [NATION-004](12_nations_warfare.md#nation-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.4.md Q5](../history/v4.4.md#q5) | 国家の消滅後の扱い | 国家は消滅し旧住民・施設・歴史記録は世界に残る | 国家・政治・戦争 [NATION-031](12_nations_warfare.md#nation-031) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.5.md Q1](../history/v4.5.md#q1) | 国家の初期配置 | 世界生成時に地形・資源・人口を考慮して国家と未所属地を配置 | 世界・マップ [WORLD-008](02_world.md#world-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.5.md Q2](../history/v4.5.md#q2) | 国家の拡張方法 | 未所属地には平和的に進出でき、他国領は戦争・和平で獲得 | 国家・政治・戦争 [NATION-034](12_nations_warfare.md#nation-034) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.5.md Q3](../history/v4.5.md#q3) | 国境の表現 | 地図上に領土境界を表示し、支配権を地域単位で管理 | 国家・政治・戦争 [NATION-013](12_nations_warfare.md#nation-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.5.md Q4](../history/v4.5.md#q4) | 国家指導者の意思決定 | 外交・軍事・内政を指導者の性格・能力・国家状況で自律判断 | 国家・政治・戦争 [NATION-014](12_nations_warfare.md#nation-014) | 統合先あり | [v4.6.md Q4](../history/v4.6.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.5.md Q5](../history/v4.5.md#q5) | 国家の歴史記録 | 建国・統合・戦争・滅亡・指導者交代を年代記として保存 | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | [v4.9.md Q5](../history/v4.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.6.md Q1](../history/v4.6.md#q1) | 国家の領土拡張速度 | 人口・資金・行政力に応じて拡張速度を制限 | 国家・政治・戦争 [NATION-035](12_nations_warfare.md#nation-035) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.6.md Q2](../history/v4.6.md#q2) | 未所属地への入植 | NPCが移住・開拓し集落が形成されると国家支配が定着 | 国家・政治・戦争 [NATION-036](12_nations_warfare.md#nation-036) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.6.md Q3](../history/v4.6.md#q3) | 国境地域の争い | 隣接国家の関係悪化や領有希望が戦争要因になる | 国家・政治・戦争 [NATION-021](12_nations_warfare.md#nation-021) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.6.md Q4](../history/v4.6.md#q4) | 国家指導者の個性 | 性格・能力・経験・対人関係が判断に影響 | 国家・政治・戦争 [NATION-014](12_nations_warfare.md#nation-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.6.md Q5](../history/v4.6.md#q5) | 歴史の閲覧方法 | 世界全体・国家・人物ごとの年代記を検索・閲覧できる | クエスト・歴史 [QUEST-009](14_quests_history.md#quest-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.7.md Q1](../history/v4.7.md#q1) | NPC移住のきっかけ | 仕事・住居・安全・生活条件を比較してNPCが自律移住 | 社会・人口 [SOCIETY-008](13_population_society.md#society-008) | 統合先あり | [v4.9.md Q4](../history/v4.9.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.7.md Q2](../history/v4.7.md#q2) | 開拓集落の発展 | 人口・資源・交通・施設需要に応じて集落が自律成長 | 社会・人口 [SOCIETY-003](13_population_society.md#society-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.7.md Q3](../history/v4.7.md#q3) | 領土拡張の優先順位 | 資源・交通・防衛・人口需要を考慮して国家が拡張先を選ぶ | 国家・政治・戦争 [NATION-037](12_nations_warfare.md#nation-037) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.7.md Q4](../history/v4.7.md#q4) | 国境を越えるNPC移動 | 平時は外交関係・治安・通行条件に応じて往来可能 | 社会・人口 [SOCIETY-012](13_population_society.md#society-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.7.md Q5](../history/v4.7.md#q5) | 年代記の記録粒度 | 重要事件は詳細記録し日常的な出来事は要約して保存 | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | [v4.9.md Q5](../history/v4.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.8.md Q1](../history/v4.8.md#q1) | NPCの移住単位 | 個人・家族が生活条件を考慮して移住し、必要に応じて同行する | 社会・人口 [SOCIETY-008](13_population_society.md#society-008) | 統合先あり | [v4.9.md Q4](../history/v4.9.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.8.md Q2](../history/v4.8.md#q2) | 移住先の住居と仕事 | 住居・仕事がなくても移住し、その後自動で確保される | NPC・生活AI [NPC-012](07_npc_ai.md#npc-012) | 統合先あり | [v4.9.md Q2](../history/v4.9.md#q2) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.8.md Q3](../history/v4.8.md#q3) | 集落の衰退・消滅 | 人口流出・資源不足・施設維持困難により集落が縮小・廃村化する | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.8.md Q4](../history/v4.8.md#q4) | NPCの移住経路 | 近距離は実際に移動し遠距離は所要時間・経路条件で簡易処理 | 社会・人口 [SOCIETY-014](13_population_society.md#society-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.8.md Q5](../history/v4.8.md#q5) | 年代記の保存と要約 | 重要事件は永続保存し、日常記録は期間ごとに要約・圧縮する | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | [v4.9.md Q5](../history/v4.9.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.9.md Q1](../history/v4.9.md#q1) | 移住直後の住居確保 | 移住した瞬間に新しい住居を無償生成 | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 後続決定を反映 | 変更先 [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.9.md Q2](../history/v4.9.md#q2) | 移住後の就職 | 求人・技能・賃金を考慮して就職活動し、見つからなければ一時的に無職 | NPC・生活AI [NPC-012](07_npc_ai.md#npc-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.9.md Q3](../history/v4.9.md#q3) | 廃村になった集落の扱い | 廃村になった瞬間に集落の建物を全削除 | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.9.md Q4](../history/v4.9.md#q4) | 移住先の選択 | 生活条件の魅力に加え、距離・移動費・家族関係も考慮 | 社会・人口 [SOCIETY-008](13_population_society.md#society-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v4.9.md Q5](../history/v4.9.md#q5) | 日常記録の要約頻度 | ゲーム内の一定期間ごとに要約し、重要な人物・地域は詳細度を高める | クエスト・歴史 [QUEST-001](14_quests_history.md#quest-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.0.md Q1](../history/v5.0.md#q1) | 無償生成される住居の仕様 | 移住者の人数・家族構成に応じた最低限の住宅を自動生成 | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.0.md Q2](../history/v5.0.md#q2) | 住居の生成場所 | 空き区画と道路への接続を考慮して集落内・周辺に配置 | 建築・領地・住宅 [HOUSING-009](11_building_housing.md#housing-009) | 統合先あり | [v5.2.md Q1](../history/v5.2.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.0.md Q3](../history/v5.0.md#q3) | 廃村化の判定条件 | 定住人口ゼロが一定期間継続したときに廃村化 | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.0.md Q4](../history/v5.0.md#q4) | 廃村時に残す情報 | 建物は削除するが地形・道路・土地の履歴・年代記は残す | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.0.md Q5](../history/v5.0.md#q5) | 住居無償生成の経済的扱い | 住居は資源も費用も消費せず無制限に生成 | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.1.md Q1](../history/v5.1.md#q1) | 住宅を置く空き区画がない場合 | 集落周辺に道路と宅地を拡張して住宅を生成 | 建築・領地・住宅 [HOUSING-009](11_building_housing.md#housing-009) | 統合先あり | [v5.2.md Q1](../history/v5.2.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.1.md Q2](../history/v5.1.md#q2) | 住宅生成と景観の関係 | 世界中で同一の住宅モデルを使う | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.1.md Q3](../history/v5.1.md#q3) | 廃村化までの猶予期間 | ゲーム内で一定日数の猶予を設け、その間に再入植すれば廃村化を回避 | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.1.md Q4](../history/v5.1.md#q4) | 廃村跡への再入植 | 旧集落の位置・道路・歴史を引き継ぎ新たな建物を生成して再建 | 社会・人口 [SOCIETY-015](13_population_society.md#society-015) | 統合先あり | [v5.2.md Q5](../history/v5.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.1.md Q5](../history/v5.1.md#q5) | 無制限住宅生成の対象 | 無償・無資源生成は移住時の最低限住宅に限定し、増改築や他施設は通常ルール | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.2.md Q1](../history/v5.2.md#q1) | 宅地拡張の上限 | 地形・通行可能性・他国領を考慮し、拡張可能な場所に限って宅地を増やす | 建築・領地・住宅 [HOUSING-009](11_building_housing.md#housing-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.2.md Q2](../history/v5.2.md#q2) | 移住住宅の所有権 | 生成された住宅は移住者世帯の所有物になる | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.2.md Q3](../history/v5.2.md#q3) | 移住住宅からの転居 | NPCは収入・家族構成・立地に応じて通常の住宅へ住み替え可能 | 建築・領地・住宅 [HOUSING-010](11_building_housing.md#housing-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.2.md Q4](../history/v5.2.md#q4) | 廃村化の猶予日数 | ゲーム内30日間、定住人口ゼロが続いた場合に廃村化 | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | [v5.3.md Q4](../history/v5.3.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.2.md Q5](../history/v5.2.md#q5) | 再入植時の集落名称 | 旧集落名を基本的に引き継ぎ、歴史上は再建として記録 | 社会・人口 [SOCIETY-015](13_population_society.md#society-015) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.3.md Q1](../history/v5.3.md#q1) | 移住住宅の再利用 | 転居で空いた住宅は空き家として残り、別世帯が入居できる | 建築・領地・住宅 [HOUSING-011](11_building_housing.md#housing-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.3.md Q2](../history/v5.3.md#q2) | 住宅の売買・相続 | 住宅はNPC間で売買・相続でき、所有権の移転を記録 | 建築・領地・住宅 [HOUSING-012](11_building_housing.md#housing-012) | 統合先あり | [v5.6.md Q3](../history/v5.6.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.3.md Q3](../history/v5.3.md#q3) | 移住時の新築と空き家 | 入居可能な空き家を優先し、なければ無償住宅を新築する | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | [v5.4.md Q5](../history/v5.4.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.3.md Q4](../history/v5.3.md#q4) | 廃村判定中の扱い | 人口ゼロの30日間は無人集落として建物・道路を保持し、再入植で猶予を解除 | 社会・人口 [SOCIETY-013](13_population_society.md#society-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.3.md Q5](../history/v5.3.md#q5) | 移住住宅の世帯分離 | 家族の独立・結婚などで別世帯になった場合は必要に応じて住宅を確保 | 建築・領地・住宅 [HOUSING-013](11_building_housing.md#housing-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.4.md Q1](../history/v5.4.md#q1) | 空き家への入居契約 | 所有者の同意を得て購入・賃貸・無償貸与などで入居する | 建築・領地・住宅 [HOUSING-014](11_building_housing.md#housing-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.4.md Q2](../history/v5.4.md#q2) | 住宅の相続先 | 家族・親族関係と相続順位に基づき所有権を引き継ぐ | 建築・領地・住宅 [HOUSING-012](11_building_housing.md#housing-012) | 統合先あり | [v5.6.md Q3](../history/v5.6.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.4.md Q3](../history/v5.4.md#q3) | 所有者不在の住宅 | 相続人・所有者がいなければ集落管理の空き家として再利用する | 建築・領地・住宅 [HOUSING-012](11_building_housing.md#housing-012) | 統合先あり | [v5.6.md Q3](../history/v5.6.md#q3) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.4.md Q4](../history/v5.4.md#q4) | 住宅の維持と劣化 | 住宅は建築後永久に劣化しない | 建築・領地・住宅 [HOUSING-015](11_building_housing.md#housing-015) | 統合先あり | [v5.5.md Q4](../history/v5.5.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.4.md Q5](../history/v5.4.md#q5) | 空き家不足時の移住住宅生成 | 入居可能な空き家がなく宅地を確保できれば無償新築し、土地がなければ別の移住先を検討する | 建築・領地・住宅 [HOUSING-008](11_building_housing.md#housing-008) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.5.md Q1](../history/v5.5.md#q1) | 住宅の賃貸料の決め方 | 立地・広さ・地域の需給・所有者の希望で家賃が変動する | 建築・領地・住宅 [HOUSING-016](11_building_housing.md#housing-016) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.5.md Q2](../history/v5.5.md#q2) | 住宅売買の価格 | 広さ・立地・地域需要・取引履歴を考慮して価格を決める | 建築・領地・住宅 [HOUSING-017](11_building_housing.md#housing-017) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.5.md Q3](../history/v5.5.md#q3) | 住宅の複数所有 | NPCは資金に応じて複数の住宅を所有・賃貸できる | 建築・領地・住宅 [HOUSING-018](11_building_housing.md#housing-018) | 統合先あり | [v5.6.md Q4](../history/v5.6.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.5.md Q4](../history/v5.5.md#q4) | 住宅の損壊と経年劣化の区別 | 災害・戦闘を含め住宅は一切損壊しない | 建築・領地・住宅 [HOUSING-015](11_building_housing.md#housing-015) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.5.md Q5](../history/v5.5.md#q5) | 移住者の空き家選択 | 価格・立地・広さ・家族構成・契約条件を比較して入居先を選ぶ | 建築・領地・住宅 [HOUSING-019](11_building_housing.md#housing-019) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.6.md Q1](../history/v5.6.md#q1) | 家賃の支払い周期 | ゲーム内の月ごとに家賃を支払い、契約内容に応じて更新する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 後続決定を反映 | 変更先 [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.6.md Q2](../history/v5.6.md#q2) | 家賃滞納時の扱い | 滞納しても契約に影響しない | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.6.md Q3](../history/v5.6.md#q3) | 住宅売買の成立条件 | 売主・買主双方の合意と支払能力が揃った場合に成立 | 建築・領地・住宅 [HOUSING-012](11_building_housing.md#housing-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.6.md Q4](../history/v5.6.md#q4) | 複数住宅の賃貸管理 | 所有者NPCが賃料・入居希望・空室を見て自律的に賃貸運用する | 建築・領地・住宅 [HOUSING-018](11_building_housing.md#housing-018) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.6.md Q5](../history/v5.6.md#q5) | 廃村化時の住宅所有権 | 建物削除と同時に住宅の所有権は消滅し、土地と取引の履歴のみ残す | 建築・領地・住宅 [HOUSING-022](11_building_housing.md#housing-022) | 統合先あり | [v5.7.md Q4](../history/v5.7.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.7.md Q1](../history/v5.7.md#q1) | 家賃未払い額の記録 | 滞納額は負債として記録するが契約継続・居住には影響させない | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.7.md Q2](../history/v5.7.md#q2) | 家賃滞納分の回収 | 入居者の資金に余裕ができた際に任意の返済・分割払いを行う | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.7.md Q3](../history/v5.7.md#q3) | 賃貸契約の終了条件 | 滞納以外の転居・合意解約・建物消滅などで終了する | 建築・領地・住宅 [HOUSING-023](11_building_housing.md#housing-023) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.7.md Q4](../history/v5.7.md#q4) | 廃村化時の賃貸契約 | 住宅削除と同時に賃貸契約を終了し、過去の契約履歴は残す | 建築・領地・住宅 [HOUSING-022](11_building_housing.md#housing-022) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.7.md Q5](../history/v5.7.md#q5) | 住宅所有者の収益の使い道 | NPCは賃貸収益を通常の資産として生活・消費・投資に使う | 建築・領地・住宅 [HOUSING-024](11_building_housing.md#housing-024) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.8.md Q1](../history/v5.8.md#q1) | 家賃負債の相続 | 借主が死亡した場合、未払い家賃は相続財産とともに相続順位に応じて扱う | 建築・領地・住宅 [HOUSING-025](11_building_housing.md#housing-025) | 統合先あり | [v6.0.md Q4](../history/v6.0.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.8.md Q2](../history/v5.8.md#q2) | 家賃負債の利息 | 未払い家賃に利息は付けず、元本のみを記録する | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.8.md Q3](../history/v5.8.md#q3) | 家賃の自動支払い優先度 | 生活必需費を確保したうえで余裕資金から当月家賃を支払う | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.8.md Q4](../history/v5.8.md#q4) | 所有者変更時の賃貸契約 | 住宅売買・相続で所有者が変わっても既存の賃貸契約を引き継ぐ | 建築・領地・住宅 [HOUSING-026](11_building_housing.md#housing-026) | 統合先あり | [v6.1.md Q4](../history/v6.1.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.8.md Q5](../history/v5.8.md#q5) | 賃貸収益の記録 | NPCの収支・資産履歴に家賃収入と滞納額を区別して記録する | 建築・領地・住宅 [HOUSING-027](11_building_housing.md#housing-027) | 統合先あり | [v6.0.md Q5](../history/v6.0.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.9.md Q1](../history/v5.9.md#q1) | 賃貸契約の家賃改定 | 契約更新時に市場相場・所有者と借主の合意を考慮して改定する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 後続決定を反映 | 変更先 [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.9.md Q2](../history/v5.9.md#q2) | 家賃滞納債権の所有者変更 | 住宅売買・相続時、過去の滞納債権は原則として旧所有者に残す | 建築・領地・住宅 [HOUSING-026](11_building_housing.md#housing-026) | 後続決定を反映 | 変更先 [v6.1.md Q4](../history/v6.1.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.9.md Q3](../history/v5.9.md#q3) | 借主死亡時の居住者 | 同居世帯員がいれば契約を引き継いで居住を継続できる | 建築・領地・住宅 [HOUSING-025](11_building_housing.md#housing-025) | 統合先あり | [v6.0.md Q4](../history/v6.0.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.9.md Q4](../history/v5.9.md#q4) | 家賃支払いと滞納返済の順序 | 余裕資金から当月家賃を優先し、さらに余裕があれば過去の滞納分を任意返済する | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | [v6.1.md Q5](../history/v6.1.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v5.9.md Q5](../history/v5.9.md#q5) | 住宅取引履歴の閲覧 | NPC・住宅・集落ごとに売買・賃貸・相続・滞納の履歴を参照できる | 建築・領地・住宅 [HOUSING-027](11_building_housing.md#housing-027) | 統合先あり | [v6.0.md Q5](../history/v6.0.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.0.md Q1](../history/v6.0.md#q1) | 契約更新の周期 | 賃貸契約は更新を一切行わない | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.0.md Q2](../history/v6.0.md#q2) | 家賃改定で合意できない場合 | 借主を即時退去させる | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 後続決定を反映 | 変更先 [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.0.md Q3](../history/v6.0.md#q3) | 滞納債権の譲渡 | 滞納債権は無条件に新所有者へ移る | 建築・領地・住宅 [HOUSING-026](11_building_housing.md#housing-026) | 統合先あり | [v6.1.md Q4](../history/v6.1.md#q4) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.0.md Q4](../history/v6.0.md#q4) | 相続人がいない家賃債務 | 借主死亡時に相続人がいなければ遺産の範囲で精算し、未回収分は回収不能として記録する | 建築・領地・住宅 [HOUSING-025](11_building_housing.md#housing-025) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.0.md Q5](../history/v6.0.md#q5) | 住宅取引履歴の保存範囲 | 住宅消滅後もNPC・集落の履歴に取引情報を残し、年代記から検索できる | 建築・領地・住宅 [HOUSING-027](11_building_housing.md#housing-027) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.1.md Q1](../history/v6.1.md#q1) | 契約更新なしでの家賃改定交渉 | 契約は自動継続し、所有者または借主の提案があった時だけ家賃改定を交渉する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.1.md Q2](../history/v6.1.md#q2) | 家賃改定の交渉頻度 | 改定提案は同じ住宅につきゲーム内1年に1回までとする | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.1.md Q3](../history/v6.1.md#q3) | 家賃改定の不合意と退去処理 | 不合意でも旧契約を永久に継続する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.1.md Q4](../history/v6.1.md#q4) | 滞納債権移転の記録 | 住宅の売買・相続時に債権者を新所有者へ変更し、移転前後の履歴を保存する | 建築・領地・住宅 [HOUSING-026](11_building_housing.md#housing-026) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.1.md Q5](../history/v6.1.md#q5) | 退去後の未払い家賃 | 退去後も未払い債務は残り、元の債権者への任意返済を続けられる | 建築・領地・住宅 [HOUSING-021](11_building_housing.md#housing-021) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.2.md Q1](../history/v6.2.md#q1) | 家賃改定の提案者 | 所有者と借主の双方が改定を提案でき、値上げ・値下げのどちらも交渉できる | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.2.md Q2](../history/v6.2.md#q2) | 改定提案の1年制限の起算点 | 毎年1月1日になれば直前の提案日を問わず再提案できる | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.2.md Q3](../history/v6.2.md#q3) | 家賃改定の合意成立時 | 合意した新家賃を次の月次支払日から適用し、既存契約は継続する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.2.md Q4](../history/v6.2.md#q4) | 住宅売買後の改定交渉 | 新所有者は従前の契約と改定提案の制限を引き継ぐ | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | [v6.2.md Q5](../history/v6.2.md#q5) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.2.md Q5](../history/v6.2.md#q5) | 交渉不成立の記録 | 改定の提案内容・当事者・結果を住宅取引履歴に記録する | 建築・領地・住宅 [HOUSING-020](11_building_housing.md#housing-020) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.3.md Q1](../history/v6.3.md#q1) | 家賃改定提案の年内枠の扱い | 未決定 | [要確認事項](../development/OPEN_QUESTIONS.md) | 保留 | — | 実装時確認 |
| [v6.3.md Q2](../history/v6.3.md#q2) | 改定提案への回答期限 | 未決定 | [要確認事項](../development/OPEN_QUESTIONS.md) | 保留 | — | 実装時確認 |
| [v6.3.md Q3](../history/v6.3.md#q3) | 改定交渉の合意判定 | 未決定 | [要確認事項](../development/OPEN_QUESTIONS.md) | 保留 | — | 実装時確認 |
| [v6.3.md Q4](../history/v6.3.md#q4) | 月次支払日が来る前の転居 | 未決定 | [要確認事項](../development/OPEN_QUESTIONS.md) | 保留 | — | 実装時確認 |
| [v6.3.md Q5](../history/v6.3.md#q5) | 賃貸契約の交渉履歴の公開範囲 | 未決定 | [要確認事項](../development/OPEN_QUESTIONS.md) | 保留 | — | 実装時確認 |
| [v6.4.md Q1](../history/v6.4.md#q1) | 冒険の主な目的 | 完全自由型：冒険・商売・建築・国家運営など、目標はプレイヤーが決める | ゲーム基本構想 [GAME-001](01_game_overview.md#game-001) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.4.md Q2](../history/v6.4.md#q2) | プレイヤーが世界に与える影響 | 大きく変わる：魔物の勢力、集落の存亡、国家の勢力図、NPCの人生まで変化する | ゲーム基本構想 [GAME-002](01_game_overview.md#game-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.4.md Q3](../history/v6.4.md#q3) | 探索を続ける最大の動機 | 世界の発見と変化：未知の土地、遺跡、魔物の生態、NPCや国家の出来事を追う | ゲーム基本構想 [GAME-003](01_game_overview.md#game-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.5.md Q1](../history/v6.5.md#q1) | 世界における魔物の勢力変化 | 魔物の巣や生息域は増減・移動し、放置や討伐によって危険地帯や安全地帯が変わる | 魔物・生態系 [ECO-010](09_ecosystem.md#eco-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.5.md Q2](../history/v6.5.md#q2) | 探索で発見した場所のその後 | 遺跡・資源地・隠れた土地などの発見がNPCの移住・交易・開拓・争奪にも波及する | 冒険・探索 [EXPLORE-009](03_exploration.md#explore-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.5.md Q3](../history/v6.5.md#q3) | 世界が変わった後の再探索 | 過去に訪れた地域にも新たな事件・勢力・施設・発見が生じ、再訪する意味がある | 冒険・探索 [EXPLORE-010](03_exploration.md#explore-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.6.md Q1](../history/v6.6.md#q1) | 探索情報の広まり方 | プレイヤーが発見した瞬間に世界中のNPCが情報を知る | NPC・生活AI [NPC-009](07_npc_ai.md#npc-009) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.6.md Q2](../history/v6.6.md#q2) | 大きな世界の変化への参加方法 | 魔物の侵攻・新天地の開拓・国家間の争いなどに、戦闘・交渉・交易・支援など複数の手段で介入できる | ゲーム基本構想 [GAME-004](01_game_overview.md#game-004) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.6.md Q3](../history/v6.6.md#q3) | 探索と生活拠点の関係 | 冒険で見つけた土地を拠点や開拓地にでき、世界の変化によってその拠点の価値や周辺環境も変わる | 建築・領地・住宅 [HOUSING-028](11_building_housing.md#housing-028) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.7.md Q1](../history/v6.7.md#q1) | 長距離移動と旅の体験 | 徒歩での探索を基本にしつつ、訪問済みの拠点・都市間には高速移動手段も用意する | 冒険・探索 [EXPLORE-005](03_exploration.md#explore-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.7.md Q2](../history/v6.7.md#q2) | ダンジョンの攻略後 | 攻略済みのダンジョンも世界に残り、再占拠・新たな住人・事件などで状態が変化する | 冒険・探索 [EXPLORE-003](03_exploration.md#explore-003) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.7.md Q3](../history/v6.7.md#q3) | プレイヤーが起こした重大な変化の扱い | 国家の滅亡や集落の消滅など大きな変化も原則そのまま歴史として残り、世界は新しい状態から進行する | ゲーム基本構想 [GAME-005](01_game_overview.md#game-005) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.8.md Q1](../history/v6.8.md#q1) | クエストと世界の出来事の関係 | 依頼は世界の状況と無関係に自動生成され、報酬を受け取れば完結する | クエスト・歴史 [QUEST-002](14_quests_history.md#quest-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.8.md Q2](../history/v6.8.md#q2) | NPCとの関係が冒険に与える影響 | 人間関係は会話や結婚にのみ影響し、冒険の展開には関係しない | クエスト・歴史 [QUEST-010](14_quests_history.md#quest-010) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.8.md Q3](../history/v6.8.md#q3) | プレイヤー不在で進む依頼の扱い | プレイヤーが受注した依頼だけ時間が止まり、いつでも同じ条件で開始できる | クエスト・歴史 [QUEST-011](14_quests_history.md#quest-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.9.md Q1](../history/v6.9.md#q1) | 敵の強さと地域の関係 | 全地域で敵の強さをほぼ均一にする | 戦闘 [COMBAT-002](04_combat.md#combat-002) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.9.md Q2](../history/v6.9.md#q2) | 強敵との遭遇と回避 | 強敵がいる危険地帯にも自由に入れるが、偵察・迂回・逃走などで戦闘を避けられる | 冒険・探索 [EXPLORE-011](03_exploration.md#explore-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v6.9.md Q3](../history/v6.9.md#q3) | 冒険者としての成長の幅 | 戦闘以外の探索・採集・製作・交易・交渉などの活動でも、それぞれの能力や選択肢が成長する | キャラクター成長 [GROWTH-011](05_character_growth.md#growth-011) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.0.md Q1](../history/v7.0.md#q1) | 探索中の環境障害 | 環境障害は特定のイベントやダンジョン内だけに登場する | 冒険・探索 [EXPLORE-012](03_exploration.md#explore-012) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.0.md Q2](../history/v7.0.md#q2) | 戦わずに進める探索 | 隠密・交渉・迂回・仕掛けの解除などで、戦闘せずに探索目標を達成できる場面を用意する | 冒険・探索 [EXPLORE-013](03_exploration.md#explore-013) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.0.md Q3](../history/v7.0.md#q3) | 未知の場所の発見方法 | 未知の場所は実際に近づいたときだけ発見できる | 冒険・探索 [EXPLORE-007](03_exploration.md#explore-007) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.1.md Q1](../history/v7.1.md#q1) | NPC冒険者による探索と攻略 | NPC冒険者も自律的に未知の土地やダンジョンを探索・攻略し、戦利品や発見を持ち帰る | 冒険・探索 [EXPLORE-014](03_exploration.md#explore-014) | 統合先あり | [v7.2.md Q1](../history/v7.2.md#q1) | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.1.md Q2](../history/v7.1.md#q2) | 遺跡やダンジョンの発見物 | 装備や素材に加え、固有の遺物・記録・知識など、戦闘力以外の価値を持つ発見もある | 冒険・探索 [EXPLORE-015](03_exploration.md#explore-015) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.1.md Q3](../history/v7.1.md#q3) | 発見物の所有と争奪 | 遺跡や資源地の発見物はプレイヤーとNPCがそれぞれ確保・利用でき、先に取られることもある | 冒険・探索 [EXPLORE-016](03_exploration.md#explore-016) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.2.md Q1](../history/v7.2.md#q1) | NPC冒険者とプレイヤーの競争・協力 | NPC冒険者は常に競争相手で、協力することはない | 冒険・探索 [EXPLORE-014](03_exploration.md#explore-014) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.2.md Q2](../history/v7.2.md#q2) | 探索で得た知識の活用 | 発見した記録・知識は、新たな製作・探索方法・施設・行動の解放などに利用できる | 冒険・探索 [EXPLORE-017](03_exploration.md#explore-017) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |
| [v7.2.md Q3](../history/v7.2.md#q3) | 冒険者としての名声 | 探索や討伐などの実績が冒険者としての名声に反映され、依頼や取引などの機会に影響する | 社会・人口 [SOCIETY-016](13_population_society.md#society-016) | 統合先あり | — | [個別論点](../development/OPEN_QUESTIONS.md)を参照 |

## 設問外の明示事項

- [v0.1.md 構想の出発点](../history/v0.1.md#構想の出発点) と [v0.2.md 確定した基本仕様](../history/v0.2.md#1-確定した基本仕様) の2D俯瞰・一人の冒険者・自律世界は [GAME-001](01_game_overview.md#game-001)、半自動リアルタイムは [COMBAT-001](04_combat.md#combat-001) に反映。
- [v0.3.md 今回確定した世界構造](../history/v0.3.md#1-今回確定した世界構造) の地形・建物・住民・歴史の保存は [WORLD-001](02_world.md#world-001) に反映。

### 本文から反映した追加条件

- [v0.4.md](../history/v0.4.md#6-世代交代の問題) 世代交代と時間経過 → [SYSTEM-003](15_game_system.md#system-003)
- [v0.5.md](../history/v0.5.md#3-npcの処理をどう成立させるか) 距離による処理切替の整合性 → [SYSTEM-012](15_game_system.md#system-012)
- [v0.6.md](../history/v0.6.md#q1) 地図表示の開示条件 → [EXPLORE-001](03_exploration.md#explore-001)
- [v0.7.md](../history/v0.7.md#2-半自動戦闘の基本構造) 半自動戦闘の基本構造 → [COMBAT-001](04_combat.md#combat-001)
- [v0.9.md](../history/v0.9.md#1-v08で確定した仕様) 巣の復活と攻略結果の保存 → [EXPLORE-003](03_exploration.md#explore-003)
- [v1.0.md](../history/v1.0.md#1-v09で確定した仕様) 確定した耐久度仕様 → [ITEM-002](06_items_equipment.md#item-002)
- [v0.9.md](../history/v0.9.md#4-製作と経済の接続) 製作と経済の接続 → [ITEM-004](06_items_equipment.md#item-004)
- [v1.2.md](../history/v1.2.md#当時の要件懸念検討の経緯) 統治に就いた後の冒険 → [NATION-004](12_nations_warfare.md#nation-004)
- [v3.2.md](../history/v3.2.md#当時の要件懸念検討の経緯) 雇用費用の支払時期 → [GROUP-009](08_companions_guilds.md#group-009)
- [v2.7.md](../history/v2.7.md#関連する決定と未確定事項) 再補充の未確定条件 → [EXPLORE-006](03_exploration.md#explore-006)
- [v3.3.md](../history/v3.3.md#当時の要件懸念検討の経緯) 成人年齢の未確定条件 → [SOCIETY-009](13_population_society.md#society-009)
- [v1.1.md](../history/v1.1.md#1-v10で確定した仕様) 保護の解除 → [GROUP-002](08_companions_guilds.md#group-002)
- [v1.1.md](../history/v1.1.md#1-v10で確定した仕様) 同行人数と描画負荷 → [GROUP-004](08_companions_guilds.md#group-004)
- [v1.2.md](../history/v1.2.md#1-v11で確定した仕様) 未所有地の定義 → [HOUSING-003](11_building_housing.md#housing-003)
- [v1.4.md](../history/v1.4.md#1-v13で確定した仕様) 共通法の範囲 → [NATION-008](12_nations_warfare.md#nation-008)
- [v1.4.md](../history/v1.4.md#当時の要件懸念検討の経緯) 評判・犯罪の影響範囲 → [SOCIETY-004](13_population_society.md#society-004)

- [v1.5.md](../history/v1.5.md) 通常速度の換算 → [SYSTEM-002](15_game_system.md#system-002)
- [v1.5.md](../history/v1.5.md) 長期スキップ中の世界更新 → [SYSTEM-005](15_game_system.md#system-005)
- [v1.7.md](../history/v1.7.md) 移動入力の方式 → [SYSTEM-008](15_game_system.md#system-008)
- [v1.8.md](../history/v1.8.md) セーブの対象範囲 → [SYSTEM-011](15_game_system.md#system-011)
- [v1.8.md](../history/v1.8.md) 世代交代で維持する状態 → [SYSTEM-010](15_game_system.md#system-010)
- [v1.9.md](../history/v1.9.md) 生成する地域差 → [WORLD-006](02_world.md#world-006)
- [v2.0.md](../history/v2.0.md) シミュレーションの対象 → [SYSTEM-012](15_game_system.md#system-012)
- [v2.0.md](../history/v2.0.md) 遠方のイベントと個別履歴 → [QUEST-001](14_quests_history.md#quest-001)
- [v2.3.md](../history/v2.3.md) 在庫の実体 → [ECONOMY-004](10_economy.md#economy-004)
- [v2.4.md](../history/v2.4.md) MPの回復 → [COMBAT-005](04_combat.md#combat-005)
- [v2.4.md](../history/v2.4.md) 難易度補正の適用範囲 → [COMBAT-003](04_combat.md#combat-003)
- [v6.8.md](../history/v6.8.md) 依頼進行の実装時確認 → [QUEST-011](14_quests_history.md#quest-011)
- [v4.0.md](../history/v4.0.md) 兵士数と総合戦力 → [NATION-020](12_nations_warfare.md#nation-020)
- [v4.7.md](../history/v4.7.md) NPCの移住判断 → [SOCIETY-008](13_population_society.md#society-008)
- [v5.9.md](../history/v5.9.md) 取引で移る権利の区別 → [HOUSING-026](11_building_housing.md#housing-026)

- [v2.6.md](../history/v2.6.md#1-v25で確定した仕様) 1. v2.5で確定した仕様 → [ITEM-009](06_items_equipment.md#item-009)
- [v2.5.md](../history/v2.5.md#4-戦利品と世界経済の関係) 4. 戦利品と世界経済の関係 → [ITEM-006](06_items_equipment.md#item-006)
- [v2.5.md](../history/v2.5.md#1-v24で確定した仕様) 1. v2.4で確定した仕様 → [COMBAT-007](04_combat.md#combat-007)
- [v2.8.md](../history/v2.8.md#1-v27で確定した仕様) 1. v2.7で確定した仕様 → [NPC-009](07_npc_ai.md#npc-009)
- [v3.0.md](../history/v3.0.md#1-v29で確定した仕様) 1. v2.9で確定した仕様 → [NATION-012](12_nations_warfare.md#nation-012)
- [v3.2.md](../history/v3.2.md#1-v31で確定した仕様) 1. v3.1で確定した仕様 → [GROUP-009](08_companions_guilds.md#group-009)
- [v3.3.md](../history/v3.3.md#1-v32で確定した仕様) 1. v3.2で確定した仕様 → [SOCIETY-009](13_population_society.md#society-009)
- [v3.4.md](../history/v3.4.md#1-v33で確定した仕様) 1. v3.3で確定した仕様 → [SYSTEM-010](15_game_system.md#system-010)
- [v3.7.md](../history/v3.7.md#1-v36で確定した仕様) 1. v3.6で確定した仕様 → [ECO-009](09_ecosystem.md#eco-009)
- [v3.8.md](../history/v3.8.md#1-v37で確定した仕様) 1. v3.7で確定した仕様 → [ECONOMY-004](10_economy.md#economy-004)
- [v3.8.md](../history/v3.8.md#4-v38で確定したい5項目) 4. v3.8で確定したい5項目 → [ECONOMY-014](10_economy.md#economy-014)
- [v3.9.md](../history/v3.9.md#確定内容の補足) 確定内容の補足 → [NATION-016](12_nations_warfare.md#nation-016)
- [v3.9.md](../history/v3.9.md#確定内容の補足) 確定内容の補足 → [NATION-018](12_nations_warfare.md#nation-018)
- [v4.1.md](../history/v4.1.md#確定内容の補足) 確定内容の補足 → [NATION-024](12_nations_warfare.md#nation-024)
- [v5.3.md](../history/v5.3.md#確定内容の補足) 確定内容の補足 → [HOUSING-011](11_building_housing.md#housing-011)
- [v5.8.md](../history/v5.8.md#確定内容の補足) 確定内容の補足 → [HOUSING-027](11_building_housing.md#housing-027)
- [v6.7.md](../history/v6.7.md#確定方針の解釈) 確定方針の解釈 → [EXPLORE-003](03_exploration.md#explore-003)
- [v7.0.md](../history/v7.0.md#確定方針の解釈) 確定方針の解釈 → [EXPLORE-012](03_exploration.md#explore-012)
- [v7.2.md](../history/v7.2.md#確定方針と再開地点) 確定方針と再開地点 → [SOCIETY-016](13_population_society.md#society-016)
- [v3.1.md](../history/v3.1.md#3-仲間と雇用についての既存仕様) 3. 仲間と雇用についての既存仕様 → [GROUP-003](08_companions_guilds.md#group-003)
- [v3.1.md](../history/v3.1.md#1-v30で確定した仕様) 1. v3.0で確定した仕様 → [HOUSING-004](11_building_housing.md#housing-004)

## 個別開発時の追加決定

- [2026-11-26 武器の攻撃間隔と槌](../history/2026-11-26-weapon-speed.md) → [ITEM-001](06_items_equipment.md#item-001)

### 番号付き原資料の後に追加した決定

| 原資料 | 対応する統合仕様 | 現行実装 |
|---|---|---|
| [2026-11-27 野外のチャンク管理とMOB](../history/2026-11-27-field-mobs.md) | [世界・マップ](02_world.md)、[ECO-001/002/005/007](09_ecosystem.md#eco-001) | CUR-WORLD-007、CUR-COMBAT-001〜006、CUR-SYS-004 |
