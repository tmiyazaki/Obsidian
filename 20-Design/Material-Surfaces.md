---
tags: [skill, design, material, surface, expression]
domain: design
level: intermediate
---

# マテリアルとサーフェス (Glass / Gradient / Noise / Texture)

## 一行で

> フラットの**次の表現語彙**。光・透明・粒子・質感を**意味の運搬**に使う。

## なぜ重要か

完全フラットは**情報密度には強い**が、**温度がない**。人間は質感(光沢・粗さ・透明さ・厚み)から多くの情報を読み取ります。マテリアル表現は:
- 階層を**物理的**に伝える(浮く・沈む)
- ブランドの**温度**を表す
- インタラクティブ性を**示唆**する
- 単調な UI に**生命**を与える

ただし**装飾の濫用**は機能を覆い隠す。意味と効果の対応を保つ。

## 主要な表現様式

### 1. グラスモーフィズム (Glassmorphism)

半透明 + ぼかし。背景が**透けて見える**。

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

向く場面:
- ナビバー(背景の動画・写真が下にある)
- モーダル
- カードオーバーレイ

注意:
- **コントラスト不足**になりがち → ARIA / 文字色を慎重に
- パフォーマンス(blur は GPU に乗るが安くない)
- 背景が**白い時に消える**

### 2. グラデーションメッシュ

複数のカラーポイントを**滑らかに混ぜる**。Stripe / Linear のヒーローで定番。

```css
.mesh {
  background:
    radial-gradient(at 20% 30%, hsla(280,100%,74%,1) 0px, transparent 50%),
    radial-gradient(at 80% 0%,  hsla(189,100%,56%,1) 0px, transparent 50%),
    radial-gradient(at 0% 50%,  hsla(355,100%,93%,1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%);
}
```

長所:
- 軽量(CSS だけ)
- ブランド色から派生可能
- 動的(animate も可)

ツール:
- meshgradient.com (生成)
- WebGL Shader で**動かす**(Linear のヒーロー)

### 3. ノイズテクスチャ

均一な色面に**微粒子**を加える ─ デジタル感を和らげる。

```html
<svg style="filter: contrast(170%) brightness(1000%);">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15" />
</svg>
```

CSS で重ねる:

```css
.surface::after {
  content: ""; position: absolute; inset: 0;
  background: url("data:image/svg+xml;...");
  mix-blend-mode: overlay; opacity: 0.05;
  pointer-events: none;
}
```

「**バンディング**」(グラデの縞)を消す効果も。

### 4. シャドウとエレベーション

階層を**浮かす**:

```
elevation-0:  なし
elevation-1:  小カード        box-shadow: 0 1px 2px rgba(0,0,0,.05)
elevation-2:  ボタン浮き       0 2px 4px rgba(0,0,0,.08)
elevation-4:  メニュー         0 4px 12px rgba(0,0,0,.10)
elevation-8:  モーダル         0 8px 24px rgba(0,0,0,.16)
elevation-16: ポップオーバー    0 16px 48px rgba(0,0,0,.20)
```

トークン化 → [[Design-Tokens]]

注意:
- ダークモードで影は見えにくい → **明度差**で奥行き
- 多層シャドウ (`box-shadow: shadow1, shadow2`) で柔らかく

### 5. ニューモーフィズム

光と影で**押し込まれた**形を表現。流行ったが**アクセシビリティ最悪**。

```
凸: 上から光、下に影
凹: 下から光、上に影
```

問題:
- コントラストが**極めて低い**(WCAG 違反になりがち)
- ボタンか飾りか**区別不可能**
- ダークモード対応困難

→ 限定的・装飾的に。**業務系では避ける**。

### 6. クレイモーフィズム

柔らかい立体感、パステルカラー、丸み。

```css
.clay {
  background: #B8C0FF;
  box-shadow:
    -10px -10px 30px rgba(255,255,255,0.5),
    10px 10px 30px rgba(0,0,0,0.1);
  border-radius: 32px;
}
```

イラスト・遊びある UI に向く。

### 7. ホログラフィック / イリッジセント

虹色グラデ、見る角度で色が変わる質感。

```css
.holo {
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(0, 132, 255, .4) 30%,
    rgba(216, 0, 255, .4) 60%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shift 5s linear infinite;
}
@keyframes shift { to { background-position: -200% 0; } }
```

NFT・暗号系・若年層ブランドで定番。

### 8. ボロノイ・モザイクパターン

幾何学的な分割模様。背景・装飾。
SVG / Canvas で生成。

→ [[Generative-Procedural]]

### 9. アニメーテッドメッシュ

WebGL でグラデ点が動く。Stripe・Linear・OpenAI の背景。
**60fps × 高解像度**で滑らかさが命。

### 10. グレイン / フィルムノイズ (動画系)

`filter: contrast() blur()` の組合せでフィルム感。

## 「**フラット 2.0**」と現代の中庸

完全フラットは退屈、過剰スキューモーフィズムは時代遅れ。**中間的表現**が今:

- 微細な影 (1-2px)
- 微妙な内部ハイライト
- 角丸 (8-16px)
- 柔らかいグラデ (背景・ボタン)
- 微かな半透明

「**気付かないが、無いと寂しい**」レベル。

## エフェクトのトークン化

→ [[Design-Tokens]]

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,.10);
  --shadow-lg: 0 8px 24px rgba(0,0,0,.16);
  --shadow-xl: 0 16px 48px rgba(0,0,0,.20);

  --blur-sm: blur(4px);
  --blur-md: blur(16px);
  --blur-lg: blur(32px);

  --grain: url("data:image/svg+xml;...");
}
```

エフェクトもトークンで統一する。「ここだけ別の影」を防ぐ。

## ブレンドモード

要素を**ピクセルで合成**:

```css
.element {
  mix-blend-mode: difference;  /* 背景と差分 */
  mix-blend-mode: multiply;    /* 暗くなる */
  mix-blend-mode: screen;      /* 明るくなる */
  mix-blend-mode: overlay;     /* コントラスト強調 */
}
```

タイトル + 背景写真の合成で**写真の色に追従**するテキスト効果。

## クリップとマスク

```css
.shape { clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%); }
.mask  { mask-image: linear-gradient(to bottom, black, transparent); }
```

長方形以外の表現。グラデ消えるエッジ、変則的な切り抜き。

## アクセシビリティ

→ [[../30-Interface/Accessibility]]

マテリアル表現は**コントラストを下げる**ことが多い:

- グラスモーフィズムのテキスト → **背景と十分なコントラスト**
- 透明度を上げると **WCAG 違反**
- アニメ付きメッシュは `prefers-reduced-motion` でオフ
- グレイン/ノイズは控えめに(視覚過敏ユーザーへの配慮)
- フォーカスインジケータが**マテリアルに紛れない**

## パフォーマンス

→ [[../10-Coding/Performance]] / [[../40-Bridge/Sustainability]]

- `backdrop-filter` は GPU に乗るが**安くない**(モバイルで遅延)
- アニメ付きメッシュは**バッテリー食う**
- ノイズ SVG は**インライン data-url** が軽い
- 多段シャドウは render を遅くする

## ダークモード

→ [[Dark-Mode]]

- グラスは**暗い背景の上**で映える
- 影は**明度差**に置き換え
- グラデは彩度を下げる
- ノイズは**強める**(暗背景でフラットになりがち)

## アンチパターン

- 全 UI でグラスモーフィズム → 何が手前か不明
- ニューモーフィズムでボタンと飾りが**区別不能**
- 派手なグラデで**読み取れない**テキスト
- 過剰アニメ背景でバッテリー枯渇
- マテリアル表現で**情報密度の高い画面**を覆う(ダッシュボード等)
- 「流行り」を**ブランドと無関係に**採用

## チェックリスト

- [ ] マテリアル表現が**意味**(階層・温度・状態)を運んでいるか
- [ ] コントラスト比 (WCAG AA) を満たすか
- [ ] エフェクトが**トークン化**されているか
- [ ] `prefers-reduced-motion` を尊重しているか
- [ ] モバイル / 低スペックで**フォールバック**するか
- [ ] ダークモードでも**整合**するか

## 関連

- [[Visual-Hierarchy]]
- [[Color-Theory]]
- [[Design-Tokens]]
- [[Dark-Mode]]
- [[Motion-System]]
- [[Editorial-Expressive-Layouts]]
- [[Creative-Coding-Canvas-WebGL]]
- [[../30-Interface/Accessibility]]

## 深掘り

- *Refactoring UI* by Adam Wathan & Steve Schoger
- Apple HIG, *Materials* section (Vibrancy)
- Material Design 3 *Surfaces*
- Linear / Stripe / Vercel のデザイン解説記事
- Mesh gradient generator: meshgradient.com / mesher.app
