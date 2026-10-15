import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET() {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    include: {
      users: { orderBy: { createdAt: 'asc' } },
      pronunciations: { orderBy: { createdAt: 'desc' } },
      transcriptionWords: { orderBy: { createdAt: 'desc' } },
      translationGlossary: { orderBy: { createdAt: 'desc' } },
    },
  });

  return NextResponse.json({
    user,
    organization: org,
    brandKit: JSON.parse(org?.brandKitJson || '{}'),
    videoDefaults: JSON.parse(org?.videoDefaultsJson || '{}'),
    playerConfig: JSON.parse(org?.playerConfigJson || '{}'),
    viewOnlyConfig: JSON.parse(org?.viewOnlyConfigJson || '{}'),
    integrations: JSON.parse(org?.integrationsJson || '{}'),
    providers: JSON.parse(org?.providersJson || '{}'),
  });
}

export async function PATCH(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const org = await prisma.organization.findUnique({ where: { id: user.organizationId } });
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

  if (body.action === 'invite-user' && body.email) {
    const invited = await prisma.user.upsert({
      where: { email: body.email.toLowerCase().trim() },
      update: { role: body.role || 'Editor' },
      create: {
        email: body.email.toLowerCase().trim(),
        name: body.name || body.email.split('@')[0],
        role: body.role || 'Editor',
        status: 'pending',
        organizationId: org.id,
      },
    });
    return NextResponse.json({ invited });
  }

  if (body.action === 'update-user-role' && body.userId) {
    const updatedUser = await prisma.user.update({
      where: { id: body.userId },
      data: { role: body.role },
    });
    return NextResponse.json({ user: updatedUser });
  }

  if (body.action === 'update-profile') {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: body.name || user.name },
    });
    return NextResponse.json({ user: updatedUser });
  }

  if (body.action === 'add-pronunciation') {
    const rule = await prisma.pronunciationRule.create({
      data: {
        word: body.word,
        phonetic: body.phonetic,
        language: body.language || 'English (US)',
        organizationId: org.id,
      },
    });
    return NextResponse.json({ rule });
  }

  if (body.action === 'delete-pronunciation' && body.id) {
    await prisma.pronunciationRule.delete({ where: { id: body.id } }).catch(() => null);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'add-keyword') {
    const kw = await prisma.transcriptionKeyword.create({
      data: {
        keyword: body.keyword,
        category: body.category || 'Brand',
        organizationId: org.id,
      },
    });
    return NextResponse.json({ keyword: kw });
  }

  if (body.action === 'delete-keyword' && body.id) {
    await prisma.transcriptionKeyword.delete({ where: { id: body.id } }).catch(() => null);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'add-translation-term') {
    const term = await prisma.translationTerm.create({
      data: {
        term: body.term,
        doNotTranslate: body.doNotTranslate ?? true,
        organizationId: org.id,
      },
    });
    return NextResponse.json({ term });
  }

  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.domain !== undefined) updateData.domain = body.domain;
  if (body.openDoor !== undefined) updateData.openDoor = Boolean(body.openDoor);
  if (body.mcpConnected !== undefined) updateData.mcpConnected = Boolean(body.mcpConnected);
  if (body.brandKit) {
    const curr = JSON.parse(org.brandKitJson || '{}');
    updateData.brandKitJson = JSON.stringify({ ...curr, ...body.brandKit });
  }
  if (body.videoDefaults) {
    const curr = JSON.parse(org.videoDefaultsJson || '{}');
    updateData.videoDefaultsJson = JSON.stringify({ ...curr, ...body.videoDefaults });
  }
  if (body.playerConfig) {
    const curr = JSON.parse(org.playerConfigJson || '{}');
    updateData.playerConfigJson = JSON.stringify({ ...curr, ...body.playerConfig });
  }
  if (body.viewOnlyConfig) {
    const curr = JSON.parse(org.viewOnlyConfigJson || '{}');
    updateData.viewOnlyConfigJson = JSON.stringify({ ...curr, ...body.viewOnlyConfig });
  }
  if (body.integrations) {
    const curr = JSON.parse(org.integrationsJson || '{}');
    updateData.integrationsJson = JSON.stringify({ ...curr, ...body.integrations });
  }
  if (body.providers) {
    const curr = JSON.parse(org.providersJson || '{}');
    updateData.providersJson = JSON.stringify({ ...curr, ...body.providers });
  }

  const updatedOrg = await prisma.organization.update({
    where: { id: org.id },
    data: updateData,
    include: {
      users: { orderBy: { createdAt: 'asc' } },
      pronunciations: { orderBy: { createdAt: 'desc' } },
      transcriptionWords: { orderBy: { createdAt: 'desc' } },
      translationGlossary: { orderBy: { createdAt: 'desc' } },
    },
  });

  return NextResponse.json({ organization: updatedOrg });
}
