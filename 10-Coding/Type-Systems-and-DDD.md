---
tags: [skill, coding, types, ddd]
domain: coding
level: advanced
---

# 型システムとドメインモデリング

## 一行で

> 型は「**コンパイラを通すための注釈**」ではなく、「**ドメインのルールをコードで表現する手段**」。型に書けるなら、テストに書く必要が減る。

## なぜ重要か

ドメインルールが**散らばって**いると、新人は仕様を**コードを読み歩いて**復元する必要があります。良い型システムでは:

- 「**起こりえない状態**」が型レベルで**作れない**
- 関数シグネチャが**契約**になる(コメント不要)
- リファクタが**機械的に追跡**される
- バグの大半が**コンパイル時に**見つかる

「型は厳密にすればするほど安全で、緩めるほど柔軟」── このトレードオフを**設計判断**として扱う。

## 型を「設計」として使う

### 1. Branded Type (型エイリアスの強化)

```ts
type UserId = string & { readonly _brand: "UserId" };
type Email  = string & { readonly _brand: "Email" };

function getUser(id: UserId): User { ... }

const id: UserId = "abc" as UserId;     // 明示変換が必要
getUser("abc");                          // ❌ コンパイルエラー
```

「**ID とメールが同じ string**」を防ぐ。実行時オーバーヘッドゼロ。

### 2. Discriminated Union (タグ付き和)

```ts
type Result<T, E> =
  | { kind: "ok"; value: T }
  | { kind: "error"; error: E };

function handle(r: Result<User, Error>) {
  if (r.kind === "ok") {
    r.value;   // ← User として narrowing
  } else {
    r.error;   // ← Error として narrowing
  }
}
```

「ok と error の両方を持つ状態」が**作れない**。網羅性チェックも効く:

```ts
function handle(r: Result<User, Error>) {
  switch (r.kind) {
    case "ok": return r.value;
    case "error": throw r.error;
    // default: const _: never = r; ← 新ケース追加で必ずエラー
  }
}
```

### 3. State Machine を型で

→ [[State-Management]]

```ts
type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

`isLoading && data` のような不可能状態を**型で消す**。

### 4. Newtype による単位

```ts
type Cents     = number & { readonly _: "Cents" };
type Yen       = number & { readonly _: "Yen" };
type DistanceKm = number & { readonly _: "DistanceKm" };

function totalUSD(items: { priceCents: Cents }[]): Cents { ... }
```

通貨や単位の取り違えで本番事故が起きる。型で**取り違いを禁止**。

### 5. 不正な値を作れない型

```ts
type NonEmptyArray<T> = [T, ...T[]];
type EmailAddress = string & { readonly _: "Email" };

function sendEmail(to: NonEmptyArray<EmailAddress>): void { ... }
```

「空配列の宛先」を呼び出し側が**書けない**。

### 6. Smart Constructor

検証付きの**唯一の生成手段**:

```ts
class Email {
  private constructor(public readonly value: string) {}

  static parse(input: string): Result<Email, "INVALID"> {
    if (!/^[^@]+@[^@]+$/.test(input)) return { kind: "error", error: "INVALID" };
    return { kind: "ok", value: new Email(input) };
  }
}

// new Email(...) 不可、Email.parse(...) のみ
```

## DDD の中心 — ユビキタス言語と型

→ [[../40-Bridge/Naming-as-Design]]

ドメインの語彙(`Order`, `Payment`, `Refund`)を**そのまま型名**に。

```ts
class Order {
  private constructor(
    public readonly id: OrderId,
    public readonly status: OrderStatus,
    public readonly lines: NonEmptyArray<OrderLine>,
  ) {}
  // 状態遷移はメソッドで明示
  cancel(reason: string): Result<Order, CancelError> { ... }
}
```

「`Order` を**直接インスタンス化**できる」状況は危険。コンストラクタを privateにし、ファクトリで**整合性を保証**する。

## 集約 (Aggregate)

ドメイン内で**一貫した変更単位**:

```ts
class Order {            // 集約ルート
  private lines: OrderLine[]; // 内部
  addLine(p: Product, qty: Quantity) {
    // ライン追加 + 合計再計算 を**同時に**行う
  }
}
```

外部から `OrderLine` を直接いじらせない ─ ルートが整合性を守る。

## 値オブジェクト (Value Object)

不変、等値判定が値で:

```ts
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency,
  ) { Object.freeze(this); }

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("currency mismatch");
    return new Money(this.amount + other.amount, this.currency);
  }
}
```

`Money` は ID を持たない、値が同じなら同じもの。Address, Range, Coordinate 等も同様。

## エンティティ (Entity)

ID で同一性が決まる:

```ts
class User {
  constructor(public readonly id: UserId, ...) {}
  // 同じ ID なら同じユーザー(中身が変わっても)
}
```

## ドメインイベント

「**何が起きたか**」を値として表現:

```ts
type DomainEvent =
  | { type: "OrderPlaced"; orderId: OrderId; at: Date }
  | { type: "PaymentSucceeded"; orderId: OrderId; amount: Money; at: Date }
  | { type: "OrderShipped"; orderId: OrderId; trackingId: string; at: Date };
```

`Order.cancel()` がイベント `OrderCancelled` を返し、ハンドラが副作用を起こす ─ ドメインロジックを**純粋**に保つ手法。

→ [[Functional-Programming]]

## レイヤとの関係

→ [[Architecture-Layers]]

```
Entities (型 + 値オブジェクト + 集約)        ← フレームワーク非依存
   ↑
Use Cases (型を使ったドメインロジック)
   ↑
Adapters (DB Row → Entity への変換、boundary)
```

DB の Row はドメイン型ではない。**Adapter で変換**する。Drizzle / Prisma の生成型をそのまま domain で使うと結合が強まりすぎる。

## TypeScript の高度機能

### Conditional Types

```ts
type IsArray<T> = T extends any[] ? true : false;
type X = IsArray<string[]>; // true
```

### Mapped Types

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T>  = { [K in keyof T]?: T[K] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

### Template Literal Types

```ts
type CSSVar<K extends string> = `var(--${K})`;
type Color = CSSVar<"primary" | "secondary">; // "var(--primary)" | "var(--secondary)"
```

API のルートを型で表現するなど、**文字列のドメイン**も型化可能。

### satisfies (TS 4.9+)

```ts
const config = {
  primary: "#1976D2",
  secondary: "#FFA726",
} satisfies Record<string, `#${string}`>;
// 型は推論されたまま、制約だけかかる
```

## Zod / Valibot で実行時検証

型は静的、I/O は動的。境界で**検証 + 型化**:

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof UserSchema>;

const parsed = UserSchema.parse(unknownInput);   // 失敗時 throw
// or safeParse で Result 型
```

**1 ヶ所の定義で型 + 検証**が同時に得られる。`tRPC`, `next-safe-action` の基盤。

## トレードオフ

### 強い型のコスト

- 学習曲線(チームの平均が高くないと書けない)
- 短期実装速度低下
- ライブラリの型サポートに依存

### 緩い型のコスト

- 実行時バグ
- リファクタが手探り
- ドキュメント役割の喪失

「**コア(ビジネスロジック)は厳密、境界は緩く検証**」が現実解。

## アンチパターン

- `any` の濫用
- すべて `string | number | null` ですべての ID
- ドメイン型が DB の Row と**完全一致**(orm の型をそのまま使う)
- 100 個のジェネリクスで何でも作る型パズル
- 型だけで業務ルールを表現しようとして**読めない**
- TS の型を**実行時にも信じる**(検証なしで API レスポンスを使う)

## チェックリスト

- [ ] ドメインの主要概念に**専用の型**があるか
- [ ] 不可能な状態が**型で排除**されているか
- [ ] I/O 境界で**実行時検証**しているか
- [ ] 値オブジェクト・エンティティ・集約の区別があるか
- [ ] `any` を**理由なく**使っていないか
- [ ] 型の複雑度が**読み手に追える**範囲か

## 関連

- [[SOLID-Principles]]
- [[Architecture-Layers]]
- [[Functional-Programming]]
- [[Error-Handling]]
- [[State-Management]]
- [[API-Design]]
- [[Database-Design]]
- [[../40-Bridge/Naming-as-Design]]

## 深掘り

- Scott Wlaschin, *Domain Modeling Made Functional*
- Eric Evans, *Domain-Driven Design*
- Vaughn Vernon, *Implementing Domain-Driven Design*
- *Type-Driven Development with Idris* by Edwin Brady
- Effective TypeScript by Dan Vanderkam
