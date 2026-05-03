---
tags: [skill, interface, drawing, gesture, expression]
domain: interface
level: advanced
---

# 描画と直接操作 (Drag / Pen / Canvas Editing)

## 一行で

> 「**触れて動かす**」UI ─ ドラッグ、リサイズ、描画、選択、整形。直接操作 (Direct Manipulation) は最も強い操作感を生む。

## なぜ重要か

ボタン操作は明示的だが、**距離がある**。直接操作は:
- 物体に**直接触れる**感覚
- フィードバックが**即時**
- 学習可能性が高い (見えるものに反応する)
- 表現の自由度が高い

Figma, Notion, Excalidraw, Photoshop ── プロフェッショナルツールは直接操作の塊。

## 直接操作の 4 原則 (Shneiderman)

1. **対象の連続表示**: 操作対象は**常に見える**
2. **物理的アクション**: マウス / 指で**直接動かせる**
3. **段階的可逆操作**: いつでも戻せる
4. **即時的可視フィードバック**: 操作の結果が**0.1 秒以内**に見える

これらが揃うと「**コンピュータと話している**」のではなく「**物を触っている**」感覚になる。

## 主要パターン

### 1. ドラッグ&ドロップ

**位置を変える**操作。Trello, Notion, ファイラ。

```ts
// HTML Drag and Drop API
el.draggable = true;
el.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", el.id);
});
target.addEventListener("dragover", (e) => e.preventDefault());
target.addEventListener("drop", (e) => {
  const id = e.dataTransfer.getData("text/plain");
  // 移動処理
});
```

ライブラリ:
- **dnd-kit** (React) - アクセシブル、モダン
- **react-beautiful-dnd** (古いが定番)
- **SortableJS** - 軽量、フレームワーク非依存
- **Framer Motion** - layout アニメと統合

### 2. リサイズハンドル

要素の境界に**つかみハンドル**:

```
┌──○──┐
│      │
○      ○
│      │
└──○──┘
```

考慮:
- ハンドルサイズは**最低 8px**(タッチで届く)
- 角はナナメ、辺は縦/横
- アスペクト比固定(Shift キー)
- スナップ(8px グリッド)
- 最小・最大サイズ

### 3. 自由描画 (Drawing)

```ts
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let last = { x: 0, y: 0 };

canvas.addEventListener("pointerdown", (e) => {
  drawing = true;
  last = { x: e.offsetX, y: e.offsetY };
});
canvas.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  last = { x: e.offsetX, y: e.offsetY };
});
canvas.addEventListener("pointerup", () => { drawing = false; });
```

`pointer` イベントは**マウス・タッチ・ペン統合**。

### 4. ペン圧筆 (Pressure)

Apple Pencil, Wacom, Surface Pen で**筆圧**取得:

```ts
canvas.addEventListener("pointermove", (e) => {
  const pressure = e.pressure; // 0-1
  ctx.lineWidth = pressure * 10;
});
```

押すほど太い線。**手書きの自然さ**が出る。

### 5. 選択 (Selection)

#### マーキー選択 (Marquee)

ドラッグで矩形を作り、内部の要素を選択。

#### 多選択 (Multi-Select)

Cmd/Ctrl + クリック で追加選択、Shift + クリック で範囲選択 (テキスト・リスト)。

#### 投げ縄選択 (Lasso)

自由形で囲んで選択。Photoshop, Procreate。

### 6. スワイプアクション

リスト項目を**横スワイプ**で操作:

```
┌─────────────────────┐
│  メール件名          │ ← →  [削除] [アーカイブ]
└─────────────────────┘
```

iOS のメール、Gmail で定番。スマホで親指の**自然な動き**に乗る。

### 7. ピンチズーム / 回転

タッチで 2 本指:

```ts
let initialDist = 0;
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    initialDist = distance(e.touches[0], e.touches[1]);
  }
});
canvas.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    const ratio = distance(e.touches[0], e.touches[1]) / initialDist;
    // ズーム適用
  }
});
```

写真、地図、ビューワで必須。

### 8. ノードベース UI

ボックスを線で繋ぐ: Figma の Auto Layout Inspector, n8n, Blender, ComfyUI。
- ノードを**ドラッグ配置**
- **ポート同士を線**で繋ぐ
- ループや矢印で**有向グラフ**

ライブラリ: `React Flow`, `Rete.js`, `LiteGraph.js`。

### 9. インライン編集

セル / ラベルをクリック → **その場で編集**:

```tsx
const [editing, setEditing] = useState(false);
return editing ? (
  <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={() => setEditing(false)}
    autoFocus
  />
) : (
  <span onClick={() => setEditing(true)}>{value}</span>
);
```

Spreadsheet, Notion 等で標準的。
→ [[Tables-Data-Grids]]

### 10. 並べ替え (Reorder)

ドラッグでリスト/グリッドの順序変更。
- アニメ付きスムース移動
- Undo 必須
- キーボード代替(↑↓キー)

## 物理感を出す

### 慣性

ドラッグを離した後も**慣性で動く**:

```ts
const velocity = (current - last) / dt;
// 離した後
const animate = () => {
  position += velocity;
  velocity *= 0.95; // 摩擦
  if (Math.abs(velocity) > 0.1) requestAnimationFrame(animate);
};
```

### スプリング

つかんだ要素が**バネで戻る**:

```ts
// Framer Motion
<motion.div drag dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} />
```

枠を超えるとゴム的に戻る、現代モバイル UI 標準。

### スナップ

特定の位置・角度に吸着:
- 8px グリッド
- 中央線
- 他要素の端
- 角度 (45°ごと)

Figma の整列ガイド ─ ドラッグ中に**他要素の端が光る**。

## 状態管理

→ [[../10-Coding/State-Management]]

直接操作の状態は複雑:
- 選択状態
- ドラッグ中の一時位置
- 履歴 (Undo/Redo)
- 元の位置 vs 現在位置

State Machine で表現するとバグが減る:

```
idle → mousedown → dragging → mouseup → idle
                      ↑
                   moving
```

## Undo / Redo

直接操作の必須機能:

```ts
class History<T> {
  private past: T[] = [];
  private present: T;
  private future: T[] = [];
  push(state: T) {
    this.past.push(this.present);
    this.present = state;
    this.future = [];
  }
  undo() { /* present → future, past[last] → present */ }
  redo() { /* present → past, future[0] → present */ }
}
```

Cmd+Z / Cmd+Shift+Z をグローバルバインド。

## 共同編集との統合

→ [[Real-time-Collaboration]]

直接操作 + 多人数 = **CRDT / OT** が必須。
- 自分のドラッグ中に**他人が同要素を動かす**
- 競合解消 (どちらが優先?)
- カーソル位置の共有

## アクセシビリティ

→ [[Accessibility]]

直接操作は**マウス / タッチ前提**になりやすい。**キーボード代替**が必須:

```
Tab で要素にフォーカス
Space でつかむ
矢印キーで移動
Enter で確定 / Esc でキャンセル
```

dnd-kit はキーボード操作を標準提供。

スクリーンリーダー向け:
- `aria-grabbed`, `aria-dropeffect` (deprecated だが概念は重要)
- `role="application"` 内で独自キー操作を実装
- 操作完了時に `aria-live` で通知

## モバイル特有

→ [[Mobile-Patterns]]

- タッチ vs スクロールの**区別**(長押しでドラッグモード等)
- スクロール領域内のドラッグは**スクロールと競合**
- 二本指ピンチを**ドラッグと混同**しない
- 親指範囲を考慮

## パフォーマンス

→ [[../10-Coding/Performance]]

- ドラッグ中は**60fps**を維持
- 大量要素は**ドラッグ対象のみレンダ**(他は省略)
- `transform` で動かす(レイアウト計算を避ける)
- 重い処理は**ドロップ後**に実行

## アンチパターン

- ドラッグでしか操作できない (キーボード代替なし)
- リサイズハンドルが**小さすぎてつかめない**
- スワイプアクションが**確認なしで削除**
- Undo なし
- 描画したものが**保存されない**(リロードで消える)
- スマホでスクロールと**ドラッグが競合**
- ペン入力で**筆圧無視**

## チェックリスト

- [ ] **キーボード代替**があるか
- [ ] **Undo / Redo** が実装されているか
- [ ] フィードバックが **100ms 以内** に返るか
- [ ] スナップ・ガイドで**精度**を出しているか
- [ ] スマホで**スクロールと競合**しないか
- [ ] アクセシビリティ (フォーカス・aria) を満たすか
- [ ] 60fps を維持できるか

## 関連

- [[Microinteractions]]
- [[Tables-Data-Grids]]
- [[Real-time-Collaboration]]
- [[Mobile-Patterns]]
- [[Accessibility]]
- [[../10-Coding/State-Management]]
- [[../20-Design/Creative-Coding-Canvas-WebGL]]
- [[../20-Design/Motion-System]]

## 深掘り

- Ben Shneiderman, *Direct Manipulation: A Step Beyond Programming Languages*
- *Designing Interfaces* by Jenifer Tidwell (Direct Manipulation chapter)
- Figma engineering blog (Multiplayer + Direct Manipulation)
- dnd-kit / Framer Motion / React Flow documentation
- Bret Victor, *Magic Ink* (直接操作の哲学)
