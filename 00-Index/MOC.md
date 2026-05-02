---
tags: [moc, index]
aliases: [Map of Content, 全体地図]
---

# Map of Content — スキル全体地図

3 つのドメインは独立ではなく、実務では常に絡み合います。**コード**は構造を生み、**デザイン**は知覚を整え、**インターフェース設計**はその両者を「人がふれる体験」へと統合します。

```
        ┌──────────────┐
        │  Interface   │  「人とシステムの接点」
        │   Design     │
        └──────┬───────┘
               │
   ┌───────────┼───────────┐
   │                       │
┌──▼────┐              ┌──▼────┐
│Coding │ ←—橋渡し—→  │Design │
└───────┘              └───────┘
 「構造と挙動」          「知覚と意味」
```

## 1. コーディング (Coding)

実装の質を支える基礎技術。**読みやすさ**・**変更容易性**・**信頼性**の 3 軸。

- [[10-Coding/Clean-Code|クリーンコード原則]]
- [[10-Coding/SOLID-Principles|SOLID 原則]]
- [[10-Coding/Refactoring|リファクタリング]]
- [[10-Coding/Testing-Strategy|テスト戦略]]
- [[10-Coding/Code-Review|コードレビュー]]
- [[10-Coding/Design-Patterns|デザインパターン]]
- [[10-Coding/Performance|パフォーマンス最適化]]
- [[10-Coding/Error-Handling|エラーハンドリング]]

## 2. デザイン (Design)

視覚言語の文法。**階層**・**コントラスト**・**一貫性**で意味を運ぶ。

- [[20-Design/Visual-Hierarchy|視覚階層]]
- [[20-Design/Typography|タイポグラフィ]]
- [[20-Design/Color-Theory|カラーセオリー]]
- [[20-Design/Layout-Grid|レイアウトとグリッド]]
- [[20-Design/Design-Tokens|デザイントークン]]
- [[20-Design/Design-Systems|デザインシステム]]
- [[20-Design/Spacing-Rhythm|余白とリズム]]

## 3. インターフェース設計 (Interface Design)

ユーザーとシステムを結ぶ層。**理解可能性**・**操作可能性**・**回復可能性**を担保する。

- [[30-Interface/Interface-Index|インターフェース設計入口]]
- [[30-Interface/UX-Principles|UX の基本原則]]
- [[30-Interface/Accessibility|アクセシビリティ]]
- [[30-Interface/Interaction-Patterns|インタラクションパターン]]
- [[30-Interface/Information-Architecture|情報アーキテクチャ]]
- [[30-Interface/Microinteractions|マイクロインタラクション]]
- [[30-Interface/Responsive-Design|レスポンシブデザイン]]
- [[30-Interface/Forms-and-Input|フォームと入力]]

## 4. 橋渡し (Bridge)

3 領域を貫く実践テーマ。

- [[40-Bridge/Component-Driven-Development|コンポーネント駆動開発]]
- [[40-Bridge/Design-Code-Handoff|デザインとコードの受け渡し]]
- [[40-Bridge/Naming-as-Design|名前付けという設計]]
- [[40-Bridge/Performance-as-UX|パフォーマンスという UX]]

## 学習の動線(推奨)

```
Coding入門 → Clean-Code → SOLID → Refactoring → Testing
              ↓
          Design入門 → Visual-Hierarchy → Typography → Color-Theory
                          ↓
                  Interface入門 → UX-Principles → Accessibility
                                       ↓
                                Component-Driven-Development
```

## 関連

- [[Templates/Skill-Template|新規スキルノートのテンプレート]]
