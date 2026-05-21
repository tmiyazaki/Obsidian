---
tags: [skill, bridge, dx, productivity]
domain: cross-cutting
level: intermediate
---

# 開発者体験 (Developer Experience, DX)

## 一行で

> DX は「**開発者にとっての UX**」。良いツールは Bug ではなく**機能**を、不満ではなく**集中**を生む。社内開発者・外部 SDK ユーザー両方の体験を設計対象に。

## なぜ重要か

DX が悪いと:
- 開発速度低下
- 離職率上昇
- バグ・障害増加
- 採用に響く
- 学習コスト爆発

DX が良いと:
- 短期間で立ち上がる
- 集中できる
- 新人が即戦力化
- ツールを推薦する → 採用効果

DX は**生産性 × 満足度 × 学習速度**の関数。

## 4 つの DX レイヤ

```
1. 個人レベル          ─ IDE、CLI、ローカル環境
2. プロジェクトレベル   ─ コード規約、テスト、ビルド
3. チームレベル        ─ レビュー、デプロイ、ドキュメント
4. プラットフォームレベル ─ 内部開発者プラットフォーム (IDP)
```

→ [[Platform-Engineering]]

## ローカル開発環境

### Time-to-First-Commit

新人が**初コミット**するまでの時間:
- 5 分: 理想
- 1 日: 良
- 1 週間: 改善余地
- 1 ヶ月: 危険信号

```
1. git clone
2. setup script 1 つ実行
3. dev server 起動
4. 変更してコミット
```

これを**標準化**するのが DX 改善の第一歩。

### Devcontainers / Devbox / Nix

「**全員が同じ環境**」を保証:
- Dev Container (VS Code, GitHub Codespaces)
- Nix / Devbox (宣言的環境)
- Docker Compose

```json
{
  "image": "node:22",
  "features": { "ghcr.io/devcontainers/features/...": {} },
  "postCreateCommand": "pnpm install"
}
```

「動かない」「他の人は動く」 = DX の天敵。**コードで環境を**。

### Hot Reload

→ [[Build-Tools-Modern]]

変更 → 即反映 (HMR < 500ms)。
これがないと**集中切れ**が頻発。

### CLI ツール

```sh
my-app new component Button   # コンポーネント生成
my-app db migrate              # マイグレーション
my-app deploy staging          # デプロイ
```

繰り返し作業を**コマンド化**。Plop, Hygen でテンプレ生成。

### ローカル AI

→ [[AI-Augmented-Development]]

Cursor / Copilot / Claude Code を**チームの標準**に組み込む。

## SDK / API デザインの DX

→ [[../10-Coding/API-Design]]

外部開発者向け SDK:

### 5 Minutes to "Hello World"

新規開発者が**5 分で**動くサンプルに到達できるか。

```
1. npm install
2. API キー取得 (1 クリック)
3. 1 つのコマンドで起動
4. Hello World 表示
```

これより遅いとドロップオフ。Stripe / Vercel / Supabase が範例。

### 型安全

→ [[../10-Coding/Schema-Driven-Stack]]

```ts
const result = await stripe.charges.create({
  amount: 100,
  curency: "usd",   // ❌ typo がコンパイル時に検出
});
```

エラーメッセージで「**何を間違えたか・どう直すか**」を伝える:

```
[ Stripe Error ]
  invalid_request_error: 'curency' is not a valid parameter.
  Did you mean 'currency'?
```

### Idiomatic な API

各言語の慣習に合わせる:
- JS: async/await, Promise
- Python: with statement, generator
- Go: error の戻り値
- Rust: Result<T, E>

「**SDK が言語のように感じる**」設計。

### ドキュメント

→ [[Documentation-as-Product]]

- Diátaxis フレーム (Tutorial / How-to / Reference / Explanation)
- インタラクティブな試行 (Try it now)
- 動くコード例
- OpenAPI / GraphQL Schema 連携

### Playground

ブラウザで**コードを書いて試せる**:
- Stripe Dashboard の試行モード
- Supabase の SQL Editor
- Cloudflare の Workers Playground

## エラーメッセージ

> "An error occurred." はサポートチケット製造機。

良いエラー:
- **何が起きたか**
- **なぜ起きたか**
- **どう直すか**
- 関連ドキュメントへのリンク
- スタックトレース (詳細を展開)

```
[ TypeError ]
  Cannot read property 'name' of undefined

  At: src/user.ts:42
  Context: User object was null, likely because the
           ID was not found.

  Try:
    - Check if the user exists before accessing properties
    - Use optional chaining: user?.name

  Docs: https://docs.example.com/errors/null-reference
```

→ [[../10-Coding/Error-Handling]] / [[../30-Interface/UX-Writing]]

## CI / CD の DX

→ [[../10-Coding/CI-CD]]

- **CI 速度 < 10 分**(待ちが集中切れ)
- 失敗時の**わかりやすい出力**
- 並列化・キャッシュ
- ローカルで**再現可能**

```yaml
- name: テスト失敗の詳細
  uses: actions/test-reporter@v1
  with:
    fail-on-error: false
```

CI ログを**スクロールせずに**問題が見えるよう整形。

## レビュー文化

→ [[Critique-Culture]] / [[../10-Coding/Code-Review]]

- レビュー時間**24h 以内**
- PR サイズ < 400 行
- 重要度ラベル
- AI 補助 (CodeRabbit, Greptile, Bito)

```
[suggestion] 命名を userIds にすると単複明確
[blocking]   認証バイパスがあります
[nit]        末尾空白
[question]   この設計の背景は?
```

## ドキュメント

→ [[Documentation-as-Product]] / [[Knowledge-Management]]

- README で**3 秒**で目的が分かる
- Quick Start で**5 分**で動く
- 検索可能
- 古いドキュメントの**自動検出**
- リンク切れチェック

## オンボーディング

→ [[../30-Interface/Onboarding-Empty-States]]

新入社員 / 新規ユーザー (SDK 利用者) の最初の 1 週間:

1. 環境構築完了
2. 主要リポジトリのコードを読む
3. 小さな PR を出す
4. レビューサイクル経験
5. デプロイ実行
6. オンコール参加 (シャドウ)

これを**チェックリスト化** + メンター指定。

## エラーやログの探しやすさ

→ [[../10-Coding/Observability]]

- 構造化ログ
- trace_id でリクエスト全体追跡
- Sentry / Datadog でリンク
- 「**この機能で問題が出たら**ここを見る」を ADR で

## 自分の進捗を見れる

```
今週のコミット: 12
レビューしたPR: 5
チケット完了: 3
```

GitHub Insights, Linear のダッシュボード。**達成感**を可視化。

ただし**過度な計測**は逆効果:
- LOC を KPI にすると**コード水増し**
- PR 数で評価すると**雑な PR が増える**

→ [[../40-Bridge/Discovery-and-Validation]]

## DX メトリクス (DX 自身の計測)

### DORA Metrics

→ [[../10-Coding/CI-CD]]

- Deploy Frequency
- Lead Time for Changes
- Change Failure Rate
- MTTR

エリートチームは:
- 1 日複数デプロイ
- 1 時間以内リードタイム
- 失敗率 < 15%
- 1 時間以内復旧

### SPACE Framework

Microsoft Research:
- **S**atisfaction (満足度)
- **P**erformance (アウトプット)
- **A**ctivity (コミット数等)
- **C**ommunication (協働)
- **E**fficiency (フロー)

**5 軸で**バランスを見る。

### Developer Surveys

四半期に**満足度アンケート**:
- ツールの満足度
- 詰まりポイント
- 自由記述

「**コードを書く時間**」vs「**ミーティング・調整**」の割合も。

## Frictionless な体験

開発者の摩擦を取り除く:

```
✗ ローカル DB セットアップに 2 時間
✓ docker compose up

✗ シークレットをチームメイトに Slack DM で
✓ 1Password / Doppler 等で自動配布

✗ デプロイのために手順書 10 ページ
✓ git push でデプロイ

✗ 新人が 1 週間 Wiki を彷徨う
✓ 5 分でオンボーディングチェックリスト
```

## チーム文化

→ [[Critique-Culture]]

- 心理的安全性
- 「**ばかな質問**」を歓迎
- ペアプロ・モブプロ
- 内部勉強会
- 失敗を**Blameless** に振り返る

ツールだけで DX は完結しない。**文化**が支える。

## 「**やる気を奪う**」DX の例

- 30 分のビルド
- 解読困難なエラーメッセージ
- 文書が古い
- 環境構築に丸 1 日
- レビューが 1 週間滞留
- 突然の重要会議で集中切れ
- 1 タスクに 5 ツール往復

これらが**1 つでも**あると、優秀な開発者は離れる。

## SDK / API 提供者の DX

外部開発者向け:

### Stripe の規範

- ドキュメントの完璧さ
- エラーメッセージの親切さ
- 各言語の SDK 統一感
- 試行が**ダッシュボードで完結**
- Webhook 受信のローカルテスト (Stripe CLI)

「**他社が真似する DX 基準**」と言われる。

### Vercel / Supabase

- CLI で全完結
- ダッシュボードと CLI の**両方提供**
- Quick Start が動く
- Edge / Function 統合

## 内部 vs 外部 DX

| | 内部 (社員) | 外部 (SDK ユーザー) |
|---|---|---|
| 焦点 | 生産性 | 採用・継続 |
| ツール | Internal Platform | パブリック SDK |
| 文書 | 社内 Wiki | 公開 Docs |
| サポート | Slack チャネル | サポートチケット |
| メトリクス | DORA, SPACE | NPS, 採用率 |

両方が大事。**内部 DX を磨いた会社が外部 DX も磨ける**(Stripe, Vercel)。

## アンチパターン

- 「環境構築は README 読んで」(README が古い)
- 30 分の CI で**毎回待つ**
- 「**動かないのは君の環境のせい**」
- エラーが「Error: 500」
- レビュー放置 1 週間
- ローカル開発と本番が大きく違う
- ドキュメントが**過去 SDK バージョン**のまま
- 新人サポートは**シニアの善意**頼み

## チェックリスト

- [ ] 新人が**1 日以内に**初コミットできるか
- [ ] CI が **10 分以内**か
- [ ] HMR が**瞬時**か
- [ ] エラーメッセージが**親切**か
- [ ] レビューサイクルが**24h 以内**か
- [ ] ドキュメントが**最新**か
- [ ] 開発者満足度を**定期計測**しているか
- [ ] 失敗時の**Blameless 文化**があるか

## 関連

- [[../10-Coding/CI-CD]]
- [[../10-Coding/Code-Review]]
- [[../10-Coding/API-Design]]
- [[../10-Coding/Schema-Driven-Stack]]
- [[../10-Coding/Error-Handling]]
- [[../10-Coding/Build-Tools-Modern]]
- [[../10-Coding/Observability]]
- [[Documentation-as-Product]]
- [[Knowledge-Management]]
- [[Critique-Culture]]
- [[AI-Augmented-Development]]
- [[Platform-Engineering]]
- [[Site-Reliability-Engineering]]
- [[Discovery-and-Validation]]
- [[Tool-Stacks-Recipes]]

## 深掘り

- *Accelerate* by Forsgren, Humble, Kim (DORA)
- *Team Topologies* by Skelton & Pais
- Microsoft, *SPACE Framework* (research paper)
- Stripe API design philosophy
- *Site Reliability Engineering* (Google SRE Book)
- DX (旧 LinearB) Reports
- Smruti Rout の DX 関連投稿
