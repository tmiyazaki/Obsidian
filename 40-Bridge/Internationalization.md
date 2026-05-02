---
tags: [skill, bridge, i18n]
domain: cross-cutting
level: intermediate
---

# 国際化 (i18n) と地域化 (l10n)

## 一行で

> i18n は「**翻訳の準備**」、l10n は「**特定地域への適合**」。両者はコード・デザイン・コンテンツの 3 領域に**同時に**働きかける。

## なぜ重要か

英語圏だけのプロダクトでも、**将来の言語追加**を見越した設計をしないと、後で**全画面の改修**が必要になります。文字列の埋め込み、レイアウトの硬直、フォーマットの直書き ── これらはすべて i18n 後付けで地獄を生みます。

最初から「**翻訳可能な形**」で書くコストはほぼゼロ、後付けは数倍〜数十倍。

## 用語

- **i18n (internationalization)**: 多言語対応の**準備** ─ ハードコードを避ける、翻訳機構を入れる
- **l10n (localization)**: 特定の地域 (locale) への**適合** ─ 翻訳、日付/通貨、文化的調整
- **g11n (globalization)**: i18n + l10n の総体

## コードでの設計

### 1. 文字列を**直書きしない**

```ts
// ❌
<button>保存する</button>

// ✅
<button>{t("action.save")}</button>
```

翻訳キーを介することで、後から複数言語に分岐できる。

### 2. 翻訳キーの命名

階層的に、**意味で**:

```
action.save
action.cancel
common.confirm.title
common.confirm.message
errors.network.title
errors.network.message
profile.title
profile.fields.email.label
profile.fields.email.placeholder
```

「画面構造」より「**意味の単位**」で命名する (画面構造は変わるが意味は安定)。

### 3. 文字列の組み立てを避ける

```ts
// ❌ 語順が言語で違う
`${name}さんがログインしました`
`{name} logged in`

// ✅ プレースホルダ全体で 1 文に
t("user.loggedIn", { name })
// → ja: "{name} さんがログインしました"
// → en: "{name} logged in"
// → de: "{name} hat sich angemeldet"
```

文字列の連結は**翻訳者が組み直せない**形を生む。

### 4. 複数形の処理

英語: `1 item / 2 items`
ロシア語: 1 つ / 2-4 つ / 5+ で別形
日本語: 単複なし

ICU MessageFormat や i18next の plural 機能を使う:

```
{count, plural,
  =0 {アイテムなし}
  one {# 件のアイテム}
  other {# 件のアイテム}
}
```

### 5. 性別・敬称

「彼/彼女」の選択、敬称の有無も言語依存。

```
{gender, select,
  male {彼が}
  female {彼女が}
  other {その人が}
} 来ました
```

### 6. 日付・時刻・数値・通貨

`Intl` API を使う:

```ts
new Intl.DateTimeFormat("ja-JP").format(date)        // 2026/5/2
new Intl.DateTimeFormat("en-US").format(date)        // 5/2/2026
new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(1500) // ¥1,500
new Intl.RelativeTimeFormat("ja").format(-3, "day")  // 3 日前
new Intl.ListFormat("ja").format(["A","B","C"])      // A、B、C
new Intl.PluralRules("ja").select(2)                 // "other"
```

サーバーで生成する場合も同等のロジックを (Node.js 内蔵)。

## デザインでの配慮

### 1. テキスト膨張

| 言語 | 英語比 |
|---|---|
| ドイツ語 | +30〜40% |
| フランス語 | +20〜30% |
| 日本語 | +10〜20% (横幅) |
| アラビア語 | -30%程度だが縦に増 |
| 中国語 (簡体) | -20〜30% |

ボタン・ラベルが**収まらなくなる**前提でデザイン。固定幅を避け、padding を保つ。

### 2. RTL (Right-to-Left)

アラビア語、ヘブライ語、ペルシャ語は**右から左**:

```css
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

CSS Logical Properties で対応:

```css
/* ❌ 物理方向 */
margin-left: 16px;
padding-right: 24px;

/* ✅ 論理方向 (RTL で自動反転) */
margin-inline-start: 16px;
padding-inline-end: 24px;
```

### 3. フォント

- 日本語フォントは **数 MB** ある (サブセット化必須)
- アラビア・タイ・インド系の合成文字に対応するフォント
- `font-family` の末尾にローカルフォントを必ず指定:

```css
font-family: "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
```

### 4. アイコン・色・画像の文化差

- ✋ は文化により失礼
- 👍 一部の中東で侮辱
- 🐷 イスラム圏で避ける
- **赤**: 西洋で危険、中華圏で祝祭
- **白**: 西洋で純粋、東アジアで葬送
- 数字 4 (日本)、13 (西洋) は不吉視されがち

→ [[../20-Design/Color-Theory#文化と意味]]

### 5. 画像内の文字

画像に**文字を焼き込まない**。SVG なら翻訳可能、ビットマップは差し替えコスト大。

### 6. レイアウトの柔軟性

- 固定幅でなく**伸縮**
- 改行可能 (`white-space: normal`)
- 折り返しを許す (`overflow-wrap: break-word`)

## 文化的な細部

### 名前

- 「姓・名」「名・姓」の語順
- ミドルネームの有無
- 敬称 (Mr/Ms, さん, …)
- 母音記号、合字

「Last name」「First name」と書くと混乱する。**Family name / Given name** が中立。あるいは「Full name」1 フィールド。

### 住所

- 国により**フィールド数・順序**が違う
- 郵便番号フォーマット (12345 / 123-4567 / SW1A 1AA)
- 国を**最初に選ばせる** → フォームを切り替える

### 電話番号

国際フォーマット (`+81-90-...`) を保存。表示時に locale で整形。`libphonenumber` を使う。

### 暦

- グレゴリオ暦が標準だが、和暦・タイ仏暦・ヒジュラ暦も存在
- 週の始まりが日曜 (US) / 月曜 (EU) / 土曜 (中東)

### 法的表記

- GDPR (EU): クッキー同意、データポータビリティ、削除権
- CCPA (カリフォルニア)
- 個人情報保護法 (日本)

法的要件はサービス提供地ごとに変動。Legal レビューが必要な領域。

## 翻訳プロセス

### 1. ソース言語を決める

英語ベースが主流 (翻訳者の供給多)。日本語ベースも可能だが、英語に翻訳できる人は限られる。

### 2. ファイル形式

- JSON (i18next, Lingui)
- YAML
- PO/MO (gettext 系、Crowdin 等のツールが豊富)
- ARB (Flutter)

### 3. 翻訳プラットフォーム

- **Crowdin / Phrase / Lokalise / Smartling**: 翻訳者管理、コンテキスト共有、用語集

### 4. コンテキストを渡す

「Save」だけでは「保存する」「救う」「貯金する」のどれか分からない。

```json
{
  "action.save": {
    "message": "Save",
    "description": "ボタン: フォームの内容を保存する"
  }
}
```

### 5. 翻訳の品質保証

- ネイティブレビュー
- スクリーンショットで**実際の文脈**を確認
- 用語集 (Glossary) で訳語を統一
- 機械翻訳は下訳まで、最終はネイティブが必要

## QA テスト

### Pseudo-localization

英語を**疑似的に**翻訳:

```
[!!! Šåvé !!!] (テキスト膨張 + 特殊文字 + 区切り)
```

固定幅崩壊・エスケープ漏れ・文字列連結が**翻訳前に**発見できる。

### RTL モード

`dir="rtl"` を付けて全画面確認。レイアウト・アイコン方向・テキスト整列。

### 主要 locale で実機確認

リリース前に最低 2 言語 (英語 + 1 つ) で全画面確認。

## アンチパターン

- 文字列をコードに直書き
- 文字列の連結で文を組む
- アイコンに文字を焼き込む
- 「Last name」のような英語ローカル前提
- 固定幅の UI
- LTR 前提のレイアウト (margin-left 等)
- 機械翻訳のみで本番化
- 単複・性別を考慮しない訳

## チェックリスト

- [ ] **翻訳キー**経由ですべての文言が管理されているか
- [ ] 単複・性別・複数引数の**メッセージフォーマット**を使っているか
- [ ] 日付・通貨・数値が `Intl` で生成されているか
- [ ] レイアウトが**テキスト膨張**に耐えるか
- [ ] CSS Logical Properties で RTL 対応しているか
- [ ] 文化的に不適切な**色・絵柄**を確認したか
- [ ] **Pseudo-localization** で QA したか
- [ ] 法的要件 (GDPR 等) を満たすか

## 関連

- [[../30-Interface/UX-Writing]]
- [[Naming-as-Design]]
- [[../20-Design/Typography]]
- [[../20-Design/Color-Theory]]
- [[../30-Interface/Forms-and-Input]]
- [[Documentation-as-Product]]

## 深掘り

- Mozilla Localization Best Practices
- W3C i18n Working Group resources
- *Going International* by James Bowman
- Unicode CLDR (Common Locale Data Repository)
