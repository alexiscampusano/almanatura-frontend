import { chromium } from 'playwright';

const TARGET = process.env.TARGET_URL || 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Visiting', TARGET);
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 });

  // Inject axe-core from CDN into the page
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.11.4/axe.min.js' });

  // Run axe in page context
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run();
  });

  console.log(JSON.stringify(results, null, 2));

  const violations = results.violations || [];
  if (violations.length > 0) {
    console.error(`Axe found ${violations.length} violations`);
    for (const v of violations) {
      console.error(`- ${v.id} (${v.impact}): ${v.help}`);
    }
    await browser.close();
    process.exit(2);
  }

  console.log('No axe violations found');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(3);
});
