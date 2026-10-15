'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import {
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  UserPlus,
  Github,
  GitBranch,
  Slack,
  Youtube,
  Globe,
  Lock,
} from 'lucide-react';

const SETTINGS_TABS = [
  { label: 'Admin', href: '/home/settings/general', key: 'general' },
  { label: 'Profile', href: '/home/settings/profile', key: 'profile' },
  { label: 'Billing', href: '/home/settings/billing', key: 'billing' },
  { label: 'Users', href: '/home/settings/manage-users', key: 'manage-users' },
  { label: 'Teams', href: '/home/settings/manage-teams', key: 'manage-teams' },
  { label: 'AI & Voice', href: '/home/settings/providers', key: 'providers' },
  { label: 'Video defaults', href: '/home/settings/video-settings', key: 'video-settings' },
  { label: 'Pronunciations', href: '/home/settings/pronunciation-dictionary', key: 'pronunciation-dictionary' },
  { label: 'Translations', href: '/home/settings/translations', key: 'translations' },
  { label: 'Transcriptions', href: '/home/settings/transcription-keywords', key: 'transcription-keywords' },
  { label: 'Video player', href: '/home/settings/customize-player', key: 'customize-player' },
  { label: 'View only links', href: '/home/settings/viewonlylinks/appearance', key: 'viewonlylinks' },
  { label: 'Integrations', href: '/home/settings/integrations', key: 'integrations' },
  { label: 'Connections', href: '/home/settings/connections', key: 'connections' },
];

export default function WorkspaceSettingsPage() {
  const params = useParams<{ slug?: string[] }>();
  const slugParts = params?.slug || ['general'];
  const primarySection = slugParts[0] || 'general';
  const subSection = slugParts[1] || 'appearance';

  const [ws, setWs] = useState<any>(null);
  const [teamName, setTeamName] = useState('Acme Product Studio');
  const [openDoor, setOpenDoor] = useState(true);
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newGlossaryTerm, setNewGlossaryTerm] = useState('');
  const [billingSubTab, setBillingSubTab] = useState<'Overview' | 'Usage' | 'AI Credits'>('Overview');
  const [playerConfig, setPlayerConfig] = useState<any>({
    accentColor: '#e038b5',
    timestampBadge: true,
    restartButton: true,
    rewind10sButton: true,
    seekbar: true,
    volumeControl: true,
    captionsToggle: true,
    chaptersToggle: true,
    playbackSpeed: true,
    pipToggle: true,
    fullscreenToggle: true,
  });
  const [videoDefaults, setVideoDefaults] = useState<any>({
    autoRewriteScript: true,
    autoGenerateSpeech: true,
    enableComments: true,
    generateCaptionsByDefault: true,
  });
  const [toast, setToast] = useState('');

  async function loadWorkspace() {
    const res = await fetch('/api/workspace');
    const data = await res.json();
    setWs(data);
    if (data.organization?.name) setTeamName(data.organization.name);
    if (data.organization?.openDoor !== undefined) setOpenDoor(data.organization.openDoor);
    if (data.user?.name) setProfileName(data.user.name);
    if (data.playerConfig && Object.keys(data.playerConfig).length > 0) {
      setPlayerConfig(data.playerConfig);
    }
    if (data.videoDefaults && Object.keys(data.videoDefaults).length > 0) {
      setVideoDefaults(data.videoDefaults);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function savePatch(payload: any, msg = 'Settings updated') {
    await fetch('/api/workspace', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await loadWorkspace();
    notify(msg);
  }

  return (
    <WorkspaceShell>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Workspace settings</h1>
          {toast && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> {toast}
            </span>
          )}
        </div>

        {/* Horizontal Settings Tabs matching 30-settings-general.png */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
          {SETTINGS_TABS.map(t => {
            const active =
              primarySection === t.key ||
              (primarySection === 'permissions' && t.key === 'general') ||
              (primarySection === 'kb-config' && t.key === 'translations');
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {/* Section Content */}
        <div className="mt-6">
          {(primarySection === 'general' || primarySection === 'permissions') && (
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-base font-bold text-white">
                  AP
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700">Team name</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      className="w-72 rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => savePatch({ name: teamName }, 'Team name updated')}
                      className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-900">Who can join this workspace</h3>
                <div className="mt-3 space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDoor(true);
                      savePatch({ openDoor: true }, 'Domain auto-join enabled');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left font-medium ${
                      openDoor ? 'border-[#e038b5] bg-pink-50/40' : 'border-slate-200'
                    }`}
                  >
                    <span>Anyone with a company email address (@acme.io)</span>
                    {openDoor && <CheckCircle2 className="h-4 w-4 text-[#e038b5]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDoor(false);
                      savePatch({ openDoor: false }, 'Invite-only mode enabled');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left font-medium ${
                      !openDoor ? 'border-[#e038b5] bg-pink-50/40' : 'border-slate-200'
                    }`}
                  >
                    <span>Only people who are invited</span>
                    {!openDoor && <CheckCircle2 className="h-4 w-4 text-[#e038b5]" />}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-rose-600">Danger zone</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Leave workspace — You&apos;ll lose access to all projects, videos, and shared assets.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Leave Workspace
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600"
                  >
                    Delete workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {primarySection === 'profile' && (
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">{profileName}</h3>
                <p className="text-xs text-slate-500">alex@acme.io</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Name</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-72 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => savePatch({ action: 'update-profile', name: profileName })}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Update
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Email ID</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs">alex@acme.io</code>
                  <button
                    type="button"
                    onClick={() => notify('Copied email!')}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy email
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => notify('Password reset link sent to alex@acme.io')}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}

          {primarySection === 'billing' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Billing</h2>
                <div className="inline-flex rounded-xl border border-slate-200 p-1 text-xs font-semibold">
                  {(['Overview', 'Usage', 'AI Credits'] as const).map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setBillingSubTab(sub)}
                      className={`rounded-lg px-3 py-1 ${
                        billingSubTab === sub ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Plan</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900">Enterprise</div>
                  <div className="mt-1 text-[11px] text-slate-500">Next payment on Jan 1, 2027</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Seats</div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900">
                    4 in use / 25 purchased
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-600">21 seats available</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">AI Credits</div>
                  <div className="mt-1 text-xl font-extrabold text-[#e038b5]">48,200 / 50,000</div>
                  <div className="mt-1 text-[11px] text-slate-500">Opus 5.5 + ElevenLabs Pool</div>
                </div>
              </div>
            </div>
          )}

          {primarySection === 'manage-users' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Users ({ws?.organization?.users?.length || 4})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage your team members and invitation-only admission links.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/admin/invitations"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold text-[#e038b5] hover:bg-pink-100"
                  >
                    Manage Invite Links →
                  </Link>
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      if (!inviteEmail.trim()) return;
                      const target = inviteEmail.trim();
                      setInviteEmail('');
                      await savePatch(
                        { action: 'invite-user', email: target, role: 'Editor' },
                        `Invited ${target}`
                      );
                      const invRes = await fetch('/api/admin/invitations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: target, role: 'Editor' }),
                      }).catch(() => null);
                      if (invRes?.ok) {
                        const invData = await invRes.json();
                        if (invData.acceptUrl) {
                          notify(`Invite link ready: ${invData.acceptUrl}`);
                        }
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="teammate@acme.io"
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Invite users
                    </button>
                  </form>
                </div>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {(ws?.organization?.users || []).map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span>{u.name}</span>
                        {u.status === 'pending' && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                    <select
                      value={u.role}
                      onChange={e =>
                        savePatch(
                          { action: 'update-user-role', userId: u.id, role: e.target.value },
                          `Updated ${u.name} to ${e.target.value}`
                        )
                      }
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {primarySection === 'manage-teams' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manage Teams</h2>
                  <p className="text-xs text-slate-500">
                    Teams are collaborative environments with your colleagues
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Created new collaborative team')}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Create team
                </button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                    AP
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{teamName}</span>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Leave Team
                </button>
              </div>
            </div>
          )}

          {primarySection === 'providers' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">AI & Voice</h2>
              <p className="text-xs text-slate-500">
                Choose which AI and voice services your workspace uses. Set one as the default in each category.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-900">AI Model Provider</div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Used for AI features like rewrite, motion graphics, and image generation.
                  </p>
                  <select className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs">
                    <option>Anthropic Claude Opus 5.5 (Default)</option>
                    <option>Anthropic Claude Sonnet 4.5</option>
                    <option>OpenAI GPT-5</option>
                  </select>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-900">Voice Synthesis Engine</div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Used for speech generation and multilingual dubbing.
                  </p>
                  <select className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs">
                    <option>ElevenLabs Multilingual v2.5 (Default)</option>
                    <option>Cartesia Sonic</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {primarySection === 'video-settings' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Video defaults</h2>
                <p className="text-xs text-slate-500">
                  These settings apply to videos made by everyone across your team.
                </p>
              </div>
              {[
                {
                  key: 'autoRewriteScript',
                  title: 'Auto-rewrite script',
                  desc: 'Automatically rewrite and enhance scripts using AI.',
                },
                {
                  key: 'autoGenerateSpeech',
                  title: 'Auto-generate speech',
                  desc: 'Automatically generate a studio voiceover using your default voice (Brian).',
                },
                {
                  key: 'enableComments',
                  title: 'Enable comments on videos',
                  desc: 'Allow teammates and viewers to leave timestamped comments.',
                },
                {
                  key: 'generateCaptionsByDefault',
                  title: 'Generate captions by default',
                  desc: 'Automatically enable synchronized Karaoke captions on every new project.',
                },
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(videoDefaults[item.key])}
                    onChange={e => {
                      const next = { ...videoDefaults, [item.key]: e.target.checked };
                      setVideoDefaults(next);
                      savePatch({ videoDefaults: next });
                    }}
                    className="h-4 w-4 accent-[#e038b5]"
                  />
                </label>
              ))}
            </div>
          )}

          {primarySection === 'pronunciation-dictionary' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pronunciations</h2>
                <p className="text-xs text-slate-500">
                  Teach the voiceover engine how to say specific words
                </p>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newWord.trim() || !newPhonetic.trim()) return;
                  savePatch(
                    {
                      action: 'add-pronunciation',
                      word: newWord,
                      phonetic: newPhonetic,
                      language: 'English (US)',
                    },
                    `Added pronunciation rule for ${newWord}`
                  );
                  setNewWord('');
                  setNewPhonetic('');
                }}
                className="flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                  placeholder="Word (e.g., Clueso)"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={newPhonetic}
                  onChange={e => setNewPhonetic(e.target.value)}
                  placeholder="Sounds like (e.g., KLOO-soh)"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" /> New word
                </button>
              </form>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {(ws?.organization?.pronunciations || []).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{p.word}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <span className="rounded bg-pink-50 px-2 py-0.5 font-mono text-[#e038b5]">
                        {p.phonetic}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => savePatch({ action: 'delete-pronunciation', id: p.id })}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {primarySection === 'transcription-keywords' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Transcription Keywords</h2>
                <p className="text-xs text-slate-500">
                  Specify how certain words should be transcribed for brand names or technical terms.
                </p>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newKeyword.trim()) return;
                  savePatch(
                    { action: 'add-keyword', keyword: newKeyword, category: 'Brand' },
                    `Added keyword ${newKeyword}`
                  );
                  setNewKeyword('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  placeholder="e.g., Clueprints, Gatepass, SAML"
                  className="w-72 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" /> New keyword
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {(ws?.organization?.transcriptionWords || []).map((k: any) => (
                  <span
                    key={k.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold"
                  >
                    {k.keyword}
                    <button
                      type="button"
                      onClick={() => savePatch({ action: 'delete-keyword', id: k.id })}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {(primarySection === 'translations' || primarySection === 'kb-config') && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Translations & Glossary Rules
                </h2>
                <p className="text-xs text-slate-500">
                  Configure Do-Not-Translate brand terms and default localization languages.
                </p>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newGlossaryTerm.trim()) return;
                  savePatch(
                    { action: 'add-translation-term', term: newGlossaryTerm },
                    `Added glossary term ${newGlossaryTerm}`
                  );
                  setNewGlossaryTerm('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newGlossaryTerm}
                  onChange={e => setNewGlossaryTerm(e.target.value)}
                  placeholder="Do-not-translate term (e.g., Acme Studio)"
                  className="w-72 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Add Term
                </button>
              </form>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {(ws?.organization?.translationGlossary || []).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <span className="font-semibold text-slate-900">{t.term}</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Do Not Translate
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {primarySection === 'customize-player' && (
            <div className="grid gap-6 md:grid-cols-12">
              {/* Interactive Player Preview matching 44-settings-customize-player.png */}
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white md:col-span-7">
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-center">
                  <h3 className="text-lg font-bold">
                    How would you like to customize your video player?
                  </h3>
                  <button
                    type="button"
                    style={{ backgroundColor: playerConfig.accentColor || '#e038b5' }}
                    className="mt-4 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
                  >
                    <Play className="h-5 w-5 fill-white" />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    {playerConfig.timestampBadge && <span className="rounded bg-slate-800 px-2 py-0.5">00:04 / 00:18</span>}
                    {playerConfig.restartButton && <span>↺ Restart</span>}
                    {playerConfig.rewind10sButton && <span>« 10s</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {playerConfig.captionsToggle && <span className="rounded bg-slate-800 px-1.5 py-0.5">CC</span>}
                    {playerConfig.playbackSpeed && <span>1x</span>}
                    {playerConfig.fullscreenToggle && <span>⛶</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-5 md:col-span-5">
                <h3 className="text-sm font-bold text-slate-900">Player Controls</h3>
                {[
                  { key: 'timestampBadge', label: 'Timestamp badge' },
                  { key: 'restartButton', label: 'Restart button' },
                  { key: 'rewind10sButton', label: 'Rewind 10s button' },
                  { key: 'seekbar', label: 'Seekbar' },
                  { key: 'volumeControl', label: 'Volume control' },
                  { key: 'captionsToggle', label: 'Captions toggle' },
                  { key: 'chaptersToggle', label: 'Chapters toggle' },
                  { key: 'playbackSpeed', label: 'Playback speed' },
                  { key: 'pipToggle', label: 'PiP toggle' },
                  { key: 'fullscreenToggle', label: 'Fullscreen toggle' },
                ].map(ctrl => (
                  <label key={ctrl.key} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{ctrl.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(playerConfig[ctrl.key])}
                      onChange={e => {
                        const next = { ...playerConfig, [ctrl.key]: e.target.checked };
                        setPlayerConfig(next);
                        savePatch({ playerConfig: next });
                      }}
                      className="h-4 w-4 accent-[#e038b5]"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {primarySection === 'viewonlylinks' && (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 text-xs font-semibold">
                <Link
                  href="/home/settings/viewonlylinks/appearance"
                  className={subSection === 'appearance' ? 'text-[#e038b5]' : 'text-slate-500'}
                >
                  Appearance
                </Link>
                <Link
                  href="/home/settings/viewonlylinks/domain"
                  className={subSection === 'domain' ? 'text-[#e038b5]' : 'text-slate-500'}
                >
                  Domain
                </Link>
                <Link
                  href="/home/settings/viewonlylinks/auth"
                  className={subSection === 'auth' ? 'text-[#e038b5]' : 'text-slate-500'}
                >
                  Authentication
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-900">Shared Page Theme</div>
                  <p className="mt-1 text-[11px] text-slate-500">Clean Light with Acme CTA button</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Globe className="h-3.5 w-3.5 text-[#e038b5]" /> Custom Domain
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">videos.acme.io (SSL Active)</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Lock className="h-3.5 w-3.5 text-[#e038b5]" /> Access Control
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Public link or SAML SSO gated</p>
                </div>
              </div>
            </div>
          )}

          {(primarySection === 'integrations' || primarySection === 'connections') && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <Slack className="h-6 w-6 text-[#e038b5]" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Slack</div>
                    <div className="text-xs text-slate-500">
                      Auto-reply to queries and broadcast videos to your customers on Slack
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Slack connected (#product-videos)')}
                  className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  Connected
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <Youtube className="h-6 w-6 text-rose-600" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">YouTube</div>
                    <div className="text-xs text-slate-500">
                      Publish your videos directly to your YouTube channel from Clueso
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notify('YouTube channel linked')}
                  className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  Connected
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <Github className="h-6 w-6 text-slate-900" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">GitHub</div>
                    <div className="text-xs text-slate-500">
                      Sync repos from Github to power your video agents
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notify('GitHub repository connected')}
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-800"
                >
                  Connect GitHub
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Bitbucket</div>
                    <div className="text-xs text-slate-500">Sync repos from Bitbucket</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Bitbucket repository connected')}
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-800"
                >
                  Connect Bitbucket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
