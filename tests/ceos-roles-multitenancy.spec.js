import { test, expect } from '@playwright/test';

const BASE_URL = process.env.CEOS_BASE_URL || 'https://ceos-os.onrender.com';

const ADMIN_A_EMAIL = process.env.CEOS_ADMIN_A_USER;
const ADMIN_A_PASSWORD = process.env.CEOS_ADMIN_A_PASSWORD;

const USER_A_EMAIL = process.env.CEOS_USER_A_USER;
const USER_A_PASSWORD = process.env.CEOS_USER_A_PASSWORD;

const VIEWER_A_EMAIL = process.env.CEOS_VIEWER_A_USER;
const VIEWER_A_PASSWORD = process.env.CEOS_VIEWER_A_PASSWORD;

const ADMIN_B_EMAIL = process.env.CEOS_ADMIN_B_USER;
const ADMIN_B_PASSWORD = process.env.CEOS_ADMIN_B_PASSWORD;

function requireEnv() {
  const missing = [];

  if (!ADMIN_A_EMAIL) missing.push('CEOS_ADMIN_A_USER');
  if (!ADMIN_A_PASSWORD) missing.push('CEOS_ADMIN_A_PASSWORD');
  if (!USER_A_EMAIL) missing.push('CEOS_USER_A_USER');
  if (!USER_A_PASSWORD) missing.push('CEOS_USER_A_PASSWORD');
  if (!VIEWER_A_EMAIL) missing.push('CEOS_VIEWER_A_USER');
  if (!VIEWER_A_PASSWORD) missing.push('CEOS_VIEWER_A_PASSWORD');
  if (!ADMIN_B_EMAIL) missing.push('CEOS_ADMIN_B_USER');
  if (!ADMIN_B_PASSWORD) missing.push('CEOS_ADMIN_B_PASSWORD');

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
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

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;

  return [];
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

async function login(request, email, password) {
  const response = await request.post(`${BASE_URL}/api/auth/login`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      email,
      password
    },
    failOnStatusCode: false
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok()) {
    throw new Error(
      [
        `No se pudo iniciar sesión con ${email}. Status: ${response.status()}`,
        JSON.stringify(payload, null, 2)
      ].join('\n')
    );
  }

  const data = extractData(payload);
  const token = data?.token || payload?.token;
  const user = data?.user || payload?.user;

  if (!token) {
    throw new Error(`Login correcto para ${email}, pero no se recibió token.`);
  }

  return {
    token,
    user
  };
}

async function apiRequest(
  request,
  method,
  path,
  token,
  body = undefined,
  expectedStatus = null
) {
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

  if (expectedStatus !== null) {
    expect(response.status(), `${method.toUpperCase()} ${url}`).toBe(expectedStatus);
    return payload;
  }

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

test.describe('CEO’s OS - QA roles y multi-tenancy online', () => {
  test('admin, user, viewer y otra organización respetan permisos y aislamiento', async ({ request }) => {
    requireEnv();

    const suffix = uniqueSuffix();

    let adminAToken = '';
    let userAToken = '';
    let viewerAToken = '';
    let adminBToken = '';

    let supplierId = '';
    let maCaseId = '';

    try {
      await test.step('Login de usuarios reales', async () => {
        const adminA = await login(request, ADMIN_A_EMAIL, ADMIN_A_PASSWORD);
        const userA = await login(request, USER_A_EMAIL, USER_A_PASSWORD);
        const viewerA = await login(request, VIEWER_A_EMAIL, VIEWER_A_PASSWORD);
        const adminB = await login(request, ADMIN_B_EMAIL, ADMIN_B_PASSWORD);

        adminAToken = adminA.token;
        userAToken = userA.token;
        viewerAToken = viewerA.token;
        adminBToken = adminB.token;

        expect(adminA.user?.role).toBe('admin');
        expect(userA.user?.role).toBe('user');
        expect(viewerA.user?.role).toBe('viewer');
        expect(adminB.user?.role).toBe('admin');

        expect(adminA.user?.organizationId).toBe('org_qa_a');
        expect(userA.user?.organizationId).toBe('org_qa_a');
        expect(viewerA.user?.organizationId).toBe('org_qa_a');
        expect(adminB.user?.organizationId).toBe('org_qa_b');
      });

      await test.step('Admin Org A crea proveedor', async () => {
        const payload = await apiRequest(
          request,
          'post',
          '/api/suppliers',
          adminAToken,
          {
            name: `QA Role Supplier ${suffix}`,
            country: 'España',
            region: 'Madrid',
            sector: 'Tecnología',
            tier: 'Tier 1',
            criticality: 'Alta',
            status: 'active',
            spend: 150000,
            riskScore: 35,
            resilienceScore: 75
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.organizationId).toBe('org_qa_a');

        supplierId = item.id;
      });

      await test.step('Admin Org A crea caso M&A', async () => {
        const caseName = `QA Role MA Case ${suffix}`;

        const payload = await apiRequest(
          request,
          'post',
          '/api/ma/cases',
          adminAToken,
          {
            name: caseName,
            sector: 'Software / SaaS',
            status: 'draft',
            financials: {
              name: caseName,
              sector: 'Software / SaaS',
              revenue: 900000,
              ebitda: 120000,
              normalizedEbitda: 125000
            },
            settings: {
              reportCurrency: 'EUR',
              scenarioMode: 'balanced'
            }
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.organizationId).toBe('org_qa_a');

        maCaseId = item.id;
      });

      await test.step('User Org A puede leer datos de su organización', async () => {
        const suppliersPayload = await apiRequest(
          request,
          'get',
          '/api/suppliers',
          userAToken
        );

        const suppliers = extractItems(suppliersPayload);
        expect(suppliers.some((item) => item.id === supplierId)).toBe(true);

        const maPayload = await apiRequest(
          request,
          'get',
          '/api/ma/cases',
          userAToken
        );

        const cases = extractItems(maPayload);
        expect(cases.some((item) => item.id === maCaseId)).toBe(true);
      });

      await test.step('Viewer Org A puede leer datos de su organización', async () => {
        const suppliersPayload = await apiRequest(
          request,
          'get',
          '/api/suppliers',
          viewerAToken
        );

        const suppliers = extractItems(suppliersPayload);
        expect(suppliers.some((item) => item.id === supplierId)).toBe(true);

        const maPayload = await apiRequest(
          request,
          'get',
          '/api/ma/cases',
          viewerAToken
        );

        const cases = extractItems(maPayload);
        expect(cases.some((item) => item.id === maCaseId)).toBe(true);
      });

      await test.step('User Org A puede editar, pero no borrar', async () => {
        const updatePayload = await apiRequest(
          request,
          'patch',
          `/api/suppliers/${supplierId}`,
          userAToken,
          {
            name: `QA Role Supplier Updated By User ${suffix}`,
            country: 'España',
            region: 'Madrid',
            sector: 'Industrial',
            tier: 'Tier 2',
            criticality: 'Media',
            status: 'watchlist',
            spend: 175000,
            riskScore: 45,
            resilienceScore: 80
          }
        );

        const updated = extractData(updatePayload);

        expect(updated?.id).toBe(supplierId);
        expect(updated?.status).toBe('watchlist');

        await apiRequest(
          request,
          'delete',
          `/api/suppliers/${supplierId}`,
          userAToken,
          undefined,
          403
        );

        await apiRequest(
          request,
          'delete',
          `/api/ma/cases/${maCaseId}`,
          userAToken,
          undefined,
          403
        );
      });

      await test.step('Viewer Org A no puede crear, editar ni borrar', async () => {
        await apiRequest(
          request,
          'post',
          '/api/suppliers',
          viewerAToken,
          {
            name: `QA Viewer Should Not Create ${suffix}`,
            country: 'España',
            region: 'Madrid',
            sector: 'Tecnología'
          },
          403
        );

        await apiRequest(
          request,
          'patch',
          `/api/suppliers/${supplierId}`,
          viewerAToken,
          {
            name: `QA Viewer Should Not Update ${suffix}`
          },
          403
        );

        await apiRequest(
          request,
          'delete',
          `/api/suppliers/${supplierId}`,
          viewerAToken,
          undefined,
          403
        );

        await apiRequest(
          request,
          'post',
          '/api/ma/cases',
          viewerAToken,
          {
            name: `QA Viewer MA Should Not Create ${suffix}`,
            sector: 'Software / SaaS',
            financials: {
              name: `QA Viewer MA Should Not Create ${suffix}`,
              sector: 'Software / SaaS',
              ebitda: 100000
            }
          },
          403
        );

        await apiRequest(
          request,
          'patch',
          `/api/ma/cases/${maCaseId}`,
          viewerAToken,
          {
            name: `QA Viewer MA Should Not Update ${suffix}`
          },
          403
        );

        await apiRequest(
          request,
          'delete',
          `/api/ma/cases/${maCaseId}`,
          viewerAToken,
          undefined,
          403
        );
      });

      await test.step('Admin Org B no ve datos de Org A', async () => {
        const suppliersPayload = await apiRequest(
          request,
          'get',
          '/api/suppliers',
          adminBToken
        );

        const suppliers = extractItems(suppliersPayload);
        expect(suppliers.some((item) => item.id === supplierId)).toBe(false);

        const maPayload = await apiRequest(
          request,
          'get',
          '/api/ma/cases',
          adminBToken
        );

        const cases = extractItems(maPayload);
        expect(cases.some((item) => item.id === maCaseId)).toBe(false);

        await apiRequest(
          request,
          'get',
          `/api/suppliers/${supplierId}`,
          adminBToken,
          undefined,
          404
        );

        await apiRequest(
          request,
          'get',
          `/api/ma/cases/${maCaseId}`,
          adminBToken,
          undefined,
          404
        );
      });
    } finally {
      if (adminAToken && supplierId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/suppliers/${supplierId}`,
            adminAToken
          );
        } catch {
          // Limpieza defensiva.
        }
      }

      if (adminAToken && maCaseId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/ma/cases/${maCaseId}`,
            adminAToken
          );
        } catch {
          // Limpieza defensiva.
        }
      }
    }

    await test.step('Confirmar limpieza final', async () => {
      if (supplierId) {
        await apiRequest(
          request,
          'get',
          `/api/suppliers/${supplierId}`,
          adminAToken,
          undefined,
          404
        );
      }

      if (maCaseId) {
        await apiRequest(
          request,
          'get',
          `/api/ma/cases/${maCaseId}`,
          adminAToken,
          undefined,
          404
        );
      }
    });
  });
});