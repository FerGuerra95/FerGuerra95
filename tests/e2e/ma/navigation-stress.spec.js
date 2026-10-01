import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const MA_ROUTES = [
  '/ma/dashboard',
  '/ma/valuation',
  '/ma/pipeline',
  '/ma/deals'
];

test('MA navigation stress — 10 cycles without freeze', async ({ page }) => {
  test.setTimeout(300_000);

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await loginAsDemoAdmin(page);

  const timings = [];

  for (let cycle = 0; cycle < 10; cycle += 1) {
    for (const route of MA_ROUTES) {
      const started = Date.now();
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      await expect(page.locator('body')).toContainText(/M&A|Valuation|Deal|Pipeline|Repository/i);
      await expect(page.getByText('Algo salió mal')).toHaveCount(0);
      const elapsed = Date.now() - started;
      timings.push({ cycle: cycle + 1, route, elapsed });
    }
  }

  const firstHalf = timings.slice(0, Math.floor(timings.length / 2));
  const secondHalf = timings.slice(Math.floor(timings.length / 2));
  const avgFirst =
    firstHalf.reduce((sum, item) => sum + item.elapsed, 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((sum, item) => sum + item.elapsed, 0) / secondHalf.length;

  console.log(
    JSON.stringify({
      avgFirstMs: Math.round(avgFirst),
      avgSecondMs: Math.round(avgSecond),
      maxMs: Math.max(...timings.map((t) => t.elapsed)),
      samples: timings.length
    })
  );

  expect(avgSecond).toBeLessThan(avgFirst * 3);
  expect(Math.max(...timings.map((t) => t.elapsed))).toBeLessThan(20_000);

  const blockingErrors = consoleErrors.filter(
    (line) =>
      !line.includes('favicon') &&
      !line.includes('404') &&
      !line.includes('Failed to load resource')
  );
  expect(blockingErrors).toEqual([]);
});
