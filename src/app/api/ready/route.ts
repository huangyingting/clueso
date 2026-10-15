import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { accountAdmissionMode } from '@/lib/account-admission';
import { getAiConfig } from '@/lib/ai';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [guideCount, userCount, invitationCount, aiInvocationCount, speechAssetCount] =
      await Promise.all([
        prisma.guide.count(),
        prisma.user.count(),
        prisma.accountInvitation.count(),
        prisma.aiInvocation.count(),
        prisma.speechSynthesisAsset.count(),
      ]);

    const ai = getAiConfig();
    const speechConfigured = Boolean(
      process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION
    );

    return NextResponse.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        guideCount,
        userCount,
        invitationCount,
        aiInvocationCount,
        speechAssetCount,
      },
      admissionMode: accountAdmissionMode(),
      ai: {
        provider: ai.provider,
        deployment: ai.deployment,
        configured: ai.isAzureConfigured,
      },
      speech: {
        provider: speechConfigured ? 'azure' : 'browser',
        region: process.env.AZURE_SPEECH_REGION || 'japaneast',
        configured: speechConfigured,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Database readiness check failed',
      },
      { status: 503 }
    );
  }
}
