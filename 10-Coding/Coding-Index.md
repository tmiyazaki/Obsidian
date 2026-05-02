---
tags: [moc, coding]
domain: coding
---

# Coding — インデックス

実装スキルは「**書く**」ためだけのものではなく、「**未来の自分と他者が読み・変える**」ための投資です。コードはあなたが居なくなった後も走り続け、新しい人がその意図を再構築する必要があります。

## 三本柱

1. **読みやすさ (Readability)** — コードはまず人間が読み、次に計算機が実行する
2. **変更容易性 (Changeability)** — 機能追加と変更を安全に受け入れられる構造
3. **信頼性 (Reliability)** — 振る舞いが予測可能で、壊れたとき素早く気づける

## ノート

### 基礎

- [[Clean-Code]] — 命名・関数サイズ・コメントの作法
- [[SOLID-Principles]] — オブジェクト設計の 5 原則
- [[Naming]] — 命名は最重要のドキュメント

### 構造

- [[Design-Patterns]] — 繰り返し現れる解の語彙
- [[Architecture-Layers]] — 関心の分離と依存方向
- [[Error-Handling]] — 失敗を一級市民として扱う

### 改善サイクル

- [[Refactoring]] — 振る舞いを保ったまま構造を変える
- [[Testing-Strategy]] — テストピラミッドと TDD
- [[Code-Review]] — レビューは教育であり議論である

### 運用

- [[Performance]] — 計測してから最適化
- [[Version-Control]] — 履歴は設計判断の証跡

## アンチパターン早見

| 症状 | 原因 | 参照 |
|---|---|---|
| 関数が長すぎる | 単一責任の崩壊 | [[Clean-Code]] |
| 変更があちこちに波及 | 強結合 | [[SOLID-Principles]] |
| バグを直すと別が壊れる | テスト不足 | [[Testing-Strategy]] |
| 何のコードか読めない | 命名の劣化 | [[Naming]] |
| 例外で握りつぶされる | エラー設計の欠落 | [[Error-Handling]] |

## 関連

- [[../00-Index/MOC|MOC]]
- [[../40-Bridge/Naming-as-Design|名前付けという設計]]
