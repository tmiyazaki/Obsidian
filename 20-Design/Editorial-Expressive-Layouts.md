---
tags: [skill, design, layout, expression]
domain: design
level: intermediate
---

# 編集的・表現的レイアウト

## 一行で

> 「**カラム整列の量産品**」を超え、雑誌・ポスターの**編集設計**から学ぶ。意図的な**破調**で意味を運ぶ。

## なぜ重要か

業務 SaaS ・E コマースは整列したグリッドで完結します。ただし、**メディア・ブランド・LP・記事**では「整列の安心感」より「**この記事の世界観**」が優先されます。編集的レイアウトの語彙を持つと:
- ヒーローページが**記憶に残る**
- ブランドの**個性**が画面に乗る
- 同じ情報が「平凡」から「**心に届く**」になる

## 整列とリズム vs 破調

```
整列 (デフォルト):    安心 / プロらしさ / 効率
破調 (意図的逸脱):    個性 / 注意喚起 / 物語性
```

両者は対立ではなく**配合**。基準としての整列があるからこそ、**逸脱が意味を持つ**。
全画面が破調 = ノイズ、全画面が整列 = 退屈。

## 編集デザインの語彙

### 1. アシンメトリ

完全対称は安定だが**退屈**。意図的な非対称は**動き**を生む。

```
[ 大きい画像  ][ ⌐ ]
[            ][ 短いテキスト ]
[            ][ 余白         ]
[            ][ 小さなロゴ    ]
```

### 2. 大きすぎる文字 (Type as Image)

ヒーローでタイトルを**画面いっぱい**に。文字が**画**になる:

```
┌───────────────────────────┐
│                            │
│   B I G                    │
│   T Y P E                  │
│                            │
│   小さな本文…              │
└───────────────────────────┘
```

CSS: `font-size: clamp(4rem, 15vw, 20rem); line-height: 0.85;`

### 3. グリッドの破壊

12 カラムグリッドを基準にしつつ、**カラムを跨ぐ**配置:

```
[ - - - - - - - - - - - - ]
[       T E X T            ]
[                          ]
[ - - - 写真 - - ][ - - キャプション - ]
[ - - 写真 - - ]
```

「ベースとなるグリッドはあるが、**重要要素だけ**はみ出す」。

### 4. ホワイトスペースの大胆な使用

中央に小さく要素を 1 つだけ。**周囲の余白**で世界観を作る。

→ [[Spacing-Rhythm]]

### 5. 重ね (Layering)

要素を**重ね合わせる**:
- 写真の上に大きな文字
- 半透明グラデーションを写真に被せる
- テキストを画像の縁から**はみ出させる**

```css
.headline { mix-blend-mode: difference; color: white; }
```

### 6. 視線の誘導 (Reading Path)

`Z` パターン以外も:
- 斜めの導線
- 曲線
- 数字つきステップ
- 矢印・指示記号

意図的に**視線をデザインする**。

### 7. 絶対位置・回転

```css
.tag {
  position: absolute;
  top: -8px;
  right: -16px;
  transform: rotate(-12deg);
}
```

整列を**意図的に外す**ステッカーやバッジ。「貼り付けた感」が出る。

### 8. テキストブロックの形状

矩形以外: `shape-outside` で写真の輪郭にテキストを巻き付ける。

```css
img { float: left; shape-outside: circle(50%); }
```

### 9. スクロールでの切替

スクロール毎に**章替わり**(色・タイポ・レイアウトが変わる)。
→ [[../30-Interface/Motion-Storytelling]]

## アート/デザイン運動の語彙

借りられる視覚言語:

| 運動 | 特徴 | 現代での使われ方 |
|---|---|---|
| **Bauhaus** (独, 1919-) | 幾何学・原色 | UI の幾何学アクセント |
| **Swiss / International** | グリッド・サンセリフ・整列 | 大半の現代 UI の基礎 |
| **Brutalism** (建築) | 露骨な構造・粗削り | 実験的 LP, プログラマ的美学 |
| **Memphis** (1980s) | 派手色・奇形・パターン | 若年層向けブランド |
| **Vaporwave / Y2K** | ピンクパープル・ノスタルジー | リバイバル系 |
| **Editorial Print** | 雑誌の組版 | ブランドメディアサイト |

ブランドの方向性に応じて**ベースの語彙**を借りる。

## 現代 Web の表現フォーマット

### 1. Scrolly-Telling

スクロール = 進行。データジャーナリズム・物語型。
→ [[../30-Interface/Motion-Storytelling]]

### 2. Single Page LP (Long-Form)

縦に長く、章ごとに**世界観を変える**。

### 3. Microsite

イベント・キャンペーン用の**1〜数ページ**だけの強い表現。商用 SaaS とは別の表現を許容。

### 4. Editorial Web Magazine

紙の編集デザインを Web で再現。可変フォント、ブロックの大胆配置。例: NY Times 特集記事。

### 5. Brutalist Web Design

意図的に粗削り・標準スタイル無視。デザイナーのポートフォリオ・前衛的ブランド。

### 6. Maximalist UI

ミニマリズムの逆。情報密度・色・パターンを**多く**。Y 世代 / Z 世代向けで再注目。

## CSS の現代的支援

```css
/* Container Query で**部品単位**で破調 */
@container (min-width: 600px) {
  .hero h1 { font-size: 12vw; }
}

/* clamp() で流体タイポ */
h1 { font-size: clamp(2rem, 8vw, 10rem); }

/* aspect-ratio で写真の比率固定 */
.cover { aspect-ratio: 16/9; }

/* :has() で文脈的スタイル (子の有無で親を変える) */
article:has(img.hero) { padding-top: 0; }

/* subgrid で内部要素も親グリッドに揃える */
.list { display: grid; grid-template-columns: subgrid; }

/* Grid 名前付き Area */
.layout {
  display: grid;
  grid-template-areas:
    "title title image"
    "intro . image"
    ". body image";
}
```

→ [[Layout-Grid]]

## 整列と破調の使い分け基準

| 整列 (整然) | 破調 (表現的) |
|---|---|
| 業務系 | メディア / ブランド |
| ダッシュボード | LP / マーケ |
| 一覧・テーブル | ヒーロー / 章扉 |
| 繰り返しコンテンツ | 一点モノ |
| 機能優先 | 印象優先 |
| 大量を素早く | 深く伝える |

**1 サービス内で混在**しても良い: ダッシュは整列、マーケサイトは表現的。

## アクセシビリティ

→ [[../30-Interface/Accessibility]]

表現的レイアウトの**罠**:
- 視覚順序と DOM 順序が乖離 → SR で意味不明
- 読み上げ順序を `tabindex` や CSS Grid の order で**コントロール可能だが乖離注意**
- 重ね背景でテキスト**コントラスト不足**
- 大文字過多で読みにくい
- フォーカス可視を**装飾で消さない**

## モバイル対応

破調レイアウトはモバイルで**破綻しやすい**。最初から**モバイル変形**を設計:

- 大きすぎる文字は **縮小**
- 重なりは **積み重ね**に
- 横スクロール導線は **縦スクロール**に変形
- 装飾は**省略可能**にする

→ [[../30-Interface/Responsive-Design]]

## アンチパターン

- 全画面破調で**何が大事**か分からない
- アシンメトリを**意味なく**多用
- 写真の上に**コントラスト不足**のテキスト
- 装飾レイアウトで**機能 (検索・購入) が探しにくい**
- A11y が後付けで**SR 順序**が崩壊
- モバイルで**横スクロール**地獄
- ブランドと無関係な「流行り」の引用

## チェックリスト

- [ ] **整列の基盤**(グリッド)があった上での破調か
- [ ] 破調に**意味**(注目・物語・ブランド)があるか
- [ ] アクセシビリティ (DOM 順序・コントラスト) を満たすか
- [ ] モバイルで**変形**して機能するか
- [ ] 機能優先の領域 (フォーム・テーブル) に**侵食**していないか

## 関連

- [[Visual-Hierarchy]]
- [[Typography]]
- [[Variable-Type-Expression]]
- [[Spacing-Rhythm]]
- [[Layout-Grid]]
- [[Brand-Voice]]
- [[Material-Surfaces]]
- [[../30-Interface/Motion-Storytelling]]
- [[../30-Interface/Responsive-Design]]

## 深掘り

- Josef Müller-Brockmann, *Grid Systems in Graphic Design*
- Ellen Lupton, *Graphic Design: The New Basics*
- Massimo Vignelli, *The Vignelli Canon* (free PDF)
- Awwwards / The FWA (現代 Web 表現の最前線)
- *Brutalist Websites* (brutalistwebsites.com)
