const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3055';
const OUT_DIR = path.join(__dirname, '..', 'screenshots', 'clone-verification');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. Check /api/health and /api/ready
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  console.log('Health probe:', JSON.stringify(health));
  if (health.status !== 'ok' || health.admissionMode !== 'invitation-only' || !health.ai.configured || !health.speech.configured) {
    throw new Error('Health probe failed validation: ' + JSON.stringify(health));
  }

  // 2. Verify open registration is blocked without an invitation token
  const blockedRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'uninvited@example.com',
      password: 'Password123!',
      firstName: 'Uninvited',
      lastName: 'User',
    }),
  });
  const blockedData = await blockedRes.json();
  console.log('Blocked open signup status:', blockedRes.status, blockedData.code);
  if (blockedRes.status !== 403) {
    throw new Error('Expected HTTP 403 for uninvited registration');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 3. Visit /signup and screenshot Invitation-Only gate
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT_DIR, '17-signup-invitation-only.png') });
  console.log('Captured 17-signup-invitation-only.png');

  // 4. Visit /admin/invitations, create a new invitation for designer@acme.io, and copy the invite link
  await page.goto(`${BASE_URL}/admin/invitations`, { waitUntil: 'networkidle' });
  const uniqueEmail = `designer-${Date.now().toString().slice(-4)}@acme.io`;
  await page.fill('input[name="email"]', uniqueEmail);
  await page.click('button:has-text("Create invitation")');
  await page.waitForSelector('input[aria-label="Invitation link"]', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT_DIR, '18-admin-invitations-console.png') });
  console.log('Captured 18-admin-invitations-console.png');

  const acceptUrl = await page.locator('input[aria-label="Invitation link"]').inputValue();
  console.log('Generated one-time invitation link:', acceptUrl);

  // 5. Open the one-time /invite/[token] page and accept the invitation
  await page.goto(acceptUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.fill('input[name="name"]', 'Maya Lin');
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', 'CluesoInvite2026!');
  await page.fill('input[name="confirmPassword"]', 'CluesoInvite2026!');
  await page.screenshot({ path: path.join(OUT_DIR, '19-invite-token-acceptance.png') });
  console.log('Captured 19-invite-token-acceptance.png');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 6. Test Live Azure OpenAI (gpt-6.1-sol) + Azure Speech TTS on /guide/guide-101
  console.log('Testing live AI Rewrite + Azure Speech TTS on /guide/guide-101...');
  const rewriteRes = await fetch(`${BASE_URL}/api/guides/guide-101/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'rewrite', tone: 'Concise & Polished' }),
  });
  const rewriteData = await rewriteRes.json();
  console.log('AI Rewrite result:', {
    aiProvider: rewriteData.aiProvider,
    aiModel: rewriteData.aiModel,
    message: rewriteData.message,
    firstClipHasAudio: Boolean(rewriteData.clips?.[0]?.audioDataUrl),
  });

  const ttsRes = await fetch(`${BASE_URL}/api/guides/guide-101/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'tts', voiceName: 'Sarah (US Warm)' }),
  });
  const ttsData = await ttsRes.json();
  console.log('Azure Speech TTS result:', {
    message: ttsData.message,
    clipCountWithAudio: (ttsData.clips || []).filter(c => Boolean(c.audioDataUrl)).length,
  });

  await page.goto(`${BASE_URL}/guide/guide-101`, { waitUntil: 'networkidle' });
  await page.waitForSelector('audio', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT_DIR, '20-studio-editor-live-ai-tts.png') });
  console.log('Captured 20-studio-editor-live-ai-tts.png');

  // 7. Test Live Clueso Pilot Chat with Azure OpenAI gpt-6.1-sol
  console.log('Testing live Clueso Pilot chat with gpt-6.1-sol...');
  const chatRes = await fetch(`${BASE_URL}/api/chats/chat-101`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Give me a 2-bullet summary of how to make our onboarding video more engaging.',
    }),
  });
  const chatData = await chatRes.json();
  const lastMsg = chatData.messages?.[chatData.messages.length - 1];
  console.log('Live Pilot Assistant reply preview:', (lastMsg?.content || '').slice(0, 160));

  // 8. Check /api/ready ledger counts
  const readyRes = await fetch(`${BASE_URL}/api/ready`);
  const ready = await readyRes.json();
  console.log('Readiness & AI/Speech ledger counts:', JSON.stringify(ready));

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
