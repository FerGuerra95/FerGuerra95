import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const MA_ENTERPRISE_ROUTES = [
  '/ma/dashboard',
  '/ma/valuation',
  '/ma/pipeline',
  '/ma/waterfall',
  '/ma/matching',
  '/ma/cim',
  '/ma/deals',
  '/ma/data-room'
];

const FORBIDDEN_TEXT_MARKERS = [
  'undefined',
  'NaN',
  'Infinity',
  'CEO\u00e2',
  '\u00c2',
  '\u00c3',
  '\ufffd'
];

async function assertNoSurfaceRegression(page) {
  const result = await page.evaluate((markers) => {
    const bodyText = document.body.innerText || '';
    const documentElement = document.documentElement;

    return {
      horizontalOverflow:
        documentElement.scrollWidth - documentElement.clientWidth,
      forbiddenMarkers: markers.filter((marker) => bodyText.includes(marker))
    };
  }, FORBIDDEN_TEXT_MARKERS);

  expect(result.horizontalOverflow).toBeLessThanOrEqual(2);
  expect(result.forbiddenMarkers).toEqual([]);
}

test('M&A enterprise routes render without auth or navigation regressions', async ({ page }) => {
  await loginAsDemoAdmin(page);

  for (const route of MA_ENTERPRISE_ROUTES) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
    await expect(page.locator('body')).toContainText(/M&A|Valuation|Deal|Buyer|CIM/i);
    await assertNoSurfaceRegression(page);
  }
});
