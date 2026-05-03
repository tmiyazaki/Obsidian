---
tags: [skill, coding, concurrency]
domain: coding
level: advanced
---

# 並行性と非同期

## 一行で

> 並行性は「**同時に進める能力**」、並列性は「**同時に実行する能力**」。両者を区別し、共有状態とブロッキングを設計の対象にする。

## なぜ重要か

ユーザー体験は「待ち時間の総和」で決まりますが、CPU/IO はその大半をアイドルに過ごしています。並行性はそのアイドルを**作業に変える**設計。間違えれば**最も再現困難なバグ**(レースコンディション、デッドロック、リーク)を生むため、原則を持つことが必須です。

## 並行性 (Concurrency) と 並列性 (Parallelism)

```
Concurrency: 複数のタスクを「進行中」にする能力 (1 コアでも可)
Parallelism: 同時に実行する能力 (複数コア必要)
```

JavaScript はシングルスレッドだが**並行性**は持つ (イベントループ)。Go は **M:N スケジューラ**で goroutine を OS スレッド上に多重化して**両方**実現。

## モデル

### 1. スレッド + ロック (古典)

直感的だが、共有メモリが**バグの温床**。デッドロック・データ競合・優先度逆転。

### 2. イベントループ (Node.js, ブラウザ)

シングルスレッドで非同期 IO。CPU バウンド処理は**ワーカースレッド**で逃がす。

```ts
// メインスレッドをブロックしない
import { Worker } from "worker_threads";
const worker = new Worker("./heavy-calc.js");
```

### 3. アクター (Erlang, Akka)

各アクターが独立メモリと**メッセージキュー**を持つ。共有なし、競合しない。Erlang/Elixir の哲学。

### 4. CSP (Go の goroutine + channel)

```go
ch := make(chan int)
go func() { ch <- 42 }()
val := <-ch
```

「**共有メモリで通信せず、通信で共有せよ**」(Pike)。

### 5. async/await (現代の主流)

非同期処理を**同期的な見た目**で書ける。Rust, JS, Python, C# などで採用。

## async/await の基本

```ts
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/users/${id}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
```

### 並列実行

```ts
// ❌ 直列 (3 倍時間)
const a = await fetchA();
const b = await fetchB();
const c = await fetchC();

// ✅ 並列
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
```

### エラー耐性のある並列

```ts
// 1 つ失敗で全停止 (Promise.all)
// 全結果を取得 (Promise.allSettled)
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);
results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
```

### 並列度制限

無制限並列は下流を破壊する:

```ts
// p-limit で並列度を制限
import pLimit from "p-limit";
const limit = pLimit(5);
const results = await Promise.all(items.map((i) => limit(() => process(i))));
```

### キャンセル (AbortController)

```ts
const ctrl = new AbortController();
const promise = fetch(url, { signal: ctrl.signal });

// 5 秒タイムアウト
setTimeout(() => ctrl.abort(), 5000);
```

長時間処理は**必ずキャンセル可能**にする。React コンポーネントの unmount で fetch を中断するなど。

## 主要な落とし穴

### 1. レースコンディション

```ts
// 連打で順序が崩れる
const search = async (q: string) => {
  const results = await api.search(q);
  setResults(results); // ← 古い結果が新しい結果を上書きする可能性
};

// ✅ 最新リクエストだけ反映 (キャンセル or seq 管理)
let seq = 0;
const search = async (q: string) => {
  const me = ++seq;
  const results = await api.search(q);
  if (me === seq) setResults(results);
};
```

### 2. デッドロック

ロック A を保持して B を待つスレッドと、B を保持して A を待つスレッド。
回避: **ロック取得順序を全プロセスで統一**、タイムアウト付き取得。

### 3. リソースリーク

イベントリスナ、タイマー、購読の解除忘れ:

```tsx
useEffect(() => {
  const sub = bus.on("event", handler);
  return () => sub.unsubscribe(); // ← 必須
}, []);
```

### 4. メモリ可視性 (low-level)

別スレッドが書いた値が**自スレッドに見えない**ことがある (CPU キャッシュの問題)。`volatile`, `atomic`, メモリバリアが必要。
高水準言語ではフレームワークが扱うが、C++/Rust/Java では意識する。

### 5. async 関数の例外伝播

```ts
// 投げられた例外は Promise の rejection になる
async function risky() { throw new Error("oops"); }

risky();              // ← UnhandledPromiseRejection
risky().catch(...);   // ✅
try { await risky(); } catch { ... }  // ✅
```

`.catch` を忘れると Node.js は将来クラッシュする。

## バックプレッシャ

生産者が消費者より速いと**メモリが膨張**する。

対策:
- **キュー長制限** + 拒否
- **Streams** (`pipeTo` で push/pull 自動調整)
- ロードシェディング (一部リクエストを切る)
- Reactive Streams 仕様 (RxJS, Project Reactor)

## ジョブキューと非同期処理

長時間/失敗しうる処理は**バックグラウンドジョブ**へ:
- メール送信、PDF 生成、画像変換、決済
- リトライ・冪等性・優先度・タイムアウト
- ライブラリ: BullMQ (Node), Sidekiq (Ruby), Celery (Python), Cloud Tasks/SQS

## Worker / プロセス分離

CPU バウンドはイベントループを止める。逃がし先:
- **Web Worker** (ブラウザ)
- **Worker Threads** (Node.js)
- **Service Worker** (オフライン・バックグラウンド)
- **マルチプロセス** (Cluster, PM2)

## Promise の組み合わせ早見

```ts
Promise.all([...])         // 全成功 / 1 つでも失敗で reject
Promise.allSettled([...])  // 全完了を待つ
Promise.race([...])        // 最初に決着したもの
Promise.any([...])         // 最初に成功したもの
```

タイムアウトには `Promise.race` を活用:

```ts
const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    p,
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
```

## アンチパターン

- 全 await を直列化 (並列化機会を逃す)
- `async` でない箇所で `await` を期待
- 例外を握り潰す Promise (`.catch(() => {})`)
- イベントリスナ・タイマーの解除忘れ
- 共有可変状態を**ロックなしで**触る
- キャンセル不能な長時間処理
- 並列度無制限で下流を殺す
- `setInterval` でハンドラ実行が間に合わず**重複実行**

## チェックリスト

- [ ] 並列化機会を**逃していない**か (`Promise.all`)
- [ ] 並列度に**上限**があるか
- [ ] 長時間処理は**キャンセル可能**か
- [ ] 例外が**全パス**で扱われているか
- [ ] レースコンディション (連打・古い結果上書き) を考慮したか
- [ ] リソース (リスナ、タイマー、接続) が**必ず解放**されるか
- [ ] CPU バウンド処理を**Worker** に逃がしているか

## 関連

- [[Performance]]
- [[State-Management]]
- [[Error-Handling]]
- [[Observability]]
- [[../30-Interface/Loading-States]]

## 深掘り

- *Java Concurrency in Practice* by Brian Goetz (古典)
- Rob Pike, *Concurrency is not Parallelism*
- *The Rust Programming Language* (concurrency chapter)
- Node.js Event Loop documentation
