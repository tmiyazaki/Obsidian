---
tags: [skill, coding, practice]
domain: coding
level: intermediate
---

# リファクタリング

## 一行で

> 振る舞いを保ったまま**内部構造を改善**するための、小さく安全な変更の連鎖。

## なぜ重要か

ソフトウェアは作って終わりではなく、**継続的に変更可能な状態**を保つことに価値があります。リファクタリングは「機能追加の前の準備運動」であり、Kent Beck の言葉では:

> "Make the change easy, then make the easy change."

「まず変更しやすくしてから、簡単な変更を行え。」

## 中核となる原理

### 1. テストの保護下で行う

リファクタリングと**振る舞いの変更**を同時にやらない。**テストが緑のあいだだけ**構造を動かす。緑が長く続くなら歩幅を伸ばし、不安なら歩幅を縮める。

### 2. 小さなステップ

1 コミット = 1 リファクタリング。**コミット履歴がレビューしやすい単位**であること。大きな塊で出すと、レビュー側はバグ混入を疑い始める。

### 3. 二段階ルール (Two Hat Rule)

Martin Fowler の言葉:

> 「リファクタの帽子をかぶっているとき、機能追加はしない。機能追加の帽子をかぶっているとき、リファクタはしない。」

両方やりたくなったら**コミットを分ける**。

## 代表的なテクニック

### Extract Function (関数の抽出)

```ts
// Before
function printOwing(invoice) {
  console.log("***");
  console.log(`Customer: ${invoice.customer}`);
  console.log(`Amount: ${invoice.amount}`);
  console.log("***");
}

// After
function printOwing(invoice) {
  printBanner();
  printDetails(invoice);
  printBanner();
}
```

「コメントで節を分けたくなった」 = 抽出のサイン。

### Replace Magic Number with Symbolic Constant

```ts
// ❌
if (status === 4) ...

// ✅
const STATUS_SHIPPED = 4;
if (status === STATUS_SHIPPED) ...
```

### Replace Conditional with Polymorphism

`switch (type)` が**複数箇所**で同じ形なら、型ごとのクラスに振る舞いを移す。新しい型が増えたとき**1 ファイル追加で済む**ようになる。

### Introduce Parameter Object

引数が 4 つ以上ある関数 → ドメインオブジェクトの兆候。

```ts
// Before
createOrder(userId, productId, quantity, currency, country, taxRate);

// After
createOrder(user, product, { quantity, currency, country, taxRate });
```

### Replace Temp with Query

```ts
// Before
const basePrice = quantity * itemPrice;
if (basePrice > 1000) return basePrice * 0.95;

// After
function basePrice() { return quantity * itemPrice; }
if (basePrice() > 1000) return basePrice() * 0.95;
```

(パフォーマンスを気にする場合はメモ化)

## リファクタの「におい」(Code Smells)

| Smell | 兆候 | 対処 |
|---|---|---|
| Long Method | 50 行を超える関数 | Extract Function |
| Large Class | 数百行のクラス | Extract Class / SRP 適用 |
| Long Parameter List | 引数 4+ | Introduce Parameter Object |
| Divergent Change | 1 クラスが多方向から変更要求 | Extract Class |
| Shotgun Surgery | 1 変更が多クラスに散弾 | Move Method / Inline Class |
| Feature Envy | 他クラスのデータばかり触る | Move Method |
| Data Clumps | 同じ引数群が常にセットで現れる | Extract Class |
| Switch Statement | 型分岐が散在 | Replace Conditional with Polymorphism |
| Speculative Generality | 「いつか使うかも」な抽象 | Inline / Remove |
| Comments | 説明コメントが必要 | Rename / Extract |

## 実務上の判断

### いつリファクタするか

- ✅ **三度同じ変更**を強いられたとき(Rule of Three)
- ✅ **コードを理解するため**(理解に支払うコストを構造に投資する)
- ✅ **次の機能のため**(変更を簡単にしてから変更する)
- ❌ 締切直前に「ついでに」(範囲が膨れる)
- ❌ テストがない領域(まずテストを書く)

### いつリファクタしないか

- 「動いているけど美しくない」だけで、近い将来触らない領域
- 仕様変更が大きく、近々書き換えになるコード
- パフォーマンスクリティカルで構造変更が測定可能な悪化を生むとき

## チェックリスト

- [ ] 開始前にテストが緑である
- [ ] 各ステップでテストが緑のままである
- [ ] コミットは小さく、メッセージが「何を改善したか」を語る
- [ ] 振る舞い変更を含めていない
- [ ] レビュアーが**diff で何が起きたか即座に分かる**

## 関連

- [[Testing-Strategy]]
- [[Clean-Code]]
- [[Design-Patterns]]
- [[Code-Review]]

## 深掘り

- Martin Fowler, *Refactoring* (2nd ed.)
- Michael Feathers, *Working Effectively with Legacy Code*
