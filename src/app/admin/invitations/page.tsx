'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import {
  MailPlus,
  Copy,
  RefreshCw,
  UserX,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

type InvitationItem = {
  id: string;
  email: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  invitedBy?: { id: string; name: string | null } | null;
  acceptedBy?: { id: string; name: string | null } | null;
};

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [admissionMode, setAdmissionMode] = useState('invitation-only');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [expiresAt, setExpiresAt] = useState('');
  const [pending, setPending] = useState(false);
  const [rowPending, setRowPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [latestLink, setLatestLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/invitations')
      .then(r => r.json())
      .then(d => {
        if (d.invitations) setInvitations(d.invitations);
        if (d.admissionMode) setAdmissionMode(d.admissionMode);
      })
      .catch(() => {});
  }, []);

  function mergeInvitation(inv: InvitationItem) {
    setInvitations(curr => {
      const exists = curr.some(item => item.id === inv.id);
      return exists ? curr.map(item => (item.id === inv.id ? { ...item, ...inv } : item)) : [inv, ...curr];
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError('');
    setLatestLink('');
    setCopied(false);

    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          role,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create invitation.');
      } else {
        mergeInvitation(data.invitation);
        setLatestLink(data.acceptUrl || '');
        setEmail('');
        setExpiresAt('');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not create invitation.');
    } finally {
      setPending(false);
    }
  }

  async function handleRotate(id: string) {
    setRowPending(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/invitations/${encodeURIComponent(id)}/rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not rotate invitation.');
      } else {
        mergeInvitation(data.invitation);
        setLatestLink(data.acceptUrl || '');
        setCopied(false);
      }
    } finally {
      setRowPending(null);
    }
  }

  async function handleRevoke(id: string) {
    setRowPending(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/invitations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not revoke invitation.');
      } else {
        mergeInvitation(data.invitation);
      }
    } finally {
      setRowPending(null);
    }
  }

  async function copyLink() {
    if (!latestLink) return;
    await navigator.clipboard.writeText(latestLink).catch(() => {});
    setCopied(true);
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-5xl space-y-6 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#e038b5]">
              <ShieldCheck className="h-3.5 w-3.5" /> Admission Mode: {admissionMode}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Account Invitations</h1>
            <p className="text-xs text-slate-500">
              Generate one-time SHA-256 hashed invitation links for new workspace members. Invitations expire after 7 days unless customized.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/bootstrap"
              className="rounded-xl border border-pink-200 bg-pink-50/70 px-4 py-2 text-xs font-semibold text-[#e038b5] hover:bg-pink-100"
            >
              Bootstrap Admin
            </Link>
            <Link
              href="/home/settings/manage-users"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Workspace Users
            </Link>
          </div>
        </div>

        {/* Create Invitation Card */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-900">Create invitation</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Send a one-time registration link. Invitations expire after seven days unless you choose a custom date.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email *</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colleague@acme.io"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Workspace Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
              >
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Expiry (optional)</label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#e038b5] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Leave expiry blank to use 7 days.
            </span>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e038b5] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              <MailPlus className="h-4 w-4" />
              {pending ? 'Creating...' : 'Create invitation'}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {latestLink && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Invitation link created
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Copy and share this one-time link securely. This raw link is shown only for this response.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                readOnly
                aria-label="Invitation link"
                value={latestLink}
                onFocus={e => e.currentTarget.select()}
                className="flex-1 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 font-mono text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy link'}
              </button>
              <Link
                href={new URL(latestLink, 'http://localhost:3000').pathname}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open link
              </Link>
            </div>
          </div>
        )}

        {/* Invitation History */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Invitation history</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Pending invitations can be rotated or revoked. Terminal records stay visible for audit.
          </p>

          {invitations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No invitations yet. Create an invitation above to admit a new member.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-[11px] uppercase text-slate-400">
                  <tr>
                    <th className="pb-2.5">Email</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Created</th>
                    <th className="pb-2.5">Expires</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitations.map(inv => (
                    <tr key={inv.id}>
                      <td className="py-3 font-semibold text-slate-900">{inv.email}</td>
                      <td className="py-3 text-slate-600">{inv.role}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            inv.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700'
                              : inv.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : inv.status === 'REVOKED'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inv.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-slate-500">
                        {new Date(inv.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        {inv.status === 'PENDING' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={rowPending !== null}
                              onClick={() => handleRotate(inv.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <RefreshCw className="h-3 w-3" /> Rotate
                            </button>
                            <button
                              type="button"
                              disabled={rowPending !== null}
                              onClick={() => handleRevoke(inv.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              <UserX className="h-3 w-3" /> Revoke
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
