---
tags: [skill, interface, ar, vr, spatial, expression]
domain: interface
level: advanced
---

# AR / VR / 空間 UI (Spatial Computing)

## 一行で

> 画面の枠を超え「**空間そのもの**」を UI のキャンバスにする。Z 軸・物理性・身体性が**新しい表現と操作**を可能にする。

## なぜ重要か

Apple Vision Pro / Meta Quest / WebXR ── 空間 UI が一般化しつつあります。空間設計は:
- **製品の試着・配置プレビュー**(EC、家具、ファッション)
- 教育・トレーニング(医療、製造、安全)
- データ可視化(3D 散布、分子構造)
- 没入型エンタテインメント
- 遠隔協働(同じ仮想空間でレビュー)

平面 UI の慣習は通用しない**新しい設計領域**。

## 用語整理

```
AR (Augmented Reality)     現実 + デジタル重ね
VR (Virtual Reality)       完全仮想空間
MR (Mixed Reality)         現実と仮想が相互作用
XR (Extended Reality)      総称 (AR/VR/MR)
Spatial Computing          空間を入力・出力にする計算
```

Apple Vision Pro は visionOS で「空間コンピューティング」と呼ぶ ─ AR/VR の境界を曖昧化。

## 空間 UI の独自原則

### 1. 距離が階層を決める

平面 UI では大きさ・色で階層を作るが、空間では**Z 軸の距離**:
- 主要要素は**手の届く距離**(1m)
- 補助情報は**周辺視野**(2m)
- 環境演出は**背景**(>5m)

### 2. ロックの種類

UI が**何にロック**されるか:
- **World-locked**: 空間に固定(壁の絵)
- **Body-locked**: 体に追従(常に左肩の通知)
- **Head-locked**: 視点に追従(HUD 警告)
- **Object-locked**: 物にラベル

意味に応じて選ぶ。Head-lock の濫用は**酔いを誘う**。

### 3. 視野角 (FoV)

人間の中心視野は約 60°、周辺視野は約 200°。重要要素は**中心**に置き、周辺は**気づき**だけ。

### 4. 物理メタファ

仮想物体に**重力・慣性・衝突**を与えると直感的:
- カードを掴んで投げる
- パネルを引き寄せる
- 物が**机に置ける**

ただし**現実より少し誇張**したほうが操作感が良い(完全現実は遅い)。

### 5. 安全領域 (Safety Zone)

Quest 等では物理空間の**境界線**(Guardian)を表示。設計でも「**ここから先に手は要らない**」設計を。

## 入力モード

### Hand Tracking

カメラで手を検出。
- ピンチ(つまむ = 選択)
- グラブ(掴む = 移動)
- ポイント(指す = ホバー)
- スワイプ

ボタンは**触れる距離**に。「3D ボタン」は押し込み感があると良い(深さ 1-2cm)。

### Gaze (視線追跡)

Apple Vision Pro の主要入力:
- 見るだけで**ハイライト**
- ピンチで確定
- 手を動かす必要が少ない

設計の要点:
- ターゲットは**十分大きい**(視線は不安定)
- ハイライトが**即座**(視線追従)
- 誤発火を防ぐ(ピンチで確定)

### Voice

「~を表示して」「これを~に動かして」── 手が塞がる場面で。
→ [[Audio-Voice-UX]]

### Controllers

Quest のハンドコントローラ。物理ボタン + 6DoF。

### スマホ AR

ARKit (iOS) / ARCore (Android) で平面検出 + 物体配置。

## デザインパターン

### ウィンドウ

平面のアプリを**空間に浮かべる**(visionOS)。複数同時に開ける、サイズ変更可。
従来の 2D アプリは**ほぼそのまま**で動く。

### Tabletop (テーブル上)

水平面を検出して、**テーブルの上に展開**(ボードゲーム、3D マップ)。

### Wall (壁面)

垂直面を検出して、**ポスター・絵・テレビ**を貼る。

### Around You (環視)

360° 周囲に情報を配置。**振り向いて見つける**。

### Immersive (没入)

完全仮想空間。ナビゲーション・ワープが必要。

## WebXR (Web で AR/VR)

WebXR Device API で**ブラウザから VR/AR**:

```ts
const session = await navigator.xr.requestSession("immersive-vr", {
  requiredFeatures: ["local-floor"]
});
const refSpace = await session.requestReferenceSpace("local-floor");

session.requestAnimationFrame(function loop(time, frame) {
  const pose = frame.getViewerPose(refSpace);
  // 描画
  session.requestAnimationFrame(loop);
});
```

実装ライブラリ:
- **Three.js + WebXR**: 標準
- **A-Frame**: HTML 風タグで宣言的
- **PlayCanvas**: ゲーム志向
- **Babylon.js**: 多機能
- **Model Viewer** (Google): `<model-viewer>` タグで AR 表示

→ [[../20-Design/Creative-Coding-Canvas-WebGL]]

## 3D アセットの最適化

- **glTF / GLB**: Web 標準の 3D フォーマット
- **Draco** で圧縮
- **KTX2** テクスチャ(GPU 直読)
- ポリゴン数を**LOD**(距離で簡略化)
- **2K ↓ 1K テクスチャ**(モバイル)

ブラウザで重い 3D は**ロード遅延 + バッテリー枯渇**。最適化必須。

## アクセシビリティ

→ [[Accessibility]]

空間 UI 特有の課題:
- **車椅子ユーザー**: 立ち姿勢前提を避ける
- **低身長 / 高身長**: 主要 UI を**ユーザー身長に追従**
- **片手・両手**: 両手必須機能を作らない
- **視覚障害**: 音声ガイダンス・触覚代替
- **モーション酔い**: 急加速・急回転を避ける、テレポート移動

WCAG の空間版仕様 ("XR Accessibility User Requirements") が W3C で策定中。

## モーション酔い対策

VR 酔いは深刻な離脱原因:
- フレームレート **90fps 以上**を維持
- カメラの**急回転を避ける**(ユーザーの頭の動きに従う)
- 移動は**テレポート**または**スムーズ移動**(ユーザー選択可)
- 周辺視野を**減光**(Comfort Mode)
- 「**Comfort Settings**」で個別調整可能に

## パフォーマンス

→ [[../10-Coding/Performance]] / [[../40-Bridge/Sustainability]]

- 90fps × 両眼 = 180fps 相当の描画
- ポリゴン・テクスチャ・シェーダの軽量化
- 視野外を**カリング**
- バッテリー消費が大きい(VR HMD で 1-2 時間)

## ブラウザ AR vs ネイティブ

| | Web AR | ネイティブ AR |
|---|---|---|
| 配信 | URL 1 つ | アプリ DL 必要 |
| 性能 | 中 | 高 |
| 機能 | 限定 (WebXR/Quick Look) | フル |
| プラットフォーム | iOS/Android 両対応 | OS 別開発 |

軽量・即体験は Web AR、本格は Native。**EC・展示は Web AR が増加中**。

## 倫理と安全

→ [[../40-Bridge/Ethical-Design]]

- **プライバシー**: カメラで周囲を撮影 → 第三者の同意
- **物理事故**: VR 中の壁衝突防止
- **依存・長時間使用**: 休憩リマインダ
- **データ収集**: 視線・身体データは超個人情報

## ユースケース

### EC

- 家具プレビュー(IKEA Place)
- 服の試着
- 化粧品試用

### 教育・訓練

- 解剖学(臓器を解剖)
- 機械整備の手順
- 高所・危険作業の予行

### 設計レビュー

- 建築 BIM の空間レビュー
- プロダクトデザインの実寸確認
- 共同レビュー(複数人で同じ空間)

### エンタメ・SNS

- 仮想イベント
- ライブ配信(VRChat 等)
- 空間アバター

## アンチパターン

- 平面 UI を**そのまま空間に貼る**(空間の利点を活かさず)
- 全画面に情報配置 → **酔いと混乱**
- ゲイズ前提でターゲット**小さすぎ**
- 急カメラで**酔い**
- 周囲を撮影し**第三者プライバシー無視**
- 90fps を切る → 酔い直結
- アクセシビリティを**完全無視**(立ち姿勢前提)

## チェックリスト

- [ ] 空間ロックの種類が**意味に対応**しているか
- [ ] ターゲットが**十分大きい**(視線・手の精度)
- [ ] フレームレート 90fps を**維持**できるか
- [ ] 移動方式 (テレポート / スムーズ) が**選べる**か
- [ ] アクセシビリティ(着座・身長・視聴覚)を考慮したか
- [ ] 軽量化 (LOD, Draco, KTX2) しているか
- [ ] プライバシー(カメラ撮影)を尊重しているか

## 関連

- [[../20-Design/Creative-Coding-Canvas-WebGL]]
- [[Mobile-Patterns]]
- [[Audio-Voice-UX]]
- [[Sensor-Camera-Haptics]]
- [[Motion-Storytelling]]
- [[Accessibility]]
- [[../40-Bridge/Ethical-Design]]
- [[../10-Coding/Performance]]

## 深掘り

- Apple, *Designing for visionOS* (Human Interface Guidelines)
- Mike Alger, *VR Interface Design Manifesto*
- Google, *AR Design Guidelines*
- Microsoft, *Mixed Reality Design*
- Three.js + WebXR documentation
- Bruno Simon の R3F 作例
