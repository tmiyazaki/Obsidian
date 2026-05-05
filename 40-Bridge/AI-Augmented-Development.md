---
tags: [skill, bridge, ai, productivity]
domain: cross-cutting
level: intermediate
---

# AI 支援開発 (AI-Augmented Development)

## 一行で

> Cursor / Claude Code / GitHub Copilot / v0 / Bolt ── 開発フローに AI が織り込まれた**新しい標準**。「**生産性**」「**役割**」「**学習**」が変わる。

## なぜ重要か

2024-2026 で AI 開発ツールは**実用段階**に到達:
- Cursor / Windsurf: コードベース全体を理解してエディト
- GitHub Copilot Workspace: タスクから PR まで自律実行
- Claude Code / Aider / Cline: ターミナル / IDE で対話的にコーディング
- v0 / Lovable / Bolt: 自然言語から React アプリ生成
- Devin: 完全自律のソフトウェアエンジニアリング

「**AI を使うか使わないか**」ではなく「**どう使うか・何を任せるか**」が問われています。同時に**過信**のリスクも顕在化しました。

## 4 つのレベル

```
L0: AI なし          ─ 従来どおり
L1: 補完 (Inline)    ─ Copilot 提案を受け入れる
L2: 対話 (Chat)      ─ AI と相談しながら書く
L3: 委譲 (Tasks)     ─ タスク単位で AI に任せる
L4: 自律 (Agents)    ─ AI が PR まで作る
```

タスク・経験・リスクで使い分け。**全部 L4** は危険、**全部 L0** は遅い。

## 主要ツール

### IDE 統合

#### Cursor / Windsurf

VS Code フォーク + 深い AI 統合。
- Cmd+K で**インライン編集**
- Composer で**複数ファイル**を一気に
- リポジトリ全体を**コンテキスト**に

#### GitHub Copilot

最も普及。インライン補完 + チャット。Workspace でタスク委譲。

#### JetBrains AI Assistant / IntelliJ AI

JetBrains 系列の統合。

### コマンドライン

#### Claude Code (Anthropic)

ターミナル内で対話・実行・編集。長いタスクに強い。

#### Aider / Cline

オープンソース。任意のモデル接続可。

### 自然言語 → アプリ

#### v0 (Vercel)

「ダッシュボード作って」→ Next.js アプリ生成。React + Tailwind ベース。

#### Bolt.new / Lovable

ブラウザ内で動くアプリを即生成。

#### Replit Agent

Replit でのプロジェクト全体生成。

### 自律エージェント

#### Devin

「リポジトリのバグを直して PR を出す」を**自律実行**。

#### OpenAI Codex (新)

リポジトリベースのコードエージェント。

## 効果的な使い方

### 1. **コンテキストを与える**

AI に**何を知ってほしいか**明示:

```
✗ "このバグを直して"
✓ "以下のコンテキストで:
   - リポジトリ: monorepo (apps/web, packages/ui)
   - スタック: Next.js + tRPC + Drizzle
   - エラー: <stack trace>
   - 関連ファイル: src/services/auth.ts
   - 期待動作: ..."
```

ファイル添付・関連コードのリンク・コミット履歴。

### 2. **小さく分ける**

巨大な変更を**1 タスク**で頼まない:

```
✗ "認証システム全体を JWT から Passkey に移行して"
✓ "1. JWT 取り扱いの全ファイルを列挙
   2. ライブラリ選定の検討
   3. ステップ 1 の各ファイルを修正
   ..."
```

各ステップで**人間が確認**。

### 3. **テストを書かせる**

```
"この関数のテストケースを書いて。
 エッジケース(空入力、null、巨大入力、Unicode)を含めて"
```

AI のテスト生成は**強い**。生成 → 確認 → 実装の流れ。

### 4. **Refactor の補助**

```
"このコードを SOLID 原則に従ってリファクタ。
 振る舞いは変えず、テストが通る前提で"
```

AI はパターン適用が得意。

→ [[../10-Coding/Refactoring]] / [[../10-Coding/SOLID-Principles]]

### 5. **学習の伴走**

```
"このコードを読んで、初学者向けに解説して"
"なぜここで Result 型を使う?例外との違いを"
```

「教えて」で深まる。シニア知識のアクセスが民主化。

### 6. **Spec / プロンプトを書かせる**

```
"以下の機能を実装したい。要件を整理して、
 エッジケース・依存関係・テスト計画を提案して"
```

実装前の**思考整理**で人間より速く網羅できる。

## 何を AI に任せ、何を任せないか

### 任せやすい

- ボイラープレート (CRUD, セットアップ)
- 既存パターンの**繰り返し適用**
- テスト・ドキュメント生成
- 古い API → 新 API への**機械的変換**
- 解説・コードレビュー
- 命名提案
- 言語間移植 (Python → TypeScript)

### 慎重に

- アーキテクチャ判断
- セキュリティ実装
- 認可ロジック
- 金融計算
- パフォーマンスクリティカル
- 既存システムとの**深い統合**

### 任せにくい

- ビジネス判断
- 倫理判断
- 顧客文脈の理解
- 暗黙の規約・社内文化
- 「この機能を作るべきか」

## レビュー責任

AI 生成コードでも**マージするのは人間**:

> "Don't merge what you don't understand."

理解できないコードは:
- 質問して説明させる
- テストで挙動を確認
- 拒否して人間が書く

→ [[../10-Coding/Code-Review]]

## デザインへの拡張

### v0 / Lovable / Magic Patterns

自然言語 + スクリーンショットから**UI 生成**:

```
"ダッシュボード。左サイドバー、3 つの KPI カード、
 折れ線グラフ、テーブル。Linear 風のスタイル"
   ↓
   完成度 80% の React コンポーネント
```

「デザイナー → エンジニア」の境界が曖昧化。**プロト → 本番**の橋渡しに。

→ [[../20-Design/Design-Systems]] / [[Component-Driven-Development]]

### Figma + AI

- Magician
- Figma AI (公式)
- Diagram (Figma 買収)

レイアウト提案、テキスト生成、画像配置。

### スクリーンショット → コード

Vercel v0, Galileo, Magic Patterns。
画像を渡すと近い React コンポーネントを生成。
**正確なピクセル**ではなく**意図に近いコード**。

## 「Vibe Coding」の罠

「**雰囲気**で書いて動けばいい」と AI に丸投げ:

問題:
- セキュリティホールの埋め込み
- 性能問題の蓄積
- メンテ不能なコード
- 「**動いてるけど何やってるか分からない**」

対策:
- 重要箇所は**理解して**書く
- AI 生成は **下書き** として扱う
- レビューと**自分の判断**を介す
- セキュリティ・認可は**特に**確認

「AI で 10 倍速く書く」は、**動いた後のメンテで返済**することになりがち。

## チームでの導入

### ガイドライン

- 何に使ってよい / 使わない
- 機密情報を AI に送らない (社内データ漏洩)
- 生成コードのライセンス・著作権
- レビュー責任の明示

### ツール選択

- **エンタープライズ版**(データ学習なし)
- セルフホスト LLM オプション (Ollama, vLLM)
- ログ・監査機能

### 教育

- 効果的なプロンプト
- レビューの観点
- AI の限界の認識

## 倫理・知財

→ [[Ethical-Design]]

- AI 生成コードの**著作権**(国・モデルにより異なる)
- 訓練データの**ライセンス**問題
- オープンソースの**再現**(GPL コードが滲み出る?)
- **AI 生成と開示**(EU AI Act)

社内・社外コードを AI に渡すとき、**契約・規約**を確認。

## プライバシー

→ [[Privacy-by-Design]]

- 顧客データを**AI に送らない**
- API キー / 秘密鍵を**コードに含めない**
- 学習に使うか確認(エンタープライズ版で OFF)
- ローカル LLM の選択肢(機密性最強)

## メトリクス

「AI で生産性 N 倍」を測るのは難しい:

- 行数 / 時間: ❌(雑なコードは多く書ける)
- PR 数 / 週: 一定の指標
- バグ率: 後で出るので注意
- DORA メトリクス: 中長期で見る
- **満足度**: 開発者体験

→ [[../10-Coding/CI-CD]] / [[Discovery-and-Validation]]

## ロールの変化

伝統的な開発者の役割が変化:
- **書く**比率が下がる
- **レビューする・判断する**比率が上がる
- **ツールを選び・カスタマイズ**する技能が要る
- **ビジネス・ドメイン知識**の重要性が上がる

「**AI に取って代わられる**」ではなく「**AI と組む人と組まない人**」の差が広がる。

## 学習への影響

新人エンジニアの育成:
- **AI に頼ると基礎が定着しない**懸念
- 一方で**質問の壁**が下がる
- ペアプロ的な学習を AI が代替

バランス:
- 基本概念は**自分で**書ける
- 高度な領域は **AI で加速**
- AI の答えを**疑う力**を育てる

## アンチパターン

- AI 生成を**理解せずマージ**
- 機密コード・個人情報を**AI に送る**
- セキュリティ・認可を **AI 任せ**
- AI に依存しすぎ**基礎が定着しない**
- 「**動いた**」で品質確認を省く
- ガイドラインなしで**チーム全員**が好き勝手
- AI 生成の**ライセンス確認なし**

## チェックリスト

- [ ] AI 生成を**理解してから**マージしているか
- [ ] **機密情報**を渡していないか
- [ ] セキュリティ・認可を**人間が確認**しているか
- [ ] チームに**ガイドライン**があるか
- [ ] AI 生成のテストを**書いている**か
- [ ] 重要箇所は**自分で**書けるか
- [ ] DORA / 満足度で**効果を測**っているか

## 関連

- [[Component-Driven-Development]]
- [[Documentation-as-Product]]
- [[Knowledge-Management]]
- [[Critique-Culture]]
- [[Ethical-Design]]
- [[Privacy-by-Design]]
- [[AI-Evaluation-Safety]]
- [[../10-Coding/Code-Review]]
- [[../10-Coding/Refactoring]]
- [[../10-Coding/Security]]
- [[../10-Coding/Testing-Strategy]]
- [[../10-Coding/CI-CD]]
- [[../30-Interface/AI-LLM-Interfaces]]
- [[../30-Interface/Agentic-AI-Patterns]]
- [[../30-Interface/Generative-Streaming-UI]]

## 深掘り

- Anthropic, *Claude Code documentation*
- Cursor / Windsurf documentation
- GitHub Copilot Workspace
- *AI Engineering* by Chip Huyen
- *Refactoring with AI* (community articles)
- DORA reports on AI productivity
