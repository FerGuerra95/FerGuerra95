import { test, expect } from '@playwright/test';

import { getE2eCredentials } from '../helpers/auth.js';

test.describe('Auth smoke (local)', () => {
  test('login demo y navegación a dashboard', async ({ page }) => {
    const { email, password } = getE2eCredentials();
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.locator('#login-password').fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  });
});
