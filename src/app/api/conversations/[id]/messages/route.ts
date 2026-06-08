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

  const Messages = await prisma.message.createMany({
    data: messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      conversationId: id,
    })),
  });
  return NextResponse.json(Messages);
}
