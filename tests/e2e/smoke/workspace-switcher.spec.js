import { test, expect } from '@playwright/test';

import { loginAsDemoAdmin } from '../helpers/auth.js';

async function openWorkspaceMenu(page) {
  await page.locator('.ceos-workspace-trigger').click();
  await expect(page.locator('.ceos-workspace-menu')).toBeVisible();
}

async function selectWorkspace(page, label) {
  await openWorkspaceMenu(page);
  await page
    .getByRole('menuitem')
    .filter({ has: page.getByText(label, { exact: true }) })
    .click();
}

test.describe('Workspace switcher', () => {
  test('navega entre Risk, Reporting y Strategy sin caer en M&A', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsDemoAdmin(page);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.ceos-workspace-trigger-title')).toHaveText(
      'CEO Overview'
    );

    await selectWorkspace(page, 'Risk');
    await expect(page).toHaveURL(/\/risk\/dashboard/);
    await expect(
      page.getByRole('heading', { name: /Risk command center/i })
    ).toBeVisible();
    await expect(page.locator('.ceos-workspace-trigger-title')).toHaveText(
      'Risk'
    );

    await selectWorkspace(page, 'Reporting');
    await expect(page).toHaveURL(/\/reporting\/dashboard/);
    await expect(
      page.getByRole('heading', {
        name: /Board packs and executive reporting/i
      })
    ).toBeVisible();
    await expect(page.locator('.ceos-workspace-trigger-title')).toHaveText(
      'Reporting'
    );

    await selectWorkspace(page, 'Strategy');
    await expect(page).toHaveURL(/\/strategy\/dashboard/);
    await expect(
      page.getByRole('heading', {
        name: /Strategic execution command center/i
      })
    ).toBeVisible();
    await expect(page.locator('.ceos-workspace-trigger-title')).toHaveText(
      'Strategy'
    );

    await selectWorkspace(page, 'CEO Overview');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.ceos-workspace-trigger-title')).toHaveText(
      'CEO Overview'
    );
  });
});
