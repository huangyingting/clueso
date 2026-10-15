import { prisma } from '@/lib/prisma';

export interface AiCompletionRequest {
  taskType: string;
  systemPrompt: string;
  userPrompt: string;
  maxCompletionTokens?: number;
  responseFormatJson?: boolean;
  guideId?: string;
  userId?: string;
  timeoutMs?: number;
}

export interface AiCompletionResult {
  content: string;
  provider: 'azure' | 'local';
  modelName: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
}

export function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || 'azure').trim().toLowerCase();
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || '').trim().replace(/\/+$/, '');
  const apiKey = (process.env.AZURE_OPENAI_API_KEY || '').trim();
  const deployment = (process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-6.1-sol').trim();
  const apiVersion = (process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview').trim();
  const isAzureConfigured = Boolean(provider === 'azure' && endpoint && apiKey && deployment);

  return {
    provider: isAzureConfigured ? ('azure' as const) : ('local' as const),
    endpoint,
    apiKey,
    deployment,
    apiVersion,
    isAzureConfigured,
  };
}

export async function invokeCluesoAi(request: AiCompletionRequest): Promise<AiCompletionResult> {
  const cfg = getAiConfig();
  const startedAt = Date.now();

  if (!cfg.isAzureConfigured) {
    throw new Error('Azure OpenAI is not configured');
  }

  const url = `${cfg.endpoint}/openai/deployments/${encodeURIComponent(cfg.deployment)}/chat/completions?api-version=${encodeURIComponent(cfg.apiVersion)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? 28_000);

  try {
    const body: Record<string, unknown> = {
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      max_completion_tokens: request.maxCompletionTokens ?? 1600,
    };

    if (request.responseFormatJson) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': cfg.apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - startedAt;

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      await prisma.aiInvocation
        .create({
          data: {
            feature: request.taskType,
            provider: 'azure',
            model: cfg.deployment,
            status: 'failed',
            durationMs: latencyMs,
            guideId: request.guideId ?? null,
            userId: request.userId ?? null,
            organizationId: 'org_clueso_acme',
          },
        })
        .catch(() => null);
      throw new Error(`Azure OpenAI error (${response.status}): ${errText.slice(0, 200)}`);
    }

    const payload = (await response.json()) as {
      model?: string;
      choices?: Array<{ message?: { content?: string | null } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const content = payload.choices?.[0]?.message?.content?.trim() ?? '';
    const promptTokens = payload.usage?.prompt_tokens ?? 0;
    const completionTokens = payload.usage?.completion_tokens ?? 0;
    const modelName = payload.model || cfg.deployment;

    await prisma.aiInvocation
      .create({
        data: {
          feature: request.taskType,
          provider: 'azure',
          model: modelName,
          status: 'succeeded',
          durationMs: latencyMs,
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          guideId: request.guideId ?? null,
          userId: request.userId ?? null,
          organizationId: 'org_clueso_acme',
        },
      })
      .catch(() => null);

    return {
      content,
      provider: 'azure',
      modelName,
      latencyMs,
      promptTokens,
      completionTokens,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function extractJsonObject<T>(rawText: string, fallback: T): T {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}
