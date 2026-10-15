const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3100';
const OUT_DIR = path.join(__dirname, '..', 'screenshots', 'clone-verification');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const routesToVerify = [
    { name: '01-marketing-home', path: '/', expectText: 'Product videos' },
    { name: '02-marketing-pricing', path: '/pricing', expectText: 'Starter' },
    { name: '03-auth-login', path: '/login', expectText: 'Log in to Clueso' },
    { name: '04-workspace-home', path: '/home', expectText: 'What are we creating today?' },
    { name: '05-workspace-projects', path: '/home/projects', expectText: 'Product Onboarding Walkthrough' },
    { name: '06-workspace-brand', path: '/home/brand', expectText: 'Brand' },
    { name: '07-workspace-agent', path: '/home/agent', expectText: 'Meet Clueso Agent' },
    { name: '08-workspace-mcp', path: '/home/mcp', expectText: 'MCP' },
    { name: '09-settings-general', path: '/home/settings/general', expectText: 'Workspace settings' },
    { name: '10-settings-player', path: '/home/settings/customize-player', expectText: 'How would you like to customize your video player?' },
    { name: '11-studio-editor-video', path: '/guide/guide-101', expectText: 'AI Rewrite' },
    { name: '12-export-page', path: '/export/guide-101', expectText: 'Export, Publish & Embed Pipeline' },
    { name: '13-public-share', path: '/share/guide-101', expectText: 'Step-by-Step Written Guide' },
  ];

  for (const item of routesToVerify) {
    const url = `${BASE_URL}${item.path}`;
    console.log(`[Verify] Visiting ${url} ...`);
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    if (!res || res.status() >= 400) {
      throw new Error(`HTTP ${res ? res.status() : 'ERR'} on ${url}`);
    }
    await page.waitForTimeout(400);
    const bodyText = await page.innerText('body');
    if (!bodyText.includes(item.expectText)) {
      throw new Error(`Expected text "${item.expectText}" not found on ${item.path}`);
    }
    await page.screenshot({ path: path.join(OUT_DIR, `${item.name}.png`) });
  }

  // Interactive Studio Editor verification on /guide/guide-101
  console.log('[Verify] Testing Studio Editor interactive tools & modals...');
  await page.goto(`${BASE_URL}/guide/guide-101`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Switch to Effects tool
  await page.getByRole('button', { name: 'Effects' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, '14-studio-effects-drawer.png') });

  // Open Magic Translate modal
  await page.getByRole('button', { name: 'Translate' }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, '15-studio-magic-translate.png') });
  await page.getByRole('button', { name: 'Cancel' }).click();

  // Switch to Article mode
  await page.getByRole('button', { name: 'Article', exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, '16-studio-article-mode.png') });

  await browser.close();
  console.log('All E2E clone verifications passed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
