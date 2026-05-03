---
tags: [skill, coding, database]
domain: coding
level: advanced
---

# データベース設計

## 一行で

> スキーマは「**変更が最も困難なコード**」。最初の選択が**プロダクトの寿命**を縛る。

## なぜ重要か

アプリのコードは書き換えられても、**データは生き続ける**。スキーマ変更は本番データの移行を伴い、ロールバックが難しく、ダウンタイムを生む。データベース設計は **長期的な意思決定**であり、後悔の量を最も決める領域。

## モデル選択

### Relational (PostgreSQL, MySQL)

- 強い整合性 (ACID)
- 関係 (JOIN) で表現
- 成熟、エコシステム豊富
- 大半のアプリの**第一選択**

### Document (MongoDB, DynamoDB)

- ネスト構造を 1 ドキュメントで保存
- スキーマレス (柔軟だが規律が必要)
- 関係をまたぐクエリは弱い

### Key-Value (Redis, Memcached)

- 高速、単純
- キャッシュ、セッション、レートリミット

### Graph (Neo4j, Neptune)

- 関係そのものが中心 (ソーシャル、知識グラフ)

### Columnar / OLAP (BigQuery, Snowflake, ClickHouse)

- 集計クエリ最適化
- データウェアハウス、分析

### Search (Elasticsearch, OpenSearch, Meilisearch)

- 全文検索、ファセット
- → [[../30-Interface/Search-UX]]

### Vector (pgvector, Pinecone, Weaviate)

- 埋め込みベクトル検索 (LLM/RAG)

**現実**: 大半のサービスは PostgreSQL から始めるべき。スケールや特殊要件で他を**追加**する (置き換えではなく)。

## 正規化と非正規化

### 正規化 (Normalization)

- **1NF**: 各セル単一値
- **2NF**: 主キー全体に依存
- **3NF**: 推移依存なし

正規化の利点: 重複なし、矛盾しにくい、書き込みが小さい。
欠点: JOIN が増えると遅い。

### 非正規化 (Denormalization)

意図的に重複を許す。読み込み最適化のため。
- 集計済みカウント (`postCount`)
- スナップショット (注文時の住所、価格)
- マテリアライズドビュー

**鉄則**: まず**正規化で書き**、計測してから非正規化で**最適化**する。「いつか必要」での非正規化は腐敗のもと。

## 正しいデータ型を選ぶ

| 用途 | 型 |
|---|---|
| ID | `bigint` / `uuid` (auto-incr の整数より分散しやすい) |
| お金 | `decimal(10,2)` または整数 (cents) - 浮動小数は禁止 |
| 日時 | `timestamptz` (タイムゾーン付き) |
| メール | `varchar(255)` + CHECK 制約 |
| 列挙 | `text` + CHECK or `enum` (移行コスト注意) |
| ブール | `boolean` |
| JSON | `jsonb` (PostgreSQL は強力) |

「とりあえず VARCHAR(255)」は将来の事故源。**意味のある型・制約**を最初から。

## 制約 (Constraints)

データベースで強制できる不変条件は**アプリで再発明しない**:

```sql
CREATE TABLE orders (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  status text NOT NULL CHECK (status IN ('pending','paid','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key)
);
```

- `NOT NULL` で空欠を防ぐ
- `CHECK` で値の範囲を制約
- `UNIQUE` で重複を防ぐ
- `FOREIGN KEY` で参照整合性
- `DEFAULT` で省略時の値

アプリのバグでも DB が**最後の砦**になる。

## インデックス

### 基本

- 主キー: 自動
- 外部キー: 多くの DB で**自動ではない** ─ JOIN 性能のため明示
- WHERE 句で頻繁に検索される列
- ソート / GROUP BY 列

### 複合インデックス

```sql
CREATE INDEX ON orders(user_id, created_at DESC);
```

「先頭から使う」(prefix match) のため、列順が重要:
- `(a, b)` で `WHERE a = ?` は使える
- `(a, b)` で `WHERE b = ?` は使えない (a の指定が必要)

### 部分インデックス・式インデックス

```sql
CREATE INDEX ON orders(user_id) WHERE status = 'paid';
CREATE INDEX ON users(lower(email));
```

頻出パターン専用に小さく作る。

### 罠

- インデックス過多 → 書き込み遅い、ストレージ増
- カーディナリティ低い列 (`is_active`) は単独で効果薄
- `NOT EQUAL`, 関数適用, 暗黙型変換 でインデックス無効化

`EXPLAIN ANALYZE` で**実際の実行計画**を見る習慣。

## トランザクション

### ACID

- **A**tomic: 全部 or 全部なし
- **C**onsistent: 制約を保つ
- **I**solated: 並行実行が干渉しない
- **D**urable: コミット後は永続

### 分離レベル

| 分離レベル | Dirty Read | Non-repeatable | Phantom |
|---|---|---|---|
| Read Uncommitted | × 起きる | × | × |
| Read Committed (デフォルト) | ✓ 防ぐ | × | × |
| Repeatable Read | ✓ | ✓ | × |
| Serializable | ✓ | ✓ | ✓ |

Postgres は Read Committed が既定。**お金や予約**のような重要操作は `SERIALIZABLE` または明示ロック (`SELECT FOR UPDATE`) を検討。

### 楽観 vs 悲観ロック

- **楽観**: バージョン列で「変わってたら失敗」 (Etsy 流)
- **悲観**: ロックして他を待たせる

Web の多くは**楽観ロック**で十分。

## マイグレーション

→ [[../40-Bridge/Migrations-as-Product]] で詳細

スキーマ変更は**ダウンタイムなし**で行う:
1. 新列を追加 (NULL 許可)
2. アプリが**両方読める**ようにデプロイ
3. データを埋める (バックフィル)
4. アプリが**新列を書き、新列を読む**ようにデプロイ
5. 旧列を削除

DROP COLUMN を一発でやらない (古いアプリインスタンスが落ちる)。

## N+1 問題

```ts
const users = await db.select("*").from("users");
for (const u of users) {
  u.orders = await db.select("*").from("orders").where("user_id", u.id);
}
// → users 1 回 + orders N 回 = N+1 クエリ
```

対策: JOIN, `WHERE id IN (...)`, ORM の `include` / `eager loading`, DataLoader。

## ソフトデリート vs ハードデリート

- **ハードデリート**: `DELETE` でレコード消滅
- **ソフトデリート**: `deleted_at` 列で論理削除

ソフトデリートの罠:
- すべてのクエリに `WHERE deleted_at IS NULL` を**忘れずに**書く必要
- ユニーク制約が崩れる (削除済み行と重複可能)
- データが永遠に残る (GDPR 削除権と矛盾)

→ 削除を「業務上のキャンセル」と区別。**監査が必要なら別テーブルに移す**ほうがクリーン。

## イベントソーシングと CQRS

→ [[Architecture-Layers]]

- **Event Sourcing**: 状態を保存せず**イベント列**を真実に
- **CQRS**: 読み込みと書き込みのモデルを分離

監査・時系列分析・複雑な読み取り要件で有効。**通常の CRUD アプリには過剰**。

## 安全性

- **準備済みステートメント** (パラメタライズ) でインジェクション防止 → [[Security]]
- 機密列の暗号化 (`pgcrypto`)
- バックアップと**復旧テスト** (取れているだけでは意味がない)
- 接続数制限 (Pooler を介す)

## アンチパターン

- 全列 `varchar(255)`、すべて nullable
- 外部キー無し ("速いから" 一時的に外して戻さない)
- インデックスが**1 つもない**または**全列にある**
- ソフトデリートを書き忘れた WHERE
- マイグレーションが**手動 SQL**(Git に残らない)
- 本番で `SELECT *` を多用 (列追加で予期せぬ転送量)
- お金を `float` で保存
- タイムゾーン不明な `timestamp`
- N+1 を放置

## チェックリスト

- [ ] 主要列に**適切な型と制約**があるか
- [ ] 外部キーに**インデックス**があるか
- [ ] お金・時刻が**安全な型**か (decimal/timestamptz)
- [ ] マイグレーションが**バージョン管理**され**ダウンタイムなし**で適用できるか
- [ ] 重要操作のトランザクション分離レベルが**意識的**に選ばれているか
- [ ] N+1 / `SELECT *` / インデックス過不足 がないか
- [ ] バックアップ + 復旧テストが回っているか

## 関連

- [[API-Design]]
- [[Architecture-Layers]]
- [[Performance]]
- [[Security]]
- [[Observability]]
- [[../40-Bridge/Migrations-as-Product]]

## 深掘り

- *Designing Data-Intensive Applications* by Martin Kleppmann
- *SQL Antipatterns* by Bill Karwin
- *Database Internals* by Alex Petrov
- Use The Index, Luke (https://use-the-index-luke.com/)
