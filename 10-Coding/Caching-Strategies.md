---
tags: [skill, coding, caching, performance]
domain: coding
level: advanced
---

# キャッシング戦略

## 一行で

> キャッシュは「**速度を買う**契約」。代金は**整合性**と**無効化の複雑さ**。最初に**何が古びるか**を決めずに導入してはいけない。

## なぜ重要か

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

キャッシュは性能の救世主だが、**バグ製造機**にもなる。設計せずに足すと:
- 古いデータでユーザーが**混乱**
- 同期された別キャッシュが**矛盾**
- 障害時に**雷鳴の群れ** (thundering herd)
- 無効化漏れで**永久に古い**データ

正しく設計されたキャッシュは、性能を 10〜1000 倍に押し上げる。

## キャッシュの 7 階層

ユーザーから DB まで、それぞれの層に存在する:

```
[ Browser ]                Memory / Disk Cache
   ↓
[ CDN Edge ]               静的アセット、SSR HTML
   ↓
[ Reverse Proxy ]          Varnish, Nginx
   ↓
[ App Server ]             In-memory cache (LRU)
   ↓
[ Distributed Cache ]      Redis, Memcached
   ↓
[ DB Query Cache ]         Postgres shared_buffers
   ↓
[ DB Disk ]
```

各層で**何をどれくらい**キャッシュするか設計する。

## キャッシュパターン

### 1. Cache-Aside (Lazy Loading)

```
read  → cache.get
        |── hit  → 返す
        └── miss → DB.get → cache.set → 返す

write → DB.write → cache.invalidate
```

最も普通。アプリがキャッシュとDB両方を制御。

### 2. Read-Through

キャッシュ層が DB アクセスを**自動委譲**。アプリは cache だけを見る。

### 3. Write-Through

書き込み時に**同時に**キャッシュも更新。整合性高いが書き込み遅い。

### 4. Write-Behind (Write-Back)

書き込みをキャッシュにだけ即時反映、DB へは**非同期**。
速いが**障害時にデータ消失リスク**。

### 5. Refresh-Ahead

期限切れ「直前」に**裏で更新**。ヒット率を保ちながら新鮮さ確保。
予測できるアクセスパターンに有効。

### 6. Stale-While-Revalidate (SWR)

期限切れでも**古い値を返し**、裏で更新する:

```
HTTP: Cache-Control: max-age=60, stale-while-revalidate=300
```

ユーザー体感は速く、データはほぼ最新。Web の標準パターン。

## 無効化戦略

> 「無効化が CS で最も難しい問題の一つ」 — その理由は**いつ何を無効化するか正確に追跡しにくい**から。

### 1. TTL (Time To Live)

一定時間で自動失効。設計が単純、整合性は時間で緩む。

### 2. イベント駆動

DB 更新 → イベント発火 → 関連キャッシュ無効化。

```ts
async function updateUser(id: string, data: Partial<User>) {
  await db.users.update(id, data);
  await cache.del(`user:${id}`);
  await events.publish({ type: "user.updated", id });
}
```

別サービスのキャッシュを倒すには **Pub/Sub**。

### 3. Tag-Based Invalidation

```ts
cache.set(`user:42`, user, { tags: ["user", "user:42"] });
cache.set(`order:99`, order, { tags: ["order", "user:42"] });

cache.invalidateTag("user:42"); // user:42 と関連する order も飛ぶ
```

Next.js, Vercel のキャッシュタグ機能の本質。

### 4. Versioning (Cache Busting)

```
/static/main.js?v=abc123    ← URL にハッシュを含む
/static/main.abc123.js
```

新バージョンは**別 URL** = 別エントリ。古い URL は永久キャッシュでも安全。
JS/CSS/画像のデプロイで標準。

### 5. ETag / Last-Modified (HTTP)

```
GET /api/user/42
If-None-Match: "abc123"

← 304 Not Modified (内容変わらず)
```

キャッシュは持つが、**変わったか確認**だけ取りに行く。

## Cache-Control ヘッダ実用早見

```
Cache-Control: public, max-age=31536000, immutable
   → 1 年間キャッシュ、変わらない (ハッシュ付き静的アセット)

Cache-Control: public, max-age=60, stale-while-revalidate=300
   → 1 分新鮮、5 分間は古くても返しつつ裏で更新

Cache-Control: private, no-store
   → キャッシュ禁止 (個人情報、決済画面)

Cache-Control: no-cache
   → キャッシュはする、毎回サーバ確認 (= 必ず ETag/Last-Modified 検証)
```

`no-cache` と `no-store` は別物。前者は**確認後使ってよい**、後者は**保存禁止**。

## CDN キャッシュ

CloudFront, Fastly, Cloudflare のエッジキャッシュ:

- 静的アセット → **長時間** (1 年 + cache busting)
- HTML/SSR → **短時間 + SWR** (数秒〜分)
- API → **短時間 or 個別判断**

エッジキャッシュは**世界中の数百拠点**に分散。 origin 負荷が桁で減る。

### Cache Key

URL + Header でキー決定:

```
Vary: Accept-Language
   → 言語ごとに別キャッシュ

Vary: Cookie
   → cookie が違うとキャッシュ別 (= 個人別 = 効率悪)
```

ログイン状態を含むページは**キャッシュしにくい**。**SWR + 個人化部分は CSR** で分離。

## アプリレイヤキャッシュ

### In-memory (LRU)

```ts
import LRU from "lru-cache";
const cache = new LRU<string, User>({ max: 1000, ttl: 60_000 });

const user = cache.get(id) ?? await loadAndCache(id);
```

最速、サイズ制限あり、プロセス再起動で消える。

### Distributed (Redis)

複数アプリインスタンス間で共有:

```ts
const cached = await redis.get(`user:${id}`);
if (cached) return JSON.parse(cached);

const fresh = await db.users.findById(id);
await redis.setex(`user:${id}`, 300, JSON.stringify(fresh));
return fresh;
```

ネットワーク往復が必要だが、**全インスタンスで共有**できる。

## DB キャッシュ

### Query Result Cache

ORM や DB 自身が**同じクエリ**結果を保持。

### Materialized View

複雑な集計を**事前計算**。リアルタイム性低いが超高速。

### CQRS で読み取り専用モデル

→ [[Architecture-Layers]]

書き込みは正規化 DB へ、読み取りは**最適化された投影**を更新する。

## 主要な落とし穴

### 1. Cache Stampede (キャッシュ集中失効)

期限切れ瞬間に**全リクエストが**DB に殺到 → DB ダウン。

対策:
- **Lock + Single Flight**: 最初の 1 リクエストだけ更新、他は待つ
- **Stale-While-Revalidate**: 期限切れでも古い値を返す
- **Probabilistic Early Expiration**: 期限間際に**確率的に**先回り更新
- **Jitter**: TTL に乱数を加えて同時失効を散らす

### 2. ホットキー

特定キーが**全リクエストの大半**(セレブ投稿等)。
- ローカル(プロセス内)キャッシュを併用
- レプリカで分散
- 計算済み結果を**事前配信**

### 3. キャッシュの汚染

ユーザー A 用のデータを**ユーザー B が見える**。Cache Key 設計ミス。
- ユーザー ID, 言語, 通貨, ロール を**必ず**キーに含める
- `Vary` ヘッダを正しく

### 4. Negative Cache

「**存在しない**」結果もキャッシュする。
- 404 を 1 分キャッシュ → DB 攻撃を緩和
- ただし TTL 短く(後で作成された場合の待ち時間)

### 5. キャッシュにロジックを置く

「**フォーマット済み**」の結果を入れると、表示変更で全キャッシュ破棄。
**正規化された生データ**を入れ、表示時に整形のほうが柔軟。

## モニタリング

→ [[Observability]]

- ヒット率: `hit / (hit + miss)` ─ 80% 以上が目安
- 平均レイテンシ
- メモリ使用量
- Eviction (退避) 頻度
- 異常な MISS パターン (スタンピード前兆)

ヒット率を**ダッシュボード**で見ていないキャッシュは**動いているか分からない**。

## Service Worker と PWA

→ [[../30-Interface/Mobile-Patterns]]

ブラウザ Service Worker でオフライン対応:

```ts
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached ?? fetch(e.request))
  );
});
```

ネットワーク優先 / キャッシュ優先 / Stale-While-Revalidate のパターンを実装。

## アンチパターン

- 「速い気がする」だけで導入(計測なし)
- TTL を**気分で**設定(根拠なし)
- 無効化を**手で**やる仕組み(忘れる)
- 個人情報を CDN にキャッシュ
- ヒット率を**測らない**
- スタンピード対策なし
- 全部 Redis(プロセス内 LRU で十分なケース多数)

## チェックリスト

- [ ] **何が古びうるか**を理解しているか
- [ ] 無効化戦略 (TTL / イベント / タグ) が決まっているか
- [ ] **ヒット率**を計測しているか
- [ ] スタンピード対策があるか
- [ ] Cache Key にユーザー / 言語 / ロールが含まれるか
- [ ] **個人情報**が共有キャッシュに乗っていないか
- [ ] CDN / アプリ / DB のどの層で扱うか意識的か

## 関連

- [[Performance]]
- [[Database-Design]]
- [[API-Design]]
- [[Architecture-Layers]]
- [[Observability]]
- [[Concurrency-Async]]
- [[Edge-and-Distributed]]
- [[../40-Bridge/Performance-as-UX]]

## 深掘り

- *Designing Data-Intensive Applications* by Martin Kleppmann
- HTTP Caching (MDN)
- Cloudflare / Fastly のエッジキャッシュ解説
- Redis documentation (cache patterns)
- *Web Caching with Squid / Varnish* 解説書
