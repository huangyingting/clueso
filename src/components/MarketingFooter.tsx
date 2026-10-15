import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e038b5] to-[#7c3aed] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg">Clueso</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Turn rough screen recordings into studio-grade product videos and step-by-step documentation in minutes with AI.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              SOC 2 Type II & ISO 27001 Certified
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/features/video" className="hover:text-white">AI Video Editor</Link></li>
              <li><Link href="/features/help-articles" className="hover:text-white">Help Articles</Link></li>
              <li><Link href="/features/voiceovers" className="hover:text-white">AI Voiceovers</Link></li>
              <li><Link href="/features/translate" className="hover:text-white">Multi-Language Dubbing</Link></li>
              <li><Link href="/features/slides-to-video" className="hover:text-white">Slides to Video</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/agents" className="hover:text-white">Clueso Agent</Link></li>
              <li><Link href="/clueprints" className="hover:text-white">Clueprints</Link></li>
              <li><Link href="/mcp" className="hover:text-white">MCP Server</Link></li>
              <li><Link href="/enterprise" className="hover:text-white">Enterprise Security</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/customers" className="hover:text-white">Customer Stories</Link></li>
              <li><Link href="/showcase" className="hover:text-white">Video Showcase</Link></li>
              <li><Link href="/changelog" className="hover:text-white">Changelog</Link></li>
              <li><Link href="/home" className="hover:text-white">Workspace Dashboard</Link></li>
              <li><Link href="/guide/guide-101" className="hover:text-white">Studio Editor Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Get Started</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/login" className="hover:text-white">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-white">Start Free Trial</Link></li>
              <li><Link href="/welcome/goals" className="hover:text-white">Onboarding Tour</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Clueso Inc. Built with care (Y Combinator W23).</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Trust Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
