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

  await expect(page.getByRole('heading', { name: 'Executive Command Center.' })).toBeVisible();
  const commandCenter = page.getByTestId('ceo-command-center-enterprise');
  await expect(commandCenter).toBeVisible();
  await expect(commandCenter.getByText('Executive Readiness Index')).toBeVisible();
  await expect(commandCenter.getByText('Corporate Health Radar')).toBeVisible();
  await expect(commandCenter.getByText('Executive Signal Feed')).toBeVisible();
  await expect(commandCenter.getByText('Decision Queue')).toBeVisible();
  await expect(commandCenter.getByText('Executive Calendar')).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/overview');
  await expect(page.getByTestId('ceo-command-center-enterprise')).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/ceo/overview');
  await expect(page.getByTestId('ceo-command-center-enterprise')).toBeVisible();
  await assertNoSurfaceRegression(page);
});
