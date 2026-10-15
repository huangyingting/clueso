import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Bot, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AgentsMarketingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-6 py-16 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-xs font-bold text-[#e038b5]">
          <Bot className="h-4 w-4" /> Meet Clueso Agent
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Clueso Agent writes, records, edits, and publishes your videos automatically
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          Connect your GitHub repository or staging URL. Whenever your UI changes, Clueso Agent re-records the workflow, updates the voiceover, and keeps your product videos fresh.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/home/agent"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e038b5] px-6 py-3.5 text-sm font-semibold text-white shadow-md"
          >
            Launch Clueso Agent in Workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 text-left md:grid-cols-3">
          {[
            {
              title: 'Video creation automated for you',
              desc: 'Instruct Clueso Agent what to make and go grab a coffee while your videos and help articles get created.',
            },
            {
              title: 'Your videos update with your product',
              desc: 'Agent monitors PR merges from GitHub/Bitbucket and keeps your product onboarding videos always up to date.',
            },
            {
              title: 'You always have the final say',
              desc: 'Every Agent output opens in the full Clueso Studio Editor so you can tweak scripts, zooms, or callouts anytime.',
            },
          ].map(c => (
            <div key={c.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <CheckCircle2 className="h-6 w-6 text-[#e038b5]" />
              <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
