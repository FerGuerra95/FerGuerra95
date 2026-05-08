import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

test('flujo M&A smoke', async ({ page }) => {
  await loginAsDemoAdmin(page);

  await page.goto('/ma/dashboard');
  await expect(page).toHaveURL(/\/ma\/dashboard/);
});
