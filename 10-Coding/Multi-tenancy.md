---
tags: [skill, coding, saas, architecture]
domain: coding
level: advanced
---

# マルチテナンシー (Multi-tenancy)

## 一行で

> 複数の顧客 (テナント) が**同じインフラ**を共有する設計。「**テナント間で見えてはならない**」を**機械的に**保証する。

## なぜ重要か

B2B SaaS では「**1 つのアプリで複数組織**」が当たり前。雑な実装は:
- **データ漏洩**(他社の情報が見える)
- パフォーマンスの**ノイジーネイバー**問題
- スケール時の**全テナント停止**

良い設計は:
- セキュリティを**コードでなくスキーマで**保証
- テナント増加で**線形にスケール**
- カスタマイズと標準の**バランス**

## 分離モデル

### 1. Single Tenant (専用環境)

各テナントに**専用のインスタンス + DB**:

```
[ Tenant A ] → DB-A (専用)
[ Tenant B ] → DB-B (専用)
```

長所: 完全分離、強いセキュリティ、カスタマイズ自由
短所: 運用コスト × テナント数、デプロイ複雑

エンタープライズ要件 (規制業種、データ residency) で必要。

### 2. Shared DB / Shared Schema (Row-Level)

すべてのテナントが**同じ DB・同じテーブル**を共有、`tenant_id` で区別:

```sql
SELECT * FROM users WHERE tenant_id = $current_tenant;
```

長所: 運用シンプル、コスト効率高
短所: 全クエリに `WHERE tenant_id` 必須、漏洩リスク

最も一般的だが**条件忘れ**で事故を呼びやすい。

### 3. Shared DB / Schema-per-Tenant

DB は同じだが**スキーマ(名前空間)が別**:

```
db/
├── tenant_a.users
├── tenant_a.orders
├── tenant_b.users
└── tenant_b.orders
```

中規模 SaaS で人気。Postgres の schema や MySQL の database 機能で実現。

### 4. Hybrid

ティアによって変える:
- 大企業 → Single Tenant
- 中小 → Schema-per-Tenant
- 個人/小規模 → Shared Schema

Salesforce, AWS のような大規模 SaaS が採用。

## Row-Level Security (RLS)

「**条件を忘れる**」を**機械的に防ぐ**仕組み。Postgres の機能:

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

接続時にセッション変数を設定:

```sql
SET app.tenant_id = '...';
```

以降、そのセッションは**自動で** `tenant_id` フィルタが効く。`WHERE` を書き忘れても**他テナントは見えない**。

Supabase はこの RLS を中核に据えている。

## アプリレイヤでの保護

RLS だけに頼らず、**アプリでも検証**:

```ts
class TenantScopedRepo<T> {
  constructor(private tenantId: string) {}

  find(id: string): Promise<T | null> {
    return db.query("SELECT * FROM table WHERE id = ? AND tenant_id = ?", [id, this.tenantId]);
  }
}
```

Repository / Service レイヤで**`tenantId` を必須引数**に。グローバル DB 直接アクセスを禁止。

→ [[Architecture-Layers]] / [[Type-Systems-and-DDD]]

### Branded Type で **誤代入を防ぐ**

```ts
type TenantId = string & { _: "TenantId" };
type UserId   = string & { _: "UserId" };

function getOrders(tenantId: TenantId): Promise<Order[]> { ... }
getOrders(userId);   // ❌ コンパイルエラー
```

→ [[Type-Systems-and-DDD]]

## テナント識別

リクエストから**現在のテナント**をどう決めるか:

### 1. サブドメイン

```
tenant-a.example.com
tenant-b.example.com
```

URL に出る、**カスタムドメイン**もマップ可能。

### 2. パス

```
example.com/tenant-a/...
example.com/tenant-b/...
```

ドメイン分割しないため、シンプル。

### 3. JWT クレーム

```json
{ "sub": "user-123", "tenant_id": "tenant-a" }
```

クライアントが指定不要、サーバが信頼するトークンに含める。

### 4. ヘッダ

```
X-Tenant-Id: tenant-a
```

API では一般的。**信頼できるソース**(認証済みユーザーの所属) から導出。

ユーザーが**複数テナントに所属**するなら、UI で切替 + クッキー or 状態保存。

## 共有リソースとカスタマイズ

```
全テナント共有:        ベース DB スキーマ、コアロジック
テナント別:            データ、設定、ブランディング
カスタム可能:          機能フラグ、アクセス制御、限定機能
```

**カスタマイズの境界**を明確に。「お客様要望でコードを直書き分岐」は破滅の入口。

### Feature Flag

→ [[CI-CD]]

テナント別に有効化:

```ts
if (flags.isEnabled("advanced-export", { tenant: tenantId })) {
  return <AdvancedExport />;
}
```

LaunchDarkly, Unleash, ConfigCat。

### 設定 (Configuration)

```ts
const config = await tenantConfig.get(tenantId);
const theme = config.theme ?? defaultTheme;
const limits = { ...defaultLimits, ...config.limits };
```

**継承構造**(default → tier → tenant → user)で柔軟性確保。

## ノイジーネイバー対策

1 テナントの暴走で他テナントが影響を受けない:

### 1. Rate Limiting (テナント別)

```
Tenant A: 1000 req/min
Tenant B: 1000 req/min
```

→ [[API-Design]]

### 2. リソースクォータ

DB 接続、ストレージ、計算時間に**上限**。

### 3. 別キュー / 別ワーカー

重要テナントは**別キュー**。バックグラウンドジョブで他に影響しない。

→ [[Concurrency-Async]]

### 4. Read Replicas

読み込みを**分散**、書き込みのみ主 DB。

→ [[Database-Design]]

## バックアップとリストア (テナント単位)

### テナント別バックアップ

「**Tenant A だけ昨日に戻したい**」を可能に。
- Schema-per-Tenant なら容易 (`pg_dump --schema=tenant_a`)
- Shared Schema は難しい(全 row フィルタ必要)

### Right to Be Forgotten

→ [[../40-Bridge/Privacy-by-Design]]

「テナント A を**完全削除**」を要求された時:
- 全テーブルから tenant_id でフィルタ
- バックアップからも消去計画
- 監査ログには「削除済み」として残す

## オンボーディング (テナント作成)

新テナント作成時の処理:

```
1. tenants テーブルに INSERT
2. Schema-per-Tenant ならスキーマ作成
3. デフォルトロール・権限作成
4. サンプルデータ(任意)
5. 招待メール
6. メーター・課金設定
```

これらを**トランザクション**で。失敗時は完全ロールバック。
→ [[Database-Design]]

## 課金とメータリング

→ [[../30-Interface/Pricing-Monetization-UX]]

- ユーザー数(Seat-based)
- 使用量(API 呼び出し、ストレージ、AI トークン)
- 機能(プラン別)

メーター集計を**リアルタイム**に。Stripe / Lago / Orb がよく使われる。

## 認証・認可

→ [[Security]] / [[../30-Interface/Permissions-UX]]

### Identity Provider 連携 (B2B)

エンタープライズは**SSO**(SAML / OIDC)を要求:
- Okta, Azure AD, Google Workspace
- WorkOS, Stytch, Clerk が SSO 機能を提供

### ロール (テナント内)

```
Owner / Admin / Member / Viewer
```

カスタムロールが必要なケースも多い。

### 監査ログ

```
2026-05-02 10:00 - admin@a.com 削除した user-123 from tenant-a
```

セキュリティインシデント、コンプライアンスで必須。

## モニタリング

→ [[Observability]]

メトリクス・ログに**`tenant_id` を必ず含める**:

```json
{ "ts": "...", "tenant_id": "...", "user_id": "...", "msg": "..." }
```

ダッシュボードでテナント別フィルタ可能。「Tenant X だけ遅い」を即発見。

## マイグレーション

→ [[../40-Bridge/Migrations-as-Product]]

スキーマ変更は**全テナント**に影響:

### Shared Schema

通常の Online Schema Change。

### Schema-per-Tenant

各スキーマに同じ migration を**順次適用**。一部成功・一部失敗の状態を扱う。

```ts
for (const tenant of tenants) {
  await applyMigration(tenant, "v23_add_column.sql");
}
```

並列適用 + 進捗監視 + 失敗時のリトライ。

## カスタムドメイン

テナントが**自社ドメイン**でアクセスしたい:

```
example.com → app.example.com (デフォルト)
acme.com    → acme-tenant がカスタムドメイン
```

要件:
- DNS 確認(TXT レコード)
- 自動 SSL 証明書発行(Let's Encrypt, Cloudflare for SaaS)
- Host Header からテナント識別

## Multi-region

→ [[Edge-and-Distributed]]

データ residency が要求される:
- EU テナント → EU リージョン
- 日本テナント → アジアリージョン

テナントごとに**主リージョン**を持ち、データはそのリージョンに固定。

## アンチパターン

- すべてのクエリに**手動で**`tenant_id` を加える(忘れる)
- 1 顧客の要望で**コードに条件分岐**(他テナントに波及)
- テナント管理者が**他テナント**を見られる
- 課金が**手作業**でテナントごとに集計
- カスタマイズが**フォーク**で実現される
- ノイジーネイバーで**全システム**遅延
- マイグレーションが**1 テナントで失敗**して止まる
- 監査ログに `tenant_id` がない

## チェックリスト

- [ ] 分離モデル (Single / Schema / Shared) を**意識的に選んだ**か
- [ ] **RLS or アプリ層で機械的に**テナント分離されているか
- [ ] テナント識別が**信頼できるソース**から取れるか
- [ ] **ノイジーネイバー**対策(Rate Limit, Quota)があるか
- [ ] 監査ログに **`tenant_id`** が含まれるか
- [ ] テナント単位の**バックアップ/復元**手順があるか
- [ ] マイグレーションが**全テナント**で安全に進むか
- [ ] カスタマイズが**Feature Flag / 設定**で実現されているか

## 関連

- [[Architecture-Layers]]
- [[Database-Design]]
- [[Security]]
- [[API-Design]]
- [[Type-Systems-and-DDD]]
- [[Edge-and-Distributed]]
- [[Observability]]
- [[CI-CD]]
- [[../30-Interface/Permissions-UX]]
- [[../30-Interface/Pricing-Monetization-UX]]
- [[../40-Bridge/Privacy-by-Design]]
- [[../40-Bridge/Migrations-as-Product]]

## 深掘り

- *Building Multi-Tenant Applications with AWS* (AWS docs)
- Microsoft, *Multi-Tenant SaaS Architecture Patterns*
- Supabase RLS documentation
- WorkOS / Clerk / Stytch (B2B 認証)
- *Software Engineering at Google* (multi-tenancy chapter)
