import React, { useCallback, useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import formatMAReportData from '../utils/formatMAReportData.js';
import buildMAReportHtml from '../utils/buildMAReportHtml.js';

function notifyExport(onExportComplete, message) {
  if (typeof onExportComplete !== 'function') return;

  onExportComplete(message);
}

export function MAReportExportButton({
  financials,
  settings,
  derived,
  disabled = false,
  generatedBy = 'CEO’s OS',
  organizationName = 'CEO’s OS',
  reportStatus = 'Draft',
  showPrintButton = false,
  onExportComplete
}) {
  const [isExporting, setIsExporting] = useState(false);

  const reportData = useMemo(
    () =>
      formatMAReportData({
        financials,
        settings,
        derived,
        generatedBy,
        organizationName,
        reportStatus
      }),
    [financials, settings, derived, generatedBy, organizationName, reportStatus]
  );

  const buildHtml = useCallback(() => buildMAReportHtml(reportData), [reportData]);

  const handleDownloadHtml = useCallback(() => {
    if (disabled || isExporting) return;

    setIsExporting(true);

    try {
      const html = buildHtml();

      const blob = new Blob([html], {
        type: 'text/html;charset=utf-8'
      });

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = reportData?.meta?.fileName || 'ma-report.html';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);

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
  }, [buildHtml, disabled, isExporting, onExportComplete, reportData?.meta?.fileName]);

  const handlePrintPdf = useCallback(() => {
    if (disabled || isExporting) return;

    setIsExporting(true);

    try {
      const html = buildHtml();
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        notifyExport(
          onExportComplete,
          'El navegador ha bloqueado la ventana de impresión. Permite ventanas emergentes para guardar el informe como PDF'
        );

        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      printWindow.focus();

      window.setTimeout(() => {
        printWindow.print();
      }, 350);

      notifyExport(
        onExportComplete,
        'Vista imprimible abierta. Desde el navegador puedes guardar el informe como PDF'
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
  }, [buildHtml, disabled, isExporting, onExportComplete]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        onClick={handleDownloadHtml}
        variant="secondary"
        disabled={disabled || isExporting}
      >
        <Download size={16} />
        {isExporting ? 'Generando...' : 'Exportar report'}
      </Button>

      {showPrintButton ? (
        <Button
          type="button"
          onClick={handlePrintPdf}
          variant="secondary"
          disabled={disabled || isExporting}
        >
          <Printer size={16} />
          Imprimir PDF
        </Button>
      ) : null}
    </div>
  );
}

export default MAReportExportButton;
