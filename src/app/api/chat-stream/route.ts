import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export async function POST(request: Request) {
  const { messages, model, provider } = await request.json();

  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const MAX_TURNS = 10;
  const recentMessages = messages.slice(-MAX_TURNS * 2); // Get the last 10 turns (user + assistant)

  const conversation = recentMessages
    .map((msg: { role: string; content: string }) => {
      const speaker = msg.role === "assistant" ? "model" : "user";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n");

  const prompt = [
    `You are a helpful AI assistant,
  Rules:
  - Answer the question based on the conversation history.
  - Keep reponses short and to the point.
  - Prefer bullet points if the answer is long.
  - Avoid unnecessary explanations.
  - If the user asks for a table, output a real GitHub-Flavored Markdown table.
  - Never put markdown tables inside code blocks.
  - Do not use triple backticks around tables.
  - Only use code blocks for actual code examples.
  Conversation:
  ${conversation}
  Assistant:`,
  ].join("\n");

  const encoder = new TextEncoder();

  if (provider === "gemini") {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await genAI.models.generateContentStream({
            model: model,
            contents: prompt,
            config: {
              temperature: 0.7,
              maxOutputTokens: 1500, //token control
            },
          });
          let usageMetadata: {
            promptTokenCount?: number;
            candidatesTokenCount?: number;
          } | null = null;
          for await (const chunk of result) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
              ); //把 Gemini 的 chunk 包成 SSE（ server-sent events）格式。
            }
            if (chunk.usageMetadata) {
              usageMetadata = chunk.usageMetadata; // ← 每次更新，最后一个最完整
            }
          }

          // 循环结束后发送 usage
          if (usageMetadata) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "usage",
                  inputTokens: usageMetadata.promptTokenCount ?? 0,
                  outputTokens: usageMetadata.candidatesTokenCount ?? 0,
                })}\n\n`,
              ),
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Gemini streaming error:", error);

          const message =
            (error as { status?: number })?.status === 429
              ? "Gemini free quota exceeded. Please wait and try again later."
              : "Something went wrong.";

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: message,
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
  if (provider === "openai") {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await openAI.chat.completions.create({
            model: model,
            messages: recentMessages,
            stream: true,
            stream_options: { include_usage: true },
          });

          for await (const chunk of result) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
              );
            }
            if (chunk.usage) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "usage",
                    inputTokens: chunk.usage.prompt_tokens,
                    outputTokens: chunk.usage.completion_tokens,
                  })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("OpenAI streaming error:", error);
          const message =
            (error as { status?: number })?.status === 429
              ? "OpenAI free quota exceeded. Please wait and try again later."
              : "Something went wrong.";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: message,
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}
