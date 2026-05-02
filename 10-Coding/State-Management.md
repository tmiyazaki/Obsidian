---
tags: [skill, coding, frontend]
domain: coding
level: intermediate
---

# 状態管理 (State Management)

## 一行で

> UI の複雑さの大半は「**状態が増殖し、同期が崩れる**」ことから来る。状態の**所在**と**真実**を設計する。

## なぜ重要か

機能を足すたびに状態が雪だるま式に増えるアプリは、**バグが状態の組み合わせ**から生まれます。「どこで誰が更新するのか」が不明瞭だと、画面ごとに同じデータの**別バージョン**が共存します。状態管理は、それを**観測可能・予測可能**にする設計。

## 状態を分類する

すべての state を同じ場所に置く必要はありません。**性質で分ける**と適切な置き場が見える:

| 種類 | 例 | 適した置き場 |
|---|---|---|
| **サーバー状態** | API から取得したユーザー、注文 | TanStack Query / SWR / RTK Query |
| **クライアント UI 状態** | モーダル開閉、選択中タブ | useState / Zustand / Jotai |
| **フォーム状態** | 入力中の値、バリデーション | React Hook Form / Formik |
| **URL 状態** | フィルタ、ページ番号、選択中 ID | Router / クエリパラメタ |
| **派生状態** | 合計、フィルタ後リスト | 計算 (selector / memo) |
| **永続状態** | テーマ、認証トークン | localStorage / IndexedDB |

最も重要な区別は **サーバー状態 vs クライアント状態**。Redux にサーバーデータを丸ごと載せていた時代は終わった。

## サーバー状態の特性

- 真実はサーバーにある (こちらは**キャッシュ**)
- 古びる (stale)
- 共有される (他ユーザーが変更)
- 取得が非同期で、失敗しうる

→ React Query / SWR / Apollo / Relay は**この性質に特化**:
- **stale-while-revalidate**
- **キャッシュキー**による重複排除
- **再フェッチ**(focus, network reconnect, interval)
- **楽観的更新** + ロールバック

## クライアント UI 状態の戦略

### 1. ローカル優先 (Local first)

まず `useState` で書く。**親に持ち上げる必要が出たとき**だけ持ち上げる。早すぎる Lift は YAGNI。

### 2. リフトアップの段階

```
useState (1 コンポーネント)
  ↓ 兄弟も使うようになった
親に Lift Up + props で渡す
  ↓ 深く渡すとプロップドリルが辛い
Context (中規模、頻繁更新でない)
  ↓ 大規模・頻繁更新で再描画が増える
Zustand / Jotai / Redux など外部 store
```

「Context は頻繁更新に弱い」(購読者全部再描画)を覚える。

### 3. Single Source of Truth

同じ事実を**複数箇所**に持たない。
- 派生は**計算**で得る (合計、件数、フィルタ結果)
- `selectedItem` を持つなら、`selectedItemDetails` は持たず ID から導出

### 4. Lifting State Down

逆向きも考える ― 親が持っているが**1 子だけが使う** state は子に下げる。親の再描画が消える。

## 状態管理ライブラリ比較

| ライブラリ | 特徴 | 向き |
|---|---|---|
| **Redux Toolkit** | 強い規約、devtools 強力、ボイラープレート少 | 大規模、複雑なアクション履歴 |
| **Zustand** | 軽量、API シンプル、学習コスト低 | 中小規模、自由度高め |
| **Jotai** | atomic、依存追跡が自動 | 細粒度の state、派生多い |
| **MobX** | observable、明示的でない再描画 | OOP 派、レガシー多 |
| **XState** | 状態機械、ガード/遷移の明示 | 複雑な遷移 (ウィザード、決済) |
| **Recoil** | atomic、Facebook 製 | (メンテ状況に注意) |

「**全部 Redux**」も「**全部 useState**」も最適でない。**規模と性質**で選ぶ。

## State Machine の威力

`isLoading`, `isError`, `isSuccess` を**真偽値で持つ**と組み合わせ爆発する。

```
isLoading=true && isSuccess=true ← ありえない状態
```

State Machine なら**1 つの状態**を持つ:

```ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

不可能な状態が型で**表現できない**。XState なら遷移ガードまで定義できる。

## 不変性 (Immutability)

オブジェクトを直接変更せず、**新しいオブジェクト**を作る。

```ts
// ❌ 直接変更
state.users.push(newUser);

// ✅ 新規作成
state.users = [...state.users, newUser];
```

メリット:
- React の再描画判定が**参照比較**で済む
- タイムトラベルデバッグ可能
- 並行アクセスで競合しない

ボイラープレートを減らすには **Immer** を使う (Redux Toolkit 内蔵)。

## 副作用の管理

API 呼び出し、購読、タイマーなどの副作用は**コンポーネント外**または**専用フック**に隔離:

```tsx
// ❌ コンポーネント内に複雑な副作用
useEffect(() => {
  let cancelled = false;
  fetchUser(id).then((u) => { if (!cancelled) setUser(u); });
  return () => { cancelled = true; };
}, [id]);

// ✅ React Query で隔離
const { data: user } = useQuery(["user", id], () => fetchUser(id));
```

副作用は**直接書く回数が増えるほどバグの温床**。専用ツールに任せる。

## URL を Source of Truth にする

検索条件、選択中タブ、ページ番号は **URL クエリ** に置く。

利点:
- 共有可能 (URL コピーで同じ画面)
- ブラウザバックで自然に戻れる
- リロードで状態保持
- SSR との相性

```ts
// nuqs / next/router を使うと型付きで扱える
const [filter, setFilter] = useQueryState("filter");
```

## アンチパターン

- サーバーデータを**Redux に丸ごと**載せる (stale, refetch を再発明)
- すべてを Context に入れて**全部再描画**
- 派生状態を**state として保存** (同期バグの温床)
- `useState` 5 個でフォーム状態を管理 (`useReducer` か form ライブラリへ)
- 真偽値の組み合わせで状態管理 (State Machine 候補)
- リロードで失う**重要な**画面状態を URL に出していない
- props のドリリングを**5 階層以上**

## チェックリスト

- [ ] サーバー状態とクライアント状態が**分離**されているか
- [ ] 派生は**計算**で得ているか (二重保存していないか)
- [ ] 不可能な状態が**型で**排除されているか
- [ ] 副作用が専用フック/ライブラリに隔離されているか
- [ ] URL に出すべき状態が出ているか
- [ ] state ライブラリの選択が**規模に妥当**か

## 関連

- [[../30-Interface/Forms-and-Input]]
- [[../30-Interface/Loading-States]]
- [[../30-Interface/Interaction-Patterns]]
- [[Performance]]
- [[../40-Bridge/Component-Driven-Development]]

## 深掘り

- TanStack Query documentation
- Kent C. Dodds, *Application State Management with React*
- David Khourshid, *Welcome to the world of statecharts*
