import React, { useMemo, useState } from 'react';
import { CheckCheck, Eye, FileBadge, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';
import {
  buildReviewDecisionLabel,
  REVIEW_DECISIONS
} from '../engine/reviewDecisions.js';

const DECISION_OPTIONS = [
  REVIEW_DECISIONS.VALIDATED,
  REVIEW_DECISIONS.DISCARDED,
  REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE
];

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

function normalizeText(value) {
  return String(value || '').trim();
}

function getSupplierName(suppliers, supplierId) {
  const supplier = suppliers.find((item) => item.id === supplierId);
  return supplier?.name || 'Proveedor no identificado';
}

function getAlert(alerts, alertId) {
  return alerts.find((item) => item.id === alertId) || null;
}

function getAlertTitle(alerts, alertId) {
  const alert = getAlert(alerts, alertId);
  return alert?.title || 'Alerta no identificada';
}

function getDecisionColor(decision) {
  if (decision === REVIEW_DECISIONS.VALIDATED) return 'text-success';
  if (decision === REVIEW_DECISIONS.DISCARDED) return 'text-danger';
  if (decision === REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE) return 'text-warning';

  return 'text-warning';
}

function getDecisionToast(decision) {
  if (decision === REVIEW_DECISIONS.VALIDATED) return 'Revisión validada';
  if (decision === REVIEW_DECISIONS.DISCARDED) return 'Revisión descartada';
  if (decision === REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE) {
    return 'Revisión marcada como pendiente de más evidencia';
  }

  return 'Revisión actualizada';
}

function isValidDecision(decision) {
  return DECISION_OPTIONS.includes(decision);
}

export function ReviewsPage() {
  const navigate = useNavigate();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId,
    createReview,
    decideReview
  } = useComplianceStore();

  const canCreateReview = can(PERMISSIONS.CREATE_REVIEW);
  const canDecideReview = can(PERMISSIONS.DECIDE_REVIEW);

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  const [query, setQuery] = useState('');
  const [decisionDraft, setDecisionDraft] = useState({
    alertId: '',
    reviewer: 'Reviewer',
    decision: REVIEW_DECISIONS.VALIDATED,
    notes: ''
  });

  const reviewRows = useMemo(() => {
    const existingRows = reviews.map((review) => ({
      type: 'review',
      id: review.id,
      alertId: review.alertId,
      supplierId: review.supplierId,
      status: review.status,
      decision: review.decision,
      reviewer: review.reviewer,
      notes: review.notes,
      createdAt: review.createdAt,
      decidedAt: review.decidedAt
    }));

    const reviewedAlertIds = new Set(reviews.map((review) => review.alertId));

    const pendingRows = engine.pendingReviews
      .filter((item) => !reviewedAlertIds.has(item.alertId))
      .map((item) => ({
        type: 'pending',
        id: item.id,
        alertId: item.alertId,
        supplierId: item.supplierId,
        status: 'pending',
        decision: '',
        reviewer: '',
        notes: item.recommendedAction,
        createdAt: item.createdAt,
        decidedAt: ''
      }));

    return [...existingRows, ...pendingRows];
  }, [reviews, engine.pendingReviews]);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return reviewRows;

    return reviewRows.filter((row) => {
      const supplierName = getSupplierName(suppliers, row.supplierId);
      const alertTitle = getAlertTitle(alerts, row.alertId);

      return [
        supplierName,
        alertTitle,
        row.status,
        row.decision,
        row.reviewer,
        row.notes
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [reviewRows, suppliers, alerts, query]);

  function updateDraft(key, value) {
    setDecisionDraft((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  function handlePrepareDecision(row) {
    if (!canDecideReview) {
      pushToast('No tienes permisos para preparar decisiones');
      return;
    }

    setDecisionDraft({
      alertId: row.alertId,
      reviewer: normalizeText(decisionDraft.reviewer) || 'Reviewer',
      decision: row.decision || REVIEW_DECISIONS.VALIDATED,
      notes: row.notes || ''
    });

    pushToast('Decisión preparada');
  }

  async function handleDecideReview(row, forcedDecision) {
    if (!canDecideReview) {
      pushToast('No tienes permisos para decidir revisiones');
      return;
    }

    const decision = forcedDecision || decisionDraft.decision;
    const reviewer = normalizeText(decisionDraft.reviewer);
    const notes =
      decisionDraft.alertId === row.alertId
        ? normalizeText(decisionDraft.notes)
        : normalizeText(row.notes);

    if (!row.alertId) {
      pushToast('La revisión debe estar vinculada a una alerta');
      return;
    }

    if (!row.supplierId) {
      pushToast('La revisión debe estar vinculada a un proveedor');
      return;
    }

    if (!reviewer) {
      pushToast('El revisor es obligatorio para cerrar una revisión');
      return;
    }

    if (!isValidDecision(decision)) {
      pushToast('La decisión seleccionada no es válida');
      return;
    }

    try {
      let reviewId = row.type === 'review' ? row.id : '';

      if (!reviewId) {
        if (!canCreateReview) {
          pushToast('No tienes permisos para crear la revisión');
          return;
        }

        const created = await Promise.resolve(
          createReview({
            alertId: row.alertId,
            supplierId: row.supplierId
          })
        );

        if (!created?.id) {
          pushToast('No se pudo crear la revisión');
          return;
        }

        reviewId = created.id;
      }

      await Promise.resolve(
        decideReview(reviewId, {
          reviewer,
          decision,
          notes
        })
      );

      setDecisionDraft((prev) => ({
        ...prev,
        alertId: '',
        notes: ''
      }));

      pushToast(getDecisionToast(decision));
    } catch (error) {
      pushToast(error?.message || 'No se pudo guardar la decisión');
    }
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Human Review Workflow</h2>
            <p className="muted">
              Cola de revisión humana para validar, descartar o solicitar más
              evidencia antes de cerrar una decisión de compliance.
            </p>
          </div>

          <div className="row wrap">
            {isViewer ? <Badge>Modo solo lectura</Badge> : null}
            <Badge>{reviewRows.length} revisiones</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value">
            {engine.reviewQueueStats.pendingReviews}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Alertas abiertas o en revisión
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Decididas</div>
          <div className="kpi-value">
            {engine.reviewQueueStats.decidedReviews}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Revisión humana cerrada
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Validadas</div>
          <div className="kpi-value text-success">
            {engine.reviewQueueStats.validatedReviews}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Hallazgos confirmados
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Descartadas</div>
          <div className="kpi-value text-danger">
            {engine.reviewQueueStats.discardedReviews}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Hallazgos no relevantes
          </p>
        </Card>
      </div>

      <div className="grid-2">
        {canDecideReview ? (
          <Card>
            <h3>Decision Panel</h3>

            <div className="stack">
              <Input
                label="Revisor"
                value={decisionDraft.reviewer}
                onChange={(e) => updateDraft('reviewer', e.target.value)}
              />

              <Select
                label="Decisión"
                value={decisionDraft.decision}
                onChange={(e) => updateDraft('decision', e.target.value)}
                options={DECISION_OPTIONS}
              />

              <Input
                label="Notas de revisión"
                value={decisionDraft.notes}
                onChange={(e) => updateDraft('notes', e.target.value)}
              />

              <p className="muted">
                Selecciona una revisión de la lista y aplica una decisión. Las
                decisiones cambian el estado de la alerta y dejan trazabilidad
                humana.
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <h3>Decision Panel</h3>
            <EmptyState
              title="Sin permisos de decisión"
              description="Tu rol actual solo permite consultar revisiones."
            />
          </Card>
        )}

        <Card>
          <h3>Review Filters</h3>

          <div className="stack">
            <Input
              label="Buscar revisión"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="row">
                <ShieldAlert size={18} />
                <div>
                  <strong>Modelo DSS</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    La IA propone señales, pero la decisión final queda
                    vinculada a revisión humana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Review Queue</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Revisa alertas pendientes, valida hallazgos, descarta falsos
              positivos o solicita más evidencia.
            </p>
          </div>

          <Badge>{filteredReviews.length} resultados</Badge>
        </div>

        {filteredReviews.length === 0 ? (
          <EmptyState
            title="No hay revisiones"
            description="Crea alertas o manda una alerta a revisión para empezar."
          />
        ) : (
          <div className="stack">
            {filteredReviews.map((row) => {
              const alert = getAlert(alerts, row.alertId);
              const supplierName = getSupplierName(suppliers, row.supplierId);
              const decisionMeta = row.decision
                ? buildReviewDecisionLabel(row.decision)
                : null;

              const decisionColor = row.decision
                ? getDecisionColor(row.decision)
                : 'text-warning';

              return (
                <div
                  key={row.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <h3 style={{ marginBottom: 6 }}>
                        {getAlertTitle(alerts, row.alertId)}
                      </h3>

                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplierName} · {alert?.category || 'Sin categoría'} ·{' '}
                        {formatDate(row.decidedAt || row.createdAt)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        className={`kpi-value ${decisionColor}`}
                        style={{ fontSize: 22 }}
                      >
                        {decisionMeta?.label || 'Pendiente'}
                      </div>
                      <div className="kpi-label">{row.status}</div>
                    </div>
                  </div>

                  <p className="muted">
                    {alert?.description || 'Sin descripción de alerta.'}
                  </p>

                  <div className="row wrap">
                    <Badge>{alert?.severity || 'medium'}</Badge>
                    <Badge>{alert?.status || row.status}</Badge>
                    <Badge>{row.type === 'pending' ? 'Pendiente' : 'Review'}</Badge>
                  </div>

                  {row.notes ? (
                    <p className="muted" style={{ marginTop: 14 }}>
                      Notas: {row.notes}
                    </p>
                  ) : null}

                  <div className="row wrap" style={{ marginTop: 16 }}>
                    {canDecideReview ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => handlePrepareDecision(row)}
                        >
                          <FileBadge size={16} />
                          Preparar decisión
                        </Button>

                        <Button
                          variant="success"
                          onClick={() =>
                            handleDecideReview(row, REVIEW_DECISIONS.VALIDATED)
                          }
                        >
                          <CheckCheck size={16} />
                          Validar
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDecideReview(row, REVIEW_DECISIONS.DISCARDED)
                          }
                        >
                          Descartar
                        </Button>

                        <Button
                          variant="warning"
                          onClick={() =>
                            handleDecideReview(
                              row,
                              REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE
                            )
                          }
                        >
                          Pedir evidencia
                        </Button>
                      </>
                    ) : (
                      <Badge>Solo lectura</Badge>
                    )}

                    <Button
                      variant="secondary"
                      onClick={() => handleOpenSupplier(row.supplierId)}
                    >
                      <Eye size={16} />
                      Ver proveedor
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}