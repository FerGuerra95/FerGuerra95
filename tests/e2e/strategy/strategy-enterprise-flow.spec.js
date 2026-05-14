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

test('Strategy enterprise routes load and objectives create records', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAsDemoAdmin(page);

  await page.goto('/strategy/dashboard');
  await expect(page.getByRole('heading', { name: 'Strategic execution command center.' })).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/strategy/objectives');
  await expect(page.getByRole('heading', { name: 'Strategic objectives.' })).toBeVisible();
  await page.getByLabel('title').fill('Enterprise expansion');
  await page.getByLabel('owner', { exact: true }).fill('Strategy Office');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Enterprise expansion' }).first()).toBeVisible();
  await assertNoSurfaceRegression(page);

  const routes = [
    ['/strategy/initiatives', 'Strategic initiatives.'],
    ['/strategy/scenarios', 'Strategic scenarios.'],
    ['/strategy/market-notes', 'Market and competitive notes.'],
    ['/strategy/risks', 'Strategic risks.'],
    ['/strategy/reports', 'Strategy reports.']
  ];

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await assertNoSurfaceRegression(page);
  }
});
