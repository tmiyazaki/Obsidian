---
tags: [skill, bridge, growth, retention]
domain: cross-cutting
level: intermediate
---

# グロースとリテンション

## 一行で

> 「**獲得 → 活性化 → 定着 → 紹介 → 収益**」の流れを**測定し改善**する系統的アプローチ。Growth Hacking でなく**プロダクト主導の継続的実験**。

## なぜ重要か

ユーザー獲得は**バケツの上から**注ぐが、**底に穴**(リテンション)があれば無駄:

```
1000 人獲得 → 30 日後 50 人 = 5% 残存
```

5% を 10% に上げる効果 = 獲得を 2 倍にする効果。
**Retention is King**。

## AARRR (Pirate Metrics)

Dave McClure のフレーム:

```
A - Acquisition  (獲得)
A - Activation   (初体験)
R - Retention    (再訪)
R - Referral     (紹介)
R - Revenue      (収益)
```

各段階でファネル分析。ボトルネックを発見。

## North Star Metric

→ [[Roadmapping-Prioritization#north-star-metric]]

プロダクト全体が追う**1 つの指標**:

```
Spotify: 再生時間
Airbnb: 予約泊数
Slack: チームの送信メッセージ数
```

下位 KPI (登録、PV) はこれに繋がる経路として。

## ファネル分析

```
[ 訪問者: 10000 ]
        ↓ 60%
[ サインアップ: 6000 ]
        ↓ 50%
[ 初回利用: 3000 ]
        ↓ 30%
[ 1 週間後アクティブ: 900 ]
        ↓ 20%
[ 月次定着: 180 ]
```

最も**ドロップが大きい段階**から改善。
ツール: Amplitude, Mixpanel, PostHog, Heap。

## Activation (活性化)

「**Aha! Moment** 」までの最短経路:

```
新規ユーザーが何をすると定着する?
```

例:
- Facebook: 10 日間で 7 友達追加
- Twitter: 30 フォロー
- Slack: チームで 2000 メッセージ送信
- Dropbox: 2 デバイスに同期

データから**マジックナンバー**を発見し、新規ユーザーを**そこまで導く**。

→ [[../30-Interface/Onboarding-Empty-States]]

### 最初の 5 分の設計

- 簡単なサインアップ
- 入力最小化
- サンプルデータで「**触れる**」状態
- 早い**初期成功**

### Time-to-Value (TTV)

価値体感までの時間:
- 5 分 → 良
- 1 日 → 普通
- 1 週間 → 失敗のリスク高

短縮が**LTV** に直結。

## Retention の種類

### Day-N Retention

```
Day 1 retention: 40%   (登録翌日の継続)
Day 7 retention: 20%
Day 30 retention: 10%
```

業界ごと目安が違う。SaaS は厳しい (30 日 > 30% で優秀)。

### Cohort 分析

```
2026-01 登録ユーザー:  Day1: 50% / Day7: 30% / Day30: 20%
2026-02 登録ユーザー:  Day1: 55% / Day7: 35% / Day30: 23%
```

改善が**世代ごとに**現れるか。
プロダクト変更の効果がここに出る。

### Stickiness

```
DAU / MAU = 0.4
```

月アクティブの何 % が日々アクティブか。
SNS は 0.5+、業務系は 0.2 前後が典型。

## チャーン (解約) 対策

### Voluntary Churn

ユーザーが**意図的に**辞める:
- 価格の高さ
- 使わなくなった
- 競合へ移行
- 機能不足

### Involuntary Churn

意図しない解約:
- カード期限切れ
- 支払い失敗
- 通信障害

**回復可能**なら救う:
- カード更新通知
- 支払いリトライ (Smart Retry)
- Grace Period

Stripe Billing 等が対応。

### 解約防止 (Cancel Save)

→ [[../30-Interface/Pricing-Monetization-UX]]

解約フローで:
- 「何が改善できれば続けられる?」
- 一時休止 (Pause) オプション
- ダウングレード提案
- 割引・延長

ただし**強引な引き止め**はダークパターン。

## エンゲージメント機能

→ [[../30-Interface/Gamification]]

- ストリーク (連続記録)
- バッジ・実績
- レベル・進捗
- ソーシャル要素 (友人の状況)
- 通知 (適度な頻度)

「**意味のある**」エンゲージメント。**操作的なら逆効果**。

## Notification 戦略

→ [[../30-Interface/Notifications]]

- プッシュ・メール・SMS の使い分け
- 頻度の最適化 (1 週間で何通?)
- パーソナライズ
- A/B テスト
- 解除しやすさ

「**通知 ON のユーザーがオフのユーザーより定着**」は当然、だが「**通知ばかり**」で逆効果のラインを探る。

## Referral (紹介)

「**友人を招待**」:
- 招待者と被招待者**両方**に報酬
- 友人 N 人で特典 (Dropbox 方式)
- ユニーク URL でトラッキング

成功例:
- Dropbox: 紹介で容量増 (40% growth)
- Uber: 紹介で乗車クーポン
- Airbnb: 紹介で予約クレジット

注意:
- スパムにならない設計
- 利用規約違反対策
- 効果測定 (LTV vs 紹介コスト)

## A/B テスト

→ [[Discovery-and-Validation]]

```
バリアント A: 既存
バリアント B: 新案
   → 統計的有意な差で採用判断
```

ツール: Optimizely, LaunchDarkly, GrowthBook, Statsig, Vercel Edge Config。

### 注意

- **検出力**(サンプル数)を事前計算
- **マルチプル比較**で偽陽性 (1 つだけ見るより 100 個見ると偶然差が出る)
- 短期 KPI と**長期 KPI**両方
- p-hacking を避ける (途中で見て切り替えない)

### A/B vs Multi-armed Bandit

- A/B: 期間固定、最後に判定
- MAB: 動的に**良い方を多く**配信

MAB は早く結果を回せるが、統計解釈が複雑。

## ライフサイクル

```
1. Awareness (認知)         ─ マーケ、SEO、SNS
2. Acquisition (獲得)       ─ サインアップ
3. Onboarding (オンボーディング) ─ Aha! moment まで
4. Engagement (継続利用)    ─ 習慣化
5. Expansion (拡張)         ─ アップグレード
6. Advocacy (推薦)          ─ 紹介
   ⤴
[ 再活性化 (Win-back) ]    ─ 離脱ユーザー復帰
```

各段階で**特定の施策**。

## SEO とコンテンツマーケ

オーガニック獲得の柱:
- 検索クエリ調査
- ロングテール SEO
- 高品質コンテンツ
- 内部リンク
- ページ速度 (Core Web Vitals)

→ [[Performance-as-UX]]

「**Programmatic SEO**」 = テンプレート + データで大量ページ生成 (Zillow, Airbnb)。

## SaaS の主要メトリクス

- **MRR / ARR** (月次・年次経常収益)
- **ARPU** (Average Revenue Per User)
- **LTV** (Lifetime Value)
- **CAC** (Customer Acquisition Cost)
- **LTV / CAC** (≥ 3 が健全、≤ 1 で破綻)
- **Payback Period** (CAC 回収月数)
- **Net Revenue Retention** (既存顧客の伸び)
- **Logo Churn** (顧客数の解約)
- **Revenue Churn** (収益の解約)

ダッシュボード化 → [[../30-Interface/Dashboard-Design]]

## ローカライズと国際展開

→ [[Internationalization]]

国別に:
- 獲得チャネル
- 価格感度
- 文化的訴求
- 規制対応 (GDPR, CCPA, 個人情報保護法)

各国で別 A/B テスト。

## アンチパターン

- バニティメトリクス (PV, 登録数) だけ追う
- リテンションを**Day 1 だけ**で評価
- 通知ばかりで**ユーザーがオフ**
- ダークパターンで**短期 KPI**を上げる(長期で逆効果)
- A/B テスト中の**結果を見て切り替え** (p-hacking)
- 紹介報酬が**過剰**で利益マイナス
- North Star Metric**なし**で施策バラバラ
- Cohort 分析**せず**全体平均を見る

## チェックリスト

- [ ] **North Star Metric** が定義されているか
- [ ] **ファネル**を継続的に分析しているか
- [ ] **Cohort** で改善効果を見ているか
- [ ] **Aha! Moment** とそこまでの経路が分かっているか
- [ ] LTV / CAC > 3 か (SaaS なら)
- [ ] **A/B テスト**を統計的に正しく実施しているか
- [ ] 通知が**過剰でない**か
- [ ] **ダークパターン**を避けているか
- [ ] 国際展開なら**地域別**に分析しているか

## 関連

- [[Discovery-and-Validation]]
- [[Roadmapping-Prioritization]]
- [[Ethical-Design]]
- [[Privacy-by-Design]]
- [[Internationalization]]
- [[Knowledge-Management]]
- [[../30-Interface/Onboarding-Empty-States]]
- [[../30-Interface/Notifications]]
- [[../30-Interface/Gamification]]
- [[../30-Interface/Pricing-Monetization-UX]]
- [[../30-Interface/Dashboard-Design]]
- [[../30-Interface/Customer-Support-UX]]
- [[Performance-as-UX]]
- [[Migrations-as-Product]]

## 深掘り

- *Lean Analytics* by Alistair Croll & Benjamin Yoskovitz
- *Hooked* by Nir Eyal (注意: 倫理境界に注意)
- *Hacking Growth* by Sean Ellis & Morgan Brown
- Reforge プログラム (Brian Balfour 等)
- *The Cold Start Problem* by Andrew Chen
- *Crossing the Chasm* by Geoffrey Moore
- a16z 著の Growth ガイド
