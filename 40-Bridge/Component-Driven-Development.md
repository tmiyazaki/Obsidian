---
tags: [skill, bridge, components]
domain: cross-cutting
level: intermediate
---

# コンポーネント駆動開発 (CDD)

## 一行で

> UI を「**部品の合成**」として作る方法論。コードと[[../20-Design/Design-Systems|デザインシステム]]の両方を**同じ単位**で扱える。

## なぜ重要か

ページ単位での開発は、**重複・不整合・テスト困難**を生みます。コンポーネント単位なら:
- 同じ部品が**画面間で共有**される(一貫性)
- 単独で**開発・テスト**できる(隔離性)
- デザインとコードが**同じ語彙**で会話できる(プロセスの整列)

## CDD のワークフロー

```
1. デザインで部品を抽出 (Design System)
       ↓
2. コードで部品を実装 (Storybook 等)
       ↓
3. 部品を組み合わせて画面を構築
       ↓
4. ページにビジネスロジックを差す
```

「**ボトムアップ**」で進めるのが特徴。先にページを作ってから抽出するのは難しい(粒度がぶれる)。

## コンポーネントの粒度 — Atomic Design 再訪

→ [[../20-Design/Design-Systems#Atomic-Design]]

| 層 | 例 | 自立性 |
|---|---|---|
| Atoms | Button, Input, Icon | 高 |
| Molecules | InputField (Label + Input + Error) | 高 |
| Organisms | Header, Form, Card | 中 |
| Templates | ページの骨格 | 低 |
| Pages | データ込みの具体例 | — |

「**正解**」より「**チーム共通の語彙**」が大切。教条的にならない。

## 良いコンポーネントの設計

### 1. 単一責任

「ボタン」は押されるだけ。中身に**業務ロジックを持たない**。

```tsx
// ❌ ボタンが API を知っている
<SaveProfileButton userId={42} />

// ✅ 汎用ボタン + 呼び出し側で処理
<Button onClick={handleSaveProfile}>保存</Button>
```

### 2. Props は小さく明確

- 真偽値は質問形 (`isPrimary` ではなく `variant="primary"` のほうが拡張性高)
- 5 個超の props はリファクタ候補
- **Boolean フラグの組み合わせは状態に**

```tsx
// ❌ 状態が組合せ爆発
<Button isLoading isDisabled isPrimary />

// ✅ 単一の state
<Button state="loading" variant="primary" />
```

### 3. Composition > Configuration

たくさんの props で振る舞いを切り替えるより、**子要素として渡す**方が拡張性が高い:

```tsx
// ❌ 全パターンを props で
<Card title="x" subtitle="y" image="z" actions={[...]} />

// ✅ Slot として組み立て
<Card>
  <Card.Image src="z" />
  <Card.Title>x</Card.Title>
  <Card.Subtitle>y</Card.Subtitle>
  <Card.Actions>
    <Button>Save</Button>
  </Card.Actions>
</Card>
```

### 4. Controlled / Uncontrolled の選択

```tsx
// Uncontrolled: 内部 state、シンプル
<Input defaultValue="hello" />

// Controlled: 外部 state、完全制御
<Input value={value} onChange={setValue} />
```

両対応がライブラリ的には親切だが、**プロダクト内部では片方に絞る**ほうが学習コスト低い。

### 5. アクセシビリティを含める

ボタンは `<button>`、ダイアログは `role="dialog"`、フォーカス管理は内部で。
**外側に漏らさない**のがコンポーネントの価値。

→ [[../30-Interface/Accessibility]]

## Storybook(あるいは同等)を中心に据える

```
Storybook
├── 各コンポーネントを単独で起動
├── 全 Variant/State を網羅
├── デザイナーがレビューできる URL
├── Visual Regression Test の入力
└── ドキュメント
```

開発の中心が Storybook になると:
- ページ未完成でも UI が完成する
- デザイナーが**実物**でレビューできる(Figma との往復が減る)
- バグ報告が**Storybook URL** で行える

## デザインとコードの整列

| デザイン側 | コード側 |
|---|---|
| Component (Figma) | Component (React/Vue/etc.) |
| Variant | Props variant |
| Style (Color, Type) | Design Tokens |
| Frame | Layout primitives |

両者が**同じ名前**で呼ばれることが理想:

```
Figma の "Button / Primary / Large" ⇔ コードの <Button variant="primary" size="large" />
```

→ [[Design-Code-Handoff]]

## ビジュアルリグレッションテスト

コンポーネントごとにスナップショットを撮り、変更時に diff を出す。

- Chromatic (Storybook 公式)
- Percy
- Playwright + image comparison

**意図しないスタイル変化**を CI で検出。デザインシステムの安全網。

## マイクロフロントエンドとの関係

複数チーム/複数アプリで UI を共有するとき:
- **共通デザインシステム**を npm パッケージで配布
- 各アプリは Atom/Molecule を組み合わせて Organisms を作る
- バージョニングと breaking change の運用が肝

## アンチパターン

- ページ単位で開発 → 重複・不整合
- ビジネスロジックがコンポーネント内蔵 → 再利用不能
- 巨大な props オブジェクト → 学習・メンテ困難
- Variant が**実装で表現**されず**コピペで増殖**
- Storybook 未整備 → デザイナーがコードレビューに同席

## チェックリスト

- [ ] コンポーネントは**単一責任**を持っているか
- [ ] Props は最小限で、命名が明確か
- [ ] 単独で**Storybook 等で起動**できるか
- [ ] アクセシビリティが**コンポーネント内に内蔵**されているか
- [ ] デザインとコードで**同じ名前**を使っているか
- [ ] ビジュアルテストがあるか

## 関連

- [[Design-Code-Handoff]]
- [[../20-Design/Design-Systems]]
- [[../20-Design/Design-Tokens]]
- [[../10-Coding/Clean-Code]]
- [[../10-Coding/SOLID-Principles]]
- [[../30-Interface/Interaction-Patterns]]

## 深掘り

- Brad Frost, *Atomic Design*
- Storybook ドキュメント (Component Story Format)
