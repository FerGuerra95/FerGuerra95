import React from 'react';
import { Download, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { ComparablesGrid } from '../components/ComparablesGrid.jsx';
import { maReportsApi } from '../services/maReportsApi.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

export function CIMPage() {
  const { financials, settings } = useMAStore();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const canExportReport = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  function handleExport() {
    if (!canExportReport) {
      pushToast('No tienes permisos para exportar el CIM');
      return;
    }

    const result = maReportsApi.exportExecutiveReport({
      financials,
      settings,
      derived
    });

    const ok = result !== false;

    if (ok) {
      pushToast('CIM preparado para imprimir o guardar como PDF');
    } else {
      pushToast('El navegador ha bloqueado la ventana emergente');
    }
  }

  return (
    <div className="page">
      <Card light>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>Confidential</Badge>
              {isViewer ? <Badge>Modo solo lectura</Badge> : null}
              {canExportReport ? <Badge>Exportación permitida</Badge> : null}
            </div>

            <h2 style={{ marginTop: 10 }}>CIM Executive</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Memorando ejecutivo del activo con resumen de inversión,
              valoración, tesis, comparables y narrativa preparada para
              inversores o comité.
            </p>
          </div>

          <div className="row wrap">
            <div className="badge">
              Project {financials.name ? financials.name.split(' ')[0] : 'Deal'}
            </div>

            {canExportReport ? (
              <Button onClick={handleExport}>
                <Download size={16} />
                Imprimir / Guardar PDF
              </Button>
            ) : (
              <Badge>Sin permiso de exportación</Badge>
            )}
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Compañía</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {financials.name || 'Sin caso'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Activo analizado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Equity Value</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {formatCurrency(derived.equityBase, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valor base estimado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Adjusted Multiple</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {derived.adjustedMultiple}x
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Múltiplo ajustado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Quality Score</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {derived.qualityScore}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Calidad del deal
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Executive Memo</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Resumen de alto nivel para explicar el activo, la lógica de
                valoración y el encaje del deal.
              </p>
            </div>

            <FileSearch size={20} />
          </div>

          <p>{derived.execSummary}</p>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Investment Highlights</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Puntos principales que sostienen la tesis de inversión.
              </p>
            </div>

            <Sparkles size={20} />
          </div>

          <ul className="list-compact">
            {derived.thesis.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Deal Narrative</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Lectura comercial del activo para presentar la oportunidad de
              forma clara, defendible y orientada a decisión.
            </p>
          </div>

          <ShieldCheck size={20} />
        </div>

        <div className="grid-2">
          <div
            className="card"
            style={{
              background: 'rgba(255,255,255,0.04)'
            }}
          >
            <strong>Valoración defendible</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              La valoración combina EBITDA normalizado, múltiplo sectorial,
              ajustes de calidad, deuda neta y sensibilidad del escenario.
            </p>
          </div>

          <div
            className="card"
            style={{
              background: 'rgba(255,255,255,0.04)'
            }}
          >
            <strong>
              {canExportReport
                ? 'Preparado para imprimir / guardar PDF'
                : 'Consulta del CIM'}
            </strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {canExportReport
                ? 'El CIM abre una vista imprimible. Desde el navegador puedes elegir imprimir o seleccionar “Guardar como PDF”.'
                : 'Tu rol actual permite consultar el contenido, pero no generar una exportación nueva.'}
            </p>
          </div>
        </div>
      </Card>

      <ComparablesGrid comparables={derived.comparables} />
    </div>
  );
}