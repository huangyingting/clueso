import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET() {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ chats: [] });

  const chats = await prisma.chatThread.findMany({
    where: { organizationId: user.organizationId },
    include: { createdBy: true },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json({ chats });
}

export async function POST(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const prompt = (body.prompt || 'Suggest clips that I can extract from this video.').trim();
  const model = body.model || 'Opus 5.5';

  const messages = [
    {
      id: `msg-${Date.now()}-1`,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    },
    {
      id: `msg-${Date.now()}-2`,
      role: 'assistant',
      content: `Using **Clueso AI (${model})**, I analyzed your workspace videos and prepared a tailored response for: *"${prompt}"*\n\n- **Segment 1 (00:00 – 00:06)**: Workspace introduction with brand title overlay.\n- **Segment 2 (00:06 – 00:12)**: Core workflow demonstration with Smart Auto-Zoom.\n- **Segment 3 (00:12 – 00:18)**: Multi-language translation & customer sharing CTA.\n\nYou can open this directly in the Studio Editor or extract individual clips into a new project.`,
      createdAt: new Date().toISOString(),
    },
  ];

  const chat = await prisma.chatThread.create({
    data: {
      id: `chat-${Date.now().toString().slice(-5)}`,
      title: prompt.slice(0, 72),
      model,
      guideId: body.guideId || 'guide-101',
      messagesJson: JSON.stringify(messages),
      organizationId: user.organizationId,
      createdById: user.id,
    },
  });

  return NextResponse.json({ chat });
}
