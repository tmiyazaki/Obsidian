---
tags: [skill, coding, paradigm]
domain: coding
level: intermediate
---

# 関数型プログラミングのコア

## 一行で

> FP の核心は「**純粋性**」「**不変性**」「**合成**」。言語を選ばず、**OOP の中でも**この 3 つを取り入れるだけでバグは大幅に減る。

## なぜ重要か

「関数型 vs オブジェクト指向」は対立ではなく**補完**です。FP の原則は:
- **テスト可能性**を上げる (純粋関数は入力 → 出力だけ)
- **並行性のバグ**を構造的に防ぐ (不変性は競合しない)
- **読みやすさ**を上げる (副作用が局所化)

OOP 言語 (TS, Java, C#) でも FP の手法は採用できる。**全部 FP にする必要はない**。

## 中核となる 4 概念

### 1. 純粋関数 (Pure Functions)

同じ入力で**常に同じ出力**を返し、**副作用を持たない**。

```ts
// 純粋: 入力だけで決まる
const add = (a: number, b: number) => a + b;

// 不純: 外部状態を読む
let total = 0;
const addToTotal = (n: number) => { total += n; return total; };

// 不純: 副作用 (IO, DOM, ログ等)
const fetchUser = async (id: string) => fetch(`/users/${id}`);
```

**純粋関数の利点**:
- テストが trivial (モック不要)
- メモ化可能
- 並列化可能
- 推論しやすい

**現実の戦略**: 副作用は完全には消せない (IO 必須)。**コア → ピュア / 端 → 副作用** に押し出す (Functional Core, Imperative Shell)。

### 2. 不変性 (Immutability)

オブジェクトを直接変更せず、**新しいオブジェクト**を作る:

```ts
// ❌ 破壊的
arr.push(x);
obj.name = "new";

// ✅ 非破壊
const newArr = [...arr, x];
const newObj = { ...obj, name: "new" };
```

**利点**:
- 過去の状態を**保持できる** (Undo, タイムトラベルデバッグ)
- 共有されても**競合しない**
- React の参照比較が機能する

**コスト**: 一見、コピーが多くてメモリ食いそうだが、**構造共有** (Persistent Data Structures, Immer) で実用的。

### 3. 第一級関数と高階関数

関数を**値として**渡す/返す。

```ts
// 高階関数: 関数を返す
const greet = (greeting: string) => (name: string) => `${greeting}, ${name}`;
const hello = greet("Hello");
hello("World"); // "Hello, World"

// 高階関数: 関数を受け取る
arr.filter(isEven).map(double).reduce(sum, 0);
```

`map / filter / reduce` を使い**ループを宣言的に**書く ─ FP の入り口。

### 4. 合成 (Composition)

小さな関数を組み合わせて大きな関数にする。

```ts
const pipe = <T>(...fns: Array<(x: T) => T>) =>
  (input: T): T => fns.reduce((acc, fn) => fn(acc), input);

const slugify = pipe<string>(
  (s) => s.toLowerCase(),
  (s) => s.trim(),
  (s) => s.replace(/\s+/g, "-")
);
slugify("  Hello World  "); // "hello-world"
```

**継承より合成**: OOP でも標語だが、FP では関数自体を組み合わせる。

## 実用的なテクニック

### map / filter / reduce

```ts
const total = orders
  .filter((o) => o.status === "paid")
  .map((o) => o.amount)
  .reduce((sum, n) => sum + n, 0);
```

ループ + 一時変数を**消す**。意図が読める。

### currying

引数を 1 つずつ受け取る形に。**部分適用**ができる。

```ts
const add = (a: number) => (b: number) => a + b;
const inc = add(1);
inc(5); // 6
```

### immutable update helpers

ネスト深いオブジェクトの更新に Immer:

```ts
import produce from "immer";
const next = produce(state, (draft) => {
  draft.users[42].name = "Alice"; // 安全に書き換え可
});
```

実際は内部で**新しい構造**を生成する。

### Option / Maybe (null 安全)

`null/undefined` の連鎖を型で表す:

```ts
type Option<T> = { kind: "some"; value: T } | { kind: "none" };
const map = <T, U>(o: Option<T>, f: (t: T) => U): Option<U> =>
  o.kind === "some" ? { kind: "some", value: f(o.value) } : o;
```

TypeScript の `?.` (Optional Chaining) は同等の効果。

### Either / Result (エラー型)

→ [[Error-Handling]] で詳述。

## 副作用の隔離 (Functional Core, Imperative Shell)

```
┌─────────────────────────────────┐
│   Imperative Shell              │  IO, DB, HTTP
│   ┌───────────────────────┐    │
│   │  Functional Core      │    │  純粋ロジック
│   │  (純粋関数の塊)         │    │
│   └───────────────────────┘    │
└─────────────────────────────────┘
```

ビジネスロジックは純粋関数だけで記述、外側の薄い殻が IO を扱う。
**テストの 9 割を純粋関数で**書ける = 速い、信頼できる。

## OOP との橋渡し

OOP のクラスは「**メソッドが第一引数 this を取る関数の束**」。FP の純粋関数は「**this を持たない関数**」。両者は技術的には等価だが、**思考の中心**が違う。

- OOP: 「**何が**」(オブジェクト)を中心に考える
- FP: 「**どう変換するか**」(関数)を中心に考える

ドメインオブジェクトを持ちつつ、**業務ルールを純粋関数**で書くハイブリッドが現代的。

## 関数型言語の系譜と影響

- **Lisp** (1958): 第一級関数、リスト処理
- **ML / OCaml**: 強い型推論、代数的データ型
- **Haskell**: 純粋関数型、モナド、遅延評価
- **Erlang**: アクター、フォールトトレラント
- **Clojure**: JVM の Lisp、不変データ構造
- **Scala / F#**: マルチパラダイム
- **Rust**: 所有権・代数的データ型 (FP からの影響大)

これらの**思想は他の言語に流れ込んでいる**: TypeScript の type narrowing, Java の Stream API, C# の LINQ。

## アンチパターン

- すべてを 1 行の `pipe` に詰める (デバッグ困難)
- 純粋性に固執して**現実の IO を避ける**
- `reduce` を**常に**使う (`for...of` のほうが読みやすい場面も)
- 不変性のオーバーヘッドを**測定せず** Immer 多用
- カリー化を**全関数に**適用 (型推論が崩れる)
- モナドの議論で**入門者を脱落**させる

## チェックリスト

- [ ] 業務ロジックは**純粋関数**で書けているか
- [ ] 副作用が**端 (Shell)** に押し出されているか
- [ ] 状態を破壊的に変更していないか
- [ ] `map / filter / reduce` で**意図**を表現しているか
- [ ] テストがモック地獄になっていないか (= ロジックが純粋でない兆候)

## 関連

- [[Clean-Code]]
- [[State-Management]]
- [[Error-Handling]]
- [[Concurrency-Async]]
- [[Testing-Strategy]]

## 深掘り

- Eric Normand, *Grokking Simplicity*
- Scott Wlaschin, *Domain Modeling Made Functional*
- Bartosz Milewski, *Category Theory for Programmers* (深い理論)
- Gary Bernhardt, *Boundaries* talk
