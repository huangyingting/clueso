import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({
    server: 'clueso-mcp-server',
    version: '2.4.0',
    status: 'connected',
    endpoint: 'https://connect.clueso.io/mcp',
    tools: [
      { name: 'list_guides', description: 'List all video guides and articles in the active Clueso workspace' },
      { name: 'create_guide', description: 'Create a new Clueso video and step-by-step article from a prompt or recording' },
      { name: 'rewrite_script', description: 'Polish voiceover script and remove filler words using Clueso AI' },
      { name: 'translate_guide', description: 'Dub video and translate article into 30+ languages' },
      { name: 'export_video', description: 'Render 1080p MP4 export or generate responsive embed code' },
    ],
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tool = body.tool || body.method || 'list_guides';
  const guides = await prisma.guide.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, status: true, languageId: true, duration: true },
  });

  return NextResponse.json({
    jsonrpc: '2.0',
    id: body.id || 1,
    result: {
      executedTool: tool,
      timestamp: new Date().toISOString(),
      workspace: 'Acme Product Studio',
      guides,
      summary: `Executed Clueso MCP tool "${tool}" across ${guides.length} active projects.`,
    },
  });
}
