const fs = require('fs');
const path = require('path');
const { chromium } = require('/home/azadmin/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');

function loadCookiesFromCred(credPath) {
  const raw = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
  return raw.map((c) => {
    let sameSite = 'Lax';
    if (typeof c.sameSite === 'string') {
      const lower = c.sameSite.toLowerCase();
      if (lower === 'strict') sameSite = 'Strict';
      else if (lower === 'none' || lower === 'no_restriction') sameSite = 'None';
      else sameSite = 'Lax';
    }
    const cookie = {
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path || '/',
      secure: sameSite === 'None' ? true : Boolean(c.secure),
      httpOnly: Boolean(c.httpOnly),
      sameSite,
    };
    if (c.expirationDate && !c.session) {
      cookie.expires = Math.floor(Number(c.expirationDate));
    }
    return cookie;
  });
}

const MARKETING_PAGES = [
  { slug: '01-home', url: 'https://www.clueso.io/' },
  { slug: '02-pricing', url: 'https://www.clueso.io/pricing' },
  { slug: '03-enterprise', url: 'https://www.clueso.io/enterprise' },
  { slug: '04-agents', url: 'https://www.clueso.io/agents' },
  { slug: '05-mcp', url: 'https://www.clueso.io/mcp' },
  { slug: '06-clueprints', url: 'https://www.clueso.io/clueprints' },
  { slug: '07-feature-video', url: 'https://www.clueso.io/features/video-features' },
  { slug: '08-feature-help-articles', url: 'https://www.clueso.io/features/help-articles' },
  { slug: '09-feature-translate', url: 'https://www.clueso.io/features/auto-translate' },
  { slug: '10-feature-voiceovers', url: 'https://www.clueso.io/features/ai-voiceovers' },
  { slug: '11-feature-slides-to-video', url: 'https://www.clueso.io/features/ppt-video' },
  { slug: '12-customers', url: 'https://www.clueso.io/customers' },
  { slug: '13-showcase', url: 'https://www.clueso.io/showcase' },
  { slug: '14-changelog', url: 'https://www.clueso.io/changelog' },
  { slug: '15-auth-signup', url: 'https://accounts.clueso.io/signup' },
  { slug: '16-auth-login', url: 'https://accounts.clueso.io/login' },
];

(async () => {
  const cookies = loadCookiesFromCred(path.join(__dirname, '../../.cred'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  await context.addCookies(cookies);

  const page = await context.newPage();
  const summary = [];

  for (const item of MARKETING_PAGES) {
    try {
      console.log(`Visiting ${item.url} ...`);
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);
      const outViewport = path.join(__dirname, `../../screenshots/marketing/${item.slug}.png`);
      await page.screenshot({ path: outViewport, fullPage: false });

      // Also capture a scrolled mid-page screenshot on key pages
      await page.evaluate(() => window.scrollBy(0, 900));
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(__dirname, `../../screenshots/marketing/${item.slug}-scroll1.png`),
        fullPage: false,
      });

      const data = await page.evaluate(() => ({
        title: document.title,
        url: location.href,
        headings: Array.from(document.querySelectorAll('h1, h2, h3'))
          .map((h) => `${h.tagName}: ${(h.innerText || '').trim()}`)
          .slice(0, 30),
        buttons: Array.from(document.querySelectorAll('button'))
          .map((b) => (b.innerText || '').trim())
          .filter(Boolean)
          .slice(0, 25),
      }));
      summary.push({ ...item, ...data });

      // If on login or signup, also click SSO button to capture SSO view
      if (item.slug === '16-auth-login') {
        const ssoBtn = page.locator('button:has-text("SSO")');
        if ((await ssoBtn.count()) > 0) {
          await ssoBtn.first().click();
          await page.waitForTimeout(1000);
          await page.screenshot({
            path: path.join(__dirname, '../../screenshots/marketing/16b-auth-login-sso.png'),
          });
        }
      }
    } catch (err) {
      console.error(`Error on ${item.url}:`, err.message);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'marketing-pages-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  await browser.close();
  console.log('Done crawling marketing and auth pages.');
})();
