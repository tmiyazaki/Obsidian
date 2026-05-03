---
tags: [skill, design, creative-coding, expression]
domain: design
level: advanced
---

# クリエイティブコーディング (Canvas / WebGL / Three.js)

## 一行で

> DOM の枠を超えて「**ピクセル単位**」で描く能力を持つと、UI の表現の上限が変わる。Canvas / WebGL / Shader / 3D は**飾り**ではなく**新しい伝達手段**。

## なぜ重要か

DOM ベース UI には限界があります:
- レイアウトに沿った静的表現
- パーティクル・流体・物理は苦手
- 画像エフェクトはほぼ不可能
- 3D は限定的

クリエイティブコーディング技術を持つと:
- ヒーロー演出の**記憶残存**が桁違い
- データの**物理的・有機的**な可視化
- インタラクションが**触れる**感覚を持つ
- ブランドの**専有性**(他に無い体験)

## 4 つの表現レイヤ

```
┌──────────────────────┐
│  HTML / CSS          │ ← 90% の UI
├──────────────────────┤
│  SVG (vector)        │ ← アイコン・図表・限定的アニメ
├──────────────────────┤
│  Canvas 2D           │ ← 大量描画・パーティクル・自由形
├──────────────────────┤
│  WebGL / WebGPU      │ ← 3D・シェーダ・リアルタイム
└──────────────────────┘
```

下層ほど自由度が高く、コストとアクセシビリティ難度が上がる。**用途で使い分ける**のが肝。

## SVG — Vector の表現

### 強み

- 解像度に依存しない
- DOM 要素として CSS / JS で操作可能
- アクセシビリティ (`<title>`, `aria-label`)
- アニメーション (CSS, SMIL, JS)

### 主用途

- アイコン → [[Iconography]]
- 図表 → [[Data-Visualization]]
- ロゴ・イラスト
- 線描アニメ (`stroke-dasharray` で描き起こし)

### モーフィング

形 A → 形 B のスムーズ変形:
- Flubber, GSAP MorphSVG
- 「形が変わる」は**記憶に残る**演出

### Lottie

After Effects から書き出し可能な JSON ベクトルアニメ。
- ロゴアニメ、空状態のイラスト、成功演出
- 解像度自由、ファイル小、JS 制御可
- カスタマイズ性は静止画より高い

## Canvas 2D — Pixel の表現

### 強み

- **大量要素** (1 万パーティクル等)
- 自由形描画
- 画像合成・フィルタ
- ゲーム的 UI

### 弱み

- アクセシビリティ (DOM ではない、SR 不可) — 代替テキストや並行 DOM 必須
- イベント (要素クリック判定を自分で実装)
- 印刷・拡大時の劣化

### 主用途

- パーティクル背景
- ホワイトボード / 描画ツール
- リアルタイムチャート (大量データ)
- 画像エディタ
- 軽量ゲーム

### 高速化

- `requestAnimationFrame` で 60fps
- `OffscreenCanvas` + Worker で重い計算を分離
- 重ねる Canvas を分けて再描画範囲を最小化
- 不要なら `drawImage(cachedCanvas)` で再利用

## WebGL — GPU の力

### 強み

- ハードウェアアクセラレーション
- 3D / 大規模 2D
- カスタムシェーダ (GLSL) で**任意の見た目**

### 弱み

- 学習曲線急
- デバッグ困難
- バッテリー消費
- 同等の効果が CSS で出るなら CSS のほうが軽い

### 主ライブラリ

- **Three.js**: 最も広い採用。3D 全般
- **R3F (React Three Fiber)**: React で Three.js を宣言的に
- **drei**: R3F の便利ヘルパー集 (OrbitControls, Loader, etc.)
- **Babylon.js**: ゲーム志向、より高機能
- **PixiJS**: 2D 特化、超高速
- **OGL**: 軽量・低レベル
- **regl**: 関数型 WebGL

### Three.js の最小例

```ts
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.add(new THREE.DirectionalLight(0xffffff, 1));

function loop() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
```

### R3F (宣言的)

```tsx
<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight />
  <Box rotation={[a, b, 0]}>
    <meshStandardMaterial color="hotpink" />
  </Box>
  <OrbitControls />
</Canvas>
```

宣言的 React の世界に 3D が溶け込む。状態管理も React のまま。

## Shader (GLSL) — 任意の見た目

頂点シェーダ + フラグメントシェーダで**ピクセルごとの色**を計算。
`fragment.glsl`:

```glsl
precision mediump float;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 color = 0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0,2,4));
  gl_FragColor = vec4(color, 1.0);
}
```

UI への応用:
- グラデーションメッシュ (動く)
- ボロノイ・ノイズ模様
- 流体シミュレーション
- ホログラフィック効果
- インクの広がり

学習リソース:
- *The Book of Shaders* (https://thebookofshaders.com/)
- ShaderToy (https://www.shadertoy.com/)

## CSS でも結構できる

クリエイティブな表現がすべて WebGL を要するわけではない:

- `backdrop-filter` でグラスモーフィズム
- `mix-blend-mode` でレイヤ効果
- `clip-path` で形抜き
- CSS Animations + custom properties で連動
- `mask-image` でグラデーション透明度
- `conic-gradient` で円グラフ・グラデーション
- `filter: hue-rotate / blur / contrast` で写真効果

→ [[Material-Surfaces]]

「**まず CSS で試す**」が原則。SVG → Canvas → WebGL と階段を上がる。

## いつ使う / いつ使わない

### 使うべき

- ヒーロー / オンボーディング (記憶に残したい)
- ブランド表現の差別化
- 物理ベースのインタラクション (ドラッグ後の慣性、流体)
- 大量データ可視化 (10K 点超)
- 3D 製品プレビュー
- ゲーム要素

### 使うべきでない

- 単なる装飾
- 同じ効果が CSS で出る
- アクセシビリティ要件が高い
- パフォーマンスバジェットがタイト
- バッテリー敏感な利用文脈

## アクセシビリティ

→ [[../30-Interface/Accessibility]]

WebGL / Canvas は DOM ではないので**スクリーンリーダーに見えない**:
- 並行 DOM で**意味的な代替**を提供
- `aria-label` または `<canvas>` 内の HTML テキスト
- 装飾なら `aria-hidden="true"` + `tabindex="-1"`
- `prefers-reduced-motion` で**静止画フォールバック**

## パフォーマンス

→ [[../10-Coding/Performance]] / [[../40-Bridge/Sustainability]]

- `OffscreenCanvas` で Worker に逃がす
- `<canvas>` のサイズと CSS サイズを一致させる (DPR を考慮)
- 視野外で `requestAnimationFrame` を停止
- モバイルで品質を落とす (パーティクル数、解像度)
- 重い WebGL は**遅延読み込み**(可視化時にのみ起動)

## ハイブリッド戦略

DOM (UI) + Canvas/WebGL (背景・装飾) の重ね合わせ:

```
[ DOM ヘッダ・コンテンツ・フォーム ]    ← アクセシブル、操作可能
       ↑
[ Canvas/WebGL (z-index: -1)     ]    ← 演出のみ
```

「**意味は DOM、雰囲気は GL**」で両立する。

## アンチパターン

- 全画面が WebGL で**操作不能**
- 装飾アニメで**バッテリー枯渇**
- アクセシビリティ無視 (代替なし)
- `prefers-reduced-motion` を尊重しない
- 不必要な高ポリ 3D
- フォールバック画像なし (古い端末で真っ白)

## チェックリスト

- [ ] CSS で済むなら**CSS で済ませた**か
- [ ] **代替表現**があるか (SR / 静止画)
- [ ] `prefers-reduced-motion` を尊重しているか
- [ ] モバイル / 低スペックで**品質を落とせる**か
- [ ] 視野外で**描画を停止**しているか
- [ ] バンドルサイズ・初期描画への影響を測ったか

## 関連

- [[Visual-Hierarchy]]
- [[Motion-System]]
- [[Iconography]]
- [[Material-Surfaces]]
- [[Generative-Procedural]]
- [[../30-Interface/Motion-Storytelling]]
- [[../30-Interface/Drawing-Direct-Manipulation]]
- [[../40-Bridge/Tool-Stacks-Recipes]]
- [[../10-Coding/Performance]]

## 深掘り

- *The Nature of Code* by Daniel Shiffman
- *The Book of Shaders* by Patricio Gonzalez Vivo
- Three.js Journey by Bruno Simon
- Inigo Quilez (https://iquilezles.org/) ─ シェーダ巨匠
- Bruno Simon の "Folio" (R3F の規範例)
