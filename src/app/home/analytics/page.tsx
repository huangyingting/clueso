'use client';

import React, { useState } from 'react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { BarChart3, Eye, Users, Clock, TrendingUp } from 'lucide-react';

export default function AnalyticsWorkspacePage() {
  const [unlocked, setUnlocked] = useState(true);

  return (
    <WorkspaceShell>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-xs text-slate-500">
              Track impressions, plays, retention, and audience location across your published videos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUnlocked(v => !v)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700"
          >
            {unlocked ? 'View Plan Gate State' : 'Upgrade plan'}
          </button>
        </div>

        {!unlocked ? (
          <div className="mx-auto max-w-lg py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[#e038b5]">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Analytics is not available on your current plan
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Track impressions, plays, retention, and audience location across your published videos. Available on Business and Enterprise plans only.
            </p>
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="mt-5 rounded-xl bg-[#e038b5] px-5 py-2.5 text-xs font-semibold text-white"
            >
              Upgrade plan
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                { label: 'Total Plays', value: '2,445', delta: '+18.4%', icon: Eye },
                { label: 'Unique Viewers', value: '1,890', delta: '+12.1%', icon: Users },
                { label: 'Avg. Completion Rate', value: '84.5%', delta: '+6.2%', icon: TrendingUp },
                { label: 'Total Watch Time', value: '14.2 hrs', delta: '+22.0%', icon: Clock },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{stat.label}</span>
                    <stat.icon className="h-4 w-4 text-[#e038b5]" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-[11px] font-semibold text-emerald-600">
                    {stat.delta} vs last 30 days
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-bold text-slate-900">Top Performing Guides</h3>
              <div className="mt-4 space-y-3 text-xs">
                {[
                  { name: 'Product Onboarding Walkthrough', views: 1240, retention: '88%' },
                  { name: 'Release 2.4 AI Co-Pilot Feature Tour', views: 790, retention: '82%' },
                  { name: 'Configuring SAML SSO & SCIM Provisioning', views: 415, retention: '79%' },
                ].map(row => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-800">{row.name}</span>
                    <div className="flex items-center gap-6">
                      <span>{row.views} views</span>
                      <span className="font-bold text-emerald-600">{row.retention} completion</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </WorkspaceShell>
  );
}
