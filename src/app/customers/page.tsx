import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Star, ArrowRight } from 'lucide-react';

export default function CustomersPage() {
  const stories = [
    {
      company: 'Phenom',
      metric: '10x Faster Video Production',
      quote: 'Clueso transformed how our product marketing and academy teams ship training videos across 12 languages.',
      author: 'VP of Customer Education, Phenom',
    },
    {
      company: 'Darwinbox',
      metric: '400+ Help Center Videos Published',
      quote: 'What used to take 2 weeks of video editing and voice recording now takes 15 minutes inside Clueso Studio.',
      author: 'Head of Product Documentation, Darwinbox',
    },
    {
      company: 'Samsara',
      metric: '84% Viewer Completion Rate',
      quote: 'Smart auto-zooms and Karaoke captions keep enterprise admins engaged from start to finish.',
      author: 'Director of Technical Enablement, Samsara',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> Rated 4.9 / 5 on G2
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Loved by world-class product & customer teams
          </h1>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stories.map(s => (
            <div key={s.company} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#e038b5]">{s.company}</div>
              <div className="mt-2 text-2xl font-extrabold text-slate-950">{s.metric}</div>
              <p className="mt-4 text-sm italic text-slate-600">“{s.quote}”</p>
              <div className="mt-6 text-xs font-semibold text-slate-500">{s.author}</div>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
