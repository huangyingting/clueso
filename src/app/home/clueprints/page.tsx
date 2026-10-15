'use client';

import React, { useEffect, useState } from 'react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Layers, Plus, Play } from 'lucide-react';
import Link from 'next/link';

export default function ClueprintsWorkspacePage() {
  const [tab, setTab] = useState<'Workspace' | 'Community'>('Workspace');
  const [clueprints, setClueprints] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  async function loadClueprints() {
    const res = await fetch('/api/clueprints');
    const data = await res.json();
    setClueprints(data.clueprints || []);
  }

  useEffect(() => {
    loadClueprints();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/clueprints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, category: tab }),
    });
    setName('');
    setDesc('');
    setModalOpen(false);
    loadClueprints();
  }

  const filtered = clueprints.filter(c => c.category === tab);

  return (
    <WorkspaceShell>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clueprints</h1>
            <p className="mt-0.5 text-xs text-slate-500">Reusable video templates</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> New clueprint
          </button>
        </div>

        <div className="mt-5 flex items-center gap-6 border-b border-slate-200 text-xs font-semibold">
          {(['Workspace', 'Community'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 pb-2.5 ${
                tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(cp => (
            <div
              key={cp.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-[#e038b5]">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {cp.aspectRatio} • {cp.duration}s
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-slate-900">{cp.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{cp.description}</p>
              </div>
              <Link
                href="/guide/guide-101"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#e038b5] hover:underline"
              >
                <Play className="h-3 w-3" /> Use Clueprint in Studio →
              </Link>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <form
              onSubmit={handleCreate}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <h3 className="text-base font-bold text-slate-900">Create New Clueprint</h3>
              <p className="mt-1 text-xs text-slate-500">
                Clueprints are reusable video templates. Create one from an existing video or from scratch.
              </p>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Template name (e.g., Feature Release Spotlight)"
                className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Describe intro, callout style, and voiceover pacing..."
                className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#e038b5] px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Create Clueprint
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
