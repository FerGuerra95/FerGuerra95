import { test, expect } from '@playwright/test';

const BASE_URL = process.env.CEOS_BASE_URL || 'https://ceos-os.onrender.com';
const TEST_USER = process.env.CEOS_USER;
const TEST_PASSWORD = process.env.CEOS_PASSWORD;

async function fillFirstAvailable(page, selectors, value) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();

    if (await locator.count()) {
      await locator.fill(value);
      return selector;
    }
  }

  throw new Error(
    `No se encontró ningún campo válido entre estos selectores: ${selectors.join(', ')}`
  );
}

async function clickFirstAvailable(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();

    if (await locator.count()) {
      await locator.click();
      return selector;
    }
  }

  throw new Error(
    `No se encontró ningún botón válido entre estos selectores: ${selectors.join(', ')}`
  );
}

test.describe('CEO’s OS - QA login online', () => {
  test('usuario puede iniciar sesión y cargar dashboard sin errores API', async ({ page }) => {
    if (!TEST_USER || !TEST_PASSWORD) {
      throw new Error(
        'Faltan credenciales. Define CEOS_USER y CEOS_PASSWORD antes de ejecutar el test.'
      );
    }

    const consoleErrors = [];
    const failedRequests = [];
    const badResponses = [];
    const localhostRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('request', (request) => {
      if (request.url().includes('localhost:4000')) {
        localhostRequests.push(request.url());
      }
    });

    page.on('requestfailed', (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()} - ${request.failure()?.errorText}`
      );
    });

    page.on('response', (response) => {
      const status = response.status();
      const url = response.url();

      if (
        url.includes('/api/') &&
        [401, 403, 404, 500, 502, 503].includes(status)
      ) {
        badResponses.push(`${status} ${url}`);
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto(`${BASE_URL}/login?qa=${Date.now()}`, {
      waitUntil: 'networkidle'
    });

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(`${BASE_URL}/login?qa=${Date.now()}`, {
      waitUntil: 'networkidle'
    });

    await expect(page).toHaveURL(/\/login/);

    await fillFirstAvailable(
      page,
      [
        'input[type="email"]',
        'input[name="email"]',
        'input[name="username"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="correo" i]',
        'input[type="text"]'
      ],
      TEST_USER
    );

    await fillFirstAvailable(
      page,
      [
        'input[type="password"]',
        'input[name="password"]',
        'input[placeholder*="password" i]',
        'input[placeholder*="contraseña" i]'
      ],
      TEST_PASSWORD
    );

    await clickFirstAvailable(page, [
      'button[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Iniciar")',
      'button:has-text("Entrar")',
      'button:has-text("Acceder")'
    ]);

    await page.waitForTimeout(3000);

    const currentUrl = page.url();

    if (!currentUrl.toLowerCase().includes('/dashboard')) {
      const visibleText = await page.locator('body').innerText();

      throw new Error(
        [
          'No se llegó al dashboard.',
          `URL actual: ${currentUrl}`,
          '',
          'Esto normalmente significa que las credenciales usadas no son de un usuario real del backend en producción.',
          'Si user@ceoos.local / user123 era solo usuario demo, ahora es correcto que no entre.',
          '',
          `Texto visible: ${visibleText.slice(0, 1200)}`
        ].join('\n')
      );
    }

    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/ceos-dashboard-login-ok.png',
      fullPage: true
    });

    expect(
      localhostRequests,
      `La app online no debe llamar a localhost:\n${localhostRequests.join('\n')}`
    ).toEqual([]);

    expect(
      failedRequests,
      `Hay requests fallidas:\n${failedRequests.join('\n')}`
    ).toEqual([]);

    expect(
      badResponses,
      `Hay respuestas API con error:\n${badResponses.join('\n')}`
    ).toEqual([]);

    expect(
      consoleErrors,
      `Hay errores de consola:\n${consoleErrors.join('\n')}`
    ).toEqual([]);
  });
});