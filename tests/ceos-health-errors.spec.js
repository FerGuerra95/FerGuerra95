import { test, expect } from '@playwright/test';

const BASE_URL = process.env.CEOS_BASE_URL || 'https://ceos-os.onrender.com';
const TEST_USER = process.env.CEOS_USER;
const TEST_PASSWORD = process.env.CEOS_PASSWORD;

function requireEnv() {
  if (!TEST_USER || !TEST_PASSWORD) {
    throw new Error(
      'Faltan credenciales. Define CEOS_USER y CEOS_PASSWORD antes de ejecutar el test.'
    );
  }
}

async function parseJsonResponse(response) {
  const text = await response.text();

  if (!text) return null;

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

function extractData(payload) {
  return payload?.data ?? payload;
}

async function login(request) {
  const response = await request.post(`${BASE_URL}/api/auth/login`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      email: TEST_USER,
      password: TEST_PASSWORD
    },
    failOnStatusCode: false
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok()) {
    throw new Error(
      [
        `No se pudo iniciar sesión. Status: ${response.status()}`,
        JSON.stringify(payload, null, 2)
      ].join('\n')
    );
  }

  const data = extractData(payload);
  const token = data?.token || payload?.token;

  if (!token) {
    throw new Error('Login correcto pero no se recibió token.');
  }

  return {
    token,
    user: data?.user || payload?.user || null
  };
}

test.describe('CEO’s OS - QA healthchecks, rutas y errores online', () => {
  test('healthchecks públicos responden correctamente', async ({ request }) => {
    const health = await request.get(`${BASE_URL}/health`, {
      failOnStatusCode: false
    });

    expect(health.status()).toBe(200);

    const apiHealth = await request.get(`${BASE_URL}/api/health`, {
      failOnStatusCode: false
    });

    expect(apiHealth.status()).toBe(200);
  });

  test('rutas React refrescan y sirven HTML', async ({ request }) => {
    const routes = [
      '/login',
      '/ma/dashboard',
      '/compliance/dashboard',
      '/funding/dashboard'
    ];

    for (const route of routes) {
      const response = await request.get(`${BASE_URL}${route}`, {
        failOnStatusCode: false
      });

      expect(response.status(), route).toBe(200);

      const contentType = response.headers()['content-type'] || '';
      expect(contentType.toLowerCase(), route).toContain('text/html');

      const body = await response.text();
      expect(body, route).toContain('<!doctype html');
    }
  });

  test('API protegida devuelve 401 sin token', async ({ request }) => {
    const protectedRoutes = [
      '/api/auth/me',
      '/api/suppliers',
      '/api/alerts',
      '/api/evidence',
      '/api/reviews',
      '/api/reports?type=compliance',
      '/api/ma/cases'
    ];

    for (const route of protectedRoutes) {
      const response = await request.get(`${BASE_URL}${route}`, {
        failOnStatusCode: false
      });

      expect(response.status(), route).toBe(401);
    }
  });

  test('API protegida devuelve 401 con token inválido', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/suppliers`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
    });

    expect(response.status()).toBe(401);
  });

  test('token real permite consultar /api/auth/me', async ({ request }) => {
    requireEnv();

    const session = await login(request);

    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      failOnStatusCode: false
    });

    const payload = await parseJsonResponse(response);
    const data = extractData(payload);
    const user = data?.user || data;

    expect(response.status()).toBe(200);
    expect(user?.email).toBe(TEST_USER);
    expect(user?.organizationId).toBeTruthy();
  });

  test('recursos inexistentes protegidos devuelven 404 con token real', async ({ request }) => {
    requireEnv();

    const session = await login(request);

    const missingRoutes = [
      '/api/suppliers/missing_supplier_qa',
      '/api/alerts/missing_alert_qa',
      '/api/evidence/missing_evidence_qa',
      '/api/reviews/missing_review_qa',
      '/api/reports/compliance/missing_report_qa',
      '/api/ma/cases/missing_case_qa'
    ];

    for (const route of missingRoutes) {
      const response = await request.get(`${BASE_URL}${route}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        failOnStatusCode: false
      });

      expect(response.status(), route).toBe(404);
    }
  });
});