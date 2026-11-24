# NPC・生活AI

## 実装・変更時の原資料確認義務

本資料は、historyフォルダに保存された仕様検討履歴を分野別に整理・統合したものであり、原資料を代替するものではない。

本資料に記載された仕様について、新規実装、既存実装の変更、修正、拡張、設計判断を行う場合は、作業着手前に、対象仕様の出典として記載されたhistory内の原資料を必ず全文確認すること。

統合仕様書のみを参照して実装することは禁止する。

原資料に記載された要件、採用理由、ユーザーの補足、適用条件、例外、後続の変更内容を確認し、仕様の意図を損なわないようにすること。

統合仕様書と原資料の内容に相違がある場合は、原資料におけるユーザーの最新の明示的な決定を優先すること。

ただし、原資料同士に矛盾があり、最新の有効な仕様を明確に判断できない場合は、独自判断で解決せず、要確認事項として記録すること。

この確認義務は、人間の開発者とAIによる自律開発の双方に適用する。

[仕様書索引](README.md) · [網羅性確認](coverage-index.md) · [要確認事項](../development/OPEN_QUESTIONS.md)

関連分野 [冒険・探索](03_exploration.md) · [仲間・組織](08_companions_guilds.md) · [経済・産業](10_economy.md) · [社会・人口](13_population_society.md) · [クエスト・歴史](14_quests_history.md) · [ゲーム基盤](15_game_system.md)

<a id="npc-001"></a>

## NPC-001 NPCの個人情報

- 全NPCに個人情報を保持。
- 全NPCの個人情報・家族・財産・履歴を保持。
保持・参照する個人情報の範囲には、基本属性、職業・所属・居住地・財産、能力・技能、性格、家族と人間関係、主要な経歴が含まれる。人物ごとの仮の数値や例示は履歴を参照する。

**出典**

- [v0.3.md](../history/v0.3.md#2-npcの個人情報) 個人情報の6分類
- [v0.3.md Q1](../history/v0.3.md#q1) NPCの個人情報 ／ 採用「全NPCに個人情報を保持」
- [v2.0.md Q2](../history/v2.0.md#q2) NPCの個人データ ／ 採用「全NPCの個人情報・家族・財産・履歴を保持」

**関連仕様** [SOCIETY-001](13_population_society.md#society-001) · [SOCIETY-002](13_population_society.md#society-002) · [SYSTEM-002](15_game_system.md#system-002) · [SYSTEM-012](15_game_system.md#system-012) · [SYSTEM-013](15_game_system.md#system-013) · [SYSTEM-014](15_game_system.md#system-014) · [QUEST-001](14_quests_history.md#quest-001)

<a id="npc-002"></a>

## NPC-002 人間関係と友好度

人間関係は動的に変化し、友情・恋愛・対立・協力などの関係を扱う。友好度の数値は単一で、行動・会話・取引・時間経過で変動する。

**出典**

- [v0.3.md Q5](../history/v0.3.md#q5) NPC同士の人間関係 ／ 採用「NPC同士も動的に変化」
- [v0.4.md Q3](../history/v0.4.md#q3) NPC同士の関係 ／ 採用「友情・恋愛・対立・協力まで扱う」
- [v2.7.md Q4](../history/v2.7.md#q4) NPC同士の人間関係 ／ 採用「友好度の単一数値」
- [v2.8.md Q5](../history/v2.8.md#q5) 友好度の変化 ／ 採用「行動・会話・取引・時間経過で変化」

**関連仕様** [SOCIETY-001](13_population_society.md#society-001) · [SOCIETY-002](13_population_society.md#society-002) · [SYSTEM-002](15_game_system.md#system-002) · [ECONOMY-001](10_economy.md#economy-001) · [QUEST-001](14_quests_history.md#quest-001) · [SYSTEM-003](15_game_system.md#system-003) · [QUEST-008](14_quests_history.md#quest-008)

<a id="npc-003"></a>

## NPC-003 NPCの職業・移住

- 自律的な転職・独立・移住あり。
- 能力・希望・求人・経済状況に応じて自由に転職。

**出典**

- [v0.4.md Q1](../history/v0.4.md#q1) NPCの職業・移住 ／ 採用「自律的な転職・独立・移住あり」
- [v3.2.md Q1](../history/v3.2.md#q1) NPCの職業変更 ／ 採用「能力・希望・求人・経済状況に応じて自由に転職」

**関連仕様** [ECONOMY-001](10_economy.md#economy-001) · [QUEST-001](14_quests_history.md#quest-001) · [SYSTEM-003](15_game_system.md#system-003) · [SOCIETY-009](13_population_society.md#society-009) · [SOCIETY-010](13_population_society.md#society-010) · [SOCIETY-011](13_population_society.md#society-011) · [GROWTH-007](05_character_growth.md#growth-007)

<a id="npc-004"></a>

## NPC-004 NPCとの交流

- 友情・恋愛・結婚・雇用まで可能。

**出典**

- [v0.5.md Q4](../history/v0.5.md#q4) NPCとの交流 ／ 採用「友情・恋愛・結婚・雇用まで可能」

**関連仕様** [HOUSING-001](11_building_housing.md#housing-001) · [ECONOMY-002](10_economy.md#economy-002) · [NATION-001](12_nations_warfare.md#nation-001) · [QUEST-002](14_quests_history.md#quest-002)

<a id="npc-005"></a>

## NPC-005 NPCの犯罪行動

- NPCも自律的に犯罪・捜査・逮捕。

**出典**

- [v1.3.md Q5](../history/v1.3.md#q5) NPCの犯罪行動 ／ 採用「NPCも自律的に犯罪・捜査・逮捕」

**関連仕様** [NATION-007](12_nations_warfare.md#nation-007) · [NATION-008](12_nations_warfare.md#nation-008) · [SOCIETY-004](13_population_society.md#society-004) · [NATION-009](12_nations_warfare.md#nation-009)

<a id="npc-006"></a>

## NPC-006 NPCの性格

- 複数の性格パラメータを組み合わせる。

**出典**

- [v2.7.md Q1](../history/v2.7.md#q1) NPCの性格 ／ 採用「複数の性格パラメータを組み合わせる」

<a id="npc-007"></a>

## NPC-007 NPCの人生の目標

- 状況や経験に応じて目標が変化。

**出典**

- [v2.7.md Q2](../history/v2.7.md#q2) NPCの人生の目標 ／ 採用「状況や経験に応じて目標が変化」

<a id="npc-008"></a>

## NPC-008 NPCの記憶

- 重要な出来事や人物との関係を長期記憶。

**出典**

- [v2.7.md Q3](../history/v2.7.md#q3) NPCの記憶 ／ 採用「重要な出来事や人物との関係を長期記憶」

<a id="npc-009"></a>

## NPC-009 NPCの情報認識と発見の即時共有

NPCは世界情報を把握し、噂は会話・演出に利用する。プレイヤーが場所を発見した瞬間に世界中のNPCがその情報を知る。報告・売却・共有操作は不要。移住・交易・開拓等の実行は、その情報を使ったNPC自身の判断に従う。

**出典**

- [v2.7.md Q5](../history/v2.7.md#q5) NPCが知っている情報の範囲 ／ 採用「世界の全情報を把握」
- [v2.8.md Q4](../history/v2.8.md#q4) 噂・情報の扱い ／ 採用「世界情報は共有し、噂は会話・演出に利用」
- [v6.6.md Q1](../history/v6.6.md#q1) 探索情報の広まり方 ／ 採用「プレイヤーが発見した瞬間に世界中のNPCが情報を知る」

**関連仕様** [QUEST-008](14_quests_history.md#quest-008) · [GAME-004](01_game_overview.md#game-004) · [HOUSING-028](11_building_housing.md#housing-028)

<a id="npc-010"></a>

## NPC-010 NPCとの会話方式

- 状況に応じた選択肢式会話。

**出典**

- [v2.8.md Q1](../history/v2.8.md#q1) NPCとの会話方式 ／ 採用「状況に応じた選択肢式会話」

**関連仕様** [QUEST-008](14_quests_history.md#quest-008)

<a id="npc-011"></a>

## NPC-011 交渉の成否と条件

- 交渉技能・友好度・性格・状況に応じる。

**出典**

- [v2.8.md Q2](../history/v2.8.md#q2) 交渉の成否と条件 ／ 採用「交渉技能・友好度・性格・状況に応じる」

**関連仕様** [QUEST-008](14_quests_history.md#quest-008)

<a id="npc-012"></a>

## NPC-012 移住後の就職

仕事がなくても移住できる。移住後は求人・技能・賃金から求職し、見つからなければ一時的に無職となる。

**出典**

- [v4.8.md Q2](../history/v4.8.md#q2) 移住先の住居と仕事 ／ 採用「住居・仕事がなくても移住し、その後自動で確保される」
- [v4.9.md Q2](../history/v4.9.md#q2) 移住後の就職 ／ 採用「求人・技能・賃金を考慮して就職活動し、見つからなければ一時的に無職」

**関連仕様** [SOCIETY-008](13_population_society.md#society-008) · [SOCIETY-013](13_population_society.md#society-013) · [SOCIETY-014](13_population_society.md#society-014) · [QUEST-001](14_quests_history.md#quest-001) · [HOUSING-008](11_building_housing.md#housing-008)
