---
tags: [skill, coding, operations]
domain: coding
level: intermediate
---

# 観測性 (Observability)

## 一行で

> 観測性とは「**外側から内部状態を推論できる度合い**」。テストできない本番環境を**説明可能にする**ための装備。

## なぜ重要か

本番障害は「**再現できない**」のが普通です。観測性が無いと:
- 障害が起きていることに**気づかない**
- 原因の**当たりがつかない**
- 直したつもりが**直っていない**

観測性は事故対応の速度を桁で変えます。MTTR (平均復旧時間) はビジネス指標。

## 三本柱: Metrics / Logs / Traces

### Metrics (時系列の数値)

集約された数値。低コスト、長期保存、ダッシュボード向き。
- リクエスト数、レイテンシ p50/p95/p99
- エラー率
- CPU/メモリ/ディスク
- ビジネス指標 (注文数、登録数)

ツール: Prometheus, Datadog, CloudWatch。

### Logs (個別イベント)

「いつ何が起きたか」の記録。詳細だがコスト高。
- 構造化ログ (JSON) で検索可能に
- ログレベル: DEBUG < INFO < WARN < ERROR < FATAL
- **PII (個人情報) を出さない**

```json
{"ts":"2026-05-02T10:15:32Z","level":"ERROR","trace_id":"abc","msg":"payment failed","order_id":42,"reason":"insufficient_funds"}
```

ツール: ELK, Loki, Datadog, CloudWatch Logs。

### Traces (リクエストの追跡)

1 リクエストが**サービスを横断**して走った経路と各段階の時間。マイクロサービスの障害特定に必須。

```
[Frontend 10ms] → [API Gateway 5ms] → [User Service 30ms] → [DB 200ms] ← 遅い!
                                  ↘ [Auth Service 15ms]
```

ツール: Jaeger, Tempo, Datadog APM, OpenTelemetry。

## 構造化ログのベストプラクティス

### キーを統一

全サービスで同じキー名:
- `ts` (タイムスタンプ ISO8601)
- `level`
- `msg` (人間向け短文)
- `trace_id`, `span_id` (Trace と紐付け)
- `user_id`, `request_id` などビジネス文脈

### コンテキストを伝播

リクエスト開始時に `request_id` / `trace_id` を発行し、**全ログに自動付与**。後で grep で全関連ログを集められる。

```ts
logger.info("payment processed", {
  trace_id: ctx.traceId,
  user_id: user.id,
  amount_cents: amount,
});
```

### ログレベルの使い分け

- **DEBUG**: 開発時の詳細、本番では出さない
- **INFO**: 通常の動作 (リクエスト処理、ジョブ完了)
- **WARN**: 異常だが継続可能 (リトライ、フォールバック発動)
- **ERROR**: 失敗、要調査
- **FATAL**: プロセス停止

INFO を出しすぎると**コストとノイズ**で逆に見えなくなる。サンプリングを検討。

## Metrics の RED と USE

### RED (リクエスト指向サービス)

- **R**ate: 単位時間あたりのリクエスト数
- **E**rrors: エラー数
- **D**uration: レイテンシ分布 (p50/p95/p99)

API・マイクロサービスで第一に取る指標。

### USE (リソース指向)

- **U**tilization: 使用率
- **S**aturation: 飽和度 (キュー長等)
- **E**rrors: エラー数

ホスト・データストア・ネットワーク等のリソース監視。

## SLI / SLO / SLA

| | 意味 | 例 |
|---|---|---|
| **SLI** | 計測する指標 | 99.5% のリクエストが 200ms 以下 |
| **SLO** | 内部目標 | SLI を 99.9% で達成 |
| **SLA** | 顧客との契約 | 99% 未達なら返金 |

SLO を**エラーバジェット**で運用: 月 0.1% (= 約 43 分) の停止までは許容、超えたら新機能を止めて安定化に集中。

## アラートの設計

### 良いアラート

- **対応可能** (受け取った人が何かできる)
- **緊急** (放置できない)
- **シグナル/ノイズ比が高い**

### アラート疲れ

低品質アラートを放置するとチームが**全アラートを無視**するようになる。

対策:
- アラートを**症状ベース**に (「CPU 90%」より「ユーザーが影響を受けている」)
- ランブック (対応手順) をリンク
- 鳴らない週があったら「鳴らないこと自体が異常?」を疑い、スモークテストを仕込む

## Tracing の実装

OpenTelemetry が事実上の標準。コードに**手動 span**:

```ts
const tracer = trace.getTracer("orders");

await tracer.startActiveSpan("processOrder", async (span) => {
  span.setAttribute("order_id", order.id);
  try {
    await chargePayment(order);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw err;
  } finally {
    span.end();
  }
});
```

主要ライブラリ (HTTP, DB, Queue) は**自動計装**で済むことが多い。

## エラートラッキング

Sentry / Rollbar / Bugsnag。
- 例外を**集約・重複排除**
- リリースバージョン・ブレッドクラム・ユーザー情報
- 影響ユーザー数で**優先順位付け**

## RUM (Real User Monitoring)

実ユーザーのブラウザから**Core Web Vitals** を回収。Lighthouse スコアと実態の乖離を埋める。

→ [[../40-Bridge/Performance-as-UX]]

## ダッシュボード設計

- **目的別**: サービス健全性、ビジネス指標、SRE 等を分ける
- **黄金信号** (Golden Signals): Latency, Traffic, Errors, Saturation
- 異常が**即座に目に入る**配置 (色・大きさ)
- ノイズを削る ― 全部入りダッシュボードは見られない

## ポストモーテム

事故後に**非難なし** (blameless) で分析:

1. タイムライン: 起きた・気づいた・対応した・解消した
2. 影響範囲
3. 根本原因 (5 Whys)
4. 「次回防ぐためのアクション」(担当・期限つき)
5. 「次回**気づきを早めるための**アクション」 ← 観測性向上の機会

## アンチパターン

- ログがフリーテキストで**grep しかできない**
- リクエスト ID が**伝播せず**サービス間で追えない
- メトリクスは取っているが**誰も見ない**
- アラートが多すぎて**全部 mute**
- 本番で初めて挙動が分かる (canary/shadow デプロイなし)
- ログに**個人情報・トークン**を出力

## チェックリスト

- [ ] **構造化ログ**が共通スキーマで統一されているか
- [ ] `trace_id` がリクエスト全体で**伝播**するか
- [ ] **RED** メトリクスが主要サービスで取れているか
- [ ] **SLO** が定義され、エラーバジェットで運用されているか
- [ ] アラートに**ランブック**がリンクされているか
- [ ] エラートラッキングが導入されているか
- [ ] ログに **PII/シークレット** が混入していないか
- [ ] ポストモーテムが**blameless** に運用されているか

## 関連

- [[Error-Handling]]
- [[Performance]]
- [[API-Design]]
- [[Security]]
- [[../40-Bridge/Performance-as-UX]]

## 深掘り

- *Site Reliability Engineering* (Google SRE Book)
- Cindy Sridharan, *Distributed Systems Observability*
- OpenTelemetry documentation
