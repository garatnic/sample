# ゲーム基盤

## 実装・変更時の原資料確認義務

本資料は、historyフォルダに保存された仕様検討履歴を分野別に整理・統合したものであり、原資料を代替するものではない。

本資料に記載された仕様について、新規実装、既存実装の変更、修正、拡張、設計判断を行う場合は、作業着手前に、対象仕様の出典として記載されたhistory内の原資料を必ず全文確認すること。

統合仕様書のみを参照して実装することは禁止する。

原資料に記載された要件、採用理由、ユーザーの補足、適用条件、例外、後続の変更内容を確認し、仕様の意図を損なわないようにすること。

統合仕様書と原資料の内容に相違がある場合は、原資料におけるユーザーの最新の明示的な決定を優先すること。

ただし、原資料同士に矛盾があり、最新の有効な仕様を明確に判断できない場合は、独自判断で解決せず、要確認事項として記録すること。

この確認義務は、人間の開発者とAIによる自律開発の双方に適用する。

[仕様書索引](README.md) · [網羅性確認](coverage-index.md) · [要確認事項](../development/OPEN_QUESTIONS.md)

関連分野 [ゲーム基本構想](01_game_overview.md) · [世界・マップ](02_world.md) · [戦闘](04_combat.md) · [NPC・生活AI](07_npc_ai.md) · [社会・人口](13_population_society.md) · [クエスト・歴史](14_quests_history.md)

<a id="system-001"></a>

## SYSTEM-001 戦闘で死亡した場合

戦闘不能・戦闘死後は拠点で復活し、所持金のみ少額減る。経験値・所持品の喪失は旧決定。寿命による交代とは別に扱う。

**出典**

- [v0.1.md Q3](../history/v0.1.md#q3) プレイヤー死亡時 ／ 採用「ペナルティ付き復活」
- [v0.7.md Q3](../history/v0.7.md#q3) プレイヤー死亡時 ／ 採用「拠点で復活・所持品や経験値を損失」（後続決定で変更。現行本文を適用）
- [v3.3.md Q4](../history/v3.3.md#q4) 戦闘で死亡した場合 ／ 採用「拠点で復活し、所持金のみ少額減少」

**関連仕様** [WORLD-001](02_world.md#world-001) · [GROWTH-001](05_character_growth.md#growth-001) · [GROUP-001](08_companions_guilds.md#group-001) · [COMBAT-002](04_combat.md#combat-002) · [COMBAT-003](04_combat.md#combat-003) · [GROUP-002](08_companions_guilds.md#group-002) · [GROUP-003](08_companions_guilds.md#group-003)

<a id="system-002"></a>

## SYSTEM-002 ゲーム内時間の進み方

- 現実30分＝ゲーム1日。

**出典**

- [v0.3.md Q4](../history/v0.3.md#q4) ゲーム内時間の進み方 ／ 採用「現実30分＝ゲーム1日」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [SOCIETY-001](13_population_society.md#society-001) · [SOCIETY-002](13_population_society.md#society-002) · [NPC-002](07_npc_ai.md#npc-002)

<a id="system-003"></a>

## SYSTEM-003 時間を進める機能

- 宿泊・待機・長期間の時間経過あり。

**出典**

- [v0.4.md Q5](../history/v0.4.md#q5) 時間を進める機能 ／ 採用「宿泊・待機・長期間の時間経過あり」

**関連仕様** [NPC-003](07_npc_ai.md#npc-003) · [ECONOMY-001](10_economy.md#economy-001) · [NPC-002](07_npc_ai.md#npc-002) · [QUEST-001](14_quests_history.md#quest-001)

<a id="system-004"></a>

## SYSTEM-004 時間の操作

- 一時停止・通常速度・早送り。

**出典**

- [v1.5.md Q4](../history/v1.5.md#q4) 時間の操作 ／ 採用「一時停止・通常速度・早送り」

**関連仕様** [EXPLORE-004](03_exploration.md#explore-004) · [EXPLORE-005](03_exploration.md#explore-005)

<a id="system-005"></a>

## SYSTEM-005 長期間の時間スキップ

- 安全な場所でのみ可能。

**出典**

- [v1.5.md Q5](../history/v1.5.md#q5) 長期間の時間スキップ ／ 採用「安全な場所でのみ可能」

**関連仕様** [EXPLORE-004](03_exploration.md#explore-004) · [EXPLORE-005](03_exploration.md#explore-005)

<a id="system-006"></a>

## SYSTEM-006 対応環境

- PC・スマホ両対応。

**出典**

- [v1.6.md Q1](../history/v1.6.md#q1) 対応環境 ／ 採用「PC・スマホ両対応」

**関連仕様** [COMBAT-001](04_combat.md#combat-001)

<a id="system-007"></a>

## SYSTEM-007 カメラ操作

- 追従＋ズーム・視点移動可能。

**出典**

- [v1.6.md Q2](../history/v1.6.md#q2) カメラ操作 ／ 採用「追従＋ズーム・視点移動可能」

**関連仕様** [COMBAT-001](04_combat.md#combat-001)

<a id="system-008"></a>

## SYSTEM-008 移動操作

- 直接移動（キーボード・パッド・仮想スティック）。

**出典**

- [v1.6.md Q3](../history/v1.6.md#q3) 移動操作 ／ 採用「直接移動（キーボード・パッド・仮想スティック）」

**関連仕様** [COMBAT-001](04_combat.md#combat-001)

<a id="system-009"></a>

## SYSTEM-009 UIのカスタマイズ

- 表示項目・配置・サイズを変更可能。

**出典**

- [v1.6.md Q5](../history/v1.6.md#q5) UIのカスタマイズ ／ 採用「表示項目・配置・サイズを変更可能」

**関連仕様** [COMBAT-001](04_combat.md#combat-001)

<a id="system-010"></a>

## SYSTEM-010 主人公の加齢・後継者・同一世界の継続

主人公も種族ごとの寿命に従い加齢・老衰する。寿命後は子供・家族・弟子・仲間などから後継者を選び、財産を継承する。地位は失い、能力は後継者自身のもの。候補がいなければ同じ世界で新規キャラクターを作成する。どちらでも世界状態と歴史をすべて保持する。

**出典**

- [v1.7.md Q5](../history/v1.7.md#q5) 主人公の加齢 ／ 採用「NPCと同じく加齢・寿命あり」
- [v1.8.md Q1](../history/v1.8.md#q1) 主人公が寿命を迎えた後 ／ 採用「後継者を選び、同じ世界を継続」
- [v1.8.md Q2](../history/v1.8.md#q2) 後継者の候補 ／ 採用「子供・家族・弟子・仲間など」
- [v1.8.md Q3](../history/v1.8.md#q3) 継承するもの ／ 採用「財産・地位を相続、能力は後継者自身」（後続決定で変更。現行本文を適用）
- [v1.8.md Q5](../history/v1.8.md#q5) 世代交代後の世界 ／ 採用「世界の状態・歴史をすべて維持」
- [v3.3.md Q1](../history/v3.3.md#q1) プレイヤーの寿命 ／ 採用「種族ごとの寿命に従い加齢・老衰」
- [v3.3.md Q2](../history/v3.3.md#q2) 後継者の選択範囲 ／ 採用「家族・子供・弟子・仲間などから自由に選択」
- [v3.3.md Q3](../history/v3.3.md#q3) 財産・地位の継承 ／ 採用「財産のみ継承し地位は失う」
- [v3.3.md Q5](../history/v3.3.md#q5) 後継者がいない場合 ／ 採用「同じ世界で新しい冒険者を作成して継続」

**関連仕様** [GROWTH-003](05_character_growth.md#growth-003) · [GROWTH-004](05_character_growth.md#growth-004) · [GROWTH-005](05_character_growth.md#growth-005) · [WORLD-004](02_world.md#world-004)

<a id="system-011"></a>

## SYSTEM-011 セーブ方式

- オートセーブ＋手動セーブ。

**出典**

- [v1.8.md Q4](../history/v1.8.md#q4) セーブ方式 ／ 採用「オートセーブ＋手動セーブ」

<a id="system-012"></a>

## SYSTEM-012 世界シミュレーションの処理方式

- 周辺詳細・近隣簡略・遠方集約の3段階。

**出典**

- [v2.0.md Q1](../history/v2.0.md#q1) 世界シミュレーションの処理方式 ／ 採用「周辺詳細・近隣簡略・遠方集約の3段階」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [QUEST-001](14_quests_history.md#quest-001)

<a id="system-013"></a>

## SYSTEM-013 プレイヤー不在地域の出来事

- 経済・出生死亡・移住・戦争など自律進行。

**出典**

- [v2.0.md Q3](../history/v2.0.md#q3) プレイヤー不在地域の出来事 ／ 採用「経済・出生死亡・移住・戦争など自律進行」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [QUEST-001](14_quests_history.md#quest-001)

<a id="system-014"></a>

## SYSTEM-014 PC・スマホの処理負荷対策

- 端末性能に応じて更新頻度・描画数を自動調整。

**出典**

- [v2.0.md Q4](../history/v2.0.md#q4) PC・スマホの処理負荷対策 ／ 採用「端末性能に応じて更新頻度・描画数を自動調整」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [QUEST-001](14_quests_history.md#quest-001)
