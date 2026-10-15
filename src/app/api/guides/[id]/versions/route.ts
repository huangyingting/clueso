import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const versions = await prisma.guideVersion.findMany({
    where: { guideId: id },
    orderBy: { versionNumber: 'desc' },
  });
  return NextResponse.json({ versions });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getActiveUserAndOrg();
  const body = await req.json();

  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  if (body.action === 'restore' && body.versionId) {
    const ver = await prisma.guideVersion.findUnique({ where: { id: body.versionId } });
    if (!ver) return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    const updated = await prisma.guide.update({
      where: { id },
      data: {
        guideDataJson: ver.guideDataJson,
        updateId: guide.updateId + 1,
      },
    });
    return NextResponse.json({
      guide: updated,
      guideData: JSON.parse(ver.guideDataJson),
    });
  }

  const latest = await prisma.guideVersion.findFirst({
    where: { guideId: id },
    orderBy: { versionNumber: 'desc' },
  });
  const nextNum = (latest?.versionNumber || 5) + 1;

  const created = await prisma.guideVersion.create({
    data: {
      guideId: id,
      versionNumber: nextNum,
      name: body.name || body.label || `Saved v${nextNum} — Manual Checkpoint`,
      guideDataJson: guide.guideDataJson,
      authorName: user?.name || 'Alex Rivera',
    },
  });

  const versions = await prisma.guideVersion.findMany({
    where: { guideId: id },
    orderBy: { versionNumber: 'desc' },
  });

  return NextResponse.json({ version: created, versions });
}
