---
tags: [skill, interface, ai, multimodal, realtime]
domain: interface
level: advanced
---

# リアルタイム・マルチモーダル AI

## 一行で

> 音声・映像・テキスト・画像を**同時に**入出力できる AI との**リアルタイム対話**。「打って待つ」から「**話す・見せる**」へ。

## なぜ重要か

2024-2025 で AI は「テキストを読む」段階を超え:
- **音声**で話す・聞く
- **カメラ**で見る
- **画面**を理解する
- それらを**同時並行**で

OpenAI Realtime API、Gemini Live、ElevenLabs Conversational AI、Apple Intelligence ── これらは UI の前提を変えます。「**人間と話すように**話す AI」が実用化レベルに。

## モダリティの組み合わせ

```
入力          出力
────          ────
テキスト       テキスト         ← 古典的チャット
音声          音声             ← Voice agent
テキスト+画像   テキスト+画像     ← Vision LLM
音声+映像     音声+映像         ← フル multimodal (Realtime)
```

**マルチモーダル** = 複数モダリティを**同時に**理解・生成。

## アーキテクチャの 2 系統

### Cascaded (連結式)

```
音声 → STT (Whisper) → LLM → TTS → 音声
```

長所: モジュール構成、デバッグ容易、各層の差し替え可能
短所: レイテンシが累積(各段で待つ)、ニュアンスが消える(感情・笑い)

### Native Multimodal (一体型)

```
音声 → 統合モデル (GPT-4o, Gemini Live, Realtime) → 音声
```

長所: 低レイテンシ、感情・トーン保持、自然な割り込み
短所: モデル固定、コスト高、ブラックボックス

2024 年以降は**Native** が急速に普及。

## レイテンシの壁

会話的な体感 = **300-500ms 以内**で応答開始。

```
人間の会話: 200ms 程度の沈黙が自然
500ms 以上 = "もしもし?" 感
1s 以上 = 通信障害?と疑う
```

設計目標:
- TTFT (Time To First Token / Phoneme) < 300ms
- 完了応答 < 1.5s

これを実現するには:
- **Native Multimodal**(層をまたがない)
- **エッジでの処理**
- **ストリーミング**(完了を待たず音声出力開始)

→ [[../10-Coding/Edge-and-Distributed]]

## 主要 API / SDK

### OpenAI Realtime API

WebSocket / WebRTC ベース。GPT-4o realtime model。

```ts
const ws = new WebSocket("wss://api.openai.com/v1/realtime");
ws.send(JSON.stringify({ type: "session.update", session: { ... } }));
ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: base64 }));
```

応答を**音声 chunk**でストリーミング受信。

### Anthropic / Google Gemini Live

各社の realtime インターフェース。

### ElevenLabs Conversational AI

TTS の品質が極めて高い。Voice Agent 構築。

### Vapi / Retell AI / Deepgram Voice Agent

電話統合・コールセンター系。

### Local: Whisper + Llama + Coqui-TTS

エッジ・オフライン対応。プライバシー重視。

## UI 設計の要点

### 1. 状態の可視化

```
[ 🎙 Listening...    ]   ← マイク ON
[ 🤔 Thinking...     ]   ← 処理中
[ 🗣 Speaking...     ]   ← 応答中
[ 🚫 Muted           ]
```

「**今 AI が何をしているか**」が瞬時に分かる。

### 2. 音声波形

入力中:
```
||||  ||||  ||  ||||  ||
```

出力中:
```
~~~  ~~~  ~~  ~~~~~  ~
```

「聞こえている」「話している」を**ビジュアル**化。

→ [[../20-Design/Creative-Coding-Canvas-WebGL]] (Canvas/WebGL で波形描画)

### 3. Barge-in (割り込み)

ユーザーが話し始めたら、AI は**即座に**話を止める:

```
AI: "Tokyo の天気は晴れで——"
User: "あ、京都の方を聞きたい"
AI: (即停止)
AI: "京都の天気は..."
```

人間の会話では当たり前だが、技術的には**精緻なターン管理**が要る。

OpenAI Realtime / Gemini Live は標準対応。

### 4. テキストのトランスクリプト

音声と並行して**文字でも表示**:
- ユーザー発話の認識結果
- AI 応答のテキスト
- 会話のスクロール

意義:
- 騒音環境で**読める**
- 後で振り返れる
- アクセシビリティ
- コピペ可能

```
You: 京都の天気を教えて
AI: 京都は晴れ、最高気温 25°C です。
```

### 5. 中断ボタン

```
[ ⏸ 一時停止 ]  [ ✕ 終了 ]
```

長い応答を止める手段。

### 6. 沈黙の処理

```
ユーザーが 3 秒沈黙 → AI が "何かお手伝いできますか?"
ユーザーが 30 秒沈黙 → セッション終了の確認
```

会話の**自然なテンポ**を維持。

## 視覚 (Vision) の組み込み

### スクリーン共有

```
[ 画面を共有 ]
```

ユーザーの画面を AI が見て助言:
- "このボタンをクリックしてください"
- "エラーは X 行目にあります"

ChatGPT Desktop, Cursor 等が採用。

### カメラ入力

```
[ カメラを使う ]
```

物理空間を見せながら質問:
- "この製品の使い方"
- "この料理のレシピ"
- "この間違いを直して"

Gemini Live のキラー機能。

### 画像アップロード

ファイルだけでなくドラッグ&ドロップ、ペースト:

```
[ 画像をペーストまたはドロップ ]
```

→ [[File-Management-UX]]

## アクセシビリティ

→ [[Accessibility]]

### 聴覚障害

- 字幕(リアルタイム転写)
- テキスト入力**だけ**でも操作可能
- 視覚的な状態フィードバック

### 視覚障害

- スクリーンリーダー連携(冗長にならないよう調整)
- キーボードのみで Push-to-Talk
- 音声出力の**速度・声質**を選べる

### 認知

- 速すぎる応答を**減速**するオプション
- 一時停止
- 過度な動きを抑える (`prefers-reduced-motion`)

## プライバシー

→ [[../40-Bridge/Privacy-by-Design]] / [[Audio-Voice-UX]]

音声・映像は**最も機密性の高い**データ:

- 録音/録画の**明示的同意**
- 「**今録音中**」の明確な視覚指標(マイクアイコン点灯)
- 周辺人物への配慮(他人の声が録音される)
- 学習に使うか **明示**
- ユーザーが**保存・削除**できる

iOS / Android のシステム指標(録音中の橙ドット等)を尊重。

## モバイル特有

→ [[Mobile-Patterns]]

- ヘッドホン推奨(スピーカーフィードバック防止)
- バックグラウンド継続(他アプリへ移っても)
- ロック中の継続
- バッテリー消費 (リアルタイム AI は重い)

## エッジケース

### ノイズ環境

- 背景音抑制 (Krisp, RNNoise)
- "聞き取れません" を明確に
- テキスト入力にフォールバック

### 多言語混在

「日本語と英語を混ぜて話す」シナリオに対応:
- 自動言語検出
- ユーザーが**主言語**を明示できる

### コスト爆発

リアルタイム AI は**通常の API より高い**(数 $ / 時)。
- 利用上限
- セッション時間制限
- 課金透明性

→ [[Pricing-Monetization-UX]]

## 計測

→ [[../10-Coding/Observability]] / [[../40-Bridge/AI-Evaluation-Safety]]

- TTFT (最初の応答音声まで)
- 平均レイテンシ
- 中断頻度 (ユーザー / AI)
- 認識精度
- 完了率(セッションが目的達成で終わったか)
- ユーザー満足度

## 倫理的な懸念

→ [[../40-Bridge/Ethical-Design]]

- **AI らしさの開示** (人間と勘違いさせない、EU AI Act 義務)
- 詐欺・なりすまし(ボイスクローンの濫用)
- 操作的な感情表現
- 子ども・高齢者への配慮
- 録音同意の地域差(米加は片側、EU は両側)

## ユースケース

- カスタマーサポート(AI がまず対応、エスカレーション)
- 学習(語学・スキル)
- アクセシビリティ補助(視覚障害者の世界記述)
- メディカル(医師の補助)
- 家事支援
- ナビ・運転中の操作

## アンチパターン

- 録音中の表示**なし**
- 割り込み**できない**(AI が話し続ける)
- 状態(Listen/Think/Speak)**不明**
- 字幕**なし**
- 子どもがアクセス可能な**音声操作だけ**
- AI と気付かせない設計
- コスト上限なし
- 学習に使うか不透明

## チェックリスト

- [ ] 録音中の**明確な視覚指標**があるか
- [ ] **割り込み (Barge-in)** が即座に効くか
- [ ] **状態**(Listen/Think/Speak)が見えるか
- [ ] **字幕 / 文字起こし**が並行表示されるか
- [ ] テキスト入力**だけ**でも完結するか
- [ ] AI による応答であることが**開示**されているか
- [ ] 録音データの保存・利用が**透明**か
- [ ] コスト上限・セッション制限があるか

## 関連

- [[AI-LLM-Interfaces]]
- [[Conversational-UI]]
- [[Agentic-AI-Patterns]]
- [[Audio-Voice-UX]]
- [[Sensor-Camera-Haptics]]
- [[Generative-Streaming-UI]]
- [[Mobile-Patterns]]
- [[Accessibility]]
- [[Pricing-Monetization-UX]]
- [[../10-Coding/Edge-and-Distributed]]
- [[../10-Coding/Observability]]
- [[../40-Bridge/Privacy-by-Design]]
- [[../40-Bridge/Ethical-Design]]
- [[../40-Bridge/AI-Evaluation-Safety]]

## 深掘り

- OpenAI Realtime API documentation
- Anthropic API (Claude with vision)
- Google Gemini Live documentation
- ElevenLabs Conversational AI
- Vapi / Retell / Deepgram Voice Agent
- *The Conversational AI Handbook* (industry resources)
