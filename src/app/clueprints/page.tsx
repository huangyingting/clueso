import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Layers, ArrowRight } from 'lucide-react';

export default function ClueprintsMarketingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-xs font-bold text-[#e038b5]">
          <Layers className="h-4 w-4" /> Clueprints
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Reusable video templates for consistent product storytelling
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          Create a Clueprint from any finished video—capturing your intro, outro, caption style, voiceover pacing, and callout theme—then apply it across every new recording.
        </p>
        <div className="mt-8">
          <Link
            href="/home/clueprints"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e038b5] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Browse Workspace Clueprints <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
