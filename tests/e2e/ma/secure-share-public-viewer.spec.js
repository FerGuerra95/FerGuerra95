import { test, expect } from '@playwright/test';

import { fetchDemoAdminApiToken, resolveApiBaseUrl } from '../helpers/auth.js';

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
    let caseId = '';
    let shareId = '';

    try {
      const caseRes = await request.post(`${api}/ma/cases`, {
        headers: auth,
        data: {
          name: unique,
          origin: 'e2e',
          financials: {
            name: unique,
            sector: 'Servicios',
            normalizedEbitda: 120000
          },
          settings: {
            origin: 'e2e',
            reportCurrency: 'EUR',
            evidenceDocuments: []
          }
        }
      });
      expect(caseRes.ok(), await caseRes.text()).toBeTruthy();
      const caseBody = await caseRes.json();
      caseId = caseBody.data?.id;
      expect(caseId).toBeTruthy();

      const listRes = await request.get(`${api}/ma/cases`, { headers: auth });
      expect(listRes.ok(), await listRes.text()).toBeTruthy();
      const listBody = await listRes.json();
      const listedItems = listBody.data?.items || listBody.items || [];
      expect(listedItems.some((item) => item.id === caseId)).toBe(false);
      expect(listedItems.some((item) => item.name === unique)).toBe(false);

      const reportHtml =
        '<!doctype html><html><body><p>E2E secure share contenido</p></body></html>';

      const reportRes = await request.post(`${api}/ma/reports/export`, {
        headers: auth,
        data: {
          caseId,
          title: 'Informe E2E secure share',
          status: 'exported',
          origin: 'e2e',
          payload: {
            html: reportHtml,
            origin: 'e2e'
          }
        }
      });
      expect(reportRes.ok(), await reportRes.text()).toBeTruthy();
      const reportBody = await reportRes.json();
      const reportId = reportBody.data?.id;
      expect(reportId).toBeTruthy();

      const reportsRes = await request.get(`${api}/ma/reports`, { headers: auth });
      expect(reportsRes.ok(), await reportsRes.text()).toBeTruthy();
      const reportsBody = await reportsRes.json();
      const listedReports = reportsBody.data?.items || reportsBody.items || [];
      expect(listedReports.some((item) => item.id === reportId)).toBe(false);

      const shareRes = await request.post(`${api}/ma/reports/${reportId}/share`, {
        headers: auth,
        data: { expiresInHours: 24 }
      });
      expect(shareRes.ok(), await shareRes.text()).toBeTruthy();
      const shareBody = await shareRes.json();
      shareId = shareBody.data?.id;
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
    } finally {
      if (shareId) {
        await request.delete(`${api}/ma/secure-shares/${shareId}`, {
          headers: auth
        });
      }

      if (caseId) {
        await request.delete(`${api}/ma/cases/${caseId}`, {
          headers: auth
        });
      }
    }
  });
});
