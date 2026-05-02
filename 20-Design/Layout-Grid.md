---
tags: [skill, design, layout]
domain: design
level: intermediate
---

# レイアウトとグリッド

## 一行で

> グリッドは「**判断を減らす器**」。配置の自由を制約することで一貫性と速度を生む。

## なぜ重要か

毎回ゼロからレイアウトを決めると、デザイナーごとに位置がぶれ、コードでも実装が散乱します。グリッドは**共有された幾何学的な合意**として、配置決定を「セルのどれを使うか」に圧縮します。

## グリッドの種類

### 1. カラムグリッド (Column Grid)

縦のカラムで割る。Web で最も一般的。
- 12 カラム: 2/3/4/6/12 で割れて柔軟
- 8 / 16 カラムも稀に
- ガター(カラム間の余白)= 16/24/32 px のいずれか

### 2. モジュラーグリッド (Modular Grid)

縦と横の両方で割る。雑誌・ダッシュボードに有効。

### 3. ベースライングリッド

縦方向のリズムを統一する。テキスト主体のメディアで効く。
→ [[Spacing-Rhythm#縦のリズム-vertical-rhythm|縦のリズム]]

### 4. マンハッタングリッド (流体)

固定カラムをやめ、**Flex/Grid のオートサイジング**で流す現代的な手法。
- CSS Grid の `repeat(auto-fit, minmax(280px, 1fr))` で**自動折返し**

## 主要レイアウトパターン

### Holy Grail

```
┌─────────────────────────────────┐
│            Header               │
├──────┬───────────────┬──────────┤
│ Nav  │    Content    │  Aside   │
├──────┴───────────────┴──────────┤
│            Footer               │
└─────────────────────────────────┘
```

CSS Grid で簡潔に書ける:

```css
.layout {
  display: grid;
  grid-template-areas:
    "h h h"
    "n c a"
    "f f f";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### カードグリッド

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
```

カード幅が `260px` を下回らない範囲で**自動折り返し**。レスポンシブ対応が無料で付いてくる。

### スタックとクラスタ(Every Layout)

- **Stack**: 子を縦に並べる
- **Cluster**: 子を横に折り返しありで並べる
- **Sidebar**: 一方が固定、他方が伸縮
- **Switcher**: 幅に応じて横→縦に切り替わる
- **Cover**: ビューポート高をカバーするヒーロー

これらの**プリミティブ**を組み合わせるとあらゆる UI が組める(→ Heydon Pickering / Andy Bell, *Every Layout*)。

## ブレークポイント

```
mobile:    0–639
tablet:    640–1023
desktop:   1024–1279
wide:      1280+
```

ただし、これは**目安**。**デザインの破綻点**を観察してブレークポイントを決めるのが本筋(コンテンツドリブン)。

## レスポンシブの考え方

- **モバイルファースト**: 小さい画面の制約は大きい画面で解ける。逆は難しい
- **絶対値より相対値**: `px` よりも `rem`, `%`, `clamp()` を中心に
- **コンテナクエリ**: ビューポートではなく**親要素サイズ**で切り替える(現代 CSS の福音)

```css
@container (min-width: 600px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

## CSS Grid vs Flexbox の使い分け

| 状況 | 選択 |
|---|---|
| 二次元レイアウト(行と列の両方を制御) | **Grid** |
| 一次元レイアウト(行 or 列だけ) | **Flexbox** |
| 不定数の子要素を並べる | Flexbox / `grid auto-fit` |
| 全体の骨格 | Grid |
| コンポーネント内部 | Flexbox |

両者は**競合しない**。骨格に Grid、内部に Flex のように組み合わせる。

## 中央寄せの罠

歴史的悪夢だった「縦中央寄せ」も今や:

```css
.center { display: grid; place-items: center; }
```

旧来の `position: absolute; top: 50%; transform: translate(-50%, -50%)` を使う必要はもう無い。

## アンチパターン

- **グリッドからはみ出す**要素が多い(ピクセル合わせの限界)
- ブレークポイントが**機種固有値**(iPhone X の幅とか)
- 横スクロールが**意図せず**発生する(`overflow` 漏れ)
- 1200px 固定で**ウルトラワイドで間抜け**になる
- 子要素ごとに `margin` を別個指定して**リズムが乱れる**(`gap` を使う)

## チェックリスト

- [ ] 全ページが**共通のグリッド**に乗っているか
- [ ] ブレークポイントは**コンテンツの破綻点**で決まっているか
- [ ] スマホ・タブレット・デスクトップで実機確認したか
- [ ] CSS Grid と Flexbox を**用途で使い分け**ているか
- [ ] `gap` を使い `margin` の積み重ねを避けているか

## 関連

- [[Visual-Hierarchy]]
- [[Spacing-Rhythm]]
- [[Design-Tokens]]
- [[../30-Interface/Responsive-Design]]

## 深掘り

- Heydon Pickering & Andy Bell, *Every Layout* (https://every-layout.dev)
- Rachel Andrew, *The New CSS Layout*
