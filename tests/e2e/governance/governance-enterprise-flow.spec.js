import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const GOVERNANCE_ENTERPRISE_ROUTES = [
  ['/governance/dashboard', 'Governance command center.'],
  ['/governance/decisions', 'Executive decisions.'],
  ['/governance/board-packs', 'Governance board packs.'],
  ['/governance/policies', 'Corporate policy register.'],
  ['/governance/committees', 'Committee operations.'],
  ['/governance/actions', 'Governance action items.'],
  ['/governance/meetings', 'Meeting minutes lite.'],
  ['/governance/reports', 'Governance reports.'],
  ['/governance/audit-trail', 'Governance audit trail.']
];

const FORBIDDEN_TEXT_MARKERS = [
  'undefined',
  'NaN',
  'Infinity'
];

async function assertNoSurfaceRegression(page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(250);

  const result = await page.evaluate((markers) => {
    const bodyText = document.body.innerText || '';
    const documentElement = document.documentElement;

    return {
      horizontalOverflow:
        documentElement.scrollWidth - documentElement.clientWidth,
      forbiddenMarkers: markers.filter((marker) => bodyText.includes(marker))
    };
  }, FORBIDDEN_TEXT_MARKERS);

  expect(result.horizontalOverflow).toBeLessThanOrEqual(64);
  expect(result.forbiddenMarkers).toEqual([]);
}

test('Governance enterprise branch exposes dashboard, registers and reporting views', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await loginAsDemoAdmin(page);

  for (const [route, expectedText] of GOVERNANCE_ENTERPRISE_ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
    await expect(page.getByText(expectedText)).toBeVisible();
    await assertNoSurfaceRegression(page);
  }

  await page.goto('/governance/decisions', { waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel('Decision title')).toBeVisible();
  await expect(page.getByLabel('Owner')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create decision' })).toBeEnabled();
});
