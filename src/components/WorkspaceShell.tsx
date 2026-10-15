'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FolderKanban,
  Bot,
  MessageSquare,
  Cpu,
  Layers,
  Palette,
  BarChart3,
  Settings,
  Search,
  HelpCircle,
  Sparkles,
  Plus,
  ChevronDown,
  Video,
  Upload,
  Presentation,
  Globe,
  Trash2,
  Scissors,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [createModalMode, setCreateModalMode] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectPrompt, setProjectPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: projectTitle || 'New Clueso Product Walkthrough',
        prompt: projectPrompt || 'Create a studio-grade walkthrough with voiceover and auto-zooms',
        source: createModalMode || 'Screen Recording',
      }),
    });
    const data = await res.json();
    setCreating(false);
    setCreateModalMode(null);
    if (data.guide?.id) {
      router.push(`/guide/${data.guide.id}`);
    }
  }

  const navItems = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Projects', href: '/home/projects', icon: FolderKanban },
    { label: 'Agent', href: '/home/agent', icon: Bot },
    { label: 'Chats', href: '/home/chats', icon: MessageSquare },
    { label: 'MCP', href: '/home/mcp', icon: Cpu },
    { label: 'Clueprints', href: '/home/clueprints', icon: Layers },
    { label: 'Brand kit', href: '/home/brand', icon: Palette },
    { label: 'Analytics', href: '/home/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/home/settings/general', icon: Settings },
  ];

  const secondaryItems = [
    { label: 'Templates', href: '/home/templates', icon: LayoutTemplate },
    { label: 'Clueso Cuts', href: '/home/cuts', icon: Scissors },
    { label: 'Trash', href: '/home/trash', icon: Trash2 },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa] text-slate-900">
      {/* Left Sidebar */}
      <aside
        className={`flex flex-col justify-between border-r border-slate-200 bg-white transition-all ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="p-3">
          {/* Top Brand + Collapse */}
          <div className="mb-4 flex items-center justify-between px-2 py-1">
            {!collapsed && (
              <Link href="/home" className="flex items-center gap-2 font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e038b5] to-[#7c3aed] text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg tracking-tight">Clueso</span>
              </Link>
            )}
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => setCollapsed(v => !v)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const active =
                item.href === '/home'
                  ? pathname === '/home'
                  : item.href.startsWith('/home/settings')
                  ? pathname?.startsWith('/home/settings')
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-pink-50 text-[#e038b5]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#e038b5]' : 'text-slate-500'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="mt-5 border-t border-slate-100 pt-3">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                More
              </div>
              {secondaryItems.map(item => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-1.5 text-xs font-medium ${
                      active
                        ? 'bg-pink-50 text-[#e038b5]'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Capacity Card + Org Switcher */}
        {!collapsed && (
          <div className="space-y-3 border-t border-slate-100 p-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-800">Get more out of Clueso</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Upgrade for more capacity</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-3/4 rounded-full bg-[#e038b5]" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-600">18 mins / 200 mins</span>
                <Link
                  href="/home/settings/billing"
                  className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Upgrade
                </Link>
              </div>
            </div>

            <Link
              href="/home/settings/general"
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-100"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                AP
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-900">
                  Acme Product Studio
                </div>
                <div className="text-[11px] text-slate-500">Paid subscription</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="flex w-72 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                Search anything...
              </span>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                ⌘ K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/home/settings/profile"
              aria-label="Account menu"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700"
            >
              AR
            </Link>

            <Link
              href="/features/help-articles"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              Help
            </Link>

            <Link
              href="/chat/chat-101"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#e038b5]" />
              Clueso AI
            </Link>

            {/* New project dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNewMenuOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                <Plus className="h-3.5 w-3.5" />
                New project
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {newMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {[
                    { label: 'Record your screen', icon: Video, mode: 'Screen Recording' },
                    { label: 'Upload videos', icon: Upload, mode: 'Video Upload' },
                    { label: 'Upload slide decks', icon: Presentation, mode: 'Slide Deck Import' },
                    { label: 'Translate', icon: Globe, mode: 'Multi-Language Translation' },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setNewMenuOpen(false);
                        setCreateModalMode(opt.mode);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-pink-50 hover:text-[#e038b5]"
                    >
                      <opt.icon className="h-4 w-4 text-[#e038b5]" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main View */}
        <main className="flex-1 px-8 py-6">{children}</main>

        {/* Bottom Workspace Footer matching web.clueso.io */}
        <footer className="flex items-center justify-between border-t border-slate-200/70 bg-white px-8 py-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Make something beautiful</span>
            <span>•</span>
            <span>Built with care</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/features/video" className="hover:text-slate-600">
              Learn about our features
            </Link>
            <Link href="/changelog" className="hover:text-slate-600">
              More from Clueso
            </Link>
          </div>
        </footer>
      </div>

      {/* Global Command Palette (⌘K) */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 pt-24 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type a command or search projects..."
                  className="w-full text-sm focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                Projects & Studio
              </div>
              <Link
                href="/guide/guide-101"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-pink-50"
              >
                <span className="font-medium text-slate-800">Product Onboarding Walkthrough</span>
                <span className="text-slate-400">Open Studio Editor →</span>
              </Link>
              <Link
                href="/guide/guide-102"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-pink-50"
              >
                <span className="font-medium text-slate-800">Release 2.4 AI Co-Pilot Feature Tour</span>
                <span className="text-slate-400">Open Studio Editor →</span>
              </Link>
              <Link
                href="/home/projects"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                <span>Browse All Projects & Folders</span>
                <span className="text-slate-400">/home/projects</span>
              </Link>
              <Link
                href="/home/mcp"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                <span>Configure Clueso MCP Server</span>
                <span className="text-slate-400">/home/mcp</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* New Project / Screen Recording / Upload Modal */}
      {createModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{createModalMode}</h3>
              <button
                type="button"
                onClick={() => setCreateModalMode(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g., Customer Portal Walkthrough"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  AI Script & Scene Instructions
                </label>
                <textarea
                  value={projectPrompt}
                  onChange={e => setProjectPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe what Clueso AI should highlight, narrate, and zoom in on..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalMode(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-semibold text-white shadow"
                >
                  {creating ? 'Generating in Studio...' : 'Create & Open Studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
