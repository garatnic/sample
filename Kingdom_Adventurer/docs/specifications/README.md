# Kingdom Adventurer 分野別統合仕様

対象は[履歴](../history/README.md)の v0.1〜v7.2。基準コミットは `e7eefefa63175eb1f88fa128be1293244e727b8a`。

## 実装・変更時の原資料確認義務

本資料は、historyフォルダに保存された仕様検討履歴を分野別に整理・統合したものであり、原資料を代替するものではない。

本資料に記載された仕様について、新規実装、既存実装の変更、修正、拡張、設計判断を行う場合は、作業着手前に、対象仕様の出典として記載されたhistory内の原資料を必ず全文確認すること。

統合仕様書のみを参照して実装することは禁止する。

原資料に記載された要件、採用理由、ユーザーの補足、適用条件、例外、後続の変更内容を確認し、仕様の意図を損なわないようにすること。

統合仕様書と原資料の内容に相違がある場合は、原資料におけるユーザーの最新の明示的な決定を優先すること。

ただし、原資料同士に矛盾があり、最新の有効な仕様を明確に判断できない場合は、独自判断で解決せず、要確認事項として記録すること。

この確認義務は、人間の開発者とAIによる自律開発の双方に適用する。

| 仕様書 | 担当範囲 | 関連仕様書 | 項目数 |
| --- | --- | --- | ---: |
| [ゲーム基本構想](01_game_overview.md) | 目的、自由度、世界介入の方針 | [世界・マップ](02_world.md)・[冒険・探索](03_exploration.md)・[国家・政治・戦争](12_nations_warfare.md)・[クエスト・歴史](14_quests_history.md)・[ゲーム基盤](15_game_system.md) | 5 |
| [世界・マップ](02_world.md) | 世界生成、規模、地形、マップ構造 | [冒険・探索](03_exploration.md)・[魔物・生態系](09_ecosystem.md)・[国家・政治・戦争](12_nations_warfare.md)・[ゲーム基盤](15_game_system.md) | 8 |
| [冒険・探索](03_exploration.md) | 移動、発見、ダンジョン、NPC冒険者 | [世界・マップ](02_world.md)・[戦闘](04_combat.md)・[装備・アイテム](06_items_equipment.md)・[NPC・生活AI](07_npc_ai.md)・[仲間・組織](08_companions_guilds.md)・[魔物・生態系](09_ecosystem.md)・[建築・領地・住宅](11_building_housing.md)・[クエスト・歴史](14_quests_history.md) | 17 |
| [戦闘](04_combat.md) | 戦闘操作、敵AI、難度、魔法 | [冒険・探索](03_exploration.md)・[キャラクター成長](05_character_growth.md)・[装備・アイテム](06_items_equipment.md)・[仲間・組織](08_companions_guilds.md)・[魔物・生態系](09_ecosystem.md)・[ゲーム基盤](15_game_system.md) | 10 |
| [キャラクター成長](05_character_growth.md) | キャラクター作成、レベル、技能の成長 | [冒険・探索](03_exploration.md)・[戦闘](04_combat.md)・[装備・アイテム](06_items_equipment.md)・[仲間・組織](08_companions_guilds.md)・[社会・人口](13_population_society.md)・[ゲーム基盤](15_game_system.md) | 11 |
| [装備・アイテム](06_items_equipment.md) | 装備、戦利品、所持、アイテム永続性 | [冒険・探索](03_exploration.md)・[戦闘](04_combat.md)・[キャラクター成長](05_character_growth.md)・[経済・産業](10_economy.md) | 9 |
| [NPC・生活AI](07_npc_ai.md) | 個人データ、生活判断、関係、会話 | [冒険・探索](03_exploration.md)・[仲間・組織](08_companions_guilds.md)・[経済・産業](10_economy.md)・[社会・人口](13_population_society.md)・[クエスト・歴史](14_quests_history.md)・[ゲーム基盤](15_game_system.md) | 12 |
| [仲間・組織](08_companions_guilds.md) | 同行、雇用、指示、ギルド | [冒険・探索](03_exploration.md)・[戦闘](04_combat.md)・[キャラクター成長](05_character_growth.md)・[NPC・生活AI](07_npc_ai.md)・[国家・政治・戦争](12_nations_warfare.md) | 9 |
| [魔物・生態系](09_ecosystem.md) | 巣、野生動物、危険度、資源再生 | [世界・マップ](02_world.md)・[冒険・探索](03_exploration.md)・[戦闘](04_combat.md)・[経済・産業](10_economy.md)・[社会・人口](13_population_society.md) | 10 |
| [経済・産業](10_economy.md) | 価格、通貨、生産、商店、物流 | [装備・アイテム](06_items_equipment.md)・[NPC・生活AI](07_npc_ai.md)・[建築・領地・住宅](11_building_housing.md)・[国家・政治・戦争](12_nations_warfare.md)・[社会・人口](13_population_society.md) | 14 |
| [建築・領地・住宅](11_building_housing.md) | 建築、土地・住宅、賃貸、債権 | [世界・マップ](02_world.md)・[冒険・探索](03_exploration.md)・[経済・産業](10_economy.md)・[国家・政治・戦争](12_nations_warfare.md)・[社会・人口](13_population_society.md)・[クエスト・歴史](14_quests_history.md) | 28 |
| [国家・政治・戦争](12_nations_warfare.md) | 統治、外交、領土、戦争、犯罪 | [世界・マップ](02_world.md)・[戦闘](04_combat.md)・[仲間・組織](08_companions_guilds.md)・[経済・産業](10_economy.md)・[建築・領地・住宅](11_building_housing.md)・[社会・人口](13_population_society.md)・[クエスト・歴史](14_quests_history.md) | 37 |
| [社会・人口](13_population_society.md) | 人口、家族、移住、集落、評判 | [NPC・生活AI](07_npc_ai.md)・[経済・産業](10_economy.md)・[建築・領地・住宅](11_building_housing.md)・[国家・政治・戦争](12_nations_warfare.md)・[クエスト・歴史](14_quests_history.md) | 16 |
| [クエスト・歴史](14_quests_history.md) | クエスト、イベント、年代記 | [ゲーム基本構想](01_game_overview.md)・[冒険・探索](03_exploration.md)・[NPC・生活AI](07_npc_ai.md)・[建築・領地・住宅](11_building_housing.md)・[国家・政治・戦争](12_nations_warfare.md)・[社会・人口](13_population_society.md)・[ゲーム基盤](15_game_system.md) | 11 |
| [ゲーム基盤](15_game_system.md) | 時間、セーブ、世代継続、操作、世界処理 | [ゲーム基本構想](01_game_overview.md)・[世界・マップ](02_world.md)・[戦闘](04_combat.md)・[NPC・生活AI](07_npc_ai.md)・[社会・人口](13_population_society.md)・[クエスト・歴史](14_quests_history.md) | 14 |

## 管理資料

- [原資料と統合仕様の対応表](coverage-index.md)
- [矛盾・保留・要確認事項](../development/OPEN_QUESTIONS.md)
- [作業状況](../development/DEVELOPMENT_STATUS.md)

## 更新方針

新しい決定は履歴に追記し、該当分野の本文・出典・対応表・関連仕様を更新する。既存の仕様IDは維持し、新規仕様に未使用IDを付ける。変更・廃止の根拠と反映先を対応表に残す。未決定の条件は要確認事項に記録する。

## 追加横断仕様
- [国家経済・国際交易・自由民（TRADE-001〜006）](TRADE_FREE_PEOPLE_SPECIFICATION.md)：2026-11-28追加決定。TRADE-001〜003は実装済み。既存15分野の横断的な段階実装仕様。
