import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

test('flujo de proveedores compliance', async ({ page }) => {
  await loginAsDemoAdmin(page);

  await page.goto('/compliance/suppliers');
  await expect(page).toHaveURL(/\/compliance/);
});
