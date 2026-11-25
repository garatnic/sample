# Kingdom Adventurer

[ブラウザで遊ぶ](https://garatnic.github.io/sample/Kingdom_Adventurer/game/)

WASD・矢印キー・ゲームパッド左スティックで移動します。タッチ端末ではフィールド画面のどこからでも、触れた位置から指をずらした方向へ移動します。指を離すと止まります。射程内に魔物がいると自動で攻撃します。魔物が落とした硬貨は近づくと拾えます。街へ帰り、茶色の屋根に「宿」と書かれた建物の正面に触れると、所持金を使ってHPを全回復できます。

ローカルでは `Kingdom_Adventurer/game` で `python -m http.server 8000` を実行し、ブラウザで [http://localhost:8000/](http://localhost:8000/) を開きます。

ブラウザ標準の JavaScript ES Modules・Canvas 2D を使用します。依存ライブラリやビルドは不要です。地形・配置は `src/world.js`、数値は `src/settings.js`、表示は `src/render.js`、入力は `src/input.js`、敵の更新は `src/combat.js` にあります。ページを再読み込みすると初期状態から始まります。

## CSS更新時

CSSを変更した場合は、`sha256sum game/style.css` の先頭12桁で `game/index.html` の `style.css?v=` の値を更新します。上記のコマンドは `Kingdom_Adventurer` 直下で実行します。

## 参考実装

- [Kingdom Observer の Renderer](https://github.com/garatnic/kingdom/blob/6975895/engine/Renderer.js) の可視タイルだけを塗る方式と森林タイルの矩形パターンを調整して使用。街の建物は本作の固定配置用に描画。
- [森のサバイバル](https://github.com/garatnic/sample/blob/8cd834d/forest-survival/index.html) の正規化した直接移動、Canvas のプレイヤー中心カメラ、仮想スティックと自動通常攻撃を参考に本作向けに実装。
