import { expect, test } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const FORBIDDEN_TEXT_MARKERS = ['undefined', 'NaN', 'Infinity', 'CEOÃ¢', 'Ã‚', 'Ãƒ', 'ï¿½'];

async function assertNoSurfaceRegression(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  const result = await page.evaluate((markers) => {
    const bodyText = document.body.innerText || '';
    const documentElement = document.documentElement;
    return {
      horizontalOverflow: documentElement.scrollWidth - documentElement.clientWidth,
      forbiddenMarkers: markers.filter((marker) => bodyText.includes(marker))
    };
  }, FORBIDDEN_TEXT_MARKERS);
  expect(result.horizontalOverflow).toBeLessThanOrEqual(64);
  expect(result.forbiddenMarkers).toEqual([]);
}

test('Risk enterprise routes load and expose register CRUD path', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAsDemoAdmin(page);

  await page.goto('/risk/dashboard');
  await expect(page.getByRole('heading', { name: 'Risk command center.' })).toBeVisible();
  await expect(page.getByText('Enterprise risk register')).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/risk/register');
  await expect(page.getByRole('heading', { name: 'Enterprise risk register.' })).toBeVisible();
  await page.getByLabel('title').fill('Cyber resilience exposure');
  await page.getByLabel('owner', { exact: true }).fill('CRO');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Cyber resilience exposure')).toBeVisible();
  await assertNoSurfaceRegression(page);

  const routes = [
    ['/risk/heatmap', 'Risk heatmap.'],
    ['/risk/controls', 'Controls library.'],
    ['/risk/mitigations', 'Mitigation plans.'],
    ['/risk/incidents', 'Incident and issue log.'],
    ['/risk/kri', 'KRI tracker.'],
    ['/risk/appetite', 'Risk appetite.'],
    ['/risk/reports', 'Risk reports.']
  ];

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await assertNoSurfaceRegression(page);
  }
});
