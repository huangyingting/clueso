# Engineering Task Breakdown (TASKS) — Clueso Platform Clone

## Epic 1: Reverse Engineering & Documentation
- [x] **T1.1**: Load `.cred` cookies into Playwright and crawl `clueso.io` & `accounts.clueso.io` (35 screenshots in `screenshots/marketing/`).
- [x] **T1.2**: Reverse engineer `web.clueso.io` bundles (`web-index.js`, `store.js`, `saver.js`, `gatepass.js`, `EditorPlatform.js`, `cluesoAIDrafts.js`) and unlock all authenticated routes.
- [x] **T1.3**: Crawl and screenshot all 42 `web.clueso.io` routes + 20 Studio Editor tool drawers/modals (62 screenshots in `screenshots/webapp/`).
- [x] **T1.4**: Author `docs/ADR.md`, `docs/PRD.md`, `docs/SPEC.md`, `docs/PLAN.md`, and `docs/TASKS.md`.

## Epic 2: Scaffolding, Prisma Dual-DB & NextAuth (`scaffold-db-auth`)
- [x] **T2.1**: Initialize Next.js App Router + TypeScript + Tailwind CSS + Lucide Icons + Prisma + NextAuth.
- [x] **T2.2**: Create `prisma/schema.prisma` (SQLite local dev) and `prisma/schema.postgres.prisma` (PostgreSQL production) + DB switch scripts.
- [x] **T2.3**: Write `prisma/seed.ts` with rich seed data matching `Acme Product Studio` and `Product Onboarding Walkthrough`.
- [x] **T2.4**: Implement NextAuth (`src/lib/auth.ts` & `/api/auth/[...nextauth]/route.ts`) + `/api/auth/register`.

## Epic 3: Backend API Routes (`implement-core-platform`)
- [x] **T3.1**: Implement `/api/guides`, `/api/guides/[id]`, `/api/guides/[id]/ai`, `/api/guides/[id]/versions`, `/api/guides/[id]/comments`, and `/api/guides/[id]/exports`.
- [x] **T3.2**: Implement `/api/folders`, `/api/clueprints`, `/api/chats`, `/api/chats/[id]`, `/api/workspace`, and `/api/mcp`.

## Epic 4: Marketing Website & Auth Pages (`implement-core-platform`)
- [x] **T4.1**: Build Marketing Navbar, Footer, and `/` Landing Page with interactive comparison demo.
- [x] **T4.2**: Build `/pricing`, `/enterprise`, `/agents`, `/mcp`, `/clueprints`, `/features/[slug]`, `/customers`, `/showcase`, and `/changelog`.
- [x] **T4.3**: Build `/login` and `/signup` pages with Credentials, OAuth, SAML SSO, and 1-Click Demo login.

## Epic 5: Workspace Shell, Home Dashboard & 18 Settings Pages (`implement-core-platform`)
- [x] **T5.1**: Build Workspace Shell (`Sidebar`, `Topbar`, `Cmd+K` Global Search, `New Project` modal with Screen Recorder & Video/Slide Upload).
- [x] **T5.2**: Build `/home` AI prompt composer + `/home/projects`, `/home/folders/[id]`, and `/home/trash`.
- [x] **T5.3**: Build `/home/clueprints`, `/home/templates`, `/home/brand`, `/home/visual-style`, `/home/agent`, `/home/chats`, `/chat/[id]`, `/home/cuts`, `/home/analytics`, `/home/mcp`, and `/welcome/[step]`.
- [x] **T5.4**: Build all 18 `/home/settings/*` routes including the interactive `Customize player` preview, `Pronunciations`, `Translations`, `Transcriptions`, `Users`, `Billing`, and `View only links`.

## Epic 6: Clueso Studio Editor (`/guide/[id]`) & Export (`/export/[id]`) (`implement-core-platform`)
- [x] **T6.1**: Build Studio Editor Top Bar (`Project menu`, `Video | Article` switch, `Comments`, `Magic translate` modal, `Clueso AI`, `Share` popover, `Classic vs Simplified` layout modal, `Cmd+K` Command Palette).
- [x] **T6.2**: Build all 11 Left Rail tools (`Select`, `Hand`, `Voiceover script` with `Brian`/`Sarah`/`Lily` voice picker & `AI Rewrite` & `Generate speech`, `Media`, `Text`, `Shapes`, `Effects` [Blur, Callout, Spotlight, Zoom], `Animation`, `Template`, `Transition` [9 wipes], `Captions` [8 presets]).
- [x] **T6.3**: Build Interactive Video Canvas + Multi-Track Timeline (`Play/Pause`, frame step, timecode, speed, split clip, zoom keyframes, overlay tracks) + Right Panel (`Clueso AI` Co-Pilot, `Version History`, `Comments`).
- [x] **T6.4**: Build `Article` mode editor (synchronized rich-text steps, annotated screenshots, AI enhance, Markdown export).
- [x] **T6.5**: Build `/export/[id]` (`export`, `publish`, `embed`) and `/share/[id]` public viewer.

## Epic 7: Verification & Git Push (`verify-and-commit`)
- [x] **T7.1**: Run `npm run build` and verify all routes compile cleanly.
- [x] **T7.2**: Run Playwright E2E test suite verifying Marketing, Auth, Workspace, Settings, Studio Editor, and Export pages.
- [x] **T7.3**: Ensure `.cred` is git-ignored, commit all code, docs, and screenshots, and push to remote repository.
