---
tags: [skill, bridge, sustainability, green]
domain: cross-cutting
level: intermediate
---

# サステナビリティ (Green Software / Green UX)

## 一行で

> 「動けばいい」コードと「美しければいい」デザインは**地球資源を消費する**。**エネルギー効率**を設計の質指標として組み込む。

## なぜ重要か

ICT (情報通信技術) は世界の電力消費の **2〜4%** を占め、航空業界に匹敵します。プロダクトを設計するとき、各バイト・各 CPU サイクル・各 HTTP リクエストには**炭素コスト**があります。サステナビリティは:
- **倫理的責任** (気候危機への寄与を減らす)
- **コスト削減** (クラウド料金・ユーザーの通信費)
- **UX 向上** (軽い = 速い、特に途上国・モバイル)
- **規制対応** (EU CSRD, GHG Protocol 等)

## Green Software Principles (Green Software Foundation)

### 1. Carbon Efficiency

排出量あたりの**価値を最大化**する。同じ機能なら少ないエネルギーで。

### 2. Energy Efficiency

電力消費を最小化。アルゴリズム改善、不要な計算の削減。

### 3. Carbon Awareness

電力の**炭素強度は時間と地域で変わる**。
- 太陽光発電が強い昼間にバッチ処理
- 火力中心の地域より再エネ地域のリージョンを選ぶ
- "Demand shifting / shaping" で電力ピークを避ける

### 4. Hardware Efficiency

ハードウェアの**製造**もエネルギーを使う。古い端末で動くソフトを作ることで、買い替えサイクルを延ばす。

### 5. Measurement

> "You can't improve what you can't measure."

ベースラインを取り、改善を追跡する。

## コーディング側の実践

### アルゴリズム

不要な計算を消す。O(n²) → O(n log n) は文字通り**電力を節約**する。
→ [[../10-Coding/Performance]]

### バンドルサイズ

```
JS 1MB を 1 万人が DL = 10GB 転送 + 全クライアントの解析コスト
```

依存削減、tree-shaking、コードスプリッティング。

### キャッシュ

CDN, ブラウザキャッシュ, アプリキャッシュ ── 同じデータを**何度も**取らせない。

### サーバーリソース

- Auto-scaling で**過剰プロビジョン**を避ける
- 低トラフィック時に**スケールダウン**
- ARM ベース CPU (Graviton, Ampere) は**ワットあたり性能**が高い
- スポット/プリエンプティブインスタンスを再エネリージョンで

### クラウドリージョン選択

リージョンによって電力源が異なる:
- ◎ Norway, Sweden, Quebec (水力)
- ○ France, Ontario (原子力主体)
- × 石炭依存リージョン

AWS / GCP / Azure はリージョンごとの**炭素データ**を公開している。

### Data Residency と Edge

- **Edge** で処理 = データセンター帯域削減
- Region は**ユーザーに近く** = レイテンシ + 帯域
- 不要なログ・トラッキングを送信しない

### ストレージ

- 古いデータを **アーカイブ層**へ (S3 Glacier 等)
- 不要なデータを**削除** (GDPR 削除権とも整合)
- データの重複を排除

### Cron / バッチ

毎分 cron が空回りするだけでも年単位で見ると無駄。**頻度を見直す**。

### ロギング・監視

冗長なログは**ストレージとネットワーク**を消費。サンプリング、レベル管理。
→ [[../10-Coding/Observability]]

## デザイン側の実践

### 1. 画像

最大の節電ポイント:
- WebP / AVIF (JPEG/PNG より 30-50% 小)
- 適切なサイズ (4K 画像を 200px に表示しない)
- `srcset` でデバイス対応
- 不要なヒーロー動画

### 2. フォント

- ファミリー数を絞る
- サブセット化 (日本語は特に大きい)
- Variable Font

### 3. 動画

- 自動再生を避ける
- 低画質をデフォルト、ユーザーが選んで HD
- 動きの少ない演出は GIF/動画より CSS

### 4. ダークモード

OLED ディスプレイで**消費電力を 30-60% 削減**。デフォルトは難しいが、提供する価値あり。
→ [[../20-Design/Dark-Mode]]

### 5. アニメーション

過剰なアニメは GPU を回し続ける。
- 必要箇所だけ
- `prefers-reduced-motion` を尊重
- → [[../20-Design/Motion-System]]

### 6. 第三者スクリプト

タグマネージャ・解析・広告 が**ページ重量の半分**を占めることも。
- 必要性を継続的に問う
- async/defer
- 同等機能の軽量版に置換

## 計測

### 主要ツール

- **WebsiteCarbon.com** (https://www.websitecarbon.com/) — 1 ページの推定 CO2
- **Cloud Carbon Footprint** (オープンソース) — クラウド請求から CO2 換算
- **Lighthouse** Performance & Best Practices — 副次的に環境負荷指標
- **Beacon** by WHOLEGRAIN — Sustainable Web Design framework

### Sustainable Web Design Model

```
Per visit CO2 ≈ data * energy intensity * carbon intensity
```

主要要素:
- データ転送量 (バイト)
- 端末の電力効率
- 電力源の炭素強度

### 内部指標

- ページ重量 (KB) のダッシュボード
- バンドルサイズの**回帰検出** (size-limit)
- API レスポンスサイズの監視

## Green UX のパターン

### Default to Less

「**少ないほうをデフォルト**」に:
- 動画は静止画から始まり、押すと再生
- 高解像度は明示的に選ぶ
- 自動再生・自動更新は OFF
- メール通知頻度は控えめ

### Slower Internet First

低速回線・古い端末を**第一の対象**にすると、結果的に環境負荷も下がる。
→ [[Inclusive-Design]]

### Awareness Patterns

ユーザーに**消費を見せる**:
- メールに「このメッセージは X g CO2」(controversial だが意識化)
- ストレージ使用量
- 配送方法の環境影響

### Longevity

ソフトウェアの**長寿命化**:
- 古いブラウザサポート (合理的範囲で)
- 依存の少ないコード
- 標準準拠 (Web Components, Web Standards)

ハードウェア買い替えを促進する**機能爆食い**は逆効果。

## ビジネスとの両立

「サステナビリティ vs 利益」は擬似対立:

- **コスト削減**: クラウド請求が減る、CDN 帯域が減る
- **UX 向上**: 速いサイトは離脱率が下がる
- **マーケット拡大**: 低速回線地域でも使える
- **採用効果**: 環境意識のある人材を引きつける
- **規制リスク低減**: EU の DPP, CSRD 対応

「Green = High Cost」ではない。**速さと節電は同じ方向**。

## 倫理的な落とし穴 (Greenwashing)

```
× "炭素中立!" だが内訳は不明 (オフセット頼み)
× リブランドだけで実態は変えない
× サステナブル機能を訴求しつつ大容量動画を多用
```

サステナビリティは**測定 + 改善 + 透明性**。マーケティング先行は逆効果。

→ [[Ethical-Design]]

## 開発文化に組み込む

### Definition of Done

「ページ重量が予算内」「Lighthouse Performance 90+」を**完了条件**に追加。

### PR チェック

```
- バンドルサイズ +X KB → review required
- 新規依存追加 → 必要性確認
- 大きな画像 (>200KB) → 警告
```

### 四半期レビュー

ベースラインからの変化を可視化。意識的に改善するか容認するかを議論。

## アンチパターン

- 「**Green Hosting**」だけで満足 (サーバーが緑でも転送量は同じ)
- 環境負荷を**ユーザー側に押し付け**(高解像度デフォルト等)
- アニメ・動画を**装飾**として乱用
- バックエンドが古い・重い構成を放置
- 全リージョンに**同じデータ**を複製
- 計測なしの「グリーン宣言」

## チェックリスト

- [ ] ページ重量が**予算化**されているか
- [ ] 画像・フォント・第三者スクリプトを継続的に削減しているか
- [ ] **クラウドリージョン**を炭素強度で選んでいるか
- [ ] 古いデバイス / 低速回線で動くか
- [ ] ダークモード・モーション削減を提供しているか
- [ ] 不要なログ・データを保存していないか
- [ ] **Lighthouse / Carbon** スコアを CI で計測しているか

## 関連

- [[../10-Coding/Performance]]
- [[Performance-as-UX]]
- [[../30-Interface/Mobile-Patterns]]
- [[../30-Interface/Loading-States]]
- [[../20-Design/Dark-Mode]]
- [[../20-Design/Motion-System]]
- [[Inclusive-Design]]
- [[Ethical-Design]]

## 深掘り

- *Sustainable Web Design* by Tom Greenwood
- Green Software Foundation (https://greensoftware.foundation/)
- Wholegrain Digital, *Sustainable Web Design Manifesto*
- *Designing for Sustainability* by Tim Frick
