---
tags: [index, recipes, walkthrough]
aliases: [レシピ, 構築ガイド]
---

# レシピ集 ─ 「**X を作る**」エンドツーエンド

実プロジェクトで頻出する「**X を作る**」を、関連ノートを縫い合わせる**手順**として提示。
各レシピ = 関連ノートのナビゲーションマップ。

## 🍱 SaaS ダッシュボードを作る

数値・グラフ・テーブルが並ぶ管理画面。

```
1. 仮説を検証
   [[../40-Bridge/Discovery-and-Validation]]
   ↓ 「誰が・いつ・何を判断するために見るか」を定義

2. 情報構造を決める
   [[../30-Interface/Information-Architecture]]
   [[../30-Interface/Dashboard-Design]]
   ↓ KPI / グラフ / テーブルの階層

3. ビジュアル化
   [[../20-Design/Data-Visualization]]
   [[../20-Design/Visual-Hierarchy]]
   [[../20-Design/Color-Theory]]

4. テーブル実装
   [[../30-Interface/Tables-Data-Grids]]
   ↓ 列の優先度、ソート / フィルタ

5. データ層
   [[../10-Coding/Database-Design]]
   [[../10-Coding/API-Design]]
   [[../10-Coding/Caching-Strategies]]

6. 状態管理
   [[../10-Coding/State-Management]]
   ↓ TanStack Query 等でサーバ状態

7. パフォーマンス
   [[../10-Coding/Performance]]
   [[../30-Interface/Loading-States]]
   [[../40-Bridge/Performance-as-UX]]

8. 設定とエクスポート
   [[../30-Interface/Settings-Preferences]]

9. アクセシビリティ・モバイル
   [[../30-Interface/Accessibility]]
   [[../30-Interface/Mobile-Patterns]]
   [[../30-Interface/Responsive-Design]]
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#📊-データビジュアライゼーション]]

## 💬 AI チャットアシスタントを作る

LLM ベースの会話 UI。

```
1. 設計判断
   [[Decision-Frameworks#-ai-llm-判断]]
   ↓ LLM を使うべきか、どのモデル

2. UI パターン
   [[../30-Interface/AI-LLM-Interfaces]]
   [[../30-Interface/Conversational-UI]]
   [[../30-Interface/Loading-States]]
   ↓ ストリーミング、引用、フィードバック

3. プロンプトと型
   [[../10-Coding/Type-Systems-and-DDD]]
   ↓ Zod で構造化出力の型保証

4. 履歴と状態
   [[../10-Coding/State-Management]]
   [[../30-Interface/Search-UX]]

5. ファイル添付
   [[../30-Interface/File-Management-UX]]

6. 音声入力(任意)
   [[../30-Interface/Audio-Voice-UX]]

7. アクセシビリティ
   [[../30-Interface/Accessibility]]
   ↓ aria-live、キーボード

8. 倫理・プライバシー
   [[../40-Bridge/Ethical-Design]]
   [[../40-Bridge/Privacy-by-Design]]
   [[../10-Coding/Security]]
   ↓ 学習に使うか明示、機密マスク

9. パフォーマンス
   [[../10-Coding/Performance]]
   [[../10-Coding/Edge-and-Distributed]]
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#-ai--llm-統合]]

## 🎨 デザインシステムを立ち上げる

```
1. ブランドの整理
   [[../20-Design/Brand-Voice]]
   ↓ パーソナリティ・声色

2. 視覚言語
   [[../20-Design/Visual-Hierarchy]]
   [[../20-Design/Typography]]
   [[../20-Design/Color-Theory]]
   [[../20-Design/Spacing-Rhythm]]
   [[../20-Design/Iconography]]

3. トークン化
   [[../20-Design/Design-Tokens]]
   ↓ Reference / Semantic / Component の 3 層

4. 動と暗
   [[../20-Design/Motion-System]]
   [[../20-Design/Dark-Mode]]

5. システム化
   [[../20-Design/Design-Systems]]
   ↓ コンポーネント・パターン・ガイドライン

6. コードへ
   [[../40-Bridge/Component-Driven-Development]]
   [[../40-Bridge/Design-Code-Handoff]]
   [[../40-Bridge/Naming-as-Design]]

7. 文書化
   [[../40-Bridge/Documentation-as-Product]]

8. ガバナンス
   [[../40-Bridge/Critique-Culture]]
   [[../40-Bridge/Tech-Debt]] (古いコンポーネントの管理)
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#-デザインシステム実装]]

## 🚀 LP / マーケサイトを作る

ヒーロー演出が記憶に残る LP。

```
1. ブランドと方向性
   [[../20-Design/Brand-Voice]]
   ↓ パーソナリティ・声色

2. レイアウト
   [[../20-Design/Editorial-Expressive-Layouts]]
   [[../20-Design/Visual-Hierarchy]]
   [[../20-Design/Layout-Grid]]

3. 表現リッチ化
   [[../20-Design/Material-Surfaces]]
   [[../20-Design/Variable-Type-Expression]]
   [[../20-Design/Illustration-Photography]]
   [[../20-Design/Video-Motion-Graphics]]

4. クリエイティブコーディング
   [[../20-Design/Creative-Coding-Canvas-WebGL]]
   [[../20-Design/Generative-Procedural]]

5. モーション
   [[../20-Design/Motion-System]]
   [[../30-Interface/Motion-Storytelling]]
   [[../30-Interface/Scroll-Driven-Animations]]
   [[../30-Interface/Microinteractions]]

6. パフォーマンス
   [[../40-Bridge/Performance-as-UX]]
   [[../10-Coding/Performance]]
   [[../40-Bridge/Sustainability]]

7. アクセシビリティ
   [[../30-Interface/Accessibility]]
   ↓ prefers-reduced-motion
   [[../40-Bridge/Inclusive-Design]]
```

## 👥 多人数同時編集ツール

Figma / Linear / Notion 風。

```
1. アーキテクチャ
   [[../10-Coding/Architecture-Layers]]
   [[../10-Coding/Concurrency-Async]]
   ↓ CRDT / OT 採用判断

2. リアルタイム協働
   [[../30-Interface/Real-time-Collaboration]]
   ↓ Presence / Awareness / Conflict / History

3. 直接操作
   [[../30-Interface/Drawing-Direct-Manipulation]]
   ↓ ドラッグ / 描画 / Undo

4. 権限と共有
   [[../30-Interface/Permissions-UX]]
   [[../30-Interface/Settings-Preferences]]

5. ファイル管理
   [[../30-Interface/File-Management-UX]]

6. 通知
   [[../30-Interface/Notifications]]

7. 状態管理
   [[../10-Coding/State-Management]]
   ↓ Yjs + Zustand 等

8. パフォーマンス
   [[../10-Coding/Performance]]
   [[../10-Coding/Edge-and-Distributed]]
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#-リアルタイム--共同編集]]

## 📝 リッチエディタ (Notion / Tiptap)

```
1. 直接操作の基礎
   [[../30-Interface/Drawing-Direct-Manipulation]]

2. テキスト体験
   [[../30-Interface/UX-Writing]]
   [[../20-Design/Typography]]

3. インライン編集 + コラボ
   [[../30-Interface/Real-time-Collaboration]]
   [[../30-Interface/Tables-Data-Grids]] (テーブル機能)

4. ファイル添付
   [[../30-Interface/File-Management-UX]]

5. 検索とコマンド
   [[../30-Interface/Search-UX]]

6. 状態管理
   [[../10-Coding/State-Management]]

7. AI 統合 (任意)
   [[../30-Interface/AI-LLM-Interfaces]]
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#-リッチテキストエディタ]]

## 📱 モバイルアプリ立ち上げ

```
1. プラットフォーム理解
   [[../30-Interface/Mobile-Patterns]]
   [[../30-Interface/Responsive-Design]]

2. オンボーディング
   [[../30-Interface/Onboarding-Empty-States]]
   [[../30-Interface/UX-Writing]]
   [[../30-Interface/Mental-Models]]

3. 入力チャネル
   [[../30-Interface/Sensor-Camera-Haptics]]
   [[../30-Interface/Audio-Voice-UX]]

4. 通知
   [[../30-Interface/Notifications]]

5. オフラインと性能
   [[../10-Coding/Caching-Strategies]]
   [[../40-Bridge/Performance-as-UX]]

6. アクセシビリティ
   [[../30-Interface/Accessibility]]
   [[../40-Bridge/Inclusive-Design]]

7. プライバシー
   [[../40-Bridge/Privacy-by-Design]]
   [[../30-Interface/Permissions-UX]]
```

## 🛒 EC サイト

```
1. 情報構造
   [[../30-Interface/Information-Architecture]]
   [[../30-Interface/Search-UX]]

2. 検索とフィルタ
   [[../30-Interface/Search-UX]]
   [[../30-Interface/Tables-Data-Grids]]

3. 商品ページ
   [[../20-Design/Illustration-Photography]]
   [[../20-Design/Video-Motion-Graphics]]
   [[../30-Interface/AR-VR-Spatial]] (試着・配置)

4. カートと購入フロー
   [[../30-Interface/Forms-and-Input]]
   [[../30-Interface/Loading-States]]
   [[../30-Interface/Microinteractions]]

5. 信頼の演出
   [[../30-Interface/UX-Writing]]
   [[../10-Coding/Security]]
   [[../40-Bridge/Privacy-by-Design]]

6. 国際化
   [[../40-Bridge/Internationalization]]

7. パフォーマンス
   [[../40-Bridge/Performance-as-UX]]

8. 倫理 (ダークパターン回避)
   [[../40-Bridge/Ethical-Design]]
```

## 📊 アナリティクス / BI ツール

```
1. データモデル
   [[../10-Coding/Database-Design]]

2. ダッシュボード設計
   [[../30-Interface/Dashboard-Design]]
   [[../20-Design/Data-Visualization]]
   [[../30-Interface/Tables-Data-Grids]]

3. クエリ・フィルタ
   [[../30-Interface/Search-UX]]
   [[../30-Interface/Settings-Preferences]]

4. リアルタイム
   [[../30-Interface/Real-time-Collaboration]]
   [[../10-Coding/Edge-and-Distributed]]

5. パフォーマンス
   [[../10-Coding/Caching-Strategies]]
   [[../10-Coding/Performance]]

6. 共有・エクスポート
   [[../30-Interface/Permissions-UX]]
   [[../30-Interface/File-Management-UX]]
```

## 🎮 ゲーミフィケーション機能

学習・健康・業務に動機付けを加える。

```
1. 動機の理論
   [[../30-Interface/Gamification]]
   [[../30-Interface/Mental-Models]]
   [[../30-Interface/UX-Principles]]

2. UI 演出
   [[../30-Interface/Microinteractions]]
   [[../20-Design/Motion-System]]
   [[../30-Interface/Notifications]]

3. データ
   [[../10-Coding/Database-Design]] (進捗、ストリーク)

4. アクセシビリティ・倫理
   [[../30-Interface/Accessibility]]
   [[../40-Bridge/Ethical-Design]]
   [[../40-Bridge/Inclusive-Design]]
```

## 🔐 認証・アカウント周り

```
1. セキュリティ基礎
   [[../10-Coding/Security]]

2. UI
   [[../30-Interface/Forms-and-Input]]
   [[../30-Interface/UX-Writing]]
   [[../30-Interface/Onboarding-Empty-States]]

3. 設定
   [[../30-Interface/Settings-Preferences]]
   [[../30-Interface/Permissions-UX]]

4. プライバシー
   [[../40-Bridge/Privacy-by-Design]]
   [[../40-Bridge/Ethical-Design]]

5. パスワードレス / Passkey
   [[../30-Interface/Mobile-Patterns]] (生体認証)
```

スタック: → [[../40-Bridge/Tool-Stacks-Recipes#-認証認可]]

## 📨 通知 / コミュニケーションシステム

```
1. 通知設計
   [[../30-Interface/Notifications]]

2. UX ライティング
   [[../30-Interface/UX-Writing]]
   [[../40-Bridge/Internationalization]]

3. メール HTML
   [[../20-Design/Typography]]
   [[../20-Design/Color-Theory]]
   ↓ メールクライアント互換

4. 配信信頼性
   [[../10-Coding/Concurrency-Async]] (キュー)
   [[../10-Coding/Observability]]

5. 倫理
   [[../40-Bridge/Ethical-Design]]
   ↓ オプトイン、解除容易性

6. リアルタイム
   [[../30-Interface/Real-time-Collaboration]]
   ↓ in-app 通知
```

## 🌐 国際展開 (既存サービスの多言語化)

```
1. i18n 設計
   [[../40-Bridge/Internationalization]]

2. UI の言語化
   [[../30-Interface/UX-Writing]]
   [[../20-Design/Typography]] (日本語フォント等)

3. 文化的配慮
   [[../20-Design/Color-Theory]]
   [[../20-Design/Iconography]]
   [[../40-Bridge/Inclusive-Design]]

4. 法規制
   [[../40-Bridge/Privacy-by-Design]]
   [[../40-Bridge/Ethical-Design]]

5. データ residency
   [[../10-Coding/Edge-and-Distributed]]
   [[../10-Coding/Database-Design]]

6. テスト
   [[../30-Interface/User-Research]]
```

## 🏗 レガシー → モダン化

既存システムを段階的に置換。

```
1. 現状把握
   [[../40-Bridge/Tech-Debt]]
   [[../10-Coding/Observability]]

2. 設計
   [[../10-Coding/Architecture-Layers]]
   [[../10-Coding/Type-Systems-and-DDD]]
   [[../40-Bridge/Migrations-as-Product]]
   ↓ Strangler Fig

3. テストの保護
   [[../10-Coding/Testing-Strategy]]
   [[../10-Coding/Refactoring]]

4. データ移行
   [[../10-Coding/Database-Design]]
   [[../40-Bridge/Migrations-as-Product]]

5. デプロイ
   [[../10-Coding/CI-CD]]
   ↓ Feature Flag, Canary

6. UI 移行
   [[../30-Interface/Onboarding-Empty-States]]
   ↓ 旧 UI からの誘導
```

## 関連

- [[MOC]]
- [[Cheatsheet]]
- [[Decision-Frameworks]]
- [[Learning-Paths]]
- [[Patterns-Catalog]]
- [[../40-Bridge/Tool-Stacks-Recipes]]
