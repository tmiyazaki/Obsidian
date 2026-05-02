---
tags: [skill, coding, design]
domain: coding
level: intermediate
---

# デザインパターン

## 一行で

> 繰り返し現れる問題に対する**名前の付いた解**の語彙。**目的のために使い**、パターンのために使わない。

## なぜ重要か

パターンは「再利用可能な経験」です。共通語彙があると、設計議論で「ここは Strategy にして…」と一語で意図共有できます。ただし**パターンは目的ではなく手段** ― パターンを当てはめるために問題を歪めると逆に複雑になります。

## 3 系統(GoF)

### 生成 (Creational) — オブジェクトの生成方法を抽象化

| パターン | 一行説明 | いつ |
|---|---|---|
| Factory Method | サブクラスがインスタンスを決める | 生成ロジックを多態化したい |
| Abstract Factory | 関連オブジェクト群を一括生成 | テーマ・プラットフォーム切替 |
| Builder | 段階的な構築で複雑なオブジェクトを作る | パラメータが多い・構築順序が重要 |
| Prototype | 既存インスタンスから複製 | 生成コストが高い |
| Singleton | 唯一のインスタンス | グローバル状態(濫用注意) |

### 構造 (Structural) — クラスとオブジェクトの組み合わせ方

| パターン | 一行説明 | いつ |
|---|---|---|
| Adapter | 既存クラスを別 IF で使う | 外部ライブラリの IF が合わない |
| Bridge | 抽象と実装を独立に変えられる | プラットフォーム依存を分離 |
| Composite | 木構造を一様に扱う | UI ツリー、ファイルシステム |
| Decorator | 振る舞いを動的に追加 | 継承爆発を避ける |
| Facade | 複雑なサブシステムに窓口を一つ | 外向き API の単純化 |
| Flyweight | 状態を共有してインスタンスを減らす | 大量の似たオブジェクト |
| Proxy | 本体と同じ IF で代理を立てる | 遅延読込・アクセス制御・キャッシュ |

### 振る舞い (Behavioral) — 責務とアルゴリズムの配分

| パターン | 一行説明 | いつ |
|---|---|---|
| Strategy | アルゴリズムを差し替え可能に | 並ぶ if/else を多態化したい |
| Observer | 状態変化を購読 | イベント駆動・Pub/Sub |
| Command | 操作をオブジェクト化 | Undo/Redo・キュー化 |
| Iterator | 内部構造を隠して走査 | コレクション抽象化 |
| State | 状態ごとの振る舞いを切替 | 状態遷移が多い |
| Template Method | 骨格はスーパー、詳細はサブで | アルゴリズムの可変点が決まっている |
| Visitor | 構造に外から操作を加える | データ構造に対する多種の操作 |
| Mediator | コンポーネント間の通信を集約 | 多対多の依存を避ける |
| Chain of Responsibility | 連鎖的に処理を委譲 | ハンドラの順次試行 |
| Memento | 状態のスナップショット | Undo・チェックポイント |
| Interpreter | 文法を AST で実行 | DSL |

## モダンな観点

### 関数型/イベント駆動の世界での読み替え

オブジェクト指向で「Strategy」と呼ぶものは、関数を引数で渡せば**ただの高階関数**で済みます。「Observer」は **EventEmitter / RxJS / signals** で標準化済み。**パターンは言語の進化に応じて溶ける**。

```ts
// Strategy をクラスで実装
class CreditCardPayment implements PaymentStrategy { ... }
class PaypalPayment    implements PaymentStrategy { ... }

// 関数で十分
type Pay = (amount: number) => Promise<Receipt>;
const payByCard: Pay   = async (amt) => { ... };
const payByPaypal: Pay = async (amt) => { ... };
```

### 反パターンとして避けたいもの

- **Singleton 多用**: グローバル状態化、テスト困難
- **Factory のためのファクトリ**: 抽象化の過剰
- **継承による Decorator**: コンポジションで十分なことが多い

## 適用判断のフロー

```
そのコード、3 度同じパターンが現れたか?
  └─ Yes → 抽象化を検討
        └─ そのパターンに**名前**を持つ標準解があるか?
              └─ Yes → パターン名で議論できると有利
              └─ No  → ドメイン語彙で命名
  └─ No  → まだ早い (Rule of Three)
```

## アンチパターン辞典(対比)

| パターン濫用 | 本来の解決法 |
|---|---|
| Manager クラス | 責務の再分割 |
| God Object | 単一責任への分割 |
| Singleton で何でもアクセス | DI でコンストラクタ注入 |
| やたら抽象 IF | YAGNI ― 必要になってから |

## チェックリスト

- [ ] パターンを使う**理由**を 1 文で言えるか
- [ ] パターン名で議論しても、**チームで意味が一致**しているか
- [ ] パターンを抜くと**シンプルにならないか**を再検討したか
- [ ] テストが書きやすくなったか(逆に書きにくいなら設計が悪化)

## 関連

- [[SOLID-Principles]]
- [[Clean-Code]]
- [[Architecture-Layers]]

## 深掘り

- GoF, *Design Patterns: Elements of Reusable Object-Oriented Software*
- Eric Freeman, *Head First Design Patterns*
- refactoring.guru
