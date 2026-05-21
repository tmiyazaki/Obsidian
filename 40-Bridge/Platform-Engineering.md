---
tags: [skill, bridge, platform, devops]
domain: cross-cutting
level: advanced
---

# プラットフォームエンジニアリング

## 一行で

> 「**社内の開発者**を顧客に**プロダクトを作る**」職能。DevOps の進化形。Internal Developer Platform (IDP) を提供する。

## なぜ重要か

組織が大きくなると:
- 各チームが**インフラ・CI/CD・監視**を再発明
- 重複ツール選定
- 「Cloud は誰が管理?」が曖昧
- 開発者が**インフラ作業**に時間を奪われる

プラットフォームエンジニアリングは:
- **共通基盤**を「**プロダクト**」として提供
- 開発者は**ビジネスロジック**に集中
- ガバナンス・セキュリティを**標準化**

> "You build it, you run it" (DevOps) → "We build the paved road, you walk it" (Platform Engineering)

## DevOps vs SRE vs Platform Engineering

| | 焦点 |
|---|---|
| **DevOps** | 開発と運用の文化的融合 |
| **SRE** | サービス信頼性 (Google 由来) |
| **Platform Engineering** | 開発者向け IDP の構築 |

これらは**競合せず**補完する。
- DevOps = 文化
- SRE = 信頼性運用
- PE = 共通プラットフォーム提供

→ [[Site-Reliability-Engineering]]

## Internal Developer Platform (IDP)

社内開発者向けに提供:

```
[ 開発者 ]
    ↓
[ Self-Service UI / CLI ]
    ↓
[ IDP (内部) ]
    ↓
┌─────┬─────┬─────┐
│ K8s │ AWS │ DB  │ ...
└─────┴─────┴─────┘
```

開発者が直接 AWS Console を触らず、**抽象された UI** から:
- 新サービス立ち上げ
- DB プロビジョニング
- デプロイ
- ログ・メトリクス確認

## "Paved Road" の概念

→ Spotify の用語

```
[ Paved Road (舗装路) ]    ← 標準・推奨パス。サポートあり
[ Off-road (悪路) ]        ← 例外。自己責任
```

90% の機能を**Paved Road** で。残り 10% (特殊要件) は off-road で自由に。
全部を**強制標準化**すると窒息、全部自由だと**混沌**。

## IDP の主要機能

### 1. プロビジョニング

```
$ idp create service my-api --template typescript-rest
   ✓ GitHub repo
   ✓ CI/CD pipeline
   ✓ Kubernetes namespace
   ✓ DB instance
   ✓ Secrets vault
   ✓ Observability stack
```

新サービスが**1 コマンドで**完備。

### 2. デプロイメント

```
$ idp deploy my-api --env staging
   Building...
   Deploying...
   Health check passed.
   URL: https://my-api.staging.internal
```

→ [[../10-Coding/CI-CD]]

### 3. ロールバック

```
$ idp rollback my-api --to v3.2.1
```

UI でも可能。

### 4. オブザーバビリティ統合

→ [[../10-Coding/Observability]]

ログ・メトリクス・トレースが**サービス作成時に自動接続**。
Datadog / Grafana / Sentry が **PaaS** のように使える。

### 5. シークレット管理

```
$ idp secrets set DATABASE_URL postgres://...
```

Vault / AWS Secrets Manager に書き込み、デプロイ時に自動注入。

### 6. アクセス制御

→ [[../10-Coding/Security]] / [[../30-Interface/Permissions-UX]]

- どの環境にアクセスできるか
- 本番には**承認フロー**経由
- 監査ログ

### 7. データベース管理

```
$ idp db create my-api-db --type postgres
$ idp db migrate my-api-db
$ idp db backup my-api-db
```

DB プロビジョニング・マイグレーション・バックアップを抽象化。

→ [[../10-Coding/Database-Design]] / [[Migrations-as-Product]]

## ツールとフレームワーク

### Backstage (Spotify, OSS)

最も普及した IDP フレームワーク。
- サービスカタログ
- TechDocs
- プラグインエコシステム

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-api
spec:
  type: service
  owner: team-platform
```

### Humanitec / Port / Cortex

商用 IDP プラットフォーム。

### Crossplane

Kubernetes ネイティブの IaC。クラウドリソースを CRD で。

### Pulumi / Terraform / OpenTofu

→ [[../10-Coding/CI-CD]]

IaC ツール。プラットフォーム層で抽象化されることが多い。

### Argo CD / Flux

GitOps デプロイ。Kubernetes 中心。

### Render / Fly.io / Railway

「**サードパーティ IDP**」とも言える PaaS。
小規模チームは自前 IDP より外部 PaaS が現実的。

## チーム構造 (Team Topologies)

→ [[Roadmapping-Prioritization]]

```
1. Stream-aligned    ─ 機能チーム (顧客向け)
2. Platform          ─ IDP を提供
3. Enabling          ─ コーチング・支援
4. Complicated       ─ 高度技術 (ML, 暗号)
```

Platform チームは**他チームを顧客**として扱う。プロダクト思考が必須。

## プロダクトとしての IDP

PE は「**サービスを売らない開発者ツール会社**」のような働き方:

### 1. ユーザーリサーチ

→ [[../30-Interface/User-Research]]

社内開発者にインタビュー:
- 何に時間を取られているか
- どこで詰まるか
- どの機能が役立つか

### 2. ロードマップ

→ [[Roadmapping-Prioritization]]

社内顧客の声で優先度を決める。
「**営業の上位 3 機能を Q1 に**」のような構造。

### 3. UX

→ [[../30-Interface/Dashboard-Design]] / [[../30-Interface/UX-Writing]]

IDP の UI は**社内開発者**の体験を決める。
雑な内部ツール = 採用されず影で使われ続ける。

### 4. メトリクス

- 利用率 (どのチームが使うか)
- 新機能の採用速度
- セルフサービス完了率 (人間サポート不要率)
- DORA メトリクス (チーム全体の)
- 満足度 (NPS)

→ [[Developer-Experience-DX]]

### 5. ドキュメント

→ [[Documentation-as-Product]]

「Diátaxis」フレームに従う:
- Tutorial (始め方)
- How-to (個別タスク)
- Reference (API・コマンド)
- Explanation (なぜこの設計か)

## 採用とロックイン

「**全員に強制**」は反発を生む:

```
1. オプションとして提供
2. 一部チームが使い始める (Early Adopter)
3. メリット実証
4. 自然と移行
5. 古い手法を**徐々に**Deprecate
```

「Off-Road は禁止」ではなく「**Off-Road なら自分でメンテ**」。

## ガバナンスとセキュリティ

→ [[../10-Coding/Security]] / [[Compliance-and-Regulations]] (将来)

IDP の利点:
- 統一的なセキュリティポリシー
- 監査ログ
- アクセス制御
- コンプライアンス (SOC2 等) を**プラットフォーム層で**保証

「**標準パスを使えばコンプライアンス自動**」が理想。

## コスト最適化

→ [[../40-Bridge/Sustainability]]

- リソースの**利用状況**を可視化
- 未使用環境の**自動シャットダウン**
- ユーザーごとのコスト割当 (chargeback)

「**FinOps**」の領域。

## マイクロサービス vs モノリスとの関係

→ [[../10-Coding/Architecture-Layers]]

PE は**マイクロサービス**で価値が高まる:
- 100 個のサービス × 各々が CI/CD = 巨大運用
- IDP で**統一** → 各チームは focus

ただし「**マイクロサービス化のために PE**」は順序が逆。
**規模・組織**が PE を必要とするタイミングを見極める。

## モニタリングと SLO

→ [[Site-Reliability-Engineering]] / [[../10-Coding/Observability]]

IDP 自体も**サービス**:
- SLO を持つ
- インシデント対応
- オンコール

「**プラットフォームが落ちると全社停止**」のリスクを認識。

## オープンソース戦略

→ [[Knowledge-Management]]

社内 IDP のコンポーネントを OSS 化:
- Backstage プラグイン
- Helm チャート
- IaC モジュール

メリット: 採用効果、外部コントリビュート、品質向上。
コスト: メンテ責任、ライセンス対応。

## アンチパターン

- 全機能を**強制**(off-road を許さない)
- ユーザーリサーチ**なし**で機能を作る
- ドキュメント**なし**で IDP リリース
- IDP 自体の**SLA / SLO がない**
- 「**プラットフォームチームの都合**」を社内顧客に押し付ける
- 「**インフラ自動化**」だけで**プロダクト**として扱わない
- 過剰抽象化で柔軟性ゼロ
- ベンダーロックインを意識せず特定 SaaS に依存

## チェックリスト

- [ ] IDP は**プロダクト**として扱われているか
- [ ] **社内顧客** (開発チーム) の声を聞いているか
- [ ] **Paved Road / Off-road** の両方をサポートしているか
- [ ] **Self-Service** で完結できるか
- [ ] ドキュメントが**最新**か
- [ ] **SLO / メトリクス**を計測しているか
- [ ] セキュリティ・コンプライアンスが**標準で保証**されるか
- [ ] チームの**満足度**を測っているか

## 関連

- [[Developer-Experience-DX]]
- [[Site-Reliability-Engineering]]
- [[Documentation-as-Product]]
- [[Knowledge-Management]]
- [[Critique-Culture]]
- [[Discovery-and-Validation]]
- [[Roadmapping-Prioritization]]
- [[Tech-Debt]]
- [[Migrations-as-Product]]
- [[Tool-Stacks-Recipes]]
- [[Compliance-and-Regulations]]
- [[../10-Coding/CI-CD]]
- [[../10-Coding/Observability]]
- [[../10-Coding/Security]]
- [[../10-Coding/Architecture-Layers]]
- [[../10-Coding/Multi-tenancy]]
- [[../10-Coding/Edge-and-Distributed]]
- [[../30-Interface/Dashboard-Design]]
- [[../30-Interface/User-Research]]

## 深掘り

- *Team Topologies* by Skelton & Pais
- Backstage documentation (backstage.io)
- *Platform Engineering on Kubernetes* by Mauricio Salatino
- *Internal Developer Platforms* by Humanitec
- Spotify の "Paved Road" Blog
- DX Reports on Platform Engineering
