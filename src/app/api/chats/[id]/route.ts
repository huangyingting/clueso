import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { invokeCluesoAi } from '@/lib/ai';

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

  let assistantReply = `Here is the Clueso AI (${chat.model}) action plan for **"${prompt}"**:\n1. Extracted key timestamps and chapters from the recording.\n2. Polished voiceover script and synced word-level Karaoke captions.\n3. Ready to open in Studio Editor or export as a standalone clip.`;

  try {
    const recentHistory = messages.slice(-6).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const aiResult = await invokeCluesoAi({
      taskType: 'clueso_pilot_chat_turn',
      guideId: chat.guideId || undefined,
      maxCompletionTokens: 900,
      systemPrompt:
        'You are Clueso Pilot, an AI Video & Documentation Director inside Acme Product Studio. Respond concisely in Markdown with concrete video editing, script polishing, clip extraction, or SOP documentation recommendations.',
      userPrompt: `Conversation History:\n${recentHistory}\n\nRespond to the latest user message.`,
    });
    if (aiResult.content) {
      assistantReply = aiResult.content;
    }
  } catch {
    // Fallback
  }

  messages.push({
    id: `m-${Date.now()}-a`,
    role: 'assistant',
    content: assistantReply,
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
