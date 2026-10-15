# Product Requirements Document (PRD) — Clueso Platform Clone

## 1. Product Vision
Clueso is an AI-powered Video & Documentation Studio that transforms raw screen recordings, slide decks, and text prompts into studio-grade product videos and step-by-step help articles in minutes—complete with AI script rewriting, ElevenLabs-style realistic voiceovers, smart auto-zooms, animated callouts/spotlights/blurs, dynamic karaoke captions, reusable Clueprints, Brand Kits, AI Agents, MCP integrations, and 1-click multi-language dubbing.

---

## 2. User Personas
1. **Product Marketer / Customer Education Lead (Alex Rivera, Admin)**: Records rough product walkthroughs, applies brand kits and Clueprints, polishes voiceovers and zooms, translates into 30+ languages, and embeds videos/articles into the company Help Center.
2. **Product Manager / Engineer (Sarah Chen, Editor)**: Connects Clueso MCP to Claude Code / Cursor or uses the Home AI Prompt (`What are we creating today?`) to auto-generate release notes videos and documentation.
3. **Workspace Administrator**: Configures team members, roles, SSO, custom domains, view-only link authentication, custom player controls, pronunciation dictionaries, and transcription keywords.

---

## 3. Functional Requirements by Surface

### 3.1 Marketing Website (Public Routes)
Captured in `screenshots/marketing/01-home.png` through `14-changelog.png`:
- **Global Navigation & Footer**: Clueso logo, `Product` megamenu (`Video`, `Help Articles`, `Translate`, `Voiceovers`, `Slides to Video`, `Clueso Agent`, `Clueprints`, `MCP`), `Resources` (`Customers`, `Showcase`, `Changelog`), `Pricing`, `Enterprise`, `Sign In`, and `Start Free Trial` CTA.
- **Landing Page (`/`)**:
  - Hero: *"Product videos in minutes with AI. Transform raw screen recordings into stunning videos & documentation."*
  - Interactive "Rough recording -> With Clueso" comparison player.
  - 6 Core AI Capabilities: Remove Filler Words, AI Voiceovers, Smart Auto-Zooms, Polished Captions, Branded Callouts & Blurs, Synchronized Step-by-Step Articles.
  - Social proof wall (Phenom, Samsara, Darwinbox, Global Partners, G2 4.9/5 badges).
- **Pricing Page (`/pricing`)**: Billing cycle toggle (`Yearly - Save 20%` vs `Monthly`), 4 tiers (`Free`, `Starter $120/mo`, `Growth $200/mo`, `Enterprise Custom`), feature comparison matrix, and FAQ accordion.
- **Dedicated Product & Feature Pages**:
  - `/enterprise`, `/agents`, `/mcp`, `/clueprints`
  - `/features/video`, `/features/help-articles`, `/features/translate`, `/features/voiceovers`, `/features/slides-to-video`
  - `/customers`, `/showcase`, `/changelog`

### 3.2 Authentication & Onboarding (`/login`, `/signup`, `/welcome/*`)
Captured in `screenshots/marketing/15-auth-signup.png`..`16b-auth-login-sso.png` and `screenshots/webapp/80-welcome-about-you.png`:
- **Sign In (`/login`) & Sign Up (`/signup`)**:
  - `Continue with Google`, `Continue with Microsoft`, `Continue with SSO` (SAML domain lookup), and Email + Password form.
  - 1-Click Demo Login (`Sign in as Alex Rivera — Acme Product Studio`) preloaded with demo identity (`alex@acme.io`).
- **Welcome / Onboarding Flow (`/welcome/goals`, `/welcome/about-you`, `/welcome/about-work`)**:
  - Step 1-4 wizard selecting creation goals (Customer Onboarding, Product Updates, Internal Training, Help Center Articles), role, and brand URL extraction.

### 3.3 Workspace Shell & Navigation (`/home/*`)
Captured in `screenshots/webapp/10-home-dashboard.png` through `25-home-folder-detail.png`:
- **Left Sidebar**:
  - Primary nav: `Home`, `Projects`, `Agent`, `Chats`, `MCP`, `Clueprints`, `Brand kit`, `Analytics`, `Settings`.
  - Bottom capacity card (`Get more out of Clueso — Upgrade for more capacity`) and Organization switcher (`AP Acme Product Studio — Paid subscription`).
- **Top Header**:
  - Sidebar collapse button, global `Search anything... ⌘K` trigger, Account avatar menu, `Help` button, `Clueso AI` button, and pink `+ New project` dropdown (`Record your screen`, `Upload videos`, `Upload slide decks`, `Translate`).
- **Home Dashboard (`/home`)**:
  - *"What are we creating today?"* AI prompt composer with `+` attachment button, screen recording trigger, `Ask` mode selector, model selector (`Opus 5.5`, `Sonnet 4.5`, `GPT-5`), and pink submit button that creates a new project or AI chat.
  - `OR START DIRECTLY` 4 action cards: `Record your screen` (interactive browser Screen Recorder / simulated capture modal), `Upload videos`, `Upload slide decks`, `Translate`.
  - Recent Projects grid & quick-launch templates.
- **Projects & Folders (`/home/projects`, `/home/folders/[id]`, `/home/trash`)**:
  - Tabs: `All` | `Deleted`.
  - Filter pills: `All types`, `All creators`, `Tags`, `Created`, `Modified`, sort dropdown (`Last modified (newest)`), and `+ New folder` modal.
  - `Folders` section (`Customer Onboarding`, `Product Releases (Q2 2026)`) + `Projects` table/grid with tag pills, creator avatar, relative timestamps, and row actions (Open in Studio, Duplicate, Move to Folder, Export, Move to Trash, Restore).
- **Clueprints (`/home/clueprints`)**:
  - Reusable video templates (`Workspace` | `Community` tabs) + `+ New clueprint` creator from existing guide or scratch.
- **Brand Kit & Visual Style (`/home/brand`, `/home/visual-style`)**:
  - `Pull your brand from URL` (`https://acme.io` -> `Refetch`) + editable brand palette colors, typography (`Inter`, `Plus Jakarta Sans`, `JetBrains Mono`), logos, default background padding/corner radius, and default voiceover style.
- **Clueso Agent (`/home/agent`)**:
  - *"Hey Alex, Meet Clueso Agent"* interactive autonomous video agent runner where users can dispatch an autonomous recording/editing run against a URL or PR description and watch live step progress.
- **Chats (`/home/chats` & `/chat/[id]`)**:
  - List of Clueso AI Pilot conversations + full `/chat/[id]` Pilot interface with suggested video extraction prompts (`Suggest clips that I can extract from this video`, `Create 5 clips from this video`, `Break down this video by topics or chapters`).
- **MCP Integration Hub (`/home/mcp`)**:
  - Connection status toggle (`Connected` / `Disconnect`), Connection URL (`https://connect.clueso.io/mcp`), interactive client tabs (`Claude`, `ChatGPT`, `Claude Code`, `Codex`, `Cursor`, `Gemini CLI`, `VS Code`) with copyable setup commands, capability cards, and clickable `"Prompts to try"`.
- **Clueso Cuts (`/home/cuts`) & Analytics (`/home/analytics`)**:
  - Interactive plan-gated view with toggleable Enterprise preview mode showing full video analytics (Total Views, Unique Viewers, Avg Completion Rate, Watch Time chart, per-guide retention) and AI Cuts clip extraction.

### 3.4 Workspace Settings (`/home/settings/*` — 18 Routes)
Captured in `screenshots/webapp/30-settings-general.png` through `47-settings-viewonlylinks-auth.png`:
- **Horizontal Settings Navigation Bar**:
  - `Admin` (`/home/settings/general`, `/home/settings/profile`, `/home/settings/permissions`, `/home/settings/manage-teams`)
  - `Billing` (`/home/settings/billing` — `Overview`, `Usage`, `AI Credits`, Enterprise seat counter)
  - `Users` (`/home/settings/manage-users` — Member list, role selector `Admin`/`Editor`/`Viewer`, `+ Invite users` modal, Pending invitations)
  - `AI & Voice` (`/home/settings/providers` — Default AI model & Voice synthesis engine selection)
  - `Video defaults` (`/home/settings/video-settings` — Auto-rewrite script, Auto-generate speech, Default voice, Comments scope, Captions toggle, Auto-zoom, Callouts)
  - `Pronunciations` (`/home/settings/pronunciation-dictionary` — Custom phonetic rules per language with audio preview & `+ New word`)
  - `Translations` (`/home/settings/translations` & `/home/settings/kb-config` — Target languages, Do-not-translate glossary terms, Knowledge Base URL config)
  - `Transcriptions` (`/home/settings/transcription-keywords` — Custom vocabulary keywords for ASR accuracy)
  - `Video player` (`/home/settings/customize-player` — Live interactive video player preview + 10 control toggles: Timestamp badge, Restart, Rewind 10s, Seekbar, Volume, Captions, Chapters, Playback speed, PiP, Fullscreen + brand accent color)
  - `View only links` (`/home/settings/viewonlylinks/appearance`, `/domain`, `/auth` — Shared page header/theme, Custom CNAME domain, Password/SSO protection)
  - `Connections` (`/home/settings/integrations`, `/home/settings/connections` — Slack, Sanity, YouTube, Zendesk, Intercom, GitHub, Bitbucket)

### 3.5 Clueso Studio Editor (`/guide/[id]`)
Captured in `screenshots/webapp/60-studio-editor-video-mode.png` through `62l-top-project-menu.png`:
- **Top Bar**:
  - `Project menu` dropdown (`Back to Home`, `Duplicate Project`, `Move to folder`, `Save`, `View original media`, `Keyboard Shortcuts`, `Editor preferences` [Classic vs Simplified layout modal], `Version History`, `Delete Project`).
  - Inline editable Guide Title + Cloud save indicator.
  - Segmented Mode Switcher: `Video` | `Article`.
  - Action buttons: `Comments` (toggles Comment mode & right-hand timestamped comments feed), `Translate` (opens `Magic translate` modal with Chinese, English, French, German, Japanese, Spanish + Customize translation rules), `Clueso AI` co-pilot toggle, and pink `Share` button (Export MP4, Publish Link, Embed Code, Share permissions).
- **11-Tool Left Icon Rail & Contextual Drawers (Video Mode)**:
  1. `Select` (`V`): Select, drag, resize, and edit canvas elements.
  2. `Hand tool` (`H`): Pan around zoomed canvas.
  3. `Voiceover script`: Searchable per-clip script cards (`1`, `2`, `3`) with clip title, voice badge (`Brian`, `Sarah`, `Lily` — clicking opens Voice Picker popover), audio waveform preview, word-level synchronized transcript editor, `AI Rewrite` button, `+ Add clip`, and `Generate speech` button.
  4. `Media`: Tabs (`In this project`, `Saved in workspace`, `Stock`), filters (`All sources`, `All types`, `Any ratio`), and categories (`Music`, `Backgrounds`, `Abstract`, `Montage`, Upload media).
  5. `Text`: Activates `Text active | Exit Esc` mode and inserts customizable heading/body/badge text overlays onto the active clip.
  6. `Shapes`: Activates `Rectangle active | Exit Esc` mode and inserts Rectangle, Circle, Arrow, or Highlight Callout shapes onto the active clip.
  7. `Effects`: 4 one-click studio effects (`Blur`, `Callout`, `Spotlight`, `Zoom` keyframe) added to the timeline and canvas.
  8. `Animation`: `Library` | `Recents` + `New animation with Clueso AI` motion graphic generator.
  9. `Template`: `Templates` | `Components`, `Saved` | `Library`, `Default Intro` | `Default Outro`, and `Save current clip as template`.
  10. `Transition`: 9 clip transitions (`Circle wipe`, `Rainbow wipe`, `Corner wipe`, `Color wipe`, `Stack`, `Dissolve`, `Push & pull`, `Fade to color`, `Flip`).
  11. `Captions`: `Style` | `Content` tabs, 8 caption presets (`Basic`, `Basic Karaoke`, `Highlight Box`, `Karaoke Highlight Box`, `Color word`, `Highlight word`, `Paragraph builder`, `Word-by-word`), plus `Download SRT`, `Translate`, and `Visibility` toggle.
- **Center Interactive Stage**:
  - Top toolbar: Aspect Ratio selector (`16:9`, `9:16`, `1:1`), Canvas Zoom (`50%`, `75%`, `100%`, `Fit`), Background color/padding inspector.
  - Live HTML5 Video + interactive SVG/DOM Overlay Canvas rendering text boxes, callout rectangles, blur masks, spotlight cutouts, smooth cursor trails, zoom transforms, transitions, and live karaoke captions synchronized to current playback time.
- **Right Panel (`Clueso AI` Co-Pilot & `Version History` & `Comments`)**:
  - `Clueso AI`: *"How would you like to shape this project?"* quick actions (`Polish this video`, `Make new videos from it`, `Brand and reach`), model selector (`Opus 5.5`), and interactive chat that directly edits the current guide.
  - `Version History`: List of numbered versions (`v5`, `v4`, ...) with 1-click restore and snapshot creation.
- **Bottom Multi-Track Timeline**:
  - Transport bar: Jump to start `|<`, Prev frame `<`, `Play / Pause`, Next frame `>`, Jump to end `>|`, Timecode `00:00:00f / 00:18:12f`, Speed (`0.5x`, `1x`, `1.5x`, `2x`), Loop playback, `High res` badge, Split clip (`S`), Undo/Redo, Add Zoom Keyframe diamond, Delete element/clip, Timeline zoom slider, Collapse timeline.
  - Ruler (`0s`..`23s`) with draggable red playhead, purple overlay tracks (Text, Effects, Zooms), blue clip filmstrip track, and `+` Add Clip button.
- **Article Mode (`?activeFormat=article`)**:
  - Synchronized rich-text documentation editor displaying numbered procedural steps, annotated screenshots with red callout markers, callout boxes (Info/Warning/Tip), Markdown/HTML export, and AI Article Rewrite (`Enhance with Clueso AI`).

### 3.6 Export, Publish & Embed (`/export/[id]`)
Captured in `screenshots/webapp/70-export-page-export.png` through `72-export-page-embed.png`:
- Supports `?process=export` (`Here's your export! Click above to download your video` + MP4/GIF download & resolution selector), `?process=publish` (`Your publish is ready! You can share it using the link below` + public share page `/share/[id]`), and `?process=embed` (`Your embed code is generated` + copyable responsive `<iframe>` snippet + `PREVIOUS RENDERS` list).
