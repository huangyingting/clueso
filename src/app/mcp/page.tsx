import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Cpu, Terminal, ArrowRight } from 'lucide-react';

export default function McpMarketingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
          <Cpu className="h-4 w-4" /> Model Context Protocol
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Make videos and docs with ChatGPT, Claude, Cursor & Gemini
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          Clueso’s MCP connects your favorite AI coding and chat agents directly to our studio video engine (`https://connect.clueso.io/mcp`).
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-slate-950 p-6 text-left font-mono text-xs text-emerald-400 shadow-xl">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Terminal className="h-4 w-4" /> Connect Claude Code / Cursor in 1 command:
          </div>
          <code>claude mcp add --transport http clueso https://connect.clueso.io/mcp</code>
        </div>

        <div className="mt-8">
          <Link
            href="/home/mcp"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e038b5] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Open Workspace MCP Hub <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
