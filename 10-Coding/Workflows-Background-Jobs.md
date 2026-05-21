---
tags: [skill, coding, jobs, workflows]
domain: coding
level: advanced
---

# ワークフローとバックグラウンドジョブ

## 一行で

> 「**HTTP リクエストの中で完結しない仕事**」をどう扱うか。**信頼性**と**観測可能性**を保ちながら長期非同期処理を回す。

## なぜ重要か

実プロダクトでは**リクエスト時間内に完了しない**処理が多数:
- メール送信
- PDF 生成
- 動画エンコード
- AI 推論バッチ
- 大量データのインポート / エクスポート
- 決済の sub-process
- 多段階ビジネスフロー (注文 → 出荷 → 配達)

雑な実装は:
- 失敗時に**消える**
- 重複実行
- 順序エラー
- スケール時の**詰まり**

## 階層

```
1. setTimeout / setInterval        ─ プロセス内、消えやすい
2. Cron                            ─ 定時、単純
3. Message Queue                    ─ 非同期、永続
4. Job Queue (BullMQ / Sidekiq)    ─ リトライ、優先度
5. Workflow Engine                  ─ 多段階、長期、状態管理
6. Saga                             ─ 分散トランザクション
```

下層ほど信頼性高、複雑度高。要件で選ぶ。

## Job Queue

### BullMQ (Node.js)

Redis ベース、最も普及:

```ts
import { Queue, Worker } from "bullmq";

const queue = new Queue("emails");
await queue.add("welcome", { userId: 123 });

new Worker("emails", async (job) => {
  await sendEmail(job.data);
}, { connection });
```

機能:
- リトライ + バックオフ
- 優先度
- 遅延ジョブ
- スケジューラ
- 進捗追跡
- ダッシュボード (BullBoard)

### 他の選択肢

| | 特徴 |
|---|---|
| **Sidekiq** (Ruby) | Rails の定番 |
| **Celery** (Python) | Django/Flask 統合 |
| **AWS SQS / GCP Pub/Sub** | マネージド、スケール |
| **Cloudflare Queues** | エッジ統合 |
| **Inngest** | サーバレス、TypeScript |
| **Trigger.dev** | コード中心、開発者向け |
| **Hatchet** | オープン、ワークフロー対応 |

## Workflow Engine

単発 Job でなく**多段階の処理**:

```
注文受付 → 在庫引当 → 課金 → 出荷指示 → 配達追跡 → 完了通知
```

各ステップで**失敗・遅延・人間介入**が起きる。

### Temporal

最も成熟したワークフローエンジン (Uber 由来):

```ts
import { proxyActivities } from "@temporalio/workflow";

const { sendEmail, chargeCard, shipOrder } = proxyActivities({
  startToCloseTimeout: "5 minutes",
});

export async function placeOrder(order: Order) {
  await chargeCard(order.payment);
  await shipOrder(order.items);
  await sendEmail(order.email, "shipped");
}
```

Temporal の魔法:
- ワークフローコードは**通常の TS**
- 失敗・再起動でも**続きから再開** (event sourcing)
- 数日・数週間にわたるフローを記述可能
- 観測可能性が標準装備

### 他の選択肢

| | 特徴 |
|---|---|
| **AWS Step Functions** | 視覚的、AWS 統合 |
| **Azure Durable Functions** | Azure 統合 |
| **Cadence** (Uber 旧) | Temporal の前身 |
| **Inngest** | TS、シンプル、サーバレス |
| **Restate** | 新興、永続実行 |
| **Mastra** | AI ワークフロー特化 |

## 設計パターン

### 1. 冪等性 (Idempotency)

→ [[API-Design]]

ジョブが**複数回実行されうる**前提:

```ts
async function chargeCard(order: Order) {
  // 既に処理済みならスキップ
  const existing = await db.charges.findByIdempotencyKey(order.id);
  if (existing) return existing;

  const charge = await stripe.charges.create({
    idempotency_key: order.id,
    ...
  });
  await db.charges.create({ idempotencyKey: order.id, ... });
  return charge;
}
```

### 2. リトライとバックオフ

```ts
{
  attempts: 5,
  backoff: { type: "exponential", delay: 1000 },
  // 1s → 2s → 4s → 8s → 16s
}
```

ジッタを加える(同期再試行を避ける)。

### 3. デッドレターキュー (DLQ)

リトライ尽きた失敗を**別キュー**へ:

```
Job 失敗 → Retry x N → 失敗 → DLQ へ移動
DLQ をモニタ → 人間が確認・再処理 or 破棄
```

「消えた・気付かなかった」を防ぐ。

### 4. Outbox Pattern

→ [[Edge-and-Distributed]]

DB 書き込みとメッセージ送信の整合性:

```
1. tx 開始
2. ビジネスデータ書き込み
3. outbox テーブルに「次に送るメッセージ」記録
4. tx commit
5. 別プロセスが outbox を読んで queue にパブリッシュ
```

### 5. Saga

→ [[Edge-and-Distributed]]

```
1. 注文作成 (補償: 注文取消)
2. 在庫引当 (補償: 在庫戻し)
3. 課金 (補償: 返金)
```

ステップ失敗 → 前ステップを**補償操作**で巻き戻す。

### 6. Fan-out / Fan-in

```
親 Job → 子 Job × N → 全完了で次へ
```

並列処理、Map-Reduce 的に。

### 7. Scheduled / Cron

```ts
queue.add("daily-report", {}, { repeat: { cron: "0 9 * * *" } });
```

ただし**多重起動**に注意(複数インスタンスから cron が走る)。
分散ロックが要る (Redlock 等)。

## 進捗の観測

### ジョブの状態

```
queued → active → succeeded
              ↓
           failed → retrying
              ↓
              dead
```

すべての遷移をログ + メトリクス。

### ユーザー向け進捗

→ [[../30-Interface/Loading-States]]

```
[ ✓ 受付完了 ]
[ ⏳ ファイル変換中... 45% ]
[ ○ 配信 ]
```

長時間ジョブは**完了通知**で UX を支える。

→ [[../30-Interface/Notifications]]

## Webhook 受信

外部からのイベント (Stripe, GitHub, ...):

```
1. ペイロード受信
2. 署名検証(改ざん防止)
3. 即座に 200 を返す(タイムアウト回避)
4. 処理は**ジョブキューへ**
```

```ts
app.post("/webhook/stripe", async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret);
  await queue.add("process-stripe-event", event);
  res.status(200).send();
});
```

Webhook は**何度も来る**前提(冪等処理必須)。

## Cron の分散実行

複数インスタンスで動いていると cron が**多重発火**:

```ts
const lock = await redis.set("cron-daily", "locked", "NX", "EX", 60);
if (!lock) return;  // 他インスタンスが実行中
await runDailyJob();
```

または専用スケジューラ (Temporal, BullMQ Scheduler) を使う。

## バッチ処理の最適化

100 万件のインポート等:

- **Chunking**: 1000 件ずつ
- **並列度制限**: 10 ワーカー以内
- **リトライ単位**: chunk ごと(全失敗回避)
- **進捗保存**: 中断 → 再開できる
- **メモリ管理**: ストリーム処理

→ [[Performance]]

## サーバレス vs 常駐

| | 強み | 弱み |
|---|---|---|
| **常駐ワーカー** | 起動オーバーヘッドなし | スケール手動 |
| **サーバレス** (Lambda) | 自動スケール | コールドスタート |
| **エッジ** (CF Workers) | 低レイテンシ | 50ms CPU 制約 |

短時間の大量ジョブはサーバレス、長時間処理は常駐。

## AI ジョブの特殊性

→ [[../30-Interface/AI-LLM-Interfaces]] / [[Embeddings-RAG]]

- LLM 呼び出しは**長時間**(数秒〜分)
- レート制限を**プロバイダ側**で食らう
- コスト追跡
- ストリーミング応答
- リトライ時の冪等性 (同回答 ≠ 同入力)

専用ツール: Inngest (AI flows), Mastra, LangChain SDK の RunnableLambda。

## マルチテナンシー

→ [[Multi-tenancy]]

各テナントのジョブを**分離**:
- 別キュー or 別ワーカー
- リソースクォータ
- 優先度

ノイジーネイバー対策。

## アンチパターン

- ジョブ失敗を**ログだけ**(誰も気付かない)
- リトライ無制限で**外部 API を破壊**
- 冪等でない処理をリトライ
- DLQ なし → 失敗ジョブが**消える**
- Webhook をリクエスト内で処理 → タイムアウト
- Cron が**多重発火**(分散ロックなし)
- ワークフロー状態を**自前 DB で管理**して破綻
- 進捗が**ユーザーに見えない**

## チェックリスト

- [ ] 各ジョブが**冪等**か
- [ ] **リトライ + バックオフ**戦略があるか
- [ ] DLQ + 監視があるか
- [ ] Webhook 処理は**ジョブ化**されているか
- [ ] Cron が**分散環境**でも安全か
- [ ] 進捗が**ユーザー / 運用者**に見えるか
- [ ] 長期ワークフローは**Workflow Engine**を検討したか
- [ ] テナント分離(マルチテナント時)があるか

## 関連

- [[API-Design]]
- [[Concurrency-Async]]
- [[Edge-and-Distributed]]
- [[Database-Design]]
- [[Observability]]
- [[Error-Handling]]
- [[Multi-tenancy]]
- [[Reactive-Signals]]
- [[../30-Interface/Loading-States]]
- [[../30-Interface/Notifications]]
- [[../30-Interface/AI-LLM-Interfaces]]
- [[../40-Bridge/Site-Reliability-Engineering]]

## 深掘り

- Temporal documentation (temporal.io)
- BullMQ / Sidekiq / Celery documentation
- *Designing Data-Intensive Applications* by Martin Kleppmann (queues)
- Maxim Fateev (Temporal CEO) の講演
- AWS Step Functions / Azure Durable Functions guides
- Inngest / Trigger.dev blogs
