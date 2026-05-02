---
tags: [skill, design, motion, system]
domain: design
level: intermediate
---

# モーションシステム

## 一行で

> 個別のアニメーションを「**やる/やらない**」で議論するのではなく、**時間・イージング・距離・意味**の語彙を整え、**一貫した動き方**として体系化する。

## なぜ重要か

カラーやスペーシングと同様、モーションも**トークン化**しないとプロダクト全体で動きがバラバラになります。あるボタンは 200ms で跳ね、別のは 400ms でフェード ― ユーザーは「同じプロダクトを触っている」感覚を失います。

## モーショントークンの 4 軸

### 1. Duration (時間)

```
duration.instant:  100ms   ホバー、押下感
duration.fast:     200ms   小要素の出現/消失
duration.normal:   300ms   標準的な遷移
duration.slow:     500ms   大きなシート、モーダル
duration.slower:   800ms   ヒーローイメージなど
```

500ms を超えると**操作の流れ**が途切れる。ヒーロー演出など、ユーザーが**操作を待っていない**場面のみ。

### 2. Easing (緩急)

```
ease.out:    cubic-bezier(0, 0, 0.2, 1)    入場 (慣性で減速)
ease.in:     cubic-bezier(0.4, 0, 1, 1)    退場 (加速して消える)
ease.in-out: cubic-bezier(0.4, 0, 0.2, 1)  両方向 (移動)
ease.spring: spring(stiffness, damping)    物理ベース
```

**入る = ease-out, 出る = ease-in** が基本則。リニアは機械的すぎる。

### 3. Distance (移動量)

スライド系のモーションは**移動距離**もトークン化:

```
motion.travel.sm: 8px   (微妙な強調)
motion.travel.md: 24px  (リスト項目の入場)
motion.travel.lg: 64px  (シート、ドロワー)
```

距離は**入場速度の知覚**に効く ― 短距離は速く、長距離は時間を増やす。

### 4. Stagger (時差)

リスト要素を**時差**で見せると流れが生まれる:

```
stagger.tight: 30ms  (細かい連打)
stagger.normal: 50ms (心地よい流れ)
stagger.loose: 100ms (劇的)
```

10 要素以上は**段階を圧縮** (`Math.min(i * 50, 300)`) すると終わりが間延びしない。

## モーションの意味カタログ

各モーションが**何を語っているか**を定義する:

| モーション | 意味 |
|---|---|
| Fade in/out | 存在/不在 (重要度低) |
| Scale up from small | **新規生成** |
| Slide from edge | 別空間からの**到来** |
| Slide between siblings | **同階層**の遷移 |
| Expand from element | **詳細化** (この要素の中身) |
| Cross-fade | 同位置で**置換** |
| Shake | エラー、却下 |
| Bounce | 注目誘導、軽い祝祭 |

意味と動きが一致しているとユーザーは**学習**する: 「左から来たから戻れる」「拡大したから詳細だ」。

## 物理感 (Spring) の使い所

バネ物理は**インタラクションへの反応**で特に効く:
- ドラッグ後の自由落下
- スワイプの慣性
- ボタンの押下/離した時の戻り

```ts
// Framer Motion
useSpring({ scale: pressed ? 0.96 : 1 }, { stiffness: 300, damping: 20 });
```

時間ベース (duration) のアニメは「**いつ何が起きる**」を予測できるので**ナビゲーション系**に、物理ベースは「**触感**」を出す**直接操作**に。

## レイアウトアニメーション

要素の位置・サイズが変わる時、**FLIP** 技法で滑らかに:

```
First:  変更前の位置を計測
Last:   変更後の位置を計測
Invert: 差分だけ transform で逆移動
Play:   0 へ戻すアニメ
```

Framer Motion の `layout` prop, View Transitions API でこれを自動化。

## モーションシステムの実装

```ts
// motion.ts
export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const easing = {
  out:    [0, 0, 0.2, 1],
  in:     [0.4, 0, 1, 1],
  inOut:  [0.4, 0, 0.2, 1],
} as const;

export const transition = {
  default: { duration: duration.normal / 1000, ease: easing.out },
  fast:    { duration: duration.fast / 1000, ease: easing.out },
  spring:  { type: "spring", stiffness: 300, damping: 30 },
} as const;
```

CSS Custom Properties でも:

```css
:root {
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

## アクセシビリティ

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**装飾モーションを完全停止**するが、**情報伝達は維持**する。状態変化はクロスフェードでなく**即座の置換**で表す。

→ [[../30-Interface/Accessibility]]

## パフォーマンス

GPU compositing 対象プロパティを使う:
- ◎ `transform`, `opacity`, `filter`
- × `width`, `height`, `top`, `left`, `margin`

`will-change` は**変更直前**にだけ宣言、終わったら削除。ずっと付けると**メモリを食う**。

```css
.card {
  /* 通常時は付けない */
}
.card.expanding {
  will-change: transform;
}
```

→ [[../10-Coding/Performance]]

## 振付の原則 (Choreography)

複数要素のアニメは**一斉ではなく順次**:

1. 大きい要素から → 小さい要素へ
2. 親 → 子
3. 重要 → 補足

```
シート登場
 ├─ 0ms: シート背景フェードイン
 ├─ 50ms: シート本体スライドアップ
 ├─ 200ms: タイトル + 中身フェードイン
 └─ 300ms: アクションボタン段階的に
```

## アンチパターン

- 全画面で同時に多くの要素が動く (集中阻害)
- 1 秒以上の待機演出 (遅いだけ)
- リニア (`linear`) で機械的
- レイアウトプロパティで実装し**カクつく**
- `prefers-reduced-motion` 無視
- 入場 = 出場で同じイージング (向きの感覚が消える)
- Skip 不可なスプラッシュ

## チェックリスト

- [ ] **トークン化**された duration / easing / distance を使っているか
- [ ] 各モーションに**意味**が割り当てられているか
- [ ] **入場 ease-out / 退場 ease-in** の規則
- [ ] **transform/opacity** で実装しているか
- [ ] `prefers-reduced-motion` を尊重しているか
- [ ] 同時動作要素を**抑制**しているか

## 関連

- [[../30-Interface/Microinteractions]]
- [[Design-Tokens]]
- [[../30-Interface/Accessibility]]
- [[../10-Coding/Performance]]

## 深掘り

- Material Design Motion guidelines
- Apple HIG, Motion section
- Val Head, *Designing Interface Animation*
- Framer Motion / View Transitions API documentation
