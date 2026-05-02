---
tags: [skill, coding, fundamentals]
domain: coding
level: basic
---

# 命名 (Naming)

## 一行で

> 名前は**最も読まれるドキュメント**であり、設計判断そのもの。命名の不明瞭さは設計の不明瞭さ。

## なぜ重要か

良い名前はコメントを不要にし、読み手のワーキングメモリを節約します。逆に、悪い名前は読み手が**実装を読んで意図を逆算**するコストを毎回支払わせます。

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

## 中核となる原理

### 1. 抽象化レベルを揃える

同じスコープに `userId`, `db`, `mu` (mutex), `i` が混在すると、読み手は階層を頭の中で再構築する必要があります。**変数の生存範囲が長いほど名前は具体的に**、短いほど短く。

```ts
for (let i = 0; i < users.length; i++) { ... }   // i は OK (3行内で完結)
let i = 0;                                        // クラスメンバの i は禁止
```

### 2. 意図 > 実装

```ts
// ❌ 実装ベース
const list = users.filter(u => u.lastLogin < cutoff);

// ✅ 意図ベース
const inactiveUsers = users.filter(u => u.lastLogin < cutoff);
```

### 3. 単位・型を埋め込む

物理量・通貨・時間は**単位の取り違え**で本番事故が起きます。

```ts
const timeout = 30;                  // ❌ 秒? ミリ秒?
const timeoutMs = 30_000;            // ✅
const priceCents = 1499;             // ✅ (USD と JPY を混ぜない)
const distanceKm = 4.2;              // ✅
```

### 4. 真偽値は質問形

```ts
isActive, hasPermission, canEdit, shouldRetry
```

否定形 (`isNotEmpty`) は二重否定で混乱するので避ける。

### 5. 集合の単複を厳密に

```ts
user      // 単数
users     // 配列
usersById // インデックス (Record<string, User>)
```

### 6. 動詞は副作用を示唆する

| パターン | 意味 |
|---|---|
| `get*` / `find*` | 取得 (副作用なし、`find` は無くても OK) |
| `fetch*` | 非同期取得 (ネットワーク等) |
| `set*` / `update*` | 状態を変える |
| `to*` / `as*` | 純粋変換 |
| `is*` / `has*` / `can*` | 真偽値判定 |

## 実践

### ドメイン語彙を採用する

業務側で「**注文 (Order)**」と呼ぶものを、コードで「Transaction」と呼ばない。**ユビキタス言語**を維持することで、会話とコードの往復コストが消える。

### 略語は禁則ではないが、慎重に

- 業界標準 (`HTTP`, `URL`, `DB`) は OK
- ローカル略 (`usr`, `cnt`, `idx`) は寿命短いスコープのみ
- 同じものを 2 通りに略さない (`cust` と `client` 混在は地獄)

### 命名のリファクタリング

「いい名前が思いつかない」= 「責任が定義できていない」のサイン。**まずクラス/関数の責任を 1 文で書いてみる**。書けないなら分割する。

## アンチパターン辞典

| 名前 | 何が悪いか |
|---|---|
| `data`, `info`, `manager` | 何も語っていない |
| `processData()` | 「データ」「処理する」両方曖昧 |
| `Helper`, `Utils` | ゴミ箱になりやすい |
| `flag`, `tmp` | 寿命が長くなった瞬間に詰む |
| `getUser2()` | 旧版を残してリファクタを諦めた跡 |

## チェックリスト

- [ ] 関数名から**戻り値が想像**できるか
- [ ] 変数名は**スコープの長さ**に見合う具体性か
- [ ] 同じ概念を**複数の名前**で呼んでいないか
- [ ] 単位/通貨/時間は名前に埋まっているか
- [ ] 真偽値は質問形か

## 関連

- [[Clean-Code]]
- [[../40-Bridge/Naming-as-Design]]
- [[Refactoring]]
