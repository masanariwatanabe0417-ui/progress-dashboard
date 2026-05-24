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
        text: `あなたは入社したての社員に教える親切な先輩社員です。
このスクリーンショットは「本気AIドリル」の問題${answerImageDataUrl ? "と解答" : ""}です。

重要ルール：
- 入社したての社員に教える先輩社員として、分かりやすく簡潔に説明してください
- 最初に「用語解説」セクションで専門用語を中学生向けに説明してください
- 英語・コード用語が出てきたら必ず直後にカタカナを括弧で補足してください（例：branch(ブランチ)、feature(フィーチャー)）
- コードが出てきたら各要素の意味を説明し、用語解説セクションと連動させてください

以下のJSON形式のみで返してください（他のテキストは含めない）：
{
  "lessonInfo": {
    "series": "スクリーンショット右上のシリーズ名（例：React）",
    "course": "コース名（例：Hooks編）",
    "lesson": "レッスン名（例：Suspense と Error Boundary）",
    "questionInfo": "問題番号（例：Q10）"
  },
  "keyLearning": "この問題で学ぶ核心を1〜2文で（英語用語にはカタカナを括弧で補足。例：branch(ブランチ)を使うと作業の流れを枝分かれさせられる）",
  "explanation": "## 用語解説\\n（このドリルに出てくる専門用語を中学生でもわかる言葉で。英語はカタカナ付きで）\\n- 用語例(カタカナ): 説明\\n\\n## このドリルで学ぶこと\\n（1〜2文、英語用語はカタカナ形式で補足）\\n\\n## 解説\\n（入社したての社員に教える先輩のように。英語はカタカナ付き。コードが出たら各要素の意味を説明し用語解説と連動）\\n\\n## 覚えるべきポイント\\n（重要ポイント1〜3点、英語用語はカタカナ形式で補足）"
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
