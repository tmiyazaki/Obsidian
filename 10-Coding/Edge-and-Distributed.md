---
tags: [skill, coding, edge, distributed]
domain: coding
level: advanced
---

# エッジコンピューティングと分散システム

## 一行で

> 「**ユーザーに近い**」場所で計算する設計。集中型クラウドを前提とした思考から脱却すると、レイテンシ・コスト・可用性が変わる。

## なぜ重要か

東京のデータセンターから地球の裏側までは**往復 250ms**。エッジでは**5ms**。Web Vitals (INP, LCP) はミリ秒単位の戦い。

エッジコンピューティングが向く:
- 静的・準静的コンテンツ配信
- 簡単な動的処理 (パーソナライズ、A/B、認証)
- レイテンシ敏感な API
- グローバル展開

向かない:
- ステートフルな重い計算
- 大規模 DB アクセス
- ML 推論(モデル次第)

## エッジで動くもの

### Cloudflare Workers / Vercel Edge / Deno Deploy

V8 隔離環境で 0ms cold start。50ms CPU 制限。

```ts
export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    const cache = caches.default;
    const cached = await cache.match(req);
    if (cached) return cached;

    const res = await fetch("https://origin.example.com" + new URL(req.url).pathname);
    ctx.waitUntil(cache.put(req, res.clone()));
    return res;
  }
};
```

### AWS Lambda@Edge / CloudFront Functions

CloudFront のエッジで実行。

### Fastly Compute@Edge

WASM ベース。低レイテンシ・高 CPU。

### Akamai EdgeWorkers / Netlify Edge

ホスティング各社が提供。

## 主要なユースケース

### 1. 認証・認可の前置き

```ts
// エッジで認証 → orgin に届く前にブロック
const token = req.headers.get("Authorization");
if (!verifyJWT(token)) return new Response("Unauthorized", { status: 401 });
```

オリジン保護 + レイテンシ削減。

### 2. A/B テスト

```ts
const bucket = hash(userId) % 100;
const variant = bucket < 50 ? "A" : "B";
const html = await fetchOrigin(variant);
return new Response(html);
```

cookie 検査と origin 切替を**エッジで完結**。

### 3. パーソナライズ

国 / 言語 / デバイスでコンテンツを変える:

```ts
const country = req.cf?.country;
const html = await fetchOrigin(`/home?country=${country}`);
```

CDN キャッシュキーに国を含めて、各国ごとに**準静的**に保つ。

### 4. 画像変換

URL パラメタで動的リサイズ・フォーマット変換:

```
/img/photo.jpg?w=400&fmt=webp
```

エッジで変換 + キャッシュ。Cloudflare Images, Vercel Image Optimization, imgix。

### 5. レート制限

```ts
const ip = req.headers.get("CF-Connecting-IP");
const count = await env.RATE.get(ip) ?? 0;
if (Number(count) > 100) return new Response("Too Many", { status: 429 });
await env.RATE.put(ip, String(Number(count) + 1), { expirationTtl: 60 });
```

DDoS 緩和を**オリジン到達前**に。

## エッジの制約

- **CPU 時間 50ms** 程度
- **メモリ 128MB** 程度
- **Cold start ほぼゼロ**(V8 isolate)だが、初回アクセスは origin pull が必要
- **Node.js API の一部しか使えない**(File System なし、TCP socket 限定)
- **Stateful な接続の維持が困難**

複雑な処理は origin、ライト処理はエッジ、と**役割分担**する。

## エッジ + KV / D1 / R2

エッジと組み合わせて使うストレージ:

| サービス | 種類 | ユース |
|---|---|---|
| **KV** (Cloudflare) | 結果整合 KV | フィーチャーフラグ、設定 |
| **D1** | エッジ SQLite | 軽量 DB |
| **DO** (Durable Objects) | 状態を持つアクター | チャット、リアルタイム |
| **R2** | オブジェクトストレージ (S3 互換) | 画像・動画 |
| **Vercel KV / Upstash Redis** | エッジ Redis | キャッシュ・セッション |
| **Vercel Postgres / Neon** | サーバレス Postgres | 通常 DB |
| **Turso** | エッジ SQLite (libSQL) | リード重視 DB |

エッジ DB は**書き込みが弱い**(普通リージョン集約)、**読み込みは強い**(各エッジで複製)。

## CAP 定理と分散システム

```
Consistency  : 全ノードが同じデータを返す
Availability : 全リクエストに応答
Partition tolerance : ネットワーク分断に耐える

→ ネットワーク分断時、CかAのどちらか諦める
```

実プロダクトでは **AP (Available, Partition tolerant) で結果整合性** が多い。
銀行系は **CP (Consistent, Partition tolerant)** を選ぶ。

## 一貫性モデル

| モデル | 強さ | 例 |
|---|---|---|
| Strong (Linearizable) | 最強 | Spanner, etcd |
| Sequential | | |
| Causal | | |
| Eventual | 弱 | DNS, 多くの NoSQL |

「**結果整合性**」(Eventually Consistent) は**いずれ収束する**。書き込み直後の読み取りで古い値が返ることがある。
ユーザーには**自分の書き込みは即座に見える**(Read-Your-Writes 一貫性)ことが多い。

## 分散システムの落とし穴 (Fallacies)

> "The 8 Fallacies of Distributed Computing" — Peter Deutsch

開発者が**間違って前提**しがちなこと:

1. ネットワークは信頼できる
2. レイテンシはゼロ
3. 帯域は無限
4. ネットワークはセキュア
5. トポロジは変わらない
6. 管理者は一人
7. 転送コストはゼロ
8. ネットワークは均質

これらは**全部嘘**。エッジ + 分散では特に意識する。

## Replication と Sharding

### Replication (複製)

同じデータを**複数ノード**に。
- 読み込み分散、可用性向上
- 書き込み伝播の遅延 (replication lag)

### Sharding (分割)

データを**分割して別ノード**に。
- 容量・書き込みスループット拡大
- クロスシャードクエリが困難

両者を組み合わせる(各シャードに replicas)のが大規模システムの定型。

## 分散トランザクション

複数サービスにまたがる「全部 or なし」操作:

### 2-Phase Commit (2PC)

調整役がすべての参加者に**準備 → コミット**を順次。
- ブロッキング、調整役のSPOF
- マイクロサービスでは**避ける**

### Saga パターン

長期トランザクションを**ローカル取引 + 補償**で構成:

```
1. 注文作成 (補償: 注文取消)
2. 在庫引当 (補償: 在庫戻し)
3. 課金 (補償: 返金)
```

途中失敗 → 補償操作で**前のステップを巻き戻す**。

### Outbox Pattern

DB 書き込みと**メッセージ送信**の整合性を担保:

```
1. tx 開始
2. ビジネスデータ書き込み
3. outbox テーブルにイベント記録
4. tx commit
5. 別プロセスが outbox を読んで MQ にパブリッシュ
```

DB と MQ の**二重書き込み**問題を回避。

## メッセージキュー

非同期処理の中核:

| キュー | 強み |
|---|---|
| **Kafka** | 高スループット、ログベース、再生可能 |
| **RabbitMQ** | 柔軟なルーティング |
| **Redis Streams** | 軽量 |
| **AWS SQS / SNS** | マネージド、シンプル |
| **Google Pub/Sub** | グローバル、強整合 |
| **Cloudflare Queues** | エッジ統合 |

設計の要点:
- **冪等性**(同メッセージが複数回届きうる)
- **順序保証**(必要なら partition key で揃える)
- **デッドレターキュー**(失敗の捕捉)

## サーキットブレーカ

→ [[Error-Handling]]

下流が壊れているときに**自分も道連れにならない**:

```
Closed (通常) → Open (拒否) → Half-Open (試験) → Closed
```

エッジから複数サービスを呼ぶときに必須。

## オブザーバビリティの分散版

→ [[Observability]]

- **trace_id** をリクエスト全体で伝播
- 各サービスが span を発行
- Jaeger / Tempo / Datadog APM で**可視化**

「どこで時間を使っているか」を**サービス境界で**追える。

## 多リージョン

- **Active-Active**: 全リージョン書き込み可、競合解消が必要
- **Active-Passive**: 1 リージョンに書き込み、他は読み込みレプリカ
- **Geo-Partitioned**: ユーザー所在地のリージョンを**主**に

レイテンシ・規制(データ residency)・障害耐性のトレードオフ。

## 開発・運用

- **Local-first 開発** (ローカルで動かない/再現できないなら設計悪い)
- **Chaos Engineering** (本番に近い形で**故意に壊す**) → [[../40-Bridge/Resilience-Chaos]] (今後)
- **段階的ロールアウト** (1% → 10% → 50% → 100%)
- **観測性ファースト** (デプロイ前に**観測できる**ことを確認)

## アンチパターン

- 「**ネットワークは信頼できる**」と仮定
- リージョン障害を考えない
- マイクロサービスを**理由なく**(複雑度爆発)
- エッジで重い計算
- 結果整合性なのに**強整合性想定**で UI 設計
- 分散トランザクションを 2PC で
- メッセージの**冪等性**を担保せず
- trace_id 伝播なしで**何が遅いか**分からない

## チェックリスト

- [ ] レイテンシ要件で**エッジ vs オリジン**を判断したか
- [ ] CAP のどちらを選んだか**意識的**か
- [ ] 結果整合性を **UI で見せられる**か
- [ ] **冪等性**が必要な場所で保証されているか
- [ ] サーキットブレーカ + リトライがあるか
- [ ] **trace_id** 伝播があるか
- [ ] リージョン障害時の**フェイルオーバ**手順があるか

## 関連

- [[API-Design]]
- [[Caching-Strategies]]
- [[Performance]]
- [[Database-Design]]
- [[Concurrency-Async]]
- [[CI-CD]]
- [[Observability]]
- [[Error-Handling]]
- [[../40-Bridge/Performance-as-UX]]
- [[../40-Bridge/Sustainability]]

## 深掘り

- *Designing Data-Intensive Applications* by Martin Kleppmann
- *Site Reliability Engineering* (Google SRE Book)
- Cloudflare Workers documentation
- Vercel Edge Functions documentation
- *The Log* by Jay Kreps (LinkedIn)
