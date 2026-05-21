---
tags: [skill, design, dataviz, theory]
domain: design
level: advanced
---

# 情報視覚化の理論 (Information Visualization Theory)

## 一行で

> 「**美しいグラフ**」より「**正確に伝わるグラフ**」を作るための**知覚の科学**と**表現の文法**。

## なぜ重要か

→ [[Data-Visualization]] が**実務寄り**なのに対し、ここは**理論**の柱:
- 人間の視覚知覚 (Cleveland-McGill ランキング)
- グラフ構築の文法 (Wilkinson, Wickham)
- 統計的視覚化 (Tufte)
- ストーリーテリング (Knaflic)

理論を知ると、「**なぜこのグラフが良いか**」が説明できる。流行・直感でなく**判断**で作れる。

## 知覚の優先順位 (Cleveland-McGill, 1984)

人間が**正確に比較できる**順:

```
1. 共通軸上の位置          ← 最高 (横棒・縦棒)
2. 異なる軸上の位置
3. 長さ
4. 角度・傾き
5. 面積
6. 体積
7. 色相 (Hue)             ← 中
8. 色濃度 (Saturation)    ← 最低
```

実用への帰結:
- **量を比較したい** → 棒グラフ
- **割合を比較したい** → 円グラフ < スタック棒 < 横棒
- **地理的分布** → 色濃度 (choropleth) は限界あり、点や数値を併用

## グラフィックスの文法 (Grammar of Graphics)

Leland Wilkinson (1999) が提唱、Hadley Wickham の `ggplot2` で実用化:

グラフは以下の**層**で構成される:

```
1. Data            ─ データセット
2. Aesthetics       ─ x, y, color, size 等のマッピング
3. Geom             ─ 形状 (point, line, bar, ...)
4. Statistics       ─ 集約 / 変換 (sum, smooth, bin)
5. Scale            ─ 値 → 視覚値の変換 (linear, log)
6. Coord            ─ 座標系 (cartesian, polar, geographic)
7. Facet            ─ 小グラフへの分割
8. Theme            ─ 視覚スタイル
```

この**直交する構成要素**を組み合わせることで、無限のグラフが系統的に作れる。

ライブラリ:
- **ggplot2** (R)
- **plotnine** (Python)
- **Vega-Lite** (JSON ベース)
- **Observable Plot** (JS, Wickham 公認)

## 視覚エンコーディング

データ型と視覚チャネルの**マッピング**:

| データ型 | 適する視覚 |
|---|---|
| 量 (numeric) | 位置、長さ、面積 |
| 順序 (ordinal) | 位置、色濃度 |
| カテゴリ (categorical) | 色相、形 |
| 時間 | x 軸位置、アニメ |
| 地理 | 地図位置 |

**型に合わない**エンコーディング = 誤読を誘う:
- カテゴリ (果物の種類) を**色濃度**で表す → 順序があるように見える
- 順序 (S/M/L) を**色相**で表す → 順序が見えない

## 視覚的整合性

### 1. 軸のスケール

棒グラフは**0 から**(差を誇張しない)。
折れ線は文脈で切ってよい (絶対値より変化が主題)。

### 2. 軸の方向

時間は左→右、上が大きい(慣習)。
逆にすると読み違える。

### 3. 縦横比 (Aspect Ratio)

折れ線グラフは **45° 法**(主要な傾きが 45° 前後になる比率):

```
データ範囲を 45° で表現できる縦横比を選ぶ
→ トレンドが知覚しやすい
```

## データ-インク比 (Tufte)

> "Above all else show the data."

不要要素を削除:
- 枠線
- 背景塗り
- 3D 効果
- 装飾
- 過剰なグリッドライン

**データに直接寄与しない**インクを削る。
ただし**ミニマリズム原理主義**は読みにくくなることも。**読み手を支える線**は残す。

## チャートジャンク

Tufte が批判:
- 3D 棒グラフ
- 立体的な円グラフ
- 不要な影
- 装飾的アイコン
- 過度なグラデーション

「**派手だが情報量が下がる**」表現を避ける。

## 嘘をつくグラフ (How to Lie with Statistics)

Darrell Huff (1954) の古典:

### 軸の切り捨て

```
売上比較 (y 軸 99-100)
A: 99.5
B: 100.0
   → 棒で B が**2 倍**に見える
```

ゼロからの軸で**実際は 0.5% 差**。

### 累積 vs 増分

「累積感染者数」のグラフは**常に増える** = 危機感を煽る。
「日次新規」が実態を伝える。

### 平均 vs 中央値

外れ値があると平均は歪む。所得分布などは**中央値**が現実的。

### 相関 ≠ 因果

「アイスクリーム売上と溺死者数が相関」 ← 共通原因 (夏)。

## 静的 vs インタラクティブ

### 静的

- 紙の出版・PDF
- 一度に**全体を見せる**
- 読み手の体験を**コントロール**

### インタラクティブ

- ホバー、ズーム、フィルタ
- 探索 (Exploratory Data Analysis)
- ストーリー駆動 (Scrollytelling)

→ [[../30-Interface/Motion-Storytelling]]

両者は**異なる目的**。インタラクティブを**プレゼンに使う**と読み手が混乱することも。

## 情報の階層的開示 (Schneiderman の Visual Information Seeking Mantra)

> "Overview first, zoom and filter, then details on demand."

```
1. 全体俯瞰        ─ 一目で全体
2. ズーム + フィルタ ─ 興味領域を絞る
3. 詳細           ─ クリックで個別データ
```

良い BI ツール (Tableau, Looker, Observable) はこの順序を尊重。

## Sparkline

Tufte 発祥の**1 行に収まる小さなグラフ**:

```
売上: ⠂⠄⠈⠐⠁⠃⠇   [今月]
```

文章中に**埋め込める**。トレンドの即時把握。
HTML: `<sparkline>` カスタム要素 or canvas で実装。

## Small Multiples

同じスケールの**小さなグラフを並べる**:

```
[Country A] [Country B] [Country C]
   chart       chart       chart
[Country D] [Country E] [Country F]
   chart       chart       chart
```

「同じ軸で N グループを比較」に強い。
1 つの 大きなグラフに 20 系列を重ねるより**遥かに読みやすい**。

## マップとカートグラム

### Choropleth

地域を**色濃度**で塗る:
- 国別 GDP、選挙結果

罠: 面積が大きい地域 (アラスカ、シベリア) が**過大に**目立つ。

### Cartogram

地域の**面積を値に応じて歪める**:
- 人口密度
- 経済規模

正確な地理は失われるが、**値の比較**は明確に。

### Dot map

点で個別データを表す。
- 犯罪発生地点
- 観測地点

### Heatmap

色濃度で密度を表現 (大量データ)。

→ [[Data-Visualization]]

## 色の使い方

→ [[Color-Theory]]

### Sequential (順序)

低 → 高 を **1 色相の明度勾配**:
- viridis (色覚配慮も)
- blues, oranges

### Diverging (発散)

中央から両方向:
- red ← white → blue
- 偏差・基準からの差

### Categorical (識別)

5-8 色までで**識別可能**:
- Okabe-Ito (色覚多様性配慮)
- D3 schemeCategory10

### 色覚多様性

8% 程度の男性が**色を区別しづらい**。
- 色だけで意味を伝えない
- パターン併用 (●○▲)
- viridis / cividis / Okabe-Ito 使用

→ [[../30-Interface/Accessibility]] / [[../40-Bridge/Inclusive-Design]]

## アニメーションの罠

「動くグラフ」は**注目を集める**が:
- **記憶に残らない**(動きは消える)
- 比較が困難
- 印刷できない

例外:
- データの**経時変化** (Hans Rosling のバブルチャート)
- スクロールテリングの**段階提示**

「動かす理由」を問う。

## ストーリーテリング

Cole Knaflic, *Storytelling with Data*:

```
1. 目的: 1 つに絞る (何を伝えたい?)
2. 文脈: 誰に、いつ、なぜ
3. メッセージ: タイトルで結論を語る
4. 注釈: 重要点を矢印・テキストで指す
5. デフォーカス: 重要でないものをグレーに
```

「データを見せる」と「**主張を支える**」は別物。

## 視覚化のプロセス

```
1. 質問を定義  ─ 何を答えたい?
2. データ収集
3. データ整形
4. 探索的分析 (EDA)  ─ 多種類のグラフで眺める
5. 主要発見 を選ぶ
6. 説明的視覚化 を作る  ─ メッセージに合わせて研ぎ澄ます
7. 検証
8. 共有
```

EDA と説明的視覚化は**別物**。前者は探索の道具、後者は伝達の道具。

## ダッシュボードと探索

→ [[../30-Interface/Dashboard-Design]]

ダッシュボードは**説明的**(主要 KPI が見える)。
探索は**インタラクティブ**(自由に切替)。
両者を混ぜると焦点が散る。

## ライブラリと選択

→ [[Data-Visualization]] / [[../40-Bridge/Tool-Stacks-Recipes]]

理論を実装に落とすときの選択:

| 用途 | 推奨 |
|---|---|
| 探索 (アドホック) | Observable Plot, Vega-Lite, R/Python |
| 標準ダッシュボード | Recharts, ECharts |
| カスタム表現 | D3, visx |
| 大量データ | deck.gl, regl |
| 地図 | Mapbox, MapLibre, deck.gl |
| 3D | Plotly, Three.js + データ |
| 出版品質 | R/ggplot2, Python/matplotlib |

## アンチパターン

- 全部 3D 円グラフ
- y 軸を**ゼロから始めない**棒
- 凡例だけで**直接ラベルなし**
- 同じスケールの**Small Multiples を使わず**重ね
- 5 系列以上の折れ線
- 色だけで意味
- データインク比を**犠牲**にする装飾
- 1 グラフで**複数主張**

## チェックリスト

- [ ] **何を伝えたいか**1 文で言えるか
- [ ] **知覚優先順位**に合った視覚要素を使ったか
- [ ] 軸が**正直**か(誇張なし)
- [ ] 色覚多様性に**配慮**したか
- [ ] チャートジャンクを**削った**か
- [ ] 主要メッセージを**タイトル・注釈で**強調したか
- [ ] **静的でも理解可能**か (アニメ依存でない)

## 関連

- [[Data-Visualization]]
- [[Color-Theory]]
- [[Visual-Hierarchy]]
- [[Typography]]
- [[../30-Interface/Dashboard-Design]]
- [[../30-Interface/Motion-Storytelling]]
- [[../30-Interface/Tables-Data-Grids]]
- [[../30-Interface/Accessibility]]
- [[../40-Bridge/Inclusive-Design]]

## 深掘り

- Edward Tufte, *The Visual Display of Quantitative Information*
- Cleveland & McGill, *Graphical Perception* (1984)
- Leland Wilkinson, *The Grammar of Graphics*
- Hadley Wickham, *ggplot2: Elegant Graphics for Data Analysis*
- Cole Nussbaumer Knaflic, *Storytelling with Data*
- Claus Wilke, *Fundamentals of Data Visualization* (free online)
- Tamara Munzner, *Visualization Analysis and Design*
- Stephen Few, *Now You See It*, *Show Me the Numbers*
