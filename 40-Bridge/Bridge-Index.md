---
tags: [moc, bridge]
domain: cross-cutting
---

# Bridge — 領域を横断するテーマ

コーディング・デザイン・インターフェース設計は実務では**分離不可能**です。優れたプロダクトは 3 領域の**整合**から生まれます。Bridge ノートは、ある領域だけで考えると見落とすテーマを扱います。

## ノート

### 協働

- [[Component-Driven-Development|コンポーネント駆動開発 (CDD)]] — 部品としての UI
- [[Design-Code-Handoff|デザインとコードの受け渡し]] — 摩擦を最小化する協働
- [[Documentation-as-Product|プロダクトとしてのドキュメンテーション]] — ドキュメントも UI ✨

### 言語と意味

- [[Naming-as-Design|名前付けという設計]] — IA・コード・コンポーネントを貫く名前
- [[Internationalization|国際化と地域化]] — 翻訳可能な形で書く ✨

### 体験の質

- [[Performance-as-UX|パフォーマンスという UX]] — 速さは体験そのもの
- [[Ethical-Design|倫理的デザイン]] — できるとしてよいは別 ✨

## 共通の問い

各 Bridge ノートは、以下の問いに答えようとします:

1. **どの領域の語彙で考えるべきか**(コーダーの語彙? デザイナーの語彙? ユーザーの語彙?)
2. **どこに正本(Source of Truth)を置くか**(Figma? コード? トークン? Glossary?)
3. **誰がいつレビューするか**(エンジニア? デザイナー? PM? ユーザー?)
4. **長期的に何が壊れるか**(変更コスト・乖離・倫理リスク)

## 関連

- [[../00-Index/MOC|MOC]]
- [[../GLOSSARY|用語集]]
- [[../10-Coding/Coding-Index]]
- [[../20-Design/Design-Index]]
- [[../30-Interface/Interface-Index]]
