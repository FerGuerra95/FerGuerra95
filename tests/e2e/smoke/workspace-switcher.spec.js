import { test, expect } from '@playwright/test';

import { loginAsDemoAdmin } from '../helpers/auth.js';

async function openWorkspaceMenu(page) {
  await expect(
    page.locator('.ceos-shell-desktop-sidebar [data-testid="workspace-switcher"]')
  ).toBeVisible();
  await page
    .locator('.ceos-shell-desktop-sidebar [data-testid="workspace-switcher-trigger"]')
    .click();
  await expect(page.getByTestId('workspace-switcher-menu')).toBeVisible();
}

async function expectMenuVisible(page) {
  await openWorkspaceMenu(page);
  await expect(page.locator('[data-testid^="workspace-switcher-item-"]')).toHaveCount(
    11
  );
}

async function expectActiveWorkspace(page, key) {
  await page.keyboard.press('Escape');
  await openWorkspaceMenu(page);
  await expect(
    page.getByTestId(`workspace-switcher-item-${key}`)
  ).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('workspace-switcher-menu')).toHaveCount(0);
}

async function selectWorkspace(page, key) {
  await openWorkspaceMenu(page);
  const item = page.getByTestId(`workspace-switcher-item-${key}`);
  await item.focus();
  await page.keyboard.press('Enter');
}

test.describe('Workspace switcher', () => {
  test('navega entre Risk, Reporting y Strategy sin caer en M&A', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsDemoAdmin(page);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expectMenuVisible(page);
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
