---
tags: [skill, design, system]
domain: design
level: intermediate
---

# デザイントークン

## 一行で

> 値を**名前で抽象化**し、デザインと実装の**契約**にする最小単位。「青色 #1976D2」ではなく「`color.primary.500`」で会話する。

## なぜ重要か

トークンが無いと:
- 同じ青が `#1976D2` と `#1A77D4` の **2 種類**に増える
- ブランドカラー変更で**全ファイル grep**が必要
- ダークモード対応が**コピペで実装**される

トークンは「**変更点を 1 箇所に集める**」ことで、デザイン変更のコストを減らします。

## 三層構造

```
Reference (生の値)
  ↓ 参照
Semantic (役割)
  ↓ 参照
Component (コンポーネント固有)
```

### 1. Reference Tokens (Tier 1)

生の値。色のスケール、サイズ階段、フォントスケールの**原始**。

```json
{
  "color": {
    "blue": { "500": "#1976D2", "700": "#1565C0" },
    "neutral": { "100": "#F5F5F5", "900": "#212121" }
  },
  "space": { "1": "4px", "2": "8px", "4": "16px" },
  "font": { "size": { "body": "16px", "h1": "32px" } }
}
```

### 2. Semantic Tokens (Tier 2)

**役割**で命名する。Reference を参照。これが UI の語彙になる。

```json
{
  "color": {
    "background": { "base": "{color.neutral.100}" },
    "text": { "primary": "{color.neutral.900}" },
    "action": {
      "primary": "{color.blue.500}",
      "primary-hover": "{color.blue.700}"
    }
  }
}
```

### 3. Component Tokens (Tier 3)

特定コンポーネント専用。**他で再利用しない**ものだけここへ。

```json
{
  "button": {
    "primary": {
      "background": "{color.action.primary}",
      "background-hover": "{color.action.primary-hover}",
      "text": "{color.text.on-primary}"
    }
  }
}
```

## なぜ三層か

```
ブランド色変更 → Reference を直す → 全 Semantic が連動
ダークモード   → Semantic だけスワップ → Reference は不変
ボタン形変更   → Component だけ直す  → 他は無傷
```

層を分けることで**変更の局所性**を最大化する。

## ネーミング規約

```
{category}.{type}.{role}.{state}.{scale}
```

例:
- `color.text.primary.default`
- `color.text.primary.hover`
- `color.background.danger.subtle`
- `space.inset.lg`
- `radius.button`

長くなりすぎないよう、不要な階層は省略する。**チームで一貫**していることが最優先。

## 実装フォーマット

### W3C Design Tokens Format (Draft)

```json
{
  "color": {
    "primary": {
      "$value": "#1976D2",
      "$type": "color",
      "$description": "ブランドの主要アクション色"
    }
  }
}
```

### Style Dictionary / Tokens Studio

JSON を CSS / iOS / Android の各形式に**変換**するパイプライン:

```
tokens.json → Style Dictionary →
  - tokens.css (CSS variables)
  - tokens.swift (iOS)
  - tokens.kt (Android)
  - tokens.ts (TypeScript)
```

→ デザイン側は Figma Tokens で定義、実装側はビルド時に各プラットフォームの形式へ。

### CSS Custom Properties

```css
:root {
  --color-action-primary: #1976D2;
  --space-md: 16px;
}

[data-theme="dark"] {
  --color-action-primary: #64B5F6;
}
```

`data-theme` 切り替えで**子要素全てに伝播**するのが Custom Properties の強み。

## ダークモード設計の鉄則

トークンを「**ライト/ダーク両方に意味のある名前**」で定義する:

```
❌ --color-white  (ダークでは黒になる名前と意味の不一致)
✅ --color-surface-base
```

トークンは**色そのものではなく、文脈での役割**を表す。

## アンチパターン

- 色名を**色相の名前**で持ってしまう(`--blue-500` を直接 UI で使い、ダークで詰む)
- Tier 1 を直接 UI で使い回す(役割が見えない)
- 100 個のトークン(管理不能)
- トークン同士の**循環参照**
- デザインと実装で**別の値**になっている(同期されていない)

## チェックリスト

- [ ] **役割名** (Semantic) で UI を構築しているか
- [ ] 同じ概念に**1 個のトークン**だけが存在するか
- [ ] ライト/ダークで**意味が崩れない命名**か
- [ ] トークンの**変更が 1 箇所**に閉じるか
- [ ] デザインツールと実装で**同じ値**が共有されているか

## 関連

- [[Color-Theory]]
- [[Typography]]
- [[Spacing-Rhythm]]
- [[Design-Systems]]
- [[../40-Bridge/Design-Code-Handoff]]

## 深掘り

- W3C Design Tokens Community Group
- Amazon Style Dictionary
- Figma Tokens / Tokens Studio
