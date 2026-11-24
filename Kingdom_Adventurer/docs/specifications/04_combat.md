# 戦闘

## 実装・変更時の原資料確認義務

本資料は、historyフォルダに保存された仕様検討履歴を分野別に整理・統合したものであり、原資料を代替するものではない。

本資料に記載された仕様について、新規実装、既存実装の変更、修正、拡張、設計判断を行う場合は、作業着手前に、対象仕様の出典として記載されたhistory内の原資料を必ず全文確認すること。

統合仕様書のみを参照して実装することは禁止する。

原資料に記載された要件、採用理由、ユーザーの補足、適用条件、例外、後続の変更内容を確認し、仕様の意図を損なわないようにすること。

統合仕様書と原資料の内容に相違がある場合は、原資料におけるユーザーの最新の明示的な決定を優先すること。

ただし、原資料同士に矛盾があり、最新の有効な仕様を明確に判断できない場合は、独自判断で解決せず、要確認事項として記録すること。

この確認義務は、人間の開発者とAIによる自律開発の双方に適用する。

[仕様書索引](README.md) · [網羅性確認](coverage-index.md) · [要確認事項](../development/OPEN_QUESTIONS.md)

関連分野 [冒険・探索](03_exploration.md) · [キャラクター成長](05_character_growth.md) · [装備・アイテム](06_items_equipment.md) · [仲間・組織](08_companions_guilds.md) · [魔物・生態系](09_ecosystem.md) · [ゲーム基盤](15_game_system.md)

<a id="combat-001"></a>

## COMBAT-001 半自動戦闘の操作

- 通常攻撃自動・スキルも自動設定可能。
- 通常攻撃自動＋スキルは手動・自動切替。
- HP・MP・敵の状況などの条件を設定可能。
基礎の戦闘方式は半自動リアルタイム。
戦闘はフィールド上で行い、戦闘専用画面への切り替えを行わない。攻撃中もプレイヤーは直接移動でき、通常攻撃は射程内の敵に自動で行う。スキルと魔法は手動・自動を設定でき、移動して戦闘から離脱できる。回復薬は手動で使い、自動化は要確認。

**出典**

- [v0.7.md](../history/v0.7.md#2-半自動戦闘の基本構造) 半自動戦闘の基本構造
- [v0.1.md](../history/v0.1.md#構想の出発点) 半自動戦闘のユーザー方針
- [v0.2.md](../history/v0.2.md#1-確定した基本仕様) 半自動リアルタイム戦闘
- [v0.6.md Q2](../history/v0.6.md#q2) 半自動戦闘の操作 ／ 採用「通常攻撃自動・スキルも自動設定可能」
- [v1.6.md Q4](../history/v1.6.md#q4) 戦闘操作 ／ 採用「通常攻撃自動＋スキルは手動・自動切替」
- [v3.5.md Q2](../history/v3.5.md#q2) スキルの自動使用 ／ 採用「HP・MP・敵の状況などの条件を設定可能」

**関連仕様** [EXPLORE-001](03_exploration.md#explore-001) · [EXPLORE-002](03_exploration.md#explore-002) · [ITEM-001](06_items_equipment.md#item-001) · [GROWTH-002](05_character_growth.md#growth-002) · [SYSTEM-006](15_game_system.md#system-006) · [SYSTEM-007](15_game_system.md#system-007) · [SYSTEM-008](15_game_system.md#system-008) · [SYSTEM-009](15_game_system.md#system-009)

<a id="combat-002"></a>

## COMBAT-002 敵の強さと地域の関係

敵の基本的な強さは地域間でほぼ均一。種族・個体の経験や生存による成長、強い個体の混在は維持する。敵の密度と巣で危険度が変わり得る。プレイヤーのレベルには追従しない。

**出典**

- [v0.7.md Q1](../history/v0.7.md#q1) 敵の強さ ／ 採用「世界環境・種族・成長で決定」
- [v2.3.md Q5](../history/v2.3.md#q5) 敵個体の成長 ／ 採用「敵個体も経験・戦闘・生存によって成長」
- [v6.9.md Q1](../history/v6.9.md#q1) 敵の強さと地域の関係 ／ 採用「全地域で敵の強さをほぼ均一にする」
- [v0.8.md](../history/v0.8.md#q5) Q5 地域危険度・強個体
- [v6.5.md](../history/v6.5.md#q1) Q1 魔物の勢力・密度

**関連仕様** [SYSTEM-001](15_game_system.md#system-001) · [GROUP-002](08_companions_guilds.md#group-002) · [GROUP-003](08_companions_guilds.md#group-003) · [GROWTH-001](05_character_growth.md#growth-001) · [GROWTH-006](05_character_growth.md#growth-006) · [EXPLORE-011](03_exploration.md#explore-011) · [GROWTH-011](05_character_growth.md#growth-011)

<a id="combat-003"></a>

## COMBAT-003 戦闘の難易度

- 適度な危険性・装備や育成が重要。
- 難易度を調整可能、敵レベル連動はなし。
- 敵の能力値・攻撃力・耐久力などを調整。

プレイヤー向けの難易度補正がNPC同士の戦争・経済に広く波及しないことが設計上の論点。適用対象・分離方式は要確認。

**出典**

- [v2.4.md](../history/v2.4.md#5-難易度調整についての補足) 難易度補正の適用範囲
- [v0.7.md Q2](../history/v0.7.md#q2) 戦闘の難易度 ／ 採用「適度な危険性・装備や育成が重要」
- [v2.4.md Q5](../history/v2.4.md#q5) 戦闘難易度の調整 ／ 採用「難易度を調整可能、敵レベル連動はなし」
- [v3.5.md Q3](../history/v3.5.md#q3) 戦闘難易度の調整方法 ／ 採用「敵の能力値・攻撃力・耐久力などを調整」

**関連仕様** [SYSTEM-001](15_game_system.md#system-001) · [GROUP-002](08_companions_guilds.md#group-002) · [GROUP-003](08_companions_guilds.md#group-003)

<a id="combat-004"></a>

## COMBAT-004 魔法の種類

- 攻撃・回復・補助・召喚・生活魔法など。

**出典**

- [v2.3.md Q3](../history/v2.3.md#q3) 魔法の種類 ／ 採用「攻撃・回復・補助・召喚・生活魔法など」

**関連仕様** [GROWTH-001](05_character_growth.md#growth-001) · [GROWTH-006](05_character_growth.md#growth-006)

<a id="combat-005"></a>

## COMBAT-005 魔法の使用資源

- MP消費＋自然回復。

消費したMPは時間経過などで自然回復する。具体的な回復量・速度は未確定。

**出典**

- [v2.4.md](../history/v2.4.md#1-v23で確定した仕様) MPの回復
- [v2.3.md Q4](../history/v2.3.md#q4) 魔法の使用資源 ／ 採用「MP消費＋自然回復」

**関連仕様** [GROWTH-001](05_character_growth.md#growth-001) · [GROWTH-006](05_character_growth.md#growth-006)

<a id="combat-006"></a>

## COMBAT-006 敵AIの判断能力

- 種族・性格・経験・状況に応じて判断。

**出典**

- [v2.4.md Q1](../history/v2.4.md#q1) 敵AIの判断能力 ／ 採用「種族・性格・経験・状況に応じて判断」

<a id="combat-007"></a>

## COMBAT-007 敵対行動の発生条件

- 魔物は基本的にすべて敵対。

**出典**

- [v2.4.md Q2](../history/v2.4.md#q2) 敵対行動の発生条件 ／ 採用「魔物は基本的にすべて敵対」

<a id="combat-008"></a>

## COMBAT-008 逃走・降伏

- NPC・敵とも状況に応じて逃走・降伏。
- HP・戦力差・性格・状況に応じて判断。

**出典**

- [v2.4.md Q3](../history/v2.4.md#q3) 逃走・降伏 ／ 採用「NPC・敵とも状況に応じて逃走・降伏」
- [v3.5.md Q4](../history/v3.5.md#q4) 敵の撤退・降伏判断 ／ 採用「HP・戦力差・性格・状況に応じて判断」

<a id="combat-009"></a>

## COMBAT-009 集団戦での連携

- 敵も仲間と連携し役割分担。
- 前衛・後衛・支援など役割に応じて連携。

**出典**

- [v2.4.md Q4](../history/v2.4.md#q4) 集団戦での連携 ／ 採用「敵も仲間と連携し役割分担」
- [v3.5.md Q5](../history/v3.5.md#q5) 敵集団の連携 ／ 採用「前衛・後衛・支援など役割に応じて連携」

<a id="combat-010"></a>

## COMBAT-010 通常攻撃の対象選択

- 基本は自動選択、手動指定も可能。

**出典**

- [v3.5.md Q1](../history/v3.5.md#q1) 通常攻撃の対象選択 ／ 採用「基本は自動選択、手動指定も可能」
