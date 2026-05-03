import React, { useCallback, useMemo, useState } from 'react';
import { Download, Printer, Share2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import formatMAReportData from '../utils/formatMAReportData.js';
import buildMAReportHtml from '../utils/buildMAReportHtml.js';

const DEFAULT_BRAND_NAME = "CEO's OS";

const exportButtonCss = `
  .ma-report-export-actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .ma-report-export-actions button {
    box-shadow:
      0 12px 30px rgba(15, 23, 42, 0.16),
      inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .ma-report-export-hint {
    flex-basis: 100%;
    margin-top: -2px;
    color: rgba(203, 213, 225, 0.72);
    font-size: 11px;
    line-height: 1.35;
  }

  @media (max-width: 680px) {
    .ma-report-export-actions {
      width: 100%;
    }

    .ma-report-export-actions button {
      flex: 1 1 auto;
    }
  }
`;

function normalizeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  return String(value)
    .replace(/CEO’s OS/g, DEFAULT_BRAND_NAME)
    .replace(/CEO\u2019s OS/g, DEFAULT_BRAND_NAME)
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .normalize('NFC');
}

function notifyExport(onExportComplete, message) {
  if (typeof onExportComplete !== 'function') return;

  onExportComplete(message);
}

function ensureHtmlDocument(html) {
  const normalizedHtml = normalizeText(html);

  if (!normalizedHtml.trim()) {
    return '<!doctype html><html lang="es"><head><meta charset="UTF-8" /></head><body></body></html>';
  }

  let nextHtml = normalizedHtml;

  if (!/^<!doctype html>/i.test(nextHtml.trim())) {
    nextHtml = `<!doctype html>\n${nextHtml}`;
  }

  if (!/<html[\s>]/i.test(nextHtml)) {
    nextHtml = `<html lang="es">\n${nextHtml}\n</html>`;
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

function createUtf8HtmlBlob(html) {
  const normalizedHtml = ensureHtmlDocument(html);

  return new Blob(['\uFEFF', normalizedHtml], {
    type: 'text/html;charset=utf-8'
  });
}

function revokeObjectUrlLater(objectUrl, delay = 1500) {
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, delay);
}

function openPrintWindow(html, title = 'M&A Professional Report') {
  const printWindow = window.open('', '_blank');

  if (!printWindow) return null;

  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(ensureHtmlDocument(html));
  printWindow.document.close();
  printWindow.document.title = normalizeText(title, 'M&A Professional Report');

  return printWindow;
}

function buildSecureSharePayload({
  reportData,
  html,
  fileName,
  reportTitle
}) {
  return {
    reportData,
    html,
    fileName,
    reportTitle,
    requestedAt: new Date().toISOString(),
    requiredBackendCapability: 'secure-report-share-link',
    requiredSecurityControls: [
      'organization-scoped access',
      'authenticated user permissions',
      'signed expiring token',
      'server-side report storage',
      'revocation support',
      'audit trail',
      'no public unauthenticated access'
    ]
  };
}

export function MAReportExportButton({
  financials,
  settings,
  derived,
  disabled = false,
  generatedBy = DEFAULT_BRAND_NAME,
  organizationName = DEFAULT_BRAND_NAME,
  reportStatus = 'Draft',
  showPrintButton = false,
  showSecureShareButton = true,
  onExportComplete,
  onSecureShareRequest
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const safeGeneratedBy = useMemo(
    () => normalizeText(generatedBy, DEFAULT_BRAND_NAME),
    [generatedBy]
  );

  const safeOrganizationName = useMemo(
    () => normalizeText(organizationName, DEFAULT_BRAND_NAME),
    [organizationName]
  );

  const reportData = useMemo(
    () =>
      formatMAReportData({
        financials,
        settings,
        derived,
        generatedBy: safeGeneratedBy,
        organizationName: safeOrganizationName,
        reportStatus
      }),
    [
      financials,
      settings,
      derived,
      safeGeneratedBy,
      safeOrganizationName,
      reportStatus
    ]
  );

  const buildHtml = useCallback(() => {
    return ensureHtmlDocument(buildMAReportHtml(reportData));
  }, [reportData]);

  const fileName = reportData?.meta?.fileName || 'ma-professional-report.html';

  const reportTitle =
    reportData?.meta?.reportTitle ||
    reportData?.title ||
    'M&A Professional Report';

  const isBusy = isExporting || isSharing;

  const handleDownloadHtml = useCallback(() => {
    if (disabled || isBusy) return;

    setIsExporting(true);

    try {
      const html = buildHtml();
      const blob = createUtf8HtmlBlob(html);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = fileName;
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      revokeObjectUrlLater(objectUrl);

      notifyExport(
        onExportComplete,
        'Informe M&A profesional descargado correctamente en HTML'
      );
    } catch (error) {
      notifyExport(
        onExportComplete,
        error instanceof Error
          ? `No se pudo exportar el informe M&A: ${error.message}`
          : 'No se pudo exportar el informe M&A'
      );
    } finally {
      setIsExporting(false);
    }
  }, [
    buildHtml,
    disabled,
    fileName,
    isBusy,
    onExportComplete
  ]);

  const handlePrintPdf = useCallback(() => {
    if (disabled || isBusy) return;

    setIsExporting(true);

    try {
      const html = buildHtml();
      const printWindow = openPrintWindow(html, reportTitle);

      if (!printWindow) {
        notifyExport(
          onExportComplete,
          'El navegador ha bloqueado la ventana de impresión. Permite ventanas emergentes para guardar el informe como PDF'
        );

        return;
      }

      const printReport = () => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch {
          notifyExport(
            onExportComplete,
            'La vista imprimible se abrió, pero no se pudo lanzar la impresión automáticamente'
          );
        }
      };

      if (printWindow.document.readyState === 'complete') {
        window.setTimeout(printReport, 650);
      } else {
        printWindow.addEventListener('load', () => {
          window.setTimeout(printReport, 650);
        });
      }

      notifyExport(
        onExportComplete,
        'Vista imprimible abierta. Para conservar el diseño premium, activa "Gráficos de fondo" en la ventana de impresión'
      );
    } catch (error) {
      notifyExport(
        onExportComplete,
        error instanceof Error
          ? `No se pudo abrir la vista imprimible: ${error.message}`
          : 'No se pudo abrir la vista imprimible del informe'
      );
    } finally {
      setIsExporting(false);
    }
  }, [
    buildHtml,
    disabled,
    isBusy,
    onExportComplete,
    reportTitle
  ]);

  const handleShareSecureLink = useCallback(async () => {
    if (disabled || isBusy) return;

    setIsSharing(true);

    try {
      const html = buildHtml();

      const secureSharePayload = buildSecureSharePayload({
        reportData,
        html,
        fileName,
        reportTitle
      });

      if (typeof onSecureShareRequest === 'function') {
        await onSecureShareRequest(secureSharePayload);

        notifyExport(
          onExportComplete,
          'Solicitud de secure share link enviada correctamente'
        );

        return;
      }

      notifyExport(
        onExportComplete,
        'Share secure link preparado para fase backend enterprise: requiere enlace firmado, expiración, permisos por organización, revocación y audit trail. No se ha generado un enlace falso desde frontend.'
      );
    } catch (error) {
      notifyExport(
        onExportComplete,
        error instanceof Error
          ? `No se pudo preparar Share secure link: ${error.message}`
          : 'No se pudo preparar Share secure link'
      );
    } finally {
      setIsSharing(false);
    }
  }, [
    buildHtml,
    disabled,
    fileName,
    isBusy,
    onExportComplete,
    onSecureShareRequest,
    reportData,
    reportTitle
  ]);

  return (
    <div className="ma-report-export-actions">
      <style>{exportButtonCss}</style>

      <Button
        type="button"
        onClick={handleDownloadHtml}
        variant="secondary"
        disabled={disabled || isBusy}
        title={
          disabled
            ? 'Completa los inputs obligatorios antes de exportar'
            : 'Descargar informe profesional en HTML'
        }
      >
        <Download size={16} />
        {isExporting ? 'Generando...' : 'Exportar report'}
      </Button>

      {showPrintButton ? (
        <Button
          type="button"
          onClick={handlePrintPdf}
          variant="secondary"
          disabled={disabled || isBusy}
          title={
            disabled
              ? 'Completa los inputs obligatorios antes de imprimir'
              : 'Abrir vista imprimible para guardar como PDF'
          }
        >
          <Printer size={16} />
          Imprimir PDF
        </Button>
      ) : null}

      {showSecureShareButton ? (
        <Button
          type="button"
          onClick={handleShareSecureLink}
          variant="secondary"
          disabled={disabled || isBusy}
          title={
            disabled
              ? 'Completa los inputs obligatorios antes de compartir'
              : 'Preparar Share secure link para fase backend enterprise'
          }
        >
          <Share2 size={16} />
          {isSharing ? 'Preparando...' : 'Share secure link'}
        </Button>
      ) : null}

      <div className="ma-report-export-hint">
        HTML, PDF imprimible y secure sharing preparado para backend enterprise.
      </div>
    </div>
  );
}

export default MAReportExportButton;