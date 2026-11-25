# AI開発エージェントへの必須指示

適用範囲: Kingdom_Adventurer/ 以下の全ファイル。新規開発、修正、仕様変更、不具合修正、資料整備を含む。

## 作業開始前（省略禁止）
最新の対象ブランチとコミットを確認し、次の資料を実際に読む。過去の会話や記憶だけで代用しない。
1. [開発基本方針](docs/development/DEVELOPMENT_POLICY.md) — 全文必読。詳細な開発・資料更新手順の正本。
2. [現行仕様書](docs/specifications/current/CURRENT_SPECIFICATIONS.md)、[仕様・実装対応表](docs/architecture/IMPLEMENTATION_MAP.md)、[変更履歴](docs/development/CHANGELOG.md)。
3. [ロードマップ](docs/development/ROADMAP.md)、[TODO](docs/development/TODO.md)、[開発状況](docs/development/DEVELOPMENT_STATUS.md)、[未決事項](docs/development/OPEN_QUESTIONS.md)。
4. 対象に関係する[統合仕様](docs/specifications/README.md)とその出典の[原資料](docs/history/README.md)を全文確認する。対象コードと依存先も確認する。

必須資料を取得できない場合は推測で作業を進めず、取得できない資料と理由を報告する。小規模な変更でも省略しない。

## 作業中・完了時
- 開発基本方針に従い、対象仕様IDと影響範囲を特定し、TODO登録、実装、検証、資料更新、コミットを行う。
- ゲームを修正するたびに、開発基本方針に従って画面の表示バージョンを1つ上げる。
- 現行仕様と目標仕様を区別し、仕様IDを維持する。未決事項を独断で確定しない。
- 現行仕様書・対応表・変更履歴・TODO・開発状況を確認し、必要な更新を行う。変更履歴には確定した実装コミットの完全SHAを記録する。
- コード変更だけで完了としない。未検証・未完了を明記し、中断時は再開地点を残す。
- 読み取り専用の調査依頼ではファイルを変更しない。

詳細手順は開発基本方針を正本とし、本書はその必須入口とする。
