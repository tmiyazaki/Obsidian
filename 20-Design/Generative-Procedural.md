---
tags: [skill, design, generative, expression]
domain: design
level: advanced
---

# 生成的・手続き型デザイン

## 一行で

> アセットを「**手で描く**」のではなく「**規則で生成**」する設計。スケール無限、個別最適化可能、データ駆動。

## なぜ重要か

数千ユーザー × 数百画面 × 多言語 で、**手作りアセットは破綻**します。生成的アプローチは:
- ユーザーごとに**ユニーク**なアバター・OG 画像
- 数値・データに**追従**するイラスト
- ブランド色変更で**全部一斉更新**
- 印刷物・ノベルティへの**展開コスト**ゼロ

「**ロゴ職人**」より「**ロゴ生成システム**」を持つほうが、現代的なプロダクトには適合する。

## 適用領域

### 1. アバター生成

イニシャル + ハッシュ → 色 → 自動アバター:

```ts
function avatarFor(name: string): { color: string; initials: string } {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const hash = simpleHash(name);
  const hue = hash % 360;
  return { color: `oklch(70% 0.15 ${hue})`, initials };
}
```

GitHub の Identicon, Boring Avatars, DiceBear のようなライブラリも。

### 2. OG 画像 (動的サムネイル)

記事タイトル + 著者 → 自動生成 OG 画像:

```ts
// Vercel OG, Satori で React コンポーネントから画像化
export const GET = (req) => new ImageResponse(
  <div style={{ background: "#fff", padding: 64, ... }}>
    <h1>{title}</h1>
    <p>by {author}</p>
  </div>,
  { width: 1200, height: 630 }
);
```

SNS シェア時の見た目を**全記事で**統一かつ個別化。

### 3. データ駆動の図形

数値が形を決める:
- 株価 → 線の波形
- ユーザー数 → 同心円のリング数
- 売上 → 高さ
- ユーザーの活動量 → 葉っぱの色濃度 (GitHub Contribution Graph)

「**数値の物理化 (Physicalization)**」で記憶に残る。

### 4. ブランド模様

- ボロノイ
- パッキング (敷き詰め)
- フラクタル
- L-System (有機的成長)

ブランドカラーを入れて毎回違うが**一貫したトーン**のパターン。

### 5. アイコン生成

ユーザー固有のシンボル (Stripe の virtual card のように)。
- ジェネレーティブ NFT 風
- でも所有感を演出する

### 6. プレースホルダ画像

写真がアップロードされていない時の**抽象的な美しい背景**:
- グラデーションメッシュ
- 低解像度 LQIP (Low Quality Image Placeholder) - blurhash, thumbhash

## 手法

### 決定論的乱数

「ランダム」だが **入力が同じなら結果も同じ**:

```ts
function seedRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const rng = seedRandom(hash(userId));
const color = pickFromPalette(rng());
```

ユーザー ID 由来の seed なら、**毎回同じ**アバターが出る。重要 (ユーザーが「自分のアバターが変わった」と感じない)。

### Perlin / Simplex Noise

「**自然な揺らぎ**」を作る連続的な擬似乱数。
- 雲の模様
- 地形の起伏
- 流体の流れ

`simplex-noise` ライブラリで簡単に。

### L-System (Lindenmayer System)

植物の成長を模した文字列書き換えシステム。
- 木の枝
- 雪の結晶
- 抽象的な有機形

### マルコフ連鎖 / 文法

テキストや形を**学習データから生成**。
古典的だが LLM 時代でも**軽量・予測可能**で有効。

### Wave Function Collapse

タイル制約問題で**矛盾なく**敷き詰める。地図生成、模様生成。

### Force-Directed Layout

D3-force のような物理シミュレーションで**自然な配置**を得る (グラフ図、タグクラウド)。

## ジェネレーティブとブランド

ブランドガイドの中に「**生成のルール**」を組み込む:

```
✓ ブランド色から派生した色相 (±30°) のみ使う
✓ 形状言語: 角丸 8px, 線の太さ 2px
✓ 余白: 8px グリッドにスナップ
✗ 補色は使わない
```

ルールが厳格なほど、生成物は「**ブランドらしい**」と感じられる。**ランダム ≠ 表情豊か**。

→ [[Brand-Voice]] / [[Design-Systems]]

## ツールとライブラリ

### Web

- **p5.js**: クリエイティブコーディングの定番
- **Processing**: 学習資源豊富 (Java)
- **OpenFrameworks**: C++ 高性能
- **Cables.gl**: ノードベース GPU
- **Hydra**: live coding 映像

### 描画

- **Paper.js**: ベクター
- **Fabric.js**: SVG/Canvas
- **Konva.js**: Canvas インタラクション
- **Rough.js**: 手描き風

### 画像生成

- **Satori / Vercel OG**: HTML → Image
- **SVG-to-PNG** (ImageMagick, sharp)
- **Sharp**: ピクセル処理

### 物理

- **Matter.js**: 2D 物理
- **cannon.js**: 3D 物理
- **Rapier**: WASM 物理

## ML / AI と生成

LLM や Stable Diffusion で**より高度な生成**が可能に:
- ユーザー説明から画像生成
- スタイル転送
- アバターパーソナライズ
- 文書 → カスタムイラスト

ただし:
- **コスト**(計算・課金)
- **遅延**(数秒〜)
- **品質のばらつき** → 検閲・フィルタ必須
- **著作権**問題 → 訓練データの権利

→ [[../30-Interface/AI-LLM-Interfaces]] / [[../40-Bridge/Ethical-Design]]

「決定論的生成 + 部分的に AI」のハイブリッドが現実解。

## アンチパターン

- 「**ランダム = 表情豊か**」と思い同じ確率で何でも出す
- ブランド規範のないジェネレ → 統一感ゼロ
- 同じ入力で**毎回違う**結果 (ユーザーは「壊れた?」)
- 生成失敗時のフォールバック無し
- 計算量無制限で**初回描画 5 秒**
- 機械的すぎて**人間味ゼロ**

## チェックリスト

- [ ] ブランド規範に**乗った**生成か
- [ ] 同じ入力で**同じ結果**(seed 固定)か
- [ ] 失敗時の**フォールバック**があるか
- [ ] 生成時間が**許容範囲**か
- [ ] アクセシビリティ (alt テキスト等) が考慮されているか

## 関連

- [[Brand-Voice]]
- [[Design-Systems]]
- [[Color-Theory]]
- [[Iconography]]
- [[Creative-Coding-Canvas-WebGL]]
- [[Data-Visualization]]
- [[../30-Interface/AI-LLM-Interfaces]]
- [[../40-Bridge/Tool-Stacks-Recipes]]

## 深掘り

- *Generative Design* by Hartmut Bohnacker et al.
- *The Nature of Code* by Daniel Shiffman
- Tyler Hobbs, *The Aesthetics of Generative Art*
- Anders Hoff (inconvergent.net)
- Saskia Freeke (sasj.tumblr.com)
