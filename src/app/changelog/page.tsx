import React from 'react';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';

export default function ChangelogPage() {
  const entries = [
    {
      version: 'v2.4 — April 2026',
      title: 'Clueso Agent, MCP Server & Opus 5.5 Studio Co-Pilot',
      desc: 'Connect Claude Code, Cursor, and ChatGPT directly to Clueso via MCP, or ask Clueso Co-Pilot inside the Studio Editor to rewrite scripts, apply Brand Kits, and add smart zooms.',
    },
    {
      version: 'v2.3 — March 2026',
      title: 'Clueprints Reusable Video Templates & 9 Wipe Transitions',
      desc: 'Save any project as a reusable Clueprint and choose from Circle wipe, Rainbow wipe, Corner wipe, Color wipe, Stack, Dissolve, Push & pull, Fade to color, and Flip.',
    },
    {
      version: 'v2.2 — February 2026',
      title: '8 Karaoke Caption Styles & Custom Pronunciation Dictionary',
      desc: 'Added Basic Karaoke, Highlight Box, Karaoke Highlight Box, Color word, Highlight word, Paragraph builder, and Word-by-word captions.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Changelog</h1>
        <p className="mt-2 text-slate-600">New features, AI models, and Studio Editor improvements.</p>

        <div className="mt-10 space-y-8 border-l-2 border-pink-200 pl-6">
          {entries.map(item => (
            <div key={item.version} className="rounded-2xl border border-slate-200 p-6">
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#e038b5]">
                {item.version}
              </span>
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
