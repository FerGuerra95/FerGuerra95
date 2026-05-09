import formatMAReportData from '../utils/formatMAReportData.js';
import buildMAReportHtml from '../utils/buildMAReportHtml.js';
import { httpClient } from '../../../shared/services/httpClient.js';

const DEFAULT_BRAND_NAME = "CEO's OS";

function normalizeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  return String(value)
    .replace(/CEO\u00e2\u20ac\u2122s OS/g, DEFAULT_BRAND_NAME)
    .replace(/CEO\u2019s OS/g, DEFAULT_BRAND_NAME)
    .replace(/[\u00e2\u20ac\u0153\u00e2\u20ac\ufffd]/g, '"')
    .replace(/[\u00e2\u20ac\u2122]/g, "'")
    .normalize('NFC');
}

function ensureHtmlDocument(html) {
  let nextHtml = normalizeText(html);

  if (!nextHtml.trim()) {
    nextHtml = '<html lang="en"><head></head><body></body></html>';
  }

  if (!/^<!doctype html>/i.test(nextHtml.trim())) {
    nextHtml = `<!doctype html>\n${nextHtml}`;
  }

  if (!/<html[\s>]/i.test(nextHtml)) {
    nextHtml = `<html lang="en">\n${nextHtml}\n</html>`;
  }

  if (!/<head[\s>]/i.test(nextHtml)) {
    nextHtml = nextHtml.replace(/<html([^>]*)>/i, '<html$1>\n<head></head>');
  }

  if (!/<meta\s+charset=/i.test(nextHtml)) {
    nextHtml = nextHtml.replace(
      /<head([^>]*)>/i,
      '<head$1>\n  <meta charset="UTF-8" />\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
    );
  }

  return nextHtml;
}

function openPrintWindow(html, title) {
  const printWindow = window.open('', '_blank', 'width=1440,height=1024');

  if (!printWindow) return null;

  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(ensureHtmlDocument(html));
  printWindow.document.close();
  printWindow.document.title = normalizeText(title, 'M&A Professional Report');

  return printWindow;
}

export const maReportsApi = {
  async createReportRecord({
    title = 'Confidential M&A Executive Report',
    caseId = '',
    status = 'exported',
    payload = {}
  } = {}) {
    const response = await httpClient.post('/ma/reports/export', {
      title,
      caseId,
      status,
      payload
    });

    return response.data ?? response;
  },

  async createSecureShareLink({
    reportData = {},
    html = '',
    fileName = 'ma-professional-report.html',
    reportTitle = 'Confidential M&A Executive Report',
    expiresInHours = 72
  } = {}) {
    const report = await this.createReportRecord({
      title: reportTitle,
      status: 'exported',
      payload: {
        reportData,
        html,
        fileName,
        reportTitle,
        classification: 'Confidential',
        generatedAt: new Date().toISOString()
      }
    });

    const response = await httpClient.post(`/ma/reports/${report.id}/share`, {
      expiresInHours
    });

    return response.data ?? response;
  },

  exportExecutiveReport({
    financials = {},
    settings = {},
    derived = {},
    generatedBy = DEFAULT_BRAND_NAME,
    organizationName = DEFAULT_BRAND_NAME,
    reportStatus = 'Controlled Draft'
  } = {}) {
    if (typeof window === 'undefined') return false;

    const reportData = formatMAReportData({
      financials,
      settings,
      derived,
      generatedBy,
      organizationName,
      reportStatus
    });

    const html = buildMAReportHtml(reportData);
    const reportTitle =
      reportData?.meta?.reportTitle ||
      reportData?.title ||
      'M&A Professional Report';

    const printWindow = openPrintWindow(html, reportTitle);

    if (!printWindow) return false;

    const printReport = () => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch {
        // The printable report is already open. The user can print manually.
      }
    };

    if (printWindow.document.readyState === 'complete') {
      window.setTimeout(printReport, 650);
    } else {
      printWindow.addEventListener('load', () => {
        window.setTimeout(printReport, 650);
      });
    }

    return true;
  },

  buildExecutiveReportHtml({
    financials = {},
    settings = {},
    derived = {},
    generatedBy = DEFAULT_BRAND_NAME,
    organizationName = DEFAULT_BRAND_NAME,
    reportStatus = 'Controlled Draft'
  } = {}) {
    const reportData = formatMAReportData({
      financials,
      settings,
      derived,
      generatedBy,
      organizationName,
      reportStatus
    });

    return ensureHtmlDocument(buildMAReportHtml(reportData));
  }
};

export default maReportsApi;
