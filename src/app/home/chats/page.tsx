'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { MessageSquare, Plus, ChevronDown } from 'lucide-react';

export default function ChatsListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/chats')
      .then(r => r.json())
      .then(d => setChats(d.chats || []));
  }, []);

  async function handleNewChat() {
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Suggest clips that I can extract from this video.',
        model: 'Opus 5.5',
      }),
    });
    const data = await res.json();
    if (data.chat?.id) {
      router.push(`/chat/${data.chat.id}`);
    }
  }

  return (
    <WorkspaceShell>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Chats</h1>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> New chat
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs">
          {['Created', 'Modified', 'Alex Rivera'].map(f => (
            <button
              key={f}
              type="button"
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700"
            >
              <span>{f}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2.5">
          {chats.map(c => (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-2xs hover:border-[#e038b5]"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-[#e038b5]" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Model: {c.model} • Created by {c.createdBy?.name || 'Alex Rivera'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#e038b5]">Open Pilot →</span>
            </Link>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
