'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { CheckCircle2, Copy, Terminal, Sparkles } from 'lucide-react';

const CLIENTS: Record<string, { label: string; cmd: string }> = {
  Claude: {
    label: 'Claude Desktop',
    cmd: '{"mcpServers":{"clueso":{"url":"https://connect.clueso.io/mcp"}}}',
  },
  ChatGPT: {
    label: 'ChatGPT Connectors',
    cmd: 'Add Custom MCP Action URL: https://connect.clueso.io/mcp',
  },
  'Claude Code': {
    label: 'Claude Code CLI',
    cmd: 'claude mcp add --transport http clueso https://connect.clueso.io/mcp',
  },
  Codex: {
    label: 'OpenAI Codex CLI',
    cmd: 'codex mcp add clueso https://connect.clueso.io/mcp',
  },
  Cursor: {
    label: 'Cursor IDE',
    cmd: 'Cursor Settings -> MCP -> Add Server: https://connect.clueso.io/mcp',
  },
  'Gemini CLI': {
    label: 'Gemini CLI',
    cmd: 'gemini mcp add clueso https://connect.clueso.io/mcp',
  },
  'VS Code': {
    label: 'VS Code Copilot MCP',
    cmd: 'code --add-mcp \'{"name":"clueso","url":"https://connect.clueso.io/mcp"}\'',
  },
};

const PROMPTS_TO_TRY = [
  'Turn this video into a polished product demo',
  'Generate a launch video from our brand kit',
  'Update our onboarding video for the new sidebar',
  'Make a 30s feature teaser from this recording',
  'Create a help article from this walkthrough',
  'How did our videos perform over the last 30 days?',
];

export default function McpWorkspacePage() {
  const router = useRouter();
  const [connected, setConnected] = useState(true);
  const [selectedClient, setSelectedClient] = useState('Claude Code');
  const [copied, setCopied] = useState(false);
  const [mcpResult, setMcpResult] = useState<string | null>(null);

  async function handleRunPrompt(promptText: string) {
    const res = await fetch('/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'create_guide', prompt: promptText }),
    });
    const data = await res.json();
    setMcpResult(data.result?.summary || `Executed "${promptText}" via Clueso MCP`);
  }

  return (
    <WorkspaceShell>
      <div className="max-w-4xl">
        {/* Top Status Header matching 23-home-mcp.png */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">MCP</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                connected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`}
              />
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setConnected(v => !v)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {connected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Hero Banner */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900">
            Make videos and docs with ChatGPT, Claude, Gemini
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Clueso&apos;s MCP connects your favorite AI agents to a video creation engine. Just describe what you need — every output stays fully editable, by you or AI.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Connection URL</div>
              <code className="text-xs font-semibold text-slate-800">
                https://connect.clueso.io/mcp
              </code>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText('https://connect.clueso.io/mcp');
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>

          {/* Where to connect */}
          <div className="mt-6">
            <div className="text-xs font-bold text-slate-700">Where to connect</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {Object.keys(CLIENTS).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedClient(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedClient === key
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 font-mono text-xs text-emerald-400">
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                {CLIENTS[selectedClient].cmd}
              </span>
            </div>
          </div>
        </div>

        {/* What your agent can do */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What your agent can do
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Create & edit videos', desc: 'Generate polished product demos with voiceover and zooms' },
              { title: 'Create & edit articles', desc: 'Turn recordings into step-by-step SOPs with screenshots' },
              { title: 'Brand kits', desc: 'Apply workspace colors, fonts, and Clueprints automatically' },
              { title: 'Analytics', desc: 'Query viewer retention, play counts, and completion rates' },
              { title: 'Templates', desc: 'Assemble videos using saved intros, outros, and transitions' },
              { title: 'Publish & export', desc: 'Render 1080p MP4s, share links, and iframe embeds' },
            ].map(cap => (
              <div key={cap.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-900">{cap.title}</div>
                <div className="mt-1 text-[11px] text-slate-500">{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prompts to try */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prompts to try
          </h3>
          {mcpResult && (
            <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {mcpResult}
              </span>
              <button
                type="button"
                onClick={() => router.push('/guide/guide-101')}
                className="font-bold underline"
              >
                Open in Studio →
              </button>
            </div>
          )}
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {PROMPTS_TO_TRY.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => handleRunPrompt(p)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-medium text-slate-700 hover:border-[#e038b5] hover:bg-pink-50/30"
              >
                <span>“{p}”</span>
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#e038b5]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
