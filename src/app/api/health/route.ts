import { NextResponse } from 'next/server';
import { accountAdmissionMode } from '@/lib/account-admission';
import { getAiConfig } from '@/lib/ai';

export async function GET() {
  const ai = getAiConfig();
  const speechConfigured = Boolean(
    process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION
  );

  return NextResponse.json({
    status: 'ok',
    service: 'clueso-studio',
    timestamp: new Date().toISOString(),
    admissionMode: accountAdmissionMode(),
    ai: {
      provider: ai.provider,
      deployment: ai.deployment,
      configured: ai.isAzureConfigured,
    },
    speech: {
      provider: speechConfigured ? 'azure' : 'browser',
      region: process.env.AZURE_SPEECH_REGION || 'japaneast',
      defaultVoice: process.env.AZURE_SPEECH_VOICE || 'en-US-AndrewMultilingualNeural',
      configured: speechConfigured,
    },
  });
}
