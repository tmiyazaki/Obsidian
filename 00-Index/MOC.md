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

## 🧭 全体協調ツール (まずここから)

新規参入や調べ物の入口として、**横断的に使える**ノート群:

- 📋 [[Cheatsheet|チートシート]] ─ 数値・閾値・パターンの 1 ページ集約
- 🎯 [[Decision-Frameworks|意思決定フレーム]] ─ 「何を選ぶか」の判断軸
- 🌱 [[Learning-Paths|学習経路]] ─ 役割別の読む順
- 🍱 [[Recipes|レシピ集]] ─ 「X を作る」エンドツーエンド
- 🔁 [[Patterns-Catalog|パターン目録]] ─ 領域横断の共通パターン語彙
- 📖 [[../GLOSSARY|用語集]] ─ 約 100 用語のクロスリファレンス
- 📝 [[../Templates/Skill-Template|テンプレート]] ─ 新規ノート用

## 1. コーディング (Coding)

実装の質を支える基礎技術。**読みやすさ**・**変更容易性**・**信頼性**の 3 軸。

### 基礎・設計

- [[10-Coding/Clean-Code|クリーンコード原則]]
- [[10-Coding/SOLID-Principles|SOLID 原則]]
- [[10-Coding/Naming|命名]]
- [[10-Coding/Functional-Programming|関数型プログラミングのコア]]
- [[10-Coding/Design-Patterns|デザインパターン]]
- [[10-Coding/Architecture-Layers|アーキテクチャレイヤ]]
- [[10-Coding/Type-Systems-and-DDD|型システムとドメインモデリング]] ✨

### 実装プラクティス

- [[10-Coding/Refactoring|リファクタリング]]
- [[10-Coding/Testing-Strategy|テスト戦略]]
- [[10-Coding/Code-Review|コードレビュー]]
- [[10-Coding/Error-Handling|エラーハンドリング]]
- [[10-Coding/Concurrency-Async|並行性と非同期]]
- [[10-Coding/Version-Control|バージョン管理]]

### データと境界

- [[10-Coding/API-Design|API 設計]]
- [[10-Coding/Database-Design|データベース設計]]
- [[10-Coding/State-Management|状態管理]]
- [[10-Coding/Caching-Strategies|キャッシング戦略]] ✨
- [[10-Coding/Edge-and-Distributed|エッジと分散システム]] ✨

### 大規模・運用

- [[10-Coding/Performance|パフォーマンス最適化]]
- [[10-Coding/Security|セキュリティ]]
- [[10-Coding/Observability|観測性]]
- [[10-Coding/CI-CD|CI/CD とデプロイ戦略]]

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
- [[20-Design/Brand-Voice|ブランドアイデンティティ]]

### 表現の幅 (Expressive Range)

- [[20-Design/Creative-Coding-Canvas-WebGL|クリエイティブコーディング]]
- [[20-Design/Generative-Procedural|生成的・手続き型デザイン]]
- [[20-Design/Editorial-Expressive-Layouts|編集的・表現的レイアウト]]
- [[20-Design/Material-Surfaces|マテリアルとサーフェス]]
- [[20-Design/Variable-Type-Expression|可変フォントによるタイポ表現]]
- [[20-Design/Illustration-Photography|イラストと写真ディレクション]] ✨
- [[20-Design/Video-Motion-Graphics|動画とモーショングラフィックス]] ✨

## 3. インターフェース設計 (Interface Design)

ユーザーとシステムを結ぶ層。**理解可能性**・**操作可能性**・**回復可能性**を担保する。

### 原則と理解

- [[30-Interface/UX-Principles|UX の基本原則]]
- [[30-Interface/Mental-Models|メンタルモデルと認知負荷]]
- [[30-Interface/Accessibility|アクセシビリティ]]
- [[30-Interface/Information-Architecture|情報アーキテクチャ]]
- [[30-Interface/User-Research|ユーザーリサーチ]]

### 振る舞い

- [[30-Interface/Interaction-Patterns|インタラクションパターン]]
- [[30-Interface/Microinteractions|マイクロインタラクション]]
- [[30-Interface/Forms-and-Input|フォームと入力]]
- [[30-Interface/Loading-States|ローディング状態]]
- [[30-Interface/Onboarding-Empty-States|オンボーディングと空状態]]
- [[30-Interface/Notifications|通知システム]]
- [[30-Interface/Real-time-Collaboration|リアルタイム協働]]

### データと操作

- [[30-Interface/Tables-Data-Grids|テーブルとデータグリッド]]
- [[30-Interface/Search-UX|検索 UX]]
- [[30-Interface/Dashboard-Design|ダッシュボード設計]]
- [[30-Interface/File-Management-UX|ファイル管理 UX]] ✨
- [[30-Interface/AI-LLM-Interfaces|AI / LLM インターフェース]]
- [[30-Interface/Conversational-UI|会話型 UI]] ✨

### 設定・権限・動機

- [[30-Interface/Settings-Preferences|設定と環境設定]]
- [[30-Interface/Permissions-UX|権限 UX]]
- [[30-Interface/Gamification|ゲーミフィケーション]] ✨

### 環境と言葉

- [[30-Interface/Responsive-Design|レスポンシブデザイン]]
- [[30-Interface/Mobile-Patterns|モバイル固有パターン]]
- [[30-Interface/UX-Writing|UX ライティング]]
- [[30-Interface/Wearables-TV-Embedded|ウェアラブル / TV / 組み込み]] ✨

### 表現の幅 (Expressive Range)

- [[30-Interface/Motion-Storytelling|モーションストーリーテリング]]
- [[30-Interface/Scroll-Driven-Animations|スクロール駆動アニメーション]]
- [[30-Interface/Drawing-Direct-Manipulation|描画と直接操作]]
- [[30-Interface/Audio-Voice-UX|音声・サウンド UX]]
- [[30-Interface/Sensor-Camera-Haptics|センサー・カメラ・触覚]]
- [[30-Interface/AR-VR-Spatial|AR / VR / 空間 UI]]

## 4. 橋渡し (Bridge)

3 領域を貫く実践テーマ。

### 協働とプロセス

- [[40-Bridge/Component-Driven-Development|コンポーネント駆動開発]]
- [[40-Bridge/Design-Code-Handoff|デザインとコードの受け渡し]]
- [[40-Bridge/Documentation-as-Product|プロダクトとしてのドキュメンテーション]]
- [[40-Bridge/Critique-Culture|批評文化とフィードバック]]
- [[40-Bridge/Knowledge-Management|知識マネジメント]] ✨

### 言語と意味

- [[40-Bridge/Naming-as-Design|名前付けという設計]]
- [[40-Bridge/Internationalization|国際化と地域化]]
- [[40-Bridge/Inclusive-Design|インクルーシブデザイン]]

### 体験の質

- [[40-Bridge/Performance-as-UX|パフォーマンスという UX]]
- [[40-Bridge/Ethical-Design|倫理的デザイン]]
- [[40-Bridge/Sustainability|サステナビリティ]]
- [[40-Bridge/Privacy-by-Design|プライバシー・バイ・デザイン]] ✨

### 戦略と進化

- [[40-Bridge/Tech-Debt|技術的負債のマネジメント]]
- [[40-Bridge/Migrations-as-Product|プロダクトとしてのマイグレーション]]
- [[40-Bridge/Discovery-and-Validation|プロダクトディスカバリと検証]] ✨
- [[40-Bridge/Roadmapping-Prioritization|ロードマッピングと優先順位付け]] ✨

### 表現の幅 (Expressive Range)

- [[40-Bridge/Tool-Stacks-Recipes|ツールスタックの組み合わせレシピ集]]

## 学習の動線

詳しくは → [[Learning-Paths]]

```
新人エンジニア
   ↓
Clean-Code → Naming → SOLID → Refactoring → Testing → Code-Review
   ↓
Architecture-Layers → Type-Systems-and-DDD → Error-Handling → API-Design
   ↓
Performance → Caching → Security → Observability → Edge-and-Distributed
```

```
デザイン基礎
   ↓
Visual-Hierarchy → Typography → Color-Theory → Spacing-Rhythm → Layout-Grid
   ↓
Design-Tokens → Design-Systems → Motion-System → Brand-Voice
   ↓
表現拡張: Editorial → Material → Variable Type → Creative Coding
```

```
インターフェース設計
   ↓
UX-Principles → Mental-Models → User-Research → Accessibility
   ↓
Interaction-Patterns → Forms → Loading-States → Onboarding-Empty-States
   ↓
データ系: Tables → Search → Dashboard → File-Management
AI 系: AI-LLM → Conversational
```

```
領域横断 (Bridge)
   ↓
Component-Driven-Development → Design-Code-Handoff → Naming-as-Design
   ↓
Documentation-as-Product → Knowledge-Management → Critique-Culture
   ↓
Discovery → Roadmapping → Tech-Debt → Migrations-as-Product
   ↓
Performance-as-UX → Privacy-by-Design → Ethical-Design → Sustainability
```

## 横断的に読むテーマ

| テーマ | 主要ノート |
|---|---|
| **新規ユーザー定着** | [[30-Interface/Onboarding-Empty-States]] / [[30-Interface/Mental-Models]] / [[30-Interface/UX-Writing]] / [[40-Bridge/Performance-as-UX]] / [[30-Interface/Gamification]] |
| **大規模運用品質** | [[10-Coding/Observability]] / [[10-Coding/Security]] / [[10-Coding/API-Design]] / [[10-Coding/Performance]] / [[10-Coding/CI-CD]] / [[10-Coding/Edge-and-Distributed]] / [[10-Coding/Caching-Strategies]] |
| **データを扱う UI** | [[30-Interface/Tables-Data-Grids]] / [[30-Interface/Search-UX]] / [[30-Interface/Dashboard-Design]] / [[20-Design/Data-Visualization]] / [[10-Coding/Database-Design]] |
| **多人数協働 SaaS** | [[30-Interface/Real-time-Collaboration]] / [[30-Interface/Notifications]] / [[30-Interface/Permissions-UX]] / [[30-Interface/Settings-Preferences]] / [[30-Interface/File-Management-UX]] |
| **AI 統合プロダクト** | [[30-Interface/AI-LLM-Interfaces]] / [[30-Interface/Conversational-UI]] / [[30-Interface/Audio-Voice-UX]] / [[10-Coding/State-Management]] / [[40-Bridge/Ethical-Design]] / [[40-Bridge/Privacy-by-Design]] |
| **国際向けプロダクト** | [[40-Bridge/Internationalization]] / [[40-Bridge/Inclusive-Design]] / [[20-Design/Typography]] / [[30-Interface/UX-Writing]] / [[40-Bridge/Privacy-by-Design]] |
| **デザインの実装統合** | [[40-Bridge/Component-Driven-Development]] / [[20-Design/Design-Tokens]] / [[20-Design/Brand-Voice]] / [[40-Bridge/Design-Code-Handoff]] / [[40-Bridge/Naming-as-Design]] |
| **アクセシビリティ** | [[30-Interface/Accessibility]] / [[40-Bridge/Inclusive-Design]] / [[20-Design/Color-Theory]] / [[30-Interface/Mobile-Patterns]] / [[20-Design/Motion-System]] |
| **長期進化** | [[40-Bridge/Tech-Debt]] / [[40-Bridge/Migrations-as-Product]] / [[40-Bridge/Documentation-as-Product]] / [[40-Bridge/Knowledge-Management]] / [[10-Coding/CI-CD]] / [[40-Bridge/Critique-Culture]] |
| **持続可能性と倫理** | [[40-Bridge/Sustainability]] / [[40-Bridge/Ethical-Design]] / [[40-Bridge/Privacy-by-Design]] / [[40-Bridge/Inclusive-Design]] / [[40-Bridge/Performance-as-UX]] |
| **表現の差別化 (LP・ヒーロー)** | [[20-Design/Creative-Coding-Canvas-WebGL]] / [[20-Design/Editorial-Expressive-Layouts]] / [[30-Interface/Motion-Storytelling]] / [[20-Design/Variable-Type-Expression]] / [[20-Design/Material-Surfaces]] / [[20-Design/Video-Motion-Graphics]] |
| **没入型・空間・センサー** | [[30-Interface/AR-VR-Spatial]] / [[30-Interface/Sensor-Camera-Haptics]] / [[30-Interface/Audio-Voice-UX]] / [[20-Design/Creative-Coding-Canvas-WebGL]] / [[30-Interface/Wearables-TV-Embedded]] |
| **クリエイティブツール (Figma 級)** | [[30-Interface/Drawing-Direct-Manipulation]] / [[30-Interface/Real-time-Collaboration]] / [[30-Interface/File-Management-UX]] / [[40-Bridge/Tool-Stacks-Recipes]] / [[10-Coding/State-Management]] |
| **モダンスタック構築** | [[40-Bridge/Tool-Stacks-Recipes]] / [[40-Bridge/Component-Driven-Development]] / [[20-Design/Design-Tokens]] / [[10-Coding/CI-CD]] |
| **プロダクト戦略** | [[40-Bridge/Discovery-and-Validation]] / [[40-Bridge/Roadmapping-Prioritization]] / [[40-Bridge/Tech-Debt]] / [[40-Bridge/Critique-Culture]] / [[40-Bridge/Knowledge-Management]] |
| **動機と長期エンゲージメント** | [[30-Interface/Gamification]] / [[30-Interface/Onboarding-Empty-States]] / [[30-Interface/Notifications]] / [[40-Bridge/Ethical-Design]] |
| **ビジュアルディレクション** | [[20-Design/Brand-Voice]] / [[20-Design/Illustration-Photography]] / [[20-Design/Video-Motion-Graphics]] / [[20-Design/Iconography]] / [[20-Design/Material-Surfaces]] |
| **多デバイス展開** | [[30-Interface/Mobile-Patterns]] / [[30-Interface/Wearables-TV-Embedded]] / [[30-Interface/Responsive-Design]] / [[30-Interface/AR-VR-Spatial]] |

## 関連

- 全体協調: [[Cheatsheet]] / [[Decision-Frameworks]] / [[Learning-Paths]] / [[Recipes]] / [[Patterns-Catalog]]
- 用語: [[../GLOSSARY|用語集]]
- 入口: [[../README|README]]
- テンプレート: [[../Templates/Skill-Template]]
