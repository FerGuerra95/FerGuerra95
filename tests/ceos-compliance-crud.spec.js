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
        'Respuesta no JSON.',
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

async function expectNotFound(request, path, token) {
  const response = await request.get(`${BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  });

  expect(response.status()).toBe(404);
}

test.describe('CEO’s OS - QA Compliance CRUD online por API', () => {
  test('admin puede crear, listar, editar y borrar alertas, evidencias, revisiones e informes', async ({ request }) => {
    requireEnv();

    const suffix = uniqueSuffix();

    let token = '';
    let supplierId = '';
    let alertId = '';
    let evidenceId = '';
    let reviewId = '';
    let reportId = '';

    try {
      await test.step('Login real backend', async () => {
        const session = await login(request);

        token = session.token;

        expect(token).toBeTruthy();
        expect(session.user?.email || TEST_USER).toBeTruthy();
      });

      await test.step('Crear proveedor base para Compliance', async () => {
        const supplierName = `QA Compliance Supplier ${suffix}`;

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
            spend: 300000,
            riskScore: 42,
            resilienceScore: 76
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.name).toBe(supplierName);

        supplierId = item.id;
      });

      await test.step('Crear alerta asociada al proveedor', async () => {
        const payload = await apiRequest(
          request,
          'post',
          '/api/alerts',
          token,
          {
            supplierId,
            title: `QA Alert Render Test ${suffix}`,
            category: 'Operational Risk',
            severity: 'high',
            status: 'open',
            source: 'Manual',
            description: 'Alerta de prueba automática para QA online.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.severity).toBe('high');
        expect(item?.status).toBe('open');

        alertId = item.id;
      });

      await test.step('Listar y leer alerta', async () => {
        const listPayload = await apiRequest(
          request,
          'get',
          '/api/alerts',
          token
        );

        const items = extractItems(listPayload);
        const found = items.find((item) => item.id === alertId);

        expect(found).toBeTruthy();

        const detailPayload = await apiRequest(
          request,
          'get',
          `/api/alerts/${alertId}`,
          token
        );

        const item = extractData(detailPayload);

        expect(item?.id).toBe(alertId);
        expect(item?.supplierId).toBe(supplierId);
      });

      await test.step('Editar alerta', async () => {
        const payload = await apiRequest(
          request,
          'patch',
          `/api/alerts/${alertId}`,
          token,
          {
            supplierId,
            title: `QA Alert Render Test Updated ${suffix}`,
            category: 'Manual Review',
            severity: 'critical',
            status: 'in_review',
            source: 'Manual',
            description: 'Alerta editada por QA automático.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(alertId);
        expect(item?.severity).toBe('critical');
        expect(item?.status).toBe('in_review');
        expect(item?.category).toBe('Manual Review');
      });

      await test.step('Crear evidencia asociada a proveedor y alerta', async () => {
        const payload = await apiRequest(
          request,
          'post',
          '/api/evidence',
          token,
          {
            supplierId,
            alertId,
            title: `QA Evidence Render Test ${suffix}`,
            sourceType: 'manual',
            language: 'es',
            confidence: 0.88,
            sourceUrl: 'https://example.com/qa-evidence',
            excerpt: 'Evidencia de prueba para control QA.',
            translatedExcerpt: 'QA test evidence.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.alertId).toBe(alertId);
        expect(item?.confidence).toBe(0.88);

        evidenceId = item.id;
      });

      await test.step('Listar y leer evidencia', async () => {
        const listPayload = await apiRequest(
          request,
          'get',
          '/api/evidence',
          token
        );

        const items = extractItems(listPayload);
        const found = items.find((item) => item.id === evidenceId);

        expect(found).toBeTruthy();

        const detailPayload = await apiRequest(
          request,
          'get',
          `/api/evidence/${evidenceId}`,
          token
        );

        const item = extractData(detailPayload);

        expect(item?.id).toBe(evidenceId);
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.alertId).toBe(alertId);
      });

      await test.step('Editar evidencia', async () => {
        const payload = await apiRequest(
          request,
          'patch',
          `/api/evidence/${evidenceId}`,
          token,
          {
            supplierId,
            alertId,
            title: `QA Evidence Render Test Updated ${suffix}`,
            sourceType: 'document',
            language: 'en',
            confidence: 0.91,
            sourceUrl: 'https://example.com/qa-evidence-updated',
            excerpt: 'Updated QA evidence excerpt.',
            translatedExcerpt: 'Extracto actualizado de QA.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(evidenceId);
        expect(item?.sourceType).toBe('document');
        expect(item?.language).toBe('en');
        expect(item?.confidence).toBe(0.91);
      });

      await test.step('Crear revisión asociada a proveedor y alerta', async () => {
        const payload = await apiRequest(
          request,
          'post',
          '/api/reviews',
          token,
          {
            supplierId,
            alertId,
            status: 'pending',
            reviewer: '',
            decision: '',
            notes: 'Revisión creada por QA automático.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.alertId).toBe(alertId);
        expect(item?.status).toBe('pending');

        reviewId = item.id;
      });

      await test.step('Listar y leer revisión', async () => {
        const listPayload = await apiRequest(
          request,
          'get',
          '/api/reviews',
          token
        );

        const items = extractItems(listPayload);
        const found = items.find((item) => item.id === reviewId);

        expect(found).toBeTruthy();

        const detailPayload = await apiRequest(
          request,
          'get',
          `/api/reviews/${reviewId}`,
          token
        );

        const item = extractData(detailPayload);

        expect(item?.id).toBe(reviewId);
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.alertId).toBe(alertId);
      });

      await test.step('Editar revisión', async () => {
        const payload = await apiRequest(
          request,
          'patch',
          `/api/reviews/${reviewId}`,
          token,
          {
            supplierId,
            alertId,
            status: 'pending',
            reviewer: 'QA Reviewer',
            decision: '',
            notes: 'Revisión actualizada antes de decisión.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(reviewId);
        expect(item?.reviewer).toBe('QA Reviewer');
        expect(item?.status).toBe('pending');
      });

      await test.step('Decidir revisión', async () => {
        const payload = await apiRequest(
          request,
          'patch',
          `/api/reviews/${reviewId}/decide`,
          token,
          {
            reviewer: 'QA Reviewer',
            decision: 'validated',
            notes: 'Revisión validada por QA automático.'
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(reviewId);
        expect(item?.status).toBe('decided');
        expect(item?.decision).toBe('validated');
      });

      await test.step('Crear informe Compliance', async () => {
        const payload = await apiRequest(
          request,
          'post',
          '/api/reports/compliance',
          token,
          {
            title: `QA Compliance Report ${suffix}`,
            supplierId,
            supplierName: `QA Compliance Supplier ${suffix}`,
            scope: 'supplier',
            status: 'generated',
            summary: 'Informe de compliance creado por QA automático.',
            riskLevel: 'Medio',
            resilienceLevel: 'Alto',
            riskScore: 42,
            resilienceScore: 76,
            recommendations: [
              'Revisar documentación contractual.',
              'Actualizar evidencia trimestral.'
            ],
            evidenceSummary: {
              total: 1,
              confidenceAverage: 0.91
            },
            items: [
              {
                type: 'alert',
                id: alertId,
                title: 'Alerta QA incluida en informe.'
              }
            ]
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBeTruthy();
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.type).toBe('compliance');
        expect(item?.status).toBe('generated');

        reportId = item.id;
      });

      await test.step('Listar y leer informe Compliance', async () => {
        const listPayload = await apiRequest(
          request,
          'get',
          '/api/reports?type=compliance',
          token
        );

        const items = extractItems(listPayload);
        const found = items.find((item) => item.id === reportId);

        expect(found).toBeTruthy();

        const detailPayload = await apiRequest(
          request,
          'get',
          `/api/reports/compliance/${reportId}`,
          token
        );

        const item = extractData(detailPayload);

        expect(item?.id).toBe(reportId);
        expect(item?.supplierId).toBe(supplierId);
        expect(item?.type).toBe('compliance');
      });

      await test.step('Editar informe Compliance', async () => {
        const payload = await apiRequest(
          request,
          'patch',
          `/api/reports/compliance/${reportId}`,
          token,
          {
            title: `QA Compliance Report Updated ${suffix}`,
            supplierId,
            supplierName: `QA Compliance Supplier ${suffix}`,
            scope: 'supplier',
            status: 'exported',
            summary: 'Informe de compliance actualizado por QA automático.',
            riskLevel: 'Bajo',
            resilienceLevel: 'Alto',
            riskScore: 30,
            resilienceScore: 82,
            recommendations: [
              'Mantener seguimiento semestral.'
            ],
            evidenceSummary: {
              total: 1,
              confidenceAverage: 0.91
            },
            items: [
              {
                type: 'evidence',
                id: evidenceId,
                title: 'Evidencia QA incluida en informe actualizado.'
              }
            ]
          }
        );

        const item = extractData(payload);

        expect(item?.id).toBe(reportId);
        expect(item?.status).toBe('exported');
        expect(item?.riskScore).toBe(30);
        expect(item?.resilienceScore).toBe(82);
      });
    } finally {
      if (token && reportId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/reports/compliance/${reportId}`,
            token
          );
        } catch {
          // Limpieza defensiva.
        }
      }

      if (token && reviewId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/reviews/${reviewId}`,
            token
          );
        } catch {
          // Limpieza defensiva.
        }
      }

      if (token && evidenceId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/evidence/${evidenceId}`,
            token
          );
        } catch {
          // Limpieza defensiva.
        }
      }

      if (token && alertId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/alerts/${alertId}`,
            token
          );
        } catch {
          // Limpieza defensiva.
        }
      }

      if (token && supplierId) {
        try {
          await apiRequest(
            request,
            'delete',
            `/api/suppliers/${supplierId}`,
            token
          );
        } catch {
          // Limpieza defensiva.
        }
      }
    }

    await test.step('Confirmar borrado de informe', async () => {
      if (!reportId) return;
      await expectNotFound(
        request,
        `/api/reports/compliance/${reportId}`,
        token
      );
    });

    await test.step('Confirmar borrado de revisión', async () => {
      if (!reviewId) return;
      await expectNotFound(
        request,
        `/api/reviews/${reviewId}`,
        token
      );
    });

    await test.step('Confirmar borrado de evidencia', async () => {
      if (!evidenceId) return;
      await expectNotFound(
        request,
        `/api/evidence/${evidenceId}`,
        token
      );
    });

    await test.step('Confirmar borrado de alerta', async () => {
      if (!alertId) return;
      await expectNotFound(
        request,
        `/api/alerts/${alertId}`,
        token
      );
    });

    await test.step('Confirmar borrado de proveedor base', async () => {
      if (!supplierId) return;
      await expectNotFound(
        request,
        `/api/suppliers/${supplierId}`,
        token
      );
    });
  });
});