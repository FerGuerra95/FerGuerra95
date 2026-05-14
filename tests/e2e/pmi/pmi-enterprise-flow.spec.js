import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

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
  await page.waitForLoadState('networkidle').catch(() => {});

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

test('PMI enterprise dashboard exposes case, M&A handoff, CRUD and audit controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAsDemoAdmin(page);

  await page.goto('/pmi/dashboard');
  await expect(page).toHaveURL(/\/pmi\/dashboard/);
  await expect(page.getByText('PMI & Synergies Command Center.')).toBeVisible();
  await expect(page.getByText('PMI case portfolio')).toBeVisible();
  await expect(page.getByText('Convert deal to PMI')).toBeVisible();
  await expect(page.getByText('Live integration controls')).toBeVisible();
  await expect(page.getByText('PMI governance log')).toBeVisible();
  await expect(page.getByRole('button', { name: 'New from template' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Convert to PMI' })).toBeVisible();

  await page.getByRole('button', { name: 'New from template' }).click();
  await expect(page.locator('strong', { hasText: 'Industrial integration' }).first()).toBeVisible();

  await page.getByLabel('New workstream').fill('Customer handoff');
  await page.getByRole('textbox', { name: 'Workstream owner' }).fill('PMI Lead');
  await page.locator('form').filter({ has: page.getByLabel('New workstream') }).getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: 'Customer handoff' })).toBeVisible();

  await page.getByLabel('New risk').fill('Customer churn risk');
  await page.getByLabel('Risk owner').fill('Revenue Lead');
  await page.locator('form').filter({ has: page.getByLabel('New risk') }).getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: 'Customer churn risk' })).toBeVisible();

  await page.getByLabel('Add board action').fill('Prepare CEO integration readout');
  await page.locator('form').filter({ has: page.getByLabel('Add board action') }).getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Prepare CEO integration readout')).toBeVisible();

  await assertNoSurfaceRegression(page);

  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Post-Merger Execution' })).toBeVisible();
  await expect(page.getByText('PMI Signal')).toBeVisible();
});

test('PMI enterprise branch pages load without undefined financial state', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await loginAsDemoAdmin(page);

  const routes = [
    ['/pmi/programs', 'Integration programs.'],
    ['/pmi/synergies', 'Synergy capture tracker.'],
    ['/pmi/milestones', 'Integration milestone tracker.'],
    ['/pmi/risks', 'Integration risk register.'],
    ['/pmi/day1', 'Day 1 readiness.'],
    ['/pmi/day-100', '30-60-90-100 integration plan.'],
    ['/pmi/transition-services', 'Transition services.'],
    ['/pmi/operating-model', 'Target operating model.'],
    ['/pmi/people-culture', 'People and culture.'],
    ['/pmi/technology', 'Technology integration.'],
    ['/pmi/reports', 'PMI executive reporting.']
  ];

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await assertNoSurfaceRegression(page);
  }
});
