'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';

export default function VisualStylePage() {
  const router = useRouter();
  const [override, setOverride] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#e038b5');
  const [font, setFont] = useState('Inter');

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-2xl pt-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Pick a style for visuals in your video
        </h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              checked={override}
              onChange={e => setOverride(e.target.checked)}
              className="h-4 w-4 accent-[#e038b5]"
            />
            Override style with custom font and color
          </label>

          {override && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Font Family</label>
                <select
                  value={font}
                  onChange={e => setFont(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  <option value="Inter">Inter</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">Accent Color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-slate-300 p-1"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={() => router.push('/guide/guide-101')}
              className="rounded-xl bg-[#e038b5] px-5 py-2 text-xs font-semibold text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
