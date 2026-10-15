import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let chat = await prisma.chatThread.findUnique({
    where: { id },
    include: { createdBy: true },
  });
  if (!chat) {
    chat = await prisma.chatThread.findFirst({ include: { createdBy: true } });
  }
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }
  return NextResponse.json({
    chat,
    messages: JSON.parse(chat.messagesJson || '[]'),
  });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const prompt = (body.prompt || '').trim();

  const chat = await prisma.chatThread.findUnique({ where: { id } });
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  const messages = JSON.parse(chat.messagesJson || '[]');
  messages.push({
    id: `m-${Date.now()}-u`,
    role: 'user',
    content: prompt,
    createdAt: new Date().toISOString(),
  });
  messages.push({
    id: `m-${Date.now()}-a`,
    role: 'assistant',
    content: `Here is the Clueso AI (${chat.model}) action plan for **"${prompt}"**:\n1. Extracted key timestamps and chapters from the recording.\n2. Polished voiceover script and synced word-level Karaoke captions.\n3. Ready to open in Studio Editor or export as a standalone clip.`,
    createdAt: new Date().toISOString(),
  });

  const updated = await prisma.chatThread.update({
    where: { id },
    data: {
      messagesJson: JSON.stringify(messages),
    },
  });

  return NextResponse.json({
    chat: updated,
    messages,
  });
}
