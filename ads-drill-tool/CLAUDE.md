# ads-drill-tool — AIドリル理解支援ツール

## プロジェクト概要

ADS（AIドリブンスクール）の「本気AIドリル」を理解するための学習支援ツール。
問題・解答のスクリーンショットを貼り付けると、Claude APIが内容を読み取り、
用語解説・解説・覚えるべきポイントを自動生成する4ペイン構成のWebアプリ。

ADS 講義5の課題として作成。技術スタック・UI構成はADS指定要件に準拠。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js 14（App Router） |
| 言語 | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| AI | Anthropic Claude API（claude-opus-4-5 / claude-haiku-4-5） |
| Markdownレンダリング | react-markdown |
| デプロイ先 | Vercel（予定） |

> shadcn/ui はネットワーク制限のためCLIではなく手動インストール済み。
> `components/ui/` 以下のファイルを直接編集すること。

---

## 4ペイン構成

```
┌──────────────┬──────────────────┬───────────────────────────┬───────────────────┐
│①ナビゲーション│ ②スクリーンショット│      ③先生ペイン           │   ④質問ペイン     │
│   w-60       │     w-72         │        flex-1             │     w-80          │
│              │                  │                           │                   │
│ コース/レッスン│ 問題スクショ      │ ## 用語解説               │ 質問を入力        │
│ /Q の階層ツリー│ 解答スクショ      │ ## このドリルで学ぶこと    │ → AI が回答       │
│              │ Ctrl+V / ⌘V 対応 │ ## 解説                   │ → 先生ペインに追加 │
│              │                  │ ## 覚えるべきポイント      │                   │
└──────────────┴──────────────────┴───────────────────────────┴───────────────────┘
```

---

## ファイル構成

```
ads-drill-tool/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── teacher/route.ts    # スクショ → 3エージェント並列でAI解説生成
│       └── question/route.ts   # 質問 → 回答 + 先生ペイン追加案
├── components/
│   ├── DrillTool.tsx           # 全状態を持つルートコンポーネント
│   └── panes/
│       ├── NavigationPane.tsx  # コース/レッスン/Q階層ツリー（自動展開）
│       ├── ScreenshotPane.tsx  # 画像アップロード・貼り付け
│       ├── TeacherPane.tsx     # Markdown解説表示（3モード）
│       └── QuestionPane.tsx    # Q&A・承認ボタン
├── lib/
│   ├── types.ts                # 共有型定義（StudyLog, TeacherView等）
│   └── claude.ts               # Anthropic SDK ヘルパー（buildImageBlock）
├── components/ui/              # shadcn/ui 手動インストール済みコンポーネント
├── .env.local                  # ANTHROPIC_API_KEY（コミット禁止）
├── .env.local.example          # キー名テンプレート（コミットOK）
└── CLAUDE.md                   # このファイル
```

---

## 主要な型定義（lib/types.ts）

```typescript
StudyLog          // 全学習データ（courses配列）
  └ CourseData    // コース（courseKey, seriesName, courseName, lessons）
    └ LessonData  // レッスン（lessonName, questions）
      └ QuestionEntry  // Q（questionInfo, keyLearning, explanation, timestamp）

TeacherView       // 先生ペインの表示モード（discriminated union）
  | { type: "question"; courseKey; lessonName; questionInfo }
  | { type: "lesson";   courseKey; lessonName }
  | { type: "course";   courseKey }
  | null
```

---

## AI処理フロー（/api/teacher）

スクリーンショット貼り付け時に3エージェントが並列実行される：

```
Promise.all([
  Agent① haiku  : レッスン情報抽出（series/course/lesson/Q番号）
  Agent② haiku  : 用語解説生成（カタカナ補足付き）
  Agent③ opus   : 解説・keyLearning・覚えるべきポイント生成
])
→ 結果をマージしてTeacherPaneに返す
```

---

## 教育スタイル（AIプロンプトの共通ルール）

- 入社したての社員に教える先輩社員のトーン
- 英語・コード用語は必ずカタカナを括弧で補足（例：branch(ブランチ)）
- 用語解説セクションを必ず冒頭に入れる（中学生でもわかる説明）
- コードが出たら各要素の意味を個別に説明する

---

## 開発ルール

### コミット前に必ず確認
```bash
cd ads-drill-tool
npm run build   # TypeScript + ESLint エラーがないことを確認
```

### コミット・プッシュの流れ
1. 実装完了 → `npm run build` でエラーがないことを確認
2. 「コミットしてください」と明示的に指示を受けてからコミット
3. ブランチで作業 → GitHub でPR → Merge という流れを意識する

### ブランチ運用
- 機能追加・修正は必ずブランチで作業する
- 完成したらGitHubでPRを作成 → Mergeしてmainに取り込む

### コメントについて
- コードコメントは原則不要（命名で意図が分かるように）
- 「なぜそうしたか（WHY）」が非自明な場合のみ短く1行で書く

### セキュリティ
- `.env.local` は絶対にコミットしない（`.gitignore` 済み）
- APIキーをチャット欄に貼り付けない

---

## 環境変数

```bash
# .env.local に設定
ANTHROPIC_API_KEY=sk-ant-...
```

---

## ローカル開発

```bash
cd ads-drill-tool
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド確認
```

---

## Vercelデプロイ（自宅PCで実施）

1. Vercel と GitHub リポジトリを連携
2. Root Directory を `ads-drill-tool` に設定
3. Environment Variables に `ANTHROPIC_API_KEY` を設定
4. デプロイ後、発行されたURLで動作確認

---

## このツールの学習目的

- Claude Code（職場PC）で設計・実装を学ぶ
- その知識を活かしてCursor（自宅PC）で再現・提出
- AIが内部で3エージェント並列動作する仕組みを体験する
