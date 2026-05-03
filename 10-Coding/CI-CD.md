---
tags: [skill, coding, devops]
domain: coding
level: intermediate
---

# CI/CD と デプロイ戦略

## 一行で

> CI/CD は「**自動化されたパイプライン**」ではなく「**変更を素早く・安全に届ける文化と装置**」。リリースを**イベント**から**日常**にする。

## なぜ重要か

リリース頻度はプロダクトの**学習速度**を決めます。月 1 リリースのチームと 1 日 10 リリースのチームでは、年間の改善回数が桁で違います。同時に、頻度を上げるほど**自動化と安全網**が必須になります ─ さもなければバグの量が頻度に比例して増える。

DORA メトリクスの 4 指標:
- **Deploy Frequency**: どれくらい頻繁にリリースするか
- **Lead Time for Changes**: 変更からリリースまでの時間
- **Change Failure Rate**: 失敗するリリースの割合
- **MTTR**: 復旧までの時間

エリートチームは Deploy Frequency が**1 日複数回**、Lead Time が**1 時間以内**。

## CI (Continuous Integration)

> 開発者の変更を**main に頻繁に統合**し、自動テストする習慣。

### CI パイプラインの典型

```
push / PR
  ↓
lint + format チェック
  ↓
ユニットテスト
  ↓
ビルド
  ↓
統合テスト
  ↓
セキュリティスキャン (SAST, dep audit)
  ↓
カバレッジ・サイズチェック
  ↓
✅ マージ可能
```

### 速さが命

CI が遅いと開発者は変更を**まとめて出す**ようになり、CI/CD の利点が消える。
- 並列実行
- キャッシュ (依存関係、ビルド)
- 変更影響範囲だけテスト (monorepo の affected)
- 目標: PR ごとに **10 分以内**

### Required Checks

main へのマージ条件 (GitHub の Branch Protection):
- CI 緑
- レビュー承認
- 衝突なし
- 古いブランチでない

## CD (Continuous Delivery / Deployment)

| | Continuous Delivery | Continuous Deployment |
|---|---|---|
| 自動化 | プロダクションまで**いつでもデプロイ可能** | プロダクションまで**自動でデプロイ** |
| 人間 | 最終ボタン押下 | なし (テストが緑なら) |

両者は連続体。ステージング自動・本番手動から始め、信頼度を上げて自動へ。

### デプロイ戦略

#### Recreate (停止 → 起動)

シンプルだが**ダウンタイム発生**。社内ツール程度なら許容。

#### Rolling Update

少しずつ置き換え。Kubernetes のデフォルト。

#### Blue-Green

新環境 (Green) を完全に立ち上げ、ロードバランサで切替。

```
[ Users ] ─→ Blue (旧バージョン)
              ↓ 切替
[ Users ] ─→ Green (新バージョン)
              Blue は待機 (即ロールバック可)
```

問題発生時の**ロールバックが瞬時**。コストはインフラ 2 倍。

#### Canary

少数のトラフィックだけ新バージョンへ:

```
[ Users ] → 95% 旧 + 5% 新
            メトリクス監視
            問題なし → 25% → 50% → 100%
```

リスクを段階的に取れる。Argo Rollouts, Flagger, LaunchDarkly。

#### Feature Flags

コードを**デプロイしてから**リリース。デプロイとリリースを分離。

```ts
if (flags.isEnabled("new-checkout", user)) {
  return <NewCheckout />;
}
return <OldCheckout />;
```

A/B テスト、段階的リリース、緊急 OFF が可能。技術的負債にもなりやすいので**期限を決める**。

## ロールバック

「Forward fix」より「**Rollback first**」を原則に:
- 緊急対応の判断時間が圧倒的に少ない
- 問題切り分けは安定状態に戻ってから
- ロールバック手順を**事前にリハーサル**

DB マイグレーションは特に注意 → [[../40-Bridge/Migrations-as-Product]]

## Infrastructure as Code (IaC)

インフラをコードで宣言:
- **Terraform** (HCL): クラウド非依存、最も広い採用
- **Pulumi**: TS/Python/Go で書ける
- **CloudFormation / CDK** (AWS)
- **Crossplane** (Kubernetes)

GUI 操作で「あの設定どこ?」を起こさない。**Git に履歴**が残る。

## 環境

```
local → preview → staging → production
```

- **local**: 開発者個人
- **preview**: PR ごとに自動立ち上がる (Vercel, Netlify)
- **staging**: 本番に近い、リリース前検証
- **production**: 本番

各環境で**設定 (API URL, DB) を変える**必要がある:
- 環境変数
- Secrets Manager (Vault, AWS Secrets Manager)
- 12-Factor App の原則

## シークレット管理

- ソースに**含めない** (`.env` を gitignore)
- Secrets Manager / Vault
- Git Secret Scanning + GitHub Push Protection
- ローテーション計画

→ [[Security]]

## モニタリングとの連携

デプロイ直後の数分が**最も危険**:
- リリースバージョンを Metrics に**タグ付け**
- Sentry / Datadog にリリース通知
- 異常検知でロールバック自動化

→ [[Observability]]

## デプロイ頻度を上げるための実践

### 1. 小さな PR

→ [[Code-Review]]

PR が大きいほどリリース摩擦が増える。

### 2. Trunk-Based Development

→ [[Version-Control]]

長命ブランチを避ける。

### 3. Feature Flag

完成していなくても**無効化された状態でデプロイ**。

### 4. テスト自動化

手動 QA に依存しない。

### 5. オブザーバビリティ

「壊れたら気づける」確信があれば、デプロイの不安が減る。

## モバイル/デスクトップ特有

### App Store / Google Play

審査時間 (1〜数日)、ストア内 A/B テスト、段階公開 (1% → 100%)。

### Code Push / Hot Update

ストア審査を経ずに JS 更新 (CodePush, EAS Update)。
**ネイティブコード以外**の更新が即時可能。

### Auto Update

Electron 等のデスクトップアプリは差分更新と再起動を計画。

## アンチパターン

- 「金曜デプロイ禁止」 → デプロイがリスクすぎる兆候。安全網を強化すべき
- リリースノートが**手動作成**(自動化可能)
- secret を CI ログに**出力**
- ステージングと本番で**設定が大きく違う**
- ロールバック手順が**口伝**
- Feature Flag が**何百個**残ったまま
- 全テストが**直列で 1 時間**
- マイグレーションを**デプロイと同期**で実行 (アプリが固まる)

## チェックリスト

- [ ] CI が **10 分以内**で緑/赤を返すか
- [ ] mainへのマージに**Required Checks** があるか
- [ ] デプロイが **1 ボタン or 自動**か
- [ ] **ロールバック**が即時可能か
- [ ] 環境ごとの設定が**コード or IaC** で管理されているか
- [ ] シークレットが**ソースに含まれていない**か
- [ ] デプロイ後の**異常検知**があるか
- [ ] DB マイグレーションが**ダウンタイムなし**で適用できるか

## 関連

- [[Testing-Strategy]]
- [[Code-Review]]
- [[Version-Control]]
- [[Observability]]
- [[Security]]
- [[../40-Bridge/Migrations-as-Product]]

## 深掘り

- *Continuous Delivery* by Jez Humble & David Farley
- *Accelerate* by Forsgren, Humble, Kim (DORA)
- *The DevOps Handbook* by Kim, Humble, Debois, Willis
- Google SRE Book (Release Engineering chapter)
