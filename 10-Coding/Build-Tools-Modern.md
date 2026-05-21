---
tags: [skill, coding, build, tooling]
domain: coding
level: intermediate
---

# モダンビルドツール

## 一行で

> Webpack 時代から **esbuild / Vite / Turbopack / Bun / Rspack** へ。**100 倍速**は誇張ではなく、開発体験を**桁で**変える。

## なぜ重要か

ビルドの遅さは:
- 開発者の**集中切れ**
- CI 時間の累積
- フィードバックループの劣化
- フラストレーション → 離職要因

「ビルドが速い」は**チームの開発速度**の最大ボトルネックの一つ。2020-2026 で**革命**が起きた。

## 進化の系譜

```
2010-2016: Grunt, Gulp, Browserify
2016-2021: Webpack 全盛
2020-:     Vite (esbuild + Rollup ベース)
2022-:     Turbopack (Rust)
2023-:     Bun (Zig)
2024-:     Rspack, Rolldown (Rust 製 Rollup 互換)
```

Native コードコンパイラ (Rust/Zig/Go) で**桁違いの速度**を実現。

## Vite

開発時 = esbuild (TS 変換) + ESM ネイティブ
本番ビルド = Rollup

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": "/src" } },
});
```

特徴:
- 開発サーバ起動 < 1 秒
- HMR (Hot Module Replacement) が瞬時
- ESM ネイティブ(モジュール変換しない)
- Rollup プラグイン互換

事実上の **Web 開発標準**。

## Turbopack (Vercel)

Webpack の後継 (Rust 製):
- monorepo の incremental build に強い
- Next.js に統合
- フルプロダクション対応進行中

Webpack エコシステムの**スムーズ移行**を狙う。

## Rspack (ByteDance)

Webpack 互換 + Rust 製。
Webpack からの**設定そのまま**移行可能。Lit, RsBuild 等の派生。

## Rolldown

Rollup 互換 + Rust 製。Vite チームが開発。
Vite の Rollup 部分を Rolldown に置換予定 → さらに高速化。

## Bun

JavaScript ランタイム + バンドラ + パッケージマネージャ + テストランナーの**全部入り**:

```sh
bun create react-app
bun install
bun run dev
bun test
```

- Node 互換 (95%)
- npm より 10x 速い install
- Zig 製、起動が**爆速**
- Bundler 内蔵

## esbuild

最古参の**Native compiler ベース**ビルドツール (Go 製):
- 単機能だがバンドルだけなら最速
- Vite の依存

## Webpack の現在

依然**最も広く使われている**(レガシー多)。
- 設定の柔軟性最高
- プラグインエコシステム最大
- 速度で他に負ける

新規プロジェクトでは選ばれにくいが、**移行コスト**で残る。

## 共通の機能

### Tree-shaking

未使用コードを除去:

```ts
import { useState } from "react";  // useState だけバンドル
```

ESM 必須 (CommonJS は副作用判定困難)。

### Code Splitting

```ts
const Module = await import("./HeavyModule");
```

ルート単位、機能単位で分割。初期バンドル削減。

### Dynamic Import

ユーザー操作・スクロール時に**遅延ロード**。

→ [[Performance]] / [[../40-Bridge/Performance-as-UX]]

### Source Maps

デバッグ用に**元のコード**を復元する map。本番では**外部ファイル**(または除外)。

### 静的解析と Type Checking

ビルドツールは**型チェック自体**はしない:
- Vite + `vue-tsc` / `tsc --noEmit`
- 並行実行で速い

### CSS 処理

- PostCSS / Tailwind
- CSS Modules
- Lightning CSS (Rust 製、超高速)

## モノレポ

複数パッケージを 1 リポジトリで管理:

### pnpm workspaces

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

シンボリックリンクで依存共有、ディスク節約。

### Turborepo (Vercel)

タスクランナー、ビルドキャッシュ:

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"] }
  }
}
```

変更ないパッケージは**再ビルドしない**。チームでキャッシュ共有可。

### Nx

エンタープライズ向け、視覚化・スケジューリング強い。

### Bazel / Buck

Google / Meta のような巨大規模向け。学習曲線急。

## Bundle 解析

```sh
npx vite-bundle-visualizer
npx webpack-bundle-analyzer
```

```
total: 800 KB
├─ react: 130 KB
├─ react-dom: 140 KB
├─ moment: 280 KB  ← 大きすぎ、date-fns へ移行検討
├─ lodash: 70 KB   ← lodash-es で tree-shake 可
└─ app: 180 KB
```

定期的に確認 + CI でサイズ予算チェック (size-limit, bundlesize)。

→ [[../40-Bridge/Performance-as-UX]] / [[../40-Bridge/Sustainability]]

## Module Federation

複数アプリで**ランタイム共有**:

```
App A → 利用 → Component (Host で別途デプロイ)
App B → 利用 → 同じ Component
```

マイクロフロントエンドの基盤。Webpack 5 / Rspack 対応。

## Edge / SSR ビルド

エッジ実行向け:
- Cloudflare Workers (V8 isolate)
- Vercel Edge Functions
- Deno Deploy

→ [[Edge-and-Distributed]]

ビルドツールに**ターゲット指定**:

```ts
{ build: { target: "edge" } }
```

Node 標準 API(`fs`, `crypto`)が使えないため、互換 polyfill が必要。

## WebAssembly (WASM)

→ [[WebAssembly-Native-Web]]

ビルド時に Rust/C++/Go → WASM:

```ts
// vite-plugin-wasm
import { add } from "./math.wasm";
console.log(add(1, 2));
```

重い計算をネイティブ速度で。

## DX (開発体験)

→ [[../40-Bridge/Developer-Experience-DX]]

ビルドツール選択は DX の中核:
- 起動時間
- HMR 速度
- エラーメッセージの読みやすさ
- TypeScript 統合
- VS Code との相性

開発者の**幸福度**に直結する。

## CI でのビルド最適化

- **キャッシュ**: node_modules, ビルド結果, Turborepo Cloud
- **並列化**: 独立ジョブを同時
- **増分ビルド**: 変更箇所のみ
- **テストの分散**: shard で並列

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-${{ hashFiles('pnpm-lock.yaml') }}
```

→ [[CI-CD]]

## 環境変数とビルド

```ts
// .env
VITE_API_URL=https://api.example.com

// コード
const apiUrl = import.meta.env.VITE_API_URL;
```

ビルド時にインライン化される(機密情報は注意)。
ランタイム設定は**サーバから取得**。

## アンチパターン

- 全部 Webpack で**5 分ビルド**(他に移行検討)
- 開発と本番の**ビルド設定が乖離**
- Source Maps を**本番に出す**(コード露出)
- Bundle 解析**せず** → 巨大化に気付かない
- Tree-shaking を**信じる**(default export 等で破綻)
- モノレポなしで**コード重複**
- ビルドキャッシュなし

## チェックリスト

- [ ] 開発サーバ起動が **< 5 秒**か
- [ ] HMR が**瞬時** (< 500ms) か
- [ ] バンドルサイズが**予算内**か
- [ ] CI ビルド時間が**許容範囲**か
- [ ] ビルドキャッシュ (Turborepo, GitHub Actions) を使っているか
- [ ] Bundle 解析を**定期実行**しているか
- [ ] 環境変数の**機密性**を理解しているか

## 関連

- [[Performance]]
- [[CI-CD]]
- [[Edge-and-Distributed]]
- [[WebAssembly-Native-Web]]
- [[Modern-Web-Platform]]
- [[../40-Bridge/Developer-Experience-DX]]
- [[../40-Bridge/Performance-as-UX]]
- [[../40-Bridge/Sustainability]]
- [[../40-Bridge/Tool-Stacks-Recipes]]

## 深掘り

- Vite documentation (vitejs.dev)
- Turbopack documentation (Vercel)
- Bun documentation (bun.sh)
- Evan You の Vite 講演
- Lee Robinson の Build Tool 比較
- *State of JS* annual survey
