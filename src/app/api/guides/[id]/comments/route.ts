import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const comments = await prisma.comment.findMany({
    where: { guideId: id },
    include: { author: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ comments });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (body.action === 'resolve' && body.commentId) {
    await prisma.comment.update({
      where: { id: body.commentId },
      data: { resolved: true },
    });
  } else if (body.content) {
    await prisma.comment.create({
      data: {
        guideId: id,
        authorId: user.id,
        timestamp: Number(body.timestamp || 0),
        content: body.content,
      },
    });
  }

  const comments = await prisma.comment.findMany({
    where: { guideId: id },
    include: { author: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ comments });
}
