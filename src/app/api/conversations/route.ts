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
