'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, UserPlus, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

type InvitationView = {
  id: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired' | 'invalid';
  email: string | null;
  maskedEmail: string | null;
  role: string | null;
  organizationName: string | null;
  expiresAt: string | null;
};

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const token = decodeURIComponent(String(params?.token || ''));
  const router = useRouter();

  const [invitation, setInvitation] = useState<InvitationView | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/auth/invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (!active) return;
        if (data.invitation) {
          setInvitation(data.invitation);
          if (data.invitation.email) {
            setEmail(data.invitation.email);
          }
        } else {
          setError(data.error || 'The invitation could not be verified.');
        }
      })
      .catch(() => {
        if (active) setError('The invitation could not be verified.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'The invitation could not be accepted.');
        setSubmitting(false);
        return;
      }

      await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });
      router.push('/welcome/about-you');
    } catch (err: any) {
      setError(err?.message || 'The invitation could not be accepted.');
      setSubmitting(false);
    }
  }

  const statusMessages: Record<string, string> = {
    accepted: 'This invitation has already been used.',
    revoked: 'This invitation was revoked by an administrator.',
    expired: 'This invitation has expired.',
    invalid: 'This invitation is invalid or no longer active.',
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e038b5] to-[#7c3aed] text-white shadow">
              <Sparkles className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Accept your invitation</h1>
          <p className="mt-1 text-xs text-slate-500">
            Create your password to finish joining Clueso AI Studio.
          </p>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#e038b5]" />
              Checking invitation...
            </div>
          ) : invitation?.status !== 'pending' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>
                  <p className="font-semibold">Invitation unavailable</p>
                  <p className="mt-0.5">
                    {error || statusMessages[invitation?.status || 'invalid']}
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Return to Log in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleAccept} className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-pink-200 bg-pink-50/70 p-3.5 text-xs text-slate-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#e038b5]" />
                <div>
                  <p className="font-semibold text-slate-900">
                    This invitation is for <span className="text-[#e038b5]">{invitation.maskedEmail}</span>
                  </p>
                  <p className="mt-0.5 text-slate-500">
                    Workspace: <strong className="text-slate-700">{invitation.organizationName || 'Acme Product Studio'}</strong> · Role: <strong className="text-slate-700">{invitation.role || 'Editor'}</strong>
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Invited Email <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Enter the full email address that received this invitation.
                </p>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="elena@acme.io"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="8 to 128 characters"
                  minLength={8}
                  maxLength={128}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {submitting ? 'Accepting invitation...' : 'Accept invitation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
