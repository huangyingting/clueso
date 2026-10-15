# Technical Specification (SPEC) — Clueso Platform Clone

## 1. Technology Stack
- **Framework**: Next.js 15+ (App Router, TypeScript, React 19)
- **Styling & Icons**: Tailwind CSS + Lucide React icons + custom Clueso design tokens (`#d946ef` / `#ec4899` Clueso Pink/Magenta gradient, `#0f172a` Slate Dark, `#ffffff` Clean Light workspace)
- **Authentication**: NextAuth.js (`next-auth`) with Credentials, Google OAuth, and Enterprise SAML SSO providers
- **Database & ORM**:
  - **Local Development**: Prisma ORM (`prisma/schema.prisma`) with SQLite (`DATABASE_URL="file:./dev.db"`)
  - **Production Deployment**: Prisma ORM (`prisma/schema.postgres.prisma`) with PostgreSQL (`DATABASE_URL="postgresql://..."`)
- **Validation**: Zod schemas for API payloads and `GuideData` JSON structures

---

## 2. Complete Route Map

### 2.1 Public Marketing & Auth Routes
| Route | Description | Reference Screenshot |
|---|---|---|
| `/` | Marketing Home (`Product videos in minutes with AI`) | `screenshots/marketing/01-home.png` |
| `/pricing` | Plans (`Free`, `Starter`, `Growth`, `Enterprise`), billing toggle, comparison table | `screenshots/marketing/02-pricing.png` |
| `/enterprise` | Enterprise security, SAML SSO, SCIM, custom SLAs | `screenshots/marketing/03-enterprise.png` |
| `/agents` | Clueso Autonomous Video Agent showcase | `screenshots/marketing/04-agents.png` |
| `/mcp` | Model Context Protocol marketing page | `screenshots/marketing/05-mcp.png` |
| `/clueprints` | Reusable video templates showcase | `screenshots/marketing/06-clueprints.png` |
| `/features/[slug]` | `video`, `help-articles`, `translate`, `voiceovers`, `slides-to-video` | `screenshots/marketing/07..11-*.png` |
| `/customers` | Customer case studies & G2 reviews | `screenshots/marketing/12-customers.png` |
| `/showcase` | Interactive customer video gallery | `screenshots/marketing/13-showcase.png` |
| `/changelog` | Product release notes & updates | `screenshots/marketing/14-changelog.png` |
| `/signup` | Create Clueso account (Google, Microsoft, SSO, Email) | `screenshots/marketing/15-auth-signup.png` |
| `/login` | Sign in to Clueso (Google, Microsoft, SSO, Email, 1-Click Demo) | `screenshots/marketing/16-auth-login.png` |

### 2.2 Workspace Routes (`/home/*`, `/chat/*`, `/welcome/*`)
| Route | Description | Reference Screenshot |
|---|---|---|
| `/home` | Prompt-first AI Dashboard (`What are we creating today?`) + 4 quick-start cards | `screenshots/webapp/10-home-dashboard.png` |
| `/home/projects` | Projects & Folders explorer (`All | Deleted`, filters, `+ New folder`) | `screenshots/webapp/12-home-projects.png` |
| `/home/folders/[id]` | Folder detail view with child guides | `screenshots/webapp/25-home-folder-detail.png` |
| `/home/templates` | Video & Animation templates (`?tab=video`, `?tab=animation`) | `screenshots/webapp/13-home-templates-video.png` |
| `/home/clueprints` | Clueprints reusable templates (`Workspace | Community`, `+ New clueprint`) | `screenshots/webapp/15-home-clueprints.png` |
| `/home/visual-style` | Visual style picker & font/color override | `screenshots/webapp/16-home-visual-style.png` |
| `/home/brand` | Brand kit (`Pull your brand from URL`, colors, fonts, logos) | `screenshots/webapp/17-home-brand.png` |
| `/home/agent` | Clueso Agent autonomous video builder (`Hey Alex, Meet Clueso Agent`) | `screenshots/webapp/18-home-agent.png` |
| `/home/chats` | Clueso AI chat threads list (`Created | Modified`, `+ New chat`) | `screenshots/webapp/19-home-chats.png` |
| `/chat/[id]` | Clueso AI Pilot chat interface with video clip extraction prompts | `screenshots/webapp/50-pilot-chat-detail.png` |
| `/home/cuts` | Clueso Cuts long-form webinar/call splitter (with Enterprise mode toggle) | `screenshots/webapp/20-home-cuts.png` |
| `/home/analytics` | Workspace video analytics & retention charts (with Enterprise mode toggle) | `screenshots/webapp/21-home-analytics.png` |
| `/home/mcp` | MCP Server Connection Hub (`https://connect.clueso.io/mcp`, 7 IDE/Agent tabs) | `screenshots/webapp/23-home-mcp.png` |
| `/home/trash` | Soft-deleted projects & folders with Restore / Permanent Delete | `screenshots/webapp/24-home-trash.png` |
| `/welcome/[step]` | Onboarding wizard (`goals`, `about-you`, `about-work`) | `screenshots/webapp/80-welcome-about-you.png` |

### 2.3 Workspace Settings Routes (`/home/settings/*`)
| Route | Tab Label | Description |
|---|---|---|
| `/home/settings/general` | `Admin` | Team name, logo, domain auto-join radio, Danger zone |
| `/home/settings/profile` | `Profile` | User name, avatar, email copy, password reset |
| `/home/settings/permissions` | `Permissions` | Workspace role permissions matrix |
| `/home/settings/billing` | `Billing` | `Overview`, `Usage`, `AI Credits`, Enterprise plan & seat counters |
| `/home/settings/manage-users` | `Users` | Team members table, roles (`Admin`, `Editor`, `Viewer`), `+ Invite users` |
| `/home/settings/manage-teams` | `Teams` | Collaborative team management (`Create team`, `Leave Team`) |
| `/home/settings/providers` | `AI & Voice` | Default LLM (`Opus 5.5`, `Sonnet 4.5`, `GPT-5`) & Voice provider (`ElevenLabs`, `Cartesia`) |
| `/home/settings/video-settings` | `Video defaults` | Auto-rewrite script, Auto-generate speech, Default voice, Comments, Captions |
| `/home/settings/pronunciation-dictionary` | `Pronunciations` | Phonetic pronunciation rules per language (`+ New word`) |
| `/home/settings/translations` | `Translations` | Auto-translation target languages & Do-Not-Translate glossary |
| `/home/settings/kb-config` | `KB Config` | Knowledge Base domain & sync configuration |
| `/home/settings/transcription-keywords` | `Transcriptions` | Custom ASR keywords (`+ New keyword`) |
| `/home/settings/customize-player` | `Video player` | Live interactive video player preview + 10 player UI toggles |
| `/home/settings/viewonlylinks/appearance` | `View only links` | Shared link header, theme, and CTA button customization |
| `/home/settings/viewonlylinks/domain` | `Custom Domain` | Custom CNAME domain (`videos.acme.io`) configuration |
| `/home/settings/viewonlylinks/auth` | `Authentication` | Shared link password / SSO access control |
| `/home/settings/integrations` | `Integrations` | Slack, Sanity, YouTube, Zendesk, Intercom integrations |
| `/home/settings/connections` | `Connections` | GitHub & Bitbucket repository connections for Clueso Agent |

### 2.4 Studio Editor, Export & Share Routes
| Route | Description | Reference Screenshot |
|---|---|---|
| `/guide/[id]` | Full Studio Editor (`?activeFormat=video` & `?activeFormat=article`) | `screenshots/webapp/60..62l-*.png` |
| `/export/[id]` | Export (`?process=export`), Publish (`?process=publish`), Embed (`?process=embed`) | `screenshots/webapp/70..72-*.png` |
| `/share/[id]` | Public view-only / embeddable video & article viewer | `screenshots/webapp/71-export-page-publish.png` |

---

## 3. Prisma Data Model Specification (`SQLite` & `PostgreSQL`)
```prisma
model User {
  id             String       @id @default(cuid())
  email          String       @unique
  name           String
  firstName      String?
  lastName       String?
  passwordHash   String?
  pictureUrl     String?
  role           String       @default("Admin") // Admin | Editor | Viewer
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  guides         Guide[]
  comments       Comment[]
  chatThreads    ChatThread[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Organization {
  id                  String              @id @default(cuid())
  name                String
  domain              String              @default("acme.io")
  logoUrl             String?
  plan                String              @default("enterprise")
  region              String              @default("usw1")
  openDoor            Boolean             @default(true)
  aiCreditsRemaining  Int                 @default(48200)
  aiCreditsTotal      Int                 @default(50000)
  seatsPurchased      Int                 @default(25)
  mcpConnected        Boolean             @default(true)
  brandKitJson        String              @default("{}")
  videoDefaultsJson   String              @default("{}")
  playerConfigJson    String              @default("{}")
  viewOnlyConfigJson  String              @default("{}")
  integrationsJson    String              @default("{}")
  users               User[]
  folders             Folder[]
  guides              Guide[]
  clueprints          Clueprint[]
  pronunciations      PronunciationRule[]
  transcriptionWords  TranscriptionKeyword[]
  translationGlossary TranslationTerm[]
  chatThreads         ChatThread[]
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
}

model Folder {
  id             String       @id @default(cuid())
  name           String
  description    String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdById    String
  isDeleted      Boolean      @default(false)
  guides         Guide[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Guide {
  id             String         @id @default(cuid())
  name           String
  description    String?
  status         String         @default("published") // draft | published | archived
  activeFormat   String         @default("video")     // video | article
  languageId     String         @default("en")
  duration       Float          @default(18.5)
  aspectRatio    String         @default("16:9")
  tagsJson       String         @default("[]")
  guideDataJson  String         // Full GuideData JSON (video.guideClips, plainDoc, steps, captions, shareStatus)
  updateId       Int            @default(1)
  isDeleted      Boolean        @default(false)
  folderId       String?
  folder         Folder?        @relation(fields: [folderId], references: [id])
  organizationId String
  organization   Organization   @relation(fields: [organizationId], references: [id])
  createdById    String
  createdBy      User           @relation(fields: [createdById], references: [id])
  versions       GuideVersion[]
  comments       Comment[]
  exports        GuideExport[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model GuideVersion {
  id            String   @id @default(cuid())
  guideId       String
  guide         Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  versionNumber Int
  name          String
  guideDataJson String
  authorName    String
  createdAt     DateTime @default(now())
}

model Comment {
  id          String   @id @default(cuid())
  guideId     String
  guide       Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  timestamp   Float    @default(0)
  content     String
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model GuideExport {
  id          String   @id @default(cuid())
  guideId     String
  guide       Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  processType String   @default("export") // export | publish | embed
  format      String   @default("mp4")
  resolution  String   @default("1080p")
  status      String   @default("completed")
  downloadUrl String
  createdAt   DateTime @default(now())
}

model Clueprint {
  id             String       @id @default(cuid())
  name           String
  description    String
  category       String       @default("Workspace") // Workspace | Community
  aspectRatio    String       @default("16:9")
  duration       Float        @default(15)
  templateJson   String       @default("{}")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}

model ChatThread {
  id             String       @id @default(cuid())
  title          String
  model          String       @default("Opus 5.5")
  guideId        String?
  messagesJson   String       @default("[]")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdById    String
  createdBy      User         @relation(fields: [createdById], references: [id])
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model PronunciationRule {
  id             String       @id @default(cuid())
  word           String
  phonetic       String
  language       String       @default("English (US)")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}

model TranscriptionKeyword {
  id             String       @id @default(cuid())
  keyword        String
  category       String       @default("Brand")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}

model TranslationTerm {
  id             String       @id @default(cuid())
  term           String
  doNotTranslate Boolean      @default(true)
  translations   String       @default("{}")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}
```

---

## 4. REST API Contract (`/api/*`)
- `GET/POST /api/auth/[...nextauth]`: NextAuth session & sign-in handlers.
- `POST /api/auth/register`: Creates new user & workspace or joins existing organization.
- `GET/POST /api/guides`: Lists all guides (with folder/tag/trash/search filtering) or creates a new guide (from prompt, screen recording, video upload, slide deck, or Clueprint).
- `GET/PATCH/DELETE /api/guides/[id]`: Loads or updates a guide's `guideDataJson`, `name`, `activeFormat`, `languageId`, `folderId`, or `isDeleted`.
- `POST /api/guides/[id]/ai`: Executes Studio Editor AI operations:
  - `action: "rewrite"` (polishes clip voiceover scripts & removes filler words)
  - `action: "tts"` (generates word-level timestamps & synthesizes speech for selected voice `Brian`, `Sarah`, `Lily`, `Marcus`)
  - `action: "translate"` (translates all clip scripts, captions, overlays, and article blocks into target language `es`, `fr`, `de`, `ja`, `zh`, `en`)
  - `action: "copilot"` (processes natural language `Clueso AI` prompt to add zoom keyframes, callouts, captions, or article steps)
- `GET/POST /api/guides/[id]/versions`: Lists and restores version history snapshots.
- `GET/POST /api/guides/[id]/comments`: Lists and adds timestamped video comments.
- `GET/POST /api/guides/[id]/exports`: Triggers and lists MP4 exports, published links, and embed snippets.
- `GET/POST /api/folders`: Lists and creates project folders.
- `GET/POST /api/clueprints`: Lists and creates reusable Clueprint video templates.
- `GET/POST /api/chats` & `GET/POST /api/chats/[id]`: Lists and runs Clueso AI Pilot chat threads.
- `GET/PATCH /api/workspace`: Reads and updates Organization settings, Brand Kit (`pullBrandFromUrl`), Video Defaults, Player Config, View-Only Links, Pronunciations, Transcription Keywords, Translations, Users, and Integrations.
- `GET/POST /api/mcp`: Model Context Protocol JSON-RPC server endpoint exposing `list_guides`, `create_guide`, `rewrite_script`, `translate_guide`, and `export_video` tools.
