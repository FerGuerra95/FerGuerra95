import { test, expect } from '@playwright/test';

import { fetchDemoAdminApiToken } from '../helpers/auth.js';

function resolveApiBaseUrl() {
  if (process.env.CEOS_API_BASE_URL) {
    return process.env.CEOS_API_BASE_URL.replace(/\/$/, '');
  }

  const appBaseUrl = new URL(process.env.CEOS_BASE_URL || 'http://127.0.0.1:5173');
  const isLocalVite =
    (appBaseUrl.hostname === 'localhost' || appBaseUrl.hostname === '127.0.0.1') &&
    (appBaseUrl.port === '5173' || appBaseUrl.port === '5174');

  if (isLocalVite) {
    return `${appBaseUrl.protocol}//${appBaseUrl.hostname}:4000/api`;
  }

  return new URL('/api', appBaseUrl).toString().replace(/\/$/, '');
}

test.describe('M&A secure share (público)', () => {
  test('visor carga el informe sin sesión con hash sid+t', async ({
    page,
    context,
    request
  }) => {
    await context.clearCookies();

    const token = await fetchDemoAdminApiToken(request);
    const api = resolveApiBaseUrl();
    const auth = { Authorization: `Bearer ${token}` };

    const unique = `E2E Secure Share Case ${Date.now()}`;
    const caseRes = await request.post(`${api}/ma/cases`, {
      headers: auth,
      data: {
        name: unique,
        financials: {
          name: unique,
          sector: 'Servicios',
          normalizedEbitda: 120000
        },
        settings: {
          reportCurrency: 'EUR',
          evidenceDocuments: []
        }
      }
    });
    expect(caseRes.ok(), await caseRes.text()).toBeTruthy();
    const caseBody = await caseRes.json();
    const caseId = caseBody.data?.id;
    expect(caseId).toBeTruthy();

    const reportHtml =
      '<!doctype html><html><body><p>E2E secure share contenido</p></body></html>';

    const reportRes = await request.post(`${api}/ma/reports/export`, {
      headers: auth,
      data: {
        caseId,
        title: 'Informe E2E secure share',
        status: 'exported',
        payload: {
          html: reportHtml
        }
      }
    });
    expect(reportRes.ok(), await reportRes.text()).toBeTruthy();
    const reportBody = await reportRes.json();
    const reportId = reportBody.data?.id;
    expect(reportId).toBeTruthy();

    const shareRes = await request.post(`${api}/ma/reports/${reportId}/share`, {
      headers: auth,
      data: { expiresInHours: 24 }
    });
    expect(shareRes.ok(), await shareRes.text()).toBeTruthy();
    const shareBody = await shareRes.json();
    const shareId = shareBody.data?.id;
    const shareToken = shareBody.data?.token;
    expect(shareId).toBeTruthy();
    expect(shareToken).toBeTruthy();

    await context.clearCookies();
    await page.evaluate(() => {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        //
      }
    });

    const hash = `#sid=${encodeURIComponent(shareId)}&t=${encodeURIComponent(shareToken)}`;
    await page.goto(`/ma/secure-share${hash}`);

    await expect(
      page.frameLocator('iframe').getByText('E2E secure share contenido')
    ).toBeVisible({
      timeout: 45_000
    });
  });
});
