import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveUserAndOrg } from '@/lib/workspace';

export async function GET() {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ folders: [] });

  const folders = await prisma.folder.findMany({
    where: { organizationId: user.organizationId, isDeleted: false },
    include: { guides: { where: { isDeleted: false }, include: { createdBy: true } } },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ folders });
}

export async function POST(req: Request) {
  const user = await getActiveUserAndOrg();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const folder = await prisma.folder.create({
    data: {
      name: (body.name || 'New Folder').trim(),
      description: (body.description || 'Collaborative project folder').trim(),
      organizationId: user.organizationId,
      createdById: user.id,
    },
  });

  return NextResponse.json({ folder });
}
