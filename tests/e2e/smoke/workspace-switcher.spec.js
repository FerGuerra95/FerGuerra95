import { test, expect } from '@playwright/test';

import { loginAsDemoAdmin } from '../helpers/auth.js';

async function expectRailVisible(page) {
  await expect(page.getByTestId('workspace-rail')).toBeVisible();
  await expect(page.getByTestId('workspace-rail-track')).toBeVisible();
  await expect(page.locator('.ceos-workspace-rail-item')).toHaveCount(10);
}

async function expectActiveWorkspace(page, key) {
  await expect(
    page.getByTestId(`workspace-rail-item-${key}`)
  ).toHaveAttribute('aria-current', 'page');
}

async function selectWorkspace(page, key) {
  const item = page.getByTestId(`workspace-rail-item-${key}`);

  await item.scrollIntoViewIfNeeded();
  await item.click();
}

test.describe('Workspace switcher', () => {
  test('navega entre Risk, Reporting y Strategy sin caer en M&A', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsDemoAdmin(page);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expectRailVisible(page);
    await expectActiveWorkspace(page, 'overview');

    await selectWorkspace(page, 'risk');
    await expect(page).toHaveURL(/\/risk\/dashboard/);
    await expect(
      page.getByRole('heading', { name: /Risk command center/i })
    ).toBeVisible();
    await expectActiveWorkspace(page, 'risk');

    await selectWorkspace(page, 'reporting');
    await expect(page).toHaveURL(/\/reporting\/dashboard/);
    await expect(
      page.getByRole('heading', {
        name: /Board packs and executive reporting/i
      })
    ).toBeVisible();
    await expectActiveWorkspace(page, 'reporting');

    await selectWorkspace(page, 'strategy');
    await expect(page).toHaveURL(/\/strategy\/dashboard/);
    await expect(
      page.getByRole('heading', {
        name: /Strategic execution command center/i
      })
    ).toBeVisible();
    await expectActiveWorkspace(page, 'strategy');

    await selectWorkspace(page, 'overview');
    await expect(page).toHaveURL(/\/dashboard/);
    await expectActiveWorkspace(page, 'overview');
  });
});
