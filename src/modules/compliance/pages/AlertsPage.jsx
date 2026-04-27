import React, { useMemo, useState } from 'react';
import { CheckCheck, Eye, Plus } from 'lucide-react';
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

  return labels[severity] || severity;
}

function getStatusLabel(status) {
  const labels = {
    open: 'Open',
    in_review: 'In review',
    validated: 'Validated',
    discarded: 'Discarded',
    closed: 'Closed'
  };

  return labels[status] || status;
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

  const canCreateAlert = can(PERMISSIONS.CREATE_ALERT);
  const canUpdateAlert = can(PERMISSIONS.UPDATE_ALERT);
  const canCreateReview = can(PERMISSIONS.CREATE_REVIEW);

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newAlert, setNewAlert] = useState(() => getEmptyAlertForm(suppliers));

  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const activeAlertsCount = alerts.filter((alert) => alert.status !== 'closed').length;
  const closedAlertsCount = alerts.filter((alert) => alert.status === 'closed').length;

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return alerts.filter((alert) => {
      const supplierName = getSupplierName(suppliers, alert.supplierId);

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
  }, [alerts, suppliers, query, severityFilter, statusFilter]);

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

    if (suppliers.length === 0) {
      pushToast('Primero debes crear un proveedor');
      return;
    }

    if (!supplierId) {
      pushToast('Selecciona un proveedor para la alerta');
      return;
    }

    const supplierExists = suppliers.some((supplier) => supplier.id === supplierId);

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
        ...getEmptyAlertForm(suppliers),
        supplierId: alert.supplierId || suppliers[0]?.id || ''
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

    const hasReview = reviews.some((review) => review.alertId === alert.id);

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
      <Card>
        <div className="section-title">
          <div>
            <h2>Risk Alerts</h2>
            <p className="muted">
              Monitorización de hallazgos, señales de riesgo e incidencias
              asociadas a proveedores dentro del workspace Compliance.
            </p>
          </div>

          <div className="row wrap">
            {isViewer ? <Badge>Modo solo lectura</Badge> : null}
            <Badge>{activeAlertsCount} activas</Badge>
            <Badge>{closedAlertsCount} cerradas</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Alertas abiertas</div>
          <div className="kpi-value">{engine.openAlerts.length}</div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Open + in review
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Alta severidad</div>
          <div className="kpi-value text-danger">
            {engine.highSeverityAlerts.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            High + critical
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Validadas</div>
          <div className="kpi-value text-success">
            {engine.validatedAlerts.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Confirmadas por revisión
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Descartadas</div>
          <div className="kpi-value text-danger">
            {engine.discardedAlerts.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            No relevantes o sin soporte
          </p>
        </Card>
      </div>

      <div className="grid-2">
        {canCreateAlert ? (
          <Card>
            <h3>Alert Intake</h3>

            <div className="stack">
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

              <Button onClick={handleCreateAlert}>
                <Plus size={16} />
                Crear alerta
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h3>Alert Intake</h3>
            <EmptyState
              title="Sin permisos de creación"
              description="Tu rol actual solo permite consultar alertas."
            />
          </Card>
        )}

        <Card>
          <h3>Alert Filters</h3>

          <div className="stack">
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

            <p className="muted">
              En estado <strong>all</strong> se muestran solo alertas activas.
              Para ver el histórico, selecciona <strong>closed</strong>.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Alert Queue</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Gestiona cada hallazgo y conecta la alerta con proveedor,
              evidencia y revisión humana.
            </p>
          </div>

          <Badge>{filteredAlerts.length} resultados</Badge>
        </div>

        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No hay alertas"
            description={
              statusFilter === 'closed'
                ? 'No hay alertas cerradas en el histórico.'
                : 'Crea una alerta nueva o cambia los filtros de búsqueda.'
            }
          />
        ) : (
          <div className="stack">
            {filteredAlerts.map((alert) => {
              const supplierName = getSupplierName(suppliers, alert.supplierId);

              return (
                <div
                  key={alert.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{alert.title}</h3>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplierName} · {alert.category} · {alert.source} ·{' '}
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        className={`kpi-value ${getSeverityColor(alert.severity)}`}
                        style={{ fontSize: 22 }}
                      >
                        {getSeverityLabel(alert.severity)}
                      </div>
                      <div className="kpi-label">
                        {getStatusLabel(alert.status)}
                      </div>
                    </div>
                  </div>

                  <p className="muted">{alert.description}</p>

                  <div className="row wrap">
                    <Badge>{getStatusLabel(alert.status)}</Badge>
                    <Badge>{getSeverityLabel(alert.severity)}</Badge>
                    <Badge>{alert.category}</Badge>
                  </div>

                  <div className="row wrap" style={{ marginTop: 16 }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenSupplier(alert.supplierId)}
                    >
                      <Eye size={16} />
                      Ver proveedor
                    </Button>

                    {alert.status !== 'closed' && canUpdateAlert ? (
                      <>
                        <Button
                          variant="warning"
                          onClick={() => handleMoveToReview(alert)}
                        >
                          <CheckCheck size={16} />
                          Mandar a revisión
                        </Button>

                        <Button
                          variant="success"
                          onClick={() => handleValidate(alert)}
                        >
                          Validar
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDiscard(alert)}
                        >
                          Descartar
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleClose(alert)}
                        >
                          Cerrar
                        </Button>
                      </>
                    ) : null}

                    {alert.status === 'closed' ? (
                      <Badge>Histórico cerrado</Badge>
                    ) : null}

                    {alert.status !== 'closed' && !canUpdateAlert ? (
                      <Badge>Solo lectura</Badge>
                    ) : null}
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