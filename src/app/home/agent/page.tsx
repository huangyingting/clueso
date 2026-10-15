'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Bot, Play, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AgentWorkspacePage() {
  const router = useRouter();
  const [agentPrompt, setAgentPrompt] = useState(
    'Navigate to https://app.acme.io/settings/sso, record configuring Okta SAML 2.0, and generate a 30s guide.'
  );
  const [running, setRunning] = useState(false);

  async function handleRunAgent() {
    setRunning(true);
    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Agent Run: Okta SAML 2.0 Setup',
        prompt: agentPrompt,
        source: 'Clueso Autonomous Agent',
        tags: ['Agent Generated'],
      }),
    });
    const data = await res.json();
    setRunning(false);
    if (data.guide?.id) {
      router.push(`/guide/${data.guide.id}`);
    }
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-4xl py-6 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[#e038b5]">
          <Bot className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Hey Alex, Meet Clueso Agent
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Clueso agent can write, record, edit and publish your videos automatically while you sit back and relax.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRunAgent}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Book a demo
          </button>
          <button
            type="button"
            onClick={handleRunAgent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Play className="h-3.5 w-3.5 text-[#e038b5]" /> Watch what it can do
          </button>
        </div>

        {/* Interactive Autonomous Task Launcher */}
        <div className="mt-8 rounded-2xl border border-pink-200 bg-white p-5 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e038b5]">
              <Sparkles className="h-3.5 w-3.5" /> Dispatch Autonomous Video Agent
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              Browser Sandbox Ready
            </span>
          </div>
          <textarea
            rows={2}
            value={agentPrompt}
            onChange={e => setAgentPrompt(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-[#e038b5] focus:outline-none"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={running}
              onClick={handleRunAgent}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-semibold text-white shadow"
            >
              {running ? 'Agent Recording & Editing...' : 'See Clueso Agent at work'}{' '}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Feature Cards matching 18-home-agent.png */}
        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          {[
            {
              title: 'Video creation automated for you',
              desc: 'Instruct Clueso agent what to make and go grab a coffee while your videos get created.',
            },
            {
              title: 'Your videos update with your product',
              desc: 'Agent helps keep your product videos always accurate whenever your UI or workflows ship updates.',
            },
            {
              title: 'You always have the final say',
              desc: 'Every video created by Clueso Agent is 100% editable in the Studio Editor before publishing.',
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <CheckCircle2 className="h-5 w-5 text-[#e038b5]" />
              <h3 className="mt-3 text-sm font-bold text-slate-900">{card.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
