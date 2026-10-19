const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file:///home/claude/pack/pack.html', { waitUntil: 'networkidle' });
  try { await p.evaluate(() => document.fonts.ready); } catch(e){}
  await p.waitForTimeout(800);
  await p.pdf({ path: 'Prepared-at-Home-Household-Emergency-Plan-A4.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('PDF rendered');
})();
