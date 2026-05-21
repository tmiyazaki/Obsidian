---
tags: [skill, coding, reactive, signals]
domain: coding
level: advanced
---

# リアクティブプログラミングと Signals

## 一行で

> 「**値が変わると依存先が自動更新**」という抽象。React の `useState` から RxJS、Solid Signals、MobX まで、**形は違うが本質は同じ**。

## なぜ重要か

UI は本質的に「状態 → 派生値 → 表示」の連鎖です。手動同期は地獄:
- A が変わったら B を再計算
- B が変わったら C を再描画
- 1 箇所の更新漏れで**バグ**

リアクティブシステムは**依存追跡を自動化**し、最小再計算を保証します。

## 抽象の系譜

```
Observable Pattern (古典)
   ↓
Cell / Signal (細粒度)
   ↓
Stream (非同期コレクション)
   ↓
Observable (RxJS) / Flow (Kotlin) / AsyncIterable
```

すべて「**値の時間変化**」を一級市民として扱う。

## Signals の現代復権

Solid / Vue 3 / Svelte 5 / Preact / Angular Signals が採用:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);
effect(() => console.log("doubled:", doubled()));

count.set(5);  // → "doubled: 10" 自動実行
```

利点:
- **細粒度更新**(変わった部分だけ再計算)
- 仮想 DOM 不要
- React の Re-render 問題を回避

TC39 で**標準化提案中**(JavaScript 標準化)。

## React の Signal 化

`use` / `useSyncExternalStore` で外部 store を React に橋渡し:

```ts
import { useSignal, useComputed } from "@preact/signals-react";

function Counter() {
  const count = useSignal(0);
  return <button onClick={() => count.value++}>{count}</button>;
}
```

Jotai, Zustand, Valtio も類似コンセプト。

→ [[State-Management]]

## Stream / Observable

「**値の連続**」として時間を扱う。RxJS が代表:

```ts
import { fromEvent, debounceTime, switchMap } from "rxjs";

fromEvent(input, "input").pipe(
  debounceTime(300),
  switchMap((e) => api.search(e.target.value)),
).subscribe((results) => render(results));
```

長所: 複雑な非同期フロー (キャンセル、デバウンス、合流)
短所: 学習曲線急、TypeScript 推論が弱い

「**RxJS は問題に対して大きすぎる**」という批判もあり、Promise/async + Signals の組合せが現代的。

## 依存追跡のメカニズム

Signal の本質: **読み取り時に依存登録**:

```ts
let currentEffect = null;

function signal(value) {
  const subs = new Set();
  return {
    get: () => {
      if (currentEffect) subs.add(currentEffect);  // 依存登録
      return value;
    },
    set: (v) => {
      value = v;
      subs.forEach(fn => fn());                     // 通知
    },
  };
}

function effect(fn) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}
```

これだけで**Pull-based reactive**が成立する。

## React Compiler / Auto-memo

React 19 の Compiler は memo を**自動挿入**:

```tsx
// 開発者が書く
function Component({ data }) {
  const filtered = data.filter(...);
  return <List items={filtered} />;
}

// Compiler が変換
function Component({ data }) {
  const filtered = useMemo(() => data.filter(...), [data]);
  return <List items={filtered} />;
}
```

「メモ化を意識しない」React へ。Signals に近づく方向。

## バックエンドのリアクティブ

### Server-Sent Events (SSE)

```ts
const evtSource = new EventSource("/stream");
evtSource.onmessage = (e) => updateUI(JSON.parse(e.data));
```

サーバ → クライアントの一方向。LLM ストリーミングの基盤。

→ [[../30-Interface/Generative-Streaming-UI]] / [[../30-Interface/AI-LLM-Interfaces]]

### WebSocket

双方向ストリーム。リアルタイム協働。

→ [[../30-Interface/Real-time-Collaboration]]

### Push API

ブラウザがバックグラウンドで通知受信。

→ [[../30-Interface/Notifications]]

### CDC (Change Data Capture)

DB 変更を**ストリームとして配信**:
- Debezium (Postgres / MySQL → Kafka)
- Supabase Realtime
- Firebase Firestore listeners

長所: アプリは subscribe するだけ
短所: スケール時の管理複雑、整合性の議論

## バックプレッシャ

→ [[Concurrency-Async]]

生産者 > 消費者で**メモリ膨張**:

```ts
source$.pipe(
  buffer(every5seconds$),    // 5 秒分まとめる
  // or
  throttleTime(100),         // 100ms に 1 回まで
  // or
  sample(every1second$),     // 直近のみ
).subscribe(consume);
```

Reactive Streams 仕様 (Java) は標準化された解。WebStreams も類似 API。

## Signals の罠

### 1. 過度な細粒度

```
[ Item ] x 10000 で それぞれが Signal
   ↓
更新時に 10000 個の依存をチェック
```

実は**まとめて更新**のほうが速い場面もある。

### 2. 暗黙の依存

```ts
const total = computed(() => {
  if (showTax()) return base() * 1.1;
  return base();
});
// showTax が false の時は base への依存登録されない
// → showTax が true になった瞬間、base への subscribe が始まる
```

**動的依存**が便利だが、デバッグ困難。

### 3. メモリリーク

```ts
const sub = signal.subscribe(fn);
// アンマウント時に sub.unsubscribe() を忘れる → リーク
```

React の `useEffect` のクリーンアップを必ず。

### 4. SSR 不整合

サーバとクライアントで**初期値が違う**と Hydration 失敗。Signal の SSR ハンドリングは要注意。

## RxJS vs Signals vs Async/Await

| | 強み | 用途 |
|---|---|---|
| **Async/Await** | シンプル、TS 推論強 | 単発の非同期 |
| **Signals** | 同期反応、細粒度 | UI 状態 |
| **RxJS** | 時間・並列・キャンセルに強い | 複雑な非同期合成 |
| **AsyncIterable** | 標準、軽量 | ストリーミング |

「**全部 RxJS**」は重い。役割で使い分ける。

## State Machine との連携

→ [[State-Management]]

XState の actor は Signal/Observable と相性が良い:

```ts
const machine = createMachine({...});
const actor = createActor(machine);
const state = useSelector(actor, (s) => s.context);
```

UI = ⌝(状態) と捉える。

## アンチパターン

- 何でも Observable で**過剰抽象化**
- Signal を React コンポーネント内で**毎レンダ作成**(状態リセット)
- Promise で済む場面に RxJS
- 依存追跡を**理解せず**使う(無限ループ・リーク)
- SSR で初期値の同期を**取らず**Hydration 失敗
- Subscribe したら**Unsubscribe を忘れる**

## チェックリスト

- [ ] **同期反応**(UI 状態)に Signal / 細粒度 store を選んだか
- [ ] **複雑非同期**(キャンセル、合流)に Streams を選んだか
- [ ] Subscribe の**クリーンアップ**を忘れていないか
- [ ] バックプレッシャ対策があるか
- [ ] SSR 時の初期値同期があるか
- [ ] `useMemo` / `computed` の使いすぎ・不足を**測定**したか

## 関連

- [[State-Management]]
- [[Concurrency-Async]]
- [[Functional-Programming]]
- [[Performance]]
- [[Modern-Web-Platform]]
- [[../30-Interface/Real-time-Collaboration]]
- [[../30-Interface/Generative-Streaming-UI]]
- [[../30-Interface/Microinteractions]]

## 深掘り

- *Functional-Light JavaScript* by Kyle Simpson
- *RxJS in Action* by Paul Daniels
- TC39 Signals proposal
- Solid.js documentation
- Ryan Carniato の Signal 解説動画
- *The Reactive Manifesto* (reactivemanifesto.org)
