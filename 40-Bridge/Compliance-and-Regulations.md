---
tags: [skill, bridge, compliance, regulations]
domain: cross-cutting
level: advanced
---

# コンプライアンスと規制

## 一行で

> 法律・業界基準 (GDPR / SOC2 / HIPAA / PCI-DSS / ISO 27001) は「**面倒な書類**」でなく「**信頼の機械的証明**」。エンタープライズ受注の前提。

## なぜ重要か

スタートアップが大企業・規制業界 (医療・金融・教育) と契約する段階で:
- **SOC2 取れてますか?**
- **GDPR 対応してますか?**
- **HIPAA BAA 締結できますか?**

「**取ってない**」が**事業ブロッカー**になる。
事前準備で**営業速度が桁で**変わる。

逆にユーザーにとっては「**安心して任せられるか**」の指標。

## 主要な規制・基準

### GDPR (EU, 2018-)

→ [[Privacy-by-Design]]

個人データの保護。EU 内のユーザーに**世界中の企業**が対応必要。

主要要件:
- 明示同意
- アクセス権・削除権・ポータビリティ権
- データ最小化
- 72 時間以内の漏洩報告
- DPO (Data Protection Officer) 任命

違反: 全世界年商の **4%** または €20M (大きい方)。

### CCPA / CPRA (カリフォルニア)

GDPR の米国版。
- 「個人情報を売らない」オプション
- 削除要求対応

### 個人情報保護法 (日本, 2022 改正)

- 漏洩通知義務 (3-5 日)
- 仮名加工情報の概念
- 越境移転の同意

### HIPAA (米国, 医療)

医療情報の保護。
- BAA (Business Associate Agreement) 締結
- 暗号化
- アクセスログ
- 監査
- 漏洩通知

医療データを扱うなら**必須**。

### PCI-DSS (決済)

クレジットカード情報の保護:
- カード番号を**保存しない**(トークン化)
- ネットワーク隔離
- 暗号化
- 定期スキャン

Stripe / Square 等のサービスを使えば**多くを委譲**できる。

### SOC2 (米国, サービス組織)

セキュリティ・可用性・処理整合性・機密性・プライバシー。
**Type I** (時点) vs **Type II** (期間、6 ヶ月以上)。

エンタープライズ B2B SaaS で**事実上必須**。
取得期間: 6-12 ヶ月、コスト: 数百万-数千万円。

### ISO 27001 / ISO 27701

情報セキュリティの国際標準。
EU・日本のエンタープライズが要求。

### EU AI Act (2024-)

→ [[AI-Evaluation-Safety]]

AI のリスクベース規制:
- 禁止 AI (社会信用システム等)
- ハイリスク AI (採用・医療・教育) は厳格義務
- 一般 AI は透明性義務 (生成物の開示)

違反は**全世界年商 7%**まで。

### EAA (European Accessibility Act, 2025-)

→ [[../30-Interface/Accessibility]] / [[Inclusive-Design]]

EU 市場のデジタル製品・サービスに**アクセシビリティ義務**。

### COPPA (米, 児童)

13 歳未満の保護:
- 親の同意
- データ収集最小化
- 広告制限

### FERPA / 教育系規制

学生データの保護。

### DSA / DMA (EU, 2024-)

→ [[Ethical-Design]]

- Digital Services Act: 大規模 PF への透明性義務
- Digital Markets Act: ゲートキーパー (大手 PF) への競争義務

## コンプライアンス対応の階層

```
レイヤ 4: 監査・認証 (SOC2, ISO)
   ↑
レイヤ 3: ポリシー・手続き
   ↑
レイヤ 2: 技術コントロール (暗号化、アクセス、ログ)
   ↑
レイヤ 1: 設計 (Privacy by Design, Security by Default)
```

下層が脆弱なら上層は**書類だけ**になる。

## 設計時の組み込み

### Privacy by Design

→ [[Privacy-by-Design]]

最初から:
- データ最小化
- デフォルト保護
- 透明性
- ユーザー権利の UI 提供

### Security by Default

→ [[../10-Coding/Security]]

- 暗号化 (転送 + 保管)
- 最小権限
- 監査ログ
- インシデント対応計画

### Audit Trail

「**誰が・いつ・何を**変更したか」を**残す**:
- DB の変更履歴
- アクセスログ
- 設定変更ログ
- データエクスポートログ

→ [[../10-Coding/Observability]] / [[../30-Interface/Permissions-UX]]

## DPA (Data Processing Agreement)

第三者サービスに**ユーザーデータを渡す**とき:
- Stripe, AWS, Google Workspace 等
- DPA を**契約**して責任分担を明示
- サブプロセッサのリストを開示

「**この機能を入れると DPA が増える**」を意識。

## データレジデンシ (Data Residency)

→ [[../10-Coding/Edge-and-Distributed]]

特定国のユーザーデータは**その国に保管**:
- EU: GDPR で EEA 内推奨
- 中国: 個人情報は中国内必須
- ロシア: 国内サーバ強制
- 日本: 越境移転の同意

クラウドリージョン選択が**法的義務**になる。

## 認証取得のプロセス (SOC2 を例に)

```
1. ギャップ分析       (3-6 ヶ月)
   現状 vs 要件のチェック
2. ポリシー策定        (1-3 ヶ月)
   セキュリティポリシー、インシデント対応、変更管理...
3. コントロール実装   (3-6 ヶ月)
   MFA、暗号化、ログ、レビュー...
4. 監査 (Type I)      (1-3 ヶ月)
   外部監査人の確認
5. 監視期間 (Type II) (6-12 ヶ月)
   ポリシーが**継続的に**機能しているか
6. 再監査
```

工数: コア人員 1-2 人 + 全社員の協力。

ツール:
- **Vanta**, **Drata**, **Secureframe**: 自動化、相場 $20-50K/年
- 監査人 (Big4 等): $10-50K/年

## 開発フローへの組み込み

### コード変更

- セキュリティレビュー (重要な変更)
- アクセス制御の変更は監査ログ必須

### CI/CD

→ [[../10-Coding/CI-CD]]

- 依存スキャン
- SAST (静的解析)
- DAST (動的解析)
- シークレットスキャン
- ライセンスチェック (OSS コンプラ)

### 本番アクセス

- MFA 必須
- 監査ログ
- 「**Break-Glass**」緊急アクセス手順

## ログとモニタリング

→ [[../10-Coding/Observability]]

監査要件:
- アクセスログ (誰が何にアクセス)
- 認可拒否
- データエクスポート
- 設定変更
- 失敗した認証試行

保管期間: 法定 (通常 6 ヶ月-数年)。

## インシデント対応

→ [[Site-Reliability-Engineering]]

漏洩発覚時:
1. 影響範囲特定
2. 拡大防止
3. 関係者通知 (法務、CISO、CEO)
4. 規制当局報告 (72h 以内 GDPR、3-5 日 PIP)
5. ユーザー通知
6. ポストモーテム
7. 再発防止策

「**漏洩計画**」を**事前に**訓練。

## ユーザー権利の UI

→ [[../30-Interface/Settings-Preferences]] / [[../30-Interface/Permissions-UX]]

法律で要求:
- データダウンロード
- アカウント削除
- マーケ受信オフ
- 同意撤回
- 履歴・ログ閲覧

UI から**自動実行**(問合せフォーム経由は不十分とされる地域あり)。

## 国際展開の罠

- 「US だけ」のサービスでも EU からアクセス可能 → GDPR 適用 ?
- データセンター選択で**法的責任**
- 子会社設立 vs **法的代理人** (GDPR 27 条)
- 規制差で**機能が地域別**に異なる

リーガル/法務と**早期に**連携。

## サブプロセッサ管理

第三者サービスを使うとき:

```
[ 自社 ] → [ Stripe (DPA 締結) ]
        → [ AWS (DPA 締結) ]
        → [ Sentry (DPA 締結) ]
        → ...
```

リスト公開 + ユーザー通知 (変更時)。

「**気軽に Slack ボット追加**」が**コンプラ違反**になりうる。

## 設計トレードオフ

過剰なコンプラ:
- 法務 OK 待ちで**開発速度低下**
- 全機能に同意ポップアップ → UX 悪化
- 過度な暗号化で**パフォーマンス低下**

適切なバランス:
- リスクベース (機微情報は厳格、ログは標準)
- ユーザー透明性 + 簡潔同意
- Vanta 等の**自動化**でコスト削減

## アンチパターン

- コンプラを**事業終盤に**着手 → 営業遅れる
- ポリシーだけ作って**実装が伴わない**(監査で発覚)
- 監査前だけ整理 → Type II で破綻
- 漏洩通知を**遅延**(規制違反)
- ユーザー権利を**問合せフォーム**経由のみ
- DPA 未締結のベンダ利用
- データレジデンシ無視で**全グローバル展開**
- AI 機能で**EU AI Act 無視**

## チェックリスト

- [ ] 主要規制 (GDPR / CCPA / 個人情報保護法) を**把握**しているか
- [ ] 業界規制 (HIPAA / PCI / 等) があるか
- [ ] **SOC2** 等の認証取得計画があるか
- [ ] 監査ログが**法定期間**保管されているか
- [ ] DPA を**第三者と締結**しているか
- [ ] データレジデンシを**意識**しているか
- [ ] 漏洩通知の**手順と訓練**があるか
- [ ] ユーザー権利が**UI から自動実行**できるか
- [ ] 認証ツール (Vanta/Drata 等) を**検討**したか

## 関連

- [[Privacy-by-Design]]
- [[Ethical-Design]]
- [[AI-Evaluation-Safety]]
- [[Inclusive-Design]]
- [[Internationalization]]
- [[Site-Reliability-Engineering]]
- [[Platform-Engineering]]
- [[Tech-Debt]]
- [[Documentation-as-Product]]
- [[../10-Coding/Security]]
- [[../10-Coding/Observability]]
- [[../10-Coding/Database-Design]]
- [[../10-Coding/Edge-and-Distributed]]
- [[../30-Interface/Permissions-UX]]
- [[../30-Interface/Settings-Preferences]]
- [[../30-Interface/Pricing-Monetization-UX]]
- [[../30-Interface/Accessibility]]

## 深掘り

- *Tactical Privacy* by IAPP
- GDPR 全条文
- SOC2 Trust Service Criteria
- ISO 27001 / 27701 standard
- *Privacy Engineering* by Michelle Dennedy
- *Cloud Security and Privacy* by Tim Mather
- 各国規制当局のガイドライン (PMDA, PPC, FTC, ICO 等)
- Vanta / Drata / Secureframe のリソース
