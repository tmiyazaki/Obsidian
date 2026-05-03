---
tags: [glossary, reference]
aliases: [用語集]
---

# 用語集 (Glossary)

このプロダクトに関わる**コード・デザイン・インターフェース設計**に共通する用語を、**一意の意味**で定義します。混乱が起きたらまずここに戻り、矛盾があれば**ここを正本として更新**します。

→ 命名は領域横断の設計行為: [[40-Bridge/Naming-as-Design]]

## A

- **a11y (Accessibility)**: アクセシビリティ。誰もが使える状態。 → [[30-Interface/Accessibility]]
- **ABAC (Attribute-Based Access Control)**: 属性で動的に権限判定する認可モデル。 → [[30-Interface/Permissions-UX]]
- **ACID**: トランザクションの 4 性質 (Atomic/Consistent/Isolated/Durable)。 → [[10-Coding/Database-Design]]
- **ADR (Architecture Decision Record)**: 重要な設計判断の記録。 → [[40-Bridge/Documentation-as-Product]]
- **Affordance (アフォーダンス)**: 物理的にできること。「ボタンは押せる」など。
- **Aha! Moment**: ユーザーが**初めて**価値を体感する瞬間。オンボーディング設計の中心。 → [[30-Interface/Onboarding-Empty-States]]
- **AI/LLM Interface**: 確率的・遅い・誤るエージェントを信頼可能に翻訳する設計。 → [[30-Interface/AI-LLM-Interfaces]]
- **AR / VR / XR / Spatial**: 拡張現実・仮想現実・空間 UI の総称。 → [[30-Interface/AR-VR-Spatial]]
- **Atomic Design**: UI を Atoms → Molecules → Organisms → Templates → Pages の階層で組む方法論。 → [[20-Design/Design-Systems]]
- **async/await**: 非同期処理を同期的な見た目で書く構文。 → [[10-Coding/Concurrency-Async]]
- **Auto-fit / Auto-fill**: CSS Grid の自動カラム配置キーワード。 → [[20-Design/Layout-Grid]]

## B

- **Backfill**: 既存データを新形式に変換する処理。 → [[40-Bridge/Migrations-as-Product]]
- **Backpressure (バックプレッシャ)**: 生産者が消費者より速いときの抑制機構。 → [[10-Coding/Concurrency-Async]]
- **Blameless Postmortem**: 事故原因を人ではなくシステムに求める振り返り。 → [[40-Bridge/Critique-Culture]]
- **Blue-Green Deployment**: 新環境を完全に立ち上げてから切替える戦略。 → [[10-Coding/CI-CD]]
- **Brand Voice**: ブランドの不変の人格。トーンは状況で変わるが、ボイスは一定。 → [[20-Design/Brand-Voice]]
- **Bridge (Bridge Notes)**: 本 Vault の**領域横断**ノート群。3 領域を貫くテーマ。 → [[40-Bridge/Bridge-Index]]
- **Brutalist Design**: 露骨な構造・粗削りな表現を意図的に使う様式。 → [[20-Design/Editorial-Expressive-Layouts]]

## C

- **Canary Deployment**: 少数トラフィックだけ新バージョンへ流す段階的リリース。 → [[10-Coding/CI-CD]]
- **CDD (Component-Driven Development)**: コンポーネント単位で開発する方法。 → [[40-Bridge/Component-Driven-Development]]
- **CI/CD (Continuous Integration/Delivery)**: 統合 → 提供を自動化するパイプライン。 → [[10-Coding/CI-CD]]
- **CLS (Cumulative Layout Shift)**: レイアウトの飛び。Core Web Vitals の一つ。 → [[40-Bridge/Performance-as-UX]]
- **Concurrency vs Parallelism**: 並行性 (進行中の能力) と並列性 (同時実行の能力) の区別。 → [[10-Coding/Concurrency-Async]]
- **Confirmshaming**: 拒否ボタンに罪悪感を持たせるダークパターン。 → [[40-Bridge/Ethical-Design]]
- **Container Query**: 親要素サイズで切り替わる CSS 機能。 → [[30-Interface/Responsive-Design]]
- **CRDT (Conflict-free Replicated Data Type)**: 任意順で同じ結果になるデータ構造。協働編集の基盤。 → [[30-Interface/Real-time-Collaboration]]
- **Critique Culture**: 批評を作品を育てる協働行為とする文化。 → [[40-Bridge/Critique-Culture]]
- **CTA (Call to Action)**: ユーザーに行動を促す要素。ボタンや誘導文言。
- **Currying**: 引数を 1 つずつ受ける形に変換すること。 → [[10-Coding/Functional-Programming]]
- **Creative Coding**: 表現のためにコードを書く文化。Canvas/WebGL/Shader 等。 → [[20-Design/Creative-Coding-Canvas-WebGL]]

## D

- **DAM (Digital Asset Management)**: ロゴ・テンプレート等を一元管理する仕組み。 → [[20-Design/Brand-Voice]]
- **Dark Pattern (Deceptive Design)**: ユーザーの利益を損なう誘導 UI。 → [[40-Bridge/Ethical-Design]]
- **Dashboard**: 意思決定に必要な信号を集約する画面。 → [[30-Interface/Dashboard-Design]]
- **DDD (Domain-Driven Design)**: ドメインモデルを中核に据える設計手法。
- **Design Token**: 値を名前で抽象化する最小単位。 → [[20-Design/Design-Tokens]]
- **Diátaxis**: ドキュメントを Tutorial / How-to / Reference / Explanation の 4 種に分けるフレーム。 → [[40-Bridge/Documentation-as-Product]]
- **DI (Dependency Injection)**: 依存を外から注入する手法。 → [[10-Coding/SOLID-Principles]]
- **Direct Manipulation**: 対象を直接動かす操作モデル (ドラッグ・描画など)。 → [[30-Interface/Drawing-Direct-Manipulation]]
- **Disagree and Commit**: 反対は最大限主張し、決まったら全力で支援する文化。 → [[40-Bridge/Critique-Culture]]
- **DORA Metrics**: Deploy Frequency / Lead Time / Change Failure Rate / MTTR の 4 指標。 → [[10-Coding/CI-CD]]
- **DRY (Don't Repeat Yourself)**: 知識の重複を避ける原則。
- **Dynamic Viewport (`100dvh`)**: モバイルブラウザのビューポート単位。 → [[30-Interface/Mobile-Patterns]]

## E

- **Easing**: アニメーションの緩急曲線。 → [[20-Design/Motion-System]]
- **Editorial Layout**: 雑誌・ポスター由来の表現的レイアウト。 → [[20-Design/Editorial-Expressive-Layouts]]
- **Empty State**: データがない画面状態。設計対象の 1 つ。 → [[30-Interface/Onboarding-Empty-States]]
- **Event Sourcing**: 状態でなくイベント列を真実とするパターン。 → [[10-Coding/Architecture-Layers]]
- **Expand → Migrate → Contract**: マイグレーションの基本ステップ。 → [[40-Bridge/Migrations-as-Product]]
- **Expressive Range (表現の幅)**: 静的レイアウトを超える表現語彙の総称。本 Vault の専用カテゴリ。 → [[00-Index/MOC]]

## F

- **Facet (ファセット)**: 複数条件で結果を狭める検索 UI。 → [[30-Interface/Search-UX]]
- **Feature Flag**: コードを「デプロイしてからリリース」するための切替機構。 → [[10-Coding/CI-CD]]
- **FIRST (テスト原則)**: Fast / Independent / Repeatable / Self-validating / Timely。 → [[10-Coding/Testing-Strategy]]
- **Fitts's Law**: ターゲットへの到達時間は距離に比例しサイズに反比例。 → [[30-Interface/Mental-Models]]
- **FLIP**: レイアウトアニメの技法 (First/Last/Invert/Play)。 → [[20-Design/Motion-System]]
- **FOUC (Flash of Unstyled Content)**: スタイル未適用の一瞬の表示。 → [[20-Design/Dark-Mode]]
- **FP (Functional Programming)**: 純粋性・不変性・合成を軸とするパラダイム。 → [[10-Coding/Functional-Programming]]
- **FTUE (First Time User Experience)**: 新規ユーザー初体験。 → [[30-Interface/Onboarding-Empty-States]]
- **Functional Core, Imperative Shell**: 純粋ロジックを内側、副作用を外側に。 → [[10-Coding/Functional-Programming]]

## G

- **g11n (Globalization)**: i18n + l10n の総体。 → [[40-Bridge/Internationalization]]
- **Generative Design**: 規則で生成するアセット設計。 → [[20-Design/Generative-Procedural]]
- **Gestalt**: 視覚要素のグルーピング法則 (近接・類似・連続・閉合・共通運命)。 → [[20-Design/Visual-Hierarchy]]
- **Glassmorphism**: 半透明 + 背景ぼかしによる素材表現。 → [[20-Design/Material-Surfaces]]
- **GLSL**: OpenGL Shading Language。WebGL の頂点・フラグメント計算。 → [[20-Design/Creative-Coding-Canvas-WebGL]]
- **glTF / GLB**: Web 標準の 3D アセットフォーマット。 → [[30-Interface/AR-VR-Spatial]]
- **GraphQL**: クライアントが必要なフィールドを指定する API クエリ言語。 → [[10-Coding/API-Design]]
- **Greenwashing**: 環境配慮を装い実態は変えないマーケティング。 → [[40-Bridge/Sustainability]]
- **gRPC**: スキーマ駆動の RPC、型が端末まで貫通。 → [[10-Coding/API-Design]]
- **Gulf of Execution / Evaluation**: ユーザー意図とシステムの間のギャップ (Norman)。 → [[30-Interface/UX-Principles]]

## H

- **Handoff**: デザイン → コードの受け渡し。 → [[40-Bridge/Design-Code-Handoff]]
- **Haptics (触覚)**: 振動による物理フィードバック。 → [[30-Interface/Sensor-Camera-Haptics]]
- **Hick's Law**: 選択肢が増えるほど決定が遅くなる。 → [[30-Interface/Mental-Models]]

## I

- **i18n (Internationalization)**: 多言語対応の準備。 → [[40-Bridge/Internationalization]]
- **IA (Information Architecture)**: 情報構造の設計。 → [[30-Interface/Information-Architecture]]
- **IaC (Infrastructure as Code)**: インフラをコードで宣言。Terraform 等。 → [[10-Coding/CI-CD]]
- **Idempotency (冪等性)**: 何度実行しても同じ結果。 → [[10-Coding/API-Design]]
- **Immutability (不変性)**: 既存値を書き換えず新規作成する性質。 → [[10-Coding/State-Management]] / [[10-Coding/Functional-Programming]]
- **Inclusive Design**: 多様性を設計の入力にするアプローチ。 → [[40-Bridge/Inclusive-Design]]
- **INP (Interaction to Next Paint)**: 入力→反応のレイテンシ。Core Web Vitals。 → [[40-Bridge/Performance-as-UX]]
- **Intersection Observer**: 要素が視野に入ったかを検知する Web API。 → [[30-Interface/Scroll-Driven-Animations]]

## J

- **Jakob's Law**: ユーザーは他サイトと同じ動作を期待する。 → [[30-Interface/Mental-Models]]
- **JTBD (Jobs To Be Done)**: ユーザーの「何かを雇う」動機を中心に置くフレーム。 → [[30-Interface/User-Research]]

## L

- **LCP (Largest Contentful Paint)**: 主要要素表示までの時間。 → [[40-Bridge/Performance-as-UX]]
- **l10n (Localization)**: 特定地域への適合。 → [[40-Bridge/Internationalization]]
- **Liskov Substitution Principle**: SOLID の L。 → [[10-Coding/SOLID-Principles]]
- **LLM (Large Language Model)**: 大規模言語モデル。確率的・遅い・誤る。 → [[30-Interface/AI-LLM-Interfaces]]
- **Local-first**: オフラインでも動き、復活時に同期するソフトウェア哲学。 → [[30-Interface/Real-time-Collaboration]]
- **Lottie**: After Effects から書き出すベクターアニメ JSON 形式。 → [[20-Design/Creative-Coding-Canvas-WebGL]] / [[40-Bridge/Tool-Stacks-Recipes]]

## M

- **Material Surface**: グラス・グラデ・ノイズなど質感を運ぶ表現。 → [[20-Design/Material-Surfaces]]
- **MediaPipe / TensorFlow.js**: ブラウザでの ML (顔・手・姿勢検出)。 → [[30-Interface/Sensor-Camera-Haptics]]
- **Migration**: 段階的に新形式へ移す継続的プロセス。 → [[40-Bridge/Migrations-as-Product]]
- **Microinteraction**: 小さな反応 (ホバー、押下感など)。 → [[30-Interface/Microinteractions]]
- **MOC (Map of Content)**: 知識ネットワークの全体地図。 → [[00-Index/MOC]]
- **Motion Storytelling**: スクロール・遷移を物語装置にする設計。 → [[30-Interface/Motion-Storytelling]]
- **MTTR (Mean Time To Recovery)**: 平均復旧時間。 → [[10-Coding/Observability]] / [[10-Coding/CI-CD]]

## N

- **Naming**: 命名。最も読まれるドキュメント。 → [[10-Coding/Naming]] / [[40-Bridge/Naming-as-Design]]

## O

- **OKLCH**: 知覚均等な色空間。トークン設計で推奨。 → [[20-Design/Color-Theory]]
- **OpenAPI**: REST API のスキーマ標準。Swagger / Redoc で文書化。 → [[10-Coding/API-Design]]
- **OT (Operational Transformation)**: 同時編集の競合解消アルゴリズム (Google Docs)。 → [[30-Interface/Real-time-Collaboration]]
- **Optical Sizing (`opsz`)**: サイズに応じてフォントデザインを最適化する軸。 → [[20-Design/Variable-Type-Expression]]
- **Optimistic UI**: サーバー応答を待たず先に UI を更新する戦略。 → [[30-Interface/Interaction-Patterns]]
- **OWASP**: Web セキュリティの主要脅威集。 → [[10-Coding/Security]]

## P

- **Parallax**: スクロール速度の異なる多層で奥行きを錯覚させる技法。 → [[30-Interface/Scroll-Driven-Animations]]
- **Permissions UX**: 誰が・何を・どの範囲でできるかの設計。 → [[30-Interface/Permissions-UX]]
- **Perlin / Simplex Noise**: 自然な揺らぎを作る擬似乱数。 → [[20-Design/Generative-Procedural]]
- **PII (Personally Identifiable Information)**: 個人を特定できる情報。ログ流出注意。 → [[10-Coding/Security]] / [[10-Coding/Observability]]
- **Pixel Snapping**: 整数 px へのスナップ。アイコン描画で重要。 → [[20-Design/Iconography]]
- **PoLP (Principle of Least Privilege)**: 最小権限の原則。 → [[10-Coding/Security]]
- **Postmortem**: 事故後の振り返り。Blameless で運用。 → [[10-Coding/Observability]] / [[40-Bridge/Critique-Culture]]
- **POUR**: WCAG の 4 原則 (Perceivable/Operable/Understandable/Robust)。 → [[30-Interface/Accessibility]]
- **Presence (プレゼンス)**: 共同編集での「他者がここに居る」表示。 → [[30-Interface/Real-time-Collaboration]]
- **Pre-permission**: OS 許諾ダイアログの前にユーザーの意図を確認する手順。 → [[30-Interface/Notifications]]
- **Pseudo-localization**: 翻訳前に i18n の問題を発見する QA 技法。 → [[40-Bridge/Internationalization]]
- **Pure Function (純粋関数)**: 同じ入力で常に同じ出力を返し、副作用を持たない関数。 → [[10-Coding/Functional-Programming]]
- **Psychological Safety**: ばかげた質問・反対・失敗を安心して出せる状態。 → [[40-Bridge/Critique-Culture]]
- **PWA (Progressive Web App)**: Web をアプリ化する技術群 (Service Worker, Manifest 等)。

## R

- **Race Condition**: 並行実行で順序依存の不整合が起きるバグ。 → [[10-Coding/Concurrency-Async]]
- **RBAC / ABAC / ReBAC**: 認可モデル (役割/属性/関係)。 → [[10-Coding/Security]] / [[30-Interface/Permissions-UX]]
- **RED (Rate/Errors/Duration)**: サービス監視の主要指標。 → [[10-Coding/Observability]]
- **Reduced Motion**: モーションを抑える OS 設定。設計で尊重必須。 → [[30-Interface/Accessibility]]
- **Reference Token / Semantic Token / Component Token**: デザイントークンの 3 階層。 → [[20-Design/Design-Tokens]]
- **REST**: HTTP メソッドとリソース指向の API スタイル。 → [[10-Coding/API-Design]]
- **RFC (Request for Comments)**: 大きな決定の事前文書レビュー。 → [[40-Bridge/Critique-Culture]]
- **R3F (React Three Fiber)**: React で Three.js を宣言的に書くライブラリ。 → [[20-Design/Creative-Coding-Canvas-WebGL]]
- **Rolling Update**: 少しずつインスタンスを置き換えるデプロイ戦略。 → [[10-Coding/CI-CD]]
- **RTL (Right-to-Left)**: 右→左の言語 (アラビア語等)。 → [[40-Bridge/Internationalization]]
- **RUM (Real User Monitoring)**: 実ユーザーのパフォーマンス計測。 → [[10-Coding/Observability]]
- **Rule of Three**: 3 度繰り返してから抽象化する経験則。 → [[10-Coding/Clean-Code]]

## S

- **Scrollytelling**: スクロールを物語装置にする手法。 → [[30-Interface/Motion-Storytelling]]
- **Scroll-Driven Animation (CSS)**: JS なしでスクロール量に連動する CSS 機能。 → [[30-Interface/Scroll-Driven-Animations]]
- **Shader (GLSL)**: GPU 上のピクセル/頂点計算プログラム。 → [[20-Design/Creative-Coding-Canvas-WebGL]]
- **SLI / SLO / SLA**: サービスレベル指標 / 目標 / 契約。 → [[10-Coding/Observability]]
- **Skeleton Screen**: 灰色プレースホルダで読み込み中を示す。 → [[30-Interface/Loading-States]]
- **Soft Delete**: 物理削除でなく `deleted_at` で論理削除。罠あり。 → [[10-Coding/Database-Design]]
- **Sonic Branding**: ブランドが音で記憶される設計。 → [[30-Interface/Audio-Voice-UX]]
- **SRP (Single Responsibility Principle)**: SOLID の S。 → [[10-Coding/SOLID-Principles]]
- **State Machine (Statechart)**: 状態遷移の明示的なモデル。 → [[10-Coding/State-Management]]
- **STRIDE**: 脅威モデリングの 6 分類。 → [[10-Coding/Security]]
- **Stale-While-Revalidate**: キャッシュ戦略の一種。古い値を即返し裏で更新。
- **Strangler Fig**: レガシーを段階的に置換するパターン。 → [[40-Bridge/Migrations-as-Product]]
- **Sustainability (Green Software)**: エネルギー効率を品質指標に組み込むこと。 → [[40-Bridge/Sustainability]]

## T

- **TDD (Test-Driven Development)**: Red→Green→Refactor のサイクル。 → [[10-Coding/Testing-Strategy]]
- **Tech Debt**: 学んだことを反映していない状態。利息を生む。 → [[40-Bridge/Tech-Debt]]
- **Three.js**: WebGL の高水準ライブラリ。3D の事実上標準。 → [[20-Design/Creative-Coding-Canvas-WebGL]]
- **Thumb Zone**: 親指の届く範囲。モバイル設計の基礎。 → [[30-Interface/Mobile-Patterns]]
- **Tone.js**: Web Audio の高水準ライブラリ (シンセ・音楽)。 → [[30-Interface/Audio-Voice-UX]]
- **Tool Stacks**: 複数ツールの組み合わせレシピ。 → [[40-Bridge/Tool-Stacks-Recipes]]
- **Toast / Snackbar**: 短期通知 UI。 → [[30-Interface/Interaction-Patterns]] / [[30-Interface/Notifications]]
- **Trace ID**: リクエストを横断的に追跡する識別子。 → [[10-Coding/Observability]]
- **Trunk-Based Development**: 短命ブランチで main 近傍を維持する開発。 → [[10-Coding/Version-Control]] / [[10-Coding/CI-CD]]
- **Type Scale**: 文字サイズの離散的な階段。 → [[20-Design/Typography]]

## U

- **Ubiquitous Language (ユビキタス言語)**: ドメイン全員で同じ語彙を使う。 → [[40-Bridge/Naming-as-Design]]
- **USE (Utilization/Saturation/Errors)**: リソース監視指標。 → [[10-Coding/Observability]]
- **UX Writing**: UI 上の言葉の設計。 → [[30-Interface/UX-Writing]]

## V

- **Variable Font**: ウェイトを連続調整できるフォント形式。 → [[20-Design/Typography]] / [[20-Design/Variable-Type-Expression]]
- **View Transitions API**: ブラウザネイティブのページ遷移アニメ。 → [[20-Design/Motion-System]]
- **Virtual Scroll (仮想スクロール)**: 表示領域分だけ DOM を生成する技法。 → [[30-Interface/Tables-Data-Grids]]
- **Visual Hierarchy**: 視覚階層。何を最初に見せるか。 → [[20-Design/Visual-Hierarchy]]

## W

- **WCAG (Web Content Accessibility Guidelines)**: アクセシビリティ標準。 → [[30-Interface/Accessibility]]
- **Web Audio API**: ブラウザでの音声処理 API。 → [[30-Interface/Audio-Voice-UX]]
- **Web Bluetooth / USB / Serial / HID**: ブラウザから物理デバイスへ接続する API 群。 → [[30-Interface/Sensor-Camera-Haptics]]
- **WebGL / WebGPU**: ブラウザで GPU を使う標準。3D・シェーダ。 → [[20-Design/Creative-Coding-Canvas-WebGL]]
- **WebRTC**: P2P の超低レイテンシ通信。ビデオ通話・コラボ。 → [[30-Interface/Real-time-Collaboration]]
- **WebSocket**: 双方向通信。リアルタイム協働の基盤。 → [[30-Interface/Real-time-Collaboration]]
- **WebXR**: ブラウザから AR/VR を使う API。 → [[30-Interface/AR-VR-Spatial]]
- **WET (Write Everything Twice)**: DRY の対極。早すぎる抽象化の代替。

## Y

- **YAGNI (You Aren't Gonna Need It)**: 「いつか使うかも」な抽象化を避ける原則。

## Z

- **Zeigarnik Effect (ザイガルニク効果)**: 未完了タスクほど記憶に残る心理。 → [[30-Interface/Mental-Models]]

---

## 用語追加・更新の指針

1. 新しい用語が**コード/デザイン/UI 設計**いずれかで使われ始めたら、ここに追加
2. 矛盾を見つけたら**ここを修正してから**、各ノートを更新
3. 同義語が複数ある場合、**正式名 + alias** の形で残す
4. 用語の意味が変わったら、**履歴**(`---` で区切って) を残す

## 関連

- [[40-Bridge/Naming-as-Design]]
- [[00-Index/MOC]]
- [[10-Coding/Naming]]
- [[30-Interface/Information-Architecture]]
