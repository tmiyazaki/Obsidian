---
tags: [glossary, reference]
aliases: [用語集]
---

# 用語集 (Glossary)

このプロダクトに関わる**コード・デザイン・インターフェース設計**に共通する用語を、**一意の意味**で定義します。混乱が起きたらまずここに戻り、矛盾があれば**ここを正本として更新**します。

→ 命名は領域横断の設計行為: [[40-Bridge/Naming-as-Design]]

## A

- **a11y (Accessibility)**: アクセシビリティ。誰もが使える状態。 → [[30-Interface/Accessibility]]
- **ADR (Architecture Decision Record)**: 重要な設計判断の記録。 → [[40-Bridge/Documentation-as-Product]]
- **Affordance (アフォーダンス)**: 物理的にできること。「ボタンは押せる」など。
- **Aha! Moment**: ユーザーが**初めて**価値を体感する瞬間。オンボーディング設計の中心。 → [[30-Interface/Onboarding-Empty-States]]
- **Atomic Design**: UI を Atoms → Molecules → Organisms → Templates → Pages の階層で組む方法論。 → [[20-Design/Design-Systems]]

## B

- **Bridge (Bridge Notes)**: 本 Vault の**領域横断**ノート群。3 領域を貫くテーマ。 → [[40-Bridge/Bridge-Index]]

## C

- **CDD (Component-Driven Development)**: コンポーネント単位で開発する方法。 → [[40-Bridge/Component-Driven-Development]]
- **CLS (Cumulative Layout Shift)**: レイアウトの飛び。Core Web Vitals の一つ。 → [[40-Bridge/Performance-as-UX]]
- **CTA (Call to Action)**: ユーザーに行動を促す要素。ボタンや誘導文言。
- **Confirmshaming**: 拒否ボタンに罪悪感を持たせるダークパターン。 → [[40-Bridge/Ethical-Design]]
- **Container Query**: 親要素サイズで切り替わる CSS 機能。 → [[30-Interface/Responsive-Design]]

## D

- **Dark Pattern (Deceptive Design)**: ユーザーの利益を損なう誘導 UI。 → [[40-Bridge/Ethical-Design]]
- **Design Token**: 値を名前で抽象化する最小単位。 → [[20-Design/Design-Tokens]]
- **Diátaxis**: ドキュメントを Tutorial / How-to / Reference / Explanation の 4 種に分けるフレーム。 → [[40-Bridge/Documentation-as-Product]]
- **DDD (Domain-Driven Design)**: ドメインモデルを中核に据える設計手法。
- **DI (Dependency Injection)**: 依存を外から注入する手法。 → [[10-Coding/SOLID-Principles]]
- **DRY (Don't Repeat Yourself)**: 知識の重複を避ける原則。
- **Dynamic Viewport (`100dvh`)**: モバイルブラウザのビューポート単位。 → [[30-Interface/Mobile-Patterns]]

## E

- **Empty State**: データがない画面状態。設計対象の 1 つ。 → [[30-Interface/Onboarding-Empty-States]]
- **Easing**: アニメーションの緩急曲線。 → [[20-Design/Motion-System]]

## F

- **Fitts's Law**: ターゲットへの到達時間は距離に比例しサイズに反比例。 → [[30-Interface/Mental-Models]]
- **FLIP**: レイアウトアニメの技法 (First/Last/Invert/Play)。 → [[20-Design/Motion-System]]
- **FOUC (Flash of Unstyled Content)**: スタイル未適用の一瞬の表示。 → [[20-Design/Dark-Mode]]
- **FTUE (First Time User Experience)**: 新規ユーザー初体験。 → [[30-Interface/Onboarding-Empty-States]]

## G

- **g11n (Globalization)**: i18n + l10n の総体。 → [[40-Bridge/Internationalization]]
- **Gestalt**: 視覚要素のグルーピング法則 (近接・類似・連続・閉合・共通運命)。 → [[20-Design/Visual-Hierarchy]]
- **Gulf of Execution / Evaluation**: ユーザー意図とシステムの間のギャップ (Norman)。 → [[30-Interface/UX-Principles]]

## H

- **Handoff**: デザイン → コードの受け渡し。 → [[40-Bridge/Design-Code-Handoff]]
- **Hick's Law**: 選択肢が増えるほど決定が遅くなる。 → [[30-Interface/Mental-Models]]

## I

- **i18n (Internationalization)**: 多言語対応の準備。 → [[40-Bridge/Internationalization]]
- **IA (Information Architecture)**: 情報構造の設計。 → [[30-Interface/Information-Architecture]]
- **Idempotency (冪等性)**: 何度実行しても同じ結果。 → [[10-Coding/API-Design]]
- **Immutability (不変性)**: 既存値を書き換えず新規作成する性質。 → [[10-Coding/State-Management]]
- **INP (Interaction to Next Paint)**: 入力→反応のレイテンシ。Core Web Vitals。 → [[40-Bridge/Performance-as-UX]]

## J

- **Jakob's Law**: ユーザーは他サイトと同じ動作を期待する。 → [[30-Interface/Mental-Models]]
- **JTBD (Jobs To Be Done)**: ユーザーの「何かを雇う」動機を中心に置くフレーム。 → [[30-Interface/User-Research]]

## L

- **LCP (Largest Contentful Paint)**: 主要要素表示までの時間。 → [[40-Bridge/Performance-as-UX]]
- **l10n (Localization)**: 特定地域への適合。 → [[40-Bridge/Internationalization]]
- **Liskov Substitution Principle**: SOLID の L。 → [[10-Coding/SOLID-Principles]]

## M

- **MOC (Map of Content)**: 知識ネットワークの全体地図。 → [[00-Index/MOC]]
- **MTTR (Mean Time To Recovery)**: 平均復旧時間。 → [[10-Coding/Observability]]
- **Microinteraction**: 小さな反応 (ホバー、押下感など)。 → [[30-Interface/Microinteractions]]

## N

- **Naming**: 命名。最も読まれるドキュメント。 → [[10-Coding/Naming]] / [[40-Bridge/Naming-as-Design]]

## O

- **Optimistic UI**: サーバー応答を待たず先に UI を更新する戦略。 → [[30-Interface/Interaction-Patterns]]
- **OWASP**: Web セキュリティの主要脅威集。 → [[10-Coding/Security]]

## P

- **PII (Personally Identifiable Information)**: 個人を特定できる情報。ログ流出注意。 → [[10-Coding/Security]] / [[10-Coding/Observability]]
- **Pixel Snapping**: 整数 px へのスナップ。アイコン描画で重要。 → [[20-Design/Iconography]]
- **POUR**: WCAG の 4 原則 (Perceivable/Operable/Understandable/Robust)。 → [[30-Interface/Accessibility]]
- **PoLP (Principle of Least Privilege)**: 最小権限の原則。 → [[10-Coding/Security]]
- **Pseudo-localization**: 翻訳前に i18n の問題を発見する QA 技法。 → [[40-Bridge/Internationalization]]

## R

- **RBAC / ABAC / ReBAC**: 認可モデル (役割/属性/関係)。 → [[10-Coding/Security]]
- **RED (Rate/Errors/Duration)**: サービス監視の主要指標。 → [[10-Coding/Observability]]
- **Reduced Motion**: モーションを抑える OS 設定。設計で尊重必須。 → [[30-Interface/Accessibility]]
- **Reference Token / Semantic Token / Component Token**: デザイントークンの 3 階層。 → [[20-Design/Design-Tokens]]
- **RTL (Right-to-Left)**: 右→左の言語 (アラビア語等)。 → [[40-Bridge/Internationalization]]
- **RUM (Real User Monitoring)**: 実ユーザーのパフォーマンス計測。 → [[10-Coding/Observability]]
- **Rule of Three**: 3 度繰り返してから抽象化する経験則。 → [[10-Coding/Clean-Code]]

## S

- **SLI / SLO / SLA**: サービスレベル指標 / 目標 / 契約。 → [[10-Coding/Observability]]
- **SRP (Single Responsibility Principle)**: SOLID の S。 → [[10-Coding/SOLID-Principles]]
- **Skeleton Screen**: 灰色プレースホルダで読み込み中を示す。 → [[30-Interface/Loading-States]]
- **State Machine (Statechart)**: 状態遷移の明示的なモデル。 → [[10-Coding/State-Management]]
- **STRIDE**: 脅威モデリングの 6 分類。 → [[10-Coding/Security]]
- **Stale-While-Revalidate**: キャッシュ戦略の一種。古い値を即返し裏で更新。

## T

- **Thumb Zone**: 親指の届く範囲。モバイル設計の基礎。 → [[30-Interface/Mobile-Patterns]]
- **Toast / Snackbar**: 短期通知 UI。 → [[30-Interface/Interaction-Patterns]]
- **Trace ID**: リクエストを横断的に追跡する識別子。 → [[10-Coding/Observability]]
- **Type Scale**: 文字サイズの離散的な階段。 → [[20-Design/Typography]]
- **TDD (Test-Driven Development)**: Red→Green→Refactor のサイクル。 → [[10-Coding/Testing-Strategy]]

## U

- **Ubiquitous Language (ユビキタス言語)**: ドメイン全員で同じ語彙を使う。 → [[40-Bridge/Naming-as-Design]]
- **USE (Utilization/Saturation/Errors)**: リソース監視指標。 → [[10-Coding/Observability]]
- **UX Writing**: UI 上の言葉の設計。 → [[30-Interface/UX-Writing]]

## V

- **Variable Font**: ウェイトを連続調整できるフォント形式。 → [[20-Design/Typography]]
- **View Transitions API**: ブラウザネイティブのページ遷移アニメ。 → [[20-Design/Motion-System]]
- **Visual Hierarchy**: 視覚階層。何を最初に見せるか。 → [[20-Design/Visual-Hierarchy]]

## W

- **WCAG (Web Content Accessibility Guidelines)**: アクセシビリティ標準。 → [[30-Interface/Accessibility]]
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
