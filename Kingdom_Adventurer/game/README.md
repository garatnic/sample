# Kingdom Adventurer

[ブラウザで遊ぶ](https://garatnic.github.io/sample/Kingdom_Adventurer/game/)

WASD・矢印キー・ゲームパッド左スティックで移動します。タッチ端末ではフィールド画面のどこからでも、触れた位置から指をずらした方向へ移動します。指を離すと止まります。射程内に魔物がいると自動で攻撃します。魔物が落とした素材は近づくと拾え、道具屋で売れます。果樹に触れている間は実を採取できます。街へ帰り、茶色の屋根に「宿」と書かれた建物の正面に触れると、所持金を使ってHPを全回復できます。

ローカルでは `Kingdom_Adventurer/game` で `python -m http.server 8000` を実行し、ブラウザで [http://localhost:8000/](http://localhost:8000/) を開きます。

ブラウザ標準の JavaScript ES Modules・Canvas 2D を使用します。依存ライブラリやビルドは不要です。地形・配置は `src/world.js`、数値は `src/settings.js`、表示は `src/render.js`、入力は `src/input.js`、敵の更新は `src/combat.js` にあります。現行形式の正常な保存があれば、ページを開き直すと続きから再開します。ver.53のセーブ形式は14です。古い形式や不正なデータは理由を表示して新規ゲームを開始します。既存の枠は次に保存に成功するまで保持されます。古いデータを手元に残したい場合は、保存やオートセーブが発生する前に「JSON書き出し」を選びます。

宿の右手にある「装備」の看板の建物は装備品屋です。入口に近づくと全商品が表示され、部位タブで絞り込めます。画面左上の▾で詳細を開き、「装備」から武器と防具を部位別に装備・解除できます。所持数や重量の上限はありません。

画面左上の▾から「セーブ」を開くと、手動セーブ・ロード・JSONの書き出しと取り込み・保存枠の削除ができます。宿泊後と洞窟の出入りでオートセーブされます。削除後も現在のプレイは続けられます。

## CSS更新時

CSSを変更した場合は、`sha256sum game/style.css` の先頭12桁で `game/index.html` の `style.css?v=` の値を更新します。上記のコマンドは `Kingdom_Adventurer` 直下で実行します。

## 参考実装

- [Kingdom Observer の Renderer](https://github.com/garatnic/kingdom/blob/6975895/engine/Renderer.js) の可視タイルだけを塗る方式と森林タイルの矩形パターンを調整して使用。街の建物は本作の固定配置用に描画。
- [森のサバイバル](https://github.com/garatnic/sample/blob/8cd834d/forest-survival/index.html) の正規化した直接移動、Canvas のプレイヤー中心カメラ、仮想スティックと自動通常攻撃を参考に本作向けに実装。
