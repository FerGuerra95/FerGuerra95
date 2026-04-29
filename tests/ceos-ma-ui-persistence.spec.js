import { test, expect } from '@playwright/test';

const BASE_URL = process.env.CEOS_BASE_URL || 'https://ceos-os.onrender.com';
const TEST_USER = process.env.CEOS_USER;
const TEST_PASSWORD = process.env.CEOS_PASSWORD;

const AUTH_TOKEN_KEY = 'ceo_os_auth_token';

function requireEnv() {
  if (!TEST_USER || !TEST_PASSWORD) {
    throw new Error(
      'Faltan credenciales. Define CEOS_USER y CEOS_PASSWORD antes de ejecutar el test.'
    );
  }
}

function uniqueSuffix() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function extractData(payload) {
  return payload?.data ?? payload;
}

function extractItems(payload) {
  const data = extractData(payload);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

async function parseJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      [
        'Respuesta no JSON.',
        `Status: ${response.status()}`,
        `URL: ${response.url()}`,
        `Body: ${text.slice(0, 1000)}`
      ].join('\n')
    );
  }
}

async function fillFirstAvailable(page, selectors, value, options = {}) {
  const { optional = false } = options;

  for (const selector of selectors) {
    const locator = page.locator(selector).first();

    if ((await locator.count()) > 0 && (await locator.isVisible())) {
      await locator.fill(value);
      return selector;
    }
  }

  if (optional) return null;

  throw new Error(
    `No se encontró ningún campo válido entre estos selectores: ${selectors.join(', ')}`
  );
}

async function clickFirstAvailable(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();

    if ((await locator.count()) > 0 && (await locator.isVisible())) {
      await locator.click();
      return selector;
    }
  }

  throw new Error(
    `No se encontró ningún botón válido entre estos selectores: ${selectors.join(', ')}`
  );
}

async function loginViaUi(page) {
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

  await page.waitForURL(/\/.*dashboard/, {
    timeout: 10000
  });
}

async function getAuthTokenFromPage(page) {
  return page.evaluate((key) => localStorage.getItem(key), AUTH_TOKEN_KEY);
}

async function apiRequest(request, method, path, token, body = undefined) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const options = {
    headers,
    failOnStatusCode: false
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.data = body;
  }

  const response = await request[method](url, options);
  const payload = await parseJsonResponse(response);

  if (!response.ok()) {
    throw new Error(
      [
        `API error ${response.status()} ${method.toUpperCase()} ${url}`,
        JSON.stringify(payload, null, 2)
      ].join('\n')
    );
  }

  return payload;
}

async function cleanupMaCaseByName(request, token, caseName) {
  if (!token || !caseName) return;

  try {
    const listPayload = await apiRequest(request, 'get', '/api/ma/cases', token);
    const items = extractItems(listPayload);
    const matches = items.filter((item) => item.name === caseName);

    for (const item of matches) {
      if (item?.id) {
        await apiRequest(request, 'delete', `/api/ma/cases/${item.id}`, token);
      }
    }
  } catch {
    // No bloqueamos el resultado del test por una limpieza fallida.
  }
}

async function fillMaCaseName(page, caseName) {
  const filledSelector = await fillFirstAvailable(
    page,
    [
      'input[name="name"]',
      'input[id="name"]',
      'input[name="companyName"]',
      'input[name="dealName"]',
      'input[placeholder*="empresa" i]',
      'input[placeholder*="company" i]',
      'input[placeholder*="nombre" i]',
      'input[aria-label*="empresa" i]',
      'input[aria-label*="company" i]',
      'label:has-text("Empresa") input',
      'label:has-text("Company") input',
      'label:has-text("Nombre") input',
      'label:has-text("Deal") input'
    ],
    caseName,
    {
      optional: true
    }
  );

  if (filledSelector) return filledSelector;

  const visibleInputs = page
    .locator('input:not([type="hidden"]):not([type="password"]):not([type="email"])')
    .filter({
      hasNotText: ''
    });

  const count = await visibleInputs.count();

  for (let index = 0; index < count; index += 1) {
    const input = visibleInputs.nth(index);

    if (await input.isVisible()) {
      await input.fill(caseName);
      return `visible-input-${index}`;
    }
  }

  throw new Error('No se pudo localizar el campo de nombre del caso M&A.');
}

test.describe('CEO’s OS - QA M&A UI persistence', () => {
  test('usuario puede guardar un caso M&A desde la interfaz y recuperarlo tras refrescar y reloguear', async ({
    page,
    request
  }) => {
    requireEnv();

    const suffix = uniqueSuffix();
    const caseName = `QA UI M&A Persistence ${suffix}`;

    let token = '';

    try {
      await test.step('Login real desde interfaz', async () => {
        await loginViaUi(page);
        token = await getAuthTokenFromPage(page);

        expect(token).toBeTruthy();
      });

      await test.step('Abrir Valuation Engine y preparar caso único', async () => {
        await page.goto(`${BASE_URL}/ma/valuation?qa=${Date.now()}`, {
          waitUntil: 'networkidle'
        });

        await expect(page).toHaveURL(/\/ma\/valuation/);

        await fillMaCaseName(page, caseName);
      });

      await test.step('Guardar caso M&A desde interfaz', async () => {
        await clickFirstAvailable(page, [
          'button:has-text("Guardar caso")',
          'button:has-text("Guardar")',
          'button:has-text("Save case")',
          'button:has-text("Save")'
        ]);

        await page.waitForTimeout(1500);
      });

      await test.step('Confirmar caso en Deals Repository', async () => {
        await page.goto(`${BASE_URL}/ma/deals?qa=${Date.now()}`, {
          waitUntil: 'networkidle'
        });

        await expect(page).toHaveURL(/\/ma\/deals/);
        await expect(page.locator('body')).toContainText(caseName, {
          timeout: 10000
        });
      });

      await test.step('Refrescar y confirmar persistencia visual', async () => {
        await page.reload({
          waitUntil: 'networkidle'
        });

        await expect(page.locator('body')).toContainText(caseName, {
          timeout: 10000
        });
      });

      await test.step('Limpiar sesión y volver a iniciar sesión', async () => {
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });

        await loginViaUi(page);
        token = await getAuthTokenFromPage(page);

        expect(token).toBeTruthy();
      });

      await test.step('Confirmar que el caso sigue en backend tras reloguear', async () => {
        await page.goto(`${BASE_URL}/ma/deals?qa=${Date.now()}`, {
          waitUntil: 'networkidle'
        });

        await expect(page.locator('body')).toContainText(caseName, {
          timeout: 10000
        });
      });
    } finally {
      if (token) {
        await cleanupMaCaseByName(request, token, caseName);
      }
    }
  });
});