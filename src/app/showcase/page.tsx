import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { Play } from 'lucide-react';

export default function ShowcasePage() {
  const examples = [
    { id: 'guide-101', title: 'Product Onboarding Walkthrough', category: 'Customer Onboarding', duration: '00:18' },
    { id: 'guide-102', title: 'Release 2.4 AI Co-Pilot Feature Tour', category: 'Product Launch', duration: '00:18' },
    { id: 'guide-103', title: 'Configuring SAML SSO & SCIM Provisioning', category: 'Technical Documentation', duration: '00:18' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
          Made with Clueso Showcase
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Explore real product tours, release announcements, and interactive help guides created in Clueso Studio.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {examples.map(ex => (
            <Link
              key={ex.id}
              href={`/guide/${ex.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#e038b5]"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur group-hover:bg-[#e038b5]">
                  <Play className="h-5 w-5 fill-white" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-[#e038b5]">{ex.category}</span>
                  <span>{ex.duration}</span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900">{ex.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
