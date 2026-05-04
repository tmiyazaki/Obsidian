---
tags: [index, patterns, catalog]
aliases: [パターン目録, パターンカタログ]
---

# パターン目録 ─ 領域横断のパターン語彙

3 領域 (Coding / Design / Interface) に**同形のパターン**が現れる。同じ問題に同じ語彙を使うことで、議論が早くなる。
このページは「**異なる場所で同じ形を持つ**」パターンを横断的に対応付ける。

## 🌐 構造化のパターン

### 階層 (Hierarchy)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Design | 視覚階層 (大小・色・余白) | [[../20-Design/Visual-Hierarchy]] |
| Coding | アーキテクチャ層 (依存方向) | [[../10-Coding/Architecture-Layers]] |
| Interface | 情報構造 (IA) | [[../30-Interface/Information-Architecture]] |

「**何を最初に・何を後に**」が共通テーマ。

### トークン化 (Tokenization)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Design | デザイントークン | [[../20-Design/Design-Tokens]] |
| Design (動) | モーショントークン | [[../20-Design/Motion-System]] |
| Coding | 設定値の集約 (Single Source of Truth) | [[../10-Coding/Caching-Strategies]] |

「**値を名前で抽象化**して、変更を 1 箇所に集める**」。

### 命名 (Naming)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 変数・関数・型 | [[../10-Coding/Naming]] |
| Design | コンポーネント名・トークン名 | [[../20-Design/Design-Systems]] |
| Interface | ナビゲーションラベル・IA | [[../30-Interface/Information-Architecture]] |
| Bridge | ユビキタス言語 | [[../40-Bridge/Naming-as-Design]] |

「**意図 > 実装**」を表す名前を選ぶ。

## 🔄 状態と変化のパターン

### State Machine

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 業務ロジックの状態遷移 | [[../10-Coding/State-Management]] |
| Coding | 型による不可能状態の排除 | [[../10-Coding/Type-Systems-and-DDD]] |
| Interface | UI の 5 状態 (Empty/Loading/Partial/Error/Ideal) | [[../30-Interface/Loading-States]] |
| Interface | フォームのバリデーション遷移 | [[../30-Interface/Forms-and-Input]] |

明示的に**状態と遷移**を書く。組み合わせ爆発を防ぐ。

### 不変性 (Immutability)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 関数型プログラミング | [[../10-Coding/Functional-Programming]] |
| Coding | React の State 更新 | [[../10-Coding/State-Management]] |
| Coding | 値オブジェクト | [[../10-Coding/Type-Systems-and-DDD]] |
| Coding | Event Sourcing | [[../10-Coding/Architecture-Layers]] |

「**書き換えるのでなく、新しい値を作る**」。

### バージョニング

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | Git コミット | [[../10-Coding/Version-Control]] |
| Coding | API バージョン | [[../10-Coding/API-Design]] |
| Coding | DB マイグレーション | [[../40-Bridge/Migrations-as-Product]] |
| Design | デザインシステムのバージョン | [[../20-Design/Design-Systems]] |

「**履歴を残し、変更を可逆に**」。

## 📡 境界と契約のパターン

### 抽象 / 詳細の分離

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 依存性逆転 (DIP) | [[../10-Coding/SOLID-Principles]] |
| Coding | Clean Architecture | [[../10-Coding/Architecture-Layers]] |
| Coding | Functional Core / Imperative Shell | [[../10-Coding/Functional-Programming]] |
| Design | Reference / Semantic / Component Token | [[../20-Design/Design-Tokens]] |
| Bridge | デザインとコードの正本分離 | [[../40-Bridge/Design-Code-Handoff]] |

「**変わるものを外に、変わらないものを中に**」。

### 入力検証 (Boundary Validation)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | API での Zod / OpenAPI | [[../10-Coding/API-Design]] |
| Coding | DB の制約 (NOT NULL, CHECK) | [[../10-Coding/Database-Design]] |
| Coding | 例外を結果型に変換するアダプタ | [[../10-Coding/Error-Handling]] |
| Interface | フォームのバリデーション | [[../30-Interface/Forms-and-Input]] |
| Interface | UX ライティングのガイダンス | [[../30-Interface/UX-Writing]] |

「**境界で検証し、内部は信頼**」。

### 認可 (Authorization)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | サーバ側で**必ず**再検証 | [[../10-Coding/Security]] |
| Interface | 権限がない操作は事前無効化 | [[../30-Interface/Permissions-UX]] |
| Interface | 共有設定の透明性 | [[../30-Interface/Permissions-UX]] |
| Interface | 設定 UI の権限別表示 | [[../30-Interface/Settings-Preferences]] |

「**フロントだけの認可は信用しない**」。

## ⏳ フィードバックと時間のパターン

### 即時フィードバック (Latency Threshold)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | ボタン押下 < 100ms | [[../30-Interface/Microinteractions]] |
| Interface | 5 状態の表示分け | [[../30-Interface/Loading-States]] |
| Coding | INP < 200ms | [[../10-Coding/Performance]] |
| Bridge | パフォーマンス = UX | [[../40-Bridge/Performance-as-UX]] |

「**0.1 秒で世界を返す**」。

### Optimistic UI

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | UI 先行更新 + 失敗時ロールバック | [[../30-Interface/Interaction-Patterns]] |
| Coding | クライアント先行 + サーバ検証 | [[../10-Coding/State-Management]] |
| Coding | 楽観的ロック | [[../10-Coding/Database-Design]] |

「**信じて動く、間違えたら戻す**」。

### Stale-While-Revalidate

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | HTTP / CDN | [[../10-Coding/Caching-Strategies]] |
| Coding | TanStack Query / SWR | [[../10-Coding/State-Management]] |
| Interface | キャッシュ表示 + 裏で更新 | [[../30-Interface/Loading-States]] |

「**古い値を即返し、裏で新鮮化**」。

## 🛡 安全と回復のパターン

### Fail Fast / Fail Safe

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 不変条件違反は即停止 | [[../10-Coding/Error-Handling]] |
| Coding | サーキットブレーカ | [[../10-Coding/Error-Handling]] |
| Interface | 危険操作の確認 + Undo | [[../30-Interface/Interaction-Patterns]] |
| Interface | バリデーション早期 | [[../30-Interface/Forms-and-Input]] |

「**壊れた状態で先に進まない**」。

### 冪等性 (Idempotency)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 同リクエストの重複処理を防ぐ | [[../10-Coding/API-Design]] |
| Coding | リトライ可能な処理 | [[../10-Coding/Concurrency-Async]] |
| Coding | DB マイグレーションの再実行可能性 | [[../40-Bridge/Migrations-as-Product]] |
| Interface | 二重送信防止 (フォーム) | [[../30-Interface/Forms-and-Input]] |

「**何度実行しても同じ結果**」。

### Undo / Reversibility

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | 削除に Undo Toast | [[../30-Interface/Interaction-Patterns]] |
| Interface | 直接操作の Undo/Redo | [[../30-Interface/Drawing-Direct-Manipulation]] |
| Coding | Git コミット (戻せる) | [[../10-Coding/Version-Control]] |
| Coding | Soft Delete + ゴミ箱 | [[../10-Coding/Database-Design]] |
| Coding | 補償トランザクション (Saga) | [[../10-Coding/Edge-and-Distributed]] |

「**ユーザーは間違える**」前提。

### 段階的開示 (Progressive Disclosure)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | 詳細は折りたたみ | [[../30-Interface/UX-Principles]] |
| Interface | Just-in-Time オンボーディング | [[../30-Interface/Onboarding-Empty-States]] |
| Coding | 最小情報で API レスポンス | [[../10-Coding/API-Design]] |
| Bridge | ドキュメントの 4 タイプ | [[../40-Bridge/Documentation-as-Product]] |

「**見せたい情報を段階的に**」。

## 🌍 共有と協働のパターン

### Single Source of Truth

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 派生でなく計算で得る | [[../10-Coding/State-Management]] |
| Coding | DB スキーマが正本 | [[../10-Coding/Database-Design]] |
| Design | デザイントークンの正本 | [[../20-Design/Design-Tokens]] |
| Bridge | Figma vs コードの正本決定 | [[../40-Bridge/Design-Code-Handoff]] |
| Bridge | ADR / 用語集 | [[../40-Bridge/Knowledge-Management]] |

「**情報を 1 箇所に**、それ以外は参照**」。

### CRDT / 結果整合性

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 分散システムの一貫性 | [[../10-Coding/Edge-and-Distributed]] |
| Interface | 多人数同時編集 | [[../30-Interface/Real-time-Collaboration]] |

「**最終的に同じ結果**になればよい」。

### Pub/Sub (出版-購読)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | イベント駆動アーキテクチャ | [[../10-Coding/Architecture-Layers]] |
| Coding | DB 変更通知 (Realtime) | [[../10-Coding/Edge-and-Distributed]] |
| Coding | Domain Event | [[../10-Coding/Type-Systems-and-DDD]] |
| Interface | ライブカーソル / Presence | [[../30-Interface/Real-time-Collaboration]] |
| Interface | Notification チャネル | [[../30-Interface/Notifications]] |

「**送り手と受け手を疎結合に**」。

### Composition over Configuration

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | 関数合成 | [[../10-Coding/Functional-Programming]] |
| Coding | 子コンポーネント (Slot) | [[../40-Bridge/Component-Driven-Development]] |
| Design | レイアウトプリミティブ (Stack/Cluster/Sidebar) | [[../20-Design/Layout-Grid]] |

「**props で全部切り替え** ではなく **組み合わせる**」。

## 📈 成長と進化のパターン

### Strangler Fig (段階的置換)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | レガシーシステムの段階移行 | [[../40-Bridge/Migrations-as-Product]] |
| Design | デザインシステムの導入 | [[../20-Design/Design-Systems]] |
| Bridge | 文書化を徐々に増やす | [[../40-Bridge/Documentation-as-Product]] |

「**全部書き直しはほぼ失敗**」。

### Expand → Migrate → Contract

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | DB スキーマ変更 | [[../10-Coding/Database-Design]] |
| Coding | API バージョニング | [[../10-Coding/API-Design]] |
| Bridge | マイグレーション全般 | [[../40-Bridge/Migrations-as-Product]] |

「**追加 → 移行 → 削除**」の 3 段階。

### Feature Flag

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Coding | デプロイとリリースを分離 | [[../10-Coding/CI-CD]] |
| Bridge | 段階的ロールアウト | [[../40-Bridge/Migrations-as-Product]] |
| Bridge | A/B テスト | [[../40-Bridge/Discovery-and-Validation]] |

「**コードはデプロイ済み、リリースは別判断**」。

## 🎨 表現のパターン

### 整列と破調

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Design | グリッドと逸脱 | [[../20-Design/Editorial-Expressive-Layouts]] |
| Design | デザインシステムと例外 | [[../20-Design/Design-Systems]] |
| Coding | 規約 (Convention) と Escape Hatch | [[../10-Coding/Clean-Code]] |

「**ルールがあるから逸脱が意味を持つ**」。

### 意味のあるアニメーション

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Design | モーショントークン | [[../20-Design/Motion-System]] |
| Interface | マイクロインタラクション | [[../30-Interface/Microinteractions]] |
| Interface | スクロールテリング | [[../30-Interface/Motion-Storytelling]] |
| Interface | スクロール駆動アニメ | [[../30-Interface/Scroll-Driven-Animations]] |

「**装飾ではなく**意味を運ぶ動き」。

### 多層 (Layering)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Design | DOM + Canvas + WebGL | [[../20-Design/Creative-Coding-Canvas-WebGL]] |
| Design | グラスモーフィズム | [[../20-Design/Material-Surfaces]] |
| Design | Z 軸 (空間 UI) | [[../30-Interface/AR-VR-Spatial]] |
| Coding | アーキテクチャ層 | [[../10-Coding/Architecture-Layers]] |

「**複数の層を重ねて**深さを生む」。

## 🤝 倫理と多様性のパターン

### 透明性 (Transparency)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Bridge | 倫理的デザイン | [[../40-Bridge/Ethical-Design]] |
| Bridge | プライバシー (収集と用途の明示) | [[../40-Bridge/Privacy-by-Design]] |
| Interface | 通知許諾の理由 | [[../30-Interface/Notifications]] |
| Interface | AI 出力の出典 | [[../30-Interface/AI-LLM-Interfaces]] |

「**何が起きているか、ユーザーに見える**」。

### Default for Privacy / Safety

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Bridge | デフォルトで非公開 | [[../40-Bridge/Privacy-by-Design]] |
| Interface | 通知デフォルト OFF | [[../30-Interface/Notifications]] |
| Coding | DB の最小権限 (PoLP) | [[../10-Coding/Security]] |

「**ユーザーが何もしなくても**安全な状態」。

### 多様性を入力にする

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Bridge | インクルーシブデザイン | [[../40-Bridge/Inclusive-Design]] |
| Interface | アクセシビリティ | [[../30-Interface/Accessibility]] |
| Bridge | 国際化 | [[../40-Bridge/Internationalization]] |
| Design | 写真の人物表現 | [[../20-Design/Illustration-Photography]] |

「**特定ペルソナだけ**でなく多様な利用者」。

## 🧠 認知とユーザビリティのパターン

### 認識 > 記憶 (Recognition > Recall)

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | 直近検索のサジェスト | [[../30-Interface/Search-UX]] |
| Interface | プレースホルダ + ラベル両方 | [[../30-Interface/Forms-and-Input]] |
| Interface | コマンドパレット (Cmd+K) | [[../30-Interface/Search-UX]] |
| Interface | サムネイル | [[../30-Interface/File-Management-UX]] |

「**思い出させない、選ばせる**」。

### Mental Model 整合

| 領域 | 現れ方 | 詳細 |
|---|---|---|
| Interface | メタファ (フォルダ・ゴミ箱) | [[../30-Interface/Mental-Models]] |
| Interface | プラットフォーム慣習 | [[../30-Interface/Mobile-Patterns]] / [[../30-Interface/Wearables-TV-Embedded]] |
| Bridge | ユビキタス言語 | [[../40-Bridge/Naming-as-Design]] |

「**ユーザーの頭の中**に合わせる」。

## 関連

- [[MOC]]
- [[Cheatsheet]]
- [[Decision-Frameworks]]
- [[Learning-Paths]]
- [[Recipes]]
- [[../GLOSSARY]]
