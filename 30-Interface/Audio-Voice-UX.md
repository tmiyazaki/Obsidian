---
tags: [skill, interface, audio, voice, expression]
domain: interface
level: intermediate
---

# 音声・サウンド UX

## 一行で

> 視覚に偏った UI に「**耳の次元**」を加えると、状態・感情・操作確証が**新しいチャンネル**で運ばれる。

## なぜ重要か

聴覚は視覚と並行して動作し、**画面を見ていなくても**情報を運べます:
- 通知・新着の**気づき**
- 操作の**確証**(送信音、エラー音)
- ブランドの**音による署名** (Sonic Branding)
- アクセシビリティ(視覚障害ユーザー)
- 音声入力・対話 (LLM 時代に重要性増)

ただし**音は迷惑にもなる**。慎重な設計が必須。

## 4 つのカテゴリ

### 1. UI 効果音 (UI Sound)

操作のフィードバック:
- メッセージ送信 (Slack の "knock-knock")
- エラー (短い低音)
- 成功 (上昇音)
- 通知 (短いベル)

**100ms 以内**の短さ、控えめな音量。

### 2. 通知音

→ [[Notifications]]

メッセージ・アラート。OS と統合(プッシュ通知音)。

### 3. メディア (Music / Audio Content)

ポッドキャスト、音楽、動画の音声。プロダクトが音響メディアを扱う場合。

### 4. ボイス入出力

- 音声入力 (Speech-to-Text)
- 読み上げ (Text-to-Speech)
- ボイスエージェント

## Sonic Branding

ブランドが**音で記憶される**:

- Netflix の "Tu-dum"
- Intel の 5 音
- Apple Mac の起動音

要素:
- **3〜5 秒**の短さ
- 識別可能なメロディ
- ロゴと連動するタイミング
- 音色がブランド人格と一致

**全コンタクトポイント**(アプリ起動、TV CM、店頭)で同じ音を使うと記憶される。

→ [[../20-Design/Brand-Voice]]

## Web Audio API

ブラウザでの音声処理:

```ts
const ctx = new AudioContext();
const oscillator = ctx.createOscillator();
const gain = ctx.createGain();

oscillator.frequency.value = 440;
gain.gain.value = 0.1;

oscillator.connect(gain).connect(ctx.destination);
oscillator.start();
setTimeout(() => oscillator.stop(), 200);
```

主要機能:
- オシレータ(音生成)
- AudioBufferSourceNode(音声ファイル再生)
- BiquadFilterNode(イコライザ)
- AnalyserNode(波形・周波数分析)
- ConvolverNode(リバーブ)
- PannerNode(空間音響)

### 主要ライブラリ

- **Tone.js**: シンセサイザ・音楽
- **Howler.js**: 音声ファイル再生
- **WaveSurfer.js**: 波形表示・編集
- **Pizzicato.js**: シンプルな効果音

## 効果音の設計指針

### 1. 役割が明確

各音 = 1 つの意味:
- 同じ音を**複数の意味**に使わない
- 似た音を**並べない**(混乱)

### 2. 短く・控えめ

- 100〜300ms
- 音量 -20dB 以下(他音と被ってもうるさくない)
- 高すぎる音は耳障り、低すぎる音は気付かれない

### 3. ブランド音色

- ストリングスが優しい / シンセが現代的 / オルガンが温かい
- ピッチの方向(上昇 = 成功 / 下降 = 終了・エラー)

### 4. ハーモニー

複数の効果音は**同じ音階**で揃える:
- A メジャー基調 → 全効果音もそのスケール

ばらばらだと「**安っぽさ**」が出る。

### 5. ON / OFF / 音量制御

- 設定で**ミュート**できる
- システム音量と別軸の**アプリ内音量**
- 個別の通知音オン/オフ

→ [[Settings-Preferences]]

## 音声の文脈感度

### サイレント窓

→ [[Notifications]]

深夜・会議中・「集中モード」では音を**自動抑制**。

### 場所と状況

- 公共の場 → 音は**避ける**(振動代替)
- ヘッドホン検出 → 音 OK
- 会議モード → 通知音オフ

## ボイス入力

### Speech Recognition API

```ts
const recog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recog.lang = "ja-JP";
recog.continuous = true;
recog.interimResults = true;

recog.onresult = (e) => {
  const text = e.results[e.results.length - 1][0].transcript;
  setText(text);
};
recog.start();
```

注意:
- ブラウザ依存(主要ブラウザは対応)
- 精度は**回線・周囲音**に依存
- Whisper API (OpenAI) や Vosk のほうが**精度高い**(処理は重い)

### 音声入力 UX

- マイクアイコンの状態(待機 / 録音中 / 処理中)
- リアルタイム書き起こし表示
- 一時停止可能
- 信頼度の低い箇所は**ハイライト**(編集を促す)
- 入力後の**編集**を簡単に

## Text-to-Speech (読み上げ)

### Web Speech API

```ts
const utter = new SpeechSynthesisUtterance("こんにちは");
utter.lang = "ja-JP";
utter.rate = 1.0;
utter.pitch = 1.0;
speechSynthesis.speak(utter);
```

- 無料、ブラウザ標準
- 音質は OS 依存
- 高品質には ElevenLabs, Azure TTS, Google Cloud TTS

### 用途

- アクセシビリティ(視覚障害)
- 運転中・料理中の読み上げ
- ポッドキャスト自動生成
- 学習補助

## 音声エージェント (LLM 時代)

→ [[AI-LLM-Interfaces]]

```
ユーザー音声 → STT → LLM 処理 → TTS → 音声応答
```

設計の要点:
- **応答時間**(全フロー 1〜2 秒以内が会話的)
- **Barge-in**(ユーザーが割り込めること)
- **沈黙の扱い**(完了か、まだ聞いている)
- **テキスト併記**(後で振り返り可能)
- **誤認識訂正**

OpenAI の Realtime API、ElevenLabs Conversational AI 等がフル統合を提供。

## 音波の可視化

入力中に**波形・周波数**を表示すると「聞こえている」感覚を与える:

```ts
const analyser = ctx.createAnalyser();
source.connect(analyser);

const data = new Uint8Array(analyser.frequencyBinCount);
function draw() {
  analyser.getByteFrequencyData(data);
  // canvas に描画
  requestAnimationFrame(draw);
}
draw();
```

→ [[../20-Design/Creative-Coding-Canvas-WebGL]]

## 空間音響 (3D Audio)

Web Audio の `PannerNode` で**音を空間に配置**:
- 通話アプリで**話者の位置**(左右)
- VR / AR(音源の方向感)
- ゲーム

→ [[AR-VR-Spatial]]

## アクセシビリティ

→ [[Accessibility]]

- **視覚障害ユーザー**:
  - 重要情報を**音だけに頼らない**(視覚 + 音)
  - 読み上げと干渉しない
- **聴覚障害ユーザー**:
  - 音の代替(視覚通知、振動)
  - 字幕・トランスクリプト必須
- **音響過敏**:
  - すべて**ミュート可能**
  - 音量を**段階的に**調節可能

`prefers-reduced-motion` の音版はないが、**ユーザー設定で完全 OFF**を必ず提供。

## モバイル

→ [[Mobile-Patterns]]

- 振動 (Vibration API) と組み合わせ
- 着信音と被らないように
- iOS の**サイレントモード**を尊重(Web Audio はミュートされる)
- バックグラウンド再生(Media Session API)

## アンチパターン

- すべての操作に音(疲れる)
- 起動時に**爆音**
- ミュート設定が見つからない
- 音だけで通知し**画面で気付けない**
- 全部同じ音色
- ボイス入力でフィードバックなし(録音中?)
- 自動再生で電車内のスマホから音漏れ

## チェックリスト

- [ ] 各音に**明確な役割**があるか
- [ ] **ミュート / 音量調整**が容易か
- [ ] 音だけに依存せず**視覚と並行**しているか
- [ ] サイレント時間 / モードを尊重するか
- [ ] アクセシビリティ(字幕・代替表現)を提供するか
- [ ] ボイス入力に**視覚フィードバック**があるか

## 関連

- [[Notifications]]
- [[Microinteractions]]
- [[AI-LLM-Interfaces]]
- [[AR-VR-Spatial]]
- [[Sensor-Camera-Haptics]]
- [[Accessibility]]
- [[../20-Design/Brand-Voice]]
- [[../20-Design/Motion-System]]

## 深掘り

- *Designing with Sound* by Amber Case & Aaron Day
- Sonic Branding ─ Audi, BMW のブランド音研究
- Tone.js / Howler.js documentation
- Web Audio API spec
