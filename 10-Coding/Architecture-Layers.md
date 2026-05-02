---
tags: [skill, coding, architecture]
domain: coding
level: advanced
---

# アーキテクチャレイヤと依存方向

## 一行で

> **依存は内側へ流れる**。ビジネスルールはフレームワークに依存せず、その逆である。

## なぜ重要か

長寿命なソフトウェアでは、**フレームワーク・DB・UI ライブラリは交換される**が、**ビジネスルールは交換されない**。これらが密結合だと、フレームワーク移行のたびにドメインロジックを書き直す羽目になります。

## 同心円(Clean / Hexagonal / Onion)

```
       ┌──────────────────────────────┐
       │  Frameworks & Drivers        │  ← Web, DB, CLI, FS
       │  ┌────────────────────────┐  │
       │  │  Interface Adapters    │  │  ← Controller, Repository impl
       │  │  ┌──────────────────┐  │  │
       │  │  │  Use Cases       │  │  │  ← アプリ固有のフロー
       │  │  │  ┌────────────┐  │  │  │
       │  │  │  │  Entities  │  │  │  │  ← 普遍的なビジネスルール
       │  │  │  └────────────┘  │  │  │
       │  │  └──────────────────┘  │  │
       │  └────────────────────────┘  │
       └──────────────────────────────┘

依存方向: ←(外側が内側に依存。逆は禁止)
```

## 各層の責任

| 層 | 何を持つ | 何に依存して**よいか** |
|---|---|---|
| Entities | ビジネスの普遍ルール (`Order` の不変条件など) | 標準ライブラリのみ |
| Use Cases | アプリ固有のフロー (注文を確定する手順など) | Entities |
| Interface Adapters | 入出力変換 (HTTP→Use Case 引数, DB→Entity) | Use Cases, Entities |
| Frameworks | 具体的な技術 (Express, PostgreSQL) | すべて |

**逆向き依存(内側→外側)は禁止**。これを守るために**依存性逆転 (DIP)** を使う:

```ts
// Use Case は IF にだけ依存する
interface OrderRepository { save(o: Order): Promise<void>; }
class PlaceOrder { constructor(private repo: OrderRepository) {} ... }

// Adapter で実装(外側)
class PostgresOrderRepository implements OrderRepository { ... }
```

## なぜこの形にすると変更が楽になるか

- **DB を Postgres → DynamoDB** に変えても、外側の Adapter だけ書き換える
- **フレームワークを Express → Fastify** に変えても、Use Case は無傷
- **テスト** で Use Case を**実 DB なし**に検証できる(InMemoryRepo を差せばよい)

## ヘキサゴナル (Ports & Adapters) の見方

```
       UI Adapter            Test Driver
            │                     │
            ▼                     ▼
       ┌────────────────────────────┐
       │           Domain           │   ← Ports = 抽象 IF
       └────────────────────────────┘
            ▲                     ▲
            │                     │
       DB Adapter           HTTP Client Adapter
```

「内側にとっての**入力**を Driver Port、内側にとっての**出力**を Driven Port」と呼び、すべての外部接点が**抽象を介する**。テスト時は Driver/Driven を **fake で差し替える**だけでドメインを単独実行できる。

## 軽量な現実解 — 必ずしも 4 層ではなくてよい

小規模アプリで 4 層を律儀に切ると過剰設計になります。**変更頻度の差**を観測し、変わるものと変わらないものの**境界だけ**を引くのが現実的:

```
src/
  domain/       (entities + use cases — フレームワーク非依存)
  adapters/     (db, http, queue 実装)
  app/          (フレームワーク起動、DI 配線)
```

## 危険信号

- `import` 行が**ドメインからフレームワークを参照**している
- ドメインのテストに**実 DB を起動**する必要がある
- Controller が **SQL を直書き**している
- Use Case の関数シグネチャに `Request`/`Response` が現れる

## CQRS / Event Sourcing との関係

- **CQRS**: 読み (Query) と書き (Command) で**別モデル**を持つ。読みは画面に最適化された投影、書きは整合性に最適化された集約。
- **Event Sourcing**: 状態を直接保存せず**イベントの列**を真実とし、現在状態は再生で得る。監査・時系列分析・リプレイに強い。

両者は強力だが運用コストが高い。**書き込みと読み込みのモデル要件が大きく乖離**するときに導入を検討。

## チェックリスト

- [ ] ドメインが**フレームワークを import していない**
- [ ] テストが**実外部依存なしに**走る
- [ ] 外部技術の交換が**1 アダプタの差し替え**で済む
- [ ] 層を跨ぐ`型変換ポイント`が明示されている

## 関連

- [[SOLID-Principles]]
- [[Design-Patterns]]
- [[Testing-Strategy]]
- [[Error-Handling]]

## 深掘り

- Robert C. Martin, *Clean Architecture*
- Alistair Cockburn, *Hexagonal Architecture*
- Vaughn Vernon, *Implementing Domain-Driven Design*
