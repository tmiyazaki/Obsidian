---
tags: [index, learning, path]
aliases: [学習経路, ラーニングパス]
---

# 学習経路 (Learning Paths)

役割・段階・関心別に「**この順で読むと身につく**」経路を整理。
全部読む必要なし、自分の現状に合うコースを選ぶ。

## 🌱 新人エンジニア (FE / BE 共通)

最初の 30 日。基礎の基礎を抑える。

```
Week 1: 読みやすさ
  [[../10-Coding/Clean-Code]]
  [[../10-Coding/Naming]]
  [[../10-Coding/Code-Review]]

Week 2: 構造
  [[../10-Coding/SOLID-Principles]]
  [[../10-Coding/Refactoring]]

Week 3: 信頼性
  [[../10-Coding/Testing-Strategy]]
  [[../10-Coding/Error-Handling]]
  [[../10-Coding/Version-Control]]

Week 4: 拡張
  [[../10-Coding/Design-Patterns]]
  [[../10-Coding/Architecture-Layers]]
  [[Cheatsheet]] で復習
```

並行して: [[../GLOSSARY]] を辞書として活用。

## 🌿 フロントエンドエンジニア (中級)

```
基礎: 上記新人パスを終える

Step 1: 状態と振る舞い
  [[../10-Coding/State-Management]]
  [[../10-Coding/Concurrency-Async]]
  [[../10-Coding/Type-Systems-and-DDD]]

Step 2: パフォーマンスと観測
  [[../10-Coding/Performance]]
  [[../40-Bridge/Performance-as-UX]]
  [[../10-Coding/Caching-Strategies]]

Step 3: UI/UX 基礎
  [[../30-Interface/UX-Principles]]
  [[../30-Interface/Accessibility]]
  [[../30-Interface/Mobile-Patterns]]
  [[../30-Interface/Forms-and-Input]]

Step 4: コンポーネント駆動
  [[../40-Bridge/Component-Driven-Development]]
  [[../20-Design/Design-Systems]]
  [[../20-Design/Design-Tokens]]

Step 5: ツールスタック
  [[../40-Bridge/Tool-Stacks-Recipes]]
  [[../10-Coding/CI-CD]]
```

## 🌳 シニア / アーキテクト

```
Step 1: 設計の深さ
  [[../10-Coding/Type-Systems-and-DDD]]
  [[../10-Coding/Architecture-Layers]]
  [[../10-Coding/API-Design]]

Step 2: 大規模・分散
  [[../10-Coding/Database-Design]]
  [[../10-Coding/Edge-and-Distributed]]
  [[../10-Coding/Caching-Strategies]]
  [[../10-Coding/Concurrency-Async]]

Step 3: 運用品質
  [[../10-Coding/Security]]
  [[../10-Coding/Observability]]
  [[../10-Coding/CI-CD]]
  [[../40-Bridge/Privacy-by-Design]]

Step 4: 進化と移行
  [[../40-Bridge/Tech-Debt]]
  [[../40-Bridge/Migrations-as-Product]]
  [[../40-Bridge/Documentation-as-Product]]

Step 5: チームとプロダクト
  [[../40-Bridge/Critique-Culture]]
  [[../40-Bridge/Discovery-and-Validation]]
  [[../40-Bridge/Roadmapping-Prioritization]]
  [[../40-Bridge/Knowledge-Management]]
```

## 🎨 デザイナー (UI / Visual)

```
Step 1: 視覚言語の基礎
  [[../20-Design/Visual-Hierarchy]]
  [[../20-Design/Typography]]
  [[../20-Design/Color-Theory]]
  [[../20-Design/Spacing-Rhythm]]
  [[../20-Design/Layout-Grid]]

Step 2: 体系
  [[../20-Design/Design-Tokens]]
  [[../20-Design/Design-Systems]]
  [[../20-Design/Iconography]]
  [[../20-Design/Brand-Voice]]

Step 3: 動・色・質感
  [[../20-Design/Motion-System]]
  [[../20-Design/Dark-Mode]]
  [[../20-Design/Material-Surfaces]]
  [[../20-Design/Variable-Type-Expression]]

Step 4: 表現の幅
  [[../20-Design/Editorial-Expressive-Layouts]]
  [[../20-Design/Generative-Procedural]]
  [[../20-Design/Creative-Coding-Canvas-WebGL]]
  [[../20-Design/Illustration-Photography]]
  [[../20-Design/Video-Motion-Graphics]]

Step 5: コードへの橋渡し
  [[../40-Bridge/Design-Code-Handoff]]
  [[../40-Bridge/Component-Driven-Development]]
  [[../40-Bridge/Naming-as-Design]]
```

## 🧠 UX / プロダクトデザイナー

```
Step 1: 原則と理解
  [[../30-Interface/UX-Principles]]
  [[../30-Interface/Mental-Models]]
  [[../30-Interface/User-Research]]
  [[../30-Interface/Information-Architecture]]

Step 2: アクセシビリティと包摂
  [[../30-Interface/Accessibility]]
  [[../40-Bridge/Inclusive-Design]]

Step 3: 振る舞い
  [[../30-Interface/Interaction-Patterns]]
  [[../30-Interface/Microinteractions]]
  [[../30-Interface/Forms-and-Input]]
  [[../30-Interface/Loading-States]]
  [[../30-Interface/Onboarding-Empty-States]]

Step 4: 言葉と体験
  [[../30-Interface/UX-Writing]]
  [[../30-Interface/Notifications]]
  [[../30-Interface/Search-UX]]
  [[../30-Interface/Settings-Preferences]]
  [[../30-Interface/Permissions-UX]]
  [[../30-Interface/Tables-Data-Grids]]
  [[../30-Interface/Dashboard-Design]]

Step 5: 倫理と未来
  [[../40-Bridge/Ethical-Design]]
  [[../40-Bridge/Privacy-by-Design]]
  [[../30-Interface/AI-LLM-Interfaces]]
  [[../30-Interface/Conversational-UI]]
```

## 📋 プロダクトマネージャー / プロダクトオーナー

```
Step 1: ユーザー理解
  [[../30-Interface/User-Research]]
  [[../30-Interface/Mental-Models]]
  [[../30-Interface/UX-Principles]]

Step 2: 何を作るか
  [[../40-Bridge/Discovery-and-Validation]]
  [[../40-Bridge/Roadmapping-Prioritization]]

Step 3: チームと文化
  [[../40-Bridge/Critique-Culture]]
  [[../40-Bridge/Documentation-as-Product]]
  [[../40-Bridge/Knowledge-Management]]

Step 4: 品質と倫理
  [[../40-Bridge/Tech-Debt]]
  [[../40-Bridge/Ethical-Design]]
  [[../40-Bridge/Privacy-by-Design]]
  [[../40-Bridge/Inclusive-Design]]
  [[../40-Bridge/Sustainability]]

Step 5: 体験全体
  [[../30-Interface/Onboarding-Empty-States]]
  [[../30-Interface/Notifications]]
  [[../30-Interface/Gamification]]
  [[../40-Bridge/Performance-as-UX]]
```

## 🤖 AI プロダクト / LLM 開発

```
Step 1: LLM UI 基礎
  [[../30-Interface/AI-LLM-Interfaces]]
  [[../30-Interface/Conversational-UI]]
  [[../30-Interface/Loading-States]]

Step 2: 周辺技術
  [[../30-Interface/Audio-Voice-UX]]
  [[../30-Interface/Search-UX]]
  [[../10-Coding/State-Management]]
  [[../10-Coding/API-Design]]

Step 3: 安全と倫理
  [[../10-Coding/Security]]
  [[../40-Bridge/Privacy-by-Design]]
  [[../40-Bridge/Ethical-Design]]
  [[../40-Bridge/Inclusive-Design]]

Step 4: 表現
  [[../20-Design/Generative-Procedural]]
  [[../20-Design/Creative-Coding-Canvas-WebGL]]
```

## 🎮 表現リッチな LP / クリエイティブサイト

```
Step 1: 基礎レイアウト
  [[../20-Design/Visual-Hierarchy]]
  [[../20-Design/Layout-Grid]]
  [[../20-Design/Editorial-Expressive-Layouts]]

Step 2: モーション
  [[../20-Design/Motion-System]]
  [[../30-Interface/Motion-Storytelling]]
  [[../30-Interface/Scroll-Driven-Animations]]
  [[../30-Interface/Microinteractions]]

Step 3: ビジュアルリッチ
  [[../20-Design/Material-Surfaces]]
  [[../20-Design/Variable-Type-Expression]]
  [[../20-Design/Illustration-Photography]]
  [[../20-Design/Video-Motion-Graphics]]
  [[../20-Design/Creative-Coding-Canvas-WebGL]]
  [[../20-Design/Generative-Procedural]]

Step 4: 体験を支える
  [[../40-Bridge/Performance-as-UX]]
  [[../30-Interface/Accessibility]]
  [[../40-Bridge/Sustainability]]
  [[../40-Bridge/Tool-Stacks-Recipes]]
```

## 🛡 セキュリティ・プライバシー担当

```
Step 1: 技術
  [[../10-Coding/Security]]
  [[../10-Coding/API-Design]]
  [[../10-Coding/Database-Design]]
  [[../10-Coding/Observability]]

Step 2: 設計
  [[../40-Bridge/Privacy-by-Design]]
  [[../40-Bridge/Ethical-Design]]

Step 3: UX
  [[../30-Interface/Permissions-UX]]
  [[../30-Interface/Settings-Preferences]]
  [[../30-Interface/Forms-and-Input]]

Step 4: 国際・社会
  [[../40-Bridge/Internationalization]]
  [[../40-Bridge/Inclusive-Design]]
  [[../30-Interface/Notifications]]
```

## 📱 モバイルファースト / ネイティブ開発

```
Step 1: モバイル UX
  [[../30-Interface/Mobile-Patterns]]
  [[../30-Interface/Responsive-Design]]
  [[../30-Interface/Microinteractions]]

Step 2: 表現と入力
  [[../30-Interface/Sensor-Camera-Haptics]]
  [[../30-Interface/Audio-Voice-UX]]
  [[../30-Interface/Drawing-Direct-Manipulation]]
  [[../30-Interface/AR-VR-Spatial]]

Step 3: 性能とオフライン
  [[../40-Bridge/Performance-as-UX]]
  [[../10-Coding/Edge-and-Distributed]]
  [[../10-Coding/Caching-Strategies]]
  [[../10-Coding/CI-CD]]

Step 4: 多デバイス
  [[../30-Interface/Wearables-TV-Embedded]]
  [[../30-Interface/Notifications]]
```

## 🏗 SaaS 立ち上げ (0 → 1)

```
Step 1: ユーザー理解
  [[../40-Bridge/Discovery-and-Validation]]
  [[../30-Interface/User-Research]]
  [[../30-Interface/Onboarding-Empty-States]]

Step 2: スタック選定
  [[../40-Bridge/Tool-Stacks-Recipes]]
  [[../40-Bridge/Component-Driven-Development]]
  [[../20-Design/Design-Systems]]

Step 3: 実装
  [[../10-Coding/Architecture-Layers]]
  [[../10-Coding/API-Design]]
  [[../10-Coding/Database-Design]]
  [[../10-Coding/Type-Systems-and-DDD]]

Step 4: ローンチ準備
  [[../10-Coding/Security]]
  [[../40-Bridge/Privacy-by-Design]]
  [[../10-Coding/CI-CD]]
  [[../10-Coding/Observability]]

Step 5: 成長
  [[../40-Bridge/Performance-as-UX]]
  [[../40-Bridge/Roadmapping-Prioritization]]
  [[../40-Bridge/Tech-Debt]]
```

## 🌐 国際化対応プロダクト

```
[[../40-Bridge/Internationalization]] (中核)
   ↓
[[../20-Design/Typography]]
[[../20-Design/Color-Theory]]
[[../30-Interface/UX-Writing]]
[[../30-Interface/Forms-and-Input]]
[[../40-Bridge/Inclusive-Design]]
[[../40-Bridge/Ethical-Design]] (各国規制)
[[../40-Bridge/Privacy-by-Design]] (Data Residency)
```

## 📚 横断テーマ別

| テーマ | パス |
|---|---|
| **新規ユーザー定着** | [[../30-Interface/Onboarding-Empty-States]] → [[../30-Interface/Mental-Models]] → [[../30-Interface/UX-Writing]] → [[../40-Bridge/Performance-as-UX]] → [[../30-Interface/Gamification]] |
| **大規模運用品質** | [[../10-Coding/Observability]] → [[../10-Coding/Security]] → [[../10-Coding/API-Design]] → [[../10-Coding/Performance]] → [[../10-Coding/CI-CD]] → [[../10-Coding/Edge-and-Distributed]] |
| **データを扱う UI** | [[../30-Interface/Tables-Data-Grids]] → [[../30-Interface/Search-UX]] → [[../30-Interface/Dashboard-Design]] → [[../20-Design/Data-Visualization]] → [[../10-Coding/Database-Design]] |
| **多人数協働 SaaS** | [[../30-Interface/Real-time-Collaboration]] → [[../30-Interface/Notifications]] → [[../30-Interface/Permissions-UX]] → [[../30-Interface/Settings-Preferences]] → [[../30-Interface/File-Management-UX]] |
| **デザインシステム構築** | [[../20-Design/Design-Tokens]] → [[../20-Design/Design-Systems]] → [[../20-Design/Brand-Voice]] → [[../40-Bridge/Component-Driven-Development]] → [[../40-Bridge/Design-Code-Handoff]] |

## 学習の原則

1. **読みっぱなしにしない** ─ 各ノートのチェックリストで自分のプロジェクトを評価
2. **実装で確認** ─ 知識は使うと定着する
3. **教える** ─ 学んだことを誰かに説明すると深まる
4. **書き足す** ─ 自分の経験を Vault に追記する

## 関連

- [[MOC]]
- [[Cheatsheet]]
- [[Decision-Frameworks]]
- [[Recipes]]
- [[Patterns-Catalog]]
- [[../GLOSSARY]]
