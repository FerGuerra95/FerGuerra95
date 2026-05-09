import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

test('exportacion de informe M&A', async ({ page }) => {
  await loginAsDemoAdmin(page);

  await page.goto('/ma/cim');
  await expect(page).toHaveURL(/\/ma/);
});
