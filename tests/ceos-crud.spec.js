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
        `Respuesta no JSON.`,
        `Status: ${response.status()}`,
        `URL: ${response.url()}`,
        `Body: ${text.slice(0, 1000)}`
      ].join('\n')
    );
  }
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
    throw new Error(
      [
        'Login correcto pero no se recibió token.',
        JSON.stringify(payload, null, 2)
      ].join('\n')
    );
  }

  return {
    token,
    user: data?.user || payload?.user || null
  };
}

test.describe('CEO’s OS - QA CRUD online por API', () => {
  test('admin puede crear, listar, editar y borrar casos M&A y proveedores', async ({ request }) => {
    requireEnv();

    const suffix = uniqueSuffix();

    let token = '';
    let createdMaCaseId = '';
    let createdSupplierId = '';

    try {
      await test.step('Login real backend', async () => {
        const session = await login(request);

        token = session.token;

        expect(token).toBeTruthy();
        expect(session.user?.email || TEST_USER).toBeTruthy();
      });

      await test.step('Crear caso M&A', async () => {
        const caseName = `QA M&A Render Test ${suffix}`;

        const payload = await apiRequest(
          request,
          'post',
          '/api/ma/cases',
          token,
          {
            name: caseName,
            sector: 'Software / SaaS',
            status: 'draft',
            financials: {
              name: caseName,
              sector: 'Software / SaaS',
              revenue: 1250000,
              ebitda: 185000,
              normalizedEbitda: 190000,
              netDebt: 50000,
              cash: 25000,
              debt: 75000,
              growthRate: 8,
              customerConcentration: 25,
              ownerDependency: 35
            },
            settings: {
              reportCurrency: 'EUR',
              scenarioMode: 'balanced'
            },
            snapshot: null,
            snapshots: []
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.name).toBe(caseName);
        expect(item?.organizationId).toBeTruthy();

        createdMaCaseId = item.id;
      });

      await test.step('Listar y encontrar caso M&A', async () => {
        const payload = await apiRequest(
          request,
          'get',
          '/api/ma/cases',
          token
        );

        const items = extractItems(payload);
        const found = items.find((item) => item.id === createdMaCaseId);

        expect(found).toBeTruthy();
        expect(found.name).toContain('QA M&A Render Test');
      });

      await test.step('Leer detalle caso M&A', async () => {
        const payload = await apiRequest(
          request,
          'get',
          `/api/ma/cases/${createdMaCaseId}`,
          token
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdMaCaseId);
        expect(item?.financials?.sector || item?.sector).toBe('Software / SaaS');
      });

      await test.step('Editar caso M&A', async () => {
        const updatedName = `QA M&A Render Test Updated ${suffix}`;

        const payload = await apiRequest(
          request,
          'patch',
          `/api/ma/cases/${createdMaCaseId}`,
          token,
          {
            name: updatedName,
            sector: 'Industria',
            status: 'active',
            financials: {
              name: updatedName,
              sector: 'Industria',
              revenue: 1400000,
              ebitda: 210000,
              normalizedEbitda: 215000
            },
            settings: {
              reportCurrency: 'EUR',
              scenarioMode: 'upside'
            }
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdMaCaseId);
        expect(item?.name).toBe(updatedName);
        expect(item?.status).toBe('active');
        expect(item?.financials?.sector || item?.sector).toBe('Industria');
      });

      await test.step('Confirmar edición caso M&A', async () => {
        const payload = await apiRequest(
          request,
          'get',
          `/api/ma/cases/${createdMaCaseId}`,
          token
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdMaCaseId);
        expect(item?.name).toContain('Updated');
        expect(item?.status).toBe('active');
      });

      await test.step('Crear proveedor', async () => {
        const supplierName = `QA Supplier Render Test ${suffix}`;

        const payload = await apiRequest(
          request,
          'post',
          '/api/suppliers',
          token,
          {
            name: supplierName,
            country: 'España',
            region: 'Madrid',
            sector: 'Tecnología',
            tier: 'Tier 1',
            criticality: 'Alta',
            status: 'active',
            spend: 250000,
            riskScore: 38,
            resilienceScore: 72
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.name).toBe(supplierName);
        expect(item?.organizationId).toBeTruthy();

        createdSupplierId = item.id;
      });

      await test.step('Listar y encontrar proveedor', async () => {
        const payload = await apiRequest(
          request,
          'get',
          '/api/suppliers',
          token
        );

        const items = extractItems(payload);
        const found = items.find((item) => item.id === createdSupplierId);

        expect(found).toBeTruthy();
        expect(found.name).toContain('QA Supplier Render Test');
      });

      await test.step('Leer detalle proveedor', async () => {
        const payload = await apiRequest(
          request,
          'get',
          `/api/suppliers/${createdSupplierId}`,
          token
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdSupplierId);
        expect(item?.country).toBe('España');
        expect(item?.sector).toBe('Tecnología');
      });

      await test.step('Editar proveedor', async () => {
        const updatedName = `QA Supplier Render Test Updated ${suffix}`;

        const payload = await apiRequest(
          request,
          'patch',
          `/api/suppliers/${createdSupplierId}`,
          token,
          {
            name: updatedName,
            country: 'España',
            region: 'Madrid',
            sector: 'Industrial',
            tier: 'Tier 2',
            criticality: 'Media',
            status: 'watchlist',
            spend: 275000,
            riskScore: 44,
            resilienceScore: 80
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdSupplierId);
        expect(item?.name).toBe(updatedName);
        expect(item?.status).toBe('watchlist');
        expect(item?.riskScore).toBe(44);
        expect(item?.resilienceScore).toBe(80);
      });

      await test.step('Confirmar edición proveedor', async () => {
        const payload = await apiRequest(
          request,
          'get',
          `/api/suppliers/${createdSupplierId}`,
          token
        );

        const item = extractData(payload);

        expect(item?.id).toBe(createdSupplierId);
        expect(item?.name).toContain('Updated');
        expect(item?.status).toBe('watchlist');
      });
    } finally {
      if (token && createdSupplierId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/suppliers/${createdSupplierId}`,
            token
          );
        } catch {
          // No bloqueamos la limpieza del resto si el proveedor ya fue borrado.
        }
      }

      if (token && createdMaCaseId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/ma/cases/${createdMaCaseId}`,
            token
          );
        } catch {
          // No bloqueamos el cierre del test si el caso ya fue borrado.
        }
      }
    }

    await test.step('Confirmar borrado caso M&A', async () => {
      if (!createdMaCaseId) return;

      const response = await request.get(
        `${BASE_URL}/api/ma/cases/${createdMaCaseId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
        }
      );

      expect(response.status()).toBe(404);
    });

    await test.step('Confirmar borrado proveedor', async () => {
      if (!createdSupplierId) return;

      const response = await request.get(
        `${BASE_URL}/api/suppliers/${createdSupplierId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
        }
      );

      expect(response.status()).toBe(404);
    });
  });
});