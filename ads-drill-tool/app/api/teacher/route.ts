import Anthropic from "@anthropic-ai/sdk";
import { buildImageBlock } from "@/lib/claude";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { questionImageDataUrl, answerImageDataUrl } = await req.json();

    if (!questionImageDataUrl) {
      return Response.json({ error: "問題のスクリーンショットが必要です" }, { status: 400 });
    }

    const content: Anthropic.MessageParam["content"] = [
      buildImageBlock(questionImageDataUrl),
      ...(answerImageDataUrl ? [buildImageBlock(answerImageDataUrl)] : []),
      {
        type: "text",
        text: `あなたは親切で分かりやすいAIドリルの先生です。
このスクリーンショットは「本気AIドリル」の問題${answerImageDataUrl ? "と解答" : ""}です。

以下のJSON形式のみで返してください（他のテキストは含めない）：
{
  "lessonInfo": {
    "series": "スクリーンショット右上のシリーズ名（例：React）",
    "course": "コース名（例：Hooks編）",
    "lesson": "レッスン名（例：Suspense と Error Boundary）",
    "questionInfo": "問題番号（例：Q10）"
  },
  "keyLearning": "この問題で学ぶ核心を1〜2文で（例：Suspenseは複数コンポーネントのローディングをまとめて管理したいときに使う）",
  "explanation": "## このドリルで学ぶこと\\n（1〜2文）\\n\\n## 核心的なコンセプト\\n（箇条書き3〜5点）\\n\\n## 解説\\n（なぜこの答えになるのか初学者向けに具体的に。コード例があると良い）\\n\\n## 覚えるべきポイント\\n（重要ポイント1〜3点）"
}

lessonInfoは必ずスクリーンショット内の文字から読み取り、questionInfoは「Q数字」の形式にしてください。`,
      },
    ];

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "{}";

    let parsed: {
      lessonInfo?: { series: string; course: string; lesson: string; questionInfo: string };
      keyLearning?: string;
      explanation?: string;
    };
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      parsed = {};
    }

    return Response.json({
      lessonInfo: parsed.lessonInfo ?? { series: "不明", course: "不明", lesson: "不明", questionInfo: "Q?" },
      keyLearning: parsed.keyLearning ?? "",
      explanation: parsed.explanation ?? rawText,
    });
  } catch (error) {
    console.error("Teacher API error:", error);
    return Response.json({ error: "解説の生成に失敗しました" }, { status: 500 });
  }
}
