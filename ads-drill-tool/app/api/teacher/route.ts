import Anthropic from "@anthropic-ai/sdk";
import { buildImageBlock } from "@/lib/claude";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { questionImageDataUrl, answerImageDataUrl, lessonTitle } = await req.json();

    if (!questionImageDataUrl) {
      return Response.json({ error: "問題のスクリーンショットが必要です" }, { status: 400 });
    }

    const content: Anthropic.MessageParam["content"] = [
      buildImageBlock(questionImageDataUrl),
      ...(answerImageDataUrl ? [buildImageBlock(answerImageDataUrl)] : []),
      {
        type: "text",
        text: `あなたは親切で分かりやすいAIドリルの先生です。
このスクリーンショットは「${lessonTitle}」のドリル問題${answerImageDataUrl ? "と解答" : ""}です。

以下の構成で日本語で説明してください：

## このドリルで学ぶこと
（1〜2文でこのレッスンのテーマを説明）

## 核心的なコンセプト
（問題が問いかけている概念を箇条書きで3〜5点）

## 解説
（なぜこの答えになるのか、初学者にも分かるように具体的に説明）

## 覚えるべきポイント
（実際の開発で使えるよう、1〜3点の重要なポイント）`,
      },
    ];

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content }],
    });

    const explanation =
      message.content[0].type === "text" ? message.content[0].text : "";

    return Response.json({ explanation });
  } catch (error) {
    console.error("Teacher API error:", error);
    return Response.json({ error: "解説の生成に失敗しました" }, { status: 500 });
  }
}
