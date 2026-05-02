---
tags: [skill, interface, a11y]
domain: interface
level: intermediate
---

# アクセシビリティ (a11y)

## 一行で

> アクセシビリティは「**機能の質**」であり、後付けではなく**設計の前提**。

## なぜ重要か

世界人口の約 **15%** に何らかのアクセシビリティニーズがあります。視覚・聴覚・身体・認知・状況依存(片手操作・直射日光・通勤時の音声不可)を含めると、**全ユーザー**が時として障害的状況に置かれます。アクセシビリティは「特殊なユーザーへの配慮」ではなく、**頑強な UI**そのものです。

## WCAG 2.x の四原則 (POUR)

### Perceivable (知覚可能)

ユーザーが情報を**知覚できる**ように:
- テキストには代替表現(alt 属性)
- 動画にはキャプション・トランスクリプト
- 色だけで意味を伝えない
- 十分なコントラスト

### Operable (操作可能)

すべての機能が**操作できる**ように:
- キーボードのみで操作可能
- 時間制限がある場合は延長手段
- 動きや点滅は制御可能(光感受性発作の予防)

### Understandable (理解可能)

情報と操作が**理解できる**ように:
- 読みやすいテキスト
- 予測可能な動作
- 入力エラーの明示と修正支援

### Robust (堅牢)

支援技術を含む様々な技術で**解釈可能**であるように:
- 妥当な HTML
- 正しい ARIA(誤った ARIA は無 ARIA より悪い)

## 適合レベル

- **A**: 最低限
- **AA**: 一般的な目標(法的要件の多くがここ)
- **AAA**: 最高レベル(全コンテンツでの達成は非現実的)

## 実装の柱

### 1. セマンティック HTML

> "The first rule of ARIA is don't use ARIA."

ネイティブ HTML 要素は**標準でアクセシブル**。`<button>` は Tab で到達でき、Enter/Space で発火し、Disabled 状態を伝える。`<div onClick>` で再発明しない。

```html
<!-- ❌ -->
<div onclick="submit()">送信</div>

<!-- ✅ -->
<button type="submit">送信</button>
```

### 2. キーボード操作

すべてのインタラクティブ要素を**キーボードのみで**完結できること:
- `Tab` / `Shift+Tab` でフォーカス移動
- `Enter` / `Space` で発火
- `Esc` でモーダル/メニューを閉じる
- 矢印キーでメニュー・タブ・リスト内移動
- フォーカストラップ(モーダル内に閉じ込め)

### 3. フォーカス可視

フォーカスリングを**消さない**:

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

`outline: none` だけはアンチパターン。代替を必ず提供。

### 4. ラベル付け

`<label>` を `<input>` と紐付ける:

```html
<label for="email">メールアドレス</label>
<input id="email" type="email" required />

<!-- アイコンボタンには aria-label -->
<button aria-label="閉じる">×</button>
```

### 5. ARIA(必要なときだけ)

ネイティブ要素で表現できないパターン:
- `role="alert"`: 重要な動的メッセージ
- `aria-live="polite"`: 通知の読み上げ
- `aria-expanded`: 展開状態
- `aria-controls`: どの要素を制御するか
- `aria-current="page"`: 現在ページ

**誤った ARIA は無 ARIA より悪い**:`role="button"` を div につけても、キーボードハンドラと Disabled の振る舞いは自動でつかない。

### 6. コントラスト

| 用途 | AA | AAA |
|---|---|---|
| 通常テキスト (< 18pt) | 4.5:1 | 7:1 |
| 大型テキスト (>= 18pt or 14pt bold) | 3:1 | 4.5:1 |
| UI コンポーネント・グラフィック | 3:1 | — |
| フォーカスインジケータ | 3:1 | — |

ツール: Chrome DevTools の Accessibility パネル、`axe DevTools`、Stark。

### 7. モーション削減

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

前庭障害 (vestibular disorders) のあるユーザーへの配慮。

### 8. スクリーンリーダー視認

要素を視覚的に隠しつつスクリーンリーダーには伝える定型 CSS:

```css
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
```

## 検証方法

1. **キーボードのみ**で操作できるか
2. **スクリーンリーダー** (NVDA/VoiceOver/TalkBack) で読み上げる
3. **ズーム 200%** でレイアウトが崩れないか
4. **`prefers-reduced-motion`** を有効にして再確認
5. **自動チェック** (axe, Lighthouse) で baseline を確保
6. **当事者ユーザビリティテスト** が究極の検証

自動チェックは**全違反の 30〜40% しか拾わない**ので、人手チェックが必須。

## アンチパターン

- `<a href="#" onClick>` (本来は `<button>`)
- `outline: none` だけ
- フォーカストラップ無しモーダル
- スクロール固定で背景が読まれてしまう
- アイコンのみのボタンに **`aria-label` 無し**
- 色だけでフィールド異常を示す
- プレースホルダだけで**ラベルを省略**(入力中に消えて思い出せない)

## チェックリスト

- [ ] ネイティブ HTML 要素を**まず使った**か
- [ ] **キーボードのみ**で全機能が使えるか
- [ ] フォーカスが**常に可視**か
- [ ] スクリーンリーダーで意味が通るか
- [ ] AA コントラストを満たすか
- [ ] `prefers-reduced-motion` を尊重しているか
- [ ] 自動チェック (axe / Lighthouse) で error 0 か

## 関連

- [[UX-Principles]]
- [[Forms-and-Input]]
- [[../20-Design/Color-Theory]]
- [[../20-Design/Typography]]

## 深掘り

- WCAG 2.2 (W3C)
- Inclusive Components by Heydon Pickering
- Sara Soueidan のブログ
