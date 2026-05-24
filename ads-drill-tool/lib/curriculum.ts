import { Series } from "./types";

export const CURRICULUM: Series[] = [
  {
    id: "s1",
    title: "Git完全マスターシリーズ",
    color: "bg-slate-600",
    courses: [
      {
        id: "c1",
        title: "Git概念マスターコース",
        lessons: [
          { id: "l1", title: "Lesson 1: Git世界一周ツアー", questionCount: 10 },
          { id: "l2", title: "Lesson 2: タイムマシン機能", questionCount: 10 },
          { id: "l3", title: "Lesson 3: パラレルワールド（ブランチ）", questionCount: 10 },
          { id: "l4", title: "Lesson 4: 世界の合流（マージ）", questionCount: 10 },
          { id: "l5", title: "Lesson 5: チームの衝突（コンフリクト）", questionCount: 10 },
          { id: "l6", title: "Lesson 6: 分散型の世界", questionCount: 10 },
          { id: "l7", title: "Lesson 7: リモートとの連携", questionCount: 10 },
          { id: "l8", title: "Lesson 8: プロの使い方", questionCount: 10 },
        ],
      },
    ],
  },
  {
    id: "s2",
    title: "Web開発基礎シリーズ",
    color: "bg-orange-500",
    courses: [
      {
        id: "c2",
        title: "HTML基礎コース",
        lessons: [
          { id: "l9", title: "Lesson 1: HTMLの構造", questionCount: 10 },
          { id: "l10", title: "Lesson 2: テキストと見出し", questionCount: 10 },
        ],
      },
      {
        id: "c3",
        title: "CSS基礎コース",
        lessons: [
          { id: "l11", title: "Lesson 1: セレクタとプロパティ", questionCount: 10 },
          { id: "l12", title: "Lesson 2: ボックスモデル", questionCount: 10 },
        ],
      },
    ],
  },
  {
    id: "s3",
    title: "Web開発実践シリーズ",
    color: "bg-orange-600",
    courses: [
      {
        id: "c4",
        title: "JavaScript基礎コース",
        lessons: [
          { id: "l13", title: "Lesson 1: 変数とデータ型", questionCount: 10 },
          { id: "l14", title: "Lesson 2: 関数", questionCount: 10 },
          { id: "l15", title: "Lesson 3: 配列とオブジェクト", questionCount: 10 },
        ],
      },
    ],
  },
  {
    id: "s4",
    title: "UIデザイン基礎シリーズ",
    color: "bg-pink-500",
    courses: [
      {
        id: "c5",
        title: "デザイン原則コース",
        lessons: [
          { id: "l16", title: "Lesson 1: 色彩理論", questionCount: 10 },
          { id: "l17", title: "Lesson 2: タイポグラフィ", questionCount: 10 },
        ],
      },
    ],
  },
];
