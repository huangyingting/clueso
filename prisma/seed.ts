import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SAMPLE_MP4 = 'https://publicassets.in.prod.clueso.io/cpr_benchmark_video_720p_24fps.mp4';

export function buildDefaultGuideData(id: string, title: string, desc: string) {
  return {
    id,
    name: title,
    description: desc,
    languageId: 'en',
    activeFormat: 'video',
    status: 'published',
    shareStatus: {
      public: true,
      embedAllowed: true,
      passwordProtected: false,
      shareUrl: `https://fast.clueso.io/share/${id}`,
    },
    video: {
      aspectRatio: '16:9',
      resolution: { width: 1920, height: 1080 },
      transition: 'Dissolve',
      guideClips: {
        'clip-1': {
          clipId: 'clip-1',
          orderKey: 'a0',
          name: '1. Welcome & Workspace Overview',
          clipType: 'recording',
          duration: 6.2,
          startTime: 0,
          endTime: 6.2,
          transition: 'Circle wipe',
          elements: {
            'el-title-1': {
              id: 'el-title-1',
              type: 'text',
              name: 'Product Onboarding Walkthrough',
              start: 0,
              end: 6.2,
              x: 80,
              y: 60,
              width: 560,
              height: 64,
              text: title,
              fontSize: 32,
              fontWeight: 700,
              fill: '#ffffff',
              backgroundColor: '#e038b5',
            },
            'el-callout-1': {
              id: 'el-callout-1',
              type: 'callout',
              name: 'New Project CTA Highlight',
              start: 1.2,
              end: 5.5,
              x: 420,
              y: 160,
              width: 240,
              height: 80,
              text: 'Click "New project" to start',
              stroke: '#e038b5',
              fill: 'rgba(224, 56, 181, 0.14)',
            },
          },
          zooms: [
            { id: 'zm-1', start: 1.5, end: 4.5, scale: 1.35, x: 50, y: 38, label: 'Auto Zoom: Projects Sidebar' },
          ],
          background: {
            type: 'color',
            color: '#0f172a',
            padding: 36,
            borderRadius: 16,
          },
          voiceover: {
            id: 'vo-1',
            text: 'Welcome to your new Acme Product Studio workspace in Clueso.',
            voiceId: 'nPczCjzI2devNBz1zQrb',
            voiceName: 'Brian',
            engine: 'eleven',
            languageId: 'en',
            speed: 1.0,
            duration: 6.2,
            wordTimestamps: [
              { word: 'Welcome', start: 0.0, end: 0.6 },
              { word: 'to', start: 0.6, end: 0.9 },
              { word: 'your', start: 0.9, end: 1.3 },
              { word: 'new', start: 1.3, end: 1.8 },
              { word: 'Acme', start: 1.8, end: 2.5 },
              { word: 'Product', start: 2.5, end: 3.2 },
              { word: 'Studio', start: 3.2, end: 3.9 },
              { word: 'workspace', start: 3.9, end: 4.8 },
              { word: 'in', start: 4.8, end: 5.2 },
              { word: 'Clueso.', start: 5.2, end: 6.2 },
            ],
          },
          recordingData: {
            rawVideoUrl: SAMPLE_MP4,
            processedVideoUrl: SAMPLE_MP4,
            width: 1920,
            height: 1080,
            fps: 30,
          },
        },
        'clip-2': {
          clipId: 'clip-2',
          orderKey: 'a1',
          name: '2. Creating Your First Recording',
          clipType: 'recording',
          duration: 6.5,
          startTime: 6.2,
          endTime: 12.7,
          transition: 'Dissolve',
          elements: {
            'el-spotlight-1': {
              id: 'el-spotlight-1',
              type: 'spotlight',
              name: 'Spotlight AI Rewrite',
              start: 0.5,
              end: 5.8,
              x: 180,
              y: 220,
              width: 320,
              height: 110,
              text: 'AI Rewrite & Voice Synthesis',
              stroke: '#6366f1',
              fill: 'rgba(99, 102, 241, 0.16)',
            },
          },
          zooms: [
            { id: 'zm-2', start: 1.0, end: 5.0, scale: 1.4, x: 35, y: 50, label: 'Auto Zoom: Voiceover Script' },
          ],
          background: {
            type: 'color',
            color: '#1e1b4b',
            padding: 36,
            borderRadius: 16,
          },
          voiceover: {
            id: 'vo-2',
            text: 'Click Record screen or upload an existing video to generate studio-grade guides.',
            voiceId: 'nPczCjzI2devNBz1zQrb',
            voiceName: 'Brian',
            engine: 'eleven',
            languageId: 'en',
            speed: 1.0,
            duration: 6.5,
            wordTimestamps: [
              { word: 'Click', start: 0.0, end: 0.5 },
              { word: 'Record', start: 0.5, end: 1.1 },
              { word: 'screen', start: 1.1, end: 1.7 },
              { word: 'or', start: 1.7, end: 2.0 },
              { word: 'upload', start: 2.0, end: 2.6 },
              { word: 'an', start: 2.6, end: 2.9 },
              { word: 'existing', start: 2.9, end: 3.6 },
              { word: 'video', start: 3.6, end: 4.2 },
              { word: 'to', start: 4.2, end: 4.5 },
              { word: 'generate', start: 4.5, end: 5.2 },
              { word: 'studio-grade', start: 5.2, end: 5.9 },
              { word: 'guides.', start: 5.9, end: 6.5 },
            ],
          },
          recordingData: {
            rawVideoUrl: SAMPLE_MP4,
            processedVideoUrl: SAMPLE_MP4,
            width: 1920,
            height: 1080,
            fps: 30,
          },
        },
        'clip-3': {
          clipId: 'clip-3',
          orderKey: 'a2',
          name: '3. Translating & Sharing with Customers',
          clipType: 'recording',
          duration: 5.8,
          startTime: 12.7,
          endTime: 18.5,
          transition: 'Stack',
          elements: {},
          zooms: [],
          background: {
            type: 'color',
            color: '#0f172a',
            padding: 36,
            borderRadius: 16,
          },
          voiceover: {
            id: 'vo-3',
            text: 'Export your finished video and written article in over thirty languages.',
            voiceId: 'nPczCjzI2devNBz1zQrb',
            voiceName: 'Brian',
            engine: 'eleven',
            languageId: 'en',
            speed: 1.0,
            duration: 5.8,
            wordTimestamps: [
              { word: 'Export', start: 0.0, end: 0.6 },
              { word: 'your', start: 0.6, end: 1.0 },
              { word: 'finished', start: 1.0, end: 1.7 },
              { word: 'video', start: 1.7, end: 2.3 },
              { word: 'and', start: 2.3, end: 2.6 },
              { word: 'written', start: 2.6, end: 3.2 },
              { word: 'article', start: 3.2, end: 3.9 },
              { word: 'in', start: 3.9, end: 4.2 },
              { word: 'over', start: 4.2, end: 4.6 },
              { word: 'thirty', start: 4.6, end: 5.1 },
              { word: 'languages.', start: 5.1, end: 5.8 },
            ],
          },
          recordingData: {
            rawVideoUrl: SAMPLE_MP4,
            processedVideoUrl: SAMPLE_MP4,
            width: 1920,
            height: 1080,
            fps: 30,
          },
        },
      },
      music: {
        name: 'Soft Horizon',
        volume: 0.15,
        enabled: true,
      },
      captions: {
        enabled: true,
        style: 'Karaoke Highlight Box',
        fontSize: 28,
        color: '#ffffff',
        backgroundColor: '#000000cc',
        position: 'bottom',
      },
      defaultVoice: {
        code: 'nPczCjzI2devNBz1zQrb',
        name: 'Brian',
        language: 'en',
        gender: 'male',
        engine: 'eleven',
      },
    },
    plainDoc: {
      blocks: [
        { id: 'blk-1', type: 'heading', level: 1, content: title },
        {
          id: 'blk-2',
          type: 'paragraph',
          content: 'Follow this step-by-step walkthrough to record, polish, translate, and publish studio-grade product videos and help articles in Clueso.',
        },
        {
          id: 'blk-3',
          type: 'callout',
          variant: 'info',
          content: 'Pro Tip: Every video clip in Clueso is automatically linked to a rich-text article step with annotated screenshots.',
        },
      ],
    },
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Open the Projects Dashboard & Start a Recording',
        description: 'Navigate to Home or Projects in the left sidebar and click "New project" or "Record your screen" to capture your product workflow.',
        timestamp: '00:01',
        calloutLabel: 'New project',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Polish Script & Generate Studio Voiceover',
        description: 'Open the Voiceover script panel on the left rail, click "AI Rewrite" to remove filler words, choose a realistic ElevenLabs voice (Brian, Sarah, Lily), and click "Generate speech".',
        timestamp: '00:07',
        calloutLabel: 'AI Rewrite',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Translate & Share with Customers',
        description: 'Click "Translate" in the top bar to dub your video and article into 30+ languages, then click "Share" to export MP4, publish a link, or copy the iframe embed code.',
        timestamp: '00:13',
        calloutLabel: 'Share & Export',
      },
    ],
  };
}

async function main() {
  console.log('Seeding Clueso database...');

  const passwordHash = await bcrypt.hash('clueso123', 10);

  const org = await prisma.organization.upsert({
    where: { id: 'org_clueso_acme' },
    update: {},
    create: {
      id: 'org_clueso_acme',
      name: 'Acme Product Studio',
      domain: 'acme.io',
      plan: 'Enterprise',
      region: 'usw1',
      openDoor: true,
      aiCreditsRemaining: 48200,
      aiCreditsTotal: 50000,
      seatsPurchased: 25,
      mcpConnected: true,
      brandKitJson: JSON.stringify({
        websiteUrl: 'https://acme.io',
        colors: ['#e038b5', '#6366f1', '#10b981', '#0f172a', '#f8fafc'],
        headingFont: 'Inter',
        bodyFont: 'Inter',
        backgroundPadding: 36,
        borderRadius: 16,
        defaultAspectRatio: '16:9',
      }),
      videoDefaultsJson: JSON.stringify({
        autoRewriteScript: true,
        autoGenerateSpeech: true,
        defaultVoice: 'Brian (ElevenLabs)',
        enableComments: true,
        notificationScope: 'All organization members',
        generateCaptionsByDefault: true,
        autoZoomOnClicks: true,
        autoHighlightCallouts: true,
        rewritePrompt: 'Make the script concise, friendly, and action-oriented for SaaS users.',
      }),
      playerConfigJson: JSON.stringify({
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
      }),
      viewOnlyConfigJson: JSON.stringify({
        theme: 'light',
        showHeader: true,
        ctaText: 'Book a Demo',
        ctaUrl: 'https://acme.io/demo',
        customDomain: 'videos.acme.io',
        cnameVerified: true,
        authMode: 'public',
        password: '',
      }),
      integrationsJson: JSON.stringify({
        slack: { connected: true, channel: '#product-videos' },
        sanity: { connected: false, dataset: 'production' },
        youtube: { connected: true, channel: 'Acme Official' },
        zendesk: { connected: true, subdomain: 'acme-help' },
        intercom: { connected: false, workspaceId: '' },
        github: { connected: true, repo: 'acme-corp/web-platform' },
        bitbucket: { connected: false, repo: '' },
      }),
      providersJson: JSON.stringify({
        aiProvider: 'Anthropic Claude Opus 5.5',
        voiceProvider: 'ElevenLabs Turbo v2.5',
      }),
    },
  });

  const alex = await prisma.user.upsert({
    where: { id: 'usr_clueso_01' },
    update: { email: 'alex@acme.io' },
    create: {
      id: 'usr_clueso_01',
      email: 'alex@acme.io',
      name: 'Alex Rivera',
      firstName: 'Alex',
      lastName: 'Rivera',
      passwordHash,
      role: 'Admin',
      status: 'active',
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sarah@acme.io' },
    update: {},
    create: {
      id: 'usr_clueso_02',
      email: 'sarah@acme.io',
      name: 'Sarah Chen',
      firstName: 'Sarah',
      lastName: 'Chen',
      passwordHash,
      role: 'Editor',
      status: 'active',
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'marcus@acme.io' },
    update: {},
    create: {
      id: 'usr_clueso_03',
      email: 'marcus@acme.io',
      name: 'Marcus Vance',
      firstName: 'Marcus',
      lastName: 'Vance',
      passwordHash,
      role: 'Editor',
      status: 'active',
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'elena@acme.io' },
    update: {},
    create: {
      id: 'usr_clueso_04',
      email: 'elena@acme.io',
      name: 'Elena Rostova',
      firstName: 'Elena',
      lastName: 'Rostova',
      passwordHash,
      role: 'Editor',
      status: 'pending',
      organizationId: org.id,
    },
  });

  const folder1 = await prisma.folder.upsert({
    where: { id: 'folder-1' },
    update: {},
    create: {
      id: 'folder-1',
      name: 'Customer Onboarding',
      description: 'Core onboarding videos & articles for enterprise customers',
      organizationId: org.id,
      createdById: alex.id,
    },
  });

  const folder2 = await prisma.folder.upsert({
    where: { id: 'folder-2' },
    update: {},
    create: {
      id: 'folder-2',
      name: 'Product Releases (Q2 2026)',
      description: 'Changelog videos, feature spotlights, and release broadcasts',
      organizationId: org.id,
      createdById: alex.id,
    },
  });

  const guide1Data = buildDefaultGuideData(
    'guide-101',
    'Product Onboarding Walkthrough',
    'Complete end-to-end onboarding tour for new enterprise workspace admins.'
  );
  const guide2Data = buildDefaultGuideData(
    'guide-102',
    'Release 2.4 AI Co-Pilot Feature Tour',
    'Deep dive into Clueso AI Co-Pilot, smart zooms, and 1-click translations.'
  );
  const guide3Data = buildDefaultGuideData(
    'guide-103',
    'Configuring SAML SSO & SCIM Provisioning',
    'Step-by-step enterprise security configuration guide for Okta and Azure AD.'
  );

  await prisma.guide.upsert({
    where: { id: 'guide-101' },
    update: {},
    create: {
      id: 'guide-101',
      name: 'Product Onboarding Walkthrough',
      description: 'Complete end-to-end onboarding tour for new enterprise workspace admins.',
      status: 'published',
      activeFormat: 'video',
      languageId: 'en',
      duration: 18.5,
      aspectRatio: '16:9',
      tagsJson: JSON.stringify(['Onboarding']),
      guideDataJson: JSON.stringify(guide1Data),
      folderId: folder1.id,
      organizationId: org.id,
      createdById: alex.id,
    },
  });

  await prisma.guide.upsert({
    where: { id: 'guide-102' },
    update: {},
    create: {
      id: 'guide-102',
      name: 'Release 2.4 AI Co-Pilot Feature Tour',
      description: 'Deep dive into Clueso AI Co-Pilot, smart zooms, and 1-click translations.',
      status: 'published',
      activeFormat: 'video',
      languageId: 'en',
      duration: 18.5,
      aspectRatio: '16:9',
      tagsJson: JSON.stringify(['Release Notes']),
      guideDataJson: JSON.stringify(guide2Data),
      folderId: folder2.id,
      organizationId: org.id,
      createdById: alex.id,
    },
  });

  await prisma.guide.upsert({
    where: { id: 'guide-103' },
    update: {},
    create: {
      id: 'guide-103',
      name: 'Configuring SAML SSO & SCIM Provisioning',
      description: 'Step-by-step enterprise security configuration guide for Okta and Azure AD.',
      status: 'draft',
      activeFormat: 'article',
      languageId: 'en',
      duration: 18.5,
      aspectRatio: '16:9',
      tagsJson: JSON.stringify(['Security']),
      guideDataJson: JSON.stringify(guide3Data),
      folderId: folder1.id,
      organizationId: org.id,
      createdById: alex.id,
    },
  });

  // Seed versions, comments, exports for guide-101
  await prisma.guideVersion.upsert({
    where: { id: 'ver-5' },
    update: {},
    create: {
      id: 'ver-5',
      guideId: 'guide-101',
      versionNumber: 5,
      name: 'Published v5 — Added AI Voiceover & Smart Zooms',
      guideDataJson: JSON.stringify(guide1Data),
      authorName: 'Alex Rivera',
    },
  });

  await prisma.guideVersion.upsert({
    where: { id: 'ver-4' },
    update: {},
    create: {
      id: 'ver-4',
      guideId: 'guide-101',
      versionNumber: 4,
      name: 'Auto-saved v4 — Initial screen recording import',
      guideDataJson: JSON.stringify(guide1Data),
      authorName: 'Alex Rivera',
    },
  });

  await prisma.comment.upsert({
    where: { id: 'cmt-1' },
    update: {},
    create: {
      id: 'cmt-1',
      guideId: 'guide-101',
      authorId: alex.id,
      timestamp: 3.4,
      content: 'Love the auto-zoom into the New project CTA here! Let us also dub this into Spanish and Japanese.',
      resolved: false,
    },
  });

  await prisma.guideExport.upsert({
    where: { id: 'exp-1' },
    update: {},
    create: {
      id: 'exp-1',
      guideId: 'guide-101',
      processType: 'export',
      format: 'mp4',
      resolution: '1080p (60fps)',
      status: 'completed',
      downloadUrl: SAMPLE_MP4,
    },
  });

  await prisma.clueprint.upsert({
    where: { id: 'cp-1' },
    update: {},
    create: {
      id: 'cp-1',
      name: 'SaaS Product Launch Intro & Outro',
      description: 'Reusable branded intro, zoom transitions, and callout styles for feature launches.',
      category: 'Workspace',
      aspectRatio: '16:9',
      duration: 18,
      organizationId: org.id,
    },
  });

  await prisma.clueprint.upsert({
    where: { id: 'cp-2' },
    update: {},
    create: {
      id: 'cp-2',
      name: 'Help Center Step-by-Step Walkthrough',
      description: 'Standardized customer support tutorial template with karaoke captions and step cards.',
      category: 'Community',
      aspectRatio: '16:9',
      duration: 24,
      organizationId: org.id,
    },
  });

  await prisma.chatThread.upsert({
    where: { id: 'chat-101' },
    update: {},
    create: {
      id: 'chat-101',
      title: 'Extract 5 highlight clips from Product Onboarding Walkthrough',
      model: 'Opus 5.5',
      guideId: 'guide-101',
      organizationId: org.id,
      createdById: alex.id,
      messagesJson: JSON.stringify([
        {
          id: 'm1',
          role: 'user',
          content: 'Suggest clips that I can extract from this video and polish the intro script.',
          createdAt: '2026-04-20T04:55:00.000Z',
        },
        {
          id: 'm2',
          role: 'assistant',
          content:
            'I analyzed "Product Onboarding Walkthrough" (00:18) and identified 3 high-impact clips:\n1. **Welcome & Workspace Overview (0:00 - 0:06)** — Great for a quick social teaser.\n2. **Creating Your First Recording (0:06 - 0:12)** — Ideal for onboarding tooltips.\n3. **Translating & Sharing in 30+ Languages (0:12 - 0:18)** — Highlights global localization.',
          createdAt: '2026-04-20T04:55:05.000Z',
        },
      ]),
    },
  });

  await prisma.pronunciationRule.upsert({
    where: { id: 'pron-1' },
    update: {},
    create: {
      id: 'pron-1',
      word: 'Clueso',
      phonetic: 'KLOO-soh',
      language: 'English (US)',
      organizationId: org.id,
    },
  });

  await prisma.transcriptionKeyword.upsert({
    where: { id: 'kw-1' },
    update: {},
    create: {
      id: 'kw-1',
      keyword: 'Clueprints',
      category: 'Product Feature',
      organizationId: org.id,
    },
  });

  await prisma.translationTerm.upsert({
    where: { id: 'tr-1' },
    update: {},
    create: {
      id: 'tr-1',
      term: 'Clueso Studio',
      doNotTranslate: true,
      translations: JSON.stringify({ es: 'Clueso Studio', fr: 'Clueso Studio', ja: 'Clueso Studio' }),
      organizationId: org.id,
    },
  });

  console.log('Seed completed successfully!');
}

if (process.argv[1]?.includes('seed')) {
  main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

