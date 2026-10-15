import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { ShieldCheck, Lock, Users, Globe, Cpu, ArrowRight } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-slate-950 p-10 text-white md:p-16">
          <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            Clueso for Enterprise
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Enterprise-grade security, governance & autonomous video creation
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            SOC 2 Type II & ISO 27001 certified. Built for global SaaS enterprises with SAML 2.0 SSO, SCIM provisioning, custom data residency (`usw1` / `eu1`), and zero-retention AI guarantees.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/home/settings/general"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e038b5] px-6 py-3 text-sm font-semibold text-white"
            >
              Explore Enterprise Admin Console <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Sign in with SAML SSO
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'SOC 2 Type II & ISO 27001',
              desc: 'Continuous compliance monitoring, encrypted media storage, and strict tenant isolation.',
            },
            {
              icon: Lock,
              title: 'SAML SSO & Custom Domains',
              desc: 'Okta, Azure AD, and Google Workspace SSO plus CNAME view-only link hosting.',
            },
            {
              icon: Users,
              title: 'Granular Role Permissions',
              desc: 'Admin, Editor, and Viewer roles with team workspaces, approval workflows, and audit logs.',
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border border-slate-200 p-6">
              <card.icon className="h-7 w-7 text-[#e038b5]" />
              <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
