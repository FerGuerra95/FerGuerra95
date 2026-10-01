import { expect, test } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

const FORBIDDEN_TEXT_MARKERS = ['undefined', 'NaN', 'Infinity', 'CEOÃ', 'Â', '�'];

async function assertNoSurfaceRegression(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  const result = await page.evaluate((markers) => {
    const bodyText = document.body.innerText || '';
    return {
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      forbiddenMarkers: markers.filter((marker) => bodyText.includes(marker))
    };
  }, FORBIDDEN_TEXT_MARKERS);
  expect(result.horizontalOverflow).toBeLessThanOrEqual(96);
  expect(result.forbiddenMarkers).toEqual([]);
}

test('CEO Command Center enterprise overview loads with executive panels', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await loginAsDemoAdmin(page);

  const commandCenter = page.getByTestId('ceo-command-center-enterprise');
  await expect(commandCenter).toBeVisible();
  await expect(commandCenter.getByText('Executive Command Center', { exact: true })).toBeVisible();
  await expect(commandCenter.locator('h1.ceo-command-hero-title')).toBeVisible();
  await expect(commandCenter.getByText('Executive Readiness Index', { exact: true })).toBeVisible();
  await expect(commandCenter.getByText('Corporate Health Radar', { exact: true })).toBeVisible();
  await expect(commandCenter.getByText('Executive Decision Queue', { exact: true })).toBeVisible();
  await expect(commandCenter.getByText('Cross-Module Intelligence Summary', { exact: true })).toBeVisible();
  await expect(commandCenter.getByText('Executive Decision Queue — Live', { exact: true })).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/overview');
  await expect(page.getByTestId('ceo-command-center-enterprise')).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/ceo/overview');
  await expect(page.getByTestId('ceo-command-center-enterprise')).toBeVisible();
  await assertNoSurfaceRegression(page);
});
