import React, { useEffect } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCheck,
  FileBadge,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

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

function DetailMetric({ label, value, helper, color = '' }) {
  return (
    <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`.trim()}>{value}</div>
      {helper ? (
        <p className="muted" style={{ marginBottom: 0 }}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId,
    createAlert,
    addEvidence,
    createReview
  } = useComplianceStore();

  useEffect(() => {
    if (id) {
      setActiveSupplierId(id);
    }
  }, [id, setActiveSupplierId]);

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId: id || activeSupplierId
  });

  const supplier = engine.activeSupplier;

  if (!supplier) {
    return (
      <div className="page">
        <Card>
          <Button
            variant="secondary"
            onClick={() => navigate('/compliance/suppliers')}
          >
            <ArrowLeft size={16} />
            Volver a proveedores
          </Button>
        </Card>

        <EmptyState
          title="Proveedor no encontrado"
          description="El proveedor seleccionado no existe o ha sido eliminado."
        />
      </div>
    );
  }

  function handleCreateDemoAlert() {
    const alert = createAlert({
      supplierId: supplier.id,
      title: 'Nueva alerta de revisión manual',
      category: 'Manual Review',
      severity: 'medium',
      status: 'open',
      source: 'Compliance operator',
      description:
        'Alerta creada manualmente para revisar documentación, dependencia operativa o riesgo del proveedor.'
    });

    createReview({
      alertId: alert.id,
      supplierId: supplier.id
    });
  }

  function handleAddDemoEvidence() {
    addEvidence({
      supplierId: supplier.id,
      alertId: engine.activeSupplierAlerts[0]?.id || '',
      title: 'Evidencia documental añadida',
      sourceType: 'manual',
      language: 'es',
      excerpt:
        'Documento o nota interna registrada como soporte de revisión del proveedor.',
      confidence: 0.75
    });
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <Button
              variant="secondary"
              onClick={() => navigate('/compliance/suppliers')}
            >
              <ArrowLeft size={16} />
              Volver
            </Button>

            <h2 style={{ marginTop: 18 }}>Supplier Intelligence File</h2>

            <p className="muted" style={{ marginBottom: 8 }}>
              Ficha individual del proveedor con riesgo, resiliencia, alertas,
              evidencias, revisiones humanas y timeline de actividad.
            </p>

            <h3 style={{ marginBottom: 6 }}>{supplier.name}</h3>

            <p className="muted">
              {supplier.country || 'Sin país'} · {supplier.region} ·{' '}
              {supplier.tier} · {supplier.criticality}
            </p>
          </div>

          <div className="row wrap">
            <Badge>{supplier.status}</Badge>
            <Badge>{supplier.sector || 'General'}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <DetailMetric
          label="Risk Score"
          value={`${supplier.riskScore}/100`}
          helper={supplier.riskLevel.label}
          color={supplier.riskLevel.color}
        />

        <DetailMetric
          label="Resilience Score"
          value={`${supplier.resilienceScore}/100`}
          helper={supplier.resilienceLevel.label}
          color={supplier.resilienceLevel.color}
        />

        <DetailMetric
          label="Spend anual"
          value={`${Number(supplier.spend || 0).toLocaleString('es-ES')} €`}
          helper="Volumen anual estimado"
        />

        <DetailMetric
          label="Última revisión"
          value={formatDate(supplier.lastReviewAt)}
          helper="Fecha de actualización"
        />
      </div>

      <div className="grid-2">
        <Card>
          <h3>Risk Snapshot</h3>
          <p>{engine.executiveSummary}</p>

          <div className="stack">
            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="row">
                <ShieldCheck size={18} />
                <div>
                  <strong>Nivel de riesgo</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {supplier.riskLevel.description}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="row">
                <ShieldCheck size={18} />
                <div>
                  <strong>Nivel de resiliencia</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {supplier.resilienceLevel.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Quick Actions</h3>
          <p className="muted">
            Crea alertas y evidencias para comprobar el flujo Supplier → Alert →
            Evidence → Review → Report.
          </p>

          <div className="row wrap">
            <Button onClick={handleCreateDemoAlert}>
              <AlertTriangle size={16} />
              Crear alerta
            </Button>

            <Button variant="secondary" onClick={handleAddDemoEvidence}>
              <FileBadge size={16} />
              Añadir evidencia
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <h3>Linked Alerts</h3>
            <Badge>{engine.activeSupplierAlerts.length}</Badge>
          </div>

          {engine.activeSupplierAlerts.length === 0 ? (
            <p className="muted">No hay alertas asociadas a este proveedor.</p>
          ) : (
            <div className="stack">
              {engine.activeSupplierAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {alert.category} · {alert.source}
                      </p>
                    </div>

                    <div className="row wrap">
                      <Badge>{alert.severity}</Badge>
                      <Badge>{alert.status}</Badge>
                    </div>
                  </div>

                  <p className="muted" style={{ marginBottom: 0 }}>
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="section-title">
            <h3>Evidence Timeline</h3>
            <Badge>{engine.activeSupplierEvidence.length}</Badge>
          </div>

          {engine.activeSupplierEvidence.length === 0 ? (
            <p className="muted">No hay evidencias asociadas a este proveedor.</p>
          ) : (
            <div className="stack">
              {engine.activeSupplierEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <strong>{evidence.title}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {evidence.sourceType} · {evidence.language} ·{' '}
                        {Math.round(Number(evidence.confidence || 0) * 100)}%
                        confianza
                      </p>
                    </div>

                    <FileBadge size={18} />
                  </div>

                  <p className="muted" style={{ marginBottom: 0 }}>
                    {evidence.translatedExcerpt || evidence.excerpt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <h3>Review Activity</h3>
            <Badge>{engine.activeSupplierReviews.length}</Badge>
          </div>

          {engine.activeSupplierReviews.length === 0 ? (
            <p className="muted">No hay revisiones humanas asociadas.</p>
          ) : (
            <div className="stack">
              {engine.activeSupplierReviews.map((review) => (
                <div
                  key={review.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <strong>
                        {review.status === 'decided'
                          ? `Decisión: ${review.decision}`
                          : 'Revisión pendiente'}
                      </strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        Revisor: {review.reviewer || 'Sin asignar'} ·{' '}
                        {formatDate(review.decidedAt || review.createdAt)}
                      </p>
                    </div>

                    <CheckCheck size={18} />
                  </div>

                  <p className="muted" style={{ marginBottom: 0 }}>
                    {review.notes || 'Sin notas de revisión.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="section-title">
            <h3>Activity Timeline</h3>
            <Badge>{engine.evidenceTimeline.length}</Badge>
          </div>

          {engine.evidenceTimeline.length === 0 ? (
            <p className="muted">No hay actividad registrada.</p>
          ) : (
            <div className="stack">
              {engine.evidenceTimeline.map((event) => (
                <div
                  key={event.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <strong>{event.title}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {event.type} · {event.status} · {formatDate(event.date)}
                      </p>
                    </div>

                    <Badge>{event.severity}</Badge>
                  </div>

                  <p className="muted" style={{ marginBottom: 0 }}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}