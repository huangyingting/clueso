import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SAMPLE_MP4 = 'https://publicassets.in.prod.clueso.io/cpr_benchmark_video_720p_24fps.mp4';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const exportsList = await prisma.guideExport.findMany({
    where: { guideId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ exports: exportsList });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  const created = await prisma.guideExport.create({
    data: {
      guideId: id,
      processType: body.processType || 'export',
      format: body.format || 'mp4',
      resolution: body.resolution || '1080p (60fps)',
      status: 'completed',
      downloadUrl: SAMPLE_MP4,
    },
  });

  const exportsList = await prisma.guideExport.findMany({
    where: { guideId: id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ exportItem: created, exports: exportsList });
}
