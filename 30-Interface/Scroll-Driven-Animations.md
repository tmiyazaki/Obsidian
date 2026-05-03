---
tags: [skill, interface, animation, scroll, expression]
domain: interface
level: intermediate
---

# スクロール駆動アニメーション

## 一行で

> スクロール量を「**時間軸**」として扱うと、**ユーザーが速度を握る**インタラクションが生まれる。読み手主導の物語装置。

## なぜ重要か

通常のアニメーションは**時間が進む**が、スクロール駆動は**ユーザーがスクロール量を制御**します:
- ゆっくり読みたい人は遅く
- 速読の人は速く
- 戻ってもう一度見られる
- アニメ全体が**操作の一部**

ユーザーが**「自分で動かしている」感覚**を持てる、現代的な表現手法。

## 実装手法 4 つ

### 1. CSS Scroll-Driven Animations (新)

JS なし、CSS だけで:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-section {
  animation: fade-up linear;
  animation-timeline: view();        /* 要素のスクロール位置に連動 */
  animation-range: entry 0% cover 30%;
}
```

### Timeline の種類

- `view()`: **要素自体**のスクロール位置(視野に入る・出る)
- `scroll()`: **スクロールコンテナ**全体の位置

### Range の指定

```css
animation-range: entry 0% cover 50%;
/*
  entry: 要素が視野に入り始める瞬間 (0%)
  cover: 要素が視野を埋め尽くす瞬間 (50%)
*/
```

ブラウザ対応: Chrome/Edge は対応、Safari/Firefox は順次。プログレッシブエンハンスメントで使う。

### 2. IntersectionObserver

要素が**視野に入った瞬間**のトリガ(スクロール量との連続的な連動ではない):

```ts
const obs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("visible");
  }
}, { threshold: [0, 0.5, 1] });

document.querySelectorAll(".fade-in").forEach(el => obs.observe(el));
```

```css
.fade-in { opacity: 0; transform: translateY(30px); transition: 0.6s; }
.fade-in.visible { opacity: 1; transform: none; }
```

最も互換性が高く、シンプル。**fade-in / カウントアップ**で十分なら IO でよい。

### 3. JS でスクロール量に追従 (scrub)

連続的にプロパティを更新:

```ts
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  hero.style.transform = `translateY(${y * 0.5}px)`; // パララックス
});
```

⚠️ scroll イベントは**毎フレーム発火しない**ことがある。RAF で再描画:

```ts
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      hero.style.transform = `translateY(${window.scrollY * 0.5}px)`;
      ticking = false;
    });
    ticking = true;
  }
});
```

### 4. GSAP ScrollTrigger / Framer Motion useScroll

複雑なシーケンス・pin・scrub に対応:

```tsx
import { useScroll, useTransform, motion } from "framer-motion";

function Parallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  return <motion.div style={{ y }} />;
}
```

GSAP:

```ts
gsap.to(".chart", {
  scrollTrigger: { trigger: ".chart", start: "top center", end: "bottom center", scrub: true, pin: true },
  scale: 2,
});
```

## パターン集

### パララックス

スクロール速度の**異なる**複数レイヤ:

```css
.bg     { animation-timeline: view(); animation-name: slow; }
.middle { animation-timeline: view(); animation-name: medium; }
.front  { animation-timeline: view(); animation-name: fast; }
```

「奥行き」を錯覚させる。控えめにすると上品、過剰だと酔う。

### Reveal-on-Scroll

要素が見えたら**フェード + スライド**で出現:

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  animation: reveal linear forwards;
  animation-timeline: view();
  animation-range: entry 0% cover 20%;
}
@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}
```

最も基本的で、ほぼあらゆる LP で使える。

### Sticky + 内部進行

セクションを固定して、内部要素が進行:

```css
.section { position: sticky; top: 0; height: 100vh; }
.section .visual { /* スクロール量で変形 */ }
```

データジャーナリズム・スクロールテリングの定番。
→ [[Motion-Storytelling]]

### プログレスバー

ページ全体の**読み進み**を表示:

```css
.progress {
  position: fixed; top: 0; left: 0; height: 4px;
  background: var(--accent);
  transform-origin: left;
  animation: progress linear;
  animation-timeline: scroll();
}
@keyframes progress {
  to { transform: scaleX(1); }
}
```

長文記事で「あとどれくらい?」の不安解消。

### スクロールスクロール (連動カルーセル)

縦スクロール = 横スライド:

```css
.gallery {
  display: flex;
  animation: pan linear;
  animation-timeline: scroll();
}
@keyframes pan {
  to { transform: translateX(-80%); }
}
```

横一覧をスクロール演出に。

### カウントアップ

スクロール量に応じて数値:

```ts
const obs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const target = 1234;
    let cur = 0;
    const step = () => {
      cur = Math.min(target, cur + Math.ceil((target - cur) / 10));
      el.textContent = cur.toLocaleString();
      if (cur < target) requestAnimationFrame(step);
    };
    step();
  }
});
```

統計の見出しで使うと**インパクト大**。

### スクロール反応の色変化

セクションごとに**ブランド色が変わる**:

```css
body { transition: background-color 0.5s; }
```

```ts
const obs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      document.body.style.backgroundColor = e.target.dataset.bg;
    }
  }
}, { threshold: 0.5 });
```

雑誌ページの「**章が変わった**」感覚。

## 倫理とアクセシビリティ

→ [[Accessibility]]

スクロール駆動演出の**罠**:
- パララックス → **乗り物酔い**
- 滑らかすぎるスクロール → **検索 (Cmd+F) が動かない**
- pin が長い → **戻れない**錯覚
- 演出待ちで**情報到達が遅い**

対策:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
  .parallax { transform: none !important; }
}
```

すべての装飾アニメに `prefers-reduced-motion` 分岐を持たせる。

## モバイル特有の罠

→ [[Mobile-Patterns]]

- iOS の**慣性スクロール**と JS scrub が干渉
- アドレスバーの伸縮で**ビューポート変動** → `100dvh`
- スクロールに重い処理を載せると**カクつく**
- pin が**キーボード表示**で崩れる

## パフォーマンス

→ [[../10-Coding/Performance]]

- `transform / opacity` のみ(GPU 合成)
- scroll イベント直接ではなく **RAF ラップ**
- IntersectionObserver は**自動最適化**(scroll より軽い)
- 視野外の要素を**計算しない**
- CSS Scroll-Driven は**最速**(JS スレッドを使わない)

## 検索可能性

慣性スクロールを乗っ取ると **Cmd+F (検索)** が壊れることがある。
- ネイティブスクロールを尊重
- カスタムスクロール (Lenis 等) は**フォールバック**を用意

## アンチパターン

- パララックスが**主要 CTA を覆う**
- 全要素が**fade-in** で読み込みが遅く感じる
- スクロールで**情報の到達順**が固定 → 戻りにくい
- 複雑な scrub で**バッテリー食う**
- `prefers-reduced-motion` 無視
- スクロールジャック(ユーザー意図と異なる動き)
- 重要操作 (購入ボタン) が**スクロール最後**

## チェックリスト

- [ ] アニメに**意味**(階層・物語・誘導)があるか
- [ ] `prefers-reduced-motion` で**静的**になるか
- [ ] **GPU 合成プロパティ**だけ使っているか
- [ ] 主要 CTA が**早めに**到達できるか
- [ ] モバイル / 低スペックでも**カクつかない**か
- [ ] Cmd+F・キーボードナビが機能するか

## 関連

- [[Motion-Storytelling]]
- [[Microinteractions]]
- [[../20-Design/Motion-System]]
- [[../20-Design/Editorial-Expressive-Layouts]]
- [[Mobile-Patterns]]
- [[Accessibility]]
- [[../10-Coding/Performance]]

## 深掘り

- *CSS Scroll-Driven Animations* (Bramus van Damme の解説)
- GSAP ScrollTrigger documentation
- Framer Motion Scroll API
- "Scroll-driven Animations" demos: scroll-driven-animations.style
- *Practical SVG* by Chris Coyier
