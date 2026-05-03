---
tags: [skill, interface, motion, storytelling, expression]
domain: interface
level: advanced
---

# モーションストーリーテリング (Scrollytelling / Page Transitions)

## 一行で

> スクロール・遷移・時間軸を「**ナラティブを運ぶ媒体**」として使う。情報の**順序と速度**をデザインすると、伝わり方が変わる。

## なぜ重要か

静的なページは「**全部一度に見える**」 — 情報の優先度はレイアウトでしか伝えられません。モーションストーリーテリングは:
- ユーザーの**注意の流れ**を設計
- 数値や事実に**感情の温度**を与える
- 複雑な変化を**段階的に**理解させる
- 「**読み物**」として記憶に残す

NY Times・WIRED・Apple のプロダクトページが採用する手法。

## カテゴリ

### 1. Scrollytelling

スクロール量に**ステージが連動**:
- 画像が変わる
- 数字がカウントアップ
- 図が変形する
- 章替わり

```
[Scroll 0%]   ヒーロー
   ↓
[Scroll 20%]  問題提起
   ↓
[Scroll 40%]  データ可視化(値が増える)
   ↓
[Scroll 70%]  解決策
   ↓
[Scroll 100%] CTA
```

### 2. ページトランジション

ページ間の遷移を**演出**として:
- 共通要素のモーフィング(製品画像が次ページのヒーローへ)
- フェード / スライド / シェアエレメント
- View Transitions API でブラウザネイティブ

### 3. ロード進行 / オンボーディング

情報を**段階的に開示**:
- ステップ式チュートリアル
- 数値が積み上がる
- ロゴが組み立てられる

### 4. データジャーナリズム

事実の連続を**物語**として:
- 1 章 = 1 主張
- グラフが章ごとに**焦点を変える**
- 散布図に注釈が次々と現れる

## スクロール駆動の技法

### Intersection Observer ベース

```ts
const obs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  }
}, { threshold: 0.5 });

document.querySelectorAll("section").forEach(el => obs.observe(el));
```

各セクションが**画面に入った瞬間**に状態変化。シンプルで実用的。

### Scroll-driven Animations (CSS)

新しい CSS 仕様で**JS なしで**スクロール連動:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section {
  animation: fade-up linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

→ [[Scroll-Driven-Animations]]

### Scroll Position に合わせたシーン (GSAP / Motion)

```ts
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.timeline({
  scrollTrigger: {
    trigger: ".chapter",
    start: "top center",
    end: "bottom center",
    scrub: true,        // スクロール量に追従
    pin: true,          // セクションを固定
  }
})
.to(".chart", { opacity: 1, y: 0 })
.to(".value", { textContent: 1000, snap: { textContent: 1 } });
```

`pin` + `scrub` で**スクロールしてもセクションが残り、内部だけ進む**。

### Lenis / Smooth Scroll

ネイティブスクロールに**慣性**を加えるライブラリ。Award-winning な web は多用。

```ts
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

注意: アクセシビリティで**慣性スクロールを嫌うユーザー**もいる。`prefers-reduced-motion` で無効化。

## ストーリーボードの設計

実装前に**章立て**を決める:

```
Chapter 1: 問題       (10 sec, scroll 0-20%)
  - ヒーロー + 大見出し
  - 数値: 「年間 X 件の事故」
Chapter 2: 状況       (15 sec, scroll 20-50%)
  - 地図: 事故発生地点が点滅
  - スクロールで時系列再生
Chapter 3: 解決策     (15 sec, scroll 50-80%)
  - 図解: 仕組みが組み立てられる
Chapter 4: CTA       (5 sec, scroll 80-100%)
  - 「今すぐ参加する」
```

**章ごとの焦点**を 1 つに。複数主張すると伝わらない。

## 共通要素の継承 (Shared Element)

要素 A → 同じ要素 A が次ページに**継承**される演出:

### View Transitions API

```css
@view-transition { navigation: auto; }

.thumbnail   { view-transition-name: hero-image; }
.detail-hero { view-transition-name: hero-image; }
```

ブラウザが自動でモーフィング。リスト → 詳細の遷移で威力を発揮。

→ [[../20-Design/Motion-System]]

### Framer Motion `layoutId`

```tsx
<motion.div layoutId="card-42">...</motion.div>
```

ページ間でも同じ `layoutId` の要素を**結ぶ**。

## イージングと感情

→ [[../20-Design/Motion-System]]

スクロールでの章替わりに、**ease-out**(入る)、**ease-in**(去る)。
スプリング(物理)はインタラクションに、リニアは「**スクロール量に厳密に対応**」させたい時。

## 数値カウントアップ

「100 → 0」のような**数値の物語化**:

```tsx
import { useMotionValue, animate } from "framer-motion";

const value = useMotionValue(0);
useEffect(() => {
  const c = animate(value, 1234, { duration: 2, ease: "easeOut" });
  return c.stop;
}, []);
return <motion.span>{useTransform(value, v => Math.floor(v))}</motion.span>;
```

統計ページ・売上ダッシュボードで**動く数字**は記憶に残る。

## マップ / データの可視化

地図上で:
- スクロール = 時間軸の前進
- 点が次々と現れる(事故、感染拡大)
- ズームレベルが章ごとに変わる

ライブラリ: `Mapbox`, `MapLibre`, `Deck.gl`, `D3`。

→ [[../20-Design/Data-Visualization]]

## アクセシビリティ

→ [[Accessibility]]

スクロールテリングの**罠**:
- スクロール慣性が**酔いを誘う**
- 自動再生・パララックスが**前庭障害**を刺激
- 「**スクロールしても進まない**」(scrub 中)が混乱

対策:
- `prefers-reduced-motion` で**全モーションを無効化**し、スクロールしたら**即座に最終状態**を表示
- Pin + scrub は**フォールバック**(普通のスクロールで全部見える状態)
- 章ごとに**スキップリンク**

```css
@media (prefers-reduced-motion: reduce) {
  .scroll-anim { animation: none; opacity: 1; transform: none; }
}
```

## モバイル対応

→ [[Mobile-Patterns]] / [[Responsive-Design]]

- 縦スクロール基準で設計(モバイルで横スクロールは難)
- pin は**短く**(モバイルで長すぎると離脱)
- アニメ要素を**減らす**(GPU 弱)
- データ通信を**遅延ロード**

## パフォーマンス

- IntersectionObserver で**視野外を停止**
- `transform/opacity` のみ使う
- 重い動画・画像は**preload not preload-on-need**
- スクロールイベントを使うなら**throttle / requestAnimationFrame**

→ [[../10-Coding/Performance]] / [[../40-Bridge/Performance-as-UX]]

## 計測

- スクロール深度 (どこまで読まれたか)
- 章ごとの滞在時間
- 離脱率
- CTA 到達率

「**演出はかっこいいが誰も最後まで読まない**」は典型失敗。チャプターごとに離脱率を見る。

## アンチパターン

- 章が**多すぎる**(10 章超は読まれない)
- pin 中に**スクロールが効かない**ように見える
- 主要 CTA がスクロール最後 = **離脱されると見えない**
- アニメ過多で**メッセージがぼやける**
- モバイルで**動かない・破綻**
- `prefers-reduced-motion` 無視で乗り物酔い
- Smooth Scroll ライブラリで**Cmd+F (検索) が動かない**

## チェックリスト

- [ ] 章ごとに**1 つのメッセージ**に絞れているか
- [ ] CTA は**早めにも到達可能**か
- [ ] `prefers-reduced-motion` で**静的代替**を提供するか
- [ ] モバイルで読めるか
- [ ] スクロール深度を**計測**しているか
- [ ] パフォーマンス (FPS, INP) が許容範囲か

## 関連

- [[../20-Design/Motion-System]]
- [[../20-Design/Editorial-Expressive-Layouts]]
- [[../20-Design/Variable-Type-Expression]]
- [[../20-Design/Creative-Coding-Canvas-WebGL]]
- [[../20-Design/Data-Visualization]]
- [[Scroll-Driven-Animations]]
- [[Microinteractions]]
- [[Accessibility]]

## 深掘り

- The Pudding (https://pudding.cool/) ─ データジャーナリズムの規範例
- NY Times "Snow Fall" 特集 (scrollytelling の起源)
- Apple Product Pages
- *The Functional Art* by Alberto Cairo
- GSAP ScrollTrigger documentation
