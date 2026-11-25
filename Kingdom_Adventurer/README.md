# Kingdom Adventurer

最小ゲームから機能単位で拡張するオープンワールドゲーム。

[公開ゲーム](https://garatnic.github.io/sample/Kingdom_Adventurer/game/) / [ゲームの操作・実行方法](game/README.md)

## 開発を引き継ぐ場合
AI開発エージェントは作業開始前に [AGENTS.md](AGENTS.md) を必ず読み、その指示に従う。最新コミットと以下の資料を確認する。新機能・修正の着手前に開発方針を必ず読む。

| 資料 | 役割 |
|---|---|
| [開発方針](docs/development/DEVELOPMENT_POLICY.md) | 開発手順・資料更新義務・完了条件 |
| [現行仕様書](docs/specifications/current/CURRENT_SPECIFICATIONS.md) | 現在の実装挙動・CUR仕様ID |
| [仕様・実装対応表](docs/architecture/IMPLEMENTATION_MAP.md) | 仕様IDと実装ファイル・関数の双方向対応 |
| [変更履歴](docs/development/CHANGELOG.md) | 変更理由・前後差分・仕様ID・コミットSHA |
| [統合仕様書](docs/specifications/README.md) | 最終目標仕様 |
| [原資料](docs/history/README.md) | 構想・選択肢・決定履歴 |
| [原資料対応索引](docs/specifications/coverage-index.md) | 原資料と統合仕様の対応 |
| [ロードマップ](docs/development/ROADMAP.md) | 開発Phase |
| [TODO](docs/development/TODO.md) | 累積作業・完了条件 |
| [開発状況](docs/development/DEVELOPMENT_STATUS.md) | 現在の進捗・再開地点 |
| [未決事項](docs/development/OPEN_QUESTIONS.md) | 矛盾・保留・要確認 |

現在の挙動は現行仕様書、将来の目標は統合仕様書を参照する。変更時は仕様IDを起点に対応表・履歴・実コードを照合し、必要な資料を更新する。コードだけの変更では開発完了としない。
