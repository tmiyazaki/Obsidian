---
tags: [skill, coding, ai, rag, embeddings]
domain: coding
level: advanced
---

# Embeddings と RAG (Retrieval-Augmented Generation)

## 一行で

> 「**LLM に外部知識を持たせる**」ための標準アーキテクチャ。**埋め込みベクトル + 検索 + 生成** の三位一体。

## なぜ重要か

LLM 単体には限界:
- **訓練データ以降**を知らない
- **企業内ドキュメント**を知らない
- **ユーザー個別の文脈**を知らない
- **幻覚** (Hallucination) する

RAG は「**質問に関連する文書を検索 → コンテキストとして LLM に渡す**」アプローチ。社内ナレッジ、商品検索、サポート Bot、コードアシスタント ── 多くの AI プロダクトの**事実上の標準**。

## 基本フロー

```
[ ユーザー質問 ]
       ↓
[ 質問を埋め込み (Embedding) ]
       ↓
[ ベクトル DB で類似検索 ]
       ↓
[ 上位 N 件の文書を取得 ]
       ↓
[ LLM へ: 質問 + 関連文書をプロンプトに ]
       ↓
[ 生成された回答 (出典付き) ]
```

## Embeddings とは

文章 → **高次元ベクトル** (例: 1536 次元) への変換。
意味が近い文章は**ベクトル空間で近く**配置される。

```
"プログラミング" → [0.23, -0.41, 0.55, ...]
"コーディング"  → [0.21, -0.39, 0.57, ...]   ← 近い
"料理"           → [-0.51, 0.32, -0.18, ...]  ← 遠い
```

### 主要 Embedding モデル

| モデル | 次元 | 特徴 |
|---|---|---|
| OpenAI `text-embedding-3-large` | 3072 | 高品質、課金 |
| OpenAI `text-embedding-3-small` | 1536 | コスパ |
| Cohere Embed v3 | 1024 | 多言語強い |
| Voyage AI | 1024 | 高精度、コスパ |
| BGE / E5 (オープン) | 768-1024 | 自前実行可 |
| Sentence Transformers | 384-768 | 軽量、ローカル |

日本語対応: OpenAI / Cohere は良好、ローカルなら **BGE-M3, multilingual-e5**。

### 類似度

ベクトルの**コサイン類似度**(または内積、L2):

```ts
function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (normA * normB);
}
```

## ベクトル DB

| サービス / ライブラリ | 特徴 |
|---|---|
| **pgvector** (Postgres 拡張) | 既存 Postgres に追加、SQL と統合 |
| **Pinecone** | マネージド、シンプル |
| **Weaviate** | OSS、ハイブリッド検索 |
| **Qdrant** | 高速、Rust 製 |
| **Chroma** | ローカル開発向け |
| **Milvus** | 大規模 |
| **Vespa / Elastic** | 全文+ベクトル混合 |
| **Turso libSQL Vector** | エッジで動く |

中小規模なら **pgvector** が現実解(既存 DB に乗せられる)。

```sql
CREATE EXTENSION vector;
CREATE TABLE documents (
  id uuid PRIMARY KEY,
  content text,
  embedding vector(1536)
);
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

SELECT content
FROM documents
ORDER BY embedding <=> $query_embedding
LIMIT 10;
```

## Chunking (文書分割)

長文をそのまま embedding しない:
- ベクトルは**1 つの意味単位**を表すべき
- LLM の文脈窓に収まるサイズに

### 戦略

- **固定長**: 500 トークンずつ(雑、文の途中で切れる)
- **段落分割**: 自然境界
- **意味的分割**: NLP で文脈境界を検出
- **オーバーラップ**: 隣接チャンクと**100 トークン**重ねる(文脈喪失を防ぐ)
- **階層**: ドキュメント全体 + 章 + 段落 を別々にベクトル化

ライブラリ: LangChain `RecursiveCharacterTextSplitter`, llama-index。

## メタデータ

ベクトルだけでなく**フィルタ条件**を持つ:

```sql
SELECT content
FROM documents
WHERE tenant_id = $1
  AND access_level <= $user_level
  AND created_at > now() - interval '30 days'
ORDER BY embedding <=> $query_embedding
LIMIT 10;
```

ベクトル検索 + 構造化フィルタ の**ハイブリッド**が現実解。

## ハイブリッド検索

ベクトル検索だけでは限界:
- 固有名詞・略語に弱い
- 完全一致クエリで精度低
- 数値・日付に弱い

**全文検索 (BM25) + ベクトル検索**を組み合わせる:

```
全文検索スコア × 重み + ベクトルスコア × 重み
```

Reciprocal Rank Fusion (RRF) でランクを統合。
Elasticsearch, Vespa, Weaviate がハイブリッド検索を標準提供。

→ [[../30-Interface/Search-UX]]

## Reranking

検索結果を **2 段階** で精度上げ:

```
Stage 1: ベクトル + 全文で 100 件取得 (recall 重視)
Stage 2: Cross-encoder でスコア再計算 → 上位 10 件 (precision 重視)
```

Reranker: Cohere Rerank, mxbai-rerank, Voyage AI。

精度が**1.5-2 倍**変わるケースも珍しくない。

## プロンプトへの組み込み

```
あなたは Q&A アシスタントです。

以下の参考文書のみを根拠に回答してください。
不明な点は「分かりません」と答えてください。

# 参考文書
[1] {chunk1}
[2] {chunk2}
[3] {chunk3}

# 質問
{user_query}

# 回答
(必ず [N] の形で参照を含めてください)
```

注意:
- 文書が**多すぎる**と LLM が混乱(5-10 件目安)
- **出典付き**で回答させ、UI で表示
- 「**不明**」を許す指示が幻覚を減らす

→ [[../30-Interface/AI-LLM-Interfaces]]

## 評価 (Eval)

RAG は「**動いているか分からない**」が常。評価が不可欠:

### 検索段階

- **Recall@K**: 関連文書が上位 K 件に含まれる割合
- **MRR**: 関連文書の最初の順位の逆数

### 生成段階

- **Faithfulness**: 文書から逸脱していないか
- **Answer Relevance**: 質問に答えているか
- **Context Relevance**: 取ってきた文書が役立っているか

ライブラリ: Ragas, TruLens, DeepEval, Promptfoo。

→ [[../40-Bridge/AI-Evaluation-Safety]]

## 高度な RAG パターン

### Query Rewriting

ユーザーの質問を**LLM で書き直し**てから検索:

```
"これどうやるんだっけ" → "[コンテキスト推論] ファイルアップロードの手順"
```

### Multi-Query / Query Expansion

質問から**複数のクエリ**を生成して各々検索:

```
質問: "Python でファイル操作"
→ ["Python ファイル読み書き", "Python with open()", "Pythonic file IO"]
→ 結果をマージ
```

### HyDE (Hypothetical Document Embeddings)

「**もし答えがあれば**こう書く」という仮想文書を LLM 生成 → その埋め込みで検索。
回答候補と**意味空間で近い**文書が取れる。

### Agentic RAG

→ [[../30-Interface/Agentic-AI-Patterns]]

LLM が「**追加検索が必要**」と自分で判断し、ツールとして検索を呼ぶ。

```
Step 1: LLM が回答試行
Step 2: 「もっと情報必要」→ search() ツールを呼ぶ
Step 3: 結果を見て続行 or さらに検索
```

### Graph RAG

文書を**グラフ構造**で表現(Microsoft GraphRAG)。エンティティと関係を抽出し、関連を辿って文脈を集める。

複雑な質問(「X と Y の関係は?」)に強い。

## メモリ (Long-term)

ユーザーごとの好み・履歴を**ベクトル化**して RAG:

```
"前回と同じ形式で" → ユーザー別メモリから前回応答を検索
```

LangChain Memory, Mem0, Letta (旧 MemGPT)。

→ [[../30-Interface/Conversational-UI]]

## コードへの応用

### コードベース Q&A

```
リポジトリのファイル → AST 解析 → 関数単位でチャンク → 埋め込み

質問: "認証ミドルウェアどこ?"
→ 関連コード検索 → "src/middleware/auth.ts:42 を確認"
```

GitHub Copilot Chat, Cursor, Cody がこのパターン。

→ [[../40-Bridge/AI-Augmented-Development]]

## コストとパフォーマンス

```
1M トークン埋め込み: $0.02 (OpenAI 3-small)
1M トークン LLM 推論: $1-15 (モデルによる)
```

最適化:
- **Embedding はキャッシュ**(同じ文書は再計算しない)
- 小さいモデル (3-small) を試す
- バッチ処理(100 件まとめて embedding)
- ローカル embedding (BGE) で完全無料化も可

## マルチモーダル RAG

テキストだけでない:
- 画像 + テキスト埋め込み (CLIP)
- 動画フレーム埋め込み
- 音声埋め込み

「この製品の画像で類似品を検索」「会議録音から関連箇所抽出」など。

→ [[../30-Interface/Realtime-Multimodal-AI]]

## アンチパターン

- 全文書を embedding **したつもり**(失敗時のリトライなし)
- Chunking 戦略**なし**で長文丸ごと
- メタデータフィルタなし → 他テナントデータ混入
- 評価**なし**(動いているか分からない)
- LLM の出力に**出典がない**
- 検索結果を**全部**プロンプトに(コスト爆増)
- ベクトル DB**だけ**(構造化フィルタ・全文検索を併用しない)
- Embedding モデルを**理由なく**選ぶ

## チェックリスト

- [ ] **Chunking 戦略**(サイズ・オーバーラップ)が決まっているか
- [ ] **メタデータフィルタ**(tenant、権限)があるか
- [ ] **ハイブリッド検索 + Reranking** を検討したか
- [ ] **評価指標**(Recall, Faithfulness)を測っているか
- [ ] **出典**を UI で表示しているか
- [ ] Embedding を**キャッシュ**しているか
- [ ] 失敗時の**リトライと再 embedding** 機構があるか
- [ ] テナント・権限が**漏れない**か (Multi-tenancy)

## 関連

- [[../30-Interface/AI-LLM-Interfaces]]
- [[../30-Interface/Conversational-UI]]
- [[../30-Interface/Search-UX]]
- [[../30-Interface/Agentic-AI-Patterns]]
- [[Multi-tenancy]]
- [[Database-Design]]
- [[Caching-Strategies]]
- [[../40-Bridge/AI-Evaluation-Safety]]
- [[../40-Bridge/AI-Augmented-Development]]
- [[../40-Bridge/Privacy-by-Design]]

## 深掘り

- *Building LLM-Powered Applications* by Valentina Alto
- LangChain / LlamaIndex documentation
- Anthropic, *Building Effective Agents*
- Pinecone Learning Center
- Cohere RAG documentation
- arXiv: *Retrieval-Augmented Generation* (Lewis et al., 2020)
