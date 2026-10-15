import React from 'react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { ArrowRight, Sparkles } from 'lucide-react';

const FEATURE_CONTENT: Record<string, { title: string; subtitle: string; bullets: string[] }> = {
  video: {
    title: 'AI Video Editor Built for Product Teams',
    subtitle: 'Turn raw screen recordings into studio-quality product videos with smart auto-zooms, cursor smoothing, and callouts.',
    bullets: [
      'Automatic zoom keyframes aligned to every mouse click and input focus',
      '11-tool studio rail: Voiceover script, Media, Text, Shapes, Effects (Blur, Callout, Spotlight, Zoom), Animations, Templates, Transitions, and Captions',
      'Instant aspect ratio switching (16:9 Landscape, 9:16 Vertical, 1:1 Square)',
    ],
  },
  'help-articles': {
    title: 'Synchronized Step-by-Step Help Articles',
    subtitle: 'Every video recording automatically generates a richly formatted SOP with annotated screenshots.',
    bullets: [
      '1-click switch between Video and Article modes inside the Studio Editor',
      'Auto-cropped screenshots with red callout markers on every clicked element',
      'Export directly to Markdown, HTML, Zendesk, Intercom, or Sanity CMS',
    ],
  },
  translate: {
    title: '1-Click Video Dubbing & Article Translation in 30+ Languages',
    subtitle: 'Localize your product onboarding and support library globally with custom translation glossaries.',
    bullets: [
      'Instant AI voiceover dubbing in Spanish, French, German, Japanese, Chinese, and 25+ more languages',
      'Synchronized translated Karaoke captions and step-by-step documentation',
      'Workspace Do-Not-Translate glossary for brand and product terminology',
    ],
  },
  voiceovers: {
    title: 'Studio-Grade AI Voiceovers & Pronunciation Dictionary',
    subtitle: 'Replace laptop mic audio with lifelike ElevenLabs voices—timed word-for-word to your screen actions.',
    bullets: [
      'Natural voices (Brian, Sarah, Lily, Marcus) across American, British, Australian, and global accents',
      'Word-level transcript synchronization—edit video timing simply by editing text',
      'Custom workspace Pronunciation Dictionary for technical acronyms and brand names',
    ],
  },
  'slides-to-video': {
    title: 'Convert Slide Decks into Narrated Product Videos',
    subtitle: 'Upload PDF or PowerPoint decks and let Clueso generate engaging voiceovers, transitions, and motion graphics.',
    bullets: [
      'Import PDF/PPTX slide decks directly from the Home dashboard',
      'Auto-generate speaker scripts and studio voiceovers per slide',
      'Combine slide scenes with live screen recordings on a single timeline',
    ],
  },
};

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = FEATURE_CONTENT[slug] || FEATURE_CONTENT.video;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3.5 py-1 text-xs font-bold uppercase text-[#e038b5]">
          <Sparkles className="h-3.5 w-3.5" /> Clueso Feature Spotlight
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {feature.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{feature.subtitle}</p>

        <div className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          {feature.bullets.map(b => (
            <div key={b} className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <span className="h-2 w-2 rounded-full bg-[#e038b5]" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/guide/guide-101"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e038b5] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Try in Studio Editor <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            Go to Workspace
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
