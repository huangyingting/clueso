'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  Sparkles,
  Volume2,
  Type,
  Square,
  Wand2,
  Film,
  Layout,
  Shuffle,
  Palette,
  Music,
  Subtitles,
  Image as ImageIcon,
  Globe,
  MessageSquare,
  Share2,
  Download,
  ChevronDown,
  Plus,
  CheckCircle2,
  History,
  Undo2,
  Redo2,
  Send,
  X,
  Eye,
  Trash2,
  Copy,
} from 'lucide-react';

type LeftTool =
  | 'script'
  | 'media'
  | 'text'
  | 'shape'
  | 'effects'
  | 'animation'
  | 'template'
  | 'transition'
  | 'background'
  | 'music'
  | 'captions';

const TRANSITION_PRESETS = [
  'Circle wipe',
  'Rainbow wipe',
  'Corner wipe',
  'Color wipe',
  'Stack',
  'Dissolve',
  'Push & pull',
  'Fade to color',
  'Flip',
];

const CAPTION_PRESETS = [
  'Basic',
  'Basic Karaoke',
  'Highlight Box',
  'Karaoke Highlight Box',
  'Color word',
  'Highlight word',
  'Paragraph builder',
  'Word-by-word',
];

const TRANSLATE_LANGUAGES = [
  { badge: '中', name: 'Chinese (Simplified)' },
  { badge: 'En', name: 'English (US)' },
  { badge: 'Fr', name: 'French' },
  { badge: 'De', name: 'German' },
  { badge: 'あ', name: 'Japanese' },
  { badge: 'Es', name: 'Spanish' },
];

const VOICES = [
  { name: 'Brian', accent: 'American · Warm Studio' },
  { name: 'Aria', accent: 'American · Crisp Product' },
  { name: 'Liam', accent: 'British · Narrative' },
  { name: 'Clara', accent: 'Australian · Friendly' },
];

export default function StudioEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const guideId = params?.id || 'guide-101';

  const [guide, setGuide] = useState<any>(null);
  const [title, setTitle] = useState('Customer Onboarding Walkthrough');
  const [mode, setMode] = useState<'video' | 'article'>('video');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [activeTool, setActiveTool] = useState<LeftTool>('script');
  const [clips, setClips] = useState<any[]>([]);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [articleSteps, setArticleSteps] = useState<any[]>([]);
  const [captionsConfig, setCaptionsConfig] = useState<any>({
    enabled: true,
    preset: 'Karaoke Highlight Box',
    fontSize: 22,
    color: '#ffffff',
    highlightColor: '#e038b5',
    position: 'bottom',
  });
  const [canvasBg, setCanvasBg] = useState('from-slate-900 via-indigo-950 to-purple-950');
  const [musicTrack, setMusicTrack] = useState('Ambient Pulse (Studio)');
  const [musicVolume, setMusicVolume] = useState(18);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Top banners & modals
  const [activeBanner, setActiveBanner] = useState<string | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [selectedTranslateLang, setSelectedTranslateLang] = useState('Spanish');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [editorLayout, setEditorLayout] = useState<'Default' | 'Stacked' | 'Compact' | 'AI First'>(
    'Default'
  );

  // Right panel state
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightTab, setRightTab] = useState<'copilot' | 'history' | 'comments'>('copilot');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([
    {
      role: 'assistant',
      content:
        'Hi! I am Clueso AI (Opus 5.5). Ask me to polish your voiceover scripts, add smart zoom keyframes, or translate this guide.',
    },
  ]);
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState('');
  const [aiBusy, setAiBusy] = useState(false);

  // Media & Caption drawer sub-tabs
  const [mediaTab, setMediaTab] = useState<'project' | 'workspace' | 'stock'>('stock');
  const [captionTab, setCaptionTab] = useState<'Style' | 'Content'>('Style');
  const [templateTab, setTemplateTab] = useState<'Templates' | 'Components'>('Templates');
  const [animationTab, setAnimationTab] = useState<'Library' | 'Recents'>('Library');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }

  async function loadGuide() {
    const res = await fetch(`/api/guides/${guideId}`);
    if (!res.ok) return;
    const data = await res.json();
    setGuide(data);
    setTitle(data.title || 'Untitled Guide');
    setAspectRatio(data.aspectRatio || '16:9');
    if (Array.isArray(data.clips) && data.clips.length > 0) {
      setClips(data.clips);
    }
    if (Array.isArray(data.articleSteps) && data.articleSteps.length > 0) {
      setArticleSteps(data.articleSteps);
    }
    if (data.captionsConfig && Object.keys(data.captionsConfig).length > 0) {
      setCaptionsConfig(data.captionsConfig);
    }
  }

  useEffect(() => {
    loadGuide();
  }, [guideId]);

  const totalDuration = clips.reduce((acc, c) => acc + (Number(c.duration) || 5), 0) || 18;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.2 * playbackRate;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          // Determine active clip index from timecode
          let acc = 0;
          for (let i = 0; i < clips.length; i++) {
            const dur = Number(clips[i].duration) || 5;
            if (next >= acc && next <= acc + dur) {
              setActiveClipIndex(i);
              break;
            }
            acc += dur;
          }
          return Number(next.toFixed(1));
        });
      }, 200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackRate, totalDuration, clips]);

  async function saveGuideState(patch: any, message?: string) {
    await fetch(`/api/guides/${guideId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (message) notify(message);
  }

  const activeClip = clips[activeClipIndex] || {
    id: 'clip-1',
    title: 'Welcome & Overview',
    script: 'Welcome to Acme Product Studio. Today we will configure your workspace in 3 steps.',
    voice: 'Brian',
    duration: 5.5,
    transition: 'Dissolve',
    screenType: 'Intro Slide',
    zoomPoints: [],
    overlays: [],
  };

  function updateActiveClip(patch: any, persistMsg?: string) {
    const next = clips.map((c, idx) => (idx === activeClipIndex ? { ...c, ...patch } : c));
    setClips(next);
    saveGuideState({ clips: next }, persistMsg);
  }

  async function handleAiRewrite(idx: number) {
    setAiBusy(true);
    const res = await fetch(`/api/guides/${guideId}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rewrite', clipIndex: idx, tone: 'concise' }),
    });
    const data = await res.json();
    if (data.clips) setClips(data.clips);
    setAiBusy(false);
    notify('AI rewrote script & removed filler words');
  }

  async function handleGenerateSpeech(idx: number, voiceName?: string) {
    setAiBusy(true);
    const res = await fetch(`/api/guides/${guideId}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'tts',
        clipIndex: idx,
        voice: voiceName || clips[idx]?.voice || 'Brian',
      }),
    });
    const data = await res.json();
    if (data.clips) setClips(data.clips);
    setAiBusy(false);
    notify(`Generated studio voiceover (${voiceName || clips[idx]?.voice || 'Brian'})`);
  }

  async function handleMagicTranslate() {
    setAiBusy(true);
    const res = await fetch(`/api/guides/${guideId}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'translate', targetLanguage: selectedTranslateLang }),
    });
    const data = await res.json();
    if (data.clips) setClips(data.clips);
    if (data.articleSteps) setArticleSteps(data.articleSteps);
    setAiBusy(false);
    setShowTranslateModal(false);
    notify(`Translated video & article into ${selectedTranslateLang}`);
  }

  async function handleSendCopilot(promptText?: string) {
    const text = (promptText ?? copilotInput).trim();
    if (!text) return;
    setCopilotInput('');
    setCopilotMessages(prev => [...prev, { role: 'user', content: text }]);
    setAiBusy(true);
    const res = await fetch(`/api/guides/${guideId}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'copilot', prompt: text }),
    });
    const data = await res.json();
    if (data.clips) setClips(data.clips);
    if (data.reply) {
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    }
    setAiBusy(false);
  }

  function handleSplitClip() {
    if (!activeClip) return;
    const halfDur = Number(((Number(activeClip.duration) || 6) / 2).toFixed(1));
    const firstHalf = { ...activeClip, duration: halfDur, title: `${activeClip.title} (Part 1)` };
    const secondHalf = {
      ...activeClip,
      id: `clip-${Date.now()}`,
      duration: halfDur,
      title: `${activeClip.title} (Part 2)`,
    };
    const next = [
      ...clips.slice(0, activeClipIndex),
      firstHalf,
      secondHalf,
      ...clips.slice(activeClipIndex + 1),
    ];
    setClips(next);
    saveGuideState({ clips: next }, 'Split clip at playhead');
  }

  function handleAddClip() {
    const newClip = {
      id: `clip-${Date.now()}`,
      title: `Step ${clips.length + 1}: New Scene`,
      script: 'Next, verify your workspace settings and click Save Changes.',
      voice: 'Brian',
      duration: 5.0,
      transition: 'Dissolve',
      screenType: 'Screen Recording + Zoom',
      zoomPoints: [{ time: 1.5, scale: 1.35, x: 50, y: 40 }],
      overlays: [],
    };
    const next = [...clips, newClip];
    setClips(next);
    setActiveClipIndex(next.length - 1);
    saveGuideState({ clips: next }, 'Added new clip to timeline');
  }

  function addOverlayToActiveClip(type: string, label: string) {
    const existing = Array.isArray(activeClip.overlays) ? activeClip.overlays : [];
    const nextOverlays = [...existing, { id: `ov-${Date.now()}`, type, label }];
    updateActiveClip({ overlays: nextOverlays }, `Added ${label} to Clip ${activeClipIndex + 1}`);
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    await fetch(`/api/guides/${guideId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentText, timestamp: currentTime }),
    });
    setCommentText('');
    await loadGuide();
    notify('Added timestamped comment');
  }

  async function handleCreateVersion() {
    await fetch(`/api/guides/${guideId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: `Snapshot (${new Date().toLocaleTimeString()})` }),
    });
    await loadGuide();
    notify('Saved version snapshot');
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Studio Header Bar matching 60-guide-editor-video.png */}
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2">
        <div className="flex items-center gap-2.5">
          {/* Project Menu Dropdown (62l-top-project-menu.png) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProjectMenu(v => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-[#e038b5] to-indigo-600 text-[10px]">
                ✦
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showProjectMenu && (
              <div className="absolute left-0 top-10 z-50 w-56 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <Link
                  href="/home"
                  className="block rounded-lg px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Back to Home
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectMenu(false);
                    saveGuideState({ title }, 'Project saved');
                  }}
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectMenu(false);
                    notify('Duplicated project');
                  }}
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                >
                  Duplicate Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectMenu(false);
                    setRightPanelOpen(true);
                    setRightTab('history');
                  }}
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                >
                  Version History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectMenu(false);
                    setShowPreferencesModal(true);
                  }}
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                >
                  Editor preferences
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`/api/guides/${guideId}`, { method: 'DELETE' });
                    router.push('/home/projects');
                  }}
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-slate-800"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => saveGuideState({ title }, 'Saved title')}
            className="w-60 rounded-lg border border-transparent bg-transparent px-2 py-1 text-xs font-bold text-white hover:border-slate-700 focus:border-[#e038b5] focus:bg-slate-800 focus:outline-none"
          />

          <select
            value={aspectRatio}
            onChange={e => {
              const next = e.target.value as any;
              setAspectRatio(next);
              saveGuideState({ aspectRatio: next }, `Aspect ratio set to ${next}`);
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200"
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
          </select>
        </div>

        {/* Center Video | Article Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('video')}
              className={`rounded-lg px-3.5 py-1 transition ${
                mode === 'video' ? 'bg-[#e038b5] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setMode('article')}
              className={`rounded-lg px-3.5 py-1 transition ${
                mode === 'article' ? 'bg-[#e038b5] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Article
            </button>
          </div>

          {toast && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> {toast}
            </span>
          )}
        </div>

        {/* Right Top Action Bar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => notify('Undo applied')}
            title="Undo"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => notify('Redo applied')}
            title="Redo"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          {/* Comment Mode button (62j-top-comments.png) */}
          <button
            type="button"
            onClick={() => {
              setActiveBanner('Comment mode');
              setRightPanelOpen(true);
              setRightTab('comments');
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#e038b5]" /> Comments
          </button>

          {/* Magic Translate button (62k-top-translate.png) */}
          <button
            type="button"
            onClick={() => setShowTranslateModal(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <Globe className="h-3.5 w-3.5 text-[#e038b5]" /> Translate
          </button>

          <Link
            href={`/share/${guideId}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </Link>

          <Link
            href={`/export/${guideId}?process=export`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#e038b5] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#c92ba0]"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Link>

          <button
            type="button"
            onClick={() => {
              setRightPanelOpen(v => !v);
              setRightTab('copilot');
            }}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
              rightPanelOpen
                ? 'border-[#e038b5] bg-pink-500/20 text-pink-200'
                : 'border-slate-700 bg-slate-800 text-slate-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#e038b5]" /> Clueso AI
          </button>
        </div>
      </header>

      {/* Active Mode Banner (e.g., "Text active | Exit Esc", "Rectangle active | Exit Esc", "Comment mode | Exit Esc") */}
      {activeBanner && (
        <div className="flex items-center justify-center gap-3 bg-[#e038b5] py-1 text-xs font-bold text-white">
          <span>{activeBanner}</span>
          <button
            type="button"
            onClick={() => setActiveBanner(null)}
            className="rounded bg-black/20 px-2 py-0.5 text-[11px] hover:bg-black/30"
          >
            Exit Esc
          </button>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex flex-1 overflow-hidden">
        {mode === 'video' ? (
          <>
            {/* 1. Left Tool Rail (11 Vertical Tools matching 60-guide-editor-video.png) */}
            <aside className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-slate-800 bg-slate-900 py-2.5">
              {[
                { id: 'script', label: 'Script', icon: Volume2 },
                { id: 'media', label: 'Media', icon: ImageIcon },
                { id: 'text', label: 'Text', icon: Type },
                { id: 'shape', label: 'Shape', icon: Square },
                { id: 'effects', label: 'Effects', icon: Wand2 },
                { id: 'animation', label: 'Animate', icon: Sparkles },
                { id: 'template', label: 'Template', icon: Layout },
                { id: 'transition', label: 'Transition', icon: Shuffle },
                { id: 'background', label: 'Bg', icon: Palette },
                { id: 'music', label: 'Music', icon: Music },
                { id: 'captions', label: 'Captions', icon: Subtitles },
              ].map(tool => {
                const Icon = tool.icon;
                const active = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveTool(tool.id as LeftTool);
                      if (tool.id === 'text') setActiveBanner('Text active');
                      else if (tool.id === 'shape') setActiveBanner('Rectangle active');
                      else setActiveBanner(null);
                    }}
                    className={`flex w-13 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition ${
                      active
                        ? 'bg-[#e038b5]/20 text-[#ff7be0]'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* 2. Left Drawer Panel (310px) for active tool */}
            <section className="flex w-80 shrink-0 flex-col border-r border-slate-800 bg-slate-900/95">
              {/* SCRIPT / VOICEOVER DRAWER (62a-tool-voiceover-script.png) */}
              {activeTool === 'script' && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Script
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAiRewrite(activeClipIndex)}
                        disabled={aiBusy}
                        className="inline-flex items-center gap-1 rounded-lg bg-pink-500/20 px-2.5 py-1 text-[11px] font-semibold text-pink-300 hover:bg-pink-500/30"
                      >
                        <Sparkles className="h-3 w-3" /> AI Rewrite
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateSpeech(activeClipIndex)}
                        disabled={aiBusy}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        Generate speech
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto p-3">
                    {clips.map((clip, idx) => (
                      <div
                        key={clip.id || idx}
                        onClick={() => setActiveClipIndex(idx)}
                        className={`cursor-pointer rounded-xl border p-3 transition ${
                          idx === activeClipIndex
                            ? 'border-[#e038b5] bg-slate-800/90'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                              {idx + 1}
                            </span>
                            <select
                              value={clip.voice || 'Brian'}
                              onChange={e => handleGenerateSpeech(idx, e.target.value)}
                              className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-pink-300"
                            >
                              {VOICES.map(v => (
                                <option key={v.name} value={v.name}>
                                  {v.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="text-[10px] text-slate-400">{clip.duration}s</span>
                        </div>

                        <textarea
                          rows={3}
                          value={clip.script}
                          onChange={e => {
                            const next = clips.map((c, i) =>
                              i === idx ? { ...c, script: e.target.value } : c
                            );
                            setClips(next);
                          }}
                          onBlur={() => saveGuideState({ clips }, 'Updated clip script')}
                          className="mt-2 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 p-2 text-xs leading-relaxed text-slate-100 focus:border-[#e038b5] focus:outline-none"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddClip}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 py-2.5 text-xs font-semibold text-slate-400 hover:border-[#e038b5] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add script step
                    </button>
                  </div>
                </div>
              )}

              {/* MEDIA DRAWER (62b-tool-media.png) */}
              {activeTool === 'media' && (
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-bold text-white">Media</h3>
                  <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-slate-800 p-1 text-[11px] font-semibold">
                    {[
                      { id: 'project', label: 'In this project' },
                      { id: 'workspace', label: 'Saved' },
                      { id: 'stock', label: 'Stock' },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMediaTab(t.id as any)}
                        className={`rounded py-1 ${
                          mediaTab === t.id ? 'bg-slate-950 text-white' : 'text-slate-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2.5 text-xs">
                    {['Music', 'Backgrounds', 'Abstract', 'Montage'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          addOverlayToActiveClip('media', `${cat} B-Roll Asset`)
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-[#e038b5]"
                      >
                        <span className="font-semibold text-slate-200">{cat}</span>
                        <span className="text-[10px] text-slate-400">+ Insert</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-auto text-[11px] text-slate-500">
                    Photos and videos provided by Pexels
                  </p>
                </div>
              )}

              {/* TEXT DRAWER (62c-tool-text.png) */}
              {activeTool === 'text' && (
                <div className="space-y-3 p-4">
                  <h3 className="text-sm font-bold text-white">Text Overlays</h3>
                  <p className="text-xs text-slate-400">
                    Click any preset below to add a styled text layer to Clip {activeClipIndex + 1}.
                  </p>
                  {[
                    'Headline Callout',
                    'Step Number Badge',
                    'Keyboard Shortcut Pill (⌘K)',
                    'Lower Third Title',
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addOverlayToActiveClip('text', preset)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-left text-xs font-semibold text-slate-200 hover:border-[#e038b5]"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              )}

              {/* SHAPE DRAWER (62d-tool-shapes.png) */}
              {activeTool === 'shape' && (
                <div className="space-y-3 p-4">
                  <h3 className="text-sm font-bold text-white">Shapes & Pointers</h3>
                  {[
                    'Pink Highlight Rectangle',
                    'Animated Pointer Arrow',
                    'Numbered Hotspot Circle',
                    ' Redaction Banner',
                  ].map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => addOverlayToActiveClip('shape', shape)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-left text-xs font-semibold text-slate-200 hover:border-[#e038b5]"
                    >
                      + {shape}
                    </button>
                  ))}
                </div>
              )}

              {/* EFFECTS DRAWER (62e-tool-effects.png: Blur, Callout, Spotlight, Zoom) */}
              {activeTool === 'effects' && (
                <div className="space-y-3 p-4">
                  <h3 className="text-sm font-bold text-white">Effects</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['Blur', 'Callout', 'Spotlight', 'Zoom'] as const).map(effect => (
                      <button
                        key={effect}
                        type="button"
                        onClick={() => {
                          if (effect === 'Zoom') {
                            const nextZooms = [
                              ...(activeClip.zoomPoints || []),
                              { time: currentTime, scale: 1.45, x: 52, y: 38 },
                            ];
                            updateActiveClip(
                              { zoomPoints: nextZooms },
                              `Added Smart Zoom keyframe at ${currentTime}s`
                            );
                          } else {
                            addOverlayToActiveClip('effect', effect);
                          }
                        }}
                        className="flex h-24 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-[#e038b5]"
                      >
                        <Wand2 className="mb-1.5 h-5 w-5 text-[#e038b5]" />
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ANIMATION DRAWER (62f-tool-animation.png) */}
              {activeTool === 'animation' && (
                <div className="space-y-4 p-4">
                  <h3 className="text-sm font-bold text-white">Animation</h3>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800 p-1 text-xs font-semibold">
                    {(['Library', 'Recents'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAnimationTab(t)}
                        className={`rounded py-1 ${
                          animationTab === t ? 'bg-slate-950 text-white' : 'text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addOverlayToActiveClip('animation', 'Clueso AI Motion Graphic')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e038b5] to-indigo-600 py-2.5 text-xs font-bold text-white"
                  >
                    <Sparkles className="h-4 w-4" /> New animation with Clueso AI
                  </button>
                </div>
              )}

              {/* TEMPLATE DRAWER (62g-tool-template.png) */}
              {activeTool === 'template' && (
                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800 p-1 text-xs font-semibold">
                    {(['Templates', 'Components'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTemplateTab(t)}
                        className={`rounded py-1 ${
                          templateTab === t ? 'bg-slate-950 text-white' : 'text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {['Default Intro', 'Default Outro', 'Feature Spotlight Card'].map(tpl => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => addOverlayToActiveClip('template', tpl)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-left text-xs font-semibold text-slate-200 hover:border-[#e038b5]"
                    >
                      {tpl}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => notify('Saved current clip as workspace template')}
                    className="w-full rounded-xl border border-slate-700 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Save current clip as template
                  </button>
                </div>
              )}

              {/* TRANSITIONS DRAWER (62h-tool-transition.png) */}
              {activeTool === 'transition' && (
                <div className="space-y-3 p-4">
                  <h3 className="text-sm font-bold text-white">Transitions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSITION_PRESETS.map(tr => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() =>
                          updateActiveClip(
                            { transition: tr },
                            `Applied "${tr}" transition to Clip ${activeClipIndex + 1}`
                          )
                        }
                        className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                          activeClip.transition === tr
                            ? 'border-[#e038b5] bg-pink-500/20 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BACKGROUND DRAWER */}
              {activeTool === 'background' && (
                <div className="space-y-3 p-4">
                  <h3 className="text-sm font-bold text-white">Canvas Background</h3>
                  {[
                    { label: 'Obsidian Indigo', cls: 'from-slate-900 via-indigo-950 to-purple-950' },
                    { label: 'Clueso Pink Glow', cls: 'from-pink-950 via-purple-950 to-slate-950' },
                    { label: 'Emerald Studio', cls: 'from-slate-900 via-emerald-950 to-teal-950' },
                    { label: 'Sunset Coral', cls: 'from-rose-950 via-amber-950 to-slate-900' },
                  ].map(bg => (
                    <button
                      key={bg.label}
                      type="button"
                      onClick={() => {
                        setCanvasBg(bg.cls);
                        notify(`Canvas background set to ${bg.label}`);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs font-semibold text-slate-200 hover:border-[#e038b5]"
                    >
                      <span className={`h-6 w-10 rounded bg-gradient-to-r ${bg.cls}`} />
                      {bg.label}
                    </button>
                  ))}
                </div>
              )}

              {/* MUSIC DRAWER */}
              {activeTool === 'music' && (
                <div className="space-y-4 p-4">
                  <h3 className="text-sm font-bold text-white">Background Music</h3>
                  {[
                    'Ambient Pulse (Studio)',
                    'Crisp SaaS Walkthrough',
                    'Lo-Fi Product Beats',
                    'None (Voiceover Only)',
                  ].map(track => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => {
                        setMusicTrack(track);
                        notify(`Selected music: ${track}`);
                      }}
                      className={`w-full rounded-xl border p-3 text-left text-xs font-semibold ${
                        musicTrack === track
                          ? 'border-[#e038b5] bg-pink-500/20 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-300'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                  <div>
                    <label className="text-xs text-slate-400">
                      Auto-Ducking Volume ({musicVolume}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={musicVolume}
                      onChange={e => setMusicVolume(Number(e.target.value))}
                      className="mt-1 w-full accent-[#e038b5]"
                    />
                  </div>
                </div>
              )}

              {/* CAPTIONS DRAWER (62i-tool-captions.png) */}
              {activeTool === 'captions' && (
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Captions</h3>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(captionsConfig.enabled)}
                        onChange={e => {
                          const next = { ...captionsConfig, enabled: e.target.checked };
                          setCaptionsConfig(next);
                          saveGuideState({ captionsConfig: next }, 'Updated caption visibility');
                        }}
                        className="accent-[#e038b5]"
                      />
                      Visibility
                    </label>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-800 p-1 text-xs font-semibold">
                    {(['Style', 'Content'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCaptionTab(t)}
                        className={`rounded py-1 ${
                          captionTab === t ? 'bg-slate-950 text-white' : 'text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {captionTab === 'Style' ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {CAPTION_PRESETS.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const next = { ...captionsConfig, preset };
                            setCaptionsConfig(next);
                            saveGuideState(
                              { captionsConfig: next },
                              `Caption style set to ${preset}`
                            );
                          }}
                          className={`rounded-xl border p-2.5 text-left text-xs font-semibold ${
                            captionsConfig.preset === preset
                              ? 'border-[#e038b5] bg-pink-500/20 text-white'
                              : 'border-slate-800 bg-slate-950 text-slate-300'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2 text-xs text-slate-300">
                      {clips.map((c, i) => (
                        <div key={c.id || i} className="rounded-lg bg-slate-950 p-2.5">
                          <div className="text-[10px] font-bold text-pink-400">Clip {i + 1}</div>
                          <div className="mt-1">{c.script}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => notify('Downloaded captions (.SRT)')}
                      className="flex-1 rounded-lg border border-slate-700 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      Download SRT
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTranslateModal(true)}
                      className="flex-1 rounded-lg bg-[#e038b5] py-1.5 text-xs font-semibold text-white"
                    >
                      Translate
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* 3. Center Video Canvas + Bottom Multi-Track Timeline */}
            <main className="flex flex-1 flex-col overflow-hidden bg-slate-950">
              {/* Interactive Stage */}
              <div className="flex flex-1 items-center justify-center p-6">
                <div
                  className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${canvasBg} p-6 shadow-2xl transition-all duration-500 ${
                    aspectRatio === '9:16'
                      ? 'h-full w-72'
                      : aspectRatio === '1:1'
                      ? 'h-96 w-96'
                      : 'aspect-video w-full max-w-3xl'
                  }`}
                >
                  {/* Top Overlay Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-black/50 px-3 py-1 font-semibold text-slate-200 backdrop-blur">
                      Clip {activeClipIndex + 1}: {activeClip.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {activeClip.transition && (
                        <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-200">
                          Transition: {activeClip.transition}
                        </span>
                      )}
                      {(activeClip.zoomPoints || []).length > 0 && (
                        <span className="rounded-full bg-pink-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-pink-200">
                          Smart Zoom 1.4x
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Simulated Product UI Frame with Auto-Zoom transform */}
                  <div
                    className="my-auto mx-auto w-full max-w-xl rounded-xl border border-white/15 bg-slate-900/90 p-5 shadow-2xl transition-transform duration-500"
                    style={{
                      transform:
                        (activeClip.zoomPoints || []).length > 0 && isPlaying
                          ? 'scale(1.12)'
                          : 'scale(1)',
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="ml-2 text-xs font-semibold text-slate-300">
                          app.acme.io · {activeClip.screenType || 'Screen Recording'}
                        </span>
                      </div>
                      <span className="rounded bg-[#e038b5]/20 px-2 py-0.5 text-[10px] font-bold text-[#ff7be0]">
                        Voice: {activeClip.voice || 'Brian'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div className="text-sm font-bold text-white">{activeClip.title}</div>
                      <div className="h-2 w-2/3 rounded bg-slate-800" />
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(activeClip.overlays || []).map((ov: any) => (
                          <span
                            key={ov.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#e038b5] bg-pink-500/20 px-2.5 py-1 text-xs font-bold text-pink-200"
                          >
                            ✦ {ov.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Synchronized Karaoke Caption Bar */}
                  {captionsConfig.enabled && (
                    <div className="mx-auto max-w-xl text-center">
                      <span className="inline-block rounded-xl bg-black/75 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        <span className="rounded bg-[#e038b5] px-1.5 py-0.5 text-white">
                          {activeClip.script?.split(' ').slice(0, 3).join(' ')}
                        </span>{' '}
                        {activeClip.script?.split(' ').slice(3).join(' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Track Timeline Dock at Bottom */}
              <div className="h-52 shrink-0 border-t border-slate-800 bg-slate-900 px-4 py-2.5">
                {/* Transport Controls Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSplitClip}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      <Scissors className="h-3.5 w-3.5" /> Split
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextZooms = [
                          ...(activeClip.zoomPoints || []),
                          { time: currentTime, scale: 1.4, x: 50, y: 50 },
                        ];
                        updateActiveClip({ zoomPoints: nextZooms }, 'Added Zoom Keyframe');
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      + Zoom Keyframe
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentTime(0)}
                      className="text-slate-400 hover:text-white"
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(p => !p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e038b5] text-white hover:bg-[#c92ba0]"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTime(totalDuration)}
                      className="text-slate-400 hover:text-white"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-slate-300">
                      00:{currentTime.toFixed(1).padStart(4, '0')} / 00:
                      {totalDuration.toFixed(1).padStart(4, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={playbackRate}
                      onChange={e => setPlaybackRate(Number(e.target.value))}
                      className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-200"
                    >
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                  </div>
                </div>

                {/* 3 Synchronized Tracks */}
                <div className="mt-2.5 space-y-1.5">
                  {/* Track 1: Overlays & Zoom Keyframes */}
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] font-bold uppercase text-slate-500">
                      Effects
                    </span>
                    <div className="flex flex-1 gap-2">
                      {clips.map((c, idx) => (
                        <div
                          key={`fx-${c.id || idx}`}
                          className="flex flex-1 items-center gap-1 rounded bg-indigo-950/60 px-2 py-1 text-[10px] text-indigo-300"
                        >
                          <span>Zoom ({(c.zoomPoints || []).length})</span>
                          <span>· Overlays ({(c.overlays || []).length})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Track 2: Main Video Clips */}
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] font-bold uppercase text-slate-500">
                      Video Clips
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      {clips.map((c, idx) => (
                        <button
                          key={c.id || idx}
                          type="button"
                          onClick={() => setActiveClipIndex(idx)}
                          className={`flex flex-1 items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                            idx === activeClipIndex
                              ? 'border-[#e038b5] bg-pink-500/20 text-white'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span className="truncate">
                            {idx + 1}. {c.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.duration}s</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddClip}
                        className="rounded-lg border border-dashed border-slate-700 px-3 py-2 text-xs font-bold text-slate-400 hover:border-[#e038b5] hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Track 3: Voiceover & Music */}
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] font-bold uppercase text-slate-500">
                      Audio / TTS
                    </span>
                    <div className="flex flex-1 gap-2">
                      {clips.map((c, idx) => (
                        <div
                          key={`aud-${c.id || idx}`}
                          className="flex flex-1 items-center justify-between rounded bg-emerald-950/50 px-2.5 py-1 text-[10px] text-emerald-300"
                        >
                          <span>🎙 {c.voice || 'Brian'}</span>
                          <span className="tracking-widest opacity-60">▁▃▅▂▇▄▆▂</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          /* ARTICLE MODE EDITOR (matching 61-guide-editor-article.png) */
          <main className="flex-1 overflow-y-auto bg-slate-50 p-8 text-slate-900">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#e038b5]">
                    Interactive SOP Article
                  </span>
                  <h1 className="mt-2 text-2xl font-extrabold text-slate-900">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch(`/api/guides/${guideId}/ai`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'enhance-article' }),
                      });
                      const data = await res.json();
                      if (data.articleSteps) setArticleSteps(data.articleSteps);
                      notify('Enhanced article steps with AI');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e038b5] to-indigo-600 px-3.5 py-2 text-xs font-bold text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Enhance Article with AI
                  </button>
                  <button
                    type="button"
                    onClick={() => notify('Copied Markdown to clipboard')}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Markdown
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {articleSteps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e038b5] text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={e => {
                          const next = articleSteps.map((s, i) =>
                            i === idx ? { ...s, title: e.target.value } : s
                          );
                          setArticleSteps(next);
                        }}
                        onBlur={() => saveGuideState({ articleSteps }, 'Saved article step')}
                        className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-base font-bold text-slate-900 focus:border-slate-300 focus:bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={e => {
                        const next = articleSteps.map((s, i) =>
                          i === idx ? { ...s, description: e.target.value } : s
                        );
                        setArticleSteps(next);
                      }}
                      onBlur={() => saveGuideState({ articleSteps }, 'Saved article description')}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"
                    />
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-white">
                      <span>Annotated Step Screenshot #{idx + 1}</span>
                      <span className="rounded-full bg-[#e038b5] px-2.5 py-0.5 font-bold">
                        {step.callout || 'Click Highlighted Element'}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...articleSteps,
                      {
                        id: `step-${Date.now()}`,
                        stepNumber: articleSteps.length + 1,
                        title: `Step ${articleSteps.length + 1}: Verify Deployment`,
                        description: 'Confirm your changes are live in production.',
                        callout: 'Save & Publish',
                      },
                    ];
                    setArticleSteps(next);
                    saveGuideState({ articleSteps: next }, 'Added article step');
                  }}
                  className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-600 hover:border-[#e038b5] hover:text-[#e038b5]"
                >
                  + Add Article Step
                </button>
              </div>
            </div>
          </main>
        )}

        {/* 4. Right Panel: Clueso AI Co-Pilot / Version History / Comments */}
        {rightPanelOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5">
              <div className="flex gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRightTab('copilot')}
                  className={`rounded-lg px-2.5 py-1 ${
                    rightTab === 'copilot' ? 'bg-[#e038b5] text-white' : 'text-slate-400'
                  }`}
                >
                  Clueso AI
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('comments')}
                  className={`rounded-lg px-2.5 py-1 ${
                    rightTab === 'comments' ? 'bg-[#e038b5] text-white' : 'text-slate-400'
                  }`}
                >
                  Comments
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('history')}
                  className={`rounded-lg px-2.5 py-1 ${
                    rightTab === 'history' ? 'bg-[#e038b5] text-white' : 'text-slate-400'
                  }`}
                >
                  History
                </button>
              </div>
              <button
                type="button"
                onClick={() => setRightPanelOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {rightTab === 'copilot' && (
              <div className="flex flex-1 flex-col overflow-hidden p-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {[
                    'Polish all scripts',
                    'Add zoom keyframes',
                    'Translate to Spanish',
                  ].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSendCopilot(chip)}
                      className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-pink-300 hover:border-[#e038b5]"
                    >
                      ✦ {chip}
                    </button>
                  ))}
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 text-xs">
                  {copilotMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-3 ${
                        m.role === 'user'
                          ? 'ml-4 bg-[#e038b5] text-white'
                          : 'mr-2 border border-slate-800 bg-slate-950 text-slate-200'
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendCopilot();
                  }}
                  className="mt-2 flex gap-1.5"
                >
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={e => setCopilotInput(e.target.value)}
                    placeholder="Edit with Clueso AI..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-[#e038b5] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#e038b5] px-3 py-2 text-white hover:bg-[#c92ba0]"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}

            {rightTab === 'comments' && (
              <div className="flex flex-1 flex-col overflow-hidden p-3">
                <div className="flex-1 space-y-2.5 overflow-y-auto text-xs">
                  {(guide?.comments || []).map((c: any) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{c.authorName}</span>
                        <span className="rounded bg-pink-500/20 px-1.5 py-0.5 font-mono text-pink-300">
                          @{c.timestamp}s
                        </span>
                      </div>
                      <p className="mt-1 text-slate-300">{c.content}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddComment} className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={`Add comment at ${currentTime}s...`}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#e038b5] px-3 py-2 text-xs font-bold text-white"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}

            {rightTab === 'history' && (
              <div className="flex flex-1 flex-col p-3">
                <button
                  type="button"
                  onClick={handleCreateVersion}
                  className="mb-3 w-full rounded-xl bg-[#e038b5] py-2 text-xs font-bold text-white"
                >
                  + Save Version Snapshot
                </button>
                <div className="space-y-2 overflow-y-auto text-xs">
                  {(guide?.versions || []).map((v: any) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <div className="font-bold text-white">{v.label}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {new Date(v.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Magic Translate Modal matching 62k-top-translate.png */}
      {showTranslateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Magic translate</h3>
            <p className="mt-1 text-xs text-slate-400">
              Translate your video and article to any language below
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {TRANSLATE_LANGUAGES.map(l => (
                <button
                  key={l.name}
                  type="button"
                  onClick={() => setSelectedTranslateLang(l.name)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold ${
                    selectedTranslateLang === l.name
                      ? 'border-[#e038b5] bg-pink-500/20 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-[11px] font-bold text-pink-300">
                    {l.badge}
                  </span>
                  <span className="truncate">{l.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/home/settings/translations"
                className="text-xs font-semibold text-pink-400 hover:underline"
              >
                Customize translation rules
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTranslateModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMagicTranslate}
                  className="rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-bold text-white"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h3 className="text-lg font-bold text-white">Editor preferences</h3>
            <p className="mt-1 text-xs text-slate-400">Choose your Studio workspace layout</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {(['Default', 'Stacked', 'Compact', 'AI First'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setEditorLayout(l);
                    notify(`Layout switched to ${l}`);
                  }}
                  className={`rounded-xl border p-3 text-left text-xs font-bold ${
                    editorLayout === l
                      ? 'border-[#e038b5] bg-pink-500/20 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="rounded-xl bg-[#e038b5] px-4 py-2 text-xs font-bold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
