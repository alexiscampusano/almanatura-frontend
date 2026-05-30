import { chromium } from 'playwright';
import { source as axeSource } from 'axe-core';

const URL = process.env.AXE_URL || 'http://127.0.0.1:5173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Visiting', URL);
  await page.goto(URL);
  // Inject axe source into page
  await page.evaluate((axe) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = axe;
    document.head.appendChild(script);
  }, axeSource);

  // Run axe
  const results = await page.evaluate(async () => {
    // global axe is available now
    // eslint-disable-next-line no-undef
    return await axe.run();
  });

  console.log('axe results summary:');
  console.log(JSON.stringify({ violations: results.violations.length, passes: results.passes.length }, null, 2));

  if (results.violations && results.violations.length > 0) {
    console.error('Accessibility violations found:');
    for (const v of results.violations) {
      console.error(`- ${v.id}: ${v.impact} (${v.nodes.length} nodes)`);
      console.error(v.help);
    }
    await browser.close();
    process.exit(1);
  }

  await browser.close();
  console.log('No accessibility violations (axe).');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(2);
});
