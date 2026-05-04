---
tags: [index, cheatsheet, reference]
aliases: [チートシート, クイックリファレンス]
---

# クイックリファレンス チートシート

実務で「**今すぐ確認したい**」数値・閾値・パターンを 1 ページに集約。
詳細は各ノートへ。

## ⏱ パフォーマンス閾値

| 指標 | 良 | 改善が必要 | 不可 | 詳細 |
|---|---|---|---|---|
| **LCP** (主要要素表示) | < 2.5s | 2.5-4s | > 4s | [[../40-Bridge/Performance-as-UX]] |
| **INP** (操作→反応) | < 200ms | 200-500ms | > 500ms | |
| **CLS** (レイアウト飛び) | < 0.1 | 0.1-0.25 | > 0.25 | |
| **TTFB** | < 800ms | 800-1800ms | > 1800ms | |

人間の知覚閾値:
- 即時: **0-100ms**
- 思考が途切れない: **〜1s**
- 注意保持: **〜10s**

## ⏲ アニメーション時間

| 用途 | 時間 |
|---|---|
| ホバー / 押下 | 100-200ms |
| 小要素出現 / 消失 | 200-300ms |
| ページ遷移 | 250-400ms |
| シート / モーダル | 300-500ms |

イージング:
- 入場 = `ease-out`
- 退場 = `ease-in`
- 移動 = `ease-in-out`

→ [[../20-Design/Motion-System]]

## 🎨 アクセシビリティ閾値

| 用途 | AA | AAA |
|---|---|---|
| 通常テキスト (< 18pt) | 4.5:1 | 7:1 |
| 大型テキスト (≥ 18pt or 14pt bold) | 3:1 | 4.5:1 |
| UI コンポーネント / グラフィック | 3:1 | — |
| フォーカスインジケータ | 3:1 | — |

→ [[../30-Interface/Accessibility]]

## 📐 タップ領域

- iOS: **最小 44×44 pt**
- Android: **最小 48×48 dp**
- 隣接要素間: **8-12px** 以上

→ [[../30-Interface/Mobile-Patterns]]

## 📏 スペーシング (8px ベース)

```
0 → 2 → 4 → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 96 → 128
```

| 用途 | 推奨 |
|---|---|
| アイコンとラベル | 4-8 |
| フォーム内側パディング | 8-12 |
| 関連要素ギャップ | 16 |
| ブロック間 | 24-32 |
| セクション間 | 48-64 |

→ [[../20-Design/Spacing-Rhythm]]

## 🔤 タイポグラフィ

| 用途 | 値 |
|---|---|
| 本文サイズ (モバイル) | ≥ 16px |
| 行送り (本文) | 1.4-1.6 |
| 行送り (見出し) | 1.1-1.3 |
| 行長 (欧文) | 45-75 字 |
| 行長 (日本語) | 35-45 字 |

タイプスケール比率:
- 1.125 (Major Second) — 控えめ UI
- 1.250 (Major Third) — 標準
- 1.333 (Perfect Fourth) — 表現的
- 1.500 / 1.618 — ヒーロー

→ [[../20-Design/Typography]]

## 📺 ブレークポイント

```
xs:  0
sm:  640
md:  768
lg:  1024
xl:  1280
2xl: 1536
```

最終的には**コンテンツの破綻点**で決める。

→ [[../30-Interface/Responsive-Design]]

## 🌈 60-30-10 配色ルール

```
ベース   60%
補助    30%
アクセント 10%   ← 行動を促す場所だけ
```

→ [[../20-Design/Color-Theory]]

## 📦 関数 / コンポーネントの目安

- 関数: **1 画面以内** (~50 行)
- 引数: **0-2 個理想**、**3 で警戒**、**4+ は分解候補**
- React コンポーネント Props: **5 個超でリファクタ候補**
- PR: **< 400 行**

→ [[../10-Coding/Clean-Code]] / [[../10-Coding/Code-Review]]

## 🧪 テストピラミッド

```
       /\
      /E2E\        少 (slow, brittle)
     /------\
    /Integ.  \    中
   /----------\
  /  Unit      \  多 (fast, narrow)
 /--------------\
```

FIRST 原則:
- **F**ast / **I**ndependent / **R**epeatable / **S**elf-validating / **T**imely

→ [[../10-Coding/Testing-Strategy]]

## 🚀 デプロイ戦略

| 戦略 | リスク | 用途 |
|---|---|---|
| Recreate | 高 (ダウンタイム) | 社内ツール |
| Rolling Update | 中 | k8s デフォルト |
| Blue-Green | 低 | 即時ロールバック |
| Canary | 低 | 段階的検証 |
| Feature Flag | 最低 | デプロイ ≠ リリース |

→ [[../10-Coding/CI-CD]]

## 🛡 セキュリティ最低限

- HTTPS のみ (HTTP は禁止)
- パスワード: **bcrypt / argon2** (MD5/SHA1 は禁止)
- SQL インジェクション対策: **パラメタライズ必須**
- XSS: テンプレートエンジンの**自動エスケープ**
- CSRF: **SameSite=Lax** + トークン
- API: 認証必須、認可サーバー側で再検証
- 依存: **定期スキャン**(Dependabot 等)

→ [[../10-Coding/Security]]

## 📊 監視の RED

- **R**ate: 単位時間あたりのリクエスト数
- **E**rrors: エラー数
- **D**uration: レイテンシ p50/p95/p99

→ [[../10-Coding/Observability]]

## 🔍 SOLID 原則 (1 行)

- **S**RP: クラスが変わる理由は 1 つ
- **O**CP: 拡張に開き、修正に閉じる
- **L**SP: 派生型は基底型と置換可能
- **I**SP: 使わない IF への依存を強制しない
- **D**IP: 抽象に依存、詳細でなく

→ [[../10-Coding/SOLID-Principles]]

## 🎯 命名のルール

```
真偽値:        is/has/can/should
取得:          get / fetch (async) / find
変更:          set / update
変換:          to / as
```

- 単位を埋め込む: `timeoutMs`, `priceCents`, `distanceKm`
- 単複を厳密に: `user` / `users` / `usersById`
- 抽象化レベル揃える

→ [[../10-Coding/Naming]]

## 🌍 i18n 必須事項

- 文字列直書き禁止 → **翻訳キー**経由
- 単複・性別は **ICU MessageFormat**
- 日付・通貨は **Intl API**
- テキスト膨張: 英 → 独 +30-40%
- RTL: **CSS Logical Properties** (`margin-inline-start`)

→ [[../40-Bridge/Internationalization]]

## 📝 フォーム必須事項

- `<label for>` 紐付け
- 適切な `type` (`email`, `tel`, `number`)
- `autocomplete="..."` 必須
- 必須は色だけでなく **`*`** + `aria-required`
- エラーは**何が・どう直すか**

→ [[../30-Interface/Forms-and-Input]]

## 🎬 5 つの状態

すべての UI コンポーネントで設計:

1. **Empty**: データが無い
2. **Loading**: 取得中
3. **Partial**: 一部のみ
4. **Error**: 失敗
5. **Ideal**: 完全

→ [[../30-Interface/Loading-States]]

## 🚨 Lighthouse 目標値

```
Performance:    > 90
Accessibility:  100
Best Practices: > 90
SEO:            > 90
```

CI で**回帰検出**。

## 💾 データ型の罠

- お金: **decimal or 整数 (cents)**、float 禁止
- 日時: **timestamptz** (タイムゾーン付き)
- ID: **bigint or uuid**
- 列挙: text + CHECK 制約
- メール: varchar + CHECK + 大文字小文字無視比較

→ [[../10-Coding/Database-Design]]

## 🔁 Cache-Control 早見

```
public, max-age=31536000, immutable
   ハッシュ付き静的アセット (1 年)

public, max-age=60, stale-while-revalidate=300
   準静的 SSR (1 分新鮮、5 分 stale で OK)

private, no-store
   個人情報・決済画面

no-cache
   毎回検証 (ETag/Last-Modified 必須)
```

→ [[../10-Coding/Caching-Strategies]]

## 🤖 LLM UI 必須機能

- ストリーミング表示
- キャンセルボタン
- 編集 / 再生成
- 出典表示 (RAG)
- 👍👎 フィードバック
- 危険操作は人間確認
- 「**新しい会話**」リセット

→ [[../30-Interface/AI-LLM-Interfaces]]

## 🔐 プライバシー必須事項

- **データ最小化**: 必要分のみ
- **保管期間**: 明示
- **削除権**: UI から自動実行
- **同意**: 真の同意 (デフォルトオフ)
- **暗号化**: 転送 + 保管
- **PII**: ログに出さない

→ [[../40-Bridge/Privacy-by-Design]]

## 🎵 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

→ [[../30-Interface/Accessibility]]

## 🌑 ダークモード初期設定

```html
<script>
  document.documentElement.dataset.theme =
    localStorage.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
</script>
<meta name="color-scheme" content="light dark">
```

→ [[../20-Design/Dark-Mode]]

## 🔧 Git コミットメッセージ

```
<type>(<scope>): <subject>

<body: なぜ>

<footer>
```

types: `feat / fix / refactor / test / docs / chore / perf`

→ [[../10-Coding/Version-Control]]

## 📚 Diátaxis (ドキュメント 4 種)

| | 実用 | 理論 |
|---|---|---|
| **学習者** | Tutorial | Explanation |
| **既知のゴール** | How-to | Reference |

混ぜない。

→ [[../40-Bridge/Documentation-as-Product]]

## 🎯 関連

- [[MOC]]
- [[Decision-Frameworks]]
- [[Learning-Paths]]
- [[Recipes]]
- [[Patterns-Catalog]]
- [[../GLOSSARY]]
