import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      createdBy: true,
      folder: true,
      versions: { orderBy: { versionNumber: 'desc' } },
      comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
      exports: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!guide) {
    guide = await prisma.guide.findFirst({
      include: {
        createdBy: true,
        folder: true,
        versions: { orderBy: { versionNumber: 'desc' } },
        comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
        exports: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const guideData = JSON.parse(guide.guideDataJson || '{}');
  const rawClips = guideData.video?.guideClips || {};
  const normalizedClips = Array.isArray(guideData.clips)
    ? guideData.clips
    : Object.values(rawClips).map((c: any, idx: number) => ({
        id: c.clipId || `clip-${idx + 1}`,
        title: c.name || `Step ${idx + 1}`,
        script: c.voiceover?.text || '',
        voice: c.voiceover?.voiceName || 'Brian',
        duration: c.duration || 6.0,
        transition: c.transition || 'Dissolve',
        screenType: idx === 0 ? 'Intro Slide' : 'Screen Recording + Zoom',
        zoomPoints: c.zooms || [],
        overlays: Object.values(c.elements || {}).map((el: any) => ({
          id: el.id,
          type: el.type,
          label: el.name || el.text || el.type,
        })),
      }));

  const normalizedSteps = Array.isArray(guideData.articleSteps)
    ? guideData.articleSteps
    : (guideData.steps || []).map((s: any, idx: number) => ({
        id: s.id || `step-${idx + 1}`,
        stepNumber: idx + 1,
        title: s.title,
        description: s.description,
        callout: s.calloutLabel || s.callout || 'Click Highlighted Element',
      }));

  return NextResponse.json({
    guide,
    guideData,
    id: guide.id,
    title: guide.name,
    aspectRatio: guide.aspectRatio,
    language: guide.languageId === 'en' ? 'English (US)' : guide.languageId,
    clips: normalizedClips,
    articleSteps: normalizedSteps,
    captionsConfig: guideData.captionsConfig || {
      enabled: true,
      preset: guideData.video?.captions?.style || 'Karaoke Highlight Box',
    },
    versions: (guide.versions || []).map(v => ({
      ...v,
      label: v.name,
    })),
    comments: (guide.comments || []).map(c => ({
      ...c,
      authorName: c.author?.name || 'Alex Rivera',
    })),
    exports: guide.exports || [],
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const currentData = JSON.parse(existing.guideDataJson || '{}');
  const nextData = body.guideData ? { ...currentData, ...body.guideData } : currentData;

  if (body.name || body.title) {
    nextData.name = body.name || body.title;
  }
  if (body.clips) {
    nextData.clips = body.clips;
  }
  if (body.articleSteps) {
    nextData.articleSteps = body.articleSteps;
  }
  if (body.captionsConfig) {
    nextData.captionsConfig = body.captionsConfig;
  }

  const updated = await prisma.guide.update({
    where: { id },
    data: {
      name: body.name ?? body.title ?? existing.name,
      description: body.description ?? existing.description,
      status: body.status ?? existing.status,
      activeFormat: body.activeFormat ?? existing.activeFormat,
      languageId: body.languageId ?? existing.languageId,
      aspectRatio: body.aspectRatio ?? existing.aspectRatio,
      folderId: body.folderId !== undefined ? body.folderId : existing.folderId,
      isDeleted: body.isDeleted !== undefined ? body.isDeleted : existing.isDeleted,
      tagsJson: body.tags ? JSON.stringify(body.tags) : existing.tagsJson,
      guideDataJson: JSON.stringify(nextData),
      updateId: existing.updateId + 1,
    },
    include: {
      createdBy: true,
      versions: { orderBy: { versionNumber: 'desc' } },
      comments: { include: { author: true } },
      exports: { orderBy: { createdAt: 'desc' } },
    },
  });

  return NextResponse.json({
    guide: updated,
    guideData: nextData,
  });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Duplicate guide
  const { id } = await context.params;
  const user = await getActiveUserAndOrg();
  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing || !user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.action === 'duplicate') {
    const newId = `guide-${Date.now().toString().slice(-5)}`;
    const parsed = JSON.parse(existing.guideDataJson || '{}');
    parsed.id = newId;
    parsed.name = `${existing.name} (Copy)`;
    const dup = await prisma.guide.create({
      data: {
        id: newId,
        name: `${existing.name} (Copy)`,
        description: existing.description,
        status: existing.status,
        activeFormat: existing.activeFormat,
        languageId: existing.languageId,
        duration: existing.duration,
        aspectRatio: existing.aspectRatio,
        tagsJson: existing.tagsJson,
        guideDataJson: JSON.stringify(parsed),
        folderId: existing.folderId,
        organizationId: existing.organizationId,
        createdById: user.id,
      },
    });
    return NextResponse.json({ guide: dup });
  }
  return NextResponse.json({ guide: existing });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.guide.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
