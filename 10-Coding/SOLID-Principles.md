---
tags: [skill, coding, design]
domain: coding
level: intermediate
---

# SOLID 原則

## 一行で

> オブジェクト指向設計で「**変更に強い構造**」を作るための 5 つの軸。守るためでなく、**揺らぎを観測する**ための物差しとして使う。

## なぜ重要か

ソフトウェアの腐敗は「変更が変更を呼ぶ」連鎖から始まります。あるメソッドを直すと別クラスが壊れ、それを直すとまた別が壊れる ― いわゆる**散弾銃手術**。SOLID は、依存の張り方を制約することで、変更の波及範囲をクラス境界の内側に閉じ込めます。

## 5 原則

### S — Single Responsibility Principle (単一責任)

> クラスが変わる理由はひとつだけであるべき。

「責任」≒「変更を要求するアクター」。`Employee` クラスが、給与計算・勤怠表示・DB 永続化の **3 アクターから変更要求を受ける**なら、それは 3 クラスの仮の姿。

### O — Open/Closed Principle (開放/閉鎖)

> 拡張に対して開き、修正に対して閉じる。

新機能を「**既存コードを書き換えずに**追加できる」構造を狙う。具体的には、振る舞いの違いを多態(継承/インターフェース)・戦略パターン・コンフィグで吸収する。

```ts
// Open: 新しい支払い手段は ConcretePayment を足すだけ
interface PaymentMethod { charge(amount: number): Promise<void>; }
class CreditCard implements PaymentMethod { /* ... */ }
class Paypal     implements PaymentMethod { /* ... */ }
```

### L — Liskov Substitution Principle (リスコフの置換)

> 派生型は基底型と**置き換え可能**でなければならない。

派生クラスが「ある条件で例外を投げる」「契約を狭める」と、呼び出し側が `if (x instanceof Foo)` で分岐し始める。これは継承の失敗信号。

古典的反例: `Rectangle` を継承した `Square`。`setWidth/setHeight` の意味が変わるため置換できない。

### I — Interface Segregation Principle (インターフェース分離)

> クライアントが**使わないメソッドへの依存**を強制してはならない。

肥大化したインターフェースは、実装側に「使わないが実装する義務」を生み、テスト時のモック地獄を呼ぶ。**ロール別インターフェース**で切り分ける。

```ts
// 悪い: 全機能を 1 IF に詰める
interface UserOps { read(): User; write(u: User): void; audit(): Log[]; }

// 良い: ロール別
interface UserReader { read(): User; }
interface UserWriter { write(u: User): void; }
interface UserAuditor { audit(): Log[]; }
```

### D — Dependency Inversion Principle (依存性逆転)

> 上位モジュールは下位モジュールに依存してはならない。**両者が抽象に依存する**。

ビジネスロジックが MySQL や HTTP クライアントといった**下位の実装詳細を直接 import している**なら危険信号。境界に抽象を置き、下位実装は外側から差し込む(DI/コンストラクタ注入)。

```
[ UseCase ] ──depends on──▶ [ IRepository ]   ← 抽象
                                  ▲
                                  │ implements
                          [ MysqlRepository ]   ← 詳細(差し替え可能)
```

## 実践

### 良い兆候

- 新機能追加で**既存ファイルの変更が小さい**
- ユニットテストが**実 DB / 実 HTTP なしに書ける**
- 1 ファイルを開いたとき**1 つの関心事**しか見えない

### 危険な兆候

- import 文が**プロジェクト全体に広く張られている**ファイル
- 1 メソッドを直すと**全テストが落ちる**
- `if (type === 'A') ... else if (type === 'B') ...` が**複数箇所に同じ形で**現れる(多態化候補)

## よくある誤解

- ❌ 5 原則を**全部に**適用すべき
- ✅ コストとリターンを比較する。**変更頻度の高い領域**に集中投下する

- ❌ クラス数が増えるほど SOLID 的
- ✅ 過度に分割すると**ジャンプ過多**で逆に読めない。粒度は変更単位に合わせる

- ❌ DI = DI コンテナ
- ✅ DI は概念。**コンストラクタ引数で渡す**だけでも十分なケースは多い

## チェックリスト

- [ ] このクラスを変えるアクターは何種類か
- [ ] 振る舞いの違いを `if/else` で書いていないか(多態の出番か)
- [ ] 派生型を基底型として渡しても全テスト通るか
- [ ] 公開インターフェースに**呼ばれていないメソッド**が混ざっていないか
- [ ] ビジネスロジックから**フレームワークが import されて**いないか

## 関連

- [[Clean-Code]]
- [[Design-Patterns]]
- [[Architecture-Layers]]
- [[Testing-Strategy]]

## 深掘り

- Robert C. Martin, *Clean Architecture*
- Sandi Metz, *Practical Object-Oriented Design in Ruby* (POODR)
