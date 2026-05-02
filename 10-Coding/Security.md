---
tags: [skill, coding, security]
domain: coding
level: intermediate
---

# セキュリティ

## 一行で

> セキュリティは「**特殊な専門領域**」ではなく「**機能の質の一部**」。後付けでは間に合わない、設計に組み込む。

## なぜ重要か

セキュリティ事故の損失は、技術的修正コストよりも**信頼喪失・法的責任・事業停止**で決まります。攻撃者は最弱の鎖を狙う ― 強い暗号より、**漏れた管理者パスワード**や**未認証の管理 API**の方がずっと刺さります。

## 設計の柱 — Defense in Depth (多層防御)

ひとつの層が破られても他の層が防ぐ:

```
ネットワーク (WAF, DDoS 保護)
  ↓
認証 (MFA, 強パスワード)
  ↓
認可 (最小権限)
  ↓
入力検証 (バリデーション、エンコード)
  ↓
監査 (ログ、検知)
  ↓
障害時封じ込め (セグメント、暗号化)
```

## OWASP Top 10 (Web の主要脅威)

実務でほぼ必ず触れる脅威群。**全て覚える**価値がある。

### 1. Injection (SQL/Command/LDAP)

ユーザー入力が**コードとして解釈**される攻撃。

```ts
// ❌
db.query(`SELECT * FROM users WHERE name = '${name}'`);

// ✅ パラメタライズ
db.query('SELECT * FROM users WHERE name = ?', [name]);
```

ORM のクエリビルダーを使う、生 SQL は**パラメタライズ必須**。

### 2. Broken Authentication

- パスワードを平文/弱ハッシュで保存(`MD5`, `SHA1` は ✗)→ **bcrypt/argon2**
- セッショントークンを URL に
- ログイン試行回数制限なし → ブルートフォース可能
- MFA 未提供

### 3. Sensitive Data Exposure

- HTTPS 必須 (HTTP リダイレクトは中間者攻撃に脆弱)
- 保管時暗号化 (DB の機密列、ファイル)
- ログに**機密情報を出さない** (パスワード、カード番号、トークン)

### 4. XML External Entities (XXE)

XML パーサで外部実体を有効にしない。最近は JSON 主流で減ったが、レガシー要注意。

### 5. Broken Access Control

- 「URL を直接叩けば取れる」**水平権限昇格** (`/users/123` → `/users/124`)
- 認可チェックがフロントだけ → サーバーで**必ず再検証**
- 管理機能が認証で守られていない

### 6. Security Misconfiguration

- デフォルトパスワード残置
- 不要なサービス起動
- エラーページに**スタックトレース露出**
- CORS が `*` で全公開

### 7. XSS (Cross-Site Scripting)

ユーザー入力が**スクリプトとして実行**される。

```html
<!-- ❌ エスケープ無しで出力 -->
<div>{{ userComment }}</div>

<!-- ✅ デフォルトでエスケープするテンプレートエンジンを使う -->
```

- React/Vue/Svelte は**デフォルトでエスケープ**
- `dangerouslySetInnerHTML` は**最終手段**、入力は DOMPurify 等でサニタイズ
- CSP (Content Security Policy) ヘッダで第三者スクリプトを制限

### 8. Insecure Deserialization

信頼できないデータを**そのままオブジェクトに復元**しない。型チェックと許可リスト。

### 9. Vulnerable Components

- 依存ライブラリの脆弱性スキャン (`npm audit`, Dependabot, Snyk)
- 不要な依存を削減
- 「最新だから安全」ではない、CVE を確認

### 10. Insufficient Logging & Monitoring

侵入を**検知できない**設計が最大のリスク。
- 認証失敗、認可拒否、権限変更を**必ずログ**
- 異常パターン (短時間多数失敗、深夜の管理操作) のアラート
- ログ自体の改ざん防止

## CSRF (Cross-Site Request Forgery)

別サイトから**ユーザーのセッションを利用**して操作される攻撃。

対策:
- `SameSite=Lax` or `Strict` cookie
- CSRF トークン (form submit に隠しフィールド)
- `Origin/Referer` ヘッダ検証

## 認証の現実解

### パスワード

- **bcrypt/argon2** (cost factor 適切に)
- 最低 8〜12 文字、一般的弱パスは禁止
- パスワードポリシは緩めにし、**長さを優先**(NIST 推奨)
- パスワードマネージャ前提の UX (`autocomplete="new-password"`)

### MFA

TOTP (Authenticator app) を最低限提供。SMS は SIM スワップ攻撃に脆弱なので非推奨。
WebAuthn/Passkey が将来の主流。

### セッション

- HttpOnly + Secure + SameSite cookie
- 期限を切る + 重要操作前に再認証
- ログアウト時にサーバー側でも無効化

## シークレット管理

- ソースコードに API キーを書かない (.env も commit 禁止)
- **シークレットマネージャ** (AWS Secrets Manager, Vault)
- 漏洩時の**ローテーション手順**を準備
- 定期的に GitHub の**シークレットスキャン**

## 開発プロセスでの組み込み

### Threat Modeling

機能設計時に**何が悪用されうるか**を STRIDE で洗う:
- **S**poofing (なりすまし)
- **T**ampering (改ざん)
- **R**epudiation (否認)
- **I**nformation disclosure (情報漏洩)
- **D**enial of service (DoS)
- **E**levation of privilege (権限昇格)

### Security Review

- レビュー観点に「**機密データ**, **認証/認可**, **入力検証**」を含める
- セキュリティ専門家を**重要変更**に巻き込む

### Pen Test

定期的にプロ依頼または bug bounty。

## 認可設計

### 最小権限の原則 (PoLP)

各ユーザー/サービスは**必要最小限**の権限のみ。デフォルトは拒否。

### モデル

- **RBAC** (Role-Based): ロール → 権限のマップ
- **ABAC** (Attribute-Based): 属性で動的に判定
- **ReBAC** (Relation-Based): 関係で判定 (Google Zanzibar 系)

リソース粒度の細かい SaaS では ReBAC が伸長。

## アンチパターン

- フロントエンドだけの権限チェック
- 「内部だから安全」(内部脅威がある)
- エラーメッセージで**システム情報を漏洩** (`User 'admin' does not exist` ← ユーザー存在を漏らしている)
- 機密情報を**URL/ログ/エラー画面**に
- `eval()` で動的コード実行
- 暗号化を**自作**

## チェックリスト

- [ ] 全エンドポイントに**認証/認可**があるか
- [ ] 入力が**サーバー側で検証**されているか
- [ ] パスワードが**bcrypt/argon2** で保存されているか
- [ ] HTTPS のみで運用されているか
- [ ] **CSP/CSRF/CORS** が設定されているか
- [ ] 依存の**脆弱性スキャン**が CI に組み込まれているか
- [ ] **ログ**に機密情報が混入していないか
- [ ] シークレットがコードに含まれていないか
- [ ] 認証失敗・権限昇格などが**監査ログ**に残るか

## 関連

- [[API-Design]]
- [[Error-Handling]]
- [[Observability]]
- [[../30-Interface/Forms-and-Input]] (入力フォームの脆弱性)
- [[../40-Bridge/Ethical-Design]]

## 深掘り

- OWASP Top 10 / Cheat Sheet Series
- *NIST SP 800-63B* (Digital Identity)
- *Threat Modeling: Designing for Security* by Adam Shostack
