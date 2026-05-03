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

### 原則と理解

- [[UX-Principles|UX の基本原則]] — Norman・Nielsen 由来の指針
- [[Mental-Models|メンタルモデルと認知負荷]] — ユーザーの頭の中の地図 ✨
- [[Accessibility|アクセシビリティ]] — WCAG / ARIA / 実装の基本
- [[Information-Architecture|情報アーキテクチャ]] — 構造化と命名
- [[User-Research|ユーザーリサーチ]] — 仮説を検証する活動 ✨

### 振る舞い

- [[Interaction-Patterns|インタラクションパターン]] — 標準解の語彙
- [[Microinteractions|マイクロインタラクション]] — 小さな反応が体験を作る
- [[Forms-and-Input|フォームと入力]] — 最も触られる UI
- [[Loading-States|ローディング状態]] — 待ち時間も UI
- [[Onboarding-Empty-States|オンボーディングと空状態]] — 最初の 5 分で離脱が決まる
- [[Notifications|通知システム]] — ユーザーの注意を借りる借金 ✨
- [[Real-time-Collaboration|リアルタイム協働]] — 多人数同時編集の設計 ✨

### データと操作

- [[Tables-Data-Grids|テーブルとデータグリッド]] — 業務 SaaS の主役 ✨
- [[Search-UX|検索 UX]] — ナビが届かない場所への近道 ✨
- [[Dashboard-Design|ダッシュボード設計]] — 信号を集約して判断速度を最大化 ✨
- [[AI-LLM-Interfaces|AI / LLM インターフェース]] — 確率的エージェントを信頼可能に ✨

### 設定と権限

- [[Settings-Preferences|設定と環境設定]] — ユーザーが自分の体験を調整 ✨
- [[Permissions-UX|権限 UX]] — 誰が・何を・どの範囲でできるか ✨

### 環境と言葉

- [[Responsive-Design|レスポンシブデザイン]] — デバイスを超えて成り立つ設計
- [[Mobile-Patterns|モバイル固有パターン]] — 親指・OS 慣習・ジェスチャ
- [[UX-Writing|UX ライティング]] — UI に出る言葉の設計

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
- [[../GLOSSARY|用語集]]
- [[../10-Coding/Coding-Index]]
- [[../20-Design/Design-Index]]
- [[../40-Bridge/Component-Driven-Development]]
- [[../40-Bridge/Ethical-Design]]
