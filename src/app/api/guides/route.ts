import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';
import { buildDefaultGuideData } from '../../../../prisma/seed';

export async function GET(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ guides: [], folders: [] });

  const { searchParams } = new URL(req.url);
  const trash = searchParams.get('trash') === 'true';
  const folderId = searchParams.get('folderId');
  const search = (searchParams.get('q') || '').trim().toLowerCase();

  const where: any = {
    organizationId: user.organizationId,
    isDeleted: trash,
  };
  if (folderId) {
    where.folderId = folderId;
  }

  let guides = await prisma.guide.findMany({
    where,
    include: {
      createdBy: true,
      folder: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (search) {
    guides = guides.filter(
      g =>
        g.name.toLowerCase().includes(search) ||
        (g.description || '').toLowerCase().includes(search) ||
        g.tagsJson.toLowerCase().includes(search)
    );
  }

  const folders = await prisma.folder.findMany({
    where: {
      organizationId: user.organizationId,
      isDeleted: trash,
    },
    include: {
      guides: { where: { isDeleted: false } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ guides, folders });
}

export async function POST(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const name = (body.name || body.prompt || 'Untitled Product Guide').trim();
  const description = (body.description || `Created via ${body.source || 'Clueso Studio'}`).trim();
  const activeFormat = body.activeFormat || 'video';
  const folderId = body.folderId || null;
  const tags = Array.isArray(body.tags) ? body.tags : ['New Guide'];

  const customId = `guide-${Date.now().toString().slice(-5)}`;
  const guideData = buildDefaultGuideData(customId, name, description);

  if (body.prompt) {
    guideData.video.guideClips['clip-1'].voiceover.text = `Welcome! In this guide we will cover: ${body.prompt}.`;
    guideData.plainDoc.blocks[1].content = `AI-generated guide for prompt: "${body.prompt}" using ${body.model || 'Opus 5.5'}.`;
  }

  const guide = await prisma.guide.create({
    data: {
      id: customId,
      name,
      description,
      status: 'published',
      activeFormat,
      languageId: body.languageId || 'en',
      duration: 18.5,
      aspectRatio: body.aspectRatio || '16:9',
      tagsJson: JSON.stringify(tags),
      guideDataJson: JSON.stringify(guideData),
      folderId,
      organizationId: user.organizationId,
      createdById: user.id,
    },
    include: { createdBy: true },
  });

  await prisma.guideVersion.create({
    data: {
      guideId: guide.id,
      versionNumber: 1,
      name: `Initial v1 — Created via ${body.source || 'Clueso Studio'}`,
      guideDataJson: JSON.stringify(guideData),
      authorName: user.name,
    },
  });

  return NextResponse.json({ guide });
}
