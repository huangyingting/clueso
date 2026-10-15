'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Play, Sparkles } from 'lucide-react';

export default function TemplatesWorkspacePage() {
  const [tab, setTab] = useState<'video' | 'animation'>('video');

  const items = [
    {
      id: 'tpl-1',
      name: 'SaaS Product Launch Intro (16:9)',
      type: 'video',
      duration: '00:05',
      desc: 'Sleek kinetic typography intro with Brand Kit gradient background.',
    },
    {
      id: 'tpl-2',
      name: 'Feature Spotlight Split Screen',
      type: 'video',
      duration: '00:08',
      desc: 'Side-by-side browser frame + voiceover caption card.',
    },
    {
      id: 'tpl-3',
      name: 'Karaoke Callout Motion Graphic',
      type: 'animation',
      duration: '00:04',
      desc: 'Animated callout zoom with spring physics and spotlight mask.',
    },
  ];

  return (
    <WorkspaceShell>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Animations & Templates</h1>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setTab('video')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                tab === 'video' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Video Templates
            </button>
            <button
              type="button"
              onClick={() => setTab('animation')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                tab === 'animation' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Animations
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {items.map(tpl => (
            <div key={tpl.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white">
                <Sparkles className="h-7 w-7 text-pink-400" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase">{tpl.type}</span>
                <span>{tpl.duration}</span>
              </div>
              <h3 className="mt-1 font-bold text-slate-900">{tpl.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{tpl.desc}</p>
              <Link
                href="/guide/guide-101"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#e038b5]"
              >
                <Play className="h-3 w-3" /> Apply in Studio Editor →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
