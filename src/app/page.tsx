'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import {
  Sparkles,
  Play,
  ArrowRight,
  Mic,
  ZoomIn,
  FileText,
  Globe,
  Captions,
  Wand2,
  CheckCircle2,
  Star,
  Bot,
  Cpu,
  Layers,
} from 'lucide-react';

export default function MarketingHomePage() {
  const [comparisonMode, setComparisonMode] = useState<'clueso' | 'raw'>('clueso');

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-pink-50/70 via-purple-50/40 to-white" />
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#e038b5] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New: Clueso Agent & Model Context Protocol (MCP)</span>
            <Link href="/agents" className="underline hover:text-pink-700">
              Explore →
            </Link>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl md:leading-[1.08]">
            Product videos{' '}
            <span className="bg-gradient-to-r from-[#e038b5] via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              in minutes
            </span>{' '}
            with AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Transform raw screen recordings into stunning studio-grade videos and step-by-step documentation—complete with AI voiceovers, smart auto-zooms, branded callouts, and 1-click translations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:opacity-95"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/home"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              <Play className="h-4 w-4 text-[#e038b5]" /> Launch Interactive Workspace
            </Link>
            <Link
              href="/guide/guide-101"
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-6 py-3.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              Open Studio Editor Demo
            </Link>
          </div>

          {/* Interactive Comparison Showcase ("Rough recording" vs "With Clueso") */}
          <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-950 p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  Product Onboarding Walkthrough — Clueso Studio 2.4
                </span>
              </div>

              <div className="inline-flex rounded-xl bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setComparisonMode('raw')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                    comparisonMode === 'raw'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rough screen recording
                </button>
                <button
                  type="button"
                  onClick={() => setComparisonMode('clueso')}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                    comparisonMode === 'clueso'
                      ? 'bg-gradient-to-r from-[#e038b5] to-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> With Clueso AI
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-left">
              {comparisonMode === 'clueso' ? (
                <div className="grid items-center gap-8 md:grid-cols-12">
                  <div className="space-y-4 md:col-span-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-300">
                      <Wand2 className="h-3.5 w-3.5" /> Studio-Polished in 45 Seconds
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Product Onboarding Walkthrough
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      “Welcome to your new Acme Product Studio workspace in Clueso. Click Record screen or upload an existing video to generate studio-grade guides.”
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-white/10 px-2.5 py-1 text-white">Voice: Brian (ElevenLabs)</span>
                      <span className="rounded-md bg-pink-500/20 px-2.5 py-1 text-pink-300">Auto-Zoom 1.4x</span>
                      <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-indigo-300">Karaoke Captions</span>
                    </div>
                  </div>
                  <div className="relative rounded-xl border border-pink-500/40 bg-slate-950/90 p-5 shadow-xl md:col-span-7">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-semibold text-slate-300">Acme Product Studio</span>
                      <span className="rounded-md bg-[#e038b5] px-2.5 py-1 text-xs font-bold text-white shadow">
                        + New project
                      </span>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      <div className="h-3 w-3/4 rounded bg-slate-800" />
                      <div className="h-3 w-1/2 rounded bg-slate-800" />
                      <div className="mt-4 rounded-lg border-2 border-[#e038b5] bg-pink-500/10 p-3 text-xs text-pink-200">
                        ✨ <strong>Smart Callout Overlay:</strong> Click &ldquo;New project&rdquo; to record your screen or import slides
                      </div>
                    </div>
                    <div className="mt-5 rounded-lg bg-black/80 px-4 py-2 text-center text-sm font-semibold text-white">
                      Welcome to your new <span className="rounded bg-[#e038b5] px-1.5 py-0.5">Acme Product Studio</span> workspace
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-base font-semibold text-slate-200">
                    Raw Unedited Screen Recording (1920×1080_raw.mov)
                  </p>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
                    “Umm... hey everyone, wait let me find the button... so if you click over here on the top right...” — Background laptop fan noise, no zooms, no captions, no documentation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Social Proof */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted by 1,500+ product, customer education, and support teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-10 text-lg font-bold tracking-tight text-slate-400">
            <span>PHENOM</span>
            <span>SAMSARA</span>
            <span>DARWINBOX</span>
            <span>Y COMBINATOR</span>
            <span>RAZORPAY</span>
            <span>CHARGEBEE</span>
          </div>
        </div>
      </section>

      {/* 6 Major AI Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e038b5]">
              One Recording, Dual Output
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything you need for studio-grade videos & docs
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wand2,
                title: 'AI Script Rewrite',
                desc: 'Automatically remove "ums", "ahs", and awkward silences. Turn rambling recordings into crisp, on-brand narration.',
                href: '/features/video',
              },
              {
                icon: Mic,
                title: 'Realistic AI Voiceovers',
                desc: 'Choose from dozens of studio-quality ElevenLabs voices across accents and tones—or clone your own voice.',
                href: '/features/voiceovers',
              },
              {
                icon: ZoomIn,
                title: 'Smart Auto-Zooms & Callouts',
                desc: 'Clueso detects every mouse click and keystroke, smoothly zooming into key UI actions and adding branded callouts.',
                href: '/features/video',
              },
              {
                icon: FileText,
                title: 'Synchronized Help Articles',
                desc: 'Every video simultaneously generates a step-by-step written SOP with auto-cropped, annotated screenshots.',
                href: '/features/help-articles',
              },
              {
                icon: Globe,
                title: '1-Click Translate in 30+ Languages',
                desc: 'Localize voiceovers, karaoke captions, and written help articles into Spanish, French, German, Japanese, and more.',
                href: '/features/translate',
              },
              {
                icon: Captions,
                title: 'Dynamic Karaoke Captions',
                desc: 'Engage viewers with word-by-word highlighted captions, custom brand fonts, and 9 studio wipe transitions.',
                href: '/features/video',
              },
            ].map(item => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#e038b5]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-[#e038b5]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Pillars: Agent, Clueprints, MCP */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
              <Bot className="h-8 w-8 text-pink-400" />
              <h3 className="mt-4 text-xl font-bold">Clueso Autonomous Agent</h3>
              <p className="mt-2 text-sm text-slate-400">
                Instruct Clueso Agent what to make—it navigates your app, records the workflow, edits the video, and publishes docs automatically.
              </p>
              <Link href="/agents" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-pink-400">
                Meet Clueso Agent <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
              <Layers className="h-8 w-8 text-indigo-400" />
              <h3 className="mt-4 text-xl font-bold">Clueprints Reusable Templates</h3>
              <p className="mt-2 text-sm text-slate-400">
                Lock in your intro, outro, font styles, and zoom pacing once so every teammate produces consistent on-brand videos.
              </p>
              <Link href="/clueprints" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
                Explore Clueprints <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
              <Cpu className="h-8 w-8 text-emerald-400" />
              <h3 className="mt-4 text-xl font-bold">Model Context Protocol (MCP)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Connect Claude Desktop, Claude Code, Cursor, Codex, and VS Code directly to Clueso’s video creation engine.
              </p>
              <Link href="/mcp" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
                Connect MCP <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
