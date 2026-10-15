'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Sparkles, Send, ArrowLeft, Play } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Suggest clips that I can extract from this video.',
  'Create 5 clips from this video.',
  'Organize this video into segments of 2-5 minutes each.',
  'Break down this video by topics or chapters.',
  'Extract the most engaging moments from this video.',
  'Take the third clip and split it up into bite-sized highlights',
];

export default function PilotChatDetailPage() {
  const params = useParams<{ id: string }>();
  const chatId = params?.id || 'chat-101';
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/chats/${chatId}`)
      .then(r => r.json())
      .then(d => setMessages(d.messages || []));
  }, [chatId]);

  async function sendPrompt(text: string) {
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch(`/api/chats/${chatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    setInput('');
    setSending(false);
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto flex max-w-3xl flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <Link
            href="/home/chats"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Chats
          </Link>
          <Link
            href="/guide/guide-101"
            className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-1 text-xs font-semibold text-[#e038b5]"
          >
            <Play className="h-3 w-3" /> Open Linked Guide in Studio
          </Link>
        </div>

        {/* Suggested Prompts matching 50-pilot-chat-detail.png */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold text-slate-500">
            Start your conversation by typing a message below. What can I do here?
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => sendPrompt(p)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:border-[#e038b5] hover:bg-pink-50/40"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="mt-6 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-12 bg-slate-900 text-white'
                  : 'mr-12 border border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="mb-1 text-[10px] font-bold uppercase opacity-60">
                {m.role === 'user' ? 'Alex Rivera' : 'Clueso AI Pilot (Opus 5.5)'}
              </div>
              <div className="whitespace-pre-line">{m.content}</div>
            </div>
          ))}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={e => {
            e.preventDefault();
            sendPrompt(input);
          }}
          className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm"
        >
          <Sparkles className="ml-2 h-4 w-4 text-[#e038b5]" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Clueso AI Pilot to extract clips, chapters, or rewrite scripts..."
            className="flex-1 text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-1.5 rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-semibold text-white"
          >
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Clueso AI can make mistakes. It is currently in BETA
        </p>
      </div>
    </WorkspaceShell>
  );
}
