'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, ArrowRight, Lock, KeyRound, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [admissionMode, setAdmissionMode] = useState<'invitation-only' | 'public'>('invitation-only');
  const [inviteInput, setInviteInput] = useState('');
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('Acme Product Studio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/register')
      .then(r => r.json())
      .then(d => {
        if (d.admissionMode === 'public' || d.admissionMode === 'invitation-only') {
          setAdmissionMode(d.admissionMode);
        }
      })
      .catch(() => {});
  }, []);

  function handleContinueWithInvite(e: React.FormEvent) {
    e.preventDefault();
    const raw = inviteInput.trim();
    if (!raw) return;
    const match = raw.match(/\/invite\/([^/?#]+)/);
    const token = match ? match[1] : raw;
    router.push(`/invite/${encodeURIComponent(token)}`);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const targetEmail = email.trim() || `alex+${Date.now().toString().slice(-4)}@acme.io`;
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: targetEmail,
        password: password || 'clueso123',
        workspaceName,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    await signIn('credentials', {
      redirect: false,
      email: targetEmail,
      password: password || 'clueso123',
    });
    setLoading(false);
    router.push('/welcome/about-you');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e038b5] to-[#7c3aed] text-white shadow">
              <Sparkles className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Create your Clueso account</h1>
          <p className="mt-1 text-xs text-slate-500">
            Make studio-grade product videos and step-by-step documentation with AI.
          </p>
        </div>

        {admissionMode === 'invitation-only' ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Lock className="h-4 w-4 text-amber-600" />
                Invitation-Only Registration
              </div>
              <p className="mt-1.5 leading-relaxed text-amber-800">
                Clueso is currently invitation-only. Use the personal invitation link sent by an administrator to create your account.
              </p>
            </div>

            <form onSubmit={handleContinueWithInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Have an invitation link or token?
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={e => setInviteInput(e.target.value)}
                    placeholder="Paste /invite/... link or token"
                    required
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-[#e038b5] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-4 py-2.5 text-xs font-semibold text-white shadow hover:opacity-95"
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Accept
                  </button>
                </div>
              </div>
            </form>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-800">Workspace Administrator?</p>
              <p className="mt-0.5">
                Sign in with your administrator account and generate one-time invitation links under{' '}
                <Link href="/admin/invitations" className="font-semibold text-[#e038b5] underline">
                  Admin Invitations
                </Link>{' '}
                or{' '}
                <Link href="/home/settings/manage-users" className="font-semibold text-[#e038b5] underline">
                  Settings → Users
                </Link>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <ShieldAlert className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@acme.io"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
            >
              {loading ? 'Creating workspace...' : 'Sign up with Email'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#e038b5] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
