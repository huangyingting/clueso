# Architecture Decision Records (ADR) — Clueso Platform Clone

## Status
Accepted — 2026-04-20

## Context & Reverse-Engineering Summary
Using Playwright and authenticated session cookies (`.cred`), we inspected and screenshotted 97 distinct pages, routes, modals, drawers, and interactive states across:
1. **Marketing Website (`https://www.clueso.io`)**: 14 public pages (`/`, `/pricing`, `/enterprise`, `/agents`, `/mcp`, `/clueprints`, `/features/video`, `/features/help-articles`, `/features/translate`, `/features/voiceovers`, `/features/slides-to-video`, `/customers`, `/showcase`, `/changelog`).
2. **Authentication Portal (`https://accounts.clueso.io`)**: Sign up (`/signup`), Log in (`/login`), Google/Microsoft OAuth, Email/Password, and Enterprise SAML SSO flows.
3. **Web Application (`https://web.clueso.io`)**:
   - **Gatepass & PropelAuth Layer**: `api.gatepass.prod.clueso.io/api/auth/session` + `auth.clueso.io/api/v1/refresh_token` resolves the user's active organization and regional API shard (`usw1` -> `api.us.prod.clueso.io`).
   - **Workspace Shell (`/home/*`)**: Prompt-first AI landing (`/home`), Projects & Folders (`/home/projects`, `/home/folders/:id`, `/home/trash`), Clueprints (`/home/clueprints`), Templates (`/home/templates`), Brand Kit (`/home/brand`, `/home/visual-style`), Clueso Agent (`/home/agent`), Chats (`/home/chats`, `/chat/:id`), Clueso Cuts (`/home/cuts`), Analytics (`/home/analytics`), MCP Server hub (`/home/mcp`), and 18 Settings pages (`/home/settings/*`).
   - **Studio Editor (`/guide/:objectID`)**: Dual-format (`Video | Article`) non-linear editor powered by `GuideEngineClient` (`GET /guides/:id/data`, `POST /guides/:id/save`, `GET /guides/:id/versions`) with an ID-keyed `guideClips` map, 11-tool Left Rail (`Select`, `Hand`, `Voiceover script`, `Media`, `Text`, `Shapes`, `Effects`, `Animation`, `Template`, `Transition`, `Captions`), interactive 16:9/9:16/1:1 Canvas, Multi-track Timeline with keyframe zooms and overlays, Right-side `Clueso AI` Co-Pilot & `Version History`, `Cmd+K` Command Palette, `Magic Translate` modal, and `Share` popover.
   - **Export, Publish & Embed (`/export/:objectID`)**: Renders MP4 downloads, public share links, and responsive `<iframe>` embed codes.

---

## ADR-001: Unified Next.js App Router Monolith for Marketing, Auth, Workspace, and Studio Editor
### Decision
Consolidate the three upstream origin surfaces (`www.clueso.io`, `accounts.clueso.io`, and `web.clueso.io`) into a single **Next.js (App Router, TypeScript, Tailwind CSS)** application with clean route groups while preserving the exact upstream URL paths (`/home/*`, `/guide/[id]`, `/export/[id]`, `/chat/[id]`, `/welcome/*`, `/login`, `/signup`, `/pricing`, `/features/*`, etc.).

### Rationale
- Eliminates cross-subdomain CORS complexity while preserving every path discovered on `clueso.io` and `web.clueso.io`.
- Allows Server Components and Route Handlers (`/api/*`) to share Prisma models and NextAuth session context seamlessly.

---

## ADR-002: Database Portability — Prisma ORM with SQLite (Local Dev) and PostgreSQL (Production)
### Decision
Use **Prisma ORM** with two synchronized schema targets:
- `prisma/schema.prisma`: Configured with `provider = "sqlite"` and `url = env("DATABASE_URL")` (defaulting to `file:./dev.db`) for zero-dependency local development and automated Playwright verification.
- `prisma/schema.postgres.prisma`: Configured with `provider = "postgresql"` and `url = env("DATABASE_URL")` for production PostgreSQL deployments, accompanied by npm scripts (`db:use:sqlite`, `db:use:postgres`, `db:push`, `db:seed`).
- Structured complex nested documents (`guideClips`, `elements`, `plainDoc`, `brandKit`, `playerConfig`, `pronunciations`, `translations`) as typed JSON columns/strings with Zod validation and helper serializers so the schema is 100% compatible across both SQLite and PostgreSQL without relying on database-specific array primitives.

### Rationale
- Directly satisfies the requirement: *"use sqlite for local dev and postgres for production deployment"*.
- Storing the high-frequency non-linear video timeline graph (`guideClips`, `elements`, `wordTimestamps`) as a versioned document alongside relational tables (`User`, `Organization`, `Folder`, `Guide`, `GuideVersion`, `Comment`, `ChatThread`, `ChatMessage`, `Clueprint`, `PronunciationRule`, `GlossaryTerm`, `AnalyticsEvent`) matches Clueso's actual `GuideEngineClient` (`GET /guides/:id/data` + `GuideVersion` snapshots).

---

## ADR-003: Authentication via NextAuth.js (Credentials, Google/Microsoft OAuth, and Enterprise SSO)
### Decision
Implement authentication using **NextAuth.js** (`/api/auth/[...nextauth]`) backed by Prisma:
- **Credentials Provider**: Supports email + password login/signup as well as 1-click Demo account login (`alex@acme.io` / `Alex Rivera` at `Acme Product Studio`).
- **OAuth & SAML SSO Simulation**: Supports Google, Microsoft, and Enterprise SAML Domain lookup (`/login` -> `Continue with SSO`) matching `accounts.clueso.io`.
- **Workspace Session Context**: Injects active `userId`, `organizationId`, `role` (`Admin`, `Editor`, `Viewer`), and `plan` (`Enterprise`) into the session token.

---

## ADR-004: Studio Editor State Engine (`GuideEngine` Store & Optimistic Persistence)
### Decision
Model the `/guide/[id]` Studio Editor state after the reverse-engineered `GuideEngineClient` and `store.js`:
- **Canonical `GuideData` Document**:
  - `video.guideClips`: Ordered clip map containing `clipType` (`recording` | `slide` | `intro` | `outro`), `duration`, `voiceover` (`text`, `voiceId`, `voiceName`, `speed`, `wordTimestamps`), `elements` (`text`, `shape`, `callout`, `blur`, `spotlight`, `image`), `zooms` (`scale`, `x`, `y`, `start`, `end`), `transition` (`Circle wipe`, `Dissolve`, `Stack`, etc.), and `background`.
  - `video.captions`: Caption preset (`Basic`, `Basic Karaoke`, `Highlight Box`, `Karaoke Highlight Box`, `Color word`, `Highlight word`, `Paragraph builder`, `Word-by-word`), visibility, font size, and position.
  - `plainDoc.blocks` & `steps`: Synchronized rich-text step-by-step documentation for the `Article` tab.
- **Undo/Redo & Version History**: Maintain an in-memory history stack (`undo` / `redo`) plus persisted `GuideVersion` snapshots (`POST /api/guides/[id]/versions`) viewable and restorable from the `Version History` drawer.
- **Interactive HTML5 Video + Overlay Canvas + Web Speech / Audio Synthesizer**: Real-time playback (`requestAnimationFrame` clock), draggable/editable canvas overlay elements, word-highlighted transcript scrubbing, AI script rewrite, voice synthesis, and clip splitting.

---

## ADR-005: Model Context Protocol (MCP) & AI Co-Pilot API
### Decision
Provide a functional `/api/mcp` JSON-RPC endpoint and `/api/ai/copilot` route handler:
- Allows the in-editor `Clueso AI` Co-Pilot (`Polish this video`, `Make new videos from it`, `Brand and reach`, freeform prompts with `Opus 5.5`) and `/chat/[id]` Pilot conversations to mutate guide scripts, add zoom/callout effects, generate articles, and translate guides into 6+ languages (`en`, `es`, `fr`, `de`, `ja`, `zh`).

---

## ADR-006: ReadWise-Style Invitation-Only Account Admission (`ACCOUNT_ADMISSION_MODE="invitation-only"`)
### Decision
Port the cryptographic invitation-only registration engine from `../ReadWise` (`src/lib/account-admission/index.ts`):
- **Default Admission Mode**: `ACCOUNT_ADMISSION_MODE="invitation-only"`. Uninvited registration attempts to `POST /api/auth/register` are rejected with HTTP `403 invitation_required`, and `/signup` + `/register` render an invitation-only admission gate with a token acceptor.
- **Cryptographic One-Time Tokens**: Raw 32-byte `base64url` tokens are generated via `crypto.randomBytes(32)` and only their SHA-256 `tokenHash` is stored in the `AccountInvitation` table (`PENDING`, `ACCEPTED`, `REVOKED`, `EXPIRED`) with a `unique` constraint on `activeForEmail` to prevent duplicate active invitations.
- **Admin Invitation Lifecycle & Audit Logging**: Admins manage invitations in `/admin/invitations` and `/home/settings/manage-users` (`GET/POST /api/admin/invitations`, `POST /api/admin/invitations/[id]/rotate`, `DELETE /api/admin/invitations/[id]`), while invitees inspect and accept links at `/invite/[token]` (`GET /api/auth/invitation`, `POST /api/auth/register`), recording every state transition in `AuditLog`.

---

## ADR-007: Live Azure OpenAI (`gpt-6.1-sol`) & Azure Speech Neural TTS (`japaneast`)
### Decision
Integrate live cloud AI and Speech engines configured from `../ReadWise/.env` with Prisma ledger and asset caching:
- **Azure OpenAI (`src/lib/ai/index.ts`)**: Connects to the `gpt-6.1-sol` deployment (`api-version=2025-04-01-preview`) using `max_completion_tokens` and structured JSON responses for Studio script rewriting (`guide_rewrite_script`), multi-language localization (`guide_translate`), Studio Copilot commands (`guide_studio_copilot`), SOP article enhancement (`guide_enhance_article`), AI prompt-to-guide creation (`guide_create_from_prompt`), and multi-turn Clueso Pilot chats (`clueso_pilot_chat_create` / `clueso_pilot_chat_turn`). Every call is logged in `AiInvocation`.
- **Azure Speech Neural TTS (`src/lib/speech/index.ts`)**: Synthesizes real `audio-24khz-96kbitrate-mono-mp3` voiceovers via `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1` using SSML across studio and multilingual voices (`en-US-AndrewMultilingualNeural`, `en-US-AvaMultilingualNeural`, `en-GB-SoniaNeural`, `es-ES-ElviraNeural`, `fr-FR-DeniseNeural`, `de-DE-KatjaNeural`, `ja-JP-NanamiNeural`, `zh-CN-XiaoxiaoNeural`), caches audio & computed word-boundary timings in `SpeechSynthesisAsset` by SHA-256 `cacheKey`, and streams playable `<audio>` directly in `/guide/[id]`.

---

## ADR-008: Production Readiness Probes & Containerization
### Decision
Provide `/api/health` (liveness + provider configuration status), `/api/ready` (Prisma database connectivity + `Guide`, `User`, `AccountInvitation`, `AiInvocation`, and `SpeechSynthesisAsset` telemetry), a multi-stage Alpine `Dockerfile`, and `docker-compose.yml` for PostgreSQL 16 + Next.js production orchestration.

