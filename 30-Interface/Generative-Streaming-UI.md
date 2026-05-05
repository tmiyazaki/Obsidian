---
tags: [skill, interface, ai, ui, streaming]
domain: interface
level: advanced
---

# 生成的・ストリーミング UI

## 一行で

> 「**LLM が UI を生成する**」「**サーバから流れる UI**」 ── 2024-2026 のフロントエンド最大の変化。**完成した UI を待つ**から**進化する UI を見る**へ。

## なぜ重要か

伝統的に UI は:
- 設計者が**事前に決めた**コンポーネント
- 完成データを**待ってから**描画
- ローディングスピナーで間を埋める

新しい UI は:
- LLM が**動的に**コンポーネントを選び・組み合わせる (Generative UI)
- サーバが**少しずつ**UI を流す (Streaming SSR / RSC)
- ユーザー入力に応じて **UI が変形**

「**柔軟さ**」と「**応答性**」が桁違いに上がる。

## React Server Components (RSC) とストリーミング

### 基本概念

```tsx
// Server Component (サーバでレンダ、JS 不要)
async function UserProfile({ id }: { id: string }) {
  const user = await db.users.find(id);
  return (
    <article>
      <h1>{user.name}</h1>
      <ClientButton userId={id} />  {/* Client Component */}
    </article>
  );
}
```

長所:
- DB に**直接アクセス**(API 不要)
- JS バンドル削減
- SEO・初期表示が速い

`use client` で**境界**を明示。Client Component は従来通り。

→ [[../10-Coding/Modern-Web-Platform]]

### Suspense で段階表示

```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

各セクションが**独立して**ロード:

```
[ 即表示: ヘッダ・ナビ ]
[ ロード中: 商品リスト ]      ← Skeleton
[ ロード中: レビュー ]        ← Skeleton
   ↓ 数百 ms 後
[ 表示: 商品リスト ]
[ ロード中: レビュー ]
   ↓
[ 表示: レビュー ]
```

ストリーミング SSR で**最初の HTML が即届き**、各セクションが**順次充填**される。LCP / TTFB が改善。

→ [[Loading-States]]

### Server Actions

フォーム送信を**サーバ関数**に直接:

```tsx
"use server";
async function createPost(formData: FormData) {
  const title = formData.get("title");
  await db.posts.create({ title });
  revalidatePath("/posts");
}

// client
<form action={createPost}>
  <input name="title" />
  <button>作成</button>
</form>
```

API ルート不要、**型安全**、JS が無くても動く (progressive enhancement)。

→ [[../10-Coding/Modern-Web-Platform]]

## Generative UI (LLM が UI を組む)

### 基本概念

LLM がツールとして**コンポーネントを選び**、props を渡して描画:

```ts
const tools = [
  { name: "show_chart", input_schema: { type, data } },
  { name: "show_table", input_schema: { columns, rows } },
  { name: "show_card", input_schema: { title, body, actions } },
  { name: "show_form", input_schema: { fields } },
];

// LLM が選択
{
  tool: "show_chart",
  input: { type: "line", data: [...] }
}

// クライアントが対応コンポーネントをレンダ
```

ユーザーの質問:
- 「先月の売上推移は?」 → LLM が `show_chart` を選択
- 「上位 10 顧客を表で」 → `show_table` を選択

**回答が文字列だけでない**。データに合った最適な UI が出る。

### Vercel AI SDK の `streamUI`

```ts
const result = await streamUI({
  model: anthropic("claude-sonnet-4-6"),
  prompt: userInput,
  tools: {
    showChart: {
      description: "数値データをチャート表示",
      parameters: z.object({ data: z.array(...), type: z.enum([...]) }),
      generate: async ({ data, type }) => <Chart data={data} type={type} />,
    },
  },
});
```

LLM が `showChart` を選ぶと**実際の React コンポーネント**が結果として返る。

### サンプル UI 集

LLM がコンテキストに応じて選ぶ:
- フォーム
- チャート / グラフ
- カード
- リスト・テーブル
- 確認ダイアログ
- 進捗バー
- 地図
- カレンダー / 日付ピッカー

UI ライブラリを**LLM が組み合わせる**。

## ストリーミングテキスト UI

LLM の応答を**1 文字ずつ**:

```tsx
import { useChat } from "ai/react";

function Chat() {
  const { messages, input, handleSubmit, handleInputChange } = useChat();
  return (
    <>
      {messages.map(m => <div key={m.id}>{m.content}</div>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
```

裏で SSE / Web Streams を使い、トークンが流れるたびに再描画。

→ [[AI-LLM-Interfaces]]

### 自動スクロール

```tsx
useEffect(() => {
  if (autoScroll) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
```

「ユーザーが上にスクロールしている」ときは**自動スクロールしない**。下にいる時だけ追従。

### 中断 (Cancel)

```ts
const ctrl = new AbortController();
fetch("/api/chat", { signal: ctrl.signal });
// ボタンクリック → ctrl.abort()
```

ユーザーが「もういい」と思ったときに即停止。

## ストリーミング Markdown レンダリング

LLM 応答に Markdown が混ざる:

```
| 項目 | 値 |
|------|----|
| A    | 1  |

**重要**: ...
```

ストリーミング中は**不完全な Markdown** が来る。 react-markdown + 適切な戦略で安定描画:
- 表は完成してから整形
- コードブロックは終了デリミタを待つ
- 見出しは即時

ライブラリ: react-markdown, marked-react, mdx-bundler。

## Generative Forms

LLM がフォームスキーマを生成:

```
ユーザー: 「友人を招待したい」
   ↓
LLM 生成: {
  fields: [
    { type: "email", label: "メール", required },
    { type: "text", label: "メッセージ", multiline },
  ]
}
   ↓
動的フォーム描画
```

→ [[Forms-and-Input]] / [[../10-Coding/Schema-Driven-Stack]]

## Optimistic UI for Server Actions

```tsx
const [optimistic, setOptimistic] = useOptimistic(items);

async function handleAdd(formData) {
  setOptimistic({ ...items, newItem: { ... } });   // 即時 UI 更新
  await createItem(formData);                       // サーバ実行
}
```

サーバ応答を待たず UI 先行更新。失敗時は React が**自動でロールバック**。

→ [[Interaction-Patterns#Optimistic-UI]]

## Partial Pre-rendering (Next.js)

静的部分は**ビルド時**生成、動的部分は**リクエスト時**ストリーミング:

```
[ Static: ヘッダ・フッタ・本文骨格 ] (CDN から即配信)
[ Dynamic: ユーザー固有部分 ]         (ストリーミング)
```

SSG の速さ + SSR の動的性を**両立**。

→ [[../40-Bridge/Performance-as-UX]]

## エッジでの Streaming

→ [[../10-Coding/Edge-and-Distributed]]

CDN エッジで部分レンダ + ストリーミング。LCP < 1s が現実的に。

## アクセシビリティ

→ [[Accessibility]]

ストリーミング UI は**SR で煩い**になりやすい:

- メッセージ追加時のみ通知 (`aria-live="polite"`)、トークン単位ではない
- 完了時の「**応答が完了しました**」アナウンス
- フォーカスを失わないように制御

```tsx
<div role="log" aria-live="polite" aria-atomic="false">
  {messages.map(...)}
</div>
```

## エラーハンドリング

→ [[../10-Coding/Error-Handling]]

ストリーミング中の失敗:
- 部分的に描画された状態で**エラー表示**
- 中断ボタンを**再試行**ボタンに切替
- 「**続きから**」(可能なら)

```tsx
{messages.map(m => (
  m.error ? (
    <ErrorMessage onRetry={() => retry(m.id)} />
  ) : (
    <Message {...m} />
  )
))}
```

## パフォーマンス

→ [[../10-Coding/Performance]]

- 各更新で**仮想 DOM 全描画しない**(memo, key 適切)
- 長い会話は**仮想スクロール**
- Markdown のパースは**チャンクごと**でなく一定間隔
- ストリームは**chunk バッファリング**で滑らか

## デザイン要件

- 「進行中」感(カーソル点滅、グレー濃淡)
- 完了時の**色変化**
- ツール呼び出し中のスピナー / アイコン
- 不完全テキストでも**読める**(行頭タイポ対策)

→ [[Microinteractions]] / [[../20-Design/Motion-System]]

## 監視

→ [[../10-Coding/Observability]] / [[../40-Bridge/AI-Evaluation-Safety]]

ストリーミング AI 特有のメトリクス:
- **TTFT** (Time To First Token)
- **トークン速度** (tok/s)
- **完了率**(中断・タイムアウトしない割合)
- **応答長分布**

## アンチパターン

- ストリーミング中の自動スクロールが**強制**(ユーザーが上を読めない)
- トークン追加のたびに**全再レンダ**
- 中断ボタンなし
- 不完全 Markdown で**表示崩壊**
- aria-live で**全トークンを読み上げ**(SR うるさい)
- エラー時に**全消去**(部分でも保持して再開)
- LLM 出力を **そのまま**HTML レンダ (XSS リスク)

## チェックリスト

- [ ] **TTFT < 1s** で最初のトークンが届くか
- [ ] **中断**が常に可能か
- [ ] スクロール追従が**ユーザー位置を尊重**するか
- [ ] aria-live が**煩くない**か
- [ ] エラー時に**部分結果が残る**か
- [ ] **Generative UI** ならコンポーネント選択を網羅できるか
- [ ] サニタイズ(XSS 対策)されているか

## 関連

- [[AI-LLM-Interfaces]]
- [[Agentic-AI-Patterns]]
- [[Conversational-UI]]
- [[Loading-States]]
- [[Forms-and-Input]]
- [[Microinteractions]]
- [[Accessibility]]
- [[../10-Coding/Modern-Web-Platform]]
- [[../10-Coding/Schema-Driven-Stack]]
- [[../10-Coding/Performance]]
- [[../10-Coding/Edge-and-Distributed]]
- [[../40-Bridge/AI-Evaluation-Safety]]
- [[../40-Bridge/Performance-as-UX]]

## 深掘り

- Vercel AI SDK documentation
- React Server Components RFC
- Anthropic, *Building Effective Agents*
- Next.js App Router documentation
- Theo Browne の RSC 解説動画
- *Patterns.dev* (modern UI patterns)
