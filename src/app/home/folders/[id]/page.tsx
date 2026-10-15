'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Folder, Play, ArrowLeft } from 'lucide-react';

export default function FolderDetailPage() {
  const params = useParams<{ id: string }>();
  const folderId = params?.id || 'folder-1';
  const [guides, setGuides] = useState<any[]>([]);
  const [folderName, setFolderName] = useState('Customer Onboarding');

  useEffect(() => {
    fetch(`/api/guides?folderId=${folderId}`)
      .then(r => r.json())
      .then(d => {
        setGuides(d.guides || []);
        const found = (d.folders || []).find((f: any) => f.id === folderId);
        if (found) setFolderName(found.name);
      });
  }, [folderId]);

  return (
    <WorkspaceShell>
      <div>
        <Link
          href="/home/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <Folder className="h-6 w-6 text-[#e038b5]" />
          <h1 className="text-2xl font-bold text-slate-900">{folderName}</h1>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-slate-400">
            <div className="col-span-6">Name</div>
            <div className="col-span-3">Last modified</div>
            <div className="col-span-3">Creator</div>
          </div>
          {guides.map(g => (
            <Link
              key={g.id}
              href={`/guide/${g.id}`}
              className="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 last:border-none hover:bg-slate-50"
            >
              <div className="col-span-6 flex items-center gap-3">
                <Play className="h-4 w-4 text-[#e038b5]" />
                <span className="text-sm font-semibold text-slate-900">{g.name}</span>
              </div>
              <div className="col-span-3 text-xs text-slate-500">Just now</div>
              <div className="col-span-3 text-xs text-slate-600">{g.createdBy?.name || 'Alex Rivera'}</div>
            </Link>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
