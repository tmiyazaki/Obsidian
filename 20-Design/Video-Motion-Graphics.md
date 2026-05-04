---
tags: [skill, design, video, motion-graphics]
domain: design
level: intermediate
---

# 動画とモーショングラフィックス

## 一行で

> 動画は「**時間軸を持つデザイン**」。LP のヒーロー、製品紹介、SNS、教育 ── 静止画より**情報量と感情伝達**が桁違い。

## なぜ重要か

YouTube・TikTok・Instagram Reels で動画は**第一の発信メディア**になりました。プロダクトでも:
- 30 秒の製品紹介で**機能の使い方**が伝わる
- ヒーローの動画で**離脱率が下がる**(意外と)
- ローディング中の**待ちがエンタメ**になる
- ソーシャルシェアで**音なし**でも伝わる

しかし、雑に使うと:
- 重く読み込み遅延
- 自動再生で**煩わしい**
- 字幕なしで**音なしユーザー**に届かない

## 動画の種類

### 1. ヒーロー動画 (LP)

- 短い (5〜15 秒)、無音、ループ可能
- WebM / MP4
- ポスター画像 (`poster=`) を必ず指定

```html
<video autoplay muted loop playsinline poster="/hero.jpg">
  <source src="/hero.webm" type="video/webm">
  <source src="/hero.mp4" type="video/mp4">
</video>
```

`muted` と `playsinline` は**iOS 自動再生**の必須条件。

### 2. 製品デモ

- 30 秒〜2 分
- ナレーション + 字幕
- ステップごとに章分割
- スクリーン録画 + モーショングラフィックスのオーバーレイ

### 3. オンボーディング動画

- 15〜30 秒
- スキップ可能
- 主要機能 1〜3 個に絞る

### 4. 教育コンテンツ

- 数分〜
- インタラクティブ (動画内クリック)
- チャプター・字幕・速度調整

### 5. ソーシャル (短尺)

- TikTok / Reels: 9:16、最初の 3 秒で掴む
- 字幕焼き込み(音なし視聴前提)

## モーショングラフィックスの語彙

→ [[Motion-System]] / [[../30-Interface/Microinteractions]]

- **キーフレーム**: 開始・終了の状態
- **イージング**: ease-out が入場、ease-in が退場
- **タイミング**: 200-500ms 単位
- **ステージング**: 要素が**順次**現れる
- **アンティシペーション**: ジャンプ前にしゃがむ予備動作
- **フォロースルー**: 動きの後の余韻
- **アーク**: 直線でなく弧を描く動き

ディズニーの 12 アニメーション原則は**UI モーション**にも応用できる。

## ツール

### After Effects

業界標準。複雑なモーショングラフィックス。
書き出し:
- **Lottie** (JSON ベクター、Web/iOS/Android 互換)
- MP4 / WebM
- GIF (低品質、最終手段)

### Premiere Pro / DaVinci Resolve / Final Cut

実写動画の編集。

### Rive

インタラクティブモーション。State Machine ベースで、コードと連動。

### Spline

3D アニメーションを Web に。Spline Runtime で再生。

### CapCut / Descript

短尺ソーシャル、AI による自動字幕。

### Blender

3D アニメ・モデリング(無料、強力)。

## 配信フォーマット

### コーデック比較

| コーデック | サイズ | 互換性 | 用途 |
|---|---|---|---|
| **AVIF (AV1)** | 最小 | 増加中 | 高品質 |
| **HEVC (H.265)** | 小 | iOS/Safari | iOS 重視 |
| **VP9 / WebM** | 小 | Chrome/FF | Web |
| **H.264 (MP4)** | 中 | 普遍的 | フォールバック |

```html
<video>
  <source src="/hero.av1.mp4" type="video/mp4; codecs=av01.0.05M.08">
  <source src="/hero.webm" type="video/webm">
  <source src="/hero.mp4" type="video/mp4">
</video>
```

ブラウザは**最初に対応する**ソースを再生。

### ストリーミング

長尺は**HLS (Apple)** / **DASH** で:
- 帯域に応じた品質自動切替
- シーク高速

CDN: Cloudflare Stream, Mux, AWS Elemental, Vimeo OTT。

### Lottie (ベクターアニメ)

After Effects → JSON。
- 解像度フリー
- ファイル小 (数 KB〜数百 KB)
- カスタマイズ可(色を JS で変更)
- 制限: 一部エフェクトは出ない

```html
<lottie-player src="/loading.json" autoplay loop></lottie-player>
```

UI のインライン演出には**Lottie が第一選択**。

### GIF は避ける

- 256 色 (品質悪)
- 大きい (10 倍重い)
- ループしか出来ない

代替: WebP, MP4, WebM, Lottie。

## アクセシビリティ

→ [[../30-Interface/Accessibility]]

### 字幕 (Captions / Subtitles)

```html
<video>
  <source src="/video.mp4" type="video/mp4">
  <track kind="captions" src="/video.vtt" srclang="ja" label="日本語" default>
  <track kind="captions" src="/video.en.vtt" srclang="en" label="English">
</video>
```

- 音なし視聴でも理解できる
- 聴覚障害ユーザー必須
- SNS では**焼き込み**(リーダー固有の表示制御外)

### Audio Description

視覚障害ユーザー向けに**画面で起きていることを音声で**説明する代替音声トラック。

### 自動再生の倫理

- 音声付き自動再生は**禁忌**
- 無音ループは OK だが`prefers-reduced-motion` で停止
- ユーザーが**コントロールできる**(再生/一時停止)

```html
<video autoplay muted loop playsinline></video>
<!-- prefers-reduced-motion 対応 -->
```

```css
@media (prefers-reduced-motion: reduce) {
  video[autoplay] { /* 静止画ポスターのみ */ }
}
```

## パフォーマンス

→ [[../10-Coding/Performance]] / [[../40-Bridge/Sustainability]]

- ヒーロー動画は**圧縮重視**(2-5MB が目安、超えるとモバイル離脱)
- `preload="metadata"` で**最初は寸法のみ**
- Lazy load(画面外で再生しない)
- 低速回線で**画像にフォールバック**

```ts
if (navigator.connection?.effectiveType === "slow-2g") {
  videoEl.removeAttribute("autoplay");
  showPosterOnly();
}
```

## モバイル特有

→ [[../30-Interface/Mobile-Patterns]]

- 縦動画 9:16 は**ファイル大**(横にすればファイル小)
- 自動再生は**ミュート**必須
- セルラー回線で**自動再生しない**設定を提供
- バッテリー消費

## 動画 + UI の統合

### Video as Background

```css
.hero {
  position: relative;
  overflow: hidden;
}
.hero video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
```

テキストとのコントラスト確保のため**オーバーレイ** (`rgba(0,0,0,0.4)`) を被せる。

### Inline Player

UI の中に埋め込み(YouTube 風):
- 再生/停止/シーク/速度/音量/フルスクリーン/字幕
- キーボードショートカット
- アクセシビリティ → [[../30-Interface/Accessibility]]

ライブラリ: `Video.js`, `Plyr`, `Vidstack`。

### スクラブ可能なシーク

ホバーで**サムネイルプレビュー**(YouTube)。WebVTT のサムネイルトラックで実現。

## ライブストリーミング

→ [[../30-Interface/Real-time-Collaboration]]

- WebRTC: 超低遅延(双方向通話)
- HLS / DASH: 視聴向け、5-10 秒遅延
- LL-HLS / LL-DASH: 1-3 秒遅延
- WebTransport: 最新

イベント配信、ライブコマース、ゲーム配信。

## アンチパターン

- 自動再生 + 音声 ON
- ヒーロー動画 50MB
- 字幕なし
- GIF を**今でも**使う
- 重い動画でモバイルでバッテリー消耗
- アクセシビリティ無視(代替テキスト・字幕なし)
- ロード待ちで**ホワイトアウト**(poster なし)

## チェックリスト

- [ ] ヒーロー動画は **5MB 以下** か
- [ ] **字幕** (キャプション or 焼き込み) があるか
- [ ] 自動再生は**ミュート + ループ**か
- [ ] `prefers-reduced-motion` で**静止画**になるか
- [ ] AVIF/WebM フォールバック付きで配信しているか
- [ ] 低速回線で**動画を止めるオプション**があるか
- [ ] ポスター画像で **CLS** が出ていないか

## 関連

- [[Motion-System]]
- [[Material-Surfaces]]
- [[Brand-Voice]]
- [[Illustration-Photography]]
- [[Creative-Coding-Canvas-WebGL]]
- [[../30-Interface/Microinteractions]]
- [[../30-Interface/Accessibility]]
- [[../10-Coding/Performance]]
- [[../40-Bridge/Sustainability]]

## 深掘り

- *The Animator's Survival Kit* by Richard Williams
- *The Illusion of Life* by Frank Thomas (Disney 12 原則)
- web.dev video best practices
- *Designing Interface Animation* by Val Head
