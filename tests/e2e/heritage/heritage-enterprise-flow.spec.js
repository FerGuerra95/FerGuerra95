import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const ROUTES = [
  ['/heritage/dashboard', 'Owner continuity command center.'],
  ['/heritage/assets', 'Controlled patrimony register.'],
  ['/heritage/successions', 'Succession planning.'],
  ['/heritage/protections', 'Asset protection controls.'],
  ['/heritage/documents', 'Controlled documents.'],
  ['/heritage/reports', 'Continuity reports.'],
  ['/heritage/audit-trail', 'Heritage audit trail.']
];

async function assertNoBrokenNumbers(page) {
  const result = await page.evaluate(() => {
    const bodyText = document.body.innerText || '';
    return ['undefined', 'NaN', 'Infinity'].filter((marker) => bodyText.includes(marker));
  });
  expect(result).toEqual([]);
}

test('Heritage enterprise routes render dashboard, registers and reports', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await loginAsDemoAdmin(page);

  for (const [route, expectedText] of ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
    await expect(page.getByText(expectedText)).toBeVisible();
    await assertNoBrokenNumbers(page);
  }
});
