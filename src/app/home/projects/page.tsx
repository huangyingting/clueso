'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import {
  Folder,
  FolderPlus,
  Play,
  MoreHorizontal,
  Copy,
  Trash2,
  Share2,
  ChevronDown,
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'all' | 'deleted'>('all');
  const [guides, setGuides] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [tagFilter, setTagFilter] = useState('All');
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  async function loadData(currentTab = tab) {
    const res = await fetch(`/api/guides?trash=${currentTab === 'deleted'}`);
    const data = await res.json();
    setGuides(data.guides || []);
    setFolders(data.folders || []);
  }

  useEffect(() => {
    loadData(tab);
  }, [tab]);

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!folderName.trim()) return;
    await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName }),
    });
    setFolderName('');
    setNewFolderOpen(false);
    loadData(tab);
  }

  async function handleDuplicate(id: string) {
    await fetch(`/api/guides/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate' }),
    });
    loadData(tab);
  }

  async function handleSoftDelete(id: string, isDeleted: boolean) {
    await fetch(`/api/guides/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted }),
    });
    loadData(tab);
  }

  const filteredGuides =
    tagFilter === 'All'
      ? guides
      : guides.filter(g => (g.tagsJson || '').toLowerCase().includes(tagFilter.toLowerCase()));

  return (
    <WorkspaceShell>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        </div>

        {/* Tabs: All | Deleted */}
        <div className="mt-4 flex items-center gap-6 border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`border-b-2 pb-2.5 ${
              tab === 'all'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab('deleted')}
            className={`border-b-2 pb-2.5 ${
              tab === 'deleted'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deleted
          </button>
        </div>

        {/* Filter Bar + New folder button matching 12-home-projects.png */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['All types', 'All creators', 'Tags', 'Created', 'Modified'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() =>
                  setTagFilter(prev =>
                    prev === 'All' ? 'Onboarding' : prev === 'Onboarding' ? 'Release Notes' : 'All'
                  )
                }
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>{f}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              Last modified (newest) <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => setNewFolderOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <FolderPlus className="h-3.5 w-3.5" /> New folder
            </button>
          </div>
        </div>

        {/* Folders Section */}
        {tab === 'all' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span>Folders</span>
              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px]">{folders.length}</span>
            </div>

            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-slate-400">
                Name
              </div>
              {folders.map(folder => (
                <Link
                  key={folder.id}
                  href={`/home/folders/${folder.id}`}
                  className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-none hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{folder.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {folder.guides?.length ? `${folder.guides.length} projects` : 'Empty'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Projects</span>
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px]">
              {filteredGuides.length}
            </span>
          </div>

          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-12 border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-slate-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Last modified</div>
              <div className="col-span-2">Date created</div>
              <div className="col-span-2 text-right">Creator / Actions</div>
            </div>

            {filteredGuides.map(guide => {
              let tags: string[] = [];
              try {
                tags = JSON.parse(guide.tagsJson || '[]');
              } catch {}
              return (
                <div
                  key={guide.id}
                  className="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 last:border-none hover:bg-slate-50"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/guide/${guide.id}`)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#e038b5]"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/guide/${guide.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#e038b5]"
                        >
                          {guide.name}
                        </Link>
                        {tags.map(t => (
                          <span
                            key={t}
                            className="rounded-md bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-[#e038b5]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Created recently • {guide.aspectRatio || '16:9'}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-xs text-slate-500">Just now</div>
                  <div className="col-span-2 text-xs text-slate-500">Apr 20, 2026</div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      {guide.createdBy?.firstName || 'Alex'}
                    </span>
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={() => handleDuplicate(guide.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/export/${guide.id}?process=export`}
                      title="Export"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      title={tab === 'deleted' ? 'Restore' : 'Move to Trash'}
                      onClick={() => handleSoftDelete(guide.id, tab !== 'deleted')}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {newFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={handleCreateFolder}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h3 className="text-base font-bold text-slate-900">Create New Folder</h3>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={e => setFolderName(e.target.value)}
              placeholder="e.g., Enterprise Security Guides"
              className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewFolderOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}
    </WorkspaceShell>
  );
}
