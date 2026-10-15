'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Globe,
  Code2,
  CheckCircle2,
  Copy,
  FileText,
  Film,
} from 'lucide-react';

export default function ExportGuidePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const guideId = params?.id || 'guide-101';
  const initialTab = (searchParams?.get('process') as 'export' | 'publish' | 'embed') || 'export';

  const [tab, setTab] = useState<'export' | 'publish' | 'embed'>(initialTab);
  const [guide, setGuide] = useState<any>(null);
  const [format, setFormat] = useState('MP4');
  const [resolution, setResolution] = useState('1080p');
  const [toast, setToast] = useState('');

  async function loadGuide() {
    const res = await fetch(`/api/guides/${guideId}`);
    if (res.ok) setGuide(await res.json());
  }

  useEffect(() => {
    loadGuide();
  }, [guideId]);

  async function startExport(fmt: string, resLabel: string) {
    await fetch(`/api/guides/${guideId}/exports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format: fmt, resolution: resLabel }),
    });
    await loadGuide();
    setToast(`Rendered ${fmt} (${resLabel}) ready for download`);
    setTimeout(() => setToast(''), 2800);
  }

  const embedIframe = `<iframe src="https://web.clueso.io/share/${guideId}" width="100%" height="540" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/guide/${guideId}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Studio Editor
          </Link>
          <div>
            <h1 className="text-base font-bold text-white">
              {guide?.title || 'Customer Onboarding Walkthrough'}
            </h1>
            <p className="text-xs text-slate-400">Export, Publish & Embed Pipeline</p>
          </div>
        </div>

        {toast && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> {toast}
          </span>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-bold">
          {[
            { id: 'export', label: 'Export Video & Docs', icon: Download },
            { id: 'publish', label: 'Publish to Knowledge Base', icon: Globe },
            { id: 'embed', label: 'Embed Code & Share', icon: Code2 },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as any)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 transition ${
                  tab === item.id ? 'bg-[#e038b5] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'export' && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Film className="h-4 w-4 text-[#e038b5]" /> Render Video File
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Export your studio video with AI voiceover, zoom keyframes, and burned-in captions.
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300">Format</label>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="MP4">MP4 Video (H.264 + AAC)</option>
                    <option value="GIF">Animated GIF Walkthrough</option>
                    <option value="SRT">Subtitles (.SRT / .VTT)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Resolution</label>
                  <select
                    value={resolution}
                    onChange={e => setResolution(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="4K">4K Ultra HD (3840×2160 · 60fps)</option>
                    <option value="1080p">Full HD 1080p (1920×1080 · 60fps)</option>
                    <option value="720p">HD 720p (Fast Share)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => startExport(format, resolution)}
                  className="mt-2 w-full rounded-xl bg-[#e038b5] py-2.5 text-xs font-bold text-white hover:bg-[#c92ba0]"
                >
                  Render & Download {format} ({resolution})
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="h-4 w-4 text-[#e038b5]" /> Export Step-by-Step Article
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Download your annotated SOP guide with cropped screenshots and numbered steps.
              </p>
              <div className="mt-4 space-y-2.5">
                {['Markdown (.MD)', 'HTML Bundle (.HTML)', 'PDF SOP Document (.PDF)'].map(docFmt => (
                  <button
                    key={docFmt}
                    type="button"
                    onClick={() => startExport(docFmt, 'Document')}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-200 hover:border-[#e038b5]"
                  >
                    <span>{docFmt}</span>
                    <Download className="h-3.5 w-3.5 text-[#e038b5]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Completed Exports
              </h3>
              <div className="mt-3 divide-y divide-slate-800">
                {(guide?.exports || []).map((ex: any) => (
                  <div key={ex.id} className="flex items-center justify-between py-2.5 text-xs">
                    <div>
                      <span className="font-bold text-white">{ex.format}</span>
                      <span className="ml-2 text-slate-400">({ex.resolution})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        {ex.status}
                      </span>
                      <a
                        href={ex.downloadUrl}
                        onClick={e => {
                          e.preventDefault();
                          setToast(`Downloading ${ex.format}...`);
                        }}
                        className="font-semibold text-[#ff7be0] hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'publish' && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { name: 'Zendesk Guide', desc: 'Sync video + SOP article to Zendesk Help Center' },
              { name: 'Intercom Articles', desc: 'Publish directly into Intercom Collections' },
              { name: 'Notion Workspace', desc: 'Push interactive blocks into Notion' },
              { name: 'Confluence Cloud', desc: 'Sync to Atlassian Confluence space' },
            ].map(dest => (
              <div
                key={dest.name}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div>
                  <div className="text-sm font-bold text-white">{dest.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{dest.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(`Published to ${dest.name}`)}
                  className="rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-bold text-white"
                >
                  Publish
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'embed' && (
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-bold text-white">Responsive Iframe Embed</h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-pink-300">
              {embedIframe}
            </pre>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setToast('Copied iframe embed snippet')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-bold text-white"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Embed Code
              </button>
              <Link
                href={`/share/${guideId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Open Public Share Page
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
