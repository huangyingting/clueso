'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const GOALS = [
  'Customer Onboarding & Training Videos',
  'Product Release & Feature Announcements',
  'Step-by-Step Help Center Articles',
  'Internal SOPs & Sales Enablement',
  'Multi-Language Video Localization',
];

export default function WelcomeOnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([GOALS[0], GOALS[2]]);
  const [step, setStep] = useState(1);

  function toggleGoal(goal: string) {
    setSelected(prev => (prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]));
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 p-6">
      {/* Top Banner matching 80-welcome-about-you.png */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-xs shadow-2xs">
        <span>
          Switch to your work email so your videos are on-brand from the first one. No redoing them later.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="rounded-lg px-2.5 py-1 text-slate-500 hover:bg-slate-100"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => router.push('/home/brand')}
            className="rounded-lg bg-slate-900 px-3 py-1 font-semibold text-white"
          >
            Switch
          </button>
          <span className="ml-2 font-medium text-slate-500">alex@acme.io</span>
        </div>
      </div>

      {/* Onboarding Card */}
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-[#e038b5]">
          Step {step} of 4
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          What would you like to create with Clueso?
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          The more we know, the more Clueso feels made for you. Select all that apply.
        </p>

        <div className="mt-6 space-y-2.5">
          {GOALS.map(g => {
            const active = selected.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'border-[#e038b5] bg-pink-50/50 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{g}</span>
                {active && <CheckCircle2 className="h-4 w-4 text-[#e038b5]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={() => {
              if (step < 4) setStep(s => s + 1);
              else router.push('/home');
            }}
            className="rounded-xl bg-[#e038b5] px-6 py-2.5 text-xs font-semibold text-white shadow"
          >
            {step < 4 ? 'Continue →' : 'Launch Workspace →'}
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-[#e038b5]" /> Make something beautiful
        </span>
      </div>
    </div>
  );
}
