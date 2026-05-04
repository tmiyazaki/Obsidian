# Skills Vault — コーディング / デザイン / インターフェース設計

このリポジトリは、**コード**を書く力、**ビジュアルデザイン**を整える力、そして両者を結ぶ**インターフェース設計**の力を、相互参照可能な知識ネットワークとして整理した Obsidian Vault です。

各ノートは「単独で読めるサイズ」かつ「他ノートとリンクすることで深まる」よう設計しています。**入口**は目的によって複数あります。

## 🚪 入口の選択

| 状況 | おすすめ入口 |
|---|---|
| 全体像を把握したい | [[00-Index/MOC|MOC (全体地図)]] |
| 数値・閾値を即確認 | [[00-Index/Cheatsheet|チートシート]] |
| 何を選ぶか迷っている | [[00-Index/Decision-Frameworks|意思決定フレーム]] |
| 役割別に学びたい | [[00-Index/Learning-Paths|学習経路]] |
| 「X を作る」を実装 | [[00-Index/Recipes|レシピ集]] |
| パターン語彙の対応 | [[00-Index/Patterns-Catalog|パターン目録]] |
| 用語を確認 | [[GLOSSARY|用語集]] |
| 新規ノート作成 | [[Templates/Skill-Template]] |

## 📚 ドメイン構成

| ディレクトリ | 役割 | 入口 | ノート数 |
|---|---|---|---|
| `10-Coding/` | プログラミングの実装スキル | [[10-Coding/Coding-Index]] | 22 |
| `20-Design/` | ビジュアルデザインの言語と原理 | [[20-Design/Design-Index]] | 19 |
| `30-Interface/` | コードとデザインを統合する設計 | [[30-Interface/Interface-Index]] | 23 |
| `40-Bridge/` | 領域横断のテーマ | [[40-Bridge/Bridge-Index]] | 17 |
| `00-Index/` | 全体協調ツール | [[00-Index/MOC]] | 6 |
| `Templates/` | 新規ノート作成用 | [[Templates/Skill-Template]] | 1 |
| `GLOSSARY.md` | 約 100 用語のクロスリファレンス | [[GLOSSARY]] | 1 |

## 🎯 三層構造

各ドメインは**三層**で組織化されています。

```
┌──────────────────────────────────────┐
│  正確に作る (基礎・正しさ)           │  ← Clean Code, SOLID, A11y
├──────────────────────────────────────┤
│  運用する (本番・スケール)           │  ← Security, Observability, CI/CD
├──────────────────────────────────────┤
│  豊かに作る (表現・差別化)           │  ← Creative Coding, Storytelling
└──────────────────────────────────────┘
```

## 🔗 ノートの統一構造

各ノートは以下の枠組みで書かれています:

```
1. 一行で              ─ 何を解決するか
2. なぜ重要か          ─ 解こうとしている問題
3. 中核となる原理       ─ ノートの本体
4. 実践                ─ 具体例とコード
5. アンチパターン       ─ 反面教師
6. チェックリスト       ─ 自分のプロジェクトで使う
7. 関連                ─ 双方向リンク
8. 深掘り              ─ 参考文献
```

## 📜 書記ポリシー

- **単一責任**: 1 ノート 1 テーマ。長くなったら分割
- **双方向リンク**: 関連ノートには相互リンクを張る
- **実例ファースト**: 概念だけで終わらせず、必ず具体例または反例を入れる
- **更新可能**: 「正解」ではなく「現時点の理解」として書く
- **トレードオフを書く**: 「ベストプラクティス」より「**いつ使い、いつ使わない**」
- **横断テーマを意識**: 同じパターンが他領域にもないか問う

## 🧭 学習動線

詳細 → [[00-Index/Learning-Paths]]

```
新人エンジニア   → Coding 基礎 → Coding 構造 → Coding 運用
中級 FE/BE       → State/Concurrency → API/DB → Performance/Security
シニア           → Architecture → Edge → Migration → Discovery
デザイナー       → Visual → System → Tokens → 表現の幅
UX デザイナー    → UX 原則 → Research → IA → Forms → Onboarding
PM               → Discovery → Roadmapping → Critique → KM
AI 開発          → AI-LLM → Conversational → Privacy → Audio
```

## 🛠 使い方

1. [[00-Index/MOC|MOC]] を開いて全体像を把握
2. 興味ある領域のインデックスへ
3. 各ノートの末尾「関連」「深掘り」リンクを辿る
4. 学んだことは [[Templates/Skill-Template]] を複製してメモ化
5. 迷ったら [[00-Index/Decision-Frameworks]] へ
6. 作る時は [[00-Index/Recipes]] へ

## 📊 規模

```
85+ ノート / 約 22,000 行
4 ドメイン × 3 層 (基礎・運用・表現)
6 全体協調ツール (MOC + Cheatsheet + Decisions + Learning + Recipes + Patterns)
約 100 用語 (GLOSSARY)
```

## 🔄 進化

この Vault は固定された教科書ではなく**生きたネットワーク**です。実務での発見・矛盾・新概念は随時更新されます。テンプレートに従って**自分で書き足す**ことで個人的な Second Brain になります。

「**書かれたことが正しい**」ではなく「**今のところこう理解している**」 ── ノートはすべて暫定です。

---

*Last updated: ノート総数・行数は実際のファイル数で随時更新*
