import React, { useMemo, useState } from 'react';
import { Download, Eye, FileSearch, Plus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';
import { complianceReportsApi } from '../services/complianceReportsApi.js';

function formatDate(value) {
  if (!value) return 'Sin fecha';

  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Sin fecha';
  }
}

function buildRecommendations({
  supplier,
  riskScore,
  resilienceScore,
  evidenceSummary
}) {
  const recommendations = [];

  if (riskScore >= 75) {
    recommendations.push(
      'Activar revisión prioritaria por riesgo crítico y exigir plan de mitigación documentado.'
    );
  } else if (riskScore >= 55) {
    recommendations.push(
      'Mantener seguimiento reforzado y solicitar evidencia adicional sobre los puntos abiertos.'
    );
  } else {
    recommendations.push(
      'Mantener revisión periódica y actualizar evidencias cuando existan cambios relevantes.'
    );
  }

  if (resilienceScore < 50) {
    recommendations.push(
      'Diseñar proveedor alternativo o plan de continuidad para reducir dependencia operativa.'
    );
  }

  if ((evidenceSummary?.totalEvidence || 0) === 0) {
    recommendations.push(
      'Registrar evidencia mínima del proveedor antes de considerar el expediente como defendible.'
    );
  }

  if ((evidenceSummary?.pendingReviews || 0) > 0) {
    recommendations.push(
      'Cerrar las revisiones humanas pendientes antes de compartir el informe final.'
    );
  }

  if (supplier?.criticality === 'Alta' || supplier?.criticality === 'Crítica') {
    recommendations.push(
      'Revisar la criticidad del proveedor en comité interno o con responsable legal/compliance.'
    );
  }

  return recommendations;
}

export function ComplianceReportPage() {
  const navigate = useNavigate();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    reports,
    activeSupplierId,
    setActiveSupplierId,
    createReport
  } = useComplianceStore();

  const canCreateReport = can(PERMISSIONS.CREATE_REPORT);

  const [selectedSupplierId, setSelectedSupplierId] = useState(
    activeSupplierId || suppliers[0]?.id || ''
  );

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId: selectedSupplierId
  });

  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const supplierReports = useMemo(() => {
    if (!selectedSupplierId) return reports;
    return reports.filter((report) => report.supplierId === selectedSupplierId);
  }, [reports, selectedSupplierId]);

  function handleSelectSupplier(value) {
    setSelectedSupplierId(value);
    setActiveSupplierId(value);
  }

  function handleOpenSupplier() {
    if (!selectedSupplierId) return;

    setActiveSupplierId(selectedSupplierId);
    navigate(`/compliance/suppliers/${selectedSupplierId}`);
  }

  function buildCurrentReport() {
    if (!engine.activeSupplier) return null;

    const recommendations = buildRecommendations({
      supplier: engine.activeSupplier,
      riskScore: engine.activeSupplier.riskScore,
      resilienceScore: engine.activeSupplier.resilienceScore,
      evidenceSummary: engine.evidenceSummary
    });

    return complianceReportsApi.buildSupplierReport({
      supplier: engine.activeSupplier,
      riskScore: engine.activeSupplier.riskScore,
      resilienceScore: engine.activeSupplier.resilienceScore,
      riskLevel: engine.activeSupplier.riskLevel,
      resilienceLevel: engine.activeSupplier.resilienceLevel,
      executiveSummary: engine.executiveSummary,
      evidenceSummary: engine.evidenceSummary,
      reportItems: engine.reportItems,
      recommendations
    });
  }

  function handleGenerateReport() {
    if (!canCreateReport) {
      pushToast('No tienes permisos para generar informes');
      return;
    }

    const report = buildCurrentReport();

    if (!report) {
      pushToast('Selecciona un proveedor válido para generar el informe');
      return;
    }

    createReport({
      title: report.title,
      supplierId: report.supplierId,
      supplierName: report.supplierName,
      scope: report.scope,
      summary: report.summary,
      items: report.items,
      recommendations: report.recommendations,
      evidenceSummary: report.evidenceSummary,
      riskScore: report.riskScore,
      resilienceScore: report.resilienceScore,
      riskLevel: report.riskLevel,
      resilienceLevel: report.resilienceLevel
    });

    pushToast('Informe generado correctamente');
  }

  function handleExportCurrentReport() {
    if (!canCreateReport) {
      pushToast('No tienes permisos para exportar un informe nuevo');
      return;
    }

    const report = buildCurrentReport();

    if (!report) {
      pushToast('Selecciona un proveedor válido para exportar el informe');
      return;
    }

    complianceReportsApi.exportReport(report);
  }

  function handleExportStoredReport(report) {
    const supplier =
      suppliers.find((item) => item.id === report.supplierId) ||
      engine.activeSupplier;

    const enrichedReport = {
      ...report,
      supplierName: supplier?.name || report.supplierName || 'Sin proveedor',
      riskScore: supplier?.riskScore ?? report.riskScore ?? 'N/A',
      resilienceScore:
        supplier?.resilienceScore ?? report.resilienceScore ?? 'N/A',
      riskLevel: supplier?.riskLevel?.label || report.riskLevel || 'N/A',
      resilienceLevel:
        supplier?.resilienceLevel?.label || report.resilienceLevel || 'N/A',
      recommendations: report.recommendations || [
        'Revisar evidencias disponibles y completar documentación pendiente.',
        'Mantener trazabilidad de decisiones humanas y cambios de estado.',
        'Actualizar scoring cuando existan nuevas alertas o evidencias.'
      ]
    };

    complianceReportsApi.exportReport(enrichedReport);
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Compliance Reports</h2>
            <p className="muted">
              Generación de informes ejecutivos DSS con proveedor, alertas,
              evidencias, revisión humana y recomendaciones defendibles.
            </p>
          </div>

          <div className="row wrap">
            {isViewer ? <Badge>Modo solo lectura</Badge> : null}
            <Badge>{reports.length} informes</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Proveedor activo</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {engine.activeSupplier?.name || 'N/A'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Base del informe
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Risk Score</div>
          <div
            className={`kpi-value ${
              engine.activeSupplier?.riskLevel?.color || ''
            }`}
          >
            {engine.activeSupplier?.riskScore ?? 0}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            {engine.activeSupplier?.riskLevel?.label || 'Sin riesgo'}
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Resilience</div>
          <div
            className={`kpi-value ${
              engine.activeSupplier?.resilienceLevel?.color || ''
            }`}
          >
            {engine.activeSupplier?.resilienceScore ?? 0}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            {engine.activeSupplier?.resilienceLevel?.label || 'Sin datos'}
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Items informe</div>
          <div className="kpi-value">{engine.reportItems.length}</div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Alertas + evidencias + reviews
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <h3>Report Builder</h3>

          <div className="stack">
            <Select
              label="Proveedor"
              value={selectedSupplierId}
              onChange={(e) => handleSelectSupplier(e.target.value)}
              options={
                supplierOptions.length > 0
                  ? supplierOptions
                  : [{ label: 'Sin proveedores', value: '' }]
              }
            />

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="row">
                <ShieldCheck size={18} />
                <div>
                  <strong>Resumen ejecutivo</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {engine.executiveSummary}
                  </p>
                </div>
              </div>
            </div>

            {canCreateReport ? (
              <div className="row wrap">
                <Button
                  onClick={handleGenerateReport}
                  disabled={!engine.activeSupplier}
                >
                  <Plus size={16} />
                  Generar informe
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleExportCurrentReport}
                  disabled={!engine.activeSupplier}
                >
                  <Download size={16} />
                  Exportar actual
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleOpenSupplier}
                  disabled={!engine.activeSupplier}
                >
                  <Eye size={16} />
                  Ver proveedor
                </Button>
              </div>
            ) : (
              <>
                <EmptyState
                  title="Sin permisos para generar informes"
                  description="Tu rol actual permite consultar informes, pero no generar nuevos."
                />

                <div className="row wrap">
                  <Button
                    variant="secondary"
                    onClick={handleOpenSupplier}
                    disabled={!engine.activeSupplier}
                  >
                    <Eye size={16} />
                    Ver proveedor
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3>Report Content</h3>

          <div className="grid-2">
            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Alertas proveedor</div>
              <div className="kpi-value">
                {engine.activeSupplierAlerts.length}
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Evidencias</div>
              <div className="kpi-value">
                {engine.activeSupplierEvidence.length}
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Reviews</div>
              <div className="kpi-value">
                {engine.activeSupplierReviews.length}
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Cobertura</div>
              <div className="kpi-value">
                {engine.evidenceSummary.coverageLabel}
              </div>
            </div>
          </div>

          <p className="muted">
            El reporte funciona como soporte a la decisión: organiza evidencia,
            alertas y revisión humana, pero no sustituye el criterio legal o de
            compliance.
          </p>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Generated Reports</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Historial de reportes creados para el proveedor seleccionado.
            </p>
          </div>

          <Badge>{supplierReports.length} resultados</Badge>
        </div>

        {supplierReports.length === 0 ? (
          <EmptyState
            title="No hay informes generados"
            description={
              canCreateReport
                ? 'Genera el primer informe de compliance para este proveedor.'
                : 'No hay informes disponibles para este proveedor.'
            }
          />
        ) : (
          <div className="stack">
            {supplierReports.map((report) => (
              <div
                key={report.id}
                className="card"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="section-title">
                  <div>
                    <h3 style={{ marginBottom: 6 }}>{report.title}</h3>
                    <p className="muted" style={{ marginBottom: 0 }}>
                      {formatDate(report.createdAt)} · {report.scope} ·{' '}
                      {report.status}
                    </p>
                  </div>

                  <FileSearch size={20} />
                </div>

                <p className="muted">{report.summary}</p>

                <div className="row wrap">
                  <Badge>{report.status}</Badge>
                  <Badge>{report.items?.length || 0} items</Badge>
                  {!canCreateReport ? <Badge>Solo lectura</Badge> : null}
                </div>

                <div className="row wrap" style={{ marginTop: 16 }}>
                  <Button
                    variant="secondary"
                    onClick={() => handleExportStoredReport(report)}
                  >
                    <Download size={16} />
                    Exportar / Imprimir
                  </Button>

                  <Button variant="secondary" onClick={handleOpenSupplier}>
                    <Eye size={16} />
                    Ver proveedor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}