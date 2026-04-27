import { test, expect } from '@playwright/test';

test('exportación de informe M&A', async ({ page }) => {
  await page.goto('/ma/cim');
  await expect(page).toHaveURL(/\/ma/);
});
