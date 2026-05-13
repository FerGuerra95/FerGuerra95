import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

function seriousOrCritical(violations) {
  return violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );
}

test.describe('Accesibilidad (axe)', () => {
  test('pagina de login sin violaciones graves', async ({ page }) => {
    await page.goto('/login');
    const { violations } = await new AxeBuilder({ page }).analyze();

    expect(seriousOrCritical(violations)).toEqual([]);
  });

  test('landing sin violaciones graves', async ({ page }) => {
    await page.goto('/');
    const { violations } = await new AxeBuilder({ page }).analyze();

    expect(seriousOrCritical(violations)).toEqual([]);
  });

  test('secure share sin hash muestra error accesible', async ({ page }) => {
    await page.goto('/ma/secure-share');
    const { violations } = await new AxeBuilder({ page }).analyze();

    expect(seriousOrCritical(violations)).toEqual([]);
  });
});
