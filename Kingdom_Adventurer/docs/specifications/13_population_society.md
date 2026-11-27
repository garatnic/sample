# 社会・人口

## 実装・変更時の原資料確認義務

本資料は、historyフォルダに保存された仕様検討履歴を分野別に整理・統合したものであり、原資料を代替するものではない。

本資料に記載された仕様について、新規実装、既存実装の変更、修正、拡張、設計判断を行う場合は、作業着手前に、対象仕様の出典として記載されたhistory内の原資料を必ず全文確認すること。

統合仕様書のみを参照して実装することは禁止する。

原資料に記載された要件、採用理由、ユーザーの補足、適用条件、例外、後続の変更内容を確認し、仕様の意図を損なわないようにすること。

統合仕様書と原資料の内容に相違がある場合は、原資料におけるユーザーの最新の明示的な決定を優先すること。

ただし、原資料同士に矛盾があり、最新の有効な仕様を明確に判断できない場合は、独自判断で解決せず、要確認事項として記録すること。

この確認義務は、人間の開発者とAIによる自律開発の双方に適用する。

[仕様書索引](README.md) · [網羅性確認](coverage-index.md) · [要確認事項](../development/OPEN_QUESTIONS.md)

関連分野 [NPC・生活AI](07_npc_ai.md) · [経済・産業](10_economy.md) · [建築・領地・住宅](11_building_housing.md) · [国家・政治・戦争](12_nations_warfare.md) · [クエスト・歴史](14_quests_history.md)

<a id="society-001"></a>

## SOCIETY-001 家族・世代交代

- 結婚・出産・成長・世代交代あり。

**出典**

- [v0.3.md Q2](../history/v0.3.md#q2) 家族・世代交代 ／ 採用「結婚・出産・成長・世代交代あり」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [SYSTEM-002](15_game_system.md#system-002) · [NPC-002](07_npc_ai.md#npc-002)

<a id="society-002"></a>

## SOCIETY-002 NPCの死亡

- 永久死亡あり。
雇用・同行中の仲間については [GROUP-002](08_companions_guilds.md#group-002) の永久死亡保護を適用する。

**出典**

- [v1.0.md Q5](../history/v1.0.md#q5) 同行・雇用中のみ永久死亡を保護
- [v0.3.md Q3](../history/v0.3.md#q3) NPCの死亡 ／ 採用「永久死亡あり」

**関連仕様** [NPC-001](07_npc_ai.md#npc-001) · [SYSTEM-002](15_game_system.md#system-002) · [NPC-002](07_npc_ai.md#npc-002)

<a id="society-003"></a>

## SOCIETY-003 集落の自律発展

- NPCが自律的に建築・移住・発展。
- 人口・資源・経済に応じて自然に変化。
- 需要・資金・土地に応じてNPCが自律建築。
- 人口・資源・交通・施設需要に応じて集落が自律成長。

**出典**

- [v1.1.md Q3](../history/v1.1.md#q3) 集落の自律発展 ／ 採用「NPCが自律的に建築・移住・発展」
- [v2.1.md Q5](../history/v2.1.md#q5) 集落の発展と衰退 ／ 採用「人口・資源・経済に応じて自然に変化」
- [v3.0.md Q4](../history/v3.0.md#q4) 住民による建築 ／ 採用「需要・資金・土地に応じてNPCが自律建築」
- [v4.7.md Q2](../history/v4.7.md#q2) 開拓集落の発展 ／ 採用「人口・資源・交通・施設需要に応じて集落が自律成長」

**関連仕様** [HOUSING-002](11_building_housing.md#housing-002) · [HOUSING-003](11_building_housing.md#housing-003) · [HOUSING-004](11_building_housing.md#housing-004) · [HOUSING-005](11_building_housing.md#housing-005) · [HOUSING-006](11_building_housing.md#housing-006) · [NATION-015](12_nations_warfare.md#nation-015) · [NATION-037](12_nations_warfare.md#nation-037) · [QUEST-001](14_quests_history.md#quest-001)

<a id="society-004"></a>

## SOCIETY-004 評判の管理

- 個人・集落・国家・組織ごと。
同一の行為でも、その評判や犯罪の影響は集落・国家・組織などによって異なる。

**出典**

- [v1.4.md](../history/v1.4.md#当時の要件懸念検討の経緯) 評判・犯罪の影響範囲
- [v1.3.md Q3](../history/v1.3.md#q3) 評判の管理 ／ 採用「個人・集落・国家・組織ごと」

**関連仕様** [NATION-007](12_nations_warfare.md#nation-007) · [NATION-008](12_nations_warfare.md#nation-008) · [NATION-009](12_nations_warfare.md#nation-009) · [NPC-005](07_npc_ai.md#npc-005)

<a id="society-005"></a>

## SOCIETY-005 人口の増減要因

- 食料・住宅・雇用・治安などに連動。

**出典**

- [v2.1.md Q1](../history/v2.1.md#q1) 人口の増減要因 ／ 採用「食料・住宅・雇用・治安などに連動」

<a id="society-006"></a>

## SOCIETY-006 NPCの出生

- 実際の家族関係から子供が誕生。

**出典**

- [v2.1.md Q2](../history/v2.1.md#q2) NPCの出生 ／ 採用「実際の家族関係から子供が誕生」

<a id="society-007"></a>

## SOCIETY-007 種族と寿命

- 種族ごとに寿命・成長速度が異なる。

**出典**

- [v2.1.md Q3](../history/v2.1.md#q3) 種族と寿命 ／ 採用「種族ごとに寿命・成長速度が異なる」

<a id="society-008"></a>

## SOCIETY-008 NPCの移住

- 仕事・生活・安全を考慮して自律移住。
- 仕事・住居・安全・生活条件を比較してNPCが自律移住。
- 個人・家族が生活条件を考慮して移住し、必要に応じて同行する。
- 生活条件の魅力に加え、距離・移動費・家族関係も考慮。

NPCは生活条件を比較して自律移住できる。国家の移住命令を必須条件としない。

**出典**

- [v4.7.md](../history/v4.7.md) NPCの移住判断
- [v2.1.md Q4](../history/v2.1.md#q4) NPCの移住 ／ 採用「仕事・生活・安全を考慮して自律移住」
- [v4.7.md Q1](../history/v4.7.md#q1) NPC移住のきっかけ ／ 採用「仕事・住居・安全・生活条件を比較してNPCが自律移住」
- [v4.8.md Q1](../history/v4.8.md#q1) NPCの移住単位 ／ 採用「個人・家族が生活条件を考慮して移住し、必要に応じて同行する」
- [v4.9.md Q4](../history/v4.9.md#q4) 移住先の選択 ／ 採用「生活条件の魅力に加え、距離・移動費・家族関係も考慮」

**関連仕様** [NATION-037](12_nations_warfare.md#nation-037) · [QUEST-001](14_quests_history.md#quest-001) · [NPC-012](07_npc_ai.md#npc-012) · [HOUSING-008](11_building_housing.md#housing-008)

<a id="society-009"></a>

## SOCIETY-009 子供の成長

- 一定年齢で一気に成人。
一気に成人へ移る具体的な年齢は未確定。

出生時から個別NPCとして年齢・家族関係を保持する。幼児・少年・青年といった段階を設けず、成人後は就職・結婚・冒険・経営など通常のNPC活動が可能になる。

**出典**

- [v3.3.md](../history/v3.3.md#1-v32で確定した仕様) 1. v3.2で確定した仕様
- [v3.3.md](../history/v3.3.md#当時の要件懸念検討の経緯) 成人年齢の未確定条件
- [v3.2.md Q2](../history/v3.2.md#q2) 子供の成長 ／ 採用「一定年齢で一気に成人」

**関連仕様** [NPC-003](07_npc_ai.md#npc-003) · [GROWTH-007](05_character_growth.md#growth-007)

<a id="society-010"></a>

## SOCIETY-010 結婚・家庭形成

- 相性・友好度・生活条件を考慮して自律的に結婚。

**出典**

- [v3.2.md Q3](../history/v3.2.md#q3) 結婚・家庭形成 ／ 採用「相性・友好度・生活条件を考慮して自律的に結婚」

**関連仕様** [NPC-003](07_npc_ai.md#npc-003) · [GROWTH-007](05_character_growth.md#growth-007)

<a id="society-011"></a>

## SOCIETY-011 死亡時の財産相続

- 家族関係と相続規則に従って継承。

**出典**

- [v3.2.md Q4](../history/v3.2.md#q4) 死亡時の財産相続 ／ 採用「家族関係と相続規則に従って継承」

**関連仕様** [NPC-003](07_npc_ai.md#npc-003) · [GROWTH-007](05_character_growth.md#growth-007)

<a id="society-012"></a>

## SOCIETY-012 国境を越えるNPC移動

平時の越境は外交関係・治安・通行条件に応じて許可する。戦争固有の民間経済効果とは区別する。

**出典**

- [v4.7.md Q4](../history/v4.7.md#q4) 国境を越えるNPC移動 ／ 採用「平時は外交関係・治安・通行条件に応じて往来可能」

**関連仕様** [NATION-037](12_nations_warfare.md#nation-037) · [QUEST-001](14_quests_history.md#quest-001)

<a id="society-013"></a>

## SOCIETY-013 集落の縮小・廃村化と30日猶予

人口流出・資源不足・施設維持困難で集落が縮小し得る。定住人口ゼロの期間は無人集落として建物・道路を保持し、再入植で猶予を解除する。ゲーム内30日連続で定住人口ゼロなら廃村化し、建物を全削除する。地形・道路・土地履歴・年代記は保持する。国家の滅亡だけではこの処理を行わない。

**出典**

- [v4.8.md Q3](../history/v4.8.md#q3) 集落の衰退・消滅 ／ 採用「人口流出・資源不足・施設維持困難により集落が縮小・廃村化する」
- [v4.9.md Q3](../history/v4.9.md#q3) 廃村になった集落の扱い ／ 採用「廃村になった瞬間に集落の建物を全削除」
- [v5.0.md Q3](../history/v5.0.md#q3) 廃村化の判定条件 ／ 採用「定住人口ゼロが一定期間継続したときに廃村化」
- [v5.0.md Q4](../history/v5.0.md#q4) 廃村時に残す情報 ／ 採用「建物は削除するが地形・道路・土地の履歴・年代記は残す」
- [v5.1.md Q3](../history/v5.1.md#q3) 廃村化までの猶予期間 ／ 採用「ゲーム内で一定日数の猶予を設け、その間に再入植すれば廃村化を回避」
- [v5.2.md Q4](../history/v5.2.md#q4) 廃村化の猶予日数 ／ 採用「ゲーム内30日間、定住人口ゼロが続いた場合に廃村化」
- [v5.3.md Q4](../history/v5.3.md#q4) 廃村判定中の扱い ／ 採用「人口ゼロの30日間は無人集落として建物・道路を保持し、再入植で猶予を解除」

**関連仕様** [NPC-012](07_npc_ai.md#npc-012) · [QUEST-001](14_quests_history.md#quest-001) · [HOUSING-008](11_building_housing.md#housing-008) · [HOUSING-009](11_building_housing.md#housing-009) · [HOUSING-010](11_building_housing.md#housing-010) · [HOUSING-011](11_building_housing.md#housing-011) · [HOUSING-012](11_building_housing.md#housing-012) · [HOUSING-013](11_building_housing.md#housing-013)

<a id="society-014"></a>

## SOCIETY-014 NPCの移住経路

移住は近距離で実移動し、遠距離では経路条件と所要時間で簡易処理する。

**出典**

- [v4.8.md Q4](../history/v4.8.md#q4) NPCの移住経路 ／ 採用「近距離は実際に移動し遠距離は所要時間・経路条件で簡易処理」

**関連仕様** [NPC-012](07_npc_ai.md#npc-012) · [QUEST-001](14_quests_history.md#quest-001)

<a id="society-015"></a>

## SOCIETY-015 廃村跡への再入植

- 旧集落の位置・道路・歴史を引き継ぎ新たな建物を生成して再建。
- 旧集落名を基本的に引き継ぎ、歴史上は再建として記録。

**出典**

- [v5.1.md Q4](../history/v5.1.md#q4) 廃村跡への再入植 ／ 採用「旧集落の位置・道路・歴史を引き継ぎ新たな建物を生成して再建」
- [v5.2.md Q5](../history/v5.2.md#q5) 再入植時の集落名称 ／ 採用「旧集落名を基本的に引き継ぎ、歴史上は再建として記録」

**関連仕様** [HOUSING-009](11_building_housing.md#housing-009) · [HOUSING-008](11_building_housing.md#housing-008) · [HOUSING-010](11_building_housing.md#housing-010)

<a id="society-016"></a>

## SOCIETY-016 冒険者としての名声

- 探索や討伐などの実績が冒険者としての名声に反映され、依頼や取引などの機会に影響する。

名声は交友関係と別の実績評価であり、v6.8の人間関係と冒険展開の規則を変更しない。

**出典**

- [v7.2.md](../history/v7.2.md#確定方針と再開地点) 確定方針と再開地点
- [v7.2.md Q3](../history/v7.2.md#q3) 冒険者としての名声 ／ 採用「探索や討伐などの実績が冒険者としての名声に反映され、依頼や取引などの機会に影響する」

**関連仕様** [EXPLORE-014](03_exploration.md#explore-014) · [EXPLORE-017](03_exploration.md#explore-017)

## 他分野が担当する関連仕様

- [NPC-012](07_npc_ai.md#npc-012) 移住後の就職

## 現行の生存人口と生活消費

生存人口で食料・木材の日次生活消費と備蓄目標を算出する。住宅完成での人口増加、専属職の補充は [現行仕様の世界シミュレーション](current/CURRENT_SPECIFICATIONS.md#世界シミュレーション-phase-1) を参照。
