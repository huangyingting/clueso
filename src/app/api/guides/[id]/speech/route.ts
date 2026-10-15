import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { synthesizeGuideSpeech } from '@/lib/speech';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const guideData = JSON.parse(guide.guideDataJson || '{}');
  const clips = guideData.video?.guideClips || {};
  const clipKeys = Object.keys(clips);
  const targetClipKey =
    (body.clipId && clips[body.clipId] ? body.clipId : null) || clipKeys[0];

  const text =
    (typeof body.text === 'string' && body.text.trim()) ||
    (targetClipKey ? clips[targetClipKey]?.voiceover?.text : '') ||
    guide.description ||
    guide.name;

  const voiceSelection =
    body.voiceName ||
    body.voice ||
    (targetClipKey ? clips[targetClipKey]?.voiceover?.voiceName : null) ||
    'Brian (US Studio)';

  const languageCode =
    body.languageId || guideData.languageId || guide.languageId || 'en';

  const result = await synthesizeGuideSpeech({
    text,
    voiceSelection,
    languageCode,
    guideId: id,
    clipId: targetClipKey || 'clip-1',
  });

  if (targetClipKey && clips[targetClipKey] && result.audioDataUrl) {
    clips[targetClipKey].duration = result.durationSec;
    clips[targetClipKey].voiceover = {
      ...clips[targetClipKey].voiceover,
      voiceName: voiceSelection,
      voiceId: result.azureVoice,
      audioDataUrl: result.audioDataUrl,
      wordTimestamps: result.wordTimings.map(w => ({
        word: w.word,
        start: w.startSec,
        end: w.endSec,
      })),
    };

    guideData.clips = Object.values(clips).map((c: any, idx: number) => ({
      id: c.clipId || `clip-${idx + 1}`,
      title: c.name || `Step ${idx + 1}`,
      script: c.voiceover?.text || '',
      voice: c.voiceover?.voiceName || voiceSelection,
      audioDataUrl: c.voiceover?.audioDataUrl || null,
      wordTimestamps: c.voiceover?.wordTimestamps || [],
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

    await prisma.guide.update({
      where: { id },
      data: {
        guideDataJson: JSON.stringify(guideData),
        updateId: guide.updateId + 1,
      },
    });
  }

  return NextResponse.json({
    speech: result,
    clips: guideData.clips || [],
  });
}
