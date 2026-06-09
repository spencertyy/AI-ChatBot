import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();
  const { id } = await params;

  // 先删除该对话的所有旧消息，再全量写入，防止重复积累
  //Delete all the old messages in this conversation and then write them all in full to prevent repeated accumulation
  await prisma.message.deleteMany({ where: { conversationId: id } });

  const result = await prisma.message.createMany({
    data: messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      conversationId: id,
      inputTokens: msg.inputTokens ?? null,
      outputTokens: msg.outputTokens ?? null,
    })),
  });
  return NextResponse.json(result);
}
