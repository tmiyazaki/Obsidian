---
tags: [skill, bridge, knowledge, learning]
domain: cross-cutting
level: intermediate
---

# 知識マネジメント

## 一行で

> 個人の頭の中の知識を、「**チーム/組織で再利用可能な形**」に変換する設計。**自分の Obsidian Vault** はその一種。

## なぜ重要か

知識は**人と共に消える**:
- 退職で**業務知識**が失われる
- 新人の立ち上げに**毎回同じ説明**
- 「あの議論、結論は何だった?」が分からない
- 同じ調査が**3 部署で並行**

良い知識マネジメントは:
- **再現可能性**を上げる(誰がやっても同じ品質)
- **学習**を組織レベルに引き上げる
- **属人性**を下げる
- 個人の**思考の補助**になる

この Vault 自体が**知識マネジメントの実践例**。

## 知識の種類

### 1. 形式知 (Explicit)

文書化できる:
- マニュアル、コード、API 仕様
- 数値、ルール

### 2. 暗黙知 (Tacit)

言語化困難:
- 経験、直感、職人技
- 「**この匂い**」「この空気」

両者の変換 (SECI モデル, Nonaka):
- **Socialization**: 暗黙 → 暗黙(共体験)
- **Externalization**: 暗黙 → 形式(言語化)
- **Combination**: 形式 → 形式(再構成)
- **Internalization**: 形式 → 暗黙(実践)

「全部文書化」は不可能だが、「**重要な暗黙知を形式化**」できる仕組みが必要。

## 個人レベル: PKM (Personal Knowledge Management)

### Obsidian / Roam / Logseq

**双方向リンク**でノートをネットワーク化:
- 1 ノート = 1 概念
- リンクで**意味の関係**を表現
- グラフビューで全体俯瞰

### Zettelkasten (Niklas Luhmann)

カードに概念を書き、**互いに引用**:
- Permanent Note (恒久):整理された概念
- Fleeting Note: 一時的なメモ
- Literature Note: 引用元情報
- Index Note (MOC): 入口

→ この Vault の構造は Zettelkasten 風。

### Building a Second Brain (Tiago Forte)

**CODE** メソッド:
- **Capture** (収集)
- **Organize** (整理)
- **Distill** (蒸留)
- **Express** (表現)

「**いずれ使う**」を残し、「**今すぐ使う**」に蒸留する。

### PARA (Tiago Forte)

```
Projects   : 期限あるアクティブな目標
Areas      : 持続的に管理する領域
Resources  : 興味のあるトピック
Archive    : 完了・休眠
```

時間軸でフォルダを分ける。

## チーム/組織レベル

### Wiki / Notion / Confluence

```
Wiki ─ プロジェクト固有
   ├─ 仕様書
   ├─ Runbook (運用手順)
   ├─ オンボーディング
   └─ ADR (設計判断)
```

→ [[Documentation-as-Product]]

要点:
- **検索可能**性
- **権限管理**
- **バージョン履歴**
- **ステール検出**(古い文書のフラグ)

### Onboarding Doc

新メンバーが**初日に動かせる**ガイド。
- 環境構築
- 主要なリンク集
- 連絡先 (人と #チャネル)
- 用語集 → [[../GLOSSARY]]

3 ヶ月以内の新人に**改訂**してもらうと最新を保てる。

### Glossary (用語集)

→ [[Naming-as-Design]] / [[../GLOSSARY]]

業務用語・技術用語・略語を**一意に定義**。新人の最大の障害は「**この略語何**」。

### Decision Log / ADR

→ [[Documentation-as-Product]]

「なぜこの設計を選んだか」を残す。**後の議論の再発**を防ぐ。

### Runbook (運用手順)

「**X が起きたらどう対応**」:
- 障害復旧手順
- リリース手順
- ロールバック手順

オンコール担当が**知らなくても動ける**ように。

### Postmortem (振り返り)

事故・失敗の**ノンブレイム**な分析:
- タイムライン
- 影響範囲
- 根本原因
- アクションアイテム

→ [[../10-Coding/Observability]] / [[Critique-Culture]]

## 知識の形式

### コードの中

- 命名 → [[../10-Coding/Naming]]
- コメント (なぜ)
- 型 → [[../10-Coding/Type-Systems-and-DDD]]
- テスト = 仕様の例示

### コードの周辺

- README
- API ドキュメント (OpenAPI, GraphQL Schema)
- Storybook (コンポーネント)

### コードの外

- ADR
- Wiki
- Slack Pin / Threads (検索可能 if 使い方次第)
- 議事録

## 知識の鮮度

ドキュメントは**古びる**。設計の鍵:

### 1. Source of Truth を 1 つに

→ [[Documentation-as-Product]]

複数箇所に**同じ情報**を持たない。

### 2. 自動生成

人間が手で更新する量を減らす:
- TypeScript 型 → API ドキュメント
- DB スキーマ → ER 図
- テスト → 仕様

### 3. ステール検出

「**最終更新**: 2 年前」を表示。古い文書を一覧化。
「6 ヶ月触られていない文書を**確認**するキャンペーン」を四半期ごと。

### 4. リンク切れチェック

CI で死リンクを検出。

### 5. 「読まれない」を測る

検索クエリ・ページビューで**誰も読まない**文書を発見、再構成 or 削除。

## 知識の発見性

書かれていても**見つからない**なら無価値:

- **検索**を中心に → [[../30-Interface/Search-UX]]
- **タグ・カテゴリ**で多軸ナビ
- **MOC** (Map of Content) で入口
- **オンボーディング**から目的の文書へ最短経路
- 用語の**同義語**で検索ヒット

## ストーリーとしての知識

事実の羅列より**物語**が記憶に残る:
- 「**こういう問題があり、X を試したが失敗、Y で解決した**」
- 教訓を**ケーススタディ**で残す
- ポストモーテムを**物語形式**に

データシートより**ナラティブ**のほうが伝播する。

## 知識の階層とアクセシビリティ

```
1 行サマリ
   ↓ ドリルダウン
中粒度の説明
   ↓
詳細・実装・参考文献
```

各読者が**自分のレベル**で理解できる構造。

→ Diátaxis フレーム → [[Documentation-as-Product]]

## AI と知識マネジメント

LLM + RAG (Retrieval-Augmented Generation) で:
- 自社ドキュメントから**質問に答える**
- 関連文書を**自動推薦**
- 古い情報の**自動検出**

→ [[../30-Interface/AI-LLM-Interfaces]]

ただし:
- LLM は**幻覚**する (出典必須)
- 古い情報を**確信ありげに**返す
- ユーザーが**裏取り**できる UI を設計

## ナレッジサイロを打破

部署ごとに知識が**閉じる**問題:
- 営業の顧客フィードバック ↔ プロダクトチーム
- カスタマーサポートの**生の課題** ↔ デザイン
- インフラの**運用知見** ↔ 開発

施策:
- 横断 Slack チャネル
- 社内ニュースレター
- 横断レビュー会
- 「**外を見る**」(他社事例、業界研究)

## 学習の組織化

- 内部勉強会 (Brown Bag Lunch)
- 読書会 (技術書・デザイン書)
- 外部カンファレンス参加 + 持ち帰り共有
- 個人学習予算
- メンター制度

知識マネジメント = **学ぶ仕組み**そのもの。

## アンチパターン

- 「あれは Slack で言ったから OK」(検索性ゼロ)
- 1000 ページの Wiki で**誰も読まない**
- 唯一の専門家の頭の中にだけある
- ドキュメントが**1 年前のまま**
- 検索が機能せず**Slack で人に聞く**ほうが早い
- 用語集なし → 略語と造語が氾濫
- 失敗を**個人責任**にして再発を学べない

## チェックリスト

- [ ] **Source of Truth** が 1 つか
- [ ] 用語集 / Glossary があるか
- [ ] ADR / Decision Log で**なぜ**を残しているか
- [ ] **検索**で目的の文書が見つかるか
- [ ] 古い文書の**ステール検出**があるか
- [ ] 新人が**初日に動かせる**ガイドがあるか
- [ ] ポストモーテムが**Blameless** で運用されているか

## 関連

- [[Documentation-as-Product]]
- [[Naming-as-Design]]
- [[Critique-Culture]]
- [[Tech-Debt]]
- [[Discovery-and-Validation]]
- [[../10-Coding/Observability]]
- [[../30-Interface/Information-Architecture]]
- [[../30-Interface/Search-UX]]
- [[../30-Interface/AI-LLM-Interfaces]]
- [[../GLOSSARY]]

## 深掘り

- Niklas Luhmann, *Zettelkasten* (concepts)
- Tiago Forte, *Building a Second Brain*
- Sönke Ahrens, *How to Take Smart Notes*
- Nonaka & Takeuchi, *The Knowledge-Creating Company*
- David Allen, *Getting Things Done*
- Diátaxis: https://diataxis.fr/
