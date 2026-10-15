import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  if (action === 'rewrite') {
    const tone = body.tone || 'Concise & Polished';
    clipKeys.forEach((key, idx) => {
      const c = clips[key];
      const orig = c.voiceover?.text || '';
      const polished =
        idx === 0
          ? 'Welcome to Acme Product Studio in Clueso — your all-in-one AI video and documentation workspace.'
          : idx === 1
          ? 'Capture any workflow or upload rough footage to automatically add studio voiceovers, zooms, and callouts.'
          : 'Translate your video and step-by-step article into 30+ languages and share anywhere in one click.';
      const nextText = body.customText || polished || orig;
      c.voiceover = {
        ...c.voiceover,
        text: nextText,
        wordTimestamps: buildWordTimestamps(nextText, c.duration || 6.2),
      };
    });
    aiMessage = `Rewrote ${clipKeys.length} clip scripts (${tone}) and removed filler words.`;
  } else if (action === 'tts') {
    const voiceName = body.voiceName || body.voice || 'Brian';
    const voiceId = body.voiceId || 'nPczCjzI2devNBz1zQrb';
    if (guideData.video) {
      guideData.video.defaultVoice = {
        code: voiceId,
        name: voiceName,
        language: guide.languageId,
        gender: voiceName === 'Brian' || voiceName === 'Marcus' ? 'male' : 'female',
        engine: 'eleven',
      };
    }
    clipKeys.forEach(key => {
      const c = clips[key];
      const text = c.voiceover?.text || '';
      c.voiceover = {
        ...c.voiceover,
        voiceName,
        voiceId,
        wordTimestamps: buildWordTimestamps(text, c.duration || 6.2),
      };
    });
    aiMessage = `Generated studio voiceover speech across ${clipKeys.length} clips using ${voiceName} (ElevenLabs).`;
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
      : 'en';
    const pack = LANGUAGE_PACKS[lang];
    guideData.languageId = lang;
    if (pack) {
      clipKeys.forEach((key, idx) => {
        const c = clips[key];
        const translatedText = pack.clips[idx] || pack.clips[0];
        c.voiceover = {
          ...c.voiceover,
          languageId: lang,
          text: translatedText,
          wordTimestamps: buildWordTimestamps(translatedText, c.duration || 6.2),
        };
      });
      if (guideData.plainDoc?.blocks?.length) {
        guideData.plainDoc.blocks[0].content = pack.heading;
        if (guideData.plainDoc.blocks[1]) {
          guideData.plainDoc.blocks[1].content = pack.summary;
        }
      }
      if (Array.isArray(guideData.steps)) {
        guideData.steps = guideData.steps.map((s: any, idx: number) => ({
          ...s,
          title: pack.steps[idx]?.title || s.title,
          description: pack.steps[idx]?.description || s.description,
        }));
      }
      aiMessage = `Translated video voiceovers, captions, and article into ${pack.name}.`;
    } else {
      // Reset to English
      const enClips = [
        'Welcome to your new Acme Product Studio workspace in Clueso.',
        'Click Record screen or upload an existing video to generate studio-grade guides.',
        'Export your finished video and written article in over thirty languages.',
      ];
      clipKeys.forEach((key, idx) => {
        const c = clips[key];
        const text = enClips[idx] || c.voiceover?.text || '';
        c.voiceover = {
          ...c.voiceover,
          languageId: 'en',
          text,
          wordTimestamps: buildWordTimestamps(text, c.duration || 6.2),
        };
      });
      aiMessage = 'Switched project language to English (US).';
    }
  } else if (action === 'copilot') {
    const prompt = (body.prompt || '').toLowerCase();
    const firstKey = clipKeys[0];
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
        aiMessage = 'Clueso AI (Opus 5.5) polished all clip scripts, tightened pauses, and added a Smart Zoom keyframe.';
      } else if (prompt.includes('brand')) {
        c.background = { type: 'color', color: '#3b0764', padding: 40, borderRadius: 20 };
        if (guideData.video?.captions) {
          guideData.video.captions.style = 'Karaoke Highlight Box';
        }
        aiMessage = 'Applied Acme Product Studio Brand Kit colors, rounded canvas framing, and Karaoke Highlight Box captions.';
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
          text: body.prompt || 'AI Highlighted Step',
          stroke: '#e038b5',
          fill: 'rgba(224, 56, 181, 0.18)',
        };
        aiMessage = `Clueso AI executed "${body.prompt}" and added a synchronized callout overlay to Clip 1.`;
      }
    }
  } else if (action === 'enhance-article') {
    guideData.steps = [
      ...(guideData.steps || []),
      {
        id: `step-${Date.now()}`,
        stepNumber: (guideData.steps?.length || 3) + 1,
        title: 'Verify Analytics & Embed in Your Help Center',
        description: 'Open the Analytics tab to monitor viewer retention and embed the responsive player in Zendesk, Intercom, or Sanity.',
        timestamp: '00:16',
        calloutLabel: 'Analytics & Embed',
      },
    ];
    aiMessage = 'Enhanced help article with an additional verification step and callout summary.';
  }

  const normalizedClips = Object.values(clips).map((c: any, idx: number) => ({
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
    message: aiMessage,
    reply: aiMessage,
  });
}
