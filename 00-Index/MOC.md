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

### 基礎・設計

- [[10-Coding/Clean-Code|クリーンコード原則]]
- [[10-Coding/SOLID-Principles|SOLID 原則]]
- [[10-Coding/Naming|命名]]
- [[10-Coding/Functional-Programming|関数型プログラミングのコア]] ✨
- [[10-Coding/Design-Patterns|デザインパターン]]
- [[10-Coding/Architecture-Layers|アーキテクチャレイヤ]]

### 実装プラクティス

- [[10-Coding/Refactoring|リファクタリング]]
- [[10-Coding/Testing-Strategy|テスト戦略]]
- [[10-Coding/Code-Review|コードレビュー]]
- [[10-Coding/Error-Handling|エラーハンドリング]]
- [[10-Coding/Concurrency-Async|並行性と非同期]] ✨
- [[10-Coding/Version-Control|バージョン管理]]

### データと API

- [[10-Coding/API-Design|API 設計]]
- [[10-Coding/Database-Design|データベース設計]] ✨
- [[10-Coding/State-Management|状態管理]]

### 大規模・運用

- [[10-Coding/Performance|パフォーマンス最適化]]
- [[10-Coding/Security|セキュリティ]]
- [[10-Coding/Observability|観測性]]
- [[10-Coding/CI-CD|CI/CD とデプロイ戦略]] ✨

## 2. デザイン (Design)

視覚言語の文法。**階層**・**コントラスト**・**一貫性**で意味を運ぶ。

### 言語

- [[20-Design/Visual-Hierarchy|視覚階層]]
- [[20-Design/Typography|タイポグラフィ]]
- [[20-Design/Color-Theory|カラーセオリー]]
- [[20-Design/Spacing-Rhythm|余白とリズム]]
- [[20-Design/Layout-Grid|レイアウトとグリッド]]
- [[20-Design/Iconography|アイコノグラフィ]]

### 体系

- [[20-Design/Design-Tokens|デザイントークン]]
- [[20-Design/Design-Systems|デザインシステム]]
- [[20-Design/Motion-System|モーションシステム]]
- [[20-Design/Dark-Mode|ダークモード]]
- [[20-Design/Data-Visualization|データビジュアライゼーション]]
- [[20-Design/Brand-Voice|ブランドアイデンティティ]] ✨

## 3. インターフェース設計 (Interface Design)

ユーザーとシステムを結ぶ層。**理解可能性**・**操作可能性**・**回復可能性**を担保する。

### 原則と理解

- [[30-Interface/UX-Principles|UX の基本原則]]
- [[30-Interface/Mental-Models|メンタルモデルと認知負荷]] ✨
- [[30-Interface/Accessibility|アクセシビリティ]]
- [[30-Interface/Information-Architecture|情報アーキテクチャ]]
- [[30-Interface/User-Research|ユーザーリサーチ]] ✨

### 振る舞い

- [[30-Interface/Interaction-Patterns|インタラクションパターン]]
- [[30-Interface/Microinteractions|マイクロインタラクション]]
- [[30-Interface/Forms-and-Input|フォームと入力]]
- [[30-Interface/Loading-States|ローディング状態]]
- [[30-Interface/Onboarding-Empty-States|オンボーディングと空状態]]
- [[30-Interface/Notifications|通知システム]] ✨
- [[30-Interface/Real-time-Collaboration|リアルタイム協働]] ✨

### データと操作

- [[30-Interface/Tables-Data-Grids|テーブルとデータグリッド]] ✨
- [[30-Interface/Search-UX|検索 UX]] ✨
- [[30-Interface/Dashboard-Design|ダッシュボード設計]] ✨
- [[30-Interface/AI-LLM-Interfaces|AI / LLM インターフェース]] ✨

### 設定と権限

- [[30-Interface/Settings-Preferences|設定と環境設定]] ✨
- [[30-Interface/Permissions-UX|権限 UX]] ✨

### 環境と言葉

- [[30-Interface/Responsive-Design|レスポンシブデザイン]]
- [[30-Interface/Mobile-Patterns|モバイル固有パターン]]
- [[30-Interface/UX-Writing|UX ライティング]]

## 4. 橋渡し (Bridge)

3 領域を貫く実践テーマ。

### 協働とプロセス

- [[40-Bridge/Component-Driven-Development|コンポーネント駆動開発]]
- [[40-Bridge/Design-Code-Handoff|デザインとコードの受け渡し]]
- [[40-Bridge/Documentation-as-Product|プロダクトとしてのドキュメンテーション]]
- [[40-Bridge/Critique-Culture|批評文化とフィードバック]] ✨

### 言語と意味

- [[40-Bridge/Naming-as-Design|名前付けという設計]]
- [[40-Bridge/Internationalization|国際化と地域化]]
- [[40-Bridge/Inclusive-Design|インクルーシブデザイン]] ✨

### 体験の質

- [[40-Bridge/Performance-as-UX|パフォーマンスという UX]]
- [[40-Bridge/Ethical-Design|倫理的デザイン]]
- [[40-Bridge/Sustainability|サステナビリティ]] ✨

### 戦略と進化

- [[40-Bridge/Tech-Debt|技術的負債のマネジメント]] ✨
- [[40-Bridge/Migrations-as-Product|プロダクトとしてのマイグレーション]] ✨

## 学習の動線(推奨)

### 新人エンジニア向け

```
Clean-Code → Naming → SOLID → Refactoring → Testing → Code-Review
  ↓
Architecture-Layers → Error-Handling → API-Design
  ↓
Performance → Security → Observability
```

### デザイン基礎

```
Visual-Hierarchy → Typography → Color-Theory → Spacing-Rhythm → Layout-Grid
  ↓
Design-Tokens → Design-Systems → Motion-System → Dark-Mode
```

### インターフェース設計

```
UX-Principles → Mental-Models → Accessibility → Interaction-Patterns
  ↓
User-Research → Information-Architecture → UX-Writing
  ↓
Onboarding-Empty-States → Forms-and-Input → Mobile-Patterns
```

### 領域横断 (Bridge)

```
Component-Driven-Development → Design-Code-Handoff
  ↓
Naming-as-Design → Documentation-as-Product
  ↓
Performance-as-UX → Internationalization → Ethical-Design
```

## 横断的に読むテーマ

| テーマ | 主要ノート |
|---|---|
| **新規ユーザー定着** | [[30-Interface/Onboarding-Empty-States]] / [[30-Interface/Mental-Models]] / [[30-Interface/UX-Writing]] / [[40-Bridge/Performance-as-UX]] |
| **大規模運用品質** | [[10-Coding/Observability]] / [[10-Coding/Security]] / [[10-Coding/API-Design]] / [[10-Coding/Performance]] / [[10-Coding/CI-CD]] |
| **データを扱う UI** | [[30-Interface/Tables-Data-Grids]] / [[30-Interface/Search-UX]] / [[30-Interface/Dashboard-Design]] / [[20-Design/Data-Visualization]] / [[10-Coding/Database-Design]] |
| **多人数協働 SaaS** | [[30-Interface/Real-time-Collaboration]] / [[30-Interface/Notifications]] / [[30-Interface/Permissions-UX]] / [[30-Interface/Settings-Preferences]] |
| **AI 統合プロダクト** | [[30-Interface/AI-LLM-Interfaces]] / [[10-Coding/State-Management]] / [[40-Bridge/Ethical-Design]] / [[10-Coding/Security]] |
| **国際向けプロダクト** | [[40-Bridge/Internationalization]] / [[40-Bridge/Inclusive-Design]] / [[20-Design/Typography]] / [[30-Interface/UX-Writing]] |
| **デザインの実装統合** | [[40-Bridge/Component-Driven-Development]] / [[20-Design/Design-Tokens]] / [[20-Design/Brand-Voice]] / [[40-Bridge/Design-Code-Handoff]] / [[40-Bridge/Naming-as-Design]] |
| **アクセシビリティ** | [[30-Interface/Accessibility]] / [[40-Bridge/Inclusive-Design]] / [[20-Design/Color-Theory]] / [[30-Interface/Mobile-Patterns]] / [[20-Design/Motion-System]] |
| **長期進化** | [[40-Bridge/Tech-Debt]] / [[40-Bridge/Migrations-as-Product]] / [[40-Bridge/Documentation-as-Product]] / [[10-Coding/CI-CD]] / [[40-Bridge/Critique-Culture]] |
| **持続可能性と倫理** | [[40-Bridge/Sustainability]] / [[40-Bridge/Ethical-Design]] / [[40-Bridge/Inclusive-Design]] / [[40-Bridge/Performance-as-UX]] |

## 関連

- [[../GLOSSARY|用語集]]
- [[../Templates/Skill-Template|新規スキルノートのテンプレート]]
