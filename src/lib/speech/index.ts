import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export interface WordTiming {
  word: string;
  startSec: number;
  endSec: number;
}

export interface SpeechSynthesisResult {
  provider: 'azure' | 'browser';
  voiceName: string;
  azureVoice: string;
  language: string;
  audioDataUrl: string | null;
  durationSec: number;
  wordTimings: WordTiming[];
  cached: boolean;
}

const VOICE_MAP: Record<string, { voice: string; lang: string }> = {
  'Brian (US Studio)': { voice: 'en-US-AndrewMultilingualNeural', lang: 'en-US' },
  'Sarah (US Warm)': { voice: 'en-US-AvaMultilingualNeural', lang: 'en-US' },
  'Lily (UK Crisp)': { voice: 'en-GB-SoniaNeural', lang: 'en-GB' },
  en: { voice: 'en-US-AndrewMultilingualNeural', lang: 'en-US' },
  es: { voice: 'es-ES-ElviraNeural', lang: 'es-ES' },
  de: { voice: 'de-DE-KatjaNeural', lang: 'de-DE' },
  fr: { voice: 'fr-FR-DeniseNeural', lang: 'fr-FR' },
  ja: { voice: 'ja-JP-NanamiNeural', lang: 'ja-JP' },
  hi: { voice: 'hi-IN-SwaraNeural', lang: 'hi-IN' },
  pt: { voice: 'pt-BR-FranciscaNeural', lang: 'pt-BR' },
  zh: { voice: 'zh-CN-XiaoxiaoNeural', lang: 'zh-CN' },
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function resolveAzureVoice(voiceSelection?: string, languageCode?: string) {
  if (languageCode && languageCode !== 'en' && VOICE_MAP[languageCode]) {
    return VOICE_MAP[languageCode];
  }
  if (voiceSelection && VOICE_MAP[voiceSelection]) {
    return VOICE_MAP[voiceSelection];
  }
  const envVoice = (process.env.AZURE_SPEECH_VOICE || 'en-US-AndrewMultilingualNeural').trim();
  return { voice: envVoice, lang: 'en-US' };
}

export function computeWordTimings(text: string, totalDurationSec: number): WordTiming[] {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return [];

  const weights = words.map(w => Math.max(2, w.replace(/[^a-zA-Z0-9\u00C0-\u024F\u4E00-\u9FFF]/g, '').length));
  const totalWeight = weights.reduce((acc, n) => acc + n, 0) || 1;
  let cursor = 0;

  return words.map((word, idx) => {
    const slice = (weights[idx] / totalWeight) * totalDurationSec;
    const startSec = Number(cursor.toFixed(2));
    cursor += slice;
    const endSec = Number(Math.min(totalDurationSec, cursor).toFixed(2));
    return { word, startSec, endSec };
  });
}

export async function synthesizeGuideSpeech(input: {
  text: string;
  voiceSelection?: string;
  languageCode?: string;
  guideId?: string;
  clipId?: string;
}): Promise<SpeechSynthesisResult> {
  const cleanText = input.text.trim();
  const { voice: azureVoice, lang } = resolveAzureVoice(input.voiceSelection, input.languageCode);
  const displayVoice = input.voiceSelection || azureVoice;

  if (!cleanText) {
    return {
      provider: 'browser',
      voiceName: displayVoice,
      azureVoice,
      language: lang,
      audioDataUrl: null,
      durationSec: 2,
      wordTimings: [],
      cached: false,
    };
  }

  const cacheKey = createHash('sha256')
    .update(`${azureVoice}|${lang}|${cleanText}`)
    .digest('hex');

  const existing = await prisma.speechSynthesisAsset
    .findUnique({ where: { cacheKey } })
    .catch(() => null);

  if (existing && existing.audioBase64) {
    const durationSec = Number((existing.durationMs / 1000).toFixed(1)) || 4.0;
    let wordTimings: WordTiming[] = [];
    try {
      wordTimings = JSON.parse(existing.wordsJson) as WordTiming[];
    } catch {
      wordTimings = computeWordTimings(cleanText, durationSec);
    }
    return {
      provider: 'azure',
      voiceName: displayVoice,
      azureVoice: existing.voiceName,
      language: existing.language,
      audioDataUrl: `data:${existing.mimeType || 'audio/mpeg'};base64,${existing.audioBase64}`,
      durationSec,
      wordTimings,
      cached: true,
    };
  }

  const key = (process.env.AZURE_SPEECH_KEY || '').trim();
  const region = (process.env.AZURE_SPEECH_REGION || '').trim();
  const format = (process.env.AZURE_SPEECH_OUTPUT_FORMAT || 'audio-24khz-96kbitrate-mono-mp3').trim();

  if (!key || !region) {
    const fallbackDuration = Math.max(3, Number((cleanText.split(/\s+/).length * 0.42).toFixed(1)));
    return {
      provider: 'browser',
      voiceName: displayVoice,
      azureVoice,
      language: lang,
      audioDataUrl: null,
      durationSec: fallbackDuration,
      wordTimings: computeWordTimings(cleanText, fallbackDuration),
      cached: false,
    };
  }

  const ssml = `<speak version='1.0' xml:lang='${lang}'><voice xml:lang='${lang}' name='${escapeXml(azureVoice)}'>${escapeXml(cleanText)}</voice></speak>`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 22_000);

  try {
    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': format,
          'User-Agent': 'CluesoStudio',
        },
        body: ssml,
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Azure Speech returned ${response.status}`);
    }

    const arrayBuf = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const base64Audio = buffer.toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // 96 kbps mono mp3 = 12,000 bytes per second
    const estimatedSec = Math.max(1.5, Number((buffer.byteLength / 12000).toFixed(1)));
    const durationMs = Math.round(estimatedSec * 1000);
    const wordTimings = computeWordTimings(cleanText, estimatedSec);

    await prisma.speechSynthesisAsset
      .upsert({
        where: { cacheKey },
        update: {
          audioBase64: base64Audio,
          durationMs,
          wordsJson: JSON.stringify(wordTimings),
        },
        create: {
          cacheKey,
          guideId: input.guideId ?? null,
          clipId: input.clipId ?? null,
          voiceName: azureVoice,
          language: lang,
          text: cleanText,
          mimeType: 'audio/mpeg',
          audioBase64: base64Audio,
          durationMs,
          wordsJson: JSON.stringify(wordTimings),
          provider: 'azure',
        },
      })
      .catch(() => null);

    return {
      provider: 'azure',
      voiceName: displayVoice,
      azureVoice,
      language: lang,
      audioDataUrl,
      durationSec: estimatedSec,
      wordTimings,
      cached: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}
