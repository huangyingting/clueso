'use client';

import React, { useEffect, useState } from 'react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { RotateCcw, Trash2 } from 'lucide-react';

export default function TrashPage() {
  const [guides, setGuides] = useState<any[]>([]);

  async function loadTrash() {
    const res = await fetch('/api/guides?trash=true');
    const data = await res.json();
    setGuides(data.guides || []);
  }

  useEffect(() => {
    loadTrash();
  }, []);

  async function handleRestore(id: string) {
    await fetch(`/api/guides/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    });
    loadTrash();
  }

  async function handlePermanentDelete(id: string) {
    await fetch(`/api/guides/${id}`, { method: 'DELETE' });
    loadTrash();
  }

  return (
    <WorkspaceShell>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Trash</h1>
        <p className="mt-1 text-xs text-slate-500">Items in trash get cleared in 30 days.</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-slate-400">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Last modified</div>
            <div className="col-span-2">Date created</div>
            <div className="col-span-2 text-right">Creator</div>
          </div>

          {guides.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No deleted items in trash.
            </div>
          ) : (
            guides.map(g => (
              <div
                key={g.id}
                className="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 last:border-none"
              >
                <div className="col-span-6 text-sm font-semibold text-slate-800">{g.name}</div>
                <div className="col-span-2 text-xs text-slate-500">Today</div>
                <div className="col-span-2 text-xs text-slate-500">Apr 20, 2026</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(g.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3 w-3" /> Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePermanentDelete(g.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
