import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileBadge,
  Filter,
  Gavel,
  Layers3,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle
} from 'lucide-react';
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

const reviewsPageCss = `
  .reviews-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .reviews-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.36), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.12), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .reviews-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .reviews-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .reviews-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .reviews-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .reviews-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .reviews-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .reviews-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .reviews-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .reviews-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .reviews-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .reviews-signal-card {
    position: relative;
    min-height: 100%;
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .reviews-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .reviews-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .reviews-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .reviews-icon-box,
  .reviews-card-icon,
  .reviews-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .reviews-icon-box {
    width: 50px;
    height: 50px;
  }

  .reviews-card-icon,
  .reviews-panel-icon {
    width: 46px;
    height: 46px;
  }

  .reviews-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .reviews-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .reviews-score-ring {
    width: 112px;
    height: 112px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .reviews-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .reviews-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .reviews-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .reviews-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .reviews-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .reviews-signal-table {
    display: grid;
    gap: 0;
  }

  .reviews-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .reviews-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .reviews-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .reviews-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .reviews-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .reviews-section-header h2,
  .reviews-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .reviews-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .reviews-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .reviews-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .reviews-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .reviews-kpi-card,
  .reviews-panel,
  .reviews-list-card {
    width: 100%;
    height: 100%;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .reviews-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .reviews-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .reviews-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .reviews-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .reviews-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .reviews-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .reviews-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .reviews-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .reviews-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .reviews-form,
  .reviews-filter-stack,
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .reviews-filter-note {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
    line-height: 1.62;
  }

  .reviews-list-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .reviews-list-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .reviews-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .reviews-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .reviews-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .reviews-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .reviews-decision-box {
    min-width: 136px;
    text-align: right;
  }

  .reviews-decision-box strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .reviews-alert-description {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    line-height: 1.62;
  }

  .reviews-notes {
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    line-height: 1.55;
  }

  .reviews-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .reviews-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .reviews-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .reviews-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .reviews-hero-layout,
    .reviews-grid-two {
      grid-template-columns: 1fr;
    }

    .reviews-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .reviews-command-bar {
      grid-template-columns: 1fr;
    }

    .reviews-section-header,
    .reviews-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .reviews-decision-box {
      text-align: left;
    }
  }

  @media (max-width: 680px) {
    .reviews-page {
      gap: 28px;
    }

    .reviews-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .reviews-grid-kpis {
      grid-template-columns: 1fr;
    }

    .reviews-kpi-card,
    .reviews-panel,
    .reviews-list-card,
    .reviews-list-panel {
      border-radius: 24px;
    }

    .reviews-score-module {
      grid-template-columns: 1fr;
    }

    .reviews-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .reviews-signal-row strong {
      text-align: left;
    }
  }
`;

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

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getSafeNumber(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return parsed;
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

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getReviewSignal({
  totalReviews,
  pendingReviews,
  decidedReviews,
  validatedReviews,
  discardedReviews
}) {
  if (totalReviews === 0) {
    return {
      score: null,
      title: 'Review queue empty',
      posture: 'Await alerts',
      description:
        'Todavía no hay revisiones. Crea alertas o manda una alerta a revisión para activar el control humano.'
    };
  }

  const decisionRatio = totalReviews > 0 ? decidedReviews / totalReviews : 0;
  const validationRatio = totalReviews > 0 ? validatedReviews / totalReviews : 0;
  const pendingPenalty = Math.min(36, pendingReviews * 8);
  const discardedPenalty = Math.min(10, discardedReviews * 2);

  const score = clampScore(
    55 + decisionRatio * 34 + validationRatio * 12 - pendingPenalty - discardedPenalty
  );

  if (pendingReviews > 0) {
    return {
      score,
      title: 'Human review queue active',
      posture: 'Resolve pending items',
      description:
        'Hay revisiones pendientes. Prioriza decisión humana, notas y trazabilidad antes de cerrar alertas.'
    };
  }

  if (decidedReviews > 0) {
    return {
      score,
      title: 'Human decisions recorded',
      posture: 'Maintain review discipline',
      description:
        'Las revisiones cuentan con decisión humana. Mantén evidencia, notas y consistencia de criterios.'
    };
  }

  return {
    score,
    title: 'Review baseline established',
    posture: 'Prepare decisions',
    description:
      'Existe una base de revisión, pero conviene cerrar decisiones para completar el flujo DSS.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="reviews-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="reviews-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="reviews-section-header">
      <div>
        <div className="reviews-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>

      {right ? <div>{right}</div> : null}
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="reviews-panel-header">
      <div>
        <div className="reviews-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="reviews-panel-title">{title}</h3>

        <p className="muted reviews-panel-description">{description}</p>
      </div>

      <div className="reviews-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="reviews-kpi-card">
      <div className="reviews-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`reviews-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="reviews-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function ReviewCard({
  row,
  alert,
  supplierName,
  decisionMeta,
  decisionColor,
  canDecideReview,
  onPrepareDecision,
  onDecideReview,
  onOpenSupplier
}) {
  return (
    <article className="reviews-list-card">
      <div className="reviews-list-card-head">
        <div>
          <h3 className="reviews-list-card-title">
            {alert?.title || 'Alerta no identificada'}
          </h3>

          <p className="muted reviews-list-meta">
            {supplierName} · {alert?.category || 'Sin categoría'} ·{' '}
            {formatDate(row.decidedAt || row.createdAt)}
          </p>
        </div>

        <div className="reviews-decision-box">
          <strong className={decisionColor}>
            {decisionMeta?.label || 'Pendiente'}
          </strong>

          <div className="kpi-label">{row.status || 'pending'}</div>
        </div>
      </div>

      <p className="muted reviews-alert-description">
        {alert?.description || 'Sin descripción de alerta.'}
      </p>

      <div className="reviews-chip-row">
        <Badge>{alert?.severity || 'medium'}</Badge>
        <Badge>{alert?.status || row.status}</Badge>
        <Badge>{row.type === 'pending' ? 'Pendiente' : 'Review'}</Badge>
      </div>

      {row.notes ? (
        <div className="reviews-notes">
          <span className="muted">Notas: {row.notes}</span>
        </div>
      ) : null}

      <div className="reviews-card-actions">
        {canDecideReview ? (
          <>
            <Button
              variant="secondary"
              onClick={() => onPrepareDecision(row)}
            >
              <FileBadge size={16} />
              Preparar decisión
            </Button>

            <Button
              variant="success"
              onClick={() => onDecideReview(row, REVIEW_DECISIONS.VALIDATED)}
            >
              <CheckCheck size={16} />
              Validar
            </Button>

            <Button
              variant="danger"
              onClick={() => onDecideReview(row, REVIEW_DECISIONS.DISCARDED)}
            >
              <XCircle size={16} />
              Descartar
            </Button>

            <Button
              variant="warning"
              onClick={() =>
                onDecideReview(row, REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE)
              }
            >
              <AlertTriangle size={16} />
              Pedir evidencia
            </Button>
          </>
        ) : (
          <Badge>Solo lectura</Badge>
        )}

        <Button
          variant="secondary"
          onClick={() => onOpenSupplier(row.supplierId)}
        >
          <Eye size={16} />
          Ver proveedor
        </Button>
      </div>
    </article>
  );
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

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const canCreateReview = can(PERMISSIONS.CREATE_REVIEW);
  const canDecideReview = can(PERMISSIONS.DECIDE_REVIEW);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const reviewQueueStats = {
    pendingReviews: getSafeNumber(engine.reviewQueueStats?.pendingReviews),
    decidedReviews: getSafeNumber(engine.reviewQueueStats?.decidedReviews),
    validatedReviews: getSafeNumber(engine.reviewQueueStats?.validatedReviews),
    discardedReviews: getSafeNumber(engine.reviewQueueStats?.discardedReviews)
  };

  const [query, setQuery] = useState('');
  const [decisionDraft, setDecisionDraft] = useState({
    alertId: '',
    reviewer: 'Reviewer',
    decision: REVIEW_DECISIONS.VALIDATED,
    notes: ''
  });

  const reviewRows = useMemo(() => {
    const pendingReviews = getSafeArray(engine.pendingReviews);

    const existingRows = safeReviews.map((review) => ({
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

    const reviewedAlertIds = new Set(safeReviews.map((review) => review.alertId));

    const pendingRows = pendingReviews
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
  }, [safeReviews, engine.pendingReviews]);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return reviewRows;

    return reviewRows.filter((row) => {
      const supplierName = getSupplierName(safeSuppliers, row.supplierId);
      const alertTitle = getAlertTitle(safeAlerts, row.alertId);

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
  }, [reviewRows, safeSuppliers, safeAlerts, query]);

  const reviewSignal = getReviewSignal({
    totalReviews: reviewRows.length,
    pendingReviews: reviewQueueStats.pendingReviews,
    decidedReviews: reviewQueueStats.decidedReviews,
    validatedReviews: reviewQueueStats.validatedReviews,
    discardedReviews: reviewQueueStats.discardedReviews
  });

  const scoreAngle = `${(reviewSignal.score ?? 0) * 3.6}deg`;

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
      <style>{reviewsPageCss}</style>

      <div className="reviews-page">
        <section className="reviews-hero">
          <div className="reviews-hero-layout">
            <div>
              <div className="reviews-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Human Review Workflow</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canCreateReview ? <Badge>Creación permitida</Badge> : null}
                {canDecideReview ? <Badge>Decisión permitida</Badge> : null}
              </div>

              <h1 className="reviews-title">
                Human Review Workflow.
                <span>Keep AI-supported decisions accountable.</span>
              </h1>

              <p className="reviews-copy">
                Cola de revisión humana para validar, descartar o solicitar más
                evidencia antes de cerrar una decisión de compliance con
                trazabilidad y criterio operativo.
              </p>

              <div className="reviews-command-bar">
                <CommandItem
                  label="Review rows"
                  value={reviewRows.length}
                />

                <CommandItem
                  label="Pending"
                  value={reviewQueueStats.pendingReviews}
                />

                <CommandItem
                  label="Review posture"
                  value={reviewSignal.posture}
                />
              </div>
            </div>

            <aside className="reviews-signal-card">
              <div className="reviews-signal-inner">
                <div className="reviews-signal-top">
                  <div>
                    <div className="kpi-label">Review Signal</div>
                    <div className="reviews-signal-title">
                      {reviewSignal.title}
                    </div>
                  </div>

                  <div className="reviews-icon-box">
                    <Gavel size={21} />
                  </div>
                </div>

                <div className="reviews-score-module">
                  <div
                    className="reviews-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="reviews-score-core">
                      <strong className={reviewSignal.score === null ? 'is-empty-score' : ''}>
                        {reviewSignal.score === null ? '—' : reviewSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="reviews-score-copy">
                    <strong>{reviewSignal.posture}</strong>

                    <p className="muted">
                      {reviewSignal.description}
                    </p>
                  </div>
                </div>

                <div className="reviews-signal-table">
                  <SignalRow label="Pending" value={reviewQueueStats.pendingReviews} />
                  <SignalRow label="Decided" value={reviewQueueStats.decidedReviews} />
                  <SignalRow label="Validated" value={reviewQueueStats.validatedReviews} />
                  <SignalRow label="Discarded" value={reviewQueueStats.discardedReviews} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="reviews-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="Human review at a glance"
            description="Resumen de revisiones pendientes, decididas, validadas y descartadas para controlar el flujo DSS."
          />

          <div className="reviews-grid reviews-grid-kpis">
            <KpiCard
              label="Pendientes"
              value={reviewQueueStats.pendingReviews}
              description="Alertas abiertas o en revisión"
              icon={ShieldAlert}
              tone={reviewQueueStats.pendingReviews > 0 ? 'text-warning' : ''}
            />

            <KpiCard
              label="Decididas"
              value={reviewQueueStats.decidedReviews}
              description="Revisión humana cerrada"
              icon={CheckCheck}
            />

            <KpiCard
              label="Validadas"
              value={reviewQueueStats.validatedReviews}
              description="Hallazgos confirmados"
              icon={CheckCircle2}
              tone="text-success"
            />

            <KpiCard
              label="Descartadas"
              value={reviewQueueStats.discardedReviews}
              description="Hallazgos no relevantes"
              icon={XCircle}
              tone={reviewQueueStats.discardedReviews > 0 ? 'text-danger' : ''}
            />
          </div>
        </section>

        <section className="reviews-grid reviews-grid-two">
          <Card className="reviews-panel">
            <PanelHeader
              kicker="Decision panel"
              icon={Gavel}
              title="Decision Panel"
              description="Prepara revisor, decisión y notas para cerrar revisiones con trazabilidad humana."
            />

            {canDecideReview ? (
              <div className="reviews-form">
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

                <div className="reviews-filter-note">
                  <p className="muted reviews-muted-tight">
                    Selecciona una revisión de la lista y aplica una decisión.
                    Las decisiones cambian el estado de la alerta y dejan
                    trazabilidad humana.
                  </p>
                </div>
              </div>
            ) : (
              <div className="reviews-empty-wrap">
                <EmptyState
                  title="Sin permisos de decisión"
                  description="Tu rol actual solo permite consultar revisiones."
                />
              </div>
            )}
          </Card>

          <Card className="reviews-panel">
            <PanelHeader
              kicker="Review filters"
              icon={Filter}
              title="Review Filters"
              description="Busca revisiones por proveedor, alerta, estado, decisión, revisor o notas."
            />

            <div className="reviews-filter-stack">
              <Input
                label="Buscar revisión"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="reviews-filter-note">
                <div className="row">
                  <ShieldAlert size={18} />

                  <div>
                    <strong>Modelo DSS</strong>

                    <p className="muted reviews-muted-tight" style={{ marginTop: 8 }}>
                      La IA propone señales, pero la decisión final queda
                      vinculada a revisión humana.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="reviews-section">
          <SectionHeader
            kicker="Review queue"
            icon={Search}
            title="Review Queue"
            description="Revisa alertas pendientes, valida hallazgos, descarta falsos positivos o solicita más evidencia."
            right={<Badge>{filteredReviews.length} resultados</Badge>}
          />

          <Card className="reviews-list-panel">
            {filteredReviews.length === 0 ? (
              <div className="reviews-empty-wrap">
                <EmptyState
                  title="No hay revisiones"
                  description="Crea alertas o manda una alerta a revisión para empezar."
                />
              </div>
            ) : (
              <div className="reviews-list">
                {filteredReviews.map((row) => {
                  const alert = getAlert(safeAlerts, row.alertId);
                  const supplierName = getSupplierName(
                    safeSuppliers,
                    row.supplierId
                  );
                  const decisionMeta = row.decision
                    ? buildReviewDecisionLabel(row.decision)
                    : null;
                  const decisionColor = row.decision
                    ? getDecisionColor(row.decision)
                    : 'text-warning';

                  return (
                    <ReviewCard
                      key={row.id}
                      row={row}
                      alert={alert}
                      supplierName={supplierName}
                      decisionMeta={decisionMeta}
                      decisionColor={decisionColor}
                      canDecideReview={canDecideReview}
                      onPrepareDecision={handlePrepareDecision}
                      onDecideReview={handleDecideReview}
                      onOpenSupplier={handleOpenSupplier}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="reviews-section">
          <SectionHeader
            kicker="Operating loop"
            icon={Layers3}
            title="Human-in-the-loop control base"
            description="La revisión humana conecta alerta, evidencia, decisión y reporte para evitar decisiones automáticas sin supervisión."
          />

          <div className="reviews-grid reviews-grid-kpis">
            <KpiCard
              label="Proveedores"
              value={safeSuppliers.length}
              description="Base monitorizada"
              icon={ShieldCheck}
            />

            <KpiCard
              label="Alertas"
              value={safeAlerts.length}
              description="Señales revisables"
              icon={AlertTriangle}
            />

            <KpiCard
              label="Evidencias"
              value={safeEvidenceItems.length}
              description="Soporte documental"
              icon={FileBadge}
            />

            <KpiCard
              label="Estado"
              value={reviewSignal.posture}
              description="Postura ejecutiva actual"
              icon={Sparkles}
            />
          </div>
        </section>
      </div>
    </div>
  );
}