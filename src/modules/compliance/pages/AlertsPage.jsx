import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  Eye,
  FileSearch,
  Filter,
  Inbox,
  Layers3,
  Plus,
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

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['open', 'in_review', 'validated', 'discarded', 'closed'];

const CATEGORY_OPTIONS = [
  'Operational Risk',
  'Geopolitical Risk',
  'Evidence Gap',
  'Manual Review',
  'ESG Risk',
  'Legal Risk',
  'General Risk'
];

const alertsPageCss = `
  .alerts-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .alerts-hero {
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

  .alerts-hero::before {
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

  .alerts-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .alerts-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .alerts-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .alerts-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .alerts-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .alerts-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .alerts-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .alerts-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .alerts-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .alerts-signal-card {
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

  .alerts-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .alerts-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .alerts-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .alerts-icon-box,
  .alerts-card-icon,
  .alerts-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .alerts-icon-box {
    width: 50px;
    height: 50px;
  }

  .alerts-card-icon,
  .alerts-panel-icon {
    width: 46px;
    height: 46px;
  }

  .alerts-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .alerts-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .alerts-score-ring {
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

  .alerts-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .alerts-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .alerts-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .alerts-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .alerts-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .alerts-signal-table {
    display: grid;
    gap: 0;
  }

  .alerts-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .alerts-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .alerts-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .alerts-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .alerts-kicker {
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

  .alerts-section-header h2,
  .alerts-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .alerts-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .alerts-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .alerts-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .alerts-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .alerts-kpi-card,
  .alerts-panel,
  .alerts-list-card {
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

  .alerts-kpi-card {
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

  .alerts-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .alerts-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .alerts-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .alerts-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .alerts-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .alerts-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .alerts-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .alerts-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .alerts-form,
  .alerts-filter-stack,
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .alerts-form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
  }

  .alerts-filter-note {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
    line-height: 1.62;
  }

  .alerts-list-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .alerts-list-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .alerts-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .alerts-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .alerts-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .alerts-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .alerts-severity-box {
    min-width: 120px;
    text-align: right;
  }

  .alerts-severity-box strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .alerts-description {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    line-height: 1.62;
  }

  .alerts-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .alerts-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .alerts-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .alerts-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .alerts-hero-layout,
    .alerts-grid-two {
      grid-template-columns: 1fr;
    }

    .alerts-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .alerts-command-bar {
      grid-template-columns: 1fr;
    }

    .alerts-section-header,
    .alerts-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .alerts-severity-box {
      text-align: left;
    }
  }

  @media (max-width: 680px) {
    .alerts-page {
      gap: 28px;
    }

    .alerts-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .alerts-grid-kpis {
      grid-template-columns: 1fr;
    }

    .alerts-kpi-card,
    .alerts-panel,
    .alerts-list-card,
    .alerts-list-panel {
      border-radius: 24px;
    }

    .alerts-score-module {
      grid-template-columns: 1fr;
    }

    .alerts-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .alerts-signal-row strong {
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

function getSupplierName(suppliers, supplierId) {
  const supplier = suppliers.find((item) => item.id === supplierId);

  return supplier?.name || 'Proveedor no identificado';
}

function getSeverityColor(severity) {
  if (severity === 'critical') return 'text-danger';
  if (severity === 'high') return 'text-warning';
  if (severity === 'medium') return 'text-info';

  return 'text-success';
}

function getSeverityLabel(severity) {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };

  return labels[severity] || severity || 'N/A';
}

function getStatusLabel(status) {
  const labels = {
    open: 'Open',
    in_review: 'In review',
    validated: 'Validated',
    discarded: 'Discarded',
    closed: 'Closed'
  };

  return labels[status] || status || 'N/A';
}

function getEmptyAlertForm(suppliers = []) {
  return {
    supplierId: suppliers[0]?.id || '',
    title: '',
    category: 'Manual Review',
    severity: 'medium',
    status: 'open',
    source: 'Compliance operator',
    description: ''
  };
}

function normalizeText(value) {
  return String(value || '').trim();
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getAlertSignal({
  totalAlerts,
  activeAlertsCount,
  highSeverityCount,
  validatedCount,
  discardedCount
}) {
  if (totalAlerts === 0) {
    return {
      score: null,
      title: 'Alert queue empty',
      posture: 'Monitor suppliers',
      description:
        'Todavía no hay alertas registradas. Crea una alerta o monitoriza proveedores para activar el flujo de revisión.'
    };
  }

  const validationRatio = totalAlerts > 0 ? validatedCount / totalAlerts : 0;
  const pressurePenalty = Math.min(42, highSeverityCount * 14 + activeAlertsCount * 3);
  const discardedPenalty = Math.min(10, discardedCount * 2);
  const score = clampScore(82 + validationRatio * 18 - pressurePenalty - discardedPenalty);

  if (highSeverityCount > 0) {
    return {
      score,
      title: 'High-severity alerts active',
      posture: 'Prioritize review',
      description:
        'Existen alertas high o critical. Prioriza revisión humana, evidencia y decisión antes de cerrar el expediente.'
    };
  }

  if (activeAlertsCount > 0) {
    return {
      score,
      title: 'Active alert queue',
      posture: 'Review open items',
      description:
        'Hay alertas abiertas o en revisión. Mantén el flujo Alert → Evidence → Review hasta decisión.'
    };
  }

  if (validatedCount > 0) {
    return {
      score,
      title: 'Validated alert history',
      posture: 'Maintain controls',
      description:
        'Las alertas existentes ya tienen trazabilidad de decisión. Mantén seguimiento documental y revisión periódica.'
    };
  }

  return {
    score,
    title: 'Alert history available',
    posture: 'Monitor changes',
    description:
      'Existe histórico de alertas. Conviene mantener monitorización y conectar próximas señales con evidencia.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="alerts-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="alerts-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="alerts-section-header">
      <div>
        <div className="alerts-kicker">
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
    <div className="alerts-panel-header">
      <div>
        <div className="alerts-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="alerts-panel-title">{title}</h3>

        <p className="muted alerts-panel-description">{description}</p>
      </div>

      <div className="alerts-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="alerts-kpi-card">
      <div className="alerts-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`alerts-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="alerts-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function AlertCard({
  alert,
  supplierName,
  canUpdateAlert,
  onOpenSupplier,
  onMoveToReview,
  onValidate,
  onDiscard,
  onClose
}) {
  const isClosed = alert.status === 'closed';

  return (
    <article className="alerts-list-card">
      <div className="alerts-list-card-head">
        <div>
          <h3 className="alerts-list-card-title">{alert.title}</h3>

          <p className="muted alerts-list-meta">
            {supplierName} · {alert.category || 'Categoría N/A'} ·{' '}
            {alert.source || 'Fuente N/A'} · {formatDate(alert.createdAt)}
          </p>
        </div>

        <div className="alerts-severity-box">
          <strong className={getSeverityColor(alert.severity)}>
            {getSeverityLabel(alert.severity)}
          </strong>

          <div className="kpi-label">{getStatusLabel(alert.status)}</div>
        </div>
      </div>

      <p className="muted alerts-description">
        {alert.description || 'Sin descripción registrada.'}
      </p>

      <div className="alerts-chip-row">
        <Badge>{getStatusLabel(alert.status)}</Badge>
        <Badge>{getSeverityLabel(alert.severity)}</Badge>
        <Badge>{alert.category || 'General Risk'}</Badge>
      </div>

      <div className="alerts-card-actions">
        <Button
          variant="secondary"
          onClick={() => onOpenSupplier(alert.supplierId)}
        >
          <Eye size={16} />
          Ver proveedor
        </Button>

        {!isClosed && canUpdateAlert ? (
          <>
            <Button
              variant="warning"
              onClick={() => onMoveToReview(alert)}
            >
              <CheckCheck size={16} />
              Mandar a revisión
            </Button>

            <Button
              variant="success"
              onClick={() => onValidate(alert)}
            >
              <CheckCircle2 size={16} />
              Validar
            </Button>

            <Button
              variant="danger"
              onClick={() => onDiscard(alert)}
            >
              <XCircle size={16} />
              Descartar
            </Button>

            <Button
              variant="secondary"
              onClick={() => onClose(alert)}
            >
              Cerrar
            </Button>
          </>
        ) : null}

        {isClosed ? <Badge>Histórico cerrado</Badge> : null}
        {!isClosed && !canUpdateAlert ? <Badge>Solo lectura</Badge> : null}
      </div>
    </article>
  );
}

export function AlertsPage() {
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
    createAlert,
    updateAlert,
    createReview
  } = useComplianceStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const canCreateAlert = can(PERMISSIONS.CREATE_ALERT);
  const canUpdateAlert = can(PERMISSIONS.UPDATE_ALERT);
  const canCreateReview = can(PERMISSIONS.CREATE_REVIEW);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const openAlerts = getSafeArray(engine.openAlerts);
  const highSeverityAlerts = getSafeArray(engine.highSeverityAlerts);
  const validatedAlerts = getSafeArray(engine.validatedAlerts);
  const discardedAlerts = getSafeArray(engine.discardedAlerts);

  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newAlert, setNewAlert] = useState(() =>
    getEmptyAlertForm(safeSuppliers)
  );

  const supplierOptions = safeSuppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const activeAlertsCount = safeAlerts.filter(
    (alert) => alert.status !== 'closed'
  ).length;
  const closedAlertsCount = safeAlerts.filter(
    (alert) => alert.status === 'closed'
  ).length;

  const alertSignal = getAlertSignal({
    totalAlerts: safeAlerts.length,
    activeAlertsCount,
    highSeverityCount: highSeverityAlerts.length,
    validatedCount: validatedAlerts.length,
    discardedCount: discardedAlerts.length
  });

  const scoreAngle = `${(alertSignal.score ?? 0) * 3.6}deg`;

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return safeAlerts.filter((alert) => {
      const supplierName = getSupplierName(safeSuppliers, alert.supplierId);

      const matchesQuery = !normalizedQuery
        ? true
        : [
            alert.title,
            alert.category,
            alert.severity,
            alert.status,
            alert.source,
            alert.description,
            supplierName
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

      const matchesSeverity =
        severityFilter === 'all' ? true : alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === 'all'
          ? alert.status !== 'closed'
          : alert.status === statusFilter;

      return matchesQuery && matchesSeverity && matchesStatus;
    });
  }, [safeAlerts, safeSuppliers, query, severityFilter, statusFilter]);

  function updateNewAlertField(key, value) {
    setNewAlert((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleCreateAlert() {
    if (!canCreateAlert) {
      pushToast('No tienes permisos para crear alertas');
      return;
    }

    const supplierId = normalizeText(newAlert.supplierId);
    const title = normalizeText(newAlert.title);
    const source = normalizeText(newAlert.source) || 'Manual';
    const description = normalizeText(newAlert.description);

    if (safeSuppliers.length === 0) {
      pushToast('Primero debes crear un proveedor');
      return;
    }

    if (!supplierId) {
      pushToast('Selecciona un proveedor para la alerta');
      return;
    }

    const supplierExists = safeSuppliers.some(
      (supplier) => supplier.id === supplierId
    );

    if (!supplierExists) {
      pushToast('El proveedor seleccionado no existe');
      return;
    }

    if (!title) {
      pushToast('El título de la alerta es obligatorio');
      return;
    }

    try {
      const alert = await Promise.resolve(
        createAlert({
          ...newAlert,
          supplierId,
          title,
          source,
          description
        })
      );

      if (!alert?.id) {
        pushToast('No se pudo crear la alerta');
        return;
      }

      if (canCreateReview) {
        createReview({
          alertId: alert.id,
          supplierId: alert.supplierId
        });
      }

      setNewAlert({
        ...getEmptyAlertForm(safeSuppliers),
        supplierId: alert.supplierId || safeSuppliers[0]?.id || ''
      });

      pushToast(
        canCreateReview
          ? 'Alerta creada y enviada a revisión'
          : 'Alerta creada correctamente'
      );
    } catch (error) {
      pushToast(error?.message || 'No se pudo crear la alerta');
    }
  }

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  function handleMoveToReview(alert) {
    if (!canUpdateAlert) {
      pushToast('No tienes permisos para modificar alertas');
      return;
    }

    updateAlert(alert.id, {
      status: 'in_review'
    });

    const hasReview = safeReviews.some((review) => review.alertId === alert.id);

    if (!hasReview && canCreateReview) {
      createReview({
        alertId: alert.id,
        supplierId: alert.supplierId
      });
    }

    pushToast('Alerta enviada a revisión');
  }

  function handleValidate(alert) {
    if (!canUpdateAlert) {
      pushToast('No tienes permisos para validar alertas');
      return;
    }

    updateAlert(alert.id, {
      status: 'validated'
    });

    pushToast('Alerta validada');
  }

  function handleDiscard(alert) {
    if (!canUpdateAlert) {
      pushToast('No tienes permisos para descartar alertas');
      return;
    }

    updateAlert(alert.id, {
      status: 'discarded'
    });

    pushToast('Alerta descartada');
  }

  function handleClose(alert) {
    if (!canUpdateAlert) {
      pushToast('No tienes permisos para cerrar alertas');
      return;
    }

    updateAlert(alert.id, {
      status: 'closed'
    });

    pushToast('Alerta cerrada y archivada');
  }

  return (
    <div className="page">
      <style>{alertsPageCss}</style>

      <div className="alerts-page">
        <section className="alerts-hero">
          <div className="alerts-hero-layout">
            <div>
              <div className="alerts-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Risk Alerts</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canCreateAlert ? <Badge>Creación permitida</Badge> : null}
                {canUpdateAlert ? <Badge>Gestión permitida</Badge> : null}
              </div>

              <h1 className="alerts-title">
                Risk Alerts.
                <span>Turn signals into controlled decisions.</span>
              </h1>

              <p className="alerts-copy">
                Monitorización de hallazgos, señales de riesgo e incidencias
                asociadas a proveedores dentro del workspace Compliance, con
                conexión directa a evidencia y revisión humana.
              </p>

              <div className="alerts-command-bar">
                <CommandItem
                  label="Active alerts"
                  value={activeAlertsCount}
                />

                <CommandItem
                  label="Closed history"
                  value={closedAlertsCount}
                />

                <CommandItem
                  label="Alert posture"
                  value={alertSignal.posture}
                />
              </div>
            </div>

            <aside className="alerts-signal-card">
              <div className="alerts-signal-inner">
                <div className="alerts-signal-top">
                  <div>
                    <div className="kpi-label">Alert Signal</div>
                    <div className="alerts-signal-title">
                      {alertSignal.title}
                    </div>
                  </div>

                  <div className="alerts-icon-box">
                    <ShieldAlert size={21} />
                  </div>
                </div>

                <div className="alerts-score-module">
                  <div
                    className="alerts-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="alerts-score-core">
                      <strong className={alertSignal.score === null ? 'is-empty-score' : ''}>
                        {alertSignal.score === null ? '—' : alertSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="alerts-score-copy">
                    <strong>{alertSignal.posture}</strong>

                    <p className="muted">
                      {alertSignal.description}
                    </p>
                  </div>
                </div>

                <div className="alerts-signal-table">
                  <SignalRow label="Open + review" value={openAlerts.length} />
                  <SignalRow label="High severity" value={highSeverityAlerts.length} />
                  <SignalRow label="Validated" value={validatedAlerts.length} />
                  <SignalRow label="Discarded" value={discardedAlerts.length} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="alerts-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="Alert queue at a glance"
            description="Resumen de alertas abiertas, severidad, validaciones y descartes para priorizar revisión."
          />

          <div className="alerts-grid alerts-grid-kpis">
            <KpiCard
              label="Alertas abiertas"
              value={openAlerts.length}
              description="Open + in review"
              icon={Inbox}
            />

            <KpiCard
              label="Alta severidad"
              value={highSeverityAlerts.length}
              description="High + critical"
              icon={AlertTriangle}
              tone={highSeverityAlerts.length > 0 ? 'text-danger' : ''}
            />

            <KpiCard
              label="Validadas"
              value={validatedAlerts.length}
              description="Confirmadas por revisión"
              icon={CheckCircle2}
              tone="text-success"
            />

            <KpiCard
              label="Descartadas"
              value={discardedAlerts.length}
              description="No relevantes o sin soporte"
              icon={XCircle}
              tone={discardedAlerts.length > 0 ? 'text-danger' : ''}
            />
          </div>
        </section>

        <section className="alerts-grid alerts-grid-two">
          <Card className="alerts-panel">
            <PanelHeader
              kicker="Alert intake"
              icon={Plus}
              title="Alert Intake"
              description="Crea una nueva alerta y conéctala con proveedor, evidencia y revisión humana."
            />

            {canCreateAlert ? (
              <div className="alerts-form">
                <Select
                  label="Proveedor"
                  value={newAlert.supplierId}
                  onChange={(e) => updateNewAlertField('supplierId', e.target.value)}
                  options={
                    supplierOptions.length > 0
                      ? supplierOptions
                      : [{ label: 'Sin proveedores', value: '' }]
                  }
                />

                <Input
                  label="Título"
                  value={newAlert.title}
                  onChange={(e) => updateNewAlertField('title', e.target.value)}
                />

                <div className="grid-2">
                  <Select
                    label="Categoría"
                    value={newAlert.category}
                    onChange={(e) => updateNewAlertField('category', e.target.value)}
                    options={CATEGORY_OPTIONS}
                  />

                  <Select
                    label="Severidad"
                    value={newAlert.severity}
                    onChange={(e) => updateNewAlertField('severity', e.target.value)}
                    options={SEVERITY_OPTIONS}
                  />
                </div>

                <div className="grid-2">
                  <Select
                    label="Estado"
                    value={newAlert.status}
                    onChange={(e) => updateNewAlertField('status', e.target.value)}
                    options={STATUS_OPTIONS}
                  />

                  <Input
                    label="Fuente"
                    value={newAlert.source}
                    onChange={(e) => updateNewAlertField('source', e.target.value)}
                  />
                </div>

                <Input
                  label="Descripción"
                  value={newAlert.description}
                  onChange={(e) => updateNewAlertField('description', e.target.value)}
                />

                <div className="alerts-form-actions">
                  <Button onClick={handleCreateAlert}>
                    <Plus size={16} />
                    Crear alerta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="alerts-empty-wrap">
                <EmptyState
                  title="Sin permisos de creación"
                  description="Tu rol actual solo permite consultar alertas."
                />
              </div>
            )}
          </Card>

          <Card className="alerts-panel">
            <PanelHeader
              kicker="Queue filters"
              icon={Filter}
              title="Alert Filters"
              description="Filtra por texto, severidad y estado para revisar solo la cola relevante."
            />

            <div className="alerts-filter-stack">
              <Input
                label="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="grid-2">
                <Select
                  label="Severidad"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  options={['all', ...SEVERITY_OPTIONS]}
                />

                <Select
                  label="Estado"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={['all', ...STATUS_OPTIONS]}
                />
              </div>

              <div className="alerts-filter-note">
                <p className="muted alerts-muted-tight">
                  En estado <strong>all</strong> se muestran solo alertas
                  activas. Para ver el histórico, selecciona{' '}
                  <strong>closed</strong>.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="alerts-section">
          <SectionHeader
            kicker="Alert queue"
            icon={Search}
            title="Alert Queue"
            description="Gestiona cada hallazgo y conecta la alerta con proveedor, evidencia y revisión humana."
            right={<Badge>{filteredAlerts.length} resultados</Badge>}
          />

          <Card className="alerts-list-panel">
            {filteredAlerts.length === 0 ? (
              <div className="alerts-empty-wrap">
                <EmptyState
                  title="No hay alertas"
                  description={
                    statusFilter === 'closed'
                      ? 'No hay alertas cerradas en el histórico.'
                      : 'Crea una alerta nueva o cambia los filtros de búsqueda.'
                  }
                />
              </div>
            ) : (
              <div className="alerts-list">
                {filteredAlerts.map((alert) => {
                  const supplierName = getSupplierName(
                    safeSuppliers,
                    alert.supplierId
                  );

                  return (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      supplierName={supplierName}
                      canUpdateAlert={canUpdateAlert}
                      onOpenSupplier={handleOpenSupplier}
                      onMoveToReview={handleMoveToReview}
                      onValidate={handleValidate}
                      onDiscard={handleDiscard}
                      onClose={handleClose}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="alerts-section">
          <SectionHeader
            kicker="Operating loop"
            icon={Layers3}
            title="Alert operating workflow"
            description="Cada alerta debe avanzar hacia revisión, evidencia, decisión y cierre para mantener trazabilidad."
          />

          <div className="alerts-grid alerts-grid-kpis">
            <KpiCard
              label="Proveedores"
              value={safeSuppliers.length}
              description="Base monitorizada"
              icon={ShieldCheck}
            />

            <KpiCard
              label="Evidencias"
              value={safeEvidenceItems.length}
              description="Soporte documental"
              icon={FileSearch}
            />

            <KpiCard
              label="Revisiones"
              value={safeReviews.length}
              description="Controles humanos"
              icon={CheckCheck}
            />

            <KpiCard
              label="Estado"
              value={alertSignal.posture}
              description="Postura ejecutiva actual"
              icon={Sparkles}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
