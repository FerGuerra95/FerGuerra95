import { test, expect } from '@playwright/test';

import { loginAsDemoAdmin } from '../helpers/auth.js';

/**
 * Recorrido ligero de los hubs principales tras sesión API + localStorage (mismo helper que PMI).
 * Detecta regresiones de rutas protegidas, shell o providers antes de suites más largas.
 */
test.describe('Smoke hubs autenticados', () => {
  test('CEO, M&A, Compliance, Funding y PMI cargan señales de cabecera', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsDemoAdmin(page);

    await expect(page.getByText('Executive Command Center.')).toBeVisible();

    await page.goto('/ma/dashboard');
    await expect(page).toHaveURL(/\/ma\/dashboard/);
    await expect(page.getByText('Private M&A Intelligence.')).toBeVisible();

    await page.goto('/compliance/dashboard');
    await expect(page).toHaveURL(/\/compliance\/dashboard/);
    await expect(page.getByText('Supply Chain Compliance.')).toBeVisible();

    await page.goto('/funding/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/funding\/dashboard/);
    await expect(
      page
        .locator('[data-testid="funding-dashboard-root"], .funding-dashboard-page')
        .first()
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page
        .locator(
          '[data-testid="funding-dashboard-title"], .funding-hero h1.funding-title, .funding-title'
        )
        .first()
    ).toContainText(
      /Funding Command Center|Funding Dashboard|Funding Workspace|Raise capital with a sharper story/i
    );

    await page.goto('/pmi/dashboard');
    await expect(page).toHaveURL(/\/pmi\/dashboard/);
    await expect(page.getByText('PMI & Synergies Command Center.')).toBeVisible();
  });
});
