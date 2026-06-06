import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Conversations } from "openai/resources/index.js";
import { use } from "react";

// GET /api/conversations — 获取当前用户的所有对话
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const conversations = await prisma.conversation.findMany({
    where: { userId: user?.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: true },
  });

  return NextResponse.json(conversations);
}
// TODO: 用 prisma 查询当前用户的所有对话
// 提示：先找到 user（用 email），再找 conversations
// 按 updatedAt 降序排列（最近的在最前面）
// 关联查询时 include messages（后面前端需要）

// POST /api/conversations — 新建一个对话
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const Conversation = await prisma.conversation.create({
    data: {
      title: title,
      userId: user.id,
    },
  });
  return NextResponse.json(Conversation);
}
