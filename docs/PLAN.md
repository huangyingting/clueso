# Implementation Plan (PLAN) — Clueso Platform Clone

## Phase 1: Project Scaffolding, Dual-DB Prisma Setup & Seed Data (`scaffold-db-auth`)
1. Initialize Next.js 15 App Router with TypeScript and Tailwind CSS in `/home/azadmin/clueso`.
2. Configure Prisma ORM with:
   - `prisma/schema.prisma` (`provider = "sqlite"`, `url = env("DATABASE_URL")` pointing to `file:./dev.db` for local dev).
   - `prisma/schema.postgres.prisma` (`provider = "postgresql"`, `url = env("DATABASE_URL")` for production PostgreSQL deployment).
   - Helper scripts in `package.json`: `db:push`, `db:seed`, `db:use:sqlite`, `db:use:postgres`.
3. Create deterministic seed script (`prisma/seed.ts`) populating:
   - Default Admin User (`Alex Rivera`, `alex@acme.io`) + Team Members (`Sarah Chen`, `Marcus Vance`, `Elena`).
   - Default Enterprise Organization (`Acme Product Studio`, `acme.io`, Brand Kit, Custom Player settings, Pronunciations, Transcription Keywords, Translation Glossary).
   - 2 Folders (`Customer Onboarding`, `Product Releases (Q2 2026)`).
   - 3 Rich Multi-Clip Guides (`Product Onboarding Walkthrough`, `Release 2.4 AI Co-Pilot Feature Tour`, `Configuring SAML SSO & SCIM Provisioning`) with complete `guideClips`, word-level timestamps, canvas elements, zoom keyframes, version snapshots, exports, and step-by-step articles.
   - Clueprints, Templates, and Pilot Chat threads.
4. Implement NextAuth.js (`/api/auth/[...nextauth]`) with Credentials, 1-Click Demo Login, Google/Microsoft OAuth support, and SAML SSO lookup.

## Phase 2: Marketing Site & Auth Portal (`implement-core-platform` — Part A)
1. Build shared Marketing Header (with Product & Features dropdowns) and Footer matching `clueso.io`.
2. Implement `/` Landing Page (`Product videos in minutes with AI`, interactive `Rough recording vs With Clueso` comparison demo, 6 AI feature showcases, customer logos, G2 badges, CTA sections).
3. Implement `/pricing`, `/enterprise`, `/agents`, `/mcp`, `/clueprints`, `/features/[slug]` (`video`, `help-articles`, `translate`, `voiceovers`, `slides-to-video`), `/customers`, `/showcase`, and `/changelog`.
4. Implement `/login` and `/signup` matching `accounts.clueso.io` (Google, Microsoft, SAML SSO, Email/Password, and 1-Click Demo Login).

## Phase 3: Workspace Shell, Home Dashboard, Projects, Brand Kit, Agent, Chats, MCP & 18 Settings Pages (`implement-core-platform` — Part B)
1. Build Workspace Shell (`Left Sidebar` with `Home`, `Projects`, `Agent`, `Chats`, `MCP`, `Clueprints`, `Brand kit`, `Analytics`, `Settings`, capacity widget, org switcher + `Top Bar` with `Search anything... ⌘K` global modal, `Help`, `Clueso AI`, `+ New project` dropdown, and interactive Screen Recorder / Upload modal).
2. Implement `/home` (`What are we creating today?` prompt composer with model selector `Opus 5.5` + `Record your screen`, `Upload videos`, `Upload slide decks`, `Translate` cards).
3. Implement `/home/projects`, `/home/folders/[id]`, and `/home/trash` with live folder creation, tag filtering, search, soft delete, restore, duplicate, and open in Studio.
4. Implement `/home/clueprints`, `/home/templates`, `/home/brand` (with live URL brand extractor), `/home/visual-style`, `/home/agent` (interactive autonomous video creation workflow), `/home/chats` & `/chat/[id]` (Pilot AI chat), `/home/cuts`, `/home/analytics`, `/home/mcp` (with 7 IDE setup tabs & live MCP tester), and `/welcome/[step]`.
5. Implement all 18 `/home/settings/*` pages with horizontal settings navigation bar (`Admin`, `Billing`, `Users`, `AI & Voice`, `Video defaults`, `Pronunciations`, `Translations`, `Transcriptions`, `Video player` with live interactive player preview, `View only links` [Appearance, Domain, Auth], `Integrations`, `Connections`).

## Phase 4: Clueso Studio Editor (`/guide/[id]`) & Export/Publish/Embed (`/export/[id]`) (`implement-core-platform` — Part C)
1. Implement `/guide/[id]` Top Bar:
   - `Project menu` (`Back to Home`, `Duplicate Project`, `Move to folder`, `Save`, `View original media`, `Keyboard Shortcuts`, `Editor preferences` [Classic vs Simplified layout modal], `Version History`, `Delete Project`).
   - Inline title editor, `Video | Article` segmented switch, `Comments` mode toggle, `Translate` (`Magic translate` modal), `Clueso AI` toggle, and pink `Share` popover.
2. Implement all 11 Left Rail tools & drawers:
   - `Select` (`V`), `Hand tool` (`H`), `Voiceover script` (numbered clip cards, `Brian`/`Sarah`/`Lily` voice picker, `AI Rewrite`, `Generate speech`, `+ Add clip`), `Media` (`In this project | Saved in workspace | Stock`), `Text` (`Text active | Exit Esc`), `Shapes` (`Rectangle active | Exit Esc`), `Effects` (`Blur`, `Callout`, `Spotlight`, `Zoom`), `Animation` (`Library | Recents`, `New animation with Clueso AI`), `Template` (`Templates | Components`), `Transition` (9 transitions: `Circle wipe`, `Rainbow wipe`, `Corner wipe`, `Color wipe`, `Stack`, `Dissolve`, `Push & pull`, `Fade to color`, `Flip`), and `Captions` (8 styles: `Basic`, `Basic Karaoke`, `Highlight Box`, `Karaoke Highlight Box`, `Color word`, `Highlight word`, `Paragraph builder`, `Word-by-word`).
3. Implement Interactive Video Stage & Multi-Track Timeline:
   - Aspect Ratio (`16:9`, `9:16`, `1:1`), Zoom (`100%`), HTML5 video synchronized with interactive overlay elements (drag/edit/delete text, callouts, blurs, spotlights), smooth zoom keyframes, and karaoke captions.
   - Transport controls (`Play/Pause`, frame step, timecode `00:00:00f / 00:18:12f`, `1x` speed, loop, `High res`, Split clip, Undo/Redo, Zoom Keyframe diamond) + multi-track scrubber.
4. Implement Right Panel (`Clueso AI` Co-Pilot with `Polish this video`, `Make new videos from it`, `Brand and reach` + `Version History` + `Comments`) and `Article` mode rich-text step-by-step documentation editor.
5. Implement `/export/[id]` (`?process=export`, `?process=publish`, `?process=embed`) and `/share/[id]`.

## Phase 5: Automated Testing, Playwright Visual Verification & Git Push (`verify-and-commit`)
1. Run `npm run build` and verify zero TypeScript or Next.js build errors.
2. Run automated Playwright verification script against our local Next.js server covering Marketing, Auth, Workspace, Settings, Studio Editor (Video & Article modes + left-rail tools), and Export pages, saving verification screenshots in `screenshots/clone-verification/`.
3. Verify `.cred` and `.env*` are excluded via `git status`, then commit and push to the remote repository.
