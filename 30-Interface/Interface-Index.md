---
tags: [moc, interface]
domain: interface
---

# Interface Design — インデックス

インターフェース設計は「**人とシステムの接点**」の設計です。コードが**構造と挙動**を、デザインが**知覚**を扱うのに対し、インターフェース設計はその両者を**ふれられる体験**へと統合します。

## 三本柱

1. **理解可能性 (Understandability)** — ユーザーが今**どこで何ができるか**分かる
2. **操作可能性 (Operability)** — 意図した行動が**負担なく**届く
3. **回復可能性 (Recoverability)** — 間違えても**元に戻れる**、システムの状態が分かる

## ノート

### 原則

- [[UX-Principles|UX の基本原則]] — Norman・Nielsen 由来の指針
- [[Accessibility|アクセシビリティ]] — WCAG / ARIA / 実装の基本
- [[Information-Architecture|情報アーキテクチャ]] — 構造化と命名

### 振る舞い

- [[Interaction-Patterns|インタラクションパターン]] — 標準解の語彙
- [[Microinteractions|マイクロインタラクション]] — 小さな反応が体験を作る
- [[Forms-and-Input|フォームと入力]] — 最も触られる UI

### 環境適応

- [[Responsive-Design|レスポンシブデザイン]] — デバイスを超えて成り立つ設計
- [[Loading-States|ローディング状態]] — 待ち時間も UI

## 三領域の関係

```
        Interface Design
              │
   ┌──────────┴──────────┐
   ▼                     ▼
Coding が                Design が
「動く」を支える          「見える」を支える
```

インターフェース設計は両者を**結合する制約**です。コードは「動けばよい」、デザインは「美しければよい」では UI は完成しません。**操作の意味**と**応答の即時性**と**状態の透明性**を統合する役割。

## 関連

- [[../00-Index/MOC|MOC]]
- [[../10-Coding/Coding-Index]]
- [[../20-Design/Design-Index]]
- [[../40-Bridge/Component-Driven-Development]]
