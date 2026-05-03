---
tags: [skill, design, typography, expression]
domain: design
level: advanced
---

# 可変フォントによるタイポ表現

## 一行で

> 可変フォント (Variable Font) は「**1 ファイルに無段階のウェイト・幅・傾き・光学サイズ**」を含む。文字を**動かす・呼吸させる**表現が可能に。

## なぜ重要か

従来のフォントは「Regular / Bold / Light」と**離散的**で、ファイル数も多くダウンロードが重い。Variable Font は:
- **1 ファイル**で全ウェイト・幅
- 中間値も**任意**(weight 437 等)
- **アニメート可能**(text の wght が動く)
- 光学サイズ (`opsz`) で**サイズに応じた最適化**

タイポを**動的なメディア**として扱える。

## 軸 (Axes) の世界

可変フォントは「**軸**」を持つ:

### 標準軸 (5 つ)

```
wght (Weight)   100-900     太さ
wdth (Width)    50-200      幅
slnt (Slant)    -90-0       斜体度合
ital (Italic)   0-1         イタリック切替
opsz (Optical)  6-72        光学サイズ
```

### カスタム軸

フォント作者が独自に追加:
- `GRAD` (グレード - ウェイトを変えずに濃さ調整)
- `MONO` (等幅度合)
- `CASL` (カジュアル度)
- `CRSV` (筆記体度)

例: Recursive (font.recursive.design) は `MONO`, `CASL`, `wght`, `slnt` を持つ。

## CSS での使い方

### 基本

```css
@font-face {
  font-family: "Inter";
  src: url("/Inter.var.woff2") format("woff2-variations");
  font-weight: 100 900;   /* ウェイトの範囲を宣言 */
  font-style: oblique 0deg 14deg;
}

h1 { font-weight: 730; font-stretch: 110%; }
```

### `font-variation-settings`

カスタム軸も含めて:

```css
.headline {
  font-variation-settings:
    "wght" 850,
    "wdth" 120,
    "GRAD" 50;
}
```

### アニメート

```css
.morph {
  transition: font-variation-settings 0.3s ease;
}
.morph:hover {
  font-variation-settings: "wght" 900, "wdth" 120;
}
```

ボタン hover で**文字が太く広がる**演出など。

## 表現例

### 1. ホバーで膨らむ文字

```css
nav a {
  font-variation-settings: "wght" 400;
  transition: 0.2s;
}
nav a:hover {
  font-variation-settings: "wght" 700;
}
```

### 2. スクロールで太くなるタイトル

```ts
window.addEventListener("scroll", () => {
  const w = Math.min(900, 400 + window.scrollY);
  title.style.fontVariationSettings = `"wght" ${w}`;
});
```

### 3. オーディオに反応する文字 (ライブ)

音量に応じて `wght` を上下:

```ts
analyser.getByteFrequencyData(data);
const volume = avg(data);
text.style.fontVariationSettings = `"wght" ${100 + volume * 3}`;
```

### 4. マウス位置で軸が連動

カーソル X 座標 → `wdth`、Y 座標 → `wght` で**文字が触感を持つ**。

### 5. レスポンシブ・タイポ

ビューポートに応じて軸も変える:

```css
h1 {
  font-size: clamp(2rem, 8vw, 6rem);
  font-variation-settings:
    "wght" calc(400 + (100vw - 320px) * 0.5),
    "opsz" calc(12 + (100vw - 320px) * 0.05);
}
```

幅が広がる = 太く・光学サイズ大、幅が狭まる = 細く・光学サイズ小。

## 光学サイズ (`opsz`) の重要性

伝統的な活字では、**サイズによってデザインを変える**:
- 小さい本文用: 字幅広め、コントラスト弱め、x-height 高い (読みやすい)
- 大きい見出し用: 字幅狭く、コントラスト強い、優雅

Variable font の `opsz` は**自動でこの調整**を行う:

```css
h1 { font-size: 4rem; font-optical-sizing: auto; }
p  { font-size: 1rem; font-optical-sizing: auto; }
```

サイズに応じて自動的にデザインが切り替わる。**読みやすさが上がる**。

## アニメーションの倫理

過剰な可動タイプは**読みにくい・酔う**:
- 本文に変動アニメは**避ける**
- 見出し・装飾に**短い時間**で
- `prefers-reduced-motion` で**即座に静的**に
- 視覚過敏ユーザーへの配慮

→ [[../30-Interface/Accessibility]]

## カラーフォント

可変フォントとは別軸で「**色付き**フォント」も実用化:
- COLR テーブル (WindowsやAdobe支援)
- SVG-in-OpenType
- 絵文字フォント (Apple Color Emoji, Noto Color Emoji)

ヘッダなどで**虹色の文字**を**自然に**配置可能。

## ブランドにおける可変フォント

ブランドフォントを Variable で持つと:
- 「ロゴだけ太く」「動画タイトルだけ広く」を**ファイル追加なしに**
- アニメーションロゴ
- レスポンシブ太さ

カスタムフォントの設計コストは大きいが、ブランドが大規模に展開するなら**投資価値高い**。

→ [[Brand-Voice]]

## Web フォント配信

```html
<link
  rel="preload"
  href="/Inter.var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

- `preload` で初期描画を早く
- `font-display: swap` で FOIT を回避
- サブセット化 (日本語は特に)

→ [[Typography]]

## ツール

- **Wakamai Fondue**: フォント解析 (どんな軸を持つか)
- **Fontsource**: NPM パッケージ化された Variable Font
- **Variable Font 一覧**: v-fonts.com
- **Glyphs / FontLab**: フォント制作 (高度)
- **Recursive**, **Inter**, **Roboto Flex**, **Source Sans 3** が代表例

## 日本語の Variable Font

英文より遅れているが拡大中:
- **Noto Sans JP Variable** (Google)
- **GT Pressura JP**
- **Dela Gothic One** (実験的)

日本語は文字数が多くファイルが大きい → **サブセット化** + Variable で軸が増えると**バランス**が課題。

## アンチパターン

- 本文に**動くタイプ**で読み手疲弊
- 軸を**意味なく**動かす
- `prefers-reduced-motion` を無視
- 巨大な Variable フォントを**全ページで**ロード
- カラーフォントが**SR で読めない**
- ブランドの**規範を超えた**可動範囲

## チェックリスト

- [ ] 可変軸が**ブランドの語彙**に沿うか
- [ ] アニメに**意味**(注目・階層・物語)があるか
- [ ] `prefers-reduced-motion` で静的化するか
- [ ] **本文には適用していない**か
- [ ] サブセット化・preload でパフォーマンスを保つか

## 関連

- [[Typography]]
- [[Motion-System]]
- [[Brand-Voice]]
- [[Editorial-Expressive-Layouts]]
- [[../30-Interface/Accessibility]]
- [[../30-Interface/Motion-Storytelling]]

## 深掘り

- *Variable Fonts* by Microsoft / Google
- Mandy Michael の Variable Font 実験集 (codepen.io/mandymichael)
- Susanna Zaraysky on Optical Sizing
- v-fonts.com (一覧)
- *The Anatomy of Type* by Stephen Coles
