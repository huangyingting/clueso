'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import {
  Plus,
  Video,
  Upload,
  Presentation,
  Globe,
  ArrowUp,
  ChevronDown,
  Disc,
  Sparkles,
  Play,
  Folder,
} from 'lucide-react';

export default function HomeDashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('Ask');
  const [model, setModel] = useState('Opus 5.5');
  const [submitting, setSubmitting] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/guides')
      .then(r => r.json())
      .then(d => setGuides(d.guides || []))
      .catch(() => {});
  }, []);

  async function handlePromptSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const targetPrompt = prompt.trim() || 'Make a video explaining how Facebook works';
    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: targetPrompt.slice(0, 60),
        prompt: targetPrompt,
        model,
        source: `Clueso AI (${mode})`,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.guide?.id) {
      router.push(`/guide/${data.guide.id}`);
    }
  }

  async function handleQuickStart(actionLabel: string) {
    setSubmitting(true);
    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${actionLabel} — ${new Date().toLocaleDateString()}`,
        prompt: `Started via ${actionLabel}`,
        source: actionLabel,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.guide?.id) {
      router.push(`/guide/${data.guide.id}`);
    }
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto flex max-w-3xl flex-col items-center pt-14 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What are we creating today?
        </h1>

        {/* Pink-bordered AI Prompt Composer matching 10-home-dashboard.png */}
        <form
          onSubmit={handlePromptSubmit}
          className="mt-7 w-full rounded-2xl border-2 border-pink-300/80 bg-white p-4 shadow-lg shadow-pink-500/5 transition focus-within:border-[#e038b5]"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Make a video explaining how Facebook works"
              className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setPrompt('Make a video explaining how Facebook works')}
              className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400"
            >
              Tab
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Add"
                onClick={() => handleQuickStart('Upload Media')}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Recording"
                onClick={() => handleQuickStart('Record your screen')}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <Disc className="h-3.5 w-3.5 text-rose-500" />
              </button>
              <button
                type="button"
                onClick={() => setMode(m => (m === 'Ask' ? 'Create' : 'Ask'))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Sparkles className="h-3 w-3 text-[#e038b5]" />
                {mode}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Model"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 focus:outline-none"
              >
                <option value="Opus 5.5">Opus 5.5</option>
                <option value="Sonnet 4.5">Sonnet 4.5</option>
                <option value="GPT-5">GPT-5</option>
              </select>

              <button
                type="submit"
                aria-label="Send"
                disabled={submitting}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e038b5] text-white shadow-sm hover:opacity-95"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        {/* OR START DIRECTLY */}
        <div className="mt-10 w-full">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              OR START DIRECTLY
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Record your screen', icon: Video },
              { label: 'Upload videos', icon: Upload },
              { label: 'Upload slide decks', icon: Presentation },
              { label: 'Translate', icon: Globe },
            ].map(card => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleQuickStart(card.label)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-pink-300 hover:bg-pink-50/30"
              >
                <card.icon className="h-4 w-4 text-slate-500" />
                <span>{card.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Workspace Projects */}
        {guides.length > 0 && (
          <div className="mt-12 w-full text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Projects
              </h2>
              <Link href="/home/projects" className="text-xs font-semibold text-[#e038b5] hover:underline">
                View all projects →
              </Link>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {guides.slice(0, 3).map(g => (
                <Link
                  key={g.id}
                  href={`/guide/${g.id}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-[#e038b5]"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-[#e038b5]">
                      <Play className="h-3.5 w-3.5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {g.languageId?.toUpperCase() || 'EN'}
                    </span>
                  </div>
                  <div className="mt-3 line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-[#e038b5]">
                    {g.name}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {g.createdBy?.name || 'Alex Rivera'} • {g.status}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
