---
tags: [skill, coding, api]
domain: coding
level: intermediate
---

# API 設計

## 一行で

> API は「**他者が頼って動く契約**」。一度公開された形は**長く生き続ける**ため、変えやすさより**最初の意思決定**が重い。

## なぜ重要か

API は内部関数と違い、**呼び出し側を破壊できる強さ**を持ちます。クライアントが社外、別プロダクト、SDK 配布まで広がると、変更コストは指数的に膨らみます。良い API は:

- **学べる** (推測で正しく使える)
- **誤用しにくい** (型・必須・順序で防ぐ)
- **進化できる** (壊さずに育てられる)

## 設計の型

### REST

リソース指向。HTTP メソッドの意味論に乗る。

```
GET    /users          一覧
GET    /users/:id      取得
POST   /users          作成
PUT    /users/:id      置換
PATCH  /users/:id      部分更新
DELETE /users/:id      削除
```

長所: HTTP インフラ(キャッシュ、CDN、認可)に乗りやすい、学習コスト低。
短所: 「リソースで表現しづらい操作」が苦手 (`/users/:id/activate` など)。

### GraphQL

クライアントが**必要なフィールド**を指定。1 リクエストで複数リソース取得。

長所: オーバーフェッチ/アンダーフェッチを解消、強い型システム。
短所: キャッシュが複雑、N+1 を呼びやすい (DataLoader 必須)、認可がフィールド単位。

### gRPC / tRPC

スキーマ駆動 RPC。型が**端末まで貫通**。

長所: 高性能、ストリーミング、型安全。
短所: ブラウザ直接利用は難しい (gRPC Web 経由)、デバッグツールが REST 比少。

### イベント駆動 (Webhook, Event Stream)

「相手から通知される」設計。Pub/Sub, Kafka, Webhook。

長所: 疎結合、リアルタイム。
短所: 順序保証・重複・冪等性の設計が必要。

**選択基準**: 内部マイクロサービス間 → gRPC、Web/モバイルクライアント → REST or GraphQL、長時間処理結果通知 → Webhook。

## REST の実用ルール

### 1. リソース命名

- **複数形**で統一 (`/users`, `/orders`)
- ネストは**2 階層まで** (`/users/:id/orders`)
- 動詞をパスに入れない (`/getUser` は ✗)

### 2. ステータスコード

| 範囲 | 意味 |
|---|---|
| 2xx | 成功 |
| 3xx | リダイレクト |
| 4xx | クライアントエラー(直すのは呼び出し側) |
| 5xx | サーバーエラー(直すのはサーバー) |

主要コード:
- `200 OK`, `201 Created`, `204 No Content`
- `400 Bad Request`, `401 Unauthorized` (未認証), `403 Forbidden` (権限不足), `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Too Many Requests`
- `500 Internal`, `502 Bad Gateway`, `503 Unavailable`

### 3. エラーボディ標準化 (RFC 7807 Problem Details)

```json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "残高不足",
  "status": 422,
  "detail": "残高 $5 では $10 を引き出せません",
  "instance": "/accounts/42/withdrawals",
  "trace_id": "abc-123"
}
```

クライアントが**プログラム的に分岐できる**フィールド (`type`, `code`) と、人が読む `detail` を両方含める。

### 4. ページネーション

| 方式 | 強み | 弱み |
|---|---|---|
| Offset (`?page=2`) | 簡単、ジャンプ可能 | データ追加で重複/欠落、深いページ重い |
| Cursor (`?after=xyz`) | 安定、無限スクロール向き | ジャンプ不可 |
| Keyset | 安定、高速 | 実装少し複雑 |

書き込みが頻繁なリソースは **Cursor** が安全。

### 5. フィルタ・ソート・スパース

```
GET /users?status=active&sort=-createdAt&fields=id,name,email
```

過剰取得を抑える小技。GraphQL を使わない理由のひとつにもなる。

## 進化させやすい API

### 1. バージョニング

- **URL** (`/v1/users`): 明示的、CDN/ルーティングが楽
- **Header** (`Accept: application/vnd.api+json; version=1`): URL を汚さない
- **デフォルトはどれか統一**

major バージョンは**並行運用期間**を設けてから旧版を停止。

### 2. 後方互換のルール (拡張可、削除不可)

| 操作 | 互換 |
|---|---|
| 新フィールド追加 | ◎ |
| オプショナルパラメタ追加 | ◎ |
| 既存フィールドの**意味変更** | ✗ |
| フィールド削除 | ✗ |
| 必須パラメタ追加 | ✗ |
| エラーコード変更 | ✗ |

### 3. Sunset Header

廃止予定エンドポイントに:

```
Sunset: Sat, 31 Dec 2026 23:59:59 GMT
Deprecation: true
Link: <https://api.example.com/v2/users>; rel="successor-version"
```

クライアントが**機械的に検知**できる。

## 冪等性

同じリクエストを**何度送っても同じ結果**:

- `GET`, `PUT`, `DELETE` は本質的に冪等
- `POST` は冪等でない → **冪等キー**で補強

```
POST /payments
Idempotency-Key: 7e8f1a-uuid

→ サーバーは Key を覚え、再送に対し前回の結果を返す
```

決済・予約など**重複が致命的**な操作で必須。

## レートリミット

```
X-RateLimit-Limit:     1000
X-RateLimit-Remaining: 42
X-RateLimit-Reset:     1714600000
Retry-After:           30
```

429 を返すだけでなく、**いつ復活するか**を示す。クライアントは指数バックオフ + ジッター。

## 認証と認可

- **API キー**: 機械間、ローテーション必須、漏洩時即失効
- **OAuth 2.0**: ユーザー代理操作、scope で権限を細粒度化
- **JWT**: 自己完結トークン、短命 + リフレッシュ
- **mTLS**: 内部通信、強い相互認証

`Authorization: Bearer <token>` が標準。クエリパラメタにトークンは禁止 (ログ漏洩)。

## ドキュメンテーション

- **OpenAPI / GraphQL Schema**: コードと同期、SDK 自動生成
- **実例リクエスト/レスポンス**を必ず載せる
- **エラーケース**を網羅
- **Postman Collection / Insomnia Workspace** で試せる

ドキュメントが古びると API 信頼が崩壊。**スキーマファースト**または**実装から自動生成**で乖離を防ぐ。

## アンチパターン

- 動詞をパスに (`/getUser`, `/deleteOrder`)
- すべて 200 で返し、ボディ内 `{success: false}` で失敗を示す
- `null` と「フィールド不在」が**両方とも別の意味**で使われる
- 必須/任意がドキュメントから読めない
- 「同じ操作」が**v1 と v2 で異なる挙動**
- ページネーション無しの一覧 API
- バルク削除に取り消し無し

## チェックリスト

- [ ] リソース命名が一貫しているか (複数形、ネスト深さ)
- [ ] エラーが**機械処理可能**な構造を持つか
- [ ] **冪等性**が必要な操作で保証されているか
- [ ] バージョニング戦略があるか
- [ ] レートリミットを適切に伝えているか
- [ ] OpenAPI/Schema が**最新**か
- [ ] 認証方式が用途に適しているか

## 関連

- [[Architecture-Layers]]
- [[Error-Handling]]
- [[Security]]
- [[Observability]]
- [[Documentation-as-Product]]

## 深掘り

- Mark Massé, *REST API Design Rulebook*
- *Google API Design Guide*
- *Microsoft REST API Guidelines*
- Zalando RESTful API Guidelines
