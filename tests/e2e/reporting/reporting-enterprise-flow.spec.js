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

test('Reporting enterprise routes load and report library creates records', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAsDemoAdmin(page);

  await page.goto('/reporting/dashboard');
  await expect(page.getByRole('heading', { name: 'Board packs and executive reporting.' })).toBeVisible();
  await assertNoSurfaceRegression(page);

  await page.goto('/reporting/library');
  await expect(page.getByRole('heading', { name: 'Report library.' })).toBeVisible();
  await page.getByLabel('title').fill('Board Executive Snapshot');
  await page.getByLabel('module', { exact: true }).fill('CEO');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Board Executive Snapshot' }).first()).toBeVisible();
  await assertNoSurfaceRegression(page);

  const routes = [
    ['/reporting/templates', 'Template manager.'],
    ['/reporting/board-pack', 'Board pack builder.'],
    ['/reporting/exports', 'Export ledger.'],
    ['/reporting/schedules', 'Scheduled reports.'],
    ['/reporting/evidence', 'Evidence-backed reports.']
  ];

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await assertNoSurfaceRegression(page);
  }
});
