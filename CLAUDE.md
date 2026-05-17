# Claude Code Rules

## 開発ルール

### 基本フロー（必須）

1. **コード変更前**: Exploreエージェントで対象ファイルや関連コードを確認してから変更を行う
2. **コード変更後**: 下記「3サブエージェント確認」を必ず実行する
3. **コミット前**: `git diff` で差分を確認してからコミットする

---

## 3サブエージェント確認（コード変更後に必須）

コードを変更したら、以下3つのサブエージェントを**並列で**起動して確認すること。

### Agent 1: 品質・ロジックレビュー（subagent_type: claude）
- 変更したコードのロジックが正しいか
- バグや意図しない副作用がないか
- 不要な複雑性・重複がないか（`simplify` skillも活用）

### Agent 2: セキュリティレビュー（subagent_type: claude）
- XSS・インジェクション・APIキー漏洩がないか
- ユーザー入力のサニタイズが適切か
- `esc()` 関数等のエスケープ処理が漏れていないか
- CORS・fetch の安全性

### Agent 3: 機能整合性レビュー（subagent_type: Explore）
- 変更が他のファイルや機能に影響していないか
- UIの動作・イベントリスナーの重複がないか
- localStorage のキー名や構造が一貫しているか

### 実行例
```
Agent({ subagent_type: "claude",   description: "品質レビュー",       prompt: "..." })
Agent({ subagent_type: "claude",   description: "セキュリティ確認",   prompt: "..." })
Agent({ subagent_type: "Explore",  description: "機能整合性チェック", prompt: "..." })
```

---

## プロジェクト構成

| リポジトリ | 用途 | URL |
|---|---|---|
| `masanariwatanabe0417-ui/progress-dashboard` | 開発・CI管理 | — |
| `masanariwatanabe0417-ui/seimukatsudouhi-checker` | 政務活動費審査システム本体 | `https://masanariwatanabe0417-ui.github.io/seimukatsudouhi-checker/` |

政務活動費審査システムのファイルは `/home/user/seimukatsudouhi-checker/` にある。
変更後は `gh-pages` ブランチに `mcp__github__push_files` でデプロイする。
