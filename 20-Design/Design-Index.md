---
tags: [moc, design]
domain: design
---

# Design — インデックス

ビジュアルデザインは「**美しくする作業**」ではなく、「**意味を視覚に変換する作業**」です。読み手の目線・期待・身体性を前提に、画面上のあらゆる**差異**(大きさ・色・位置・余白)を**意味の運搬手段**として扱います。

## 三本柱

1. **階層 (Hierarchy)** — 何を最初に見せ、何を後にするか
2. **コントラスト (Contrast)** — 注目を生み、誤読を防ぐ
3. **一貫性 (Consistency)** — 規則を学習可能にし、認知負荷を下げる

## ノート

### 言語

- [[Visual-Hierarchy|視覚階層]] — 目線の流れを設計する
- [[Typography|タイポグラフィ]] — 読む文字、見る文字
- [[Color-Theory|カラーセオリー]] — 色は意味と感情を運ぶ
- [[Spacing-Rhythm|余白とリズム]] — 「無」が形を作る
- [[Layout-Grid|レイアウトとグリッド]] — 構造の骨格

### 体系

- [[Design-Tokens|デザイントークン]] — 値を語彙化する
- [[Design-Systems|デザインシステム]] — 規則の組織化
- [[Iconography|アイコノグラフィ]] — 言葉ではない言語
- [[Motion-System|モーションシステム]] — 動きを語彙化する
- [[Dark-Mode|ダークモード]] — 暗い環境向けの別テーマ設計
- [[Brand-Voice|ブランドアイデンティティ]] — 全感覚チャネルの人格 ✨

### 応用

- [[Data-Visualization|データビジュアライゼーション]] — 数値を視覚に変換する

## 学習の順序(推奨)

```
Visual-Hierarchy → Typography → Color-Theory
        ↓
Spacing-Rhythm → Layout-Grid → Iconography
        ↓
Design-Tokens → Design-Systems
        ↓
Motion-System → Dark-Mode → Data-Visualization
```

## デザイン判断のフレーム

「**この差は意味の差を運んでいるか**」を毎回問う:

- ボタンの色違い → 行動の優先度の差を運ぶ?(運んでいなければノイズ)
- フォントサイズ違い → 情報階層の差を運ぶ?
- 余白違い → 関連の強弱を運ぶ?

差が**意味と紐付いていれば signal**、紐付かなければ **noise**。デザインの仕事の半分は noise を削ること。

## 関連

- [[../00-Index/MOC|MOC]]
- [[../GLOSSARY|用語集]]
- [[../30-Interface/Interface-Index]]
- [[../40-Bridge/Design-Code-Handoff]]
- [[../40-Bridge/Internationalization]]
