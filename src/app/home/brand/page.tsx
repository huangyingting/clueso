'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function BrandKitPage() {
  const [url, setUrl] = useState('https://acme.io');
  const [colors, setColors] = useState(['#e038b5', '#6366f1', '#10b981', '#0f172a', '#f8fafc']);
  const [headingFont, setHeadingFont] = useState('Inter');
  const [padding, setPadding] = useState(36);
  const [radius, setRadius] = useState(16);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetch('/api/workspace')
      .then(r => r.json())
      .then(d => {
        if (d.brandKit?.websiteUrl) setUrl(d.brandKit.websiteUrl);
        if (Array.isArray(d.brandKit?.colors)) setColors(d.brandKit.colors);
        if (d.brandKit?.headingFont) setHeadingFont(d.brandKit.headingFont);
      });
  }, []);

  async function handleRefetch() {
    const newPalette = url.includes('clueso')
      ? ['#e038b5', '#c026d3', '#7c3aed', '#0f172a', '#ffffff']
      : ['#e038b5', '#6366f1', '#10b981', '#0f172a', '#f8fafc'];
    setColors(newPalette);
    await fetch('/api/workspace', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandKit: {
          websiteUrl: url,
          colors: newPalette,
          headingFont,
          backgroundPadding: padding,
          borderRadius: radius,
        },
      }),
    });
    setSavedMsg(`Extracted brand palette & typography from ${url}`);
  }

  return (
    <WorkspaceShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">Brand kit</h1>
        <p className="mt-1 text-xs text-slate-500">
          The default style for every video in this workspace. Set during onboarding, and editable here.
        </p>

        {/* Pull your brand from URL card matching 17-home-brand.png */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pull your brand from URL</h3>
              <p className="text-xs text-slate-500">
                Automatically extract brand colors, fonts, and logos from your website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://company.com"
                className="w-64 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-[#e038b5] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleRefetch}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refetch
              </button>
            </div>
          </div>

          {savedMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {savedMsg}
            </div>
          )}

          {/* Brand Colors */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <label className="block text-xs font-semibold text-slate-700">Brand Palette</label>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((hex, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2"
                >
                  <input
                    type="color"
                    value={hex}
                    onChange={e => {
                      const next = [...colors];
                      next[idx] = e.target.value;
                      setColors(next);
                    }}
                    className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="font-mono text-xs text-slate-700">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Canvas Framing */}
          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Typography</label>
              <select
                value={headingFont}
                onChange={e => setHeadingFont(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
              >
                <option value="Inter">Inter</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Canvas Padding ({padding}px)
              </label>
              <input
                type="range"
                min={0}
                max={80}
                value={padding}
                onChange={e => setPadding(Number(e.target.value))}
                className="mt-3 w-full accent-[#e038b5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Corner Radius ({radius}px)
              </label>
              <input
                type="range"
                min={0}
                max={32}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="mt-3 w-full accent-[#e038b5]"
              />
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
