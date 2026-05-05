---
tags: [skill, coding, web-platform, modern]
domain: coding
level: intermediate
---

# モダン Web プラットフォーム (2025-2026)

## 一行で

> CSS / HTML / JS が「**ライブラリで補う必要がない**」レベルに到達しつつある。**ネイティブ**で何が出来るかを知ると、依存と複雑度が減る。

## なぜ重要か

10 年前は CSS Reset、jQuery、Modernizr が必須でした。今は:
- **Container Queries** で「親要素サイズで切替」
- **`:has()`** で「子の有無で親を変える」
- **View Transitions API** でページ遷移アニメ
- **WebGPU** でブラウザに GPU 計算
- **Passkeys** でパスワード不要認証

「**フレームワークでしか出来ないこと**」が次々に**標準化**されています。プロダクト側はネイティブを優先し、ポリフィル/ライブラリは縮小していけます。

## CSS の現代

### Container Queries

ビューポートではなく**親要素**で切替:

```css
.card { container-type: inline-size; }

@container (min-width: 600px) {
  .card-inner { display: grid; grid-template-columns: 1fr 2fr; }
}
```

サイドバー内のカードと、メインの大きなカードを**それぞれの親に合わせて**別レイアウト。

→ [[../30-Interface/Responsive-Design]]

### `:has()` (親セレクタ)

```css
/* 子に img.hero があるなら親の padding-top を消す */
article:has(img.hero) { padding-top: 0; }

/* チェックボックスが checked のときに親をハイライト */
.row:has(input:checked) { background: var(--accent); }

/* 兄弟への影響 */
.label:has(+ input:invalid) { color: red; }
```

JS が必要だった「**子で親を変える**」が CSS で書ける。

### CSS Nesting

```css
.button {
  background: var(--bg);

  &:hover {
    background: var(--bg-hover);
  }

  & .icon {
    margin-right: 8px;
  }
}
```

SCSS が要らなくなる範囲が広がる。

### `@property` (型付き Custom Property)

```css
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.box {
  background: linear-gradient(var(--gradient-angle), red, blue);
  transition: --gradient-angle 1s;
}
.box:hover { --gradient-angle: 180deg; }
```

カスタムプロパティをアニメーション可能に。シェーダ的な表現が CSS で。

→ [[../20-Design/Material-Surfaces]]

### Subgrid

ネストした grid が**親グリッドに揃う**:

```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }
.card  { display: grid; grid-template-rows: subgrid; grid-row: span 3; }
```

行揃えが**自動**で行える。

### View Transitions API

ブラウザネイティブのページ遷移アニメ:

#### Same-document (SPA)

```ts
document.startViewTransition(() => {
  // 状態を更新
  setView("detail");
});
```

#### Cross-document (MPA, 2025+ 安定)

```css
@view-transition { navigation: auto; }

.thumbnail   { view-transition-name: hero-image; }
.detail-hero { view-transition-name: hero-image; }
```

リスト → 詳細で**画像がモーフィング**。SPA でなくても SPA らしさが出る。

→ [[../20-Design/Motion-System]] / [[../30-Interface/Motion-Storytelling]]

### Scroll-Driven Animations

→ [[../30-Interface/Scroll-Driven-Animations]]

JS なしでスクロール量に連動。

### `text-wrap: balance / pretty`

```css
h1 { text-wrap: balance; }   /* 見出しの行を均等に */
p  { text-wrap: pretty; }    /* 本文の改行を最適化 */
```

長年の「**見出しが 1 行はみ出る**」問題が CSS で解決。

### Logical Properties

```css
margin-inline-start: 16px;  /* RTL で自動反転 */
padding-block-end: 24px;
inset-inline: 0;
```

→ [[../40-Bridge/Internationalization]]

## HTML の進化

### `<dialog>` (モーダル標準)

```html
<dialog id="confirm">
  <p>本当に削除しますか?</p>
  <form method="dialog">
    <button value="cancel">キャンセル</button>
    <button value="confirm">削除</button>
  </form>
</dialog>
<script>
  document.getElementById("confirm").showModal();
</script>
```

フォーカストラップ・Esc キー・背景クリックを**ブラウザが標準提供**。

### `<details>` / `<summary>`

折りたたみ UI が**JS なし**で。

### `popover` 属性

```html
<button popovertarget="menu">メニュー</button>
<div id="menu" popover>...</div>
```

トップレイヤに自動で乗り、外側クリックで自動クローズ。

### `inputmode` / `enterkeyhint`

```html
<input inputmode="numeric" enterkeyhint="search" />
```

モバイルキーボードを文脈に応じて。

→ [[../30-Interface/Forms-and-Input]]

### `loading="lazy"` / `decoding="async"` / `fetchpriority`

```html
<img src="hero.jpg" fetchpriority="high" decoding="async" />
<img src="below.jpg" loading="lazy" />
```

主要画像は優先、画面外は遅延。LCP を改善。

→ [[../40-Bridge/Performance-as-UX]]

## JavaScript の進化

### Top-level `await`

```ts
const data = await fetch("/api/data").then(r => r.json());
export default data;
```

ESM ではモジュール最上位で `await` 可能。

### `import.meta`

```ts
const url = new URL("./image.png", import.meta.url);
```

モジュール相対の URL 解決。

### Pipeline Operator (Stage 2)

```ts
const result = value
  |> double
  |> increment
  |> toString;
```

関数合成が読みやすく。

→ [[Functional-Programming]]

### Iterator Helpers

```ts
const sum = users
  .values()
  .filter(u => u.active)
  .map(u => u.score)
  .reduce((a, b) => a + b, 0);
```

配列に変換せずチェーン可能 (Lazy)。

### Temporal API

```ts
const today = Temporal.Now.plainDateISO();
const future = today.add({ days: 30 });
const duration = future.since(today);
```

`Date` の悪夢がついに終わる。タイムゾーン・期間・営業日計算が組み込み。

### Array `.with()`, `.toReversed()`, `.toSorted()`

```ts
const next = arr.with(0, "new");      // 不変の更新
const sorted = arr.toSorted();         // 元を変えない
```

不変性を組み込みでサポート。

→ [[Functional-Programming]]

## 認証: Passkey / WebAuthn

パスワード不要認証が**主流**に:

```ts
// 登録
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: ...,
    rp: { name: "Example" },
    user: { id, name, displayName },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: { userVerification: "required" },
  },
});

// 認証
const assertion = await navigator.credentials.get({
  publicKey: { challenge: ..., allowCredentials: [...] },
});
```

利点:
- **フィッシング耐性**(ドメイン縛り)
- **生体認証**(Face/Touch ID)
- **クロスデバイス**(iCloud Keychain, Google Password Manager)
- パスワード漏洩リスクゼロ

→ [[Security]]

## WebGPU

WebGL の後継。**コンピュートシェーダ**が使える:

```ts
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
// シェーダ・パイプライン作成
```

用途:
- 高速 3D
- ML 推論 (ブラウザで GPU 加速 LLM)
- 物理シミュレーション
- 画像処理

ライブラリ: TensorFlow.js, ONNX Runtime Web, transformers.js が WebGPU 対応。

→ [[../20-Design/Creative-Coding-Canvas-WebGL]]

## ブラウザ内データベース

### SQLite WASM + OPFS

ブラウザに**フルの SQLite**:

```ts
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.OpfsDb("/mydb.sqlite3");
db.exec("CREATE TABLE notes ...");
```

オフライン・大量データ・複雑クエリ可能。Origin Private File System で永続化。

### IndexedDB / Dexie

長年使われている KV ストア。Dexie で扱いやすく。

→ [[Caching-Strategies]] / [[../40-Bridge/Local-First-Sync]]

## File System Access API

ブラウザがローカルファイル直接編集:

```ts
const handle = await window.showOpenFilePicker();
const file = await handle[0].getFile();
const text = await file.text();
// 編集後
const writable = await handle[0].createWritable();
await writable.write(newText);
await writable.close();
```

VS Code Web、Figma 風アプリで威力を発揮。Chromium 系限定。

## Web Components

```ts
class MyButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>:host { display: inline-block; }</style>
      <button><slot></slot></button>
    `;
  }
}
customElements.define("my-button", MyButton);
```

```html
<my-button>クリック</my-button>
```

フレームワーク非依存のコンポーネント。Lit, FAST で生産性向上。Apple/GitHub/Adobe が大規模採用。

### Declarative Shadow DOM

SSR で Shadow DOM が出力可能に:

```html
<my-card>
  <template shadowrootmode="open">
    <style>...</style>
    <slot></slot>
  </template>
  内容
</my-card>
```

## Service Worker / PWA 進化

- **Background Sync**: オフラインで保留 → 復帰時送信
- **Periodic Background Sync**: 定期更新 (限定的)
- **Push API**: サーバプッシュ (許諾済みユーザーへ)
- **Web Share Target**: OS の共有先になる
- **Badging API**: アプリアイコンに数字バッジ
- **Window Controls Overlay**: タイトルバー領域もアプリで使う

→ [[../30-Interface/Mobile-Patterns]] / [[../30-Interface/Notifications]]

## Web Streams / Streams API

```ts
const response = await fetch("/api/large");
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // chunk ごとに処理
}
```

LLM ストリーミング、大ファイル処理、リアルタイム配信の基盤。

→ [[../30-Interface/AI-LLM-Interfaces]]

## アンチパターン

- 全部に`<div>` (`<dialog>`, `<details>`, `popover` を使え)
- jQuery 風の `addEventListener` 大量配置(イベント委譲、`closest()` で済む)
- ライブラリで CSS 機能を再実装(Container Query 不要なライブラリ多数)
- ポリフィルを**全ブラウザ向け**(ターゲットを絞る)
- `Date` で永遠の苦痛(Temporal を使う)

## チェックリスト

- [ ] **Container Queries** を使えるところで使っているか
- [ ] **`:has()`** で JS の DOM 操作が減らせないか
- [ ] **`<dialog>` / `popover`** でモーダル・ポップオーバーを作っているか
- [ ] **View Transitions** で遷移を強化しているか
- [ ] **Passkeys** を提供しているか(認証あり)
- [ ] **`fetchpriority` / `loading="lazy"`** で画像を最適化しているか
- [ ] フレームワークが**標準仕様を上回る**機能を提供しているか確認したか

## 関連

- [[Performance]]
- [[Security]]
- [[Caching-Strategies]]
- [[../20-Design/Motion-System]]
- [[../20-Design/Material-Surfaces]]
- [[../30-Interface/Responsive-Design]]
- [[../30-Interface/Forms-and-Input]]
- [[../30-Interface/Scroll-Driven-Animations]]
- [[../30-Interface/Motion-Storytelling]]
- [[../40-Bridge/Performance-as-UX]]
- [[../40-Bridge/Local-First-Sync]]

## 深掘り

- web.dev (Google)
- *Modern CSS Solutions* by Stephanie Eckles
- *Every Layout* by Heydon Pickering
- *Web Components in Action* by Ben Farrell
- *Designing for the Web Platform* by Bramus Van Damme
- caniuse.com で機能ごとの対応状況確認
