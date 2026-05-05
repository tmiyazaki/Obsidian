---
tags: [skill, coding, types, schema]
domain: coding
level: advanced
---

# Schema-Driven な型安全スタック

## 一行で

> 「**1 つのスキーマ**から型・バリデーション・ドキュメント・SDK を**全部生成**」する設計。手作業同期を消し、信頼を上げる。

## なぜ重要か

伝統的に分離されていた:
- 型定義 (TypeScript)
- ランタイム検証 (Joi / Yup)
- API ドキュメント (Swagger)
- クライアント SDK (手書き or OpenAPI generator)
- DB スキーマ (SQL)

これらが**ずれる**と、コードと API、DB、ドキュメントが嘘をつき始めます。

Schema-Driven は「**1 ヶ所で書いて全部に反映**」を目指す現代的アプローチ。Zod / Effect Schema / ArkType / Valibot の隆盛がそれを支えています。

## なぜ Zod なのか (代表)

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(["admin", "user"]),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;       // ← 型が自動生成
const parsed = UserSchema.parse(unknown);     // ← 実行時検証
const safe = UserSchema.safeParse(unknown);   // ← Result 風
```

**1 定義 → 型 + 検証 + (ドキュメント生成)**。

→ [[Type-Systems-and-DDD]]

## ライブラリ比較

| ライブラリ | 特徴 |
|---|---|
| **Zod** | 最も人気、エコシステム最大 |
| **Valibot** | 軽量(tree-shaking 強)、Zod 互換 API |
| **ArkType** | TS 構文をそのまま、超高速 |
| **Effect Schema** | Effect-TS 統合、強力 |
| **TypeBox** | JSON Schema 互換 |
| **Yup** | 古い、レガシー |

選択基準:
- **新規プロジェクト** → Zod (一般) or Valibot (バンドル重視)
- **Effect-TS 採用** → Effect Schema
- **OpenAPI 連携重視** → TypeBox / Zod + zod-openapi

## End-to-End Type Safety

「**フロントとバックの型が一致**」を保証する:

### tRPC (TS-only)

```ts
// server
export const router = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => db.users.find(input.id)),
});

// client (型が直接見える)
const user = await trpc.getUser.query({ id: "..." });
//    ^ User 型が自動推論
```

サーバとクライアントが**同じリポジトリ**にあれば最強。Hono RPC, oRPC も同系統。

### OpenAPI + 型生成

クライアントが**別言語**(iOS/Android, 外部開発者)なら OpenAPI が標準:

```ts
// Zod → OpenAPI 仕様生成
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

const UserSchema = z.object({
  id: z.string().uuid().openapi({ example: "..." }),
});

// → OpenAPI YAML を生成
// → orval / openapi-typescript で型と SDK 生成
```

→ [[API-Design]]

### GraphQL

```graphql
type User {
  id: ID!
  email: String!
}
```

スキーマからクライアント・サーバ両方の型生成 (graphql-codegen)。
新規採用は減少傾向だが既存大規模で根強い。

## DB との連携

### Drizzle ORM (型ファースト)

```ts
const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
});

const result = await db.select().from(users).where(eq(users.id, "..."));
//    ^ 型が完全に推論される
```

DB スキーマ = TS 定義。**マイグレーションも生成**。

### Prisma

```prisma
model User {
  id    String @id
  email String @unique
}
```

`prisma generate` で型 + クライアント生成。学習曲線は緩いが**生のクエリ**が必要な場合に制限。

### Kysely

クエリビルダ。型は厳密だが SQL に近い。

→ [[Database-Design]]

## Form 連携

```ts
const FormSchema = z.object({
  email: z.string().email("メール形式で"),
  password: z.string().min(8, "8 文字以上"),
});

// React Hook Form
const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
});

// エラーメッセージは Zod のメッセージから
```

**スキーマ = フォーム = API リクエスト** が一致。

→ [[../30-Interface/Forms-and-Input]]

## Server Actions (React 19+)

```tsx
// server action
"use server";
async function createUser(formData: FormData) {
  const parsed = UserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error };
  // ...
}

// client
<form action={createUser}>
  <input name="email" />
  <button>送信</button>
</form>
```

サーバとクライアント境界が**シームレス**。Next.js / Remix が採用。

→ [[Modern-Web-Platform]]

## 環境変数の検証

```ts
const env = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().default(3000),
}).parse(process.env);

// env.DATABASE_URL は string、型推論
```

起動時に検証して**早期失敗**。`.env` の typo で本番が無言で壊れない。

→ [[Error-Handling]] / [[CI-CD]]

## エラー処理 (Result 型)

```ts
const result = UserSchema.safeParse(input);
if (!result.success) {
  return { ok: false, error: result.error };
}
return { ok: true, value: result.data };
```

例外でなく Result。`.flatten()` で UI に流せる形に。

→ [[Error-Handling]]

## Effect-TS という選択肢

```ts
import { Effect, pipe } from "effect";
import * as S from "@effect/schema/Schema";

const UserSchema = S.struct({
  email: S.String.pipe(S.email()),
});

const program = pipe(
  fetchUser(id),
  Effect.flatMap((u) => S.decodeUnknown(UserSchema)(u)),
  Effect.tap(Effect.log),
  Effect.catchAll((e) => Effect.succeed(defaultUser)),
);
```

長所:
- 関数型エラーハンドリング
- 副作用の型レベル管理
- 並行制御・リソース管理
- ZIO (Scala) の系譜

短所: 学習曲線急、TypeScript の枠を超える書き方。

「**例外もエラーも副作用も型で**」管理したいプロジェクト向け。

→ [[Functional-Programming]]

## メリット集計

```
1 スキーマで:
  → 型 (TypeScript)
  → ランタイム検証
  → API ドキュメント (OpenAPI / GraphQL Schema)
  → クライアント SDK
  → フォーム検証
  → DB スキーマ (Drizzle/Prisma)
  → モックデータ生成 (zod-mock 等)
  → サンプルレスポンス
```

**手作業同期がゼロ**。バグの大半が**コンパイル時**に発見される。

## ガード

スキーマの中央集権化は**便利だが過度な依存**にも:
- ライブラリの**メジャーバージョンアップ**でスキーマ全部書き直し
- 巨大スキーマで**ビルド時間爆増**
- スキーマが**ドメイン以外の懸念**(UI バリデーション、API メッセージ)で膨れる

対策:
- 役割別にスキーマ分割 (`UserDomainSchema`, `UserApiSchema`, `UserFormSchema`)
- 必要に応じて**変換** (`UserDomainSchema.transform(toApi)`)
- ライブラリ依存は**抽象**を介す (Repository パターン)

## アンチパターン

- 同じデータに**3 つの型定義**(API, Form, DB バラバラ)
- ランタイム検証**なし**で API レスポンスを信用
- **型キャスト**(`as User`)を多用
- フォームバリデーション**だけ**Zod、API は素のまま
- 環境変数の検証なし
- スキーマ重複(同じ User が 5 ヶ所に)
- 巨大なジェネリクスで**読めない**

## チェックリスト

- [ ] スキーマが**1 ヶ所**に定義されているか
- [ ] **API 境界**でランタイム検証しているか
- [ ] フロント/バック/DB で**型が一致**しているか
- [ ] **環境変数**を起動時に検証しているか
- [ ] スキーマの変更が**型エラーで波及**するか
- [ ] スキーマの**役割分割**(Domain/API/Form/DB)があるか
- [ ] **手作業同期**(JSON Schema 手書き等)が排除されているか

## 関連

- [[Type-Systems-and-DDD]]
- [[API-Design]]
- [[Database-Design]]
- [[Error-Handling]]
- [[State-Management]]
- [[Functional-Programming]]
- [[Modern-Web-Platform]]
- [[../30-Interface/Forms-and-Input]]
- [[../40-Bridge/Tool-Stacks-Recipes]]

## 深掘り

- Zod documentation (zod.dev)
- Effect-TS documentation (effect.website)
- *Type-Driven Development with Idris* by Edwin Brady
- Theo Browne の TypeScript 動画
- Drizzle / Prisma / Kysely のドキュメント
