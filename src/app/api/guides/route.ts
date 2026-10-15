import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';
import { buildDefaultGuideData } from '../../../../prisma/seed';
import { invokeCluesoAi, extractJsonObject } from '@/lib/ai';
import { synthesizeGuideSpeech } from '@/lib/speech';

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
  const guideData: any = buildDefaultGuideData(customId, name, description);

  if (body.prompt || body.source?.toLowerCase().includes('ai')) {
    const promptInput = (body.prompt || name).trim();
    try {
      const aiResult = await invokeCluesoAi({
        taskType: 'guide_create_from_prompt',
        userId: user.id,
        responseFormatJson: true,
        maxCompletionTokens: 1400,
        systemPrompt:
          'You are Clueso AI Video & Documentation Architect. Given a user workflow prompt, generate a 3-clip studio video script and a 3-step written SOP article. Return strict JSON: {"clips": [{"title": "...", "script": "..."}, {"title": "...", "script": "..."}, {"title": "...", "script": "..."}], "summary": "...", "steps": [{"title": "...", "description": "...", "calloutLabel": "..."}, {"title": "...", "description": "...", "calloutLabel": "..."}, {"title": "...", "description": "...", "calloutLabel": "..."}]}',
        userPrompt: JSON.stringify({
          prompt: promptInput,
          guideTitle: name,
          model: body.model || 'gpt-6.1-sol',
        }),
      });
      const parsed = extractJsonObject<{
        clips?: { title: string; script: string }[];
        summary?: string;
        steps?: { title: string; description: string; calloutLabel?: string }[];
      }>(aiResult.content, {});

      const clipKeys = Object.keys(guideData.video.guideClips);
      if (Array.isArray(parsed.clips) && parsed.clips.length > 0) {
        clipKeys.forEach((key, idx) => {
          const item = parsed.clips?.[idx];
          if (item) {
            guideData.video.guideClips[key].name = item.title || guideData.video.guideClips[key].name;
            guideData.video.guideClips[key].voiceover.text = item.script || guideData.video.guideClips[key].voiceover.text;
          }
        });
      } else {
        guideData.video.guideClips['clip-1'].voiceover.text = `Welcome! In this guide we will cover: ${promptInput}.`;
      }

      if (parsed.summary && guideData.plainDoc?.blocks?.[1]) {
        guideData.plainDoc.blocks[1].content = parsed.summary;
      }
      if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        guideData.steps = guideData.steps.map((s: any, idx: number) => ({
          ...s,
          title: parsed.steps?.[idx]?.title || s.title,
          description: parsed.steps?.[idx]?.description || s.description,
          calloutLabel: parsed.steps?.[idx]?.calloutLabel || s.calloutLabel,
        }));
      }

      const firstClipText = guideData.video.guideClips['clip-1']?.voiceover?.text;
      if (firstClipText) {
        const tts = await synthesizeGuideSpeech({
          text: firstClipText,
          voiceSelection: 'Brian (US Studio)',
          languageCode: body.languageId || 'en',
          guideId: customId,
          clipId: 'clip-1',
        }).catch(() => null);
        if (tts?.audioDataUrl) {
          guideData.video.guideClips['clip-1'].voiceover.audioDataUrl = tts.audioDataUrl;
          guideData.video.guideClips['clip-1'].duration = tts.durationSec;
        }
      }
    } catch {
      guideData.video.guideClips['clip-1'].voiceover.text = `Welcome! In this guide we will cover: ${promptInput}.`;
      guideData.plainDoc.blocks[1].content = `AI-generated guide for prompt: "${promptInput}" using ${body.model || 'gpt-6.1-sol'}.`;
    }
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
