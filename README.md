# Clueso (`clueso.io` + `web.clueso.io`) — Full-Stack Clone

Complete reverse-engineering, visual screenshot archive, architectural documentation suite (`ADR.md`, `PRD.md`, `SPEC.md`, `PLAN.md`, `TASKS.md`), and full-stack Next.js 15 + NextAuth + Prisma implementation of **Clueso** (`https://clueso.io` marketing website & `https://web.clueso.io` AI Video & Documentation Studio).

## 1. Repository Structure

- `screenshots/marketing/` — 35 Playwright screenshots of `https://clueso.io` and `https://accounts.clueso.io`
- `screenshots/webapp/` — 62 Playwright screenshots of `https://web.clueso.io` (Workspace, 18 Settings tabs, Clueso Pilot, MCP, Clueprints, and all 12 Studio Editor tool drawers & modals)
- `docs/ADR.md` — Architecture Decision Records
- `docs/PRD.md` — Product Requirements Document
- `docs/SPEC.md` — Technical Specification (Route Map, Prisma Schema, REST APIs, Studio Editor Spec)
- `docs/PLAN.md` — Phased Implementation Plan
- `docs/TASKS.md` — Granular Engineering Task Breakdown
- `prisma/schema.prisma` & `prisma/schema.sqlite.prisma` — Local SQLite Prisma schema
- `prisma/schema.postgres.prisma` — Production PostgreSQL Prisma schema

## 2. Quick Start (Local Development — SQLite)

```bash
npm install
npm run db:setup
npm run dev
```

Default seeded demo credentials:
- **Email**: `alex@acme.io`
- **Password**: `CluesoDemo2026!`

## 3. Production Deployment (PostgreSQL)

```bash
export DATABASE_URL="postgresql://user:password@host:5432/clueso?schema=public"
npm run db:push:postgres
npm run db:seed
npm run build
npm run start
```
