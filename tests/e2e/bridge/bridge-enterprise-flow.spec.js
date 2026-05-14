import { expect, test } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const FORBIDDEN_TEXT_MARKERS = ['undefined', 'NaN', 'Infinity', 'CEOâ', 'Â', 'Ã', '�'];

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

test('Bridge enterprise cross-module routes load and recalculate signals', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAsDemoAdmin(page);

  await page.goto('/bridge/dashboard');
  await expect(page.getByRole('heading', { name: 'Cross-module intelligence layer.' })).toBeVisible();
  await page.getByRole('button', { name: 'Recalculate signals' }).click();
  await expect(page.getByText('Cross-module signals')).toBeVisible();
  await assertNoSurfaceRegression(page);

  const routes = [
    ['/bridge/signals', 'Cross-module signal control.'],
    ['/bridge/dependencies', 'Dependency map.'],
    ['/bridge/conflicts', 'Conflict register.'],
    ['/bridge/attention-queue', 'Executive attention queue.'],
    ['/bridge/reports', 'Bridge reports.'],
    ['/bridge/snapshots', 'CEO Bridge snapshots.']
  ];

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await assertNoSurfaceRegression(page);
  }
});
