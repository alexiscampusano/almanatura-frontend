import { chromium } from 'playwright';

const TARGET = process.env.TARGET_URL || 'http://localhost:4173';
const PAGES = (process.env.AXE_PAGES || '/').split(',').map((p) => p.trim());

async function auditPage(page, url) {
  console.log(`Visiting ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});

  // Wait for a main landmark or h1 to appear (single-page apps may render async)
  try {
    await page.waitForSelector('main, h1, #main-content, [role="main"]', { timeout: 15000 });
  } catch (e) {
    console.warn('Timed out waiting for main/h1 - proceeding to run axe anyway');
  }

  // Inject axe-core into the page via CDN (more robust for CI/local runs)
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.11.4/axe.min.js' });

  // Optional diagnostics
  const title = await page.title();
  const hasLang = await page.evaluate(() => !!document.documentElement.lang);
  console.log(`title: "${title}", html[lang]: ${hasLang}`);

  // Run axe in page context
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run();
  });

  console.log(JSON.stringify(results, null, 2));

  const violations = results.violations || [];
  if (violations.length > 0) {
    console.error(`Axe found ${violations.length} violations on ${url}`);
    for (const v of violations) {
      console.error(`- ${v.id} (${v.impact}): ${v.help}`);
    }
  }

  return violations.length;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let totalViolations = 0;
  for (const p of PAGES) {
    const url = p.startsWith('http') ? p : `${TARGET.replace(/\/$/, '')}${p === '/' ? '' : p}`;
    const count = await auditPage(page, url);
    totalViolations += count;
  }

  await browser.close();

  if (totalViolations > 0) {
    process.exit(2);
  }

  console.log('No axe violations found across all pages');
}

run().catch((err) => {
  console.error(err);
  process.exit(3);
});
