'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Scissors, Play, Sparkles } from 'lucide-react';

export default function CutsWorkspacePage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <WorkspaceShell>
      {!unlocked ? (
        <div className="mx-auto max-w-lg py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[#e038b5]">
            <Scissors className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Clueso Cuts is not available on your current plan
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Automatically break long videos into short, reusable clips and generate docs from your calls and webinars. Available on the Enterprise plan only.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="rounded-xl bg-[#e038b5] px-5 py-2.5 text-xs font-semibold text-white shadow"
            >
              Upgrade plan / Enable Enterprise Preview
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clueso Cuts</h1>
              <p className="text-xs text-slate-500">
                AI-extracted highlight clips from webinars, customer calls, and town halls.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Enterprise Active
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Cut #1: Workspace Setup in 60s', time: '00:00 – 00:06', score: '98% Virality' },
              { title: 'Cut #2: AI Script Rewrite Demo', time: '00:06 – 00:12', score: '95% Engagement' },
              { title: 'Cut #3: 1-Click 30-Language Dubbing', time: '00:12 – 00:18', score: '94% Retention' },
            ].map(c => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#e038b5]">{c.score}</span>
                  <span className="text-slate-400">{c.time}</span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900">{c.title}</h3>
                <Link
                  href="/guide/guide-101"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#e038b5]"
                >
                  <Play className="h-3 w-3" /> Edit Cut in Studio →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
