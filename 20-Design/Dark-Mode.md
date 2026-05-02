---
tags: [skill, design, color, theme]
domain: design
level: intermediate
---

# ダークモード設計

## 一行で

> ダークモードは「**色を反転する**」のではなく「**暗い環境向けに最適化された別テーマ**」として設計する。

## なぜ重要か

ユーザーの 50% 以上がダークモードを選ぶアプリも珍しくありません。提供されないと「未対応」と認識される時代です。一方、雑なダークモードは**ライトモードより目を疲れさせます**。専用設計が必要。

## 単純反転が破綻する理由

`#FFFFFF` → `#000000`、`#000000` → `#FFFFFF` の機械反転では:
- ピュアブラック背景に**ピュアホワイトテキスト**は強コントラストでチラつく
- ブランドカラーが**眩しすぎる**
- 影 (黒い半透明) が**消える**
- 画像・写真が周囲と浮く

## 設計原則

### 1. ピュアブラックを避ける

```
✗ background: #000000
✓ background: #0F1115 (オフブラック)
✓ background: #16181D (Surface)
```

OLED 端末ではピュアブラックが**省電力**だが、コントラストが強すぎてテキストが「滲む」。 UI には**わずかに明るいブラック**を。

### 2. 階層は「暗→明」の方向

ライトモードでは「白→灰色→濃い灰」と暗くしていくが、ダークモードでは**逆**:

```
Surface base:    #0F1115
Surface raised:  #1A1D24  (カード)
Surface overlay: #232733  (モーダル)
Surface popover: #2D323F  (浮く要素)
```

「**前に出るほど明るい**」という物理メタファ (光が当たる)。

### 3. 影ではなく明度で奥行き

ダーク背景では**影が見えない**。代わりに:
- 上の階層を**明るく**して浮きを表現
- 細いボーダーで境界を示す

### 4. 彩度を下げる

ライトの飽和した色をダークでそのまま使うと**眩しすぎる**。彩度を 10〜30% 程度落とす:

```
Light: #4A90E2 (saturation 73%)
Dark:  #6BA8E8 (saturation 60%, lightness up)
```

OKLCH の chroma を一段下げるイメージ。

### 5. ブランドカラーの調整

ライトモードのブランド色は**ダークでアクセントとして強すぎる**ことが多い。
- 同じ色相、明度を上げる、彩度を下げる
- アクセシビリティ上、WCAG AA を**ダーク背景**で確認

### 6. 画像と写真

- 透過 PNG ロゴ → **白バージョン**を別途用意
- グラフ/イラスト → ダーク向けのカラーパレット
- 写真は**わずかに dim** にすると周囲と馴染む (`opacity: 0.9` or `filter: brightness(0.9)`)

```css
[data-theme="dark"] img.photo {
  filter: brightness(0.9) contrast(1.05);
}
```

## トークン設計

→ [[Design-Tokens]] のセマンティック層で対応:

```css
:root {
  --color-surface-base:    #FFFFFF;
  --color-surface-raised:  #F5F5F7;
  --color-text-primary:    #1D1D1F;
  --color-text-secondary:  #6E6E73;
  --color-action-primary:  #007AFF;
  --color-border-default:  #D2D2D7;
}

[data-theme="dark"] {
  --color-surface-base:    #0F1115;
  --color-surface-raised:  #1A1D24;
  --color-text-primary:    #E8EAED;
  --color-text-secondary:  #9AA0A6;
  --color-action-primary:  #4DA8FF;
  --color-border-default:  #2D323F;
}
```

トークンが**役割名**で命名されているからこそ、UI コンポーネントは**ライト/ダークを意識せず**に書ける。

## システム連動と手動切替

3 つのモードを提供する:

1. **System (auto)**: OS 設定に従う (デフォルト)
2. **Light**: 強制ライト
3. **Dark**: 強制ダーク

```ts
const theme = userPref ?? matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.documentElement.dataset.theme = theme;
```

**FOUC** (Flash of Unstyled Content) を避けるため、**初期レンダリング前**にテーマを設定する (HTML の冒頭でインライン script):

```html
<script>
  document.documentElement.dataset.theme =
    localStorage.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
</script>
```

SSR 時はサーバーが推測できないため、**Cookie** にテーマを保存して初期 HTML を正しく描く方法もある。

## メタタグ

```html
<meta name="color-scheme" content="light dark" />
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0F1115" media="(prefers-color-scheme: dark)" />
```

ブラウザ UI (アドレスバー、スクロールバー) も追従する。

## ダークモード QA チェックリスト

- [ ] 全画面でコントラスト AA 以上
- [ ] ブランドカラーが**眩しくない**
- [ ] 影に頼らず階層が見える
- [ ] アイコンの透過 PNG が**白く**用意されている
- [ ] グラフ・チャートのカラーパレットがダーク向け
- [ ] 写真がダーク背景で浮いていない
- [ ] 切替が**遷移なし**で瞬時 (アニメで派手に切り替えない)
- [ ] FOUC が出ない (テーマが**初期描画前**に決まる)
- [ ] OS 設定変更にリアルタイム追従 (`matchMedia` の change イベント)

## 切替アニメーションの罠

「色をフェードで切り替える」演出は**目に痛い**。瞬時に切り替える方が UX が良い。
凝るなら、View Transitions API で**画面全体を 1 フレーム**だけクロスフェード。

```css
@view-transition { navigation: auto; }
```

`prefers-reduced-motion` 時は無効化。

## ハイコントラストモードへの配慮

OS のハイコントラスト設定 (Windows ContrastedMode 等) も別軸:

```css
@media (prefers-contrast: more) {
  :root {
    --color-border-default: var(--color-text-primary);
  }
}
```

## アンチパターン

- ピュアブラック (`#000`) 背景
- ライトの色を**そのまま**使い眩しい
- 影を残してしまう (見えない)
- ブランドカラーが**ダークで読めない**
- テーマ切替で**毎回ちらつく** (FOUC)
- 切替アニメで派手にフェード
- ダークモードの**画像の差し替え忘れ**

## 関連

- [[Color-Theory]]
- [[Design-Tokens]]
- [[Design-Systems]]
- [[Motion-System]]
- [[../30-Interface/Accessibility]]

## 深掘り

- Material You / iOS HIG (Dark Mode)
- Stéphanie Walter, *Dark Mode design*
- Radix Colors の Dark Theme アルゴリズム
