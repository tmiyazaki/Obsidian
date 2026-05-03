---
tags: [skill, interface, sensor, camera, haptics, expression]
domain: interface
level: intermediate
---

# センサー・カメラ・触覚

## 一行で

> モバイル端末は「**センサーの集合体**」。傾き・位置・カメラ・振動を UI に組み込むと、画面の枠を超えた体験が作れる。

## なぜ重要か

スマートフォンが持つセンサーは、PC では得られない**身体性**を提供します:
- カメラ → AR、QR、書類スキャン、視線
- ジャイロ → 傾けて操作、パララックス
- 加速度 → シェイク Undo、歩数計
- 振動 → 触覚フィードバック (Haptics)
- GPS → 位置連動
- 環境光 → 自動明度

これらを使うと、Web/アプリは**端末という物理デバイスの可能性**を引き出せます。

## モバイルセンサー

### Geolocation (位置情報)

```ts
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords.latitude, pos.coords.longitude),
  (err) => console.error(err),
  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);

// 連続監視
const watchId = navigator.geolocation.watchPosition(...);
navigator.geolocation.clearWatch(watchId);
```

用途: マップ、配送追跡、近くのお店、チェックイン。
許諾: 必須(プライバシー → [[../40-Bridge/Ethical-Design]])。
精度: GPS は屋外で 5m、屋内は 10-50m。

### DeviceOrientation (傾き)

```ts
window.addEventListener("deviceorientation", (e) => {
  // alpha: Z 軸回転 (0-360°)
  // beta:  X 軸回転 (-180-180°)
  // gamma: Y 軸回転 (-90-90°)
});
```

用途:
- 視差効果(端末傾けると背景が動く)
- ゲーム操作
- AR コンパス

iOS 13+ は**ユーザー許諾**が必要:

```ts
const perm = await DeviceOrientationEvent.requestPermission();
if (perm === "granted") { /* listen */ }
```

### DeviceMotion (加速度・回転速度)

```ts
window.addEventListener("devicemotion", (e) => {
  // e.acceleration (重力除く)
  // e.accelerationIncludingGravity
  // e.rotationRate
});
```

用途: 歩数計、シェイクジェスチャ、転倒検出。

### 環境光・近接

`AmbientLightSensor`, `ProximitySensor` API もあるが**ブラウザ対応は限定的**(主に PWA でラップ)。

### Battery Status

```ts
const battery = await navigator.getBattery();
console.log(battery.level, battery.charging);
```

低バッテリー時に**重い処理を抑制**する判断に。

### Network Information

```ts
const conn = navigator.connection;
console.log(conn.effectiveType); // "4g" / "3g" / "2g" / "slow-2g"
console.log(conn.saveData);      // データセーバー有効か
```

低速回線で**画像品質を落とす**判断に。

## カメラ

### MediaDevices.getUserMedia

```ts
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }, // "user" は前カメラ
  audio: false,
});
videoEl.srcObject = stream;
```

用途:
- ビデオ通話
- QR / バーコードスキャン
- 書類撮影 (OCR)
- 顔認識・AR フィルタ
- 機械学習(物体検出、姿勢推定)

### 写真撮影

```ts
// HTML 経由(最簡単)
<input type="file" accept="image/*" capture="environment" />

// JS で stream → canvas → Blob
canvas.getContext("2d").drawImage(video, 0, 0);
canvas.toBlob((blob) => uploadPhoto(blob));
```

### Image Capture API (拡張)

`ImageCapture` で**写真パラメタ**(露光、ISO)制御。対応ブラウザ限定。

### Barcode Detection API

```ts
const detector = new BarcodeDetector({ formats: ["qr_code", "ean_13"] });
const barcodes = await detector.detect(videoEl);
```

ネイティブで高速。一部ブラウザのみ。フォールバックに ZXing, jsQR。

### MediaPipe / TensorFlow.js

ブラウザで:
- 顔ランドマーク (Face Mesh)
- ハンドトラッキング
- ポーズ推定 (PoseNet)
- 物体検出 (COCO-SSD)

リアルタイムカメラ + ML で**ジェスチャ操作**や**鏡 UI** が可能。

## 触覚 (Haptics)

### Vibration API (基本)

```ts
navigator.vibrate(200);             // 200ms 振動
navigator.vibrate([100, 30, 100]);  // 振動・休止・振動
```

用途:
- 操作確証
- 通知
- ゲーム

注意:
- iOS Safari は**長らく未対応** (現在は限定的)
- Android は対応広い
- 過剰使用は**バッテリー消耗**と**煩わしさ**

### Haptic Feedback (ネイティブ)

iOS の `UIFeedbackGenerator` / Android の `VibrationEffect` は**よりリッチ**:
- 軽いタップ
- 中程度のインパクト
- 強い衝撃
- 成功・警告・エラーのパターン

ネイティブアプリで**ボタン押下のリアル感**を出すのに必須。Web ではまだ限定的。

### Game Controllers (Gamepad API)

```ts
window.addEventListener("gamepadconnected", (e) => {
  const gp = navigator.getGamepads()[e.gamepad.index];
  // gp.axes, gp.buttons, gp.vibrationActuator
});
```

ブラウザゲーム、VR コントローラ、リハビリ機器。

## マルチデバイス連携

### Web Share API

```ts
await navigator.share({
  title: "タイトル",
  text: "説明",
  url: window.location.href,
});
```

OS のシェアシートを呼び出す。アプリ的な「**シェア**」ボタンが Web で実現。

### Web Bluetooth / Web USB / Web Serial / Web HID

ブラウザから物理デバイスに接続:
- 体重計、心拍計、温度計
- 業務機器(レシートプリンタ、バーコード)
- カスタムキーボード

エンタープライズ・IoT 領域で強力。Chromium 系のみ対応。

```ts
const device = await navigator.bluetooth.requestDevice({
  filters: [{ services: ["heart_rate"] }]
});
```

### NFC

`Web NFC API` でタグ読み書き(Chromium Android のみ)。チケット、決済、製品認証。

## センサー組合せの体験例

### 1. 万歩計付き UI

加速度 → 歩数 → ヘルスデータ → 「目標まで N 歩」

### 2. 端末傾けるパララックス

`deviceorientation` で背景レイヤを**端末傾きに反応**させる。雑誌的な没入感。

### 3. 視覚障害向けナビ

GPS + コンパス + 触覚 → 「**右に振動 = 右折**」のフィードバック。

### 4. AR ショッピング

カメラ + 平面検出 → 家具を**部屋に置いて**確認。

### 5. シェイク Undo

シャカシャカで Undo。iOS の伝統。
ただし**意図しない発動**を防ぐ閾値 + 確認ダイアログ。

### 6. 低速回線で軽量モード

`connection.effectiveType === "slow-2g"` → 画像を**プレースホルダのみ**、動画停止。

## 許諾とプライバシー

→ [[../40-Bridge/Ethical-Design]] / [[../10-Coding/Security]]

センサーは**強力な個人情報**:
- カメラ → 顔・周囲環境
- 位置 → 行動履歴
- マイク → 会話
- 加速度 → 行動パターン

設計の鉄則:
- **必要最小限**の許諾
- **理由を説明**してから許諾要求
- **常時 vs 利用時のみ**を選択可能
- 取得データの**保存場所**と**期間**を明示
- いつでも**取り消せる**(設定 + 即時失効)

→ [[Settings-Preferences]]

## アクセシビリティ

→ [[Accessibility]]

- **触覚に頼らない**(振動が分からないユーザーがいる)
- **カメラ前提でない**代替フロー(QR の代わりに手入力)
- センサー前提のジェスチャに**ボタン代替**
- 「シェイクで Undo」より「Undo ボタン」が必要

## パフォーマンス・バッテリー

→ [[../40-Bridge/Sustainability]]

- センサーリスニングは**バッテリー食う** → 必要なときだけ start/stop
- カメラストリームは特に重い
- 振動も微量だが累積する

## アンチパターン

- 起動直後に**全許諾**(位置・カメラ・通知・連絡先)
- 許諾の**理由なし**でダイアログ
- 振動の連発で**煩わしい**
- 高精度位置を**バックグラウンドで常時**取得
- カメラ ON のまま**ライト点灯**忘れ
- センサー前提機能で**PC ユーザー脱落**

## チェックリスト

- [ ] 各センサーに**明確な利用目的**があるか
- [ ] 許諾を**価値提示後**に求めているか
- [ ] **いつでも取り消し**可能か
- [ ] センサー前提機能に**フォールバック**があるか
- [ ] バッテリー / プライバシーへの影響を**最小化**しているか
- [ ] 触覚が**主要情報源**になっていないか(代替あり)

## 関連

- [[Mobile-Patterns]]
- [[Microinteractions]]
- [[Permissions-UX]]
- [[Settings-Preferences]]
- [[AR-VR-Spatial]]
- [[Audio-Voice-UX]]
- [[../40-Bridge/Ethical-Design]]
- [[../10-Coding/Security]]

## 深掘り

- MDN Sensor APIs
- Apple HIG, *Haptics*
- Android Vibrator / VibrationEffect documentation
- Permissions API spec
- Project Florence (Microsoft) ─ センサー UX 研究
