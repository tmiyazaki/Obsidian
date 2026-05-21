---
tags: [skill, interface, calendar, time]
domain: interface
level: intermediate
---

# カレンダー・日付・時間 UX

## 一行で

> 「**日付を選ぶ**」「**予定を表示する**」「**時間を扱う**」 ── 簡単そうで**最も間違えやすい**UI 領域。タイムゾーン・暦・文化差が地雷原。

## なぜ重要か

カレンダー UI は:
- 予約・予定管理 (Google Calendar, Notion, Linear)
- 日付ピッカー (フォーム)
- スケジュール表示 (病院、美容院、レストラン)
- アナリティクス (期間選択)
- 期限・タイマー

雑な実装は:
- タイムゾーンで**1 日ずれる**
- 月・週の開始日が**間違う**
- 不可能な日付 (2/30) を選べる
- スマホで**操作不能**
- 国際化で破綻

## 日付ピッカー (Date Picker)

### 単一日付

```
[ 📅 2026-05-15 ▼ ]
```

- 入力フィールド (キーボード入力 OK)
- ドロップダウンでカレンダー表示
- 月送り / 年送り
- 「今日」ボタン
- 無効日 (過去・休業日) は**選択不可** + 視覚的に

### 期間選択

```
[ 📅 5/15 → 📅 5/20 ]
```

- 開始 → 終了の順
- ホバーで範囲プレビュー
- ショートカット(今週・今月・過去 30 日)

### Native vs Custom

```html
<input type="date">     <!-- ブラウザ標準 -->
```

ネイティブ:
- 標準的、無料
- モバイルで OS のホイール UI
- カスタマイズ性低い

カスタム:
- 完全制御
- ホリデー強調等の機能
- 工数大

業務系はカスタム、シンプルなフォームはネイティブで十分。

ライブラリ: react-day-picker, react-aria, @mui/x-date-pickers, vaul (シート風)。

### バリデーション

→ [[Forms-and-Input]]

```
- 過去日不可
- 営業日のみ
- 連休跨ぎ不可
- 24 時間前から不可
```

UI で**選べない** + サーバ側で**再検証**。

## カレンダー表示

### 月ビュー

```
日 月 火 水 木 金 土
 .  .  .  .  1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
...
```

最も普及。1 ヶ月俯瞰。

### 週ビュー

```
       月    火    水    木    金
9:00  [予定] [    ] [    ] [    ] [    ]
10:00 [予定] [予定] [    ] [    ] [    ]
...
```

予定の時間スロットが見える。

### 日ビュー

1 日の詳細。長時間の予定や複数列(参加者別)。

### アジェンダ (リスト) ビュー

```
今日
  09:00 - ミーティング
  11:00 - レビュー

明日
  10:00 - インタビュー
```

時系列リスト。モバイル向き。

### Year View

```
1月  2月  3月
[||][| |][|||]
...
```

年間俯瞰。Heat-map 的に密度表示。

## 予定の重なり

```
9:00 ┌────────────┐
9:30 │ A          │┌──────┐
10:00│            ││ B    │
     └────────────┘└──────┘
```

時間重複を**横並び**で表示。3 つ以上は**幅縮小**。
クリックで詳細展開。

## モバイルの罠

→ [[Mobile-Patterns]]

カレンダー UI は**画面が狭い**:
- 月ビューを**スクロール式**にする
- タップ領域確保(40+ px)
- ホイール UI(iOS ピッカー)が使いやすい
- ズームジェスチャでビュー切替

## ドラッグ & ドロップ

→ [[Drawing-Direct-Manipulation]]

予定移動・リサイズ:
- ドラッグで時間変更
- 端ドラッグで時間延長
- スワイプで削除
- キーボード代替 (重要)

## タイムゾーン地獄

### よくあるバグ

```
ユーザー A (東京 / JST): "5/15 18:00 にミーティング"
ユーザー B (NY / EST):    "5/15 05:00 にミーティング"
ユーザー C (UK / BST):     "5/15 10:00 にミーティング"
```

3 人とも**同じ時刻**を見ているか?設計次第で**ずれる**。

### 解決

```
保存:   UTC で保存 (絶対時刻)
表示:   ユーザーのタイムゾーンに変換
入力:   現地時刻として受け取る

例外:
  「毎週月曜 10:00 (現地)」のような**繰り返しイベント**は
  タイムゾーン情報も保存(夏時間で変動するため)
```

ライブラリ:
- **Temporal API** (新標準、推奨) → [[Modern-Web-Platform]]
- **date-fns-tz** / **luxon** / **dayjs/timezone**
- **moment.js** はメンテモード(新規採用非推奨)

```ts
import { Temporal } from "temporal-polyfill";

const utcInstant = Temporal.Instant.fromEpochSeconds(...);
const tokyo = utcInstant.toZonedDateTimeISO("Asia/Tokyo");
console.log(tokyo.toLocaleString("ja-JP"));
```

### 表示

```
2026-05-15 18:00 JST (in your timezone: 09:00 UTC)
```

タイムゾーン混乱を防ぐため、**現地時刻 + UTC** または **元 + 自分** を併記。

### 夏時間 (DST)

3 月の第 2 日曜・11 月の第 1 日曜 (米国) で**1 時間ずれる**。
DST がない日本では意識しにくいが、グローバルサービスで必須。

### うるう秒

UTC は時々**1 秒挿入**される (23:59:60)。
通常は無視できるが**金融・天文**では考慮。

## カレンダー (暦) の文化差

### 週の開始

| 地域 | 週の開始 |
|---|---|
| 日本 / 米国 / 中国 | 日曜 |
| 欧州 / イスラム | 月曜 |
| 中東 | 土曜 |

ユーザー設定で切替。デフォルトは locale から推定。

### 暦

| 暦 | 用途 |
|---|---|
| グレゴリオ | 世界標準 |
| 和暦 | 日本(令和元年〜) |
| 中国旧暦 | 中国・台湾・韓国・ベトナム |
| ヒジュラ暦 | イスラム圏 |
| タイ仏暦 | タイ |

メイン UI はグレゴリオ、補助で**和暦併記**等。
`Intl.DateTimeFormat` が多くの暦に対応。

```ts
new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long", year: "numeric"
}).format(new Date()); // "令和8年"
```

### 祝日

国・地域・宗教で異なる。
ライブラリ: holiday-jp, date-holidays。

UI:
- 祝日を視覚的に区別 (色)
- 休業日のセット (営業日のみ選択可)

### 数字フォーマット

```
US:   05/15/2026
EU:   15/05/2026
JP:   2026/05/15 or 2026年5月15日
ISO:  2026-05-15
```

`Intl.DateTimeFormat` で**locale 自動**。生 `Date.toString()` は使わない。

## 相対時間

```
3 分前
2 時間後
昨日
先週
2026 年 5 月 15 日 (1 ヶ月前)
```

絶対時刻より**相対表現**のほうが直感的:

```ts
new Intl.RelativeTimeFormat("ja").format(-3, "day"); // "3 日前"
```

注意:
- 数年前は絶対表示 (「3 年前」より「2023 年」)
- ホバーで絶対時刻を tooltip
- 「2 時間前」が時間経過で**更新されない**バグに注意

## 期間計算

```ts
// Temporal
const start = Temporal.PlainDate.from("2026-05-15");
const end = Temporal.PlainDate.from("2026-06-20");
const duration = end.since(start);
console.log(duration.days); // 36

// 営業日のみ
function businessDaysBetween(a, b) { /* 土日祝を除外 */ }
```

「**3 営業日後**」「**翌月末**」のような業務ロジックを正しく実装。

## ロングプレス・ダブルクリック

カレンダー固有:
- ダブルクリック → 新規予定作成
- ロングプレス → コンテキストメニュー
- 範囲ドラッグ → 期間選択

## 検索とフィルタ

```
[ 🔍 "5月のミーティング" ]
```

→ [[Search-UX]]

- 期間指定検索
- 参加者・タイプフィルタ
- 「次のミーティングはいつ?」NLP

## 通知

→ [[Notifications]]

- 開始時刻の N 分前
- リマインダ
- 変更通知
- カレンダー間同期

## アクセシビリティ

→ [[Accessibility]]

- キーボードナビ(矢印で日付移動)
- スクリーンリーダーで**今日が何曜日**を読み上げ
- フォーカス可視
- 拡大表示時に**カレンダーが崩れない**
- 色だけで意味を伝えない (祝日は文字でも)
- `role="grid"` で**テーブル**としてアナウンス

```html
<div role="grid" aria-labelledby="cal-title">
  <h3 id="cal-title">2026 年 5 月</h3>
  <div role="row">
    <div role="columnheader">日</div>
    ...
  </div>
  <div role="row">
    <div role="gridcell" aria-selected="false" tabindex="-1">1</div>
    ...
  </div>
</div>
```

## 国際化チェックリスト

→ [[../40-Bridge/Internationalization]]

- [ ] 日付フォーマットが**locale 別**
- [ ] 週の開始が**正しい**
- [ ] 祝日が**国別**
- [ ] 暦切替(必要なら)
- [ ] タイムゾーン**明示**
- [ ] DST 跨ぎの**繰り返しイベント**正常

## アンチパターン

- タイムゾーンを**無視** → 「明日」が地域で違う
- `Date.toString()` で表示 → 形式バラバラ
- 月の開始が**locale 非対応**
- 過去日選択可能 (誕生日入力以外)
- 不正日付 (2/30) を**サーバで初めて検出**
- カレンダーがモバイルで**画面外**
- SR で操作**完全不可**
- 「2 分前」を表示後、**更新しない**

## チェックリスト

- [ ] **保存は UTC**、表示はローカル
- [ ] **Temporal API** または現代ライブラリを使う
- [ ] **タイムゾーン** が UI に明示されているか
- [ ] **週の開始日** が locale 別か
- [ ] **祝日**を区別しているか(必要なら)
- [ ] キーボードナビ + SR で操作可能か
- [ ] モバイルで**操作可能**(タップ領域、スクロール)
- [ ] 相対時間が**時間経過で更新**されるか

## 関連

- [[Forms-and-Input]]
- [[Mobile-Patterns]]
- [[Search-UX]]
- [[Notifications]]
- [[Drawing-Direct-Manipulation]]
- [[Accessibility]]
- [[../10-Coding/Modern-Web-Platform]]
- [[../10-Coding/Database-Design]]
- [[../40-Bridge/Internationalization]]

## 深掘り

- TC39 Temporal proposal
- Falsehoods Programmers Believe About Time (Noah Sussman)
- date-fns / luxon / dayjs documentation
- React Aria DatePicker (Adobe)
- Apple HIG Calendar
- iCal RFC 5545
