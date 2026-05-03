---
tags: [skill, bridge, stack, tools, recipes]
domain: cross-cutting
level: intermediate
---

# ツールスタックの組み合わせレシピ集

## 一行で

> 単一ツールの限界を超え「**互いに補完するツール群**」で表現の幅を作る。**1 つで何でもやるな、得意なものを束ねろ**。

## なぜ重要か

「Tailwind だけ」「Three.js だけ」では限界があります。現代の表現は**複数ツールの合成**で成立しています:
- Figma + Tokens Studio + Style Dictionary + Storybook で**設計→実装**
- React + Framer Motion + GSAP + Lottie で**多層アニメ**
- D3 + visx + canvas-confetti で**演出付きデータ**

このノートは「**目的別の標準スタック**」を集めたレシピ集です。新規プロジェクトで何を選ぶかの**初動を速くする**。

## 選定原則

### 1. 互換性

ツール同士が**ぶつからない**。 styled-components と CSS Modules の混在は混乱の元。

### 2. 学習曲線

チームが扱える複雑度。**最も詳しくない人**が運用できるか。

### 3. 移行コスト

ロックイン度合い。Astro → Next.js は容易だが、独自フレームワーク → 標準は大手術。

### 4. メンテナンス活発度

GitHub のリリース頻度、Issue 対応、コミュニティの大きさ。

### 5. プロダクト寿命

3 年使うなら**安定したもの**を、半年なら**流行り物でも可**。

## レシピ集

### 🎨 デザインシステム実装

**目的**: Figma → コードまで一貫したシステム

```
Figma + Variables (デザイン正本)
    ↓
Tokens Studio (Figma プラグイン、トークン管理)
    ↓ JSON エクスポート
Style Dictionary (各形式に変換)
    ↓
CSS Custom Properties / Tailwind config / iOS Swift / Android XML
    ↓
React コンポーネント (Radix Primitives + cva + Tailwind)
    ↓
Storybook (ドキュメント + ビジュアルテスト)
    ↓
Chromatic (ビジュアルレグレッション)
```

→ [[../20-Design/Design-Tokens]] / [[Component-Driven-Development]] / [[Design-Code-Handoff]]

### ⚛ React モダン UI スタック (2026)

**目的**: 産業強度のフロント

```
Next.js (App Router) ─ ルーティング、SSR、API
TypeScript ─ 型安全
Tailwind CSS v4 ─ スタイル
Radix UI Primitives ─ アクセシブル原始コンポーネント
shadcn/ui ─ Radix + Tailwind の現代的レシピ
cva (class-variance-authority) ─ Variant 管理
TanStack Query ─ サーバ状態
Zustand ─ クライアント状態 (軽量)
React Hook Form + Zod ─ フォーム + 検証
Framer Motion ─ アニメ
Lucide ─ アイコン
```

代替: 
- Remix / TanStack Start (Next の代替)
- Vue + Nuxt スタック
- SvelteKit
- Astro (コンテンツ中心)

→ [[../10-Coding/State-Management]] / [[Component-Driven-Development]]

### 🌀 リッチアニメーションスタック

**目的**: 多層的・物理的・滑らかな動き

```
Framer Motion ─ React コンポーネントの宣言的アニメ、layout モーフ
GSAP + ScrollTrigger ─ タイムライン、scrub、複雑シーケンス
Lottie ─ デザイナー作 After Effects アニメ
Lenis ─ 滑らかスクロール (任意、a11y 配慮)
View Transitions API ─ ページ遷移
CSS Scroll-Driven Animations ─ 軽量 reveal
```

役割分担:
- React 状態連動 → **Framer Motion**
- スクロール演出 → **GSAP** または **CSS Scroll-Driven**
- ベクター演出 → **Lottie**

→ [[../20-Design/Motion-System]] / [[../30-Interface/Motion-Storytelling]]

### 🎮 3D / WebGL UI

**目的**: 没入型・3D・シェーダ表現

```
React Three Fiber (R3F) ─ React で Three.js
@react-three/drei ─ ヘルパー集 (OrbitControls, Loader)
@react-three/postprocessing ─ ブルーム・被写界深度
Leva ─ パラメタ調整 GUI
Theatre.js ─ タイムライン編集
GLTF + Draco + KTX2 ─ アセット最適化
```

→ [[../20-Design/Creative-Coding-Canvas-WebGL]] / [[../30-Interface/AR-VR-Spatial]]

### 📊 データビジュアライゼーション

**目的**: インタラクティブな図表

#### 標準ダッシュボード

```
Recharts ─ React 向け、基本グラフ
TanStack Table ─ テーブル
react-day-picker / react-aria ─ 日付・コントロール
```

#### ジャーナリズム / カスタム

```
D3.js ─ 計算・スケール
visx (Airbnb) ─ React + D3 の中間
Observable Plot ─ 宣言的グラフ
Vega-Lite ─ 仕様駆動
deck.gl ─ 大量データ・地図
Mapbox / MapLibre ─ 地図
```

→ [[../20-Design/Data-Visualization]] / [[../30-Interface/Dashboard-Design]]

### 📝 リッチテキスト・エディタ

**目的**: Notion/Medium 級のドキュメント編集

```
Tiptap ─ ProseMirror ベース、最も人気
Lexical (Meta) ─ 高速、Facebook 採用
Slate ─ 柔軟性高い、自分で組む
ProseMirror ─ 最低層、最大自由度
Yjs / Automerge ─ 共同編集 (CRDT)
```

組合せ:
- 単純: **Tiptap + Yjs**
- パフォーマンス重視: **Lexical**
- 完全カスタム: **ProseMirror or Slate**

→ [[../30-Interface/Real-time-Collaboration]] / [[../30-Interface/Drawing-Direct-Manipulation]]

### 🎨 ホワイトボード / 描画

**目的**: Excalidraw, FigJam, tldraw 級

```
tldraw SDK ─ 完成品ベース、最速
React Flow ─ ノードベース UI
Konva.js ─ Canvas 描画
Fabric.js ─ Canvas 編集
PaperJS ─ ベクター
PixiJS ─ 高速 2D
```

ライブラリ選択は「**機能完成度 vs 自由度**」のトレードオフ。

### 🎵 音声・音楽

**目的**: 音響リッチな体験

```
Tone.js ─ シンセサイザ・音楽
Howler.js ─ 効果音・BGM
WaveSurfer.js ─ 波形編集 UI
ml5.js ─ 音声 ML (TensorFlow.js)
Web Speech API ─ STT/TTS (簡易)
ElevenLabs / OpenAI Realtime ─ 高品質 TTS / Voice Agent
```

→ [[../30-Interface/Audio-Voice-UX]]

### 🤖 AI / LLM 統合

**目的**: チャット・補完・生成 UI

```
Vercel AI SDK ─ ストリーミング・複数プロバイダ
LangChain.js / LlamaIndex.ts ─ RAG・チェーン
Anthropic SDK / OpenAI SDK ─ 直接
Inngest / Trigger.dev ─ 非同期ジョブ
Zod ─ 構造化出力の型保証
React Markdown + Shiki ─ Markdown + コードハイライト
react-markdown-streaming ─ ストリーミング表示
```

→ [[../30-Interface/AI-LLM-Interfaces]]

### 🔄 リアルタイム / 共同編集

**目的**: Figma / Linear / Notion 級の多人数編集

```
Yjs ─ CRDT 中核
y-websocket / y-webrtc ─ 同期トランスポート
Liveblocks ─ マネージドサービス (Presence + CRDT)
PartyKit ─ エッジ WebSocket
Supabase Realtime ─ Postgres 変更を購読
Automerge ─ 別系統 CRDT
```

→ [[../30-Interface/Real-time-Collaboration]]

### 🛠 ビルド・デプロイ

**目的**: 高速 CI と即時デプロイ

```
Vite / Turbopack ─ ローカル開発高速化
pnpm + workspaces / Turborepo ─ monorepo
Biome / ESLint + Prettier ─ Lint + 整形
Vitest / Playwright ─ テスト
Vercel / Netlify / Cloudflare Pages ─ ホスティング
GitHub Actions / Vercel CI ─ パイプライン
Renovate / Dependabot ─ 依存更新
```

→ [[../10-Coding/CI-CD]]

### 📡 オブザーバビリティ

**目的**: 本番の見える化

```
Sentry / Bugsnag ─ エラートラッキング
Datadog / New Relic ─ APM, ログ, メトリクス
Grafana + Loki + Tempo + Prometheus ─ OSS スタック
OpenTelemetry ─ 標準計装
PostHog / Mixpanel ─ プロダクト分析
LogRocket / FullStory ─ セッションリプレイ
Vercel Analytics / SpeedCurve ─ Web Vitals
```

→ [[../10-Coding/Observability]] / [[Performance-as-UX]]

### 🔐 認証・認可

```
Clerk / WorkOS / Auth.js ─ マネージド
Supabase Auth / Firebase Auth ─ BaaS 統合
Lucia / better-auth ─ 軽量自前
Casbin / Cerbos / Oso ─ 認可エンジン
```

→ [[../10-Coding/Security]] / [[../30-Interface/Permissions-UX]]

### 💾 データ永続化

```
PostgreSQL ─ デフォルト第一選択
Prisma / Drizzle ─ TypeScript ORM
Supabase / Neon / PlanetScale ─ マネージド Postgres/MySQL
Redis / Upstash ─ キャッシュ・セッション
Pinecone / pgvector ─ ベクトル
S3 / R2 ─ オブジェクトストレージ
```

→ [[../10-Coding/Database-Design]]

### 🎁 デザインシステムの「すぐ動く」スタック (中小規模)

```
Next.js + TypeScript
Tailwind CSS
shadcn/ui (Radix + Tailwind の現代的レシピ)
Lucide icons
Sonner (Toast)
react-hook-form + zod (フォーム)
Framer Motion (アニメ)
```

数日でプロダクト級の UI が立ち上がる。MVP に最適。

### 🌍 国際化

```
next-intl / react-intl / i18next ─ メッセージ管理
ICU MessageFormat ─ 複数形・性別
Crowdin / Phrase / Lokalise ─ 翻訳プラットフォーム
Intl API ─ 日付・通貨・数値
```

→ [[Internationalization]]

### ♿ アクセシビリティ

```
Radix UI / React Aria / Headless UI ─ アクセシブル原始
axe-core (jest-axe) ─ 自動テスト
Pa11y / Lighthouse CI ─ CI 検査
Storybook a11y addon ─ コンポーネント単位
Chrome DevTools Accessibility ─ 開発時
```

→ [[../30-Interface/Accessibility]] / [[Inclusive-Design]]

## ツールを選ぶときの問い

新規導入の前に:

1. **実務で必要か** ─ Hello World の domino を増やしているだけでは?
2. **既存と置き換える価値は** ─ 学習・移行コスト > メリット?
3. **2 年後も生きているか** ─ メンテ活発、スポンサー、企業バックアップ
4. **抜けられるか** ─ ロックイン度、移行可能性
5. **チームが扱えるか** ─ 学習曲線、ドキュメント品質
6. **競合との違い** ─ なぜ A でなく B か、明確に語れるか

## 「全部入り vs 分割」のトレードオフ

| 全部入り (オールインワン) | 分割 (専用ツール組合せ) |
|---|---|
| 例: Salesforce, Notion | Postgres + Stripe + Sentry + ... |
| 学習が 1 つで済む | 各々ベスト |
| 統合が楽 | 統合に手間 |
| ロックイン強 | 抜けやすい |
| 機能制約 | 柔軟 |
| 新規スタートに向く | 成熟プロダクトに向く |

中盤からは「**専用ツールを束ねる**」方向にシフトしがち。

## アンチパターン

- 流行りで採用 → **3 ヶ月でメンテ放棄**
- スタックが**チームに重すぎ**(2 人で K8s 等)
- 似た役割のライブラリが**複数併存**(styled-components + Tailwind + CSS Modules)
- バンドルが**膨張**(同じことを 2 つで)
- 「**全部 React で**」思想で本来 DOM で済むものを多用
- フレームワークの**抜け道なし**な選定(将来の移行を阻害)

## チェックリスト

- [ ] 各ツールに**明確な役割**があるか
- [ ] 役割が**重複**していないか
- [ ] チームが**全員扱える**か
- [ ] **2 年後**も生きていそうか
- [ ] 抜ける手段が**設計されている**か(SSG export, ANSI SQL 等)
- [ ] バンドルサイズへの影響を**測った**か

## 関連

- [[Component-Driven-Development]]
- [[Design-Code-Handoff]]
- [[Documentation-as-Product]]
- [[Tech-Debt]]
- [[../20-Design/Design-Tokens]]
- [[../20-Design/Design-Systems]]
- [[../10-Coding/State-Management]]
- [[../10-Coding/CI-CD]]

## 深掘り

- *State of JS / CSS / HTML* (annual surveys)
- *State of Frontend* by The Software House
- bestofjs.org (人気プロジェクト一覧)
- npm-trends / Stack Overflow Survey
- 自社の技術ブログ (Vercel, Linear, Stripe, GitHub) - 実プロダクトの選定理由が学べる
