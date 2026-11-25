# 累積型開発TODO

完了項目は削除しない。IDは再利用しない。追加・修正・再設計・詳細化・不具合も登録する。各項目に対象Phase、関連仕様ID（着手前に実資料から確認）、依存関係、完了条件を記録し、完了時に日付・コミット・検証結果を追記する。チェックは当該項目の完了のみを意味し、最終仕様の完成とは別。取り消し・置換は理由と後継IDを残す。優先順位は変更可能。未登録仕様を定期照合する。

## Phase 1 — 最小ゲーム
- [x] DEV-001 参考ゲームの確認・技術選定：Kingdom Observer と森のサバイバルの実物・コードを確認し、流用可否、操作方式、実行環境、構成を決める。重要な未決定は確認する。
  - 関連仕様 GAME-001・SYSTEM-006・SYSTEM-007・SYSTEM-008。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。参考元2本のコードを照合し、構成と流用箇所をゲームREADMEに記録。
- [x] DEV-002 フィールドと描画：移動可能なマップを表示する。依存 DEV-001。
  - 関連仕様 WORLD-001・WORLD-002・WORLD-006。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。草原・森林・街道がある固定フィールド。構文検査と地形判定を確認。
- [x] DEV-003 プレイヤー移動・カメラ：操作して移動しカメラが追従する。依存 DEV-002。
  - 関連仕様 SYSTEM-007・SYSTEM-008・EXPLORE-004。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。直接移動と追従描画。Nodeで移動と街境界通過を確認。
- [x] DEV-004 固定の街・宿の配置：街に移動して宿へ接触できる。依存 DEV-002,003。
  - 関連仕様 WORLD-004・HOUSING-002。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。固定街・宿の入口と建物衝突を実装。街の開始位置と接触動線を確認。
- [x] DEV-005 HP・敵出現・簡易AI：敵が出現し基本行動を行い、HPを管理できる。依存 DEV-002,003。
  - 関連仕様 ECO-001・COMBAT-006・COMBAT-007。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。Nodeで8地点の自動出現、再出現、街の安全、被弾を確認。
- [x] DEV-006 基本戦闘：攻撃・被弾・敵撃破が成立する。依存 DEV-005。
  - 関連仕様 COMBAT-001・COMBAT-010。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。Nodeで接近時の自動攻撃と撃破を確認。手動対象指定は将来対象。
- [x] DEV-007 簡易宿泊：接触でYES/NO、YESで無料全回復、NOで回復なし。依存 DEV-004,005。
  - 関連仕様 SYSTEM-003。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。接触とYES/NOの実装。ブラウザでの確認はDEV-009で実施。
- [x] DEV-008 最低限のUI・死亡再開：HP確認と死亡後の再開が可能。依存 DEV-005,006。
  - 関連仕様 SYSTEM-001・SYSTEM-006。2026-11-25 Phase 1実装コミット `Implement Kingdom Adventurer Phase 1 playable loop`。HP表示と街からの再開を実装。ブラウザでの確認はDEV-009で実施。
- [ ] DEV-009 最小ゲームの統合確認：探索→戦闘→帰還→回復を実際に確認し、初期対象外機能を含めず、遊べる状態を保存する。依存 DEV-002〜008。

DEV-009 関連仕様 WORLD-002・COMBAT-001・SYSTEM-001・SYSTEM-003。操作による循環と公開を確認する。チェック済みの項目はPhase 1範囲の実装済み。

## Phase 2以降 — 将来の対象（粗粒度、順序未確定）
- [ ] DEV-010 ゲーム基本構想の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第1分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-011 世界・マップの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第2分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-012 冒険・探索の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第3分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-013 戦闘の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第4分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-014 キャラクター成長の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第5分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-015 装備・アイテムの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第6分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-016 NPC・生活AIの追加・詳細化：[分野別仕様索引](../specifications/README.md) の第7分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-017 仲間・組織の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第8分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-018 魔物・生態系の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第9分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-019 経済・産業の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第10分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-020 建築・領地・住宅の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第11分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-021 国家・政治・戦争の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第12分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-022 社会・人口の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第13分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-023 クエスト・歴史の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第14分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-024 ゲーム基盤の追加・詳細化：[分野別仕様索引](../specifications/README.md) の第15分野を参照。着手前に個別仕様IDと完了条件を設定し、子項目に分解する。
- [ ] DEV-025 全仕様・実装・TODOの照合と不足解消（Phase 3）
- [ ] DEV-026 最終調整・完成確認（Phase 4）

## 登録漏れの確認
現時点では分野単位の登録のみ。211個別仕様のTODO対応は未確認。着手時およびPhase移行時に照合し、必要な項目を追加する。
