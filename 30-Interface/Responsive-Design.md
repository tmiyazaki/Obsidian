---
tags: [skill, interface, responsive]
domain: interface
level: intermediate
---

# レスポンシブデザイン

## 一行で

> レスポンシブとは「デバイスサイズに合わせる」ではなく、「**コンテンツが破綻しないように振る舞う**」設計。

## なぜ重要か

スマホ、タブレット、ラップトップ、4K、折り畳み、TV、ウォッチ ── 単一の HTML が**未来の形を含めて**広範に動くことが Web の強み。固定幅ピクセルに最適化するのは、変化する世界に逆らう短期解。

## 4 つのアプローチ

### 1. レスポンシブ Web デザイン (RWD)

メディアクエリで**同じ HTML をブレークポイントごとに再レイアウト**する。最も主流。

### 2. アダプティブ

サーバーが**デバイスを判定**して別 HTML を返す。E コマースなど特殊用途。複雑度が高い。

### 3. モバイル/デスクトップ別サイト (m.example.com)

過去の手法。SEO・運用コストが二重化するため**現在は推奨されない**。

### 4. インストリンシック (Intrinsic Web Design) — Jen Simmons

CSS Grid / Flexbox / `clamp()` / コンテナクエリで「**コンテンツが内発的に**」最適配置を決める。メディアクエリ依存を減らす方向。

## モバイルファースト

```
モバイルから始める → デスクトップで拡張
```

理由:
- 制約が大きい → 機能の優先順位が明確になる
- パフォーマンス予算が厳しい → 軽量化を強制
- 大きい画面で崩すより、**小さい画面の制約を解放するほうが楽**

CSS 設計面では、**min-width クエリを使う累積方式**が破綻しにくい。

```css
.card { padding: 16px; }                /* モバイル基準 */
@media (min-width: 768px) {
  .card { padding: 24px; }              /* タブレット以上 */
}
@media (min-width: 1024px) {
  .card { padding: 32px; }              /* デスクトップ以上 */
}
```

## ブレークポイントの決め方

### 機種で決めない

`iPhone 14 Pro` の幅で切ると、来年の機種で破綻する。**コンテンツが破綻する幅**で切る。

### コンテンツドリブン

ブラウザを徐々に狭めて、**読みづらくなる・要素が窮屈になる**点をブレークポイントに。

### 一般的目安

```
xs:  0
sm:  640
md:  768
lg:  1024
xl:  1280
2xl: 1536
```

(Tailwind 系の慣習)。**チームで揃える**ことが肝心。

## コンテナクエリ

ビューポートではなく**親要素の幅**で切り替える:

```css
.card { container-type: inline-size; }

@container (min-width: 600px) {
  .card-content { display: grid; grid-template-columns: 1fr 2fr; }
}
```

これで**サイドバー内のカードと、メインの大きなカード**が、それぞれの親に合わせて別レイアウトになる。グローバルなビューポート判定と違い、**コンポーネント単位**でレスポンシブが完結。

## 流体タイポグラフィ

`clamp(min, ideal, max)` で**ビューポートに応じて滑らかに**サイズが変わる:

```css
h1 {
  font-size: clamp(2rem, 4vw + 1rem, 4rem);
}
```

- ビューポート狭 → 2rem
- ビューポート広 → 4rem
- 中間は 4vw + 1rem で滑らかに補間

ブレークポイント不要、デバイス境界で**カクっと**変化しない。

## 画像

```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg  400w,
    image-800.jpg  800w,
    image-1200.jpg 1200w
  "
  sizes="(min-width: 768px) 50vw, 100vw"
  alt="..."
  loading="lazy"
  width="1200" height="800"
/>
```

- `srcset/sizes` でデバイスに応じた解像度を提供
- `width/height` 属性で**レイアウトシフト防止**(CLS)
- `loading="lazy"` でビューポート外を遅延

## タッチ vs マウス

- タップ領域: 最小 **44×44px**
- ホバーが効かない前提で設計(`@media (hover: hover)` で分岐)
- iOS Safari は double tap zoom があるため `touch-action` を適切に
- `:active` 状態をモバイルでも分かるように

```css
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}
```

## 折り畳み・特殊画面

- 折り畳み (Galaxy Fold 等): ヒンジを跨ぐレイアウトに `screen-spanning`
- 横置きランドスケープ: 高さ制約があるためモーダルに注意
- ラップトップで**狭い縦**(タッチバーつき): `100vh` の罠(`100dvh` を使う)

```css
.full { height: 100dvh; } /* dynamic viewport height */
```

## アンチパターン

- 機種固有値でブレークポイント
- スマホで**横スクロール**発生
- ホバー前提のメニュー(タッチで使えない)
- 固定幅 1200px で**ウルトラワイドが寒い**
- 小さな画面で**フォントが小さくなる**(本来は逆)
- レイアウトシフト(画像 width 不在で起きる)

## チェックリスト

- [ ] 主要画面を**実機**(iPhone, Android, タブレット)で確認したか
- [ ] **横スクロール**が発生していないか
- [ ] **タップ領域** 44px 以上か
- [ ] `prefers-reduced-motion` / `prefers-color-scheme` を考慮したか
- [ ] 画像に `srcset` と `width/height` があるか
- [ ] `100vh` ではなく `100dvh` を使っているか(モバイル URL バー対策)

## 関連

- [[../20-Design/Layout-Grid]]
- [[../20-Design/Typography]]
- [[Accessibility]]
- [[../10-Coding/Performance]]
