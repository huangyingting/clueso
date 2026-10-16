'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, KeyRound, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex@acme.io');
  const [password, setPassword] = useState('clueso123');
  const [ssoMode, setSsoMode] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('acme.io');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email: ssoMode ? 'alex@acme.io' : email,
      password: password || 'demo',
      ssoDomain: ssoMode ? ssoDomain : '',
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid credentials. Use alex@acme.io / clueso123 or click 1-Click Demo Login.');
    } else {
      router.push('/home');
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    await signIn('credentials', {
      redirect: false,
      email: 'alex@acme.io',
      password: 'demo',
    });
    router.push('/home');
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
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Log in to Clueso</h1>
          <p className="mt-1 text-xs text-slate-500">
            Welcome back! Sign in to your Acme Product Studio workspace.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            onClick={() => setSsoMode(v => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <KeyRound className="h-4 w-4 text-slate-500" />
            <span>{ssoMode ? 'Use Email & Password' : 'Continue with SAML SSO'}</span>
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {ssoMode ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700">Company Domain</label>
              <input
                type="text"
                value={ssoDomain}
                onChange={e => setSsoDomain(e.target.value)}
                placeholder="acme.io"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#e038b5] focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e038b5] to-[#c026d3] px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            {loading ? 'Signing in...' : ssoMode ? 'Continue with SSO' : 'Log in with Email'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="mt-3 w-full rounded-xl border border-pink-200 bg-pink-50/70 px-4 py-2 text-xs font-semibold text-[#e038b5] hover:bg-pink-100"
        >
          Instant Demo Login (alex@acme.io — Acme Product Studio)
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#e038b5] hover:underline">
            Sign up
          </Link>
          {' · '}
          <Link href="/admin/bootstrap" className="font-semibold text-slate-700 hover:underline">
            Bootstrap Admin
          </Link>
        </p>
      </div>
    </div>
  );
}
