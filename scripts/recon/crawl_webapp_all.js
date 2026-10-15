const { chromium } = require('/home/azadmin/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/azadmin/clueso/screenshots/webapp';
const BUNDLE_DIR = '/home/azadmin/.copilot/session-state/549d2f6c-d94d-4946-8845-4baacd0af146/files/bundles';
fs.mkdirSync(OUT_DIR, { recursive: true });

const NOW_ISO = '2026-04-20T12:00:00.000Z';

const MOCK_USER = {
  id: 'user-demo-admin',
  userId: 'user-demo-admin',
  email: 'alex@acme.io',
  firstName: 'Alex',
  lastName: 'Rivera',
  name: 'Alex Rivera',
  pictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  role: 'Owner',
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
};

const MOCK_ORG = {
  id: 'org-clueso-demo',
  organizationId: 'org-clueso-demo',
  name: 'Acme Product Studio',
  domain: 'acme.io',
  region: 'usw1',
  role: 'Owner',
  plan: 'Enterprise',
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
};

const MOCK_GUIDES = [
  {
    id: 'guide-101',
    name: 'Product Onboarding Walkthrough',
    description: 'Complete interactive product tour and step-by-step setup guide for new workspace admins.',
    header: {
      name: 'Product Onboarding Walkthrough',
      description: 'Complete interactive product tour and step-by-step setup guide for new workspace admins.',
      published: true,
    },
    status: 'published',
    type: 'video',
    duration: 18.5,
    views: 1284,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    lastEditedAt: NOW_ISO,
    createdBy: MOCK_USER,
    author: MOCK_USER,
    versionSaved: 5,
    versionPublished: 5,
    editedVideoExists: true,
    decoratedAiVideoExists: true,
    guideUrlPath: 'product-onboarding-walkthrough',
    thumbnailUrl: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/gradient_1.png',
    tags: [{ id: 'tag-1', name: 'Onboarding', color: '#d43f8c' }],
  },
  {
    id: 'guide-102',
    name: 'Release 2.4 AI Co-Pilot Feature Tour',
    description: 'Highlighting automated zoom keyframes, ElevenLabs voiceovers, and 1-click translations.',
    header: {
      name: 'Release 2.4 AI Co-Pilot Feature Tour',
      description: 'Highlighting automated zoom keyframes, ElevenLabs voiceovers, and 1-click translations.',
      published: true,
    },
    status: 'published',
    type: 'video',
    duration: 42.0,
    views: 842,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    lastEditedAt: NOW_ISO,
    createdBy: MOCK_USER,
    author: MOCK_USER,
    versionSaved: 3,
    versionPublished: 3,
    editedVideoExists: true,
    decoratedAiVideoExists: true,
    guideUrlPath: 'release-2-4-feature-tour',
    thumbnailUrl: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
    tags: [{ id: 'tag-2', name: 'Release Notes', color: '#6366f1' }],
  },
  {
    id: 'guide-103',
    name: 'Configuring SAML SSO & SCIM Provisioning',
    description: 'Step-by-step security documentation for connecting Okta and Azure AD with Clueso Enterprise.',
    header: {
      name: 'Configuring SAML SSO & SCIM Provisioning',
      description: 'Step-by-step security documentation for connecting Okta and Azure AD with Clueso Enterprise.',
      published: false,
    },
    status: 'draft',
    type: 'article',
    duration: 27.0,
    views: 319,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    lastEditedAt: NOW_ISO,
    createdBy: MOCK_USER,
    author: MOCK_USER,
    versionSaved: 2,
    versionPublished: 0,
    editedVideoExists: true,
    decoratedAiVideoExists: false,
    guideUrlPath: 'configuring-saml-sso',
    thumbnailUrl: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
    tags: [{ id: 'tag-3', name: 'Security', color: '#10b981' }],
  },
];

const MOCK_GUIDE_DATA = {
  video: {
    aspectRatio: '16:9',
    guideClips: {
      'clip-1': {
        clipId: 'clip-1',
        orderKey: 'a0',
        clipImmutableName: 'intro',
        clipTitle: '1. Welcome & Workspace Overview',
        clipType: 'slide_clip',
        duration: 6,
        hidden: false,
        schemaVersion: 'CLIP_APR_25',
        background: {
          backgroundType: 'image',
          backgroundVolume: 0,
          borderRadius: 12,
          duration: 6,
          height: 1080,
          width: 1920,
          id: 'bg-1',
          isDeleted: false,
          isStarred: true,
          mediaType: 'image',
          padding: 40,
          shadow: 20,
          src: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
        },
        voiceover: {
          duration: 6,
          schemaVersion: 'VOICEOVER_SCHEMA_APR_25',
          speed: 1,
          volume: 100,
          voice: {
            code: 'nPczCjzI2devNBz1zQrb',
            language: 'en',
            name: 'Brian',
            gender: 'male',
            engine: 'eleven',
          },
          transcribedWords: [
            { word: 'Welcome', start: 0.1, end: 0.6 },
            { word: 'to', start: 0.6, end: 0.8 },
            { word: 'your', start: 0.8, end: 1.1 },
            { word: 'new', start: 1.1, end: 1.4 },
            { word: 'Acme', start: 1.4, end: 1.9 },
            { word: 'Product', start: 1.9, end: 2.5 },
            { word: 'Studio', start: 2.5, end: 3.1 },
            { word: 'workspace', start: 3.1, end: 3.9 },
            { word: 'in', start: 3.9, end: 4.2 },
            { word: 'Clueso.', start: 4.2, end: 5.2 },
          ],
          transcript: {
            version: '2025-01-30',
            data: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Welcome to your new Acme Product Studio workspace in Clueso.' }],
                },
              ],
            },
          },
        },
        videoTiming: {
          generatedTimestamps: [],
          originalSplit: [{ start: 0, end: 6 }],
          originalTimestamps: [],
        },
        elements: {
          'el-text-1': {
            id: 'el-text-1',
            orderKey: 'a0',
            schemaVersion: 'ELEMENT_EDIT_APR_25',
            geo: 'text',
            startTime: 0,
            endTime: 6,
            position: [0.5, 0.45],
            size: [0.7, 0.2],
            textdata: {
              text: 'Product Onboarding Walkthrough',
              fontSize: 48,
              fontFamily: 'Inter',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
            },
          },
        },
      },
      'clip-2': {
        clipId: 'clip-2',
        orderKey: 'a1',
        clipImmutableName: 'step-1',
        clipTitle: '2. Creating Your First Recording',
        clipType: 'slide_clip',
        duration: 6.5,
        hidden: false,
        schemaVersion: 'CLIP_APR_25',
        background: {
          backgroundType: 'image',
          backgroundVolume: 0,
          borderRadius: 12,
          duration: 6.5,
          height: 1080,
          width: 1920,
          id: 'bg-2',
          isDeleted: false,
          isStarred: false,
          mediaType: 'image',
          padding: 40,
          shadow: 20,
          src: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
        },
        voiceover: {
          duration: 6.5,
          schemaVersion: 'VOICEOVER_SCHEMA_APR_25',
          speed: 1,
          volume: 100,
          voice: {
            code: 'nPczCjzI2devNBz1zQrb',
            language: 'en',
            name: 'Brian',
            gender: 'male',
            engine: 'eleven',
          },
          transcribedWords: [
            { word: 'Click', start: 0.1, end: 0.5 },
            { word: 'Record', start: 0.5, end: 1.0 },
            { word: 'screen', start: 1.0, end: 1.5 },
            { word: 'or', start: 1.5, end: 1.8 },
            { word: 'upload', start: 1.8, end: 2.3 },
            { word: 'an', start: 2.3, end: 2.5 },
            { word: 'existing', start: 2.5, end: 3.1 },
            { word: 'video', start: 3.1, end: 3.6 },
            { word: 'to', start: 3.6, end: 3.9 },
            { word: 'generate', start: 3.9, end: 4.6 },
            { word: 'studio-grade', start: 4.6, end: 5.4 },
            { word: 'guides.', start: 5.4, end: 6.2 },
          ],
          transcript: {
            version: '2025-01-30',
            data: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Click Record screen or upload an existing video to generate studio-grade guides.',
                    },
                  ],
                },
              ],
            },
          },
        },
        videoTiming: {
          generatedTimestamps: [],
          originalSplit: [{ start: 0, end: 6.5 }],
          originalTimestamps: [],
        },
        elements: {},
      },
      'clip-3': {
        clipId: 'clip-3',
        orderKey: 'a2',
        clipImmutableName: 'outro',
        clipTitle: '3. Translating & Sharing with Customers',
        clipType: 'slide_clip',
        duration: 6,
        hidden: false,
        schemaVersion: 'CLIP_APR_25',
        background: {
          backgroundType: 'image',
          backgroundVolume: 0,
          borderRadius: 12,
          duration: 6,
          height: 1080,
          width: 1920,
          id: 'bg-3',
          isDeleted: false,
          isStarred: false,
          mediaType: 'image',
          padding: 40,
          shadow: 20,
          src: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
        },
        voiceover: {
          duration: 6,
          schemaVersion: 'VOICEOVER_SCHEMA_APR_25',
          speed: 1,
          volume: 100,
          voice: {
            code: 'nPczCjzI2devNBz1zQrb',
            language: 'en',
            name: 'Brian',
            gender: 'male',
            engine: 'eleven',
          },
          transcribedWords: [
            { word: 'Export', start: 0.1, end: 0.7 },
            { word: 'your', start: 0.7, end: 1.0 },
            { word: 'finished', start: 1.0, end: 1.6 },
            { word: 'video', start: 1.6, end: 2.1 },
            { word: 'and', start: 2.1, end: 2.4 },
            { word: 'written', start: 2.4, end: 2.9 },
            { word: 'article', start: 2.9, end: 3.5 },
            { word: 'in', start: 3.5, end: 3.8 },
            { word: 'over', start: 3.8, end: 4.2 },
            { word: 'thirty', start: 4.2, end: 4.8 },
            { word: 'languages.', start: 4.8, end: 5.7 },
          ],
          transcript: {
            version: '2025-01-30',
            data: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Export your finished video and written article in over thirty languages.' }],
                },
              ],
            },
          },
        },
        videoTiming: {
          generatedTimestamps: [],
          originalSplit: [{ start: 0, end: 6 }],
          originalTimestamps: [],
        },
        elements: {},
      },
    },
  },
  plainDoc: {
    version: '2025-01-30',
    data: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Product Onboarding Walkthrough' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Follow this step-by-step guide to configure your Acme Product Studio workspace, record your first product workflow, and publish localized video + written documentation.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Step 1: Launch the Clueso Chrome Extension or Upload a Recording' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Click the Record Screen button in the top-right corner of the dashboard, or drag and drop an existing MP4/WebM screen recording. Clueso automatically captures DOM metadata, cursor paths, and click targets.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Step 2: Polish Script, AI Voiceover, and Smart Zooms' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Use the AI Rewrite prompt in the left Transcript panel to remove filler words, then click Generate Speech to synthesize studio-quality narration synced to your timeline.',
            },
          ],
        },
      ],
    },
  },
  settings: {
    hideArticle: false,
    publishedVideo: true,
  },
};

function patchFernBundle(code) {
  // Make parseOrThrow and jsonOrThrow never throw on mock payloads
  return code
    .replace(
      /parseOrThrow:async\(t,n\)=>\{let r=await e\.parse\(t,n\);if\(r\.ok\)return r\.value;throw new [A-Za-z0-9_]+\(r\.errors\)\}/g,
      'parseOrThrow:async(t,n)=>{let r=await e.parse(t,n);return r.ok?r.value:t}'
    )
    .replace(
      /jsonOrThrow:async\(t,n\)=>\{let r=await e\.json\(t,n\);if\(r\.ok\)return r\.value;throw new [A-Za-z0-9_]+\(r\.errors\)\}/g,
      'jsonOrThrow:async(t,n)=>{let r=await e.json(t,n);return r.ok?r.value:t}'
    )
    .replace(
      /async function Vat\(e\)\{[^}]+\}/g,
      'async function Vat(e){return}'
    );
}

(async () => {
  const credRaw = JSON.parse(fs.readFileSync('/home/azadmin/clueso/.cred', 'utf8'));
  const cookies = credRaw.map(c => {
    const copy = {
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path || '/',
      secure: !!c.secure,
      httpOnly: !!c.httpOnly,
    };
    if (c.sameSite === 'no_restriction') copy.sameSite = 'None';
    else if (c.sameSite === 'lax') copy.sameSite = 'Lax';
    else if (c.sameSite === 'strict') copy.sameSite = 'Strict';
    if (c.expirationDate) copy.expires = Math.floor(c.expirationDate);
    return copy;
  });

  const saverPatched = patchFernBundle(fs.readFileSync(path.join(BUNDLE_DIR, 'saver.js'), 'utf8'));
  const draftsPatched = patchFernBundle(fs.readFileSync(path.join(BUNDLE_DIR, 'cluesoAIDrafts.js'), 'utf8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  await context.addCookies(cookies);

  const page = await context.newPage();

  const fakeJwt = [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
    Buffer.from(
      JSON.stringify({
        sub: MOCK_USER.id,
        user_id: MOCK_USER.id,
        email: MOCK_USER.email,
        first_name: MOCK_USER.firstName,
        last_name: MOCK_USER.lastName,
        org_id_to_org_member_info: {
          [MOCK_ORG.id]: {
            org_id: MOCK_ORG.id,
            org_name: MOCK_ORG.name,
            url_safe_org_name: 'acme-product-studio',
            user_role: 'Owner',
            inherited_user_roles_plus_current_role: ['Owner', 'Admin', 'Member'],
            user_permissions: ['*'],
          },
        },
        exp: Math.floor(Date.now() / 1000) + 86400,
        iat: Math.floor(Date.now() / 1000) - 60,
      })
    ).toString('base64url'),
    'signature',
  ].join('.');

  // Intercept saver & cluesoAIDrafts bundles to bypass strict Fern parseOrThrow
  await page.route('**/assets/saver-CucLEg1J.js', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      body: saverPatched,
    });
  });

  await page.route('**/assets/cluesoAIDrafts-DlyBreqF.js', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      body: draftsPatched,
    });
  });

  // Intercept PropelAuth
  await page.route('https://auth.clueso.io/**', async route => {
    const url = route.request().url();
    if (url.includes('/api/v1/refresh_token')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           access_token: fakeJwt,
           expires_at_seconds: Math.floor(Date.now() / 1000) + 36000,
           org_id_to_org_member_info: {
             [MOCK_ORG.id]: {
               org_id: MOCK_ORG.id,
               org_name: MOCK_ORG.name,
               org_metadata: { region: 'usw1' },
               url_safe_org_name: 'acme-product-studio',
               user_role: 'Admin',
               inherited_user_roles_plus_current_role: ['Admin', 'Editor', 'Member', 'Viewer'],
               user_permissions: ['*'],
               org_role_structure: 'single_role_in_hierarchy',
               additional_roles: [],
             },
           },
           user: {
             user_id: MOCK_USER.id,
             email: MOCK_USER.email,
             email_confirmed: true,
             first_name: MOCK_USER.firstName,
             last_name: MOCK_USER.lastName,
             username: 'alex',
             picture_url: MOCK_USER.pictureUrl,
             mfa_enabled: false,
             has_password: true,
             can_create_orgs: true,
             created_at: 1700000000,
             last_active_at: Math.floor(Date.now() / 1000),
             properties: {},
          },
        }),
      });
    }
    return route.continue();
  });

  // Intercept Gatepass
  await page.route('https://api.gatepass.prod.clueso.io/**', async route => {
    const url = route.request().url();
    const u = new URL(url);

    if (u.pathname === '/api/auth/session') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: {
             needsOrganizationSelection: false,
             userWithCurrentOrg: {
               user: {
                 id: MOCK_USER.id,
                 email: MOCK_USER.email,
                 name: MOCK_USER.name,
                 profilePicture: MOCK_USER.pictureUrl,
                 createdAt: NOW_ISO,
                 updatedAt: NOW_ISO,
               },
               role: 'admin',
               organization: {
                 id: MOCK_ORG.id,
                 name: MOCK_ORG.name,
                 logoUrl: null,
                 region: 'usw1',
                 openDoor: true,
                 createdAt: NOW_ISO,
               },
             },
             currentOrgHostname: 'acme',
             pylonEmailHash: 'hash123',
             featureFlags: {},
           },
        }),
      });
    }

    if (u.pathname === '/api/onboarding') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           onboarding: {
             completed: true,
             currentStep: 'completed',
           },
           account: {
             role: 'Product Manager',
             team: 'Product & Engineering',
             useCase: 'Customer Onboarding & Documentation',
           },
        }),
      });
    }

    if (u.pathname === '/api/team/associations') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: {
             associations: [
               {
                 id: MOCK_ORG.id,
                 name: MOCK_ORG.name,
                 role: 'admin',
                 logoUrl: null,
                 region: 'usw1',
               },
             ],
             nextCursor: null,
           },
        }),
      });
    }

    if (u.pathname === '/api/team/users/all') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: {
             users: [
               {
                 id: MOCK_USER.id,
                 email: MOCK_USER.email,
                 name: MOCK_USER.name,
                 role: 'admin',
                 profilePicture: MOCK_USER.pictureUrl,
                 joinedAt: '2026-01-01T00:00:00.000Z',
               },
               {
                 id: 'user-sarah',
                 email: 'sarah@acme.io',
                 name: 'Sarah Chen',
                 role: 'editor',
                 profilePicture: '',
                 joinedAt: '2026-02-15T00:00:00.000Z',
               },
               {
                 id: 'user-marcus',
                 email: 'marcus@acme.io',
                 name: 'Marcus Vance',
                 role: 'viewer',
                 profilePicture: '',
                 joinedAt: '2026-03-10T00:00:00.000Z',
               },
             ],
           },
        }),
      });
    }

    if (u.pathname === '/api/team/invites/all') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: {
             invites: [
               {
                 id: 'inv-1',
                 email: 'elena@acme.io',
                 role: 'editor',
                 createdAt: NOW_ISO,
               },
             ],
           },
        }),
      });
    }

    if (u.pathname === '/api/subscriptions/base-plan') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: {
             name: 'enterprise',
             displayName: 'Enterprise',
             status: 'active',
             cycleType: 'yearly',
             seats: 25,
             usedSeats: 8,
             aiCreditsRemaining: 48200,
             aiCreditsTotal: 50000,
             expirationDate: '2027-01-01T00:00:00.000Z',
           },
        }),
      });
    }

    if (u.pathname === '/api/connect/mcp/status') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           success: true,
           data: { connected: true, mcpConnectedAt: '2026-04-01T00:00:00.000Z' },
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: {} }),
    });
  });

  // Intercept Regional API, Catalog, Panchayat, Un
  await page.route('https://*.prod.clueso.io/**', async route => {
    const url = route.request().url();
    if (
      url.includes('api.gatepass.prod.clueso.io') ||
      url.includes('publicassets.')
    ) {
      return route.fallback();
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://web.clueso.io',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    };

    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsHeaders, body: '' });
    }

    let body = [];

    if (url.includes('/general/initialize')) {
      body = {
        userValid: true,
        emailIdExists: false,
        loggedInWithSSOButEmailDoesntBelongToSSOOrg: false,
        userAssociatedWithAnyOrg: true,
        user: MOCK_USER,
        organization: {
          ...MOCK_ORG,
          brandColor: '#DA5CC7',
          tourEnabled: false,
        },
        hostname: 'acme',
        defaultHelpcenterId: 'hc_1',
        customLogin: false,
        helpcenters: [],
      };
    } else if (url.includes('/general/getNoOfProjects')) {
      body = { noOfProjects: 3, count: 3 };
    } else if (url.includes('/general/getUserOrganizations')) {
      body = { organizations: [MOCK_ORG], total: 1 };
    } else if (url.includes('/brand/kit')) {
      body = {
        colors: ['#d43f8c', '#6366f1', '#10b981', '#111827'],
        fonts: [{ name: 'Inter', family: 'Inter' }],
        logos: [],
      };
    } else if (url.includes('/helpcenterMutations/getHelpcenterUrls')) {
      body = {
        helpcenterUrls: ['https://help.acme.io'],
        defaultHelpcenterUrl: 'https://help.acme.io',
      };
    } else if (url.includes('/provider-consent')) {
      body = { consented: true, providers: [] };
    } else if (url.includes('/announcements/get')) {
      body = [];
    } else if (url.includes('/collection_queries/getAllActiveCutsCollections')) {
      body = [];
    } else if (url.includes('/upload_drafts/')) {
      body = {
        status: 'absent',
        error: null,
        drafts: [],
        chosen_index: null,
        session_id: null,
        outcome: null,
        build_finished: false,
        summary: null,
        result_guide_id: null,
        pre_update_id: null,
        post_update_id: null,
        applied_direct: false,
        videos: [],
      };
    } else if (url.includes('/access/')) {
      body = {
        hasTranslationGlossary: true,
        hasCustomDomain: true,
        hasAvatarAccess: true,
        hasClueprintsAccess: true,
      };
    } else if (url.includes('/guides/') && url.endsWith('/data')) {
      body = {
        guideData: MOCK_GUIDE_DATA,
        updateId: 1,
        activeLocks: [],
      };
    } else if (url.includes('/guides/') && url.endsWith('/locks')) {
      body = { locks: [] };
    } else if (url.includes('/guides/') && url.includes('/patches_since')) {
      body = [];
    } else if (url.includes('/guides/') && url.endsWith('/versions')) {
      body = {
        versions: [
          {
            id: 'ver-5',
            versionNumber: 5,
            updateId: 5,
            name: 'Published v5 — Added AI Voiceover & Smart Zooms',
            createdAt: NOW_ISO,
            author: MOCK_USER,
          },
          {
            id: 'ver-4',
            versionNumber: 4,
            updateId: 4,
            name: 'Auto-saved v4 — Initial screen recording import',
            createdAt: NOW_ISO,
            author: MOCK_USER,
          },
        ],
      };
    } else if (url.includes('/guide_queries/getGuidePreview') || url.includes('/guidePreview/get') || url.includes('/preview/get')) {
      body = MOCK_GUIDES[0];
    } else if (url.includes('/guide_queries/getGuidePreviews')) {
      body = MOCK_GUIDES;
    } else if (url.includes('/guide_queries/getGuidePlatformData') || url.includes('/guidePlatformData/get')) {
      body = {
        guideData: MOCK_GUIDE_DATA,
        articleAiChatMessages: [],
        videoAiChatMessages: [],
        articleSelectedPromptData: null,
        videoSelectedPromptData: null,
      };
    } else if (url.includes('/platformStatus/getEntityStatus')) {
      body = { busyEntities: {}, latestUpdateId: 1 };
    } else if (url.includes('/platformStatus/getStatus') || url.includes('/platformStatus/get')) {
      body = {
        exportingVideo: false,
        publishingGuide: false,
        aiEnhancingArticle: false,
        trimmingVideo: false,
        autoUpdatingGuide: false,
        creatingGuide: false,
        addingClip: false,
        publishingYoutube: false,
        exportDetails: {
          exportStatus: 'completed',
          processType: 'export',
          videoUrl: 'https://publicassets.in.prod.clueso.io/cpr_benchmark_video_720p_24fps.mp4',
          downloadUrl: 'https://publicassets.in.prod.clueso.io/cpr_benchmark_video_720p_24fps.mp4',
        },
      };
    } else if (url.includes('/guide_exports/getPastExports') || url.includes('/export/getPastExports')) {
      body = {
        exports: [
          {
            id: 'exp-1',
            format: 'mp4',
            resolution: '1080p',
            fps: 60,
            status: 'completed',
            createdAt: NOW_ISO,
            downloadUrl: 'https://publicassets.in.prod.clueso.io/cpr_benchmark_video_720p_24fps.mp4',
          },
        ],
      };
    } else if (url.includes('/embed/getEmbedCode')) {
      body = {
        embedCode: '<iframe src="https://fast.clueso.io/embed/guide-101" width="100%" height="540" frameborder="0" allowfullscreen></iframe>',
      };
    } else if (url.includes('/organization/getPlatformDetails')) {
      body = {
        organization: MOCK_ORG,
        user: MOCK_USER,
        languages: [
          { languageId: 'en', name: 'English (US)', nativeName: 'English' },
          { languageId: 'es', name: 'Spanish', nativeName: 'Español' },
        ],
      };
    } else if (url.includes('/video-comments/get') || url.includes('/videoComments/getComments')) {
      body = [];
    } else if (url.includes('/getAllChildren') || url.includes('/getPaginatedChildren')) {
      body = {
        guides: MOCK_GUIDES,
        collections: [
          {
            id: 'folder-1',
            name: 'Customer Onboarding',
            description: 'Core onboarding videos & articles for enterprise customers',
            createdAt: NOW_ISO,
            updatedAt: NOW_ISO,
            createdBy: MOCK_USER,
            private: false,
            guideCount: 8,
          },
          {
            id: 'folder-2',
            name: 'Product Releases (Q2 2026)',
            description: 'Changelog videos, feature spotlights, and release broadcasts',
            createdAt: NOW_ISO,
            updatedAt: NOW_ISO,
            createdBy: MOCK_USER,
            private: false,
            guideCount: 5,
          },
        ],
        totalGuides: 3,
        totalCollections: 2,
        hasMore: false,
      };
    } else if (url.includes('/tags')) {
      body = {
        tags: [
          { id: 'tag-1', name: 'Onboarding', color: '#d43f8c' },
          { id: 'tag-2', name: 'Release Notes', color: '#6366f1' },
          { id: 'tag-3', name: 'Security', color: '#10b981' },
        ],
      };
    } else if (url.includes('/getVoices')) {
      body = {
        voices: [
          { code: 'nPczCjzI2devNBz1zQrb', name: 'Brian', language: 'en', gender: 'male', engine: 'eleven', accent: 'American', previewUrl: '' },
          { code: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', language: 'en', gender: 'female', engine: 'eleven', accent: 'American', previewUrl: '' },
          { code: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', language: 'en', gender: 'female', engine: 'eleven', accent: 'British', previewUrl: '' },
        ],
      };
    } else if (url.includes('/getAllDefaultVoices')) {
      body = {
        defaultVoices: [
          { languageId: 'en', voice: { code: 'nPczCjzI2devNBz1zQrb', name: 'Brian', language: 'en', gender: 'male', engine: 'eleven' } },
        ],
      };
    } else if (url.includes('/getAllLanguages')) {
      body = {
        languages: [
          { languageId: 'en', name: 'English (US)', nativeName: 'English' },
          { languageId: 'es', name: 'Spanish', nativeName: 'Español' },
          { languageId: 'fr', name: 'French', nativeName: 'Français' },
          { languageId: 'de', name: 'German', nativeName: 'Deutsch' },
          { languageId: 'ja', name: 'Japanese', nativeName: '日本語' },
          { languageId: 'zh', name: 'Chinese (Simplified)', nativeName: '中文' },
        ],
      };
    } else if (url.includes('/analytics/')) {
      body = {
        totalViews: 2445,
        uniqueViewers: 1890,
        avgCompletionRate: 84.5,
        totalWatchTimeSeconds: 51240,
        guides: MOCK_GUIDES,
        dailyViews: [
          { date: '2026-04-14', views: 310 },
          { date: '2026-04-15', views: 385 },
          { date: '2026-04-16', views: 420 },
          { date: '2026-04-17', views: 390 },
          { date: '2026-04-18', views: 460 },
          { date: '2026-04-19', views: 480 },
        ],
      };
    } else if (url.includes('/broadcasts/')) {
      body = {
        broadcasts: [
          {
            id: 'bcast-1',
            title: 'Q2 Product Release 2.4 Announcement',
            message: 'Check out the new AI Video Co-Pilot and 1-click multi-language dubbing!',
            platforms: ['slack', 'email'],
            status: 'sent',
            createdAt: NOW_ISO,
          },
        ],
      };
    } else if (url.includes('/templates') || url.includes('catalog.prod.clueso.io')) {
      body = {
        templates: [
          {
            id: 'tpl-1',
            name: 'SaaS Product Launch Intro',
            category: 'Intro',
            duration: 5,
            aspectRatio: '16:9',
            thumbnailUrl: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
          },
          {
            id: 'tpl-2',
            name: 'Feature Spotlight Split Screen',
            category: 'Feature',
            duration: 6,
            aspectRatio: '16:9',
            thumbnailUrl: 'https://publicassets.in.prod.clueso.io/web_assets/premade_backgrounds/white.png',
          },
        ],
        items: [],
        packs: [],
      };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: corsHeaders,
      body: JSON.stringify(body),
    });
  });

  const ROUTES_TO_CAPTURE = process.env.ONLY_EDITOR
    ? [{ slug: '60-studio-editor-video-mode', path: '/guide/guide-101?activeFormat=video' }]
    : [
    // Workspace routes
    { slug: '10-home-dashboard', path: '/home' },
    { slug: '11-home-mode-new-landing', path: '/home?mode=new' },
    { slug: '12-home-projects', path: '/home/projects' },
    { slug: '13-home-templates-video', path: '/home/templates?tab=video' },
    { slug: '14-home-templates-animation', path: '/home/templates?tab=animation' },
    { slug: '15-home-clueprints', path: '/home/clueprints' },
    { slug: '16-home-visual-style', path: '/home/visual-style' },
    { slug: '17-home-brand', path: '/home/brand' },
    { slug: '18-home-agent', path: '/home/agent' },
    { slug: '19-home-chats', path: '/home/chats' },
    { slug: '20-home-cuts', path: '/home/cuts' },
    { slug: '21-home-analytics', path: '/home/analytics' },
    { slug: '22-home-broadcast', path: '/home/broadcast' },
    { slug: '23-home-mcp', path: '/home/mcp' },
    { slug: '24-home-trash', path: '/home/trash' },
    { slug: '25-home-folder-detail', path: '/home/folders/folder-1' },

    // Settings routes
    { slug: '30-settings-general', path: '/home/settings/general' },
    { slug: '31-settings-profile', path: '/home/settings/profile' },
    { slug: '32-settings-permissions', path: '/home/settings/permissions' },
    { slug: '33-settings-billing', path: '/home/settings/billing' },
    { slug: '34-settings-manage-users', path: '/home/settings/manage-users' },
    { slug: '35-settings-manage-teams', path: '/home/settings/manage-teams' },
    { slug: '36-settings-providers', path: '/home/settings/providers' },
    { slug: '37-settings-video-settings', path: '/home/settings/video-settings' },
    { slug: '38-settings-pronunciation', path: '/home/settings/pronunciation-dictionary' },
    { slug: '39-settings-transcription-keywords', path: '/home/settings/transcription-keywords' },
    { slug: '40-settings-translations', path: '/home/settings/translations' },
    { slug: '41-settings-kb-config', path: '/home/settings/kb-config' },
    { slug: '42-settings-integrations', path: '/home/settings/integrations' },
    { slug: '43-settings-connections', path: '/home/settings/connections' },
    { slug: '44-settings-customize-player', path: '/home/settings/customize-player' },
    { slug: '45-settings-viewonlylinks-appearance', path: '/home/settings/viewonlylinks/appearance' },
    { slug: '46-settings-viewonlylinks-domain', path: '/home/settings/viewonlylinks/domain' },
    { slug: '47-settings-viewonlylinks-auth', path: '/home/settings/viewonlylinks/auth' },

    // Pilot / Chat layout
    { slug: '50-pilot-chat-detail', path: '/chat/chat-101' },

    // Studio Editor & Export routes
    { slug: '60-studio-editor-video-mode', path: '/guide/guide-101?activeFormat=video' },
    { slug: '61-studio-editor-article-mode', path: '/guide/guide-101?activeFormat=article' },
    { slug: '70-export-page-export', path: '/export/guide-101?process=export' },
    { slug: '71-export-page-publish', path: '/export/guide-101?process=publish' },
    { slug: '72-export-page-embed', path: '/export/guide-101?process=embed' },

    // Welcome / Onboarding routes
    { slug: '80-welcome-about-you', path: '/welcome/about-you' },
    { slug: '81-welcome-about-work', path: '/welcome/about-work' },
  ];

  const report = [];

  for (const item of ROUTES_TO_CAPTURE) {
    const targetUrl = `https://web.clueso.io${item.path}`;
    console.log(`Visiting ${item.slug} -> ${targetUrl}`);
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2500);

      const screenshotPath = path.join(OUT_DIR, `${item.slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const domSummary = await page.evaluate(() => {
        const text = (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600);
        const buttons = Array.from(document.querySelectorAll('button,[role="button"]'))
          .map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .slice(0, 25);
        return {
          url: location.href,
          title: document.title,
          text,
          buttons,
        };
      });

      console.log(`  -> [${item.slug}] finalUrl=${domSummary.url} | text=${domSummary.text.slice(0, 120)}`);
      report.push({ slug: item.slug, requestedPath: item.path, ...domSummary });

      // Extra UI interactions on key pages!
      if (item.slug === '60-studio-editor-video-mode') {
        // Save the initial modal ("We've simplified the editor") if visible
        await page.screenshot({ path: path.join(OUT_DIR, '60a-studio-editor-layout-modal.png') });

        // Click "Continue with Classic" or press Escape to reveal the full Studio Editor
        try {
          const classicBtn = page.locator('button:has-text("Continue with Classic")');
          if (await classicBtn.isVisible({ timeout: 2000 })) {
            await classicBtn.click();
            await page.waitForTimeout(800);
          } else {
            await page.keyboard.press('Escape');
            await page.waitForTimeout(600);
          }
        } catch {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(600);
        }

        // Re-capture clean Video Mode Studio Editor
        await page.screenshot({ path: path.join(OUT_DIR, '60-studio-editor-video-mode.png') });

        // Click through the left sidebar tool icons in Video Editor
        const TOOL_BUTTONS = [
          { slug: '62a-tool-voiceover-script', label: 'Voiceover script' },
          { slug: '62b-tool-media', label: 'Media' },
          { slug: '62c-tool-text', label: 'Text' },
          { slug: '62d-tool-shapes', label: 'Shapes' },
          { slug: '62e-tool-effects', label: 'Effects' },
          { slug: '62f-tool-animation', label: 'Animation' },
          { slug: '62g-tool-template', label: 'Template' },
          { slug: '62h-tool-transition', label: 'Transition' },
          { slug: '62i-tool-captions', label: 'Captions' },
          { slug: '62j-top-comments', label: 'Comments' },
          { slug: '62k-top-translate', label: 'Translate' },
          { slug: '62l-top-project-menu', label: 'Project menu' },
        ];
        const toolsReport = [];
        for (const tool of TOOL_BUTTONS) {
          try {
            const btn = page.locator(`button[aria-label="${tool.label}"], button:has-text("${tool.label}")`).first();
            if (await btn.isVisible({ timeout: 1500 })) {
              await btn.click();
              await page.waitForTimeout(700);
              await page.screenshot({ path: path.join(OUT_DIR, `${tool.slug}.png`) });
              const tDom = await page.evaluate(() => ({
                text: (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 700),
                buttons: Array.from(document.querySelectorAll('button,[role="button"]'))
                  .map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())
                  .filter(Boolean)
                  .slice(0, 35),
              }));
              toolsReport.push({ ...tool, ...tDom });
              console.log(`  -> Captured tool ${tool.slug}: ${tDom.text.slice(0, 120)}`);
              if (tool.slug.startsWith('62j') || tool.slug.startsWith('62k') || tool.slug.startsWith('62l')) {
                await page.keyboard.press('Escape');
                await page.waitForTimeout(400);
              }
            }
          } catch (err) {
            console.log(`  -> Skipped tool ${tool.slug}: ${err.message}`);
          }
        }
        fs.writeFileSync('/home/azadmin/clueso/scripts/recon/editor-tools-summary.json', JSON.stringify(toolsReport, null, 2));

        // Click "Brian" voice pill to capture Voice Picker if present
        try {
          const brianBtn = page.locator('button:has-text("Brian"), div:has-text("Brian")').first();
          if (await brianBtn.isVisible({ timeout: 1000 })) {
            await brianBtn.click();
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(OUT_DIR, '60d-studio-editor-voice-picker.png') });
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
          }
        } catch {}

        // Click "AI Rewrite" button if present
        try {
          const rewriteBtn = page.locator('button:has-text("AI Rewrite")').first();
          if (await rewriteBtn.isVisible({ timeout: 1000 })) {
            await rewriteBtn.click();
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(OUT_DIR, '60e-studio-editor-ai-rewrite.png') });
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
          }
        } catch {}

        // Click "Share" button in top right if present
        try {
          const shareBtn = page.locator('button:has-text("Share")').first();
          if (await shareBtn.isVisible({ timeout: 1000 })) {
            await shareBtn.click();
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(OUT_DIR, '60f-studio-editor-share-popover.png') });
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
          }
        } catch {}

        // Trigger Command Palette (Cmd+K / Ctrl+K)
        await page.keyboard.press('Control+k');
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(OUT_DIR, '60b-studio-editor-cmd-k-palette.png') });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Switch to Article tab via topbar "Article" button
        try {
          const articleTab = page.locator('button:has-text("Article"), [role="tab"]:has-text("Article"), div:text-is("Article")').first();
          if (await articleTab.isVisible({ timeout: 1500 })) {
            await articleTab.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(OUT_DIR, '61-studio-editor-article-mode.png') });
          }
        } catch {}

        // Open Version History via custom event
        await page.evaluate(() => {
          window.dispatchEvent(new CustomEvent('clueso:open-version-history'));
        });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(OUT_DIR, '60c-studio-editor-version-history.png') });
      }
    } catch (e) {
      console.error(`  -> Error on ${item.slug}: ${e.message}`);
    }
  }

  if (!process.env.ONLY_EDITOR) {
    fs.writeFileSync('/home/azadmin/clueso/scripts/recon/webapp-pages-summary.json', JSON.stringify(report, null, 2));
  }
  await browser.close();
  console.log('Done crawling web.clueso.io!');
})();
