import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';
import { ENTERPRISE_MA_DEMO_CASES } from '../../../src/shared/config/demoData.js';
import formatMAReportData from '../../../src/modules/ma/utils/formatMAReportData.js';
import buildMAReportHtml from '../../../src/modules/ma/utils/buildMAReportHtml.js';

const MA_FINAL_DESKTOP_ROUTES = [
  '/ma/dashboard',
  '/ma/valuation',
  '/ma/cim',
  '/ma/deals',
  '/ma/data-room'
];

const MA_FINAL_MOBILE_ROUTES = [
  '/ma/dashboard',
  '/ma/cim'
];

const FORBIDDEN_TEXT_MARKERS = [
  'undefined',
  'NaN',
  'Infinity',
  'CEO\u00e2',
  '\u00c2',
  '\u00c3',
  '\ufffd'
];

async function assertEnterpriseSurface(page) {
  const result = await page.evaluate((markers) => {
    const bodyText = document.body.innerText || '';
    const documentElement = document.documentElement;
    const horizontalOverflow =
      documentElement.scrollWidth - documentElement.clientWidth;

    return {
      horizontalOverflow,
      forbiddenMarkers: markers.filter((marker) => bodyText.includes(marker))
    };
  }, FORBIDDEN_TEXT_MARKERS);

  expect(result.horizontalOverflow).toBeLessThanOrEqual(2);
  expect(result.forbiddenMarkers).toEqual([]);
}

test('M&A enterprise final surfaces pass desktop and mobile readiness checks', async ({ page }) => {
  await loginAsDemoAdmin(page);

  for (const viewport of [
    { name: 'desktop', size: { width: 1440, height: 1100 }, routes: MA_FINAL_DESKTOP_ROUTES },
    { name: 'mobile', size: { width: 390, height: 920 }, routes: MA_FINAL_MOBILE_ROUTES }
  ]) {
    await page.setViewportSize(viewport.size);

    for (const route of viewport.routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      await expect(page.locator('body')).toContainText(/M&A|Valuation|Deal|Buyer|CIM/i);
      await assertEnterpriseSurface(page);
    }
  }
});

test('M&A enterprise report renders as A4-ready confidential PDF output', async ({ page }, testInfo) => {
  const demoCase = ENTERPRISE_MA_DEMO_CASES[0];
  const reportData = formatMAReportData({
    financials: demoCase.financials,
    settings: demoCase.settings,
    derived: demoCase.snapshot,
    reportStatus: 'Client-ready pilot',
    organizationName: "CEO's OS",
    generatedBy: "CEO's OS"
  });

  const html = buildMAReportHtml(reportData);

  expect(html).toContain('Confidential M&A Executive Report');
  expect(html).toContain('Evidence Control Pack');
  expect(html).toContain('Confidentiality, Governance & Review Notice');
  expect(html).toContain('Authorized recipients only');
  expect(html).not.toMatch(/undefined|NaN|Infinity|CEO\u00e2|\u00c2|\u00c3|\ufffd/);

  await page.setViewportSize({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.emulateMedia({ media: 'print' });

  const printMetrics = await page.evaluate(() => ({
    horizontalOverflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pageHeight: document.documentElement.scrollHeight
  }));

  expect(printMetrics.horizontalOverflow).toBeLessThanOrEqual(2);
  expect(printMetrics.pageHeight).toBeGreaterThan(1000);

  await page.screenshot({
    path: testInfo.outputPath('ma-report-a4-preview.png'),
    fullPage: true
  });

  await page.pdf({
    path: testInfo.outputPath('ma-report-a4.pdf'),
    format: 'A4',
    printBackground: true
  });
});
