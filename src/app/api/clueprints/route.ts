import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET() {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ clueprints: [] });

  const clueprints = await prisma.clueprint.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ clueprints });
}

export async function POST(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const created = await prisma.clueprint.create({
    data: {
      name: (body.name || 'Reusable Product Clueprint').trim(),
      description: (body.description || 'Consistent intro, callout style, and voiceover pacing.').trim(),
      category: body.category || 'Workspace',
      aspectRatio: body.aspectRatio || '16:9',
      duration: Number(body.duration || 18),
      organizationId: user.organizationId,
    },
  });

  return NextResponse.json({ clueprint: created });
}
