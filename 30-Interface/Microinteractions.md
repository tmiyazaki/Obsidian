---
tags: [skill, interface, motion]
domain: interface
level: intermediate
---

# マイクロインタラクション

## 一行で

> 小さな反応 ―― ボタンの押下感、いいねの脈動、フィールドのシェイク ―― が「**システムが生きている**」感覚と意味を運ぶ。

## なぜ重要か

ユーザーは大きな機能を覚えていない時でも、**触り心地**を覚えています。マイクロインタラクションは:
- アクションが**届いた**ことの確証 (feedback)
- システム状態の**透明性**
- 学習: 何が起きたかを示し、次回の予測を助ける
- 喜び: 適切な遊びは記憶に残るブランド体験になる

## Dan Saffer のフレーム

1. **トリガー** — ユーザー or システムが起こすきっかけ
2. **ルール** — 何が起きるかの定義
3. **フィードバック** — 起きたことの伝え方(視覚・音・触覚)
4. **ループとモード** — 繰り返し・状態変化

すべての小さなインタラクションがこの 4 要素を持つ。

## 設計指針

### 1. 目的を明確に

装飾のためのアニメーションは**避ける**。常に問う:
- 状態変化を伝える?
- 注目を誘導する?
- 待ちを和らげる?
- 関係性(階層・継承)を示す?

### 2. 早く、軽く

| 役割 | 推奨時間 |
|---|---|
| ホバー・押下 | 100–200 ms |
| 小要素の出現/消失 | 200–300 ms |
| ページ遷移 | 250–400 ms |
| 大きな移動 (シート展開) | 300–500 ms |

500ms を超えると**操作の途切れ**を感じる。

### 3. イージング

リニアは機械的。実物に近づけるなら:

- **Ease-out**: 入場(速く現れて減速 = 慣性)
- **Ease-in**: 退場
- **Ease-in-out**: 移動
- **Cubic-bezier**: 微調整

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in:  cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 4. 物理感を持たせる

**バネ (Spring)** 物理は人間に自然に映る:

```ts
// React Spring / Framer Motion
useSpring({ scale: hovered ? 1.05 : 1 });
```

「機械的な等速移動」より「**慣性 + 微減衰**」がリッチ。

### 5. 意味の方向

- 上から落ちる = 通知が**届く**
- 横にスライド = 兄弟関係
- 拡大して詳細へ = **詳細化**
- 消えてフェードアウト = 関連性の喪失

方向と意味を一致させる。

## カテゴリ別実例

### ボタン

- ホバー: 微かな色変化(明度 5〜10%)、scale 1.02
- 押下 (active): scale 0.98、影縮小
- 無効: 透明度 0.5 + cursor: not-allowed
- ローディング: スピナーに置換 + 横幅維持(レイアウトシフト防止)

### フォーム

- フォーカス: ボーダー色変化 + 微かな glow
- バリデーション通過: チェックマークがフェードイン
- バリデーション失敗: 赤ボーダー + 短い水平シェイク (200ms)
- パスワード強度: 段階的に色変化するメーター

### トースト

- 入場: スライド + フェード (300ms ease-out)
- 静止: タイマー進捗をボーダーやプログレスで示す
- 退場: フェード (200ms ease-in)

### 数値・カウンタ

- 増減を**カウントアップ/ダウン**で表示(瞬時の表示より理解しやすい)

### Like / Heart

- 押下 → スケール 1.0 → 1.4 → 1.0 (300ms, スプリング)
- 色変化 + パーティクル微小演出
- 押した瞬間に変化(Optimistic UI)

## アクセシビリティ

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

前庭障害ユーザー、認知負荷を下げたいユーザーへの配慮。**装飾モーションを完全停止**しても、**情報伝達は維持**するよう設計。

## パフォーマンスの注意

GPU 加速が乗るプロパティを使う:
- `transform`, `opacity`: ◎ コンポジット層で完結
- `width`, `height`, `top`, `left`: × レイアウトを再計算

```css
/* ❌ */
.box { transition: width 300ms; }

/* ✅ */
.box { transition: transform 300ms; }
.box.expanded { transform: scaleX(2); }
```

## アンチパターン

- **演出のための演出**(意味の無いアニメ)
- 全画面で動き続ける(集中阻害)
- 1s を超える待機演出(ただ遅いだけ)
- レイアウトシフト(クリック先がズレる)
- prefers-reduced-motion を無視
- 「Skip 不可な」スプラッシュ

## 実装ライブラリ

- **CSS Transitions / Animations**: 最初の選択
- **Framer Motion** (React): 物理アニメ・レイアウトアニメ
- **GSAP**: 複雑なシーケンス
- **Lottie**: After Effects から書き出し
- **View Transitions API**: ブラウザネイティブの遷移

## チェックリスト

- [ ] アニメには**目的**があるか(状態・誘導・関係性)
- [ ] 時間は**500ms 以内**(主要)に収まるか
- [ ] イージングが**意味と一致**しているか(出現は ease-out)
- [ ] `prefers-reduced-motion` を尊重しているか
- [ ] **transform/opacity** で実装しているか
- [ ] レイアウトシフトを起こしていないか

## 関連

- [[UX-Principles]]
- [[Interaction-Patterns]]
- [[Loading-States]]
- [[Accessibility]]
- [[../10-Coding/Performance]]

## 深掘り

- Dan Saffer, *Microinteractions*
- Val Head, *Designing Interface Animation*
