---
tags: [skill, coding, wasm, performance]
domain: coding
level: advanced
---

# WebAssembly とネイティブ Web

## 一行で

> JavaScript の限界を超える計算は **WASM (WebAssembly)** で。ブラウザに**ネイティブ並みの速度**を持ち込み、Rust/C++/Go/Zig の資産を Web で動かす。

## なぜ重要か

JavaScript は便利だが:
- 重い数値計算が遅い
- メモリ管理が雑
- ライブラリ資産が**JS だけ**(C/Rust の 30 年が使えない)

WASM は:
- ネイティブの **80-95% 速度**
- 言語非依存(Rust, C++, Go, Zig, AssemblyScript)
- **小さい** (gzip 後 KB 単位も可)
- セキュア(サンドボックス内)
- ブラウザ + サーバ + エッジで動く

## 採用が伸びる場面

### 1. 重い計算

- 画像 / 動画処理 (Photoshop Web, Figma)
- 3D / ゲームエンジン (Unity, Unreal Web export)
- 暗号 / 圧縮
- ML 推論 (transformers.js, ONNX Runtime Web)
- 物理シミュレーション

### 2. 既存資産の Web 化

- libsodium (暗号), ffmpeg, sqlite, ImageMagick
- C++ で書かれた業務ロジックを Web へ
- Python (Pyodide), Ruby (ruby.wasm)

### 3. ポータブルプラグイン

- Figma plugins (一部 WASM)
- Edge functions (Fastly Compute@Edge は WASM ベース)
- Plugin SDK (1 度書いてどこでも動く)

## ツールチェーン

### Rust → WASM

```sh
cargo install wasm-pack
wasm-pack build --target web
```

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
  if n <= 1 { return n; }
  fibonacci(n - 1) + fibonacci(n - 2)
}
```

```ts
// JS 側
import init, { fibonacci } from "./pkg/my_lib.js";
await init();
console.log(fibonacci(40));
```

`wasm-bindgen` が JS ↔ Rust の境界を**自動生成**。

### C/C++ → WASM (Emscripten)

```sh
emcc app.c -o app.js -s WASM=1
```

ffmpeg, ImageMagick, OpenCV 等の移植に使われる。

### AssemblyScript

TypeScript ライクな構文で WASM を書く:

```ts
export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

学習コスト低だが**フル TS ではない**(GC 制約等)。

### Go / Zig

Go は WASM 出力可能だが**大きい**(ランタイム込み)。
Zig は小さく速いが**新興**。

## WebAssembly System Interface (WASI)

ブラウザ外でも動く WASM の標準:
- ファイル / ネットワーク / 環境変数 アクセス
- サーバ・エッジ・組み込み

WASI ベースのランタイム:
- Wasmtime (Bytecode Alliance)
- Wasmer
- WasmEdge (CNCF)

エッジ最大手 Fastly や Cloudflare はこの方向。

## メモリと境界

WASM は**線形メモリ**を持つ:

```
[ JS ]  ↔  [ WASM Memory (ArrayBuffer) ]
```

JS と WASM の間は**コピー or 参照** で渡す。
プリミティブ (i32, f64) は値渡し、文字列・配列は**メモリ書き出し → ポインタ渡し**。

```ts
const memory = new WebAssembly.Memory({ initial: 1 });
const view = new Uint8Array(memory.buffer);
```

## SIMD と Threads

### SIMD (Single Instruction Multiple Data)

```rust
use std::arch::wasm32::*;
let v = f32x4(1.0, 2.0, 3.0, 4.0);
```

4 値同時計算。画像・音声処理で**数倍速**。

### SharedArrayBuffer + Atomics

```ts
const sab = new SharedArrayBuffer(1024);
new Worker("worker.js", { /* shared */ });
```

複数スレッドでメモリ共有 (Cross-Origin Isolation 必須)。
Rust の `rayon` や C++ の OpenMP が使える。

→ [[Concurrency-Async]]

## パフォーマンスの実態

「JS より 100 倍速い!」は**特定条件**で:
- 数値計算ヘビー: ✓
- DOM 操作ヘビー: ✗ (DOM アクセスは JS 経由 = 境界コスト)
- 文字列処理: 場合による

ベンチマーク必須。「**WASM だから速い**」は誤解。
→ [[Performance]]

## 起動コスト

WASM モジュール:
- ロード: バンドルサイズ依存 (50KB-数 MB)
- コンパイル: 数十 ms-数秒

対策:
- **Streaming compilation** (`WebAssembly.instantiateStreaming`)
- 遅延ロード(必要時のみ)
- 軽量モデル選択

LCP に直接影響する。
→ [[../40-Bridge/Performance-as-UX]]

## ML / AI in WASM

ブラウザで LLM 推論:
- transformers.js (Hugging Face)
- ONNX Runtime Web
- Web LLM
- llama.cpp の WASM 移植

WebGPU と組み合わせると**端末で 7B モデル**が現実的。
プライバシー強(サーバに送らない)。

→ [[../30-Interface/AI-LLM-Interfaces]] / [[../40-Bridge/Privacy-by-Design]]

### 主要ユースケース

- リアルタイム翻訳 (ローカル)
- 顔検出・姿勢推定 (MediaPipe)
- 画像生成 (Stable Diffusion Web)
- コード補完 (端末)

## ブラウザでの SQL

→ [[Modern-Web-Platform]]

SQLite WASM + OPFS で**フルの SQLite**:

```ts
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.OpfsDb("/app.db");
db.exec("CREATE TABLE notes (...)");
```

ローカルファースト・大量データ・複雑クエリが可能に。

→ [[../40-Bridge/Local-First-Sync]]

## 境界の罠

WASM ↔ JS の境界は**コスト**:
- 関数呼び出しオーバーヘッド (μs オーダー)
- データコピー
- 文字列変換

「WASM 関数を**毎フレーム呼ぶ**」は遅くなることも。
**バッチ処理** + 大きなデータ転送が効率的。

## デバッグ

- Chrome DevTools の WASM source map
- `console.log` を WASM から呼ぶには Imports 設定
- ネイティブ デバッガ (gdb, lldb) との連携は限定的
- 各言語のテストツールで**先に**ローカルで完結させる

## セキュリティ

WASM は**サンドボックス**:
- メモリは隔離(他コードに影響しない)
- ブラウザ API は **Imports 経由**で限定提供
- バッファオーバーフローは**プロセスを落とさない**

ただし:
- WASM コード自体に脆弱性はあり (Rust の unsafe 等)
- 持ち込んだ依存に脆弱性

## デプロイ

ファイルサイズ最適化:
- `wasm-opt -Oz` (最大圧縮)
- 不要なコード削除
- gzip / brotli (転送時)

CDN 配信 + 適切な Cache-Control。
→ [[Caching-Strategies]]

## アンチパターン

- 「**速いはず**」で WASM 選択(計測なし)
- DOM ヘビー処理を WASM へ(境界コストで遅くなる)
- 巨大バンドル (> 5MB) を**初期ロード**
- Streaming compilation せず**全 ロード待ち**
- Source Map なしで**デバッグ困難**
- 既存ライブラリで済む処理を再実装
- ブラウザ非対応を考慮しない

## チェックリスト

- [ ] **本当に WASM が必要**か計測したか
- [ ] バンドルサイズが**許容範囲**か
- [ ] **Streaming compilation** を使っているか
- [ ] 境界コスト(JS ↔ WASM 呼び出し)を意識しているか
- [ ] フォールバック(WASM 非対応 / 失敗時)があるか
- [ ] Source Map 提供しているか(本番でない)

## 関連

- [[Performance]]
- [[Concurrency-Async]]
- [[Build-Tools-Modern]]
- [[Edge-and-Distributed]]
- [[Modern-Web-Platform]]
- [[Caching-Strategies]]
- [[../20-Design/Creative-Coding-Canvas-WebGL]]
- [[../30-Interface/AI-LLM-Interfaces]]
- [[../40-Bridge/Local-First-Sync]]
- [[../40-Bridge/Performance-as-UX]]
- [[../40-Bridge/Privacy-by-Design]]

## 深掘り

- *Programming WebAssembly with Rust* by Kevin Hoffman
- WebAssembly.org documentation
- *Real-World Cryptography* (libsodium / WASM 例)
- transformers.js / WebLLM blog posts
- Bytecode Alliance (Wasmtime, Cranelift)
- Lin Clark の WASM 解説アニメ
