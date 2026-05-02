---
tags: [skill, interface, mobile]
domain: interface
level: intermediate
---

# モバイル固有パターン

## 一行で

> モバイルは「**画面が小さい Web**」ではない。**身体性・状況・プラットフォーム慣習**が支配する別の文脈。

## なぜ重要か

モバイル特有の制約と機会:
- **片手・親指操作**
- **動きながら・短時間**で使われる
- **通知・割り込み**で頻繁に中断
- **OS の慣習** (iOS/Android で異なる)
- **接続不安定** (地下鉄・郊外)
- **バッテリー有限**

これらを無視すると、デスクトップのミニチュアになり、スマホ本来の強みを失う。

## 親指の届く範囲 (Thumb Zone)

スマホを片手で持ったとき、親指の届きやすさには**地形**がある:

```
┌───────────┐
│  Hard     │  ← 上端、特に逆コーナー
│           │
│  OK       │
│           │
│  Easy     │  ← 下端の中央
└───────────┘
```

帰結:
- **主要 CTA は下に** (ボトム配置)
- 上のナビは**確認用**に留め、操作は下に集める
- iOS のタブバー、Android のボトムナビは画面下にある

## OS 慣習の違い

| | iOS | Android |
|---|---|---|
| ナビゲーション | タブバー (下), 戻るは左上 | ボトムナビ, システム戻るボタン |
| 設定アイコン | 歯車 | ハンバーガー or 三点 |
| 共有 | ↑ アイコン | ⋮ や Share シート |
| アクションシート | スライド上方向 | ボトムシート |
| 区切り線 | 細いグレー | より目立つ Material 風 |
| タイポグラフィ | SF | Roboto |

ネイティブアプリは**プラットフォーム慣習に従う**のが基本。Web は両方の利用者が来るため**中庸**を狙う。

## ジェスチャ

### 標準ジェスチャ (覚えるべき)

- **タップ**: 主要操作
- **ロングプレス**: 二次メニュー、コンテキスト
- **ダブルタップ**: ズーム or いいね (Instagram 等)
- **スワイプ**: ナビ間移動、リスト項目操作
- **ピンチ**: ズーム
- **エッジスワイプ**: 戻る (iOS), ナビ展開

### ジェスチャ設計の原則

1. **発見可能性**: ジェスチャだけのアクションは**見えない**。代替の見える操作も提供
2. **学習可能性**: 初出時にヒント (上方向矢印アニメ等)
3. **取り消し可能性**: スワイプ削除に Undo
4. **誤操作対策**: 端のスワイプは**確認**または**長めの距離**

## タップ領域

- **最小 44×44 pt (iOS)** / **48×48 dp (Android)**
- 視覚サイズ ≠ タップ領域 (パディングで広げる)
- 隣接ボタンは **8〜12px** 以上離す

```css
.icon-button {
  width: 24px; height: 24px;          /* アイコンの見た目 */
  padding: 12px;                       /* タップ領域は 48px */
  display: inline-flex;
  align-items: center; justify-content: center;
}
```

## キーボードと入力

### 適切な input type / inputmode

```html
<input type="email"    inputmode="email" />
<input type="tel"      inputmode="tel" />
<input type="number"   inputmode="numeric" />
<input                 inputmode="decimal" />     <!-- 小数 -->
<input                 inputmode="search" enterkeyhint="search" />
```

`enterkeyhint`: Enter キーの**ラベル**を変える (`go`, `done`, `next`, `search`)。

### キーボードに被らない

入力欄が**キーボードに隠れる**のはモバイル UX の典型問題:

```css
.field { scroll-margin-bottom: 100px; }
```

または `visualViewport` API で監視。

### 自動入力

→ [[Forms-and-Input]]

`autocomplete="..."` を必ず付ける。パスワードマネージャと OS の自動入力に乗れる。

## ステータスバーとセーフエリア

ノッチ・ホームインジケータ・ダイナミックアイランド ── 全画面 UI は**画面端ぎりぎり**にコンテンツを置けない。

```css
.app {
  padding-top:    env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left:   env(safe-area-inset-left);
  padding-right:  env(safe-area-inset-right);
}
```

## ビューポート単位の罠

モバイル Safari の URL バーが伸縮するため、`100vh` は**スクロール時に変わる**。

```css
.full-screen {
  height: 100vh;  /* ❌ ジャンプする */
  height: 100dvh; /* ✅ Dynamic Viewport */
}
```

`100svh` (small) / `100lvh` (large) / `100dvh` (dynamic) を使い分ける。

## ナビゲーションパターン

### ボトムナビ

3〜5 項目。**主要セクション**のみ。設定は中に隠す。

### タブバー

横並びの並列コンテンツ。スワイプで切替できると親指楽。

### ハンバーガー

実は**最弱**。隠すと使われない。
- 5 項目以上の主要ナビはハンバーガー化、それ以下はボトムナビへ
- 隠すなら**主要 CTA は別途見える形**で残す

### ボトムシート

下から滑り上がるパネル。モーダルとサイドバーの中間。
- 全画面化できる (拡大ジェスチャ)
- スクロールしながら操作可能
- iOS の純正シート (UISheetPresentationController) が標準

### モーダル vs プッシュ

- **プッシュ**: 同じフロー内、戻れる (iOS の Navigation)
- **モーダル**: 一時的な作業、閉じる (Cancel/Done)

階層関係を**画面遷移の種類で**示す。混同するとユーザーが現在地を見失う。

## オフライン対応

- **読み込んだデータをキャッシュ** (画像、テキスト)
- **書き込みをキューイング** (オンライン復活時送信)
- **オンライン状態の可視化** (ステータスバー)
- 失敗操作の Optimistic UI + 後送

PWA Service Worker, Background Sync API。

## パフォーマンスとバッテリー

- 画像は**サブセット解像度** (2x/3x) を提供 (`srcset`)
- アニメは GPU 加速プロパティのみ (`transform`, `opacity`)
- 動画自動再生は**バッテリー悪**、ユーザー操作で開始
- バックグラウンド更新を最小化

→ [[../40-Bridge/Performance-as-UX]]

## アクセシビリティ

→ [[Accessibility]]

モバイル特有:
- **VoiceOver / TalkBack**: スワイプで読み上げ進む
- **Dynamic Type / フォントサイズ拡大**: ユーザー設定に追従
- **片手モード**: iOS リーチャビリティ、Android One-handed mode に配慮
- **Switch Control**: 物理スイッチでの操作を想定 (フォーカス順序が大事)

## アンチパターン

- ホバー前提の UI (タップでは起きない)
- 画面端ぎりぎりに重要要素 (誤操作 / セーフエリア無視)
- 大きすぎる画像で**通信量・バッテリー**消費
- 横スクロール
- 全画面ポップアップを起動直後 (許諾連発)
- ハンバーガーに**主要機能を全部**隠す
- スプラッシュ長すぎ (1s 以内)

## チェックリスト

- [ ] 主要 CTA が**親指の届く範囲**にあるか
- [ ] タップ領域が **44pt 以上**か
- [ ] OS 慣習に**従っている**か (戻るボタン、共有等)
- [ ] セーフエリアに対応しているか
- [ ] `100dvh` でビューポート変動に追従するか
- [ ] 入力欄に**適切な keyboard / autocomplete** か
- [ ] オフライン状態で**致命的に壊れない**か

## 関連

- [[Responsive-Design]]
- [[Interaction-Patterns]]
- [[Forms-and-Input]]
- [[Accessibility]]
- [[Microinteractions]]
- [[../40-Bridge/Performance-as-UX]]

## 深掘り

- Apple Human Interface Guidelines (HIG)
- Material Design (Android)
- Luke Wroblewski, *Mobile First*
- Steven Hoober, *Designing Mobile Interfaces*
