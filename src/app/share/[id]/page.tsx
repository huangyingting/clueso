'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, Pause, Globe, Sparkles, Edit3 } from 'lucide-react';

export default function PublicShareGuidePage() {
  const params = useParams<{ id: string }>();
  const guideId = params?.id || 'guide-101';

  const [guide, setGuide] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<'both' | 'video' | 'article'>('both');

  useEffect(() => {
    fetch(`/api/guides/${guideId}`)
      .then(r => r.json())
      .then(setGuide);
  }, [guideId]);

  const clips = Array.isArray(guide?.clips) ? guide.clips : [];
  const steps = Array.isArray(guide?.articleSteps) ? guide.articleSteps : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#e038b5] to-indigo-600 text-xs font-bold text-white">
              ✦
            </span>
            <span className="text-sm font-bold text-slate-900">
              Acme Product Studio · Help Center
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 text-xs font-semibold">
              {(['both', 'video', 'article'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setActiveMode(m)}
                  className={`rounded-lg px-3 py-1 capitalize ${
                    activeMode === m ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <Link
              href={`/guide/${guideId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e038b5] px-3.5 py-1.5 text-xs font-bold text-white"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit in Studio
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#e038b5]">
              <Globe className="h-3.5 w-3.5" /> {guide?.language || 'English (US)'} · Published Guide
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              {guide?.title || 'Customer Onboarding Walkthrough'}
            </h1>
          </div>
        </div>

        {(activeMode === 'both' || activeMode === 'video') && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 text-center">
              <button
                type="button"
                onClick={() => setPlaying(p => !p)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e038b5] text-white shadow-xl hover:scale-105"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white" />}
              </button>
              <h2 className="mt-4 text-lg font-bold">
                {clips[0]?.title || 'Step 1: Welcome & Overview'}
              </h2>
              <p className="mt-2 max-w-lg rounded-xl bg-black/60 px-4 py-2 text-xs text-slate-200">
                {clips[0]?.script ||
                  'Welcome to Acme Product Studio. Today we will configure your workspace in 3 steps.'}
              </p>
            </div>
          </div>
        )}

        {(activeMode === 'both' || activeMode === 'article') && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-[#e038b5]" /> Step-by-Step Written Guide
            </div>
            {steps.map((s: any, idx: number) => (
              <div key={s.id || idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e038b5] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
