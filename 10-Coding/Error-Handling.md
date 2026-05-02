---
tags: [skill, coding, reliability]
domain: coding
level: intermediate
---

# エラーハンドリング

## 一行で

> エラーは「**例外的な事態**」ではなく「**コードが扱う対象**」のひとつ。設計の一級市民として位置づける。

## なぜ重要か

エラーパスは**幸せパス (happy path) と同じくらい設計が必要**です。雑な握り潰しは、本番で「気づいたら静かに壊れていた」を招きます。逆に、過剰に細かい例外設計は呼び出し側に負荷を強います。**情報量とハンドラ責任のバランス**が要点。

## エラーの 4 分類

| 種類 | 例 | 戦略 |
|---|---|---|
| 入力エラー | バリデーション失敗 | 早期に拒否し、原因を呼び出し側に返す |
| 業務ルール違反 | 在庫不足、二重登録 | ドメインの「結果型」として設計 |
| 一過性の障害 | ネットワークタイムアウト | リトライ + バックオフ + サーキットブレーカ |
| プログラムバグ | NPE、不変条件違反 | フェイルファスト、回復しない |

ここで重要なのは、**業務ルール違反を「例外」で投げない**ことです。在庫不足は「失敗」ではなく**正常な業務結果のひとつ**であり、関数の戻り値型に含めるのが筋。

## 戻り値設計のスペクトラム

### 例外を投げる

```ts
function withdraw(account: Account, amount: number): void {
  if (account.balance < amount) throw new InsufficientFundsError();
  account.balance -= amount;
}
```

長所: 強制力がある(無視するとクラッシュ)。
短所: 「失敗が起こりうる」が**型に出ない**ので呼び忘れる。

### 結果型 (Result / Either)

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function withdraw(account: Account, amount: number): Result<Account, "INSUFFICIENT_FUNDS"> {
  if (account.balance < amount) return { ok: false, error: "INSUFFICIENT_FUNDS" };
  return { ok: true, value: { ...account, balance: account.balance - amount } };
}
```

長所: 失敗が**型に表れる**。呼び出し側はパターンマッチを強制される。
短所: ボイラープレートが増える。Rust/Haskell ほど人間工学的でない言語もある。

### 使い分け

- **業務ルール違反** → 結果型で表す
- **回復不能なバグ** → 例外で大域脱出 (NPE, アサーション違反)
- **境界(I/O)** → 例外を結果型に変換するアダプタ層を持つ

## リトライとサーキットブレーカ

### 指数バックオフ

```ts
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    try { return await fn(); }
    catch (e) {
      if (!isTransient(e) || i === maxAttempts - 1) throw e;
      await sleep(2 ** i * 1000 + Math.random() * 1000); // jitter
    }
  }
}
```

ジッタを入れる: 同期的なリトライが**雷鳴の群れ (thundering herd)** を呼ぶのを避ける。

### サーキットブレーカ

下流が壊れているのにリトライを続けると、**自分も道連れ**になる。

```
状態遷移: Closed (通常) → Open (拒否) → Half-Open (試験的に通す) → Closed
```

- Closed: 通常通り通す。失敗をカウント
- Open: 規定値超で開放。即時失敗を返し、下流を休ませる
- Half-Open: タイムアウト後に少数だけ通し、回復したら Closed

## エラーメッセージの設計

エラーは**3 つの観客**に向けて書く:

1. **エンドユーザー**: 何が起きて、次に何をすべきか
2. **運用者(ログ)**: いつ、どこで、何が、相関 ID は
3. **開発者(スタックトレース)**: 原因の直接情報

```
❌ "Error: undefined is not a function"
✅ ユーザー向け: "決済に失敗しました。少し待ってから再度お試しください。"
✅ ログ向け:    [trace=abc] PaymentService.charge(orderId=42) failed: timeout 5s
✅ 開発者向け:  スタックトレース + 入力(秘匿情報を除いて)
```

## 不変条件の防御

```ts
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Divide by zero");
  return a / b;
}
```

> **Fail Fast**: 壊れた状態で先に進むより、その場で止める方が損失が小さい。

ただし、**境界(I/O)では fail fast、ビジネスロジック中は結果型**、と段階を分ける。

## アンチパターン

- `catch (e) {}`: 例外の握り潰し。**ログだけ**でも残す
- `catch (e) { console.log(e); }`: ログだけで何もせず再 throw もしない
- すべての例外を 1 種類に丸める (`throw new Error("failed")`)
- ユーザー向けに**スタックトレースをそのまま見せる**(セキュリティリスク)
- リトライ対象の判断なしに**全例外をリトライ**(冪等でない操作で二重実行)

## チェックリスト

- [ ] エラーの**分類**(入力/業務/一過性/バグ)が意識できているか
- [ ] 失敗が**型**に表れているか(関数シグネチャから読めるか)
- [ ] リトライ対象は**冪等**か
- [ ] エラーメッセージは**3 つの観客**を想定しているか
- [ ] 機密情報を**ログ・ユーザーに漏らしていない**か

## 関連

- [[Testing-Strategy]]
- [[Architecture-Layers]]
- [[../30-Interface/Forms-and-Input]]
- [[../30-Interface/Microinteractions]] — エラーフィードバックは UX

## 深掘り

- Michael T. Nygard, *Release It!* (サーキットブレーカ・バルクヘッド)
