---
tags: [skill, coding, workflow]
domain: coding
level: intermediate
---

# バージョン管理 (Git)

## 一行で

> Git は「**履歴という名の設計判断ログ**」。コミットは未来の読者への手紙。

## なぜ重要か

履歴は「過去にどう動いたか」だけでなく、**なぜそう変えたか**を保存します。良い履歴は将来のデバッグ・契約継承・障害解析を支えます。逆に「fix」「update」「wip」だらけの履歴は知識の墓場です。

## コミットの粒度と単位

**1 コミット = 1 つの論理変更**:

- 機能追加とリファクタを混ぜない
- 整形と挙動変更を混ぜない
- 大きな変更は段階的なコミット列にする

> "If you can't summarize the commit in a single line, you're committing too much." — anon

## コミットメッセージの構造 (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

- `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf` 等
- subject は **命令形・現在形**: "Add" / "Fix" (× "Added" / "Fixes")
- body は**なぜ**を書く。**なに**は diff が語る
- BREAKING CHANGE は footer に明示

```
fix(auth): refresh token 失効時に再ログインへ誘導

トークン失効時に 401 を握り潰してホワイトアウトしていた問題。
リトライキューを破棄して `/login` にリダイレクトする。

Closes #1234
```

## ブランチ戦略

### Trunk Based Development

- 全員が `main` 近傍で作業
- フィーチャーは**短命** (1〜2 日)
- 未完成は**フィーチャーフラグ**で隠す

利点: 統合の摩擦が少なく、CI/CD と相性が良い。

### Git Flow

- `main` / `develop` / `feature/*` / `release/*` / `hotfix/*`
- リリースが計画的・大型(モバイルアプリ等)で機能する
- Web SaaS には重すぎることが多い

### GitHub Flow

- `main` から短命ブランチ → PR → マージ
- 単純で広く採用されている

## マージ vs リベース

| 戦略 | 履歴 | いつ |
|---|---|---|
| Merge commit | 分岐を保存 | 共有ブランチ、複数人協働 |
| Rebase | 線形に整える | ローカル整理、PR をきれいに |
| Squash | 1 コミットに集約 | 細かい WIP を 1 機能に |

**公開済みブランチを rebase しない**(他人の参照を壊す)。ローカル/個人ブランチでは自由に。

## PR の良い習慣

→ [[Code-Review]] と重複するが、Git の側からも:

- **PR は短命に**: 開きっぱなしは衝突の温床
- **drafts を活用**: 早期フィードバックを取りやすい
- **コミット単位で読める形に整える**: レビュアーが diff を時系列で読める

## よく使う実用コマンド

```bash
# 直前のコミットを修正
git commit --amend

# 履歴を整える(対話的リベース、自分のローカルだけで)
git rebase -i HEAD~5

# 特定ファイルだけステージから外す
git restore --staged <file>

# 直前のコミットの変更を削除して元に戻す
git revert HEAD

# 危険な reset(失う)。reflog で救えるが避けたい
git reset --hard HEAD~1

# 「あの変更どこから来た?」
git log -p -- <file>
git blame -L 10,20 <file>

# 「いつ壊れた?」を二分探索
git bisect start && git bisect bad && git bisect good <commit>
```

## 危険な操作の安全策

- **`--force` には `--force-with-lease`**: 他人の追加分を上書きしない
- **`reset --hard` の前に `git stash` か別ブランチを切る**
- **`reflog` を覚える**: 90 日間は救える

## .gitignore の心得

- 生成物 (`dist/`, `node_modules/`)
- 環境固有 (`.env`, `.idea/`, `.vscode/` の一部)
- **ただし `.env.example` はコミットする**(構造の文書化)

機密情報を誤コミットしたら **history 書き換え + シークレット失効** が必須。`git filter-repo` を使う。

## チェックリスト

- [ ] コミット単位で**論理が完結**しているか
- [ ] メッセージは**なぜ**を語っているか
- [ ] PR は短命か(数日以内)
- [ ] 機密情報を含めていないか
- [ ] 共有ブランチに `force push` していないか

## 関連

- [[Code-Review]]
- [[Testing-Strategy]]
