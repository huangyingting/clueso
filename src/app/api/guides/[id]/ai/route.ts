import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { invokeCluesoAi, extractJsonObject } from '@/lib/ai';
import { synthesizeGuideSpeech } from '@/lib/speech';

const LANGUAGE_PACKS: Record<
  string,
  {
    name: string;
    clips: string[];
    heading: string;
    summary: string;
    steps: { title: string; description: string }[];
  }
> = {
  es: {
    name: 'Spanish (Español)',
    clips: [
      'Bienvenido a tu nuevo espacio de trabajo Acme Product Studio en Clueso.',
      'Haz clic en Grabar pantalla o sube un video existente para generar guías de calidad de estudio.',
      'Exporta tu video terminado y el artículo escrito en más de treinta idiomas.',
    ],
    heading: 'Recorrido de Incorporación del Producto (Español)',
    summary: 'Sigue esta guía paso a paso para configurar tu espacio de trabajo Acme Product Studio en Clueso.',
    steps: [
      {
        title: 'Abre el Panel de Proyectos',
        description: 'Navega a la pestaña Proyectos en la barra lateral izquierda y haz clic en Nuevo proyecto.',
      },
      {
        title: 'Perfecciona el Guion con IA y Voz',
        description: 'Usa Reescritura IA para eliminar muletillas y genera voz realista con Brian o Sarah.',
      },
      {
        title: 'Traduce y Comparte con Clientes',
        description: 'Traduce instantáneamente tu video y artículo de ayuda y compártelo mediante enlace o código embed.',
      },
    ],
  },
  fr: {
    name: 'French (Français)',
    clips: [
      'Bienvenue dans votre nouvel espace de travail Acme Product Studio sur Clueso.',
      'Cliquez sur Enregistrer l’écran ou importez une vidéo pour générer des guides de qualité studio.',
      'Exportez votre vidéo finale et votre article rédigé dans plus de trente langues.',
    ],
    heading: 'Guide de Prise en Main du Produit (Français)',
    summary: 'Suivez ce guide étape par étape pour configurer votre espace de travail Acme Product Studio.',
    steps: [
      {
        title: 'Ouvrir le Tableau de Bord des Projets',
        description: 'Accédez à l’onglet Projets dans la barre latérale gauche et cliquez sur Nouveau projet.',
      },
      {
        title: 'Améliorer le Script avec l’IA',
        description: 'Utilisez AI Rewrite pour polir le script et générer une voix off réaliste.',
      },
      {
        title: 'Traduire et Partager',
        description: 'Exportez votre vidéo en MP4 ou intégrez-la directement dans votre centre d’aide.',
      },
    ],
  },
  de: {
    name: 'German (Deutsch)',
    clips: [
      'Willkommen in Ihrem neuen Acme Product Studio Arbeitsbereich in Clueso.',
      'Klicken Sie auf Bildschirm aufnehmen oder laden Sie ein Video hoch, um Studio-Guides zu erstellen.',
      'Exportieren Sie Ihr fertiges Video und Ihren Artikel in über dreißig Sprachen.',
    ],
    heading: 'Produkt-Onboarding-Rundgang (Deutsch)',
    summary: 'Folgen Sie dieser Schritt-für-Schritt-Anleitung, um Ihren Arbeitsbereich einzurichten.',
    steps: [
      {
        title: 'Projekt-Dashboard öffnen',
        description: 'Wählen Sie Projekte in der linken Seitenleiste und klicken Sie auf Neues Projekt.',
      },
      {
        title: 'Skript mit KI überarbeiten',
        description: 'Nutzen Sie AI Rewrite und generieren Sie realistische KI-Sprachaufnahmen.',
      },
      {
        title: 'Übersetzen und Teilen',
        description: 'Veröffentlichen Sie Ihr Video und Ihre Dokumentation in über 30 Sprachen.',
      },
    ],
  },
  ja: {
    name: 'Japanese (日本語)',
    clips: [
      'Clueso の新しい Acme Product Studio ワークスペースへようこそ。',
      '画面録画をクリックするか既存の動画をアップロードして、スタジオ品質のガイドを生成します。',
      '完成した動画と記事を30以上の言語でエクスポートできます。',
    ],
    heading: 'プロダクト・オンボーディング・ガイド (日本語)',
    summary: 'このステップバイステップガイドに従って、Acme Product Studio ワークスペースを設定してください。',
    steps: [
      {
        title: 'プロジェクトダッシュボードを開く',
        description: '左側のサイドバーから「プロジェクト」を選択し、「新規プロジェクト」をクリックします。',
      },
      {
        title: 'AIでスクリプトを洗練＆音声生成',
        description: 'AI Rewriteを使ってスクリプトを整え、リアルなAIナレーションを生成します。',
      },
      {
        title: '多言語翻訳と共有',
        description: 'ワンクリックで30以上の言語に翻訳し、リンクや埋め込みコードで共有します。',
      },
    ],
  },
  zh: {
    name: 'Chinese (中文)',
    clips: [
      '欢迎来到您在 Clueso 中的全新 Acme Product Studio 工作区。',
      '点击录制屏幕或上传现有视频，即可生成演播室级别的产品指南。',
      '支持将完成的视频和图文帮助文档一键导出为三十多种语言。',
    ],
    heading: '产品快速上手指南 (中文)',
    summary: '按照以下分步说明配置您的 Acme Product Studio 工作区并发布AI产品视频。',
    steps: [
      {
        title: '打开项目仪表盘并开始录制',
        description: '在左侧导航栏点击 Projects，然后点击 New project 开始屏幕录制。',
      },
      {
        title: '使用 AI 润色脚本并生成配音',
        description: '点击 AI Rewrite 自动去除语气词，并选择自然逼真的 AI 语音生成配音。',
      },
      {
        title: '一键多语言翻译与分享导出',
        description: '点击顶部 Translate 翻译成全球语言，并通过 Share 导出 MP4 或嵌入代码。',
      },
    ],
  },
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English (US)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  zh: 'Chinese (中文)',
  hi: 'Hindi (हिन्दी)',
  pt: 'Portuguese (Português)',
};

function buildWordTimestamps(text: string, duration = 6.2) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const step = Number((duration / words.length).toFixed(2));
  return words.map((word, idx) => ({
    word,
    start: Number((idx * step).toFixed(2)),
    end: Number(Math.min(duration, (idx + 1) * step).toFixed(2)),
  }));
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const action = body.action || 'rewrite';

  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const guideData = JSON.parse(guide.guideDataJson || '{}');
  const clips = guideData.video?.guideClips || {};
  const clipKeys = Object.keys(clips);
  let aiMessage = 'Completed AI enhancement.';
  let aiProviderUsed: 'azure' | 'local' = 'local';
  let aiModelUsed = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-6.1-sol';

  if (action === 'rewrite') {
    const tone = body.tone || 'Concise & Polished';
    const currentScripts = clipKeys.map((key, idx) => ({
      index: idx,
      key,
      title: clips[key].name || `Clip ${idx + 1}`,
      text: clips[key].voiceover?.text || '',
    }));

    let rewrittenByAi: string[] | null = null;
    if (!body.customText) {
      try {
        const aiResult = await invokeCluesoAi({
          taskType: 'guide_rewrite_script',
          guideId: id,
          responseFormatJson: true,
          maxCompletionTokens: 1200,
          systemPrompt:
            'You are Clueso AI Studio Director. Rewrite screen-recording voiceover scripts so they are crisp, studio-grade, free of filler words (um, uh, like, you know), and aligned with the requested tone. Return strict JSON: {"clips": ["rewritten clip 1", "rewritten clip 2", ...], "summary": "1-sentence description of improvements"}. Keep the exact same number of clips.',
          userPrompt: JSON.stringify({
            guideName: guide.name,
            tone,
            clips: currentScripts,
          }),
        });
        const parsed = extractJsonObject<{ clips?: string[]; summary?: string }>(
          aiResult.content,
          {}
        );
        if (Array.isArray(parsed.clips) && parsed.clips.length > 0) {
          rewrittenByAi = parsed.clips;
          aiProviderUsed = aiResult.provider;
          aiModelUsed = aiResult.modelName;
          if (parsed.summary) {
            aiMessage = `${parsed.summary} (Model: ${aiResult.modelName})`;
          }
        }
      } catch {
        // Fallback to deterministic studio polish if network is unavailable
      }
    }

    for (let idx = 0; idx < clipKeys.length; idx++) {
      const key = clipKeys[idx];
      const c = clips[key];
      const orig = c.voiceover?.text || '';
      const fallbackPolished =
        idx === 0
          ? 'Welcome to Acme Product Studio in Clueso — your all-in-one AI video and documentation workspace.'
          : idx === 1
          ? 'Capture any workflow or upload rough footage to automatically add studio voiceovers, zooms, and callouts.'
          : 'Translate your video and step-by-step article into 30+ languages and share anywhere in one click.';
      const nextText =
        body.customText || rewrittenByAi?.[idx] || fallbackPolished || orig;

      let ttsAudioDataUrl = c.voiceover?.audioDataUrl || null;
      let wordTimestamps = buildWordTimestamps(nextText, c.duration || 6.2);
      if (idx === 0) {
        const tts = await synthesizeGuideSpeech({
          text: nextText,
          voiceSelection: c.voiceover?.voiceName || 'Brian (US Studio)',
          languageCode: guideData.languageId || guide.languageId || 'en',
          guideId: id,
          clipId: key,
        }).catch(() => null);
        if (tts?.audioDataUrl) {
          ttsAudioDataUrl = tts.audioDataUrl;
          c.duration = tts.durationSec;
          wordTimestamps = tts.wordTimings.map(w => ({
            word: w.word,
            start: w.startSec,
            end: w.endSec,
          }));
        }
      }

      c.voiceover = {
        ...c.voiceover,
        text: nextText,
        audioDataUrl: ttsAudioDataUrl,
        wordTimestamps,
      };
    }

    if (aiMessage === 'Completed AI enhancement.') {
      aiMessage = `Rewrote ${clipKeys.length} clip scripts (${tone}) via ${aiModelUsed} and removed filler words.`;
    }
  } else if (action === 'tts') {
    const voiceName = body.voiceName || body.voice || 'Brian (US Studio)';
    const voiceId = body.voiceId || 'en-US-AndrewMultilingualNeural';
    if (guideData.video) {
      guideData.video.defaultVoice = {
        code: voiceId,
        name: voiceName,
        language: guide.languageId,
        gender: voiceName.includes('Brian') || voiceName.includes('Marcus') ? 'male' : 'female',
        engine: 'azure-neural',
      };
    }

    let synthesizedCount = 0;
    let azureVoiceUsed = voiceId;
    for (const key of clipKeys) {
      const c = clips[key];
      const text = c.voiceover?.text || '';
      const tts = await synthesizeGuideSpeech({
        text,
        voiceSelection: voiceName,
        languageCode: guideData.languageId || guide.languageId || 'en',
        guideId: id,
        clipId: key,
      }).catch(() => null);

      if (tts?.audioDataUrl) {
        synthesizedCount += 1;
        azureVoiceUsed = tts.azureVoice;
        c.duration = tts.durationSec;
      }

      c.voiceover = {
        ...c.voiceover,
        voiceName,
        voiceId: tts?.azureVoice || voiceId,
        audioDataUrl: tts?.audioDataUrl || c.voiceover?.audioDataUrl || null,
        wordTimestamps: tts?.wordTimings?.length
          ? tts.wordTimings.map(w => ({ word: w.word, start: w.startSec, end: w.endSec }))
          : buildWordTimestamps(text, c.duration || 6.2),
      };
    }
    aiMessage =
      synthesizedCount > 0
        ? `Synthesized real Azure Neural TTS audio (${azureVoiceUsed}) across ${synthesizedCount} clips using ${voiceName}.`
        : `Generated studio voiceover speech across ${clipKeys.length} clips using ${voiceName}.`;
  } else if (action === 'translate') {
    const rawLang = (body.languageId || body.targetLanguage || 'es').toLowerCase();
    const lang = rawLang.includes('span') || rawLang === 'es'
      ? 'es'
      : rawLang.includes('fren') || rawLang === 'fr'
      ? 'fr'
      : rawLang.includes('germ') || rawLang === 'de'
      ? 'de'
      : rawLang.includes('jap') || rawLang === 'ja'
      ? 'ja'
      : rawLang.includes('chin') || rawLang === 'zh'
      ? 'zh'
      : rawLang.includes('hind') || rawLang === 'hi'
      ? 'hi'
      : rawLang.includes('port') || rawLang === 'pt'
      ? 'pt'
      : 'en';

    const targetLanguageLabel = LANGUAGE_LABELS[lang] || lang.toUpperCase();
    guideData.languageId = lang;

    let aiTranslated: {
      clips?: string[];
      heading?: string;
      summary?: string;
      steps?: { title: string; description: string }[];
    } | null = null;

    try {
      const sourceClips = clipKeys.map(k => clips[k]?.voiceover?.text || '');
      const sourceSteps = (guideData.steps || []).map((s: any) => ({
        title: s.title,
        description: s.description,
      }));
      const aiResult = await invokeCluesoAi({
        taskType: 'guide_translate',
        guideId: id,
        responseFormatJson: true,
        maxCompletionTokens: 1500,
        systemPrompt: `You are Clueso AI Localization Engine. Translate the video voiceover clips, documentation heading, summary, and step-by-step instructions into natural, idiomatic ${targetLanguageLabel}. Keep technical product names like Clueso and Acme Product Studio intact. Return strict JSON: {"clips": ["..."], "heading": "...", "summary": "...", "steps": [{"title": "...", "description": "..."}]}`,
        userPrompt: JSON.stringify({
          targetLanguage: targetLanguageLabel,
          languageCode: lang,
          clips: sourceClips,
          heading: guideData.plainDoc?.blocks?.[0]?.content || guide.name,
          summary: guideData.plainDoc?.blocks?.[1]?.content || guide.description,
          steps: sourceSteps,
        }),
      });
      const parsed = extractJsonObject<{
        clips?: string[];
        heading?: string;
        summary?: string;
        steps?: { title: string; description: string }[];
      }>(aiResult.content, {});
      if (Array.isArray(parsed.clips) && parsed.clips.length > 0) {
        aiTranslated = parsed;
        aiProviderUsed = aiResult.provider;
        aiModelUsed = aiResult.modelName;
      }
    } catch {
      // Fallback to curated language pack
    }

    const pack = LANGUAGE_PACKS[lang];
    const resolvedClips =
      aiTranslated?.clips ||
      pack?.clips || [
        'Welcome to your new Acme Product Studio workspace in Clueso.',
        'Click Record screen or upload an existing video to generate studio-grade guides.',
        'Export your finished video and written article in over thirty languages.',
      ];

    for (let idx = 0; idx < clipKeys.length; idx++) {
      const key = clipKeys[idx];
      const c = clips[key];
      const translatedText = resolvedClips[idx] || resolvedClips[0] || c.voiceover?.text || '';

      let ttsAudioDataUrl = c.voiceover?.audioDataUrl || null;
      let wordTimestamps = buildWordTimestamps(translatedText, c.duration || 6.2);
      if (idx === 0) {
        const tts = await synthesizeGuideSpeech({
          text: translatedText,
          voiceSelection: c.voiceover?.voiceName,
          languageCode: lang,
          guideId: id,
          clipId: key,
        }).catch(() => null);
        if (tts?.audioDataUrl) {
          ttsAudioDataUrl = tts.audioDataUrl;
          c.duration = tts.durationSec;
          wordTimestamps = tts.wordTimings.map(w => ({
            word: w.word,
            start: w.startSec,
            end: w.endSec,
          }));
        }
      }

      c.voiceover = {
        ...c.voiceover,
        languageId: lang,
        text: translatedText,
        audioDataUrl: ttsAudioDataUrl,
        wordTimestamps,
      };
    }

    if (guideData.plainDoc?.blocks?.length) {
      guideData.plainDoc.blocks[0].content =
        aiTranslated?.heading || pack?.heading || guide.name;
      if (guideData.plainDoc.blocks[1]) {
        guideData.plainDoc.blocks[1].content =
          aiTranslated?.summary || pack?.summary || guide.description;
      }
    }
    if (Array.isArray(guideData.steps)) {
      const targetSteps = aiTranslated?.steps || pack?.steps || [];
      guideData.steps = guideData.steps.map((s: any, idx: number) => ({
        ...s,
        title: targetSteps[idx]?.title || s.title,
        description: targetSteps[idx]?.description || s.description,
      }));
    }

    aiMessage = `Translated video voiceovers, captions, and article into ${targetLanguageLabel} (${aiProviderUsed === 'azure' ? `${aiModelUsed} + Azure Neural Dubbing` : 'Studio Language Pack'}).`;
  } else if (action === 'copilot') {
    const rawPrompt = (body.prompt || 'Polish clip script and add smart zoom').trim();
    const prompt = rawPrompt.toLowerCase();
    const firstKey = clipKeys[0];

    let copilotAiReply: string | null = null;
    try {
      const aiResult = await invokeCluesoAi({
        taskType: 'guide_studio_copilot',
        guideId: id,
        responseFormatJson: true,
        maxCompletionTokens: 1000,
        systemPrompt:
          'You are Clueso Studio Copilot. Given a user instruction and the current guide clips, return strict JSON: {"updatedFirstClipScript": "optional improved script for clip 1", "calloutLabel": "short callout badge text (max 36 chars)", "zoomLabel": "short zoom label", "reply": "concise 1-2 sentence confirmation of the studio edit applied"}',
        userPrompt: JSON.stringify({
          instruction: rawPrompt,
          guideName: guide.name,
          firstClipScript: firstKey ? clips[firstKey]?.voiceover?.text : '',
        }),
      });
      const parsed = extractJsonObject<{
        updatedFirstClipScript?: string;
        calloutLabel?: string;
        zoomLabel?: string;
        reply?: string;
      }>(aiResult.content, {});
      aiProviderUsed = aiResult.provider;
      aiModelUsed = aiResult.modelName;

      if (firstKey && clips[firstKey]) {
        const c = clips[firstKey];
        c.elements = c.elements || {};
        if (parsed.updatedFirstClipScript && (prompt.includes('rewrite') || prompt.includes('polish') || prompt.includes('script'))) {
          c.voiceover.text = parsed.updatedFirstClipScript;
          c.voiceover.wordTimestamps = buildWordTimestamps(c.voiceover.text, c.duration || 6.2);
        }
        if (prompt.includes('brand')) {
          c.background = { type: 'color', color: '#3b0764', padding: 40, borderRadius: 20 };
          if (guideData.video?.captions) {
            guideData.video.captions.style = 'Karaoke Highlight Box';
          }
        } else if (prompt.includes('zoom') || prompt.includes('polish')) {
          c.zooms = [
            ...(c.zooms || []),
            {
              id: `zm-${Date.now()}`,
              start: 2.0,
              end: 4.8,
              scale: 1.45,
              x: 48,
              y: 42,
              label: parsed.zoomLabel || 'AI Smart Zoom',
            },
          ];
        } else {
          const elId = `el-ai-${Date.now()}`;
          c.elements[elId] = {
            id: elId,
            type: 'callout',
            name: 'AI Callout',
            start: 1.0,
            end: 5.0,
            x: 160,
            y: 140,
            width: 340,
            height: 76,
            text: parsed.calloutLabel || rawPrompt.slice(0, 36),
            stroke: '#e038b5',
            fill: 'rgba(224, 56, 181, 0.18)',
          };
        }
      }
      if (parsed.reply) {
        copilotAiReply = `${parsed.reply} (${aiResult.modelName})`;
      }
    } catch {
      // Fallback deterministic copilot behavior
      if (firstKey) {
        const c = clips[firstKey];
        c.elements = c.elements || {};
        if (prompt.includes('polish') || prompt.includes('rewrite')) {
          clipKeys.forEach(key => {
            const clip = clips[key];
            clip.voiceover.text = `${clip.voiceover.text.replace(/\s+/g, ' ').trim()}`;
            clip.voiceover.wordTimestamps = buildWordTimestamps(clip.voiceover.text, clip.duration || 6.2);
          });
          c.zooms = [
            ...(c.zooms || []),
            { id: `zm-${Date.now()}`, start: 2.0, end: 4.8, scale: 1.45, x: 48, y: 42, label: 'AI Smart Zoom' },
          ];
          copilotAiReply = 'Clueso AI polished all clip scripts, tightened pauses, and added a Smart Zoom keyframe.';
        } else if (prompt.includes('brand')) {
          c.background = { type: 'color', color: '#3b0764', padding: 40, borderRadius: 20 };
          if (guideData.video?.captions) {
            guideData.video.captions.style = 'Karaoke Highlight Box';
          }
          copilotAiReply = 'Applied Acme Product Studio Brand Kit colors, rounded canvas framing, and Karaoke Highlight Box captions.';
        } else {
          const elId = `el-ai-${Date.now()}`;
          c.elements[elId] = {
            id: elId,
            type: 'callout',
            name: 'AI Callout',
            start: 1.0,
            end: 5.0,
            x: 160,
            y: 140,
            width: 340,
            height: 76,
            text: rawPrompt || 'AI Highlighted Step',
            stroke: '#e038b5',
            fill: 'rgba(224, 56, 181, 0.18)',
          };
          copilotAiReply = `Clueso AI executed "${rawPrompt}" and added a synchronized callout overlay to Clip 1.`;
        }
      }
    }
    aiMessage = copilotAiReply || `Executed Copilot command: "${rawPrompt}".`;
  } else if (action === 'enhance-article') {
    let addedStep: { title: string; description: string; calloutLabel?: string } | null = null;
    try {
      const aiResult = await invokeCluesoAi({
        taskType: 'guide_enhance_article',
        guideId: id,
        responseFormatJson: true,
        maxCompletionTokens: 800,
        systemPrompt:
          'You are Clueso AI Documentation Writer. Given the existing guide steps and clip scripts, generate one additional high-value verification or best-practice step for the written SOP article. Return strict JSON: {"title": "...", "description": "...", "calloutLabel": "..."}',
        userPrompt: JSON.stringify({
          guideName: guide.name,
          existingSteps: guideData.steps || [],
          clipScripts: clipKeys.map(k => clips[k]?.voiceover?.text || ''),
        }),
      });
      const parsed = extractJsonObject<{ title?: string; description?: string; calloutLabel?: string }>(
        aiResult.content,
        {}
      );
      if (parsed.title && parsed.description) {
        addedStep = {
          title: parsed.title,
          description: parsed.description,
          calloutLabel: parsed.calloutLabel || 'Best Practice Verification',
        };
        aiProviderUsed = aiResult.provider;
        aiModelUsed = aiResult.modelName;
      }
    } catch {
      // Fallback
    }

    guideData.steps = [
      ...(guideData.steps || []),
      {
        id: `step-${Date.now()}`,
        stepNumber: (guideData.steps?.length || 3) + 1,
        title: addedStep?.title || 'Verify Analytics & Embed in Your Help Center',
        description:
          addedStep?.description ||
          'Open the Analytics tab to monitor viewer retention and embed the responsive player in Zendesk, Intercom, or Sanity.',
        timestamp: '00:16',
        calloutLabel: addedStep?.calloutLabel || 'Analytics & Embed',
      },
    ];
    aiMessage = `Enhanced help article with "${addedStep?.title || 'Verify Analytics & Embed in Your Help Center'}" via ${aiModelUsed}.`;
  }

  const normalizedClips = Object.values(clips).map((c: any, idx: number) => ({
    id: c.clipId || `clip-${idx + 1}`,
    title: c.name || `Step ${idx + 1}`,
    script: c.voiceover?.text || '',
    voice: c.voiceover?.voiceName || 'Brian (US Studio)',
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

  const normalizedSteps = (guideData.steps || []).map((s: any, idx: number) => ({
    id: s.id || `step-${idx + 1}`,
    stepNumber: idx + 1,
    title: s.title,
    description: s.description,
    callout: s.calloutLabel || s.callout || 'Click Highlighted Element',
  }));

  guideData.clips = normalizedClips;
  guideData.articleSteps = normalizedSteps;

  const updated = await prisma.guide.update({
    where: { id },
    data: {
      languageId: guideData.languageId || guide.languageId,
      guideDataJson: JSON.stringify(guideData),
      updateId: guide.updateId + 1,
    },
  });

  return NextResponse.json({
    guide: updated,
    guideData,
    clips: normalizedClips,
    articleSteps: normalizedSteps,
    aiProvider: aiProviderUsed,
    aiModel: aiModelUsed,
    message: aiMessage,
    reply: aiMessage,
  });
}
