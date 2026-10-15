'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Video,
  FileText,
  Globe,
  Mic,
  Presentation,
  Bot,
  Layers,
  Cpu,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

export function MarketingNavbar() {
  const [productOpen, setProductOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e038b5] to-[#7c3aed] text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl tracking-tight">Clueso</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProductOpen(v => !v)}
                className="flex items-center gap-1 py-2 text-slate-700 hover:text-slate-900"
              >
                Product <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {productOpen && (
                <div className="absolute left-0 top-full w-[520px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/features/video"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Video className="mt-0.5 h-5 w-5 text-[#e038b5]" />
                      <div>
                        <div className="font-semibold text-slate-900">AI Video Editor</div>
                        <div className="text-xs text-slate-500">Auto-zooms, callouts, and studio polish</div>
                      </div>
                    </Link>
                    <Link
                      href="/features/help-articles"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <FileText className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Help Articles</div>
                        <div className="text-xs text-slate-500">Step-by-step SOPs & annotated screenshots</div>
                      </div>
                    </Link>
                    <Link
                      href="/features/voiceovers"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Mic className="mt-0.5 h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-slate-900">AI Voiceovers</div>
                        <div className="text-xs text-slate-500">Studio-grade ElevenLabs voices</div>
                      </div>
                    </Link>
                    <Link
                      href="/features/translate"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Globe className="mt-0.5 h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-slate-900">1-Click Translate</div>
                        <div className="text-xs text-slate-500">Dub videos & docs in 30+ languages</div>
                      </div>
                    </Link>
                    <Link
                      href="/features/slides-to-video"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Presentation className="mt-0.5 h-5 w-5 text-amber-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Slides to Video</div>
                        <div className="text-xs text-slate-500">Convert decks into narrated videos</div>
                      </div>
                    </Link>
                    <Link
                      href="/agents"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Bot className="mt-0.5 h-5 w-5 text-pink-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Clueso Agent</div>
                        <div className="text-xs text-slate-500">Autonomous AI video creation</div>
                      </div>
                    </Link>
                    <Link
                      href="/clueprints"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Layers className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Clueprints</div>
                        <div className="text-xs text-slate-500">Reusable brand video templates</div>
                      </div>
                    </Link>
                    <Link
                      href="/mcp"
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50"
                    >
                      <Cpu className="mt-0.5 h-5 w-5 text-violet-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Clueso MCP</div>
                        <div className="text-xs text-slate-500">Connect Claude, Cursor & ChatGPT</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="hover:text-slate-900">
              Pricing
            </Link>
            <Link href="/enterprise" className="hover:text-slate-900">
              Enterprise
            </Link>
            <Link href="/customers" className="hover:text-slate-900">
              Customers
            </Link>
            <Link href="/showcase" className="hover:text-slate-900">
              Showcase
            </Link>
            <Link href="/changelog" className="hover:text-slate-900">
              Changelog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign In
          </Link>
          <Link
            href="/home"
            className="rounded-lg border border-pink-200 bg-pink-50 px-3.5 py-2 text-sm font-medium text-[#e038b5] hover:bg-pink-100"
          >
            Open App
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Start Free Trial <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
