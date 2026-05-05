---
tags: [skill, bridge, local-first, sync]
domain: cross-cutting
level: advanced
---

# ローカルファーストと同期エンジン

## 一行で

> 「**ローカル(端末)が真実、クラウドはレプリカ**」へ反転させる設計。オフライン強・即応・プライバシー高。

## なぜ重要か

伝統的な Web アプリ:
- すべてサーバ往復(タップ → ms 待機 → 応答)
- オフラインで動かない
- データはサーバに依存(消えたら終わり)
- 検索もサーバへ

ローカルファースト:
- 操作は**即座に**反映 (0ms)
- オフラインで完全機能
- データは**端末に**(必要分)
- サーバは**同期**のため
- プライバシー強

Linear, Figma, Notion (一部), Apple アプリ ── 「**速い**」と評判のアプリの多くがローカルファースト。Ink & Switch のマニフェストが起源。

## 7 つの理想 (Ink & Switch)

1. **No spinners**: ネットを待たない
2. **Your work is not trapped on one device**: 全デバイスで使える
3. **The network is optional**: オフラインで動く
4. **Seamless collaboration**: 多人数編集
5. **The Long Now**: アプリが消えてもデータは残る
6. **Security and privacy by default**: 暗号化・自分の鍵
7. **You retain ultimate ownership and control**: ユーザー所有

すべて完璧に達成は難しいが**目標値**として持つ。

## 同期エンジン (Sync Engines)

データを「**ローカルとサーバで一貫**」に保つ仕組み:

### CRDT 系

→ [[../30-Interface/Real-time-Collaboration]]

```
Yjs / Automerge / Loro
```

任意順で同じ結果になるデータ構造。共同編集 + オフライン対応。

長所: 競合解消が**自動**
短所: メモリ・帯域コスト、複雑データに不向き

### Replication 系

```
Replicache / Zero / ElectricSQL / PowerSync / RxDB
```

サーバ DB の状態をクライアントに**レプリケート**。SQL でクエリ可能。

長所: 構造化データに強い、SQL が使える
短所: スキーマ依存、競合解消は別途設計

### Local-first フレームワーク

```
TinyBase / Triplit / Dexie + Sync
```

ローカル DB + 同期ロジックを**一体提供**。

## アーキテクチャ

```
[ UI ]
  ↑↓
[ Local DB (SQLite WASM / IndexedDB) ]
  ↑↓
[ Sync Engine ]
  ↑↓
[ Server (Postgres / DynamoDB / etc.) ]
```

ユーザー操作は**Local DB に書く**(即時)。Sync Engine が裏で**サーバに送る**+**他クライアントから取る**。

## 主要技術

### SQLite WASM + OPFS

→ [[../10-Coding/Modern-Web-Platform]]

ブラウザに**フル SQLite**:

```ts
const db = new sqlite3.oo1.OpfsDb("/app.db");
db.exec("CREATE TABLE notes (id TEXT, body TEXT)");
const rows = db.exec("SELECT * FROM notes WHERE ...");
```

500MB 超のデータも扱える。複雑クエリ可能。

### IndexedDB / Dexie

長年使われている KV ストア。Dexie で扱いやすく:

```ts
import Dexie from "dexie";
const db = new Dexie("MyApp");
db.version(1).stores({ notes: "id, createdAt, [tag+createdAt]" });
const recent = await db.notes.orderBy("createdAt").reverse().limit(10).toArray();
```

### Service Worker (オフライン)

```ts
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached ?? fetch(e.request))
  );
});
```

→ [[../10-Coding/Caching-Strategies]]

### Background Sync

オフラインで保留 → オンライン復帰時に自動送信。

```ts
const reg = await navigator.serviceWorker.ready;
await reg.sync.register("sync-pending-orders");
```

## CRDT 詳細

→ [[../30-Interface/Real-time-Collaboration]]

### Yjs (最も普及)

```ts
import * as Y from "yjs";
const ydoc = new Y.Doc();
const ymap = ydoc.getMap("notes");
ymap.set("title", "新しいノート");

// 別クライアントの変更を merge
const update = Y.encodeStateAsUpdate(ydoc);
Y.applyUpdate(ydoc, otherUpdate);
```

WebSocket / WebRTC / IndexedDB のプロバイダで永続化・同期。

### Automerge

JSON ドキュメント + 履歴:

```ts
import * as Automerge from "@automerge/automerge";
let doc = Automerge.from({ title: "Hi" });
doc = Automerge.change(doc, (d) => { d.title = "Updated"; });
```

時系列 + ブランチング(Git like)。

### Loro

新しい高速 CRDT (Rust 製)。Yjs より小さなメモリ。

## Replication 詳細

### Replicache (Reflect)

サーバ → クライアントに**部分レプリカ**:

```ts
const rep = new Replicache({
  pushURL: "/api/replicache-push",
  pullURL: "/api/replicache-pull",
  mutators: {
    addTodo: async (tx, args) => {
      await tx.set(`todo/${args.id}`, args);
    },
  },
});

// オプティミスティック実行
await rep.mutate.addTodo({ id, title });
```

ミューテーションを**ローカル即実行 + サーバ送信**。サーバが**正解**を返したら反映。

### ElectricSQL

Postgres ↔ SQLite の双方向同期:

```ts
const { db } = await ElectricDatabase.init("app.db");
const electric = await electrify(db, schema);
const result = await electric.db.notes.findMany();
```

Postgres で書いた SQL がそのままローカルでも動く感覚。

### Zero (Rocicorp)

Replicache の進化版。SQL 互換 + リアルタイム。

### PowerSync

Postgres / MongoDB ↔ SQLite。エンタープライズ向け。

### RxDB

オフラインファーストの NoSQL ライブラリ。

## 競合解消

複数クライアントが**同じデータ**を変更:

### Last-Write-Wins (LWW)

タイムスタンプが新しい方が勝つ。最も単純、データ消失あり。

### CRDT 自動マージ

データ構造が**自動で**マージ可能。

### カスタム解消

- 「両方残す」(枝分かれ)
- 「ユーザーに選ばせる」(競合 UI)
- ビジネスロジック (在庫数なら最小値)

## オフライン UX

→ [[../30-Interface/Loading-States]]

### 状態の可視化

```
[ ✓ 同期済み ]
[ ⏳ 同期中... ]
[ ⚠ オフライン (5 件保留) ]
```

ステータスバーやアイコンで**現在の状態**を常時表示。

### 楽観的 UI

→ [[../30-Interface/Interaction-Patterns#Optimistic-UI]]

ローカルファーストでは**全操作が**Optimistic:

```
ユーザー: タスク追加
   ↓
ローカル DB に書く (即時)
UI に反映 (即時)
   ↓
バックグラウンドでサーバへ
   ↓ 失敗
エラー表示 + リトライ or ロールバック
```

### 失敗時のリカバリ

```
[ "保存に失敗しました (3 件)
   - ネットワーク接続を確認してください
   - [再試行] [破棄] [後で]"
]
```

データを**消さない**設計。「気付いたら消えた」が最悪。

## セキュリティ

→ [[../10-Coding/Security]] / [[Privacy-by-Design]]

### ローカルデータの暗号化

- Web Crypto API でブラウザ内暗号化
- iOS / Android のキーチェーン
- ユーザーパスワードでキー導出 (PBKDF2 / Argon2)

### End-to-End Encryption (E2EE)

サーバが**復号できない**:
- WhatsApp / Signal
- iCloud Advanced Data Protection
- Proton Drive

実装複雑、鍵管理がカギ。

### 多端末対応

ユーザー A が 3 デバイス使う:
- 各デバイスの鍵を**マスター鍵**で署名
- 新規デバイス追加時に**既存デバイスで承認**
- リカバリコード(全デバイス紛失時)

## サーバ側の役割

ローカルファーストでも**サーバは必要**:
- 多端末同期
- バックアップ
- 認証
- アクセス制御
- 検索 (大規模)

「**サーバなし**」ではなく「**サーバが真実でない**」。

## 検索

→ [[../30-Interface/Search-UX]]

ローカル全文検索:
- SQLite の FTS5
- minisearch / fuse.js
- LanceDB (ローカル ベクトル)

サーバ検索が**追加で**必要なケース:
- 全社横断
- 巨大データセット
- 高度なランキング

## モバイル

→ [[../30-Interface/Mobile-Patterns]]

ネイティブアプリは**ローカルファーストの典型**:
- Notes (Apple)
- Things, OmniFocus
- Bear, Obsidian
- Linear

Web よりもストレージ・バックグラウンド処理が**自由**。

## 制約と現実

ローカルファーストが**合わない**場合:
- 数 GB を超えるデータセット (端末容量)
- 強整合性必須(銀行・予約)
- リアルタイム計算(検索ランキング)
- 多くの参加者(数千人の共同編集)

ハイブリッド: コア機能は**ローカル**、検索・分析は**サーバ**。

## ストレージ管理

ブラウザ:
- IndexedDB / OPFS で**数 GB** 確保可能
- ユーザーが**削除**(ストレージ設定)
- 容量警告
- 古いデータの**破棄ポリシー** (LRU)

```ts
const estimate = await navigator.storage.estimate();
console.log(estimate.usage, estimate.quota);

// 永続化 (削除されにくくなる)
await navigator.storage.persist();
```

## デバッグと観測

→ [[../10-Coding/Observability]]

ローカルファーストの観測は難しい:
- クライアント側でのバグが**集計しにくい**
- 同期失敗の追跡
- データ整合性の監視

Sentry, LogRocket 等でクライアントメトリクス収集。
プライバシー配慮で**何を送るか**慎重に。

## アンチパターン

- ローカル状態とサーバ状態の**整合性チェックなし**
- 競合解消ロジック**なし** → データ消失
- 暗号化なしで**機密データ**をローカル保存
- オフライン操作の**保留キュー**が**消える** (アプリ更新で)
- 同期失敗を**ユーザーに伝えない**
- 容量超過で**何も書けなくなる**

## チェックリスト

- [ ] **ローカル DB**(SQLite WASM / IndexedDB)を使うか
- [ ] 操作が**即時 UI 反映**されるか
- [ ] オフラインで**完全機能**(または明示的な制限)があるか
- [ ] 同期状態が**ユーザーに見える**か
- [ ] 競合解消(CRDT / カスタム)が決まっているか
- [ ] 機密データは**暗号化**されているか
- [ ] **多端末**で同期するか
- [ ] 容量超過の処理を**設計**しているか

## 関連

- [[../30-Interface/Real-time-Collaboration]]
- [[../30-Interface/Loading-States]]
- [[../30-Interface/Interaction-Patterns]]
- [[../30-Interface/Mobile-Patterns]]
- [[../10-Coding/State-Management]]
- [[../10-Coding/Modern-Web-Platform]]
- [[../10-Coding/Caching-Strategies]]
- [[../10-Coding/Database-Design]]
- [[../10-Coding/Security]]
- [[Privacy-by-Design]]
- [[Performance-as-UX]]

## 深掘り

- *Local-first software* by Ink & Switch (https://www.inkandswitch.com/local-first/)
- Martin Kleppmann の CRDT 講義
- Replicache / Zero documentation (rocicorp.dev)
- ElectricSQL documentation (electric-sql.com)
- Yjs / Automerge / Loro documentation
- Linear engineering blog (sync engine)
- *The Architecture of Open Source Applications* (CRDT chapter)
