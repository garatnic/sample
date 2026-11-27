# 現在の開発状況

実装基準は 2026-11-27 / ver.31 / DEV-056 / 実装コミット `28972e901561ad7006869257d587e78a38cac5cd`。Phase 1の最小ゲームは完了し、Phase 2の反復開発中。

- DEV-058の管理資料監査で、現行仕様39件と実装ファイル18件の対応、Phase 1以降のゲーム変更28コミットの履歴登録を静的確認した。保存済み自動テストは0件。検証済みの作業と未検証の範囲は各記録を参照。
- 次回は指定された機能、または詳細未確定の DEV-057（緊急脱出）を基に進める。

## 作業履歴・当時の引き継ぎ

- ver.31 / DEV-056 [aeba7fca18c61d791665565467037f17f5cd317e](https://github.com/garatnic/sample/commit/aeba7fca18c61d791665565467037f17f5cd317e)。IndexedDBの単一枠、手動・自動保存、起動時・手動復元、JSONバックアップ、確認付き削除。PC版Chromiumの実IndexedDBで、手動保存・読み込み、装備・果樹・別マップ戦利品の復元、宿泊・洞窟往復のオートセーブ、戦闘制限、トランザクション中断時の旧データ保持、JSON書き出し・正常/不正取り込み、削除確認の取消・実行、起動時復元と削除後の初期起動を確認。スマートフォン実機は未確認。

- ver.30 / DEV-061 [88b1d3e230933dc30a276fe5e369234182d35044](https://github.com/garatnic/sample/commit/88b1d3e230933dc30a276fe5e369234182d35044)。宿泊成立で翌日06:00・HP全回復。Nodeの模擬DOMで宿泊成功・取消・料金不足、HP、連泊、果樹補充、通常時計の再開、年末の繰り上がりを確認。ブラウザ・端末実機は未検証。 DEV-028の経済・死亡ペナルティの詳細化は継続。

- ver.29 / DEV-059 [6ce2ec496d99a05c1b31d7021572c53a6448e8bf](https://github.com/garatnic/sample/commit/6ce2ec496d99a05c1b31d7021572c53a6448e8bf)。岩陰の洞窟への往復、固定1チャンクの描画・移動、マップ固有の敵配置と戦利品を実装。Nodeの模擬DOMで往復、マップ別の敵・戦利品と再出現待ち、戦闘・素材拾得・経験値、外周制限、死亡復帰、宿の接触を確認。端末実機は未検証。 次のダンジョン拡張は DEV-060。

- セーブ・ロード目標仕様を追加。実装は DEV-056、緊急脱出は DEV-057 から着手できる。緊急脱出の詳細仕様は未確定。

- ver.28 / DEV-055 [37d114337509006f706980e7a06fff16ee6e7b37](https://github.com/garatnic/sample/commit/37d114337509006f706980e7a06fff16ee6e7b37)。採取可能な果樹を5本に調整。採取と日次補充を確認。

- ver.27 / DEV-054 [5e392413ad7bbe04d991fc8f8b5e7a9ac7a620ba](https://github.com/garatnic/sample/commit/5e392413ad7bbe04d991fc8f8b5e7a9ac7a620ba)。果樹の配置、接触採取、残数表示、日次補充を追加。村人との接続時は src/trees.js の食料資源データと takeFruit() を利用する。端末実機は未確認。

- ver.26 / DEV-053 [5c02f0affa716f7c39fa0eb2603808241f9781fb](https://github.com/garatnic/sample/commit/5c02f0affa716f7c39fa0eb2603808241f9781fb)。装備専用表示と道具ボタン、討伐3・素材収集2のギルド依頼を追加。要求数と報酬は暫定。スマホ実機未確認。

- ver.25 / DEV-052 [71e37b9985fe3330988700d704720da10652eb41](https://github.com/garatnic/sample/commit/71e37b9985fe3330988700d704720da10652eb41)。非人型の素材入手と道具屋の買取を実装。素材の錬成は未実装。スマホ実機は未確認。

- ver.24 / DEV-051 [129acb34908a26c11476d45d55d72e9c48389f3c](https://github.com/garatnic/sample/commit/129acb34908a26c11476d45d55d72e9c48389f3c)。ギルド別5枠を閲覧日で更新。現地にあるギルドは1か所、2か所分のデータを用いて分離と10件受注を検証。スマホ実機は未確認。

- ver.23 / DEV-050 [6b509681f8cfe2757cc830124029a8d4187b9c74](https://github.com/garatnic/sample/commit/6b509681f8cfe2757cc830124029a8d4187b9c74)。未所持数の非表示とゲーム内時計を実装。開始は4000年1月1日08:00、速度はSYSTEM-002に準拠。宿泊・待機による時間進行は今後の課題。スマホ実機は未確認。

- ver.22 / DEV-049 [d9698a94dffe64729027274c6cf7c6b6499ecaa1](https://github.com/garatnic/sample/commit/d9698a94dffe64729027274c6cf7c6b6499ecaa1)。両店の所持数と装備状態の表示を追加し、売買・着脱時の更新を確認。スマホ実機は未確認。

- ver.21 / DEV-048 [628148e1847fdb9ddc2da090788264503a7904b3](https://github.com/garatnic/sample/commit/628148e1847fdb9ddc2da090788264503a7904b3)。冒険者ギルド、固定討伐依頼5件、同時受注上限5件とクエストウィンドウを実装。固定内容・報酬は暫定。スマホ実機は未確認。

- ver.20 / DEV-047 [435b36c918522fd1d825dac6c838cd1f88583389](https://github.com/garatnic/sample/commit/435b36c918522fd1d825dac6c838cd1f88583389)。道具の回復・毒を実装。効果量は暫定、MPを減らす行動は未実装。スマホ実機は未確認。

- ver.19 / DEV-046 [9279d6aea6149a333c9deb68ac768c970e4de1c3](https://github.com/garatnic/sample/commit/9279d6aea6149a333c9deb68ac768c970e4de1c3)。両店の一覧で価格から直接売買できる。品名から詳細を開閉。模擬DOMで検証済み。スマホ実機は未確認。

- ver.18 / DEV-045 [ad59c0fd7ecfec204571c1d1776fbeceea9f3569](https://github.com/garatnic/sample/commit/ad59c0fd7ecfec204571c1d1776fbeceea9f3569)。両店の商品名から取引詳細を開く。分類と売買は模擬DOMで確認。スマホ実機は未確認。

- ver.17 / DEV-044 [1b7da0543a1736b153fc77b75243831be106d86b](https://github.com/garatnic/sample/commit/1b7da0543a1736b153fc77b75243831be106d86b)。店の入口から正しい施設IDを渡すよう修正。両店の開店と失敗後の再入店は模擬DOMで確認。実機は未確認。

- ver.16 / DEV-043 [21f98777ee44cc584725b6b17593e4bea36d5a54](https://github.com/garatnic/sample/commit/21f98777ee44cc584725b6b17593e4bea36d5a54)。道具屋と装備品屋の分類別買取を追加。商品の使用効果はDEV-015の残項目。価格・店資金は暫定。

- ver.15 / DEV-042 [0ad251107ddd1683c58fb547c47c0ab417796b2d](https://github.com/garatnic/sample/commit/0ad251107ddd1683c58fb547c47c0ab417796b2d)。物理ダメージを共通化し、敵の防御、装備の実防御、敵味方別の難易度倍率を設定。具体値は暫定。難易度の変更UIは後続作業。

- ver.14 / DEV-041 [34ce7f3fa96bb875c927ee01236f5be70f96828a](https://github.com/garatnic/sample/commit/34ce7f3fa96bb875c927ee01236f5be70f96828a)。弱い野外敵を4種、固定8地点に各1体。実機表示は未確認。次回の敵・生態系詳細はTODOの未完項目を参照。

- ver.13 / DEV-040 [dc9fb7d5c55cc94c14a68662340605ed2b83e452](https://github.com/garatnic/sample/commit/dc9fb7d5c55cc94c14a68662340605ed2b83e452)。ジャンル別の攻撃間隔と個別値の優先、鉄の槌を実装。斧には間隔設定があり、具体的なアイテムはDEV-015の残項目。具体値は暫定。スマホ実機は未確認。

- ver.12 / DEV-039 [1db72d245d4bd49c162802f6e4e4deb1687423d9](https://github.com/garatnic/sample/commit/1db72d245d4bd49c162802f6e4e4deb1687423d9)。指輪を2枠に拡張し、同じ指輪の同時装備は2個所持時に可能。共通の指輪タブと枠別操作をNodeで確認。次回は DEV-015 の残項目を参照。

- ver.11 / DEV-038 [`16f8b05f283584c439b7071c4cb8e136117c0429`](https://github.com/garatnic/sample/commit/16f8b05f283584c439b7071c4cb8e136117c0429)。装備品屋と所持品に部位別タブを追加。防具の軽減値、価格は暫定。次回は DEV-015 の残項目を参照。

- ver.10 / DEV-037 [`0c67242591d865d91edc11a09f66a79e375e6f40`](https://github.com/garatnic/sample/commit/0c67242591d865d91edc11a09f66a79e375e6f40)。左上HUDをHP・MP表示から展開する方式に変更。スマホ実機は未確認。

- ver.9 / DEV-036 [`e590549d7b9cbb24a58d9533961c413a3451d3bd`](https://github.com/garatnic/sample/commit/e590549d7b9cbb24a58d9533961c413a3451d3bd)。人体シルエット付き装備画面を追加。武器枠は既存の装備機能と連動し、防具など他部位は見本枠。MPと防御は表示値の仮置き。次回の防具などの実装は DEV-015 を参照。

- ver.8 / DEV-035 [`f3954fde0dbe8b8453b53d3321d46623df6d8da8`](https://github.com/garatnic/sample/commit/f3954fde0dbe8b8453b53d3321d46623df6d8da8)。武器屋と容量無制限の所持品、武器装備を実装。次回の装備追加は DEV-015 と OPEN-041 を参照。固定品揃え・価格・性能は暫定。

- ver.7 / DEV-034 [`fca7186223acf76a114f58303c18072a9b579218`](https://github.com/garatnic/sample/commit/fca7186223acf76a114f58303c18072a9b579218)。無装備の通常攻撃射程は16、敵の接近停止・攻撃距離は15。武器実装時は OPEN-041 の射程順を確認する。
- ver.6 / DEV-033 [`e280e4d4b037f3612c69d4666481939eafeca6c4`](https://github.com/garatnic/sample/commit/e280e4d4b037f3612c69d4666481939eafeca6c4)。画面全域からのスワイプ移動を追加し、固定スティックを撤去。Nodeの入力検証済み。スマホ実機は未確認。次回は指定機能、または DEV-014 の残る成長仕様を確認する。
- ver.5 / DEV-032 [`52fe7fedb94556ffa29bbd47c07e0dffeafe3489`](https://github.com/garatnic/sample/commit/52fe7fedb94556ffa29bbd47c07e0dffeafe3489)。Lv.1開始、討伐経験値・レベルアップ・最大HPと通常攻撃の成長を実装。次回は指定機能、または DEV-014 の技能熟練度など残る成長仕様を確認する。数値は暫定。
- DEV-031を実装 [`9042c597db6cc2933f1b069cc505f3742a2387fe`](https://github.com/garatnic/sample/commit/9042c597db6cc2933f1b069cc505f3742a2387fe)。画面左上に「Kingdom Adventurer ver.4」を表示。次回のゲーム修正は ver.5 とし、番号の更新と公開確認を開発基本方針に従って行う。
- DEV-030を実装 [`2b528d93655baa2ffb915e81ce53907161b6b3d0`](https://github.com/garatnic/sample/commit/2b528d93655baa2ffb915e81ce53907161b6b3d0)。公開ゲームのCSSに内容ハッシュを付け、通常ブラウザに残る旧CSSと取得URLを区別する。HTMLとCSSのハッシュの一致を検証。
- DEV-029を実装 [`6e00387b8c0948a0a2f82eef4dab42ea4d0f058c`](https://github.com/garatnic/sample/commit/6e00387b8c0948a0a2f82eef4dab42ea4d0f058c)。スマホ用の仮想スティックを画面下中央へ移動し、通知をその上に表示。CSSとNodeの入力シミュレーションで確認。スマホ実機での新配置は未確認。
- Phase 1完了後の個別変更として、DEV-027を実装 [`29051f1a7d13302348baa3fc51682904a33fec43`](https://github.com/garatnic/sample/commit/29051f1a7d13302348baa3fc51682904a33fec43)。敵の硬貨5G、初期所持金10G、宿泊料10Gは暫定。Nodeの簡易DOMで戦闘・拾得と宿泊の分岐を確認。ブラウザ、スマホ、実ゲームパッドでの今回の変更は未検証。
- 次回の再開地点は DEV-028（数値調整・経済や時間との接続）または次に指定された機能。個別変更のためロードマップのPhase区分を維持。開発方針・未決事項にある無料宿泊と報酬なしは初期Phaseの履歴。最新値と挙動は現行仕様書を参照。

## Phase 1完了時の記録

- Phase 1完了。DEV-001〜009を完了した。ゲーム本体の実装は [`96e0033`](https://github.com/garatnic/sample/commit/96e00332d04f2e34b6c696a52aac16d5dafa6aea)。
- [公開ゲーム](https://garatnic.github.io/sample/Kingdom_Adventurer/game/) をブラウザで起動し、街とHP 100の表示を確認。公開HTML・CSS・全JSは、ローカル配信で操作試験したファイルと一致した。
- Chromiumでキーボードを操作し、街から出発、敵からの被弾と撃破、街への帰還、宿でNO時にHP維持・YES時に全回復、再探索、戦闘不能、街での再開を確認。未捕捉JSエラーなし。スマホ実機と実ゲームパッドは未確認。
- Nodeで移動、街の安全、魔物の出現・再出現、ダメージ判定を確認。操作・実行方法と参考コードは[ゲームREADME](../../game/README.md)を参照。
- 対象仕様の出典は履歴 v0.1、v0.2、v0.3、v0.4、v0.6、v0.7、v0.8、v1.1、v1.5、v1.6、v1.7、v1.9、v2.4、v2.5、v3.0、v3.3、v3.5、v6.4。Phase 1着手時に15分野の統合仕様を照合した。
- 次回は公開版のプレイ感想を確認する。Phase 2の開始指示後にTODOのDEV-010〜024を読み、最初に着手する仕様IDと完了条件を子項目として記録する。

## 仕様統合作業からの引き継ぎ

## 完了状況

v0.1〜v7.2の全72版と履歴索引2件を対象とする分野別統合作業は完了。原資料は基準コミット `e7eefefa63175eb1f88fa128be1293244e727b8a` から変更なし。

- [分野別仕様書と索引](../specifications/README.md) 15冊・211項目。
- [原資料と統合仕様の対応表](../specifications/coverage-index.md) 採用334設問すべてに反映先または変更先があり、対応先の本文にも原設問のリンクがある。v6.3の5設問は保留。
- [矛盾・保留・要確認事項](OPEN_QUESTIONS.md) 40件の記録（未解決39件、解決済み1件）。

## 原文との再照合

v0.1〜v2.4の照合結果を引き継ぎ、v2.5〜v3.9の検討背景・補足およびv4.0〜v7.2の回答状況、確定補足と既存仕様との関係を再照合した。設問外の記述から採用内容を具体化する条件・例外・制限を追記し、例示や未回答案は確定条件から除外した。国家分裂はv4.2・v4.5による変更を反映した。

334/334（100%）は採用設問の対応率。本文に含まれる補足の数を分母にした網羅率は算出していない。v6.3を含む未決事項は、実装時に判断が必要になった段階で照会する。次回の新規仕様検討は履歴v7.2の再開指示に従う。

