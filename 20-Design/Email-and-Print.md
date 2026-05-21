---
tags: [skill, design, email, print]
domain: design
level: intermediate
---

# メール HTML と印刷デザイン

## 一行で

> Web の常識が**通用しない 2 大領域**。メールクライアントは 25 年前の HTML、印刷は色空間とサイズが別世界。

## なぜ重要か

UI デザイナーが見落としがちな:
- ユーザー獲得・継続の**主要チャネル**: メール
- 法的書類・契約書・伝票: **印刷**
- ブランドエクスペリエンスは**画面外**でも続く

雑にやると:
- メールが**崩れて読めない**(離脱)
- 印刷で**色が違う・切れる**(ブランド毀損)
- アクセシビリティで**訴訟リスク**

## メール HTML 設計

### Outlook という壁

Microsoft Outlook (Windows) は**Word のレンダリングエンジン**を使う(2007 から変わらず):
- Flexbox / Grid 非対応
- 一部 CSS 無効
- Background image 制限

これに合わせる必要があり、**メール HTML は退行**。

### Table-based Layout

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 20px;">
      <!-- 内容 -->
    </td>
  </tr>
</table>
```

- Flexbox は使わない (Outlook で崩壊)
- `<table>` でレイアウト(`role="presentation"` でアクセシビリティ確保)
- インライン CSS が安全(`<style>` 無効化されるケースあり)

### インライン化

```html
<a href="..." style="color: #1976D2; text-decoration: none;">
```

ビルド時に CSS → インライン変換 (Premailer, Juice, MJML)。

### MJML

メール HTML を**抽象化**した DSL:

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>こんにちは</mj-text>
        <mj-button href="...">確認</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

→ コンパイル → クロスクライアント対応 HTML
モダンなメール開発の標準。

### React Email / JSX Email

React コンポーネントでメールを書く:

```tsx
import { Button, Container, Html } from "@react-email/components";

export default function WelcomeEmail({ name }) {
  return (
    <Html>
      <Container>
        <h1>こんにちは、{name} さん</h1>
        <Button href="...">確認</Button>
      </Container>
    </Html>
  );
}
```

→ HTML 文字列生成、Storybook で確認、TS 型安全。

## メールの設計指針

### 1. プレヘッダ

```html
<head>
  <style>.preheader { display: none; }</style>
</head>
<body>
  <span class="preheader">無料トライアルが終了します</span>
  ...
</body>
```

受信箱の件名横に表示される短文。**未開封率に効く**。

### 2. シングルカラム + 600px

- 横幅 **600px** が事実上の標準
- シングルカラムなら破綻しにくい
- モバイル: スタック(縦並び)に変形

### 3. ボタン

```html
<table cellpadding="12" bgcolor="#1976D2" style="border-radius: 4px;">
  <tr>
    <td>
      <a href="..." style="color: white; text-decoration: none; font-weight: bold;">
        今すぐ確認
      </a>
    </td>
  </tr>
</table>
```

`<button>` でなく **`<table>` + `<a>`** でクライアント互換性確保。「Bulletproof Button」と呼ばれる。

### 4. 画像

- `alt` 属性必須(画像ブロック時の代替)
- 絶対 URL (`https://...`、CID なし)
- リサイズ済みファイル(レスポンシブで縮小しない)
- Dark Mode 対応 (透過 PNG で背景に追従)

### 5. ダークモード

```html
<meta name="color-scheme" content="light dark">
<style>
  @media (prefers-color-scheme: dark) {
    .container { background: #000 !important; color: #fff !important; }
  }
</style>
```

Gmail / Apple Mail / Outlook で**挙動が違う**。Litmus / Email on Acid で確認。

### 6. タイポグラフィ

- Web フォントは**多くのクライアントで効かない**
- フォールバック必須: `Arial, Helvetica, sans-serif`
- フォントサイズは絶対値 (`px`)、相対 (`em`) は崩れることあり

→ [[Typography]]

### 7. テスト環境

- **Litmus** / **Email on Acid**: 50+ クライアントで自動チェック
- Gmail / Outlook / Apple Mail / Yahoo / Outlook.com で**実機**
- **テスト送信機能**を開発に組み込む

→ [[../10-Coding/Testing-Strategy]]

## メールマーケティング系

→ [[../30-Interface/Notifications]]

- A/B テスト(件名、ボタン色、CTA 文言)
- パーソナライズ(`{{name}}`)
- セグメンテーション
- 配信時間最適化
- 解除リンク**必須**(CAN-SPAM, 特商法)

## トランザクショナルメール

- 登録確認
- パスワードリセット
- 注文確認
- 領収書

要件:
- **数秒以内**に届く
- SPF / DKIM / DMARC 設定
- バウンス管理
- スループット (大量送信)

サービス: SendGrid, AWS SES, Postmark, Resend, Loops, Mailgun。

→ [[../30-Interface/UX-Writing]] (メール文言設計)

---

# 印刷デザイン

## なぜ重要か

「Web しか触らない」設計でも:
- 領収書・請求書 (PDF)
- 名刺・ノベルティ
- カンファレンス資料
- 契約書
- 配達伝票

ブランドの**手触り**まで及ぶ表現。

## Web vs 印刷

| | Web | 印刷 |
|---|---|---|
| 色空間 | RGB (sRGB / P3) | CMYK + 特色 |
| 解像度 | 72 DPI (画面) | 300+ DPI |
| サイズ | 可変 | 固定 (A4, B5...) |
| 単位 | px / rem | mm / pt / inch |
| 制約 | レスポンシブ | 紙のサイズ |
| 校正 | 即座 | 印刷 → 修正コスト高 |

## CMYK と特色

- **RGB**: 光の三原色 (画面)
- **CMYK**: 染料の四色 (印刷)
- **特色 (PMS)**: Pantone 等の指定色(ブランドカラー)

RGB → CMYK 変換で**色がくすむ**ことがある:
- 蛍光色 / 高彩度
- 純粋な青 / 緑
- ブランドカラーが**指定通りに出ない**

ブランドカラーは**RGB / CMYK / Pantone**を併記する。

```
Brand Blue
  RGB: #1976D2
  CMYK: 80 / 47 / 0 / 18
  Pantone: 285 C
```

## 解像度

```
Web:      72-96 DPI
印刷:     300 DPI 以上
大判印刷:  150 DPI (遠目に見るため低くて OK)
```

「Web 用画像をそのまま印刷」 = **ぼやける**。
ベクター (SVG, AI) は無限解像度。

## サイズと裁ち落とし (Bleed)

```
仕上がりサイズ + 3mm の塗り足し (bleed)
```

印刷後の裁断で**白縁が出る**のを防ぐため。背景色 / 画像は**外まで**伸ばす。

```
[ Bleed Area (3mm) ]
[ Safe Area (5mm 内側) ]
   [ Content ]
[ Safe Area ]
[ Bleed Area ]
```

重要要素は**Safe Area 内**に。

## フォントの埋め込み

PDF にフォントを**埋め込む**(`Embed Fonts`):
- ライセンス確認(埋め込み許可があるか)
- アウトライン化 (テキストを図形に変換) で確実だが**編集不可**

## 印刷向け CSS

Web ページの印刷:

```css
@media print {
  nav, .ads, footer { display: none; }
  body { font-size: 12pt; color: black; }
  a::after { content: " (" attr(href) ")"; }
  @page { margin: 2cm; }
}
```

レシート・領収書ページ・記事の印刷版。

### `@page` ルール

```css
@page {
  size: A4 portrait;
  margin: 20mm;
  @top-center { content: "ページタイトル"; }
  @bottom-right { content: counter(page); }
}
```

ページ番号、ヘッダ / フッタ。

## PDF 生成

サーバ側:
- **Puppeteer / Playwright**: HTML → PDF (高品質、CSS フル対応)
- **wkhtmltopdf**: 古いが軽量
- **PDFKit / pdf-lib**: プログラマブル生成
- **LaTeX**: 学術・組版重視
- **react-pdf**: React で PDF コンポーネント

```tsx
import { Document, Page, Text, View } from "@react-pdf/renderer";

const Invoice = ({ data }) => (
  <Document>
    <Page size="A4">
      <View>
        <Text>請求書 #{data.id}</Text>
        ...
      </View>
    </Page>
  </Document>
);
```

### 帳票・契約書

- 法的に**必須項目**(会社名、住所、税額...)
- 計算誤差なし (decimal 型)
- バージョン管理(契約書の改訂履歴)

→ [[../10-Coding/Database-Design]]

## バーコード / QR

- 製品 / 配送ラベル
- チケット
- 名刺の連絡先 (vCard QR)

ライブラリ: bwip-js, qrcode.js。

## アクセシビリティ

→ [[../30-Interface/Accessibility]] / [[../40-Bridge/Inclusive-Design]]

- 大きめのフォント(高齢者対応)
- 色だけで意味を伝えない
- 充分なコントラスト
- 構造化された情報(タブ順序 - PDF タグ)

## 校正フロー

```
1. デザインデータ作成
2. 内部レビュー (誤字、色、配置)
3. 校正刷り (proof)
4. 修正
5. 本刷り
6. 納品検査
```

印刷ミスは**回収できない**ことが多い。校正で**全行読む**。

## ベクター画像

印刷では**SVG / AI / EPS** が標準:
- 解像度フリー
- 線が綺麗
- 色変更が容易

ロゴ・図解は必ずベクターで保管。
→ [[Brand-Voice]] / [[Iconography]]

## アンチパターン

### メール

- レスポンシブを Flexbox で(Outlook 崩壊)
- 画像のみ (alt なし → 画像ブロック時に**真っ白**)
- リンクテキスト「こちら」(コンテキストなし)
- 解除リンク**なし**
- HTML / Plain text の**両方提供しない**
- DKIM 未設定 → スパム判定

### 印刷

- RGB のまま入稿(色がくすむ)
- 裁ち落とし**なし** → 白縁
- 低解像度画像 (ぼやける)
- フォント埋め込み忘れ
- 校正なしで本刷り
- 紙のサイズに**合わない**デザイン
- ライセンス未確認のフォント / 画像

## チェックリスト

### メール

- [ ] 主要クライアント(Gmail, Outlook, Apple, Yahoo)で**実機確認**
- [ ] プレヘッダがあるか
- [ ] ボタンが**Bulletproof**(画像でなく HTML)
- [ ] 画像に **`alt`** があるか
- [ ] **解除リンク**があるか(マーケなら)
- [ ] DKIM / SPF / DMARC 設定済みか
- [ ] Plain text 版があるか

### 印刷

- [ ] **CMYK / 特色** で入稿しているか
- [ ] **300 DPI** 以上か
- [ ] 裁ち落とし (bleed) があるか
- [ ] フォント埋め込み or アウトライン化
- [ ] 校正刷りで確認したか
- [ ] ブランド色が**Pantone 指定**で再現可能か

## 関連

- [[Typography]]
- [[Color-Theory]]
- [[Brand-Voice]]
- [[Iconography]]
- [[Visual-Hierarchy]]
- [[../30-Interface/UX-Writing]]
- [[../30-Interface/Notifications]]
- [[../30-Interface/Accessibility]]
- [[../40-Bridge/Internationalization]]
- [[../40-Bridge/Inclusive-Design]]

## 深掘り

- *Email Design Workshop* by Litmus
- Really Good Emails (reallygoodemails.com) サンプル集
- MJML / React Email documentation
- *The Designer's Guide to Print Production* by Pamela Pfiffner
- *Stop Stealing Sheep & Find Out How Type Works* by Erik Spiekermann
- Adobe / InDesign の入稿ガイドライン
