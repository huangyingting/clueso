'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Try Clueso AI with up to 3 product videos and step-by-step articles.',
      cta: 'Start Free',
      highlight: false,
      features: [
        'Up to 3 exported videos & articles',
        'AI Script Rewrite & auto-zooms',
        'Standard AI voiceovers',
        'Public share links (watermarked)',
      ],
    },
    {
      name: 'Starter',
      price: annual ? '$120' : '$150',
      period: 'per month, billed annually',
      desc: 'For fast-moving startups building customer onboarding & help centers.',
      cta: 'Start 14-Day Trial',
      highlight: false,
      features: [
        '2 creator seats included',
        '100 mins of video export / year',
        'ElevenLabs studio voices',
        'Custom Brand Kit & no watermarks',
        '10+ translation languages',
      ],
    },
    {
      name: 'Growth',
      price: annual ? '$200' : '$250',
      period: 'per month, billed annually',
      desc: 'For scaling product & customer education teams localizing globally.',
      cta: 'Start 14-Day Trial',
      highlight: true,
      features: [
        '4 creator seats included',
        '200 mins of video export / year',
        '30+ translation languages & glossary',
        'Clueprints reusable templates',
        'Custom player & view-only domain',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored annual agreement',
      desc: 'Autonomous Clueso Agent, SAML SSO, SCIM, Clueso Cuts & dedicated SLA.',
      cta: 'Book Enterprise Demo',
      highlight: false,
      features: [
        'Unlimited creator seats & custom minutes',
        'Clueso Autonomous Video Agent',
        'Clueso Cuts & Full Viewer Analytics',
        'SAML SSO, SCIM & SOC 2 Type II',
        'Dedicated Customer Success Manager',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <span className="rounded-full bg-pink-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#e038b5]">
            Simple, Transparent Pricing
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Scale studio-grade product videos across your team
          </h1>
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold ${
                annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Yearly (Save 20%)
            </button>
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold ${
                !annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map(t => (
            <div
              key={t.name}
              className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm ${
                t.highlight
                  ? 'border-[#e038b5] bg-gradient-to-b from-pink-50/40 to-white ring-2 ring-[#e038b5]'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  {t.highlight && (
                    <span className="rounded-full bg-[#e038b5] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="mt-4 text-4xl font-extrabold text-slate-950">{t.price}</div>
                <div className="mt-1 text-xs text-slate-500">{t.period}</div>
                <p className="mt-4 text-sm text-slate-600">{t.desc}</p>

                <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e038b5]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/signup"
                className={`mt-8 flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold ${
                  t.highlight
                    ? 'bg-[#e038b5] text-white hover:opacity-95'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
