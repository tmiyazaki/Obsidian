---
tags: [skill, bridge, sre, reliability]
domain: cross-cutting
level: advanced
---

# SRE (Site Reliability Engineering)

## 一行で

> Google 発の「**運用をソフトウェア工学で解く**」アプローチ。**信頼性**を機能と同じく**設計対象**にする。

## なぜ重要か

「**動いている**」と「**信頼できる**」は別:
- たまに落ちる → ユーザーは去る
- 障害復旧に半日 → ビジネス停止
- 何が壊れたか分からない → 怖くて変更できない

SRE は「**信頼性をエンジニアリングする**」職能・哲学。
DevOps の実装形と言われる。

## SRE の核となる概念

### 1. SLI / SLO / SLA

→ [[../10-Coding/Observability]]

| | 意味 | 例 |
|---|---|---|
| **SLI** | 計測する指標 | 99.5% のリクエストが 200ms 以下 |
| **SLO** | 内部目標 | SLI を 99.9% で達成 |
| **SLA** | 顧客との契約 | 99% 未達なら返金 |

「99.99%」を狙うか「99.9%」で十分かは**事業判断**。
過剰な信頼性は**コスト過剰**。

### 2. Error Budget

```
SLO 99.9% = 月 43 分の停止許容 (Error Budget)
```

予算内なら**新機能リリース OK**、超えたら**安定化に集中**。
「**速度と安定の対立を数値で解決**」。

### 3. Toil の削減

Toil = 「手作業で繰り返し、価値を生まない労働」:
- 手動デプロイ
- 障害時の手動復旧
- アラート対応の手作業

SRE は**Toil 50% 以内**を目標とし、残りで**自動化**を進める。

### 4. ポストモーテム (Blameless)

→ [[Critique-Culture]]

事故を**個人責任にせず**システム改善に:

```
1. タイムライン
2. 影響範囲 (ユーザー数、収益、SLO)
3. 根本原因 (5 Whys)
4. 何が**今後防ぐ**ためにできるか
5. 何が**気づきを早める**ためにできるか
```

「**犯人探し**」をやめ、「**仕組みを改善**」へ。
心理的安全性が前提。

### 5. アラート疲れの撲滅

低品質アラート (false positive) を放置すると、**全アラートが無視される**:

- 症状ベース (CPU 90% でなく「ユーザー影響あり」)
- 重要なアラートだけ
- ランブックリンク
- 鳴らない週があったら**仕組みを疑う**

→ [[../10-Coding/Observability#アラートの設計]]

## 主要なプラクティス

### Observability First

→ [[../10-Coding/Observability]]

「観測できないものは制御できない」。
ログ・メトリクス・トレースを**設計時に**組み込む。

### Capacity Planning

- 現在の利用量
- 成長率
- 季節変動
- マージン

数か月先まで「**詰まらない**」設計。スケールアップ・スケールアウトの戦略。

### Load Balancing

- DNS ベース
- Layer 4 (TCP)
- Layer 7 (HTTP)
- Health Check

CloudFlare / AWS ELB / Envoy が代表。

### Graceful Degradation

完全停止より**機能限定で動く**:

```
キャッシュレイヤ障害 → DB 直接アクセス (遅いが動く)
推薦システム障害 → デフォルトリスト表示
画像処理障害 → 既存画像のみ
```

→ [[../10-Coding/Error-Handling]] (サーキットブレーカ)

### Chaos Engineering

「**わざと壊して**」耐性を確認:

- Netflix の Chaos Monkey (本番でランダムにインスタンス停止)
- ゲームデー (計画的な障害訓練)
- Gremlin / LitmusChaos / AWS Fault Injection

「**事故の前に経験**」する。
心理的にハードルが高いが、本物の障害より遥かに安全。

### 自動復旧 (Self-Healing)

- Kubernetes の Pod 再起動
- Health check 失敗時の自動切り離し
- 自動スケーリング
- 自動 Failover

人間が**寝てる時**に静かに直る。

### Multi-AZ / Multi-Region

→ [[../10-Coding/Edge-and-Distributed]]

データセンター単位の障害に備え:
- 同 region で複数 AZ
- 重要サービスは複数 region

データの**レプリケーション**と**Failover** 戦略。

## オンコール (On-Call)

24h 体制で障害対応:

### ローテーション

- 1 週間交代
- フォロー (バディ)
- 国際チームで時差を活かす (Follow-the-Sun)

### 持続可能性

オンコールは**燃え尽き**を生む:
- 1 シフトの**アラート上限** (5 回まで等)
- 連続待機の制限
- 振り返りでアラート品質改善
- 補償 (手当、振替休暇)

> "If you're getting paged at 3am every week, something is wrong with your system, not your engineers."

### ランブック

```
[ アラート: API レイテンシ > 1s ]
   ↓
[ ランブック: 認証 API の対処 ]
   1. ダッシュボード X を確認
   2. キャッシュレイヤを確認
   3. ロールバック候補...
```

人間が**思い出す**前提でなく、**辿るだけ**で復旧できる。

## インシデント管理

### 重要度レベル

```
SEV1: 全社停止、収益直撃
SEV2: 主要機能停止
SEV3: 一部機能影響
SEV4: 軽微な不具合
```

レベルで対応速度・関与者が変わる。

### Incident Commander

ロール:
- **Incident Commander** (IC): 統括、判断
- **Communications Lead**: 顧客・ステークホルダー連絡
- **Subject Matter Expert** (SME): 技術対応
- **Scribe**: タイムライン記録

混乱を避ける**明確な分業**。Slack インシデントチャネルで合流。

### ステータスページ

→ [[../30-Interface/Customer-Support-UX]]

ユーザー向けの**透明な情報**:

```
[ ⚠ 認証 API で遅延が発生しています
   開始: 14:23 JST
   現在: 調査中
   次回更新: 15 分後 ]
```

statuspage.io, Atlassian Statuspage が代表。
**沈黙**は不信を呼ぶ。

### コミュニケーション

- 顧客への第一報を**素早く**
- 影響範囲を**明示**
- 復旧見込みを**保守的に**(早めの約束は信頼を毀損)
- 復旧後の**ポストモーテム公開**

## ポストモーテム

→ [[Critique-Culture]]

事故後 1-2 日以内に:

1. タイムライン (発生 → 検知 → 対応 → 復旧)
2. 影響範囲 (定量)
3. 根本原因 (5 Whys, 思考プロセス含む)
4. 何が正しく機能したか
5. 何を改善するか (担当・期限つきアクション)
6. **Blameless** 言語

公開する:
- 社内全員
- 大規模なら顧客にも

公開ポストモーテムが**信頼を生む** (Cloudflare, GitHub, Stripe)。

## SRE と Dev の関係

```
Dev チーム: 機能を作る
SRE チーム: 信頼性を確保
共通: SLO で繋がる
```

エラーバジェットを使い切ったら**Dev のリリースが止まる**。
両者の**インセンティブが一致**する仕組み。

ただし**Sre vs Dev の対立**は避ける:
- 共同のオンコール
- 共同のポストモーテム
- 「**You build it, you run it**」

→ [[Platform-Engineering]]

## カオス エンジニアリングの実践

```
1. 仮説: "DB レプリカ障害でも書き込みは継続する"
2. 実験: レプリカを 1 つ停止
3. 観察: メトリクス、エラー率
4. 結果: 仮説通り or 想定外の問題発見
5. 改善
```

低トラフィック時に**段階的**に。本番直接は**Tier の高い組織**のみ。

## SLO と機能トレードオフ

```
SLO 残予算: 5 分
新機能のリスク: 高
   → リリース延期 / 安全網強化
SLO 残予算: 30 分
新機能のリスク: 低
   → リリース OK
```

「**数値で**」判断する。感情論にならない。

## キャパシティの数学

```
99% 稼働 = 月 7h 停止
99.9% = 月 43 分
99.99% = 月 4 分
99.999% (Five Nines) = 月 26 秒
```

99.9% から 99.99% に上げる **コスト >> 価値** であることが多い。
**SLO は事業要求**から決める。

## DevOps / Platform Engineering との接続

→ [[Platform-Engineering]] / [[Developer-Experience-DX]]

- SRE は**信頼性運用**を担う
- Platform Engineering は**プラットフォーム提供**
- 重複領域あり (IDP に SRE 機能が含まれる)

組織規模で:
- 中小: 兼任 (DevOps Engineer)
- 大規模: 専任 SRE + Platform チーム

## クラウドネイティブ

- Kubernetes
- Service Mesh (Istio, Linkerd)
- GitOps (Argo CD, Flux)
- Observability スタック (Prometheus, Grafana, Tempo)
- 自動スケーリング

学習曲線急、過剰投資のリスク。
**規模・要件**で判断。

## アンチパターン

- 100% 稼働を目指す(コスト爆発、機能停滞)
- ポストモーテムを**犯人探し**にする
- アラート過剰で**全部 mute**
- オンコールが**燃え尽き**製造
- 障害を**ユーザーに隠す** (信頼毀損)
- ランブックなしで**人の記憶**頼り
- Chaos Engineering を**本番でいきなり**
- SRE と Dev の**サイロ化**

## チェックリスト

- [ ] 主要サービスに**SLI / SLO** があるか
- [ ] **Error Budget** で機能リリース判断しているか
- [ ] アラートが**症状ベース**で**actionable** か
- [ ] **ランブック**があるか
- [ ] **Blameless Postmortem** を運用しているか
- [ ] オンコールが**持続可能**か
- [ ] **ステータスページ**を提供しているか
- [ ] **Chaos Engineering** を試したことがあるか
- [ ] Toil を**50% 以内**に抑えているか

## 関連

- [[../10-Coding/Observability]]
- [[../10-Coding/CI-CD]]
- [[../10-Coding/Edge-and-Distributed]]
- [[../10-Coding/Error-Handling]]
- [[../10-Coding/Concurrency-Async]]
- [[../10-Coding/Workflows-Background-Jobs]]
- [[Platform-Engineering]]
- [[Developer-Experience-DX]]
- [[Tech-Debt]]
- [[Critique-Culture]]
- [[Documentation-as-Product]]
- [[Knowledge-Management]]
- [[Migrations-as-Product]]
- [[../30-Interface/Customer-Support-UX]]
- [[../30-Interface/Notifications]]

## 深掘り

- *Site Reliability Engineering* (Google, 無料公開)
- *The Site Reliability Workbook* (Google, 続編)
- *Seeking SRE* edited by David Blank-Edelman
- *Chaos Engineering* by Casey Rosenthal
- *Release It!* by Michael Nygard
- Charity Majors (Honeycomb) のブログ
- Cloudflare / GitHub / Stripe 公開ポストモーテム
