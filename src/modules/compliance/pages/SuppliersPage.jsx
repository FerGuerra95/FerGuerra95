import React, { useMemo, useState } from 'react';
import { Eye, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
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
  DEMO_COMPLIANCE_ALERT,
  DEMO_COMPLIANCE_EVIDENCE,
  DEMO_COMPLIANCE_REVIEW,
  DEMO_COMPLIANCE_SUPPLIER
} from '../../../shared/config/demoData.js';
import {
  SHOW_DEMO_TOOLS,
  DEMO_BUTTON_LABELS,
  DEMO_RESET_LABELS
} from '../../../shared/config/demoMode.js';

const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'];
const CRITICALITY_OPTIONS = ['Baja', 'Media', 'Alta', 'Crítica'];

const REGION_OPTIONS = [
  'Europa',
  'África Norte',
  'África',
  'Asia',
  'América',
  'Global',
  'Sin región'
];

const STATUS_OPTIONS = ['active', 'watchlist', 'inactive'];

function getEmptySupplierForm() {
  return {
    name: '',
    country: '',
    region: 'Europa',
    tier: 'Tier 1',
    sector: '',
    criticality: 'Media',
    spend: '',
    status: 'active'
  };
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeComparableText(value) {
  return normalizeText(value).toLowerCase();
}

function parseSpend(value) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

export function SuppliersPage() {
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
    createSupplier,
    deleteSupplier,
    createAlert,
    addEvidence,
    createReview
  } = useComplianceStore();

  const canCreateSupplier = can(PERMISSIONS.CREATE_SUPPLIER);
  const canDeleteSupplier = can(PERMISSIONS.DELETE_SUPPLIER);

  const canLoadDemo =
    can(PERMISSIONS.CREATE_SUPPLIER) &&
    can(PERMISSIONS.CREATE_ALERT) &&
    can(PERMISSIONS.CREATE_EVIDENCE) &&
    can(PERMISSIONS.CREATE_REVIEW);

  const canResetDemo = can(PERMISSIONS.DELETE_SUPPLIER);

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  const [query, setQuery] = useState('');
  const [newSupplier, setNewSupplier] = useState(getEmptySupplierForm());

  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return engine.suppliers;

    return engine.suppliers.filter((supplier) => {
      return [
        supplier.name,
        supplier.country,
        supplier.region,
        supplier.tier,
        supplier.sector,
        supplier.criticality,
        supplier.status
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [engine.suppliers, query]);

  function updateNewSupplierField(key, value) {
    setNewSupplier((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleCreateSupplier() {
    if (!canCreateSupplier) {
      pushToast('No tienes permisos para crear proveedores');
      return;
    }

    const supplierName = normalizeText(newSupplier.name);

    if (!supplierName) {
      pushToast('El nombre del proveedor es obligatorio');
      return;
    }

    const duplicatedSupplier = suppliers.some((supplier) => {
      return (
        normalizeComparableText(supplier.name) ===
        normalizeComparableText(supplierName)
      );
    });

    if (duplicatedSupplier) {
      pushToast('Ya existe un proveedor con ese nombre');
      return;
    }

    const spendValue = parseSpend(newSupplier.spend);

    if (spendValue === null) {
      pushToast('El spend anual debe ser un número válido');
      return;
    }

    if (spendValue < 0) {
      pushToast('El spend anual no puede ser negativo');
      return;
    }

    try {
      const created = await Promise.resolve(
        createSupplier({
          ...newSupplier,
          name: supplierName,
          country: normalizeText(newSupplier.country) || 'Sin país',
          region: newSupplier.region || 'Sin región',
          tier: newSupplier.tier || 'Tier 1',
          sector: normalizeText(newSupplier.sector) || 'General',
          criticality: newSupplier.criticality || 'Media',
          spend: spendValue,
          status: newSupplier.status || 'active'
        })
      );

      if (!created?.id) {
        pushToast('No se pudo crear el proveedor');
        return;
      }

      setNewSupplier(getEmptySupplierForm());

      pushToast('Proveedor creado correctamente');

      navigate(`/compliance/suppliers/${created.id}`);
    } catch (error) {
      pushToast(error?.message || 'No se pudo crear el proveedor');
    }
  }

  function handleLoadDemoCompliance() {
    if (!canLoadDemo) {
      pushToast('No tienes permisos para cargar la demo Compliance');
      return;
    }

    const existingSupplier = suppliers.find(
      (supplier) => supplier.id === DEMO_COMPLIANCE_SUPPLIER.id
    );

    const supplier = existingSupplier || createSupplier(DEMO_COMPLIANCE_SUPPLIER);

    const existingAlert = alerts.find(
      (alert) => alert.id === DEMO_COMPLIANCE_ALERT.id
    );

    if (!existingAlert) {
      createAlert(DEMO_COMPLIANCE_ALERT);
    }

    const existingEvidence = evidenceItems.find(
      (evidence) => evidence.id === DEMO_COMPLIANCE_EVIDENCE.id
    );

    if (!existingEvidence) {
      addEvidence(DEMO_COMPLIANCE_EVIDENCE);
    }

    const existingReview = reviews.find(
      (review) => review.id === DEMO_COMPLIANCE_REVIEW.id
    );

    if (!existingReview) {
      createReview(DEMO_COMPLIANCE_REVIEW);
    }

    setActiveSupplierId(supplier.id);

    pushToast('Demo Compliance preparada: Atlas Components Morocco');

    navigate(`/compliance/suppliers/${supplier.id}`);
  }

  function handleResetDemoCompliance() {
    if (!canResetDemo) {
      pushToast('No tienes permisos para resetear la demo Compliance');
      return;
    }

    const demoExists = suppliers.some(
      (supplier) => supplier.id === DEMO_COMPLIANCE_SUPPLIER.id
    );

    if (demoExists) {
      deleteSupplier(DEMO_COMPLIANCE_SUPPLIER.id);
    }

    setQuery('');
    setNewSupplier(getEmptySupplierForm());

    const nextActiveSupplier = suppliers.find(
      (supplier) => supplier.id !== DEMO_COMPLIANCE_SUPPLIER.id
    );

    setActiveSupplierId(nextActiveSupplier?.id || '');

    pushToast('Compliance demo limpiado');

    navigate('/compliance/suppliers');
  }

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  function handleSetActive(supplierId) {
    setActiveSupplierId(supplierId);
    pushToast('Proveedor activado');
  }

  function handleDeleteSupplier(supplierId) {
    if (!canDeleteSupplier) {
      pushToast('No tienes permisos para eliminar proveedores');
      return;
    }

    const result = deleteSupplier(supplierId);

    if (!result?.deleted) {
      pushToast('No se pudo eliminar el proveedor');
      return;
    }

    const removed = result.removed || {};

    pushToast(
      `Proveedor eliminado: ${removed.alerts || 0} alertas, ${
        removed.evidence || 0
      } evidencias y ${removed.reviews || 0} revisiones asociadas`
    );
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Supplier Registry</h2>
            <p className="muted">
              Registro centralizado de proveedores con segmentación, criticidad,
              spend, scoring de riesgo y resiliencia operativa.
            </p>
          </div>

          <div className="row wrap">
            {SHOW_DEMO_TOOLS && canLoadDemo ? (
              <Button variant="secondary" onClick={handleLoadDemoCompliance}>
                <Sparkles size={16} />
                {DEMO_BUTTON_LABELS.compliance}
              </Button>
            ) : null}

            {SHOW_DEMO_TOOLS && canResetDemo ? (
              <Button variant="secondary" onClick={handleResetDemoCompliance}>
                <RotateCcw size={16} />
                {DEMO_RESET_LABELS.compliance}
              </Button>
            ) : null}

            {isViewer ? <Badge>Modo solo lectura</Badge> : null}

            <Badge>{engine.suppliers.length} proveedores</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-2">
        {canCreateSupplier ? (
          <Card>
            <h3>Nuevo proveedor</h3>

            <div className="stack">
              <Input
                label="Nombre del proveedor"
                value={newSupplier.name}
                onChange={(e) => updateNewSupplierField('name', e.target.value)}
              />

              <div className="grid-2">
                <Input
                  label="País"
                  value={newSupplier.country}
                  onChange={(e) =>
                    updateNewSupplierField('country', e.target.value)
                  }
                />

                <Select
                  label="Región"
                  value={newSupplier.region}
                  onChange={(e) =>
                    updateNewSupplierField('region', e.target.value)
                  }
                  options={REGION_OPTIONS}
                />
              </div>

              <div className="grid-2">
                <Select
                  label="Tier"
                  value={newSupplier.tier}
                  onChange={(e) => updateNewSupplierField('tier', e.target.value)}
                  options={TIER_OPTIONS}
                />

                <Select
                  label="Criticidad"
                  value={newSupplier.criticality}
                  onChange={(e) =>
                    updateNewSupplierField('criticality', e.target.value)
                  }
                  options={CRITICALITY_OPTIONS}
                />
              </div>

              <div className="grid-2">
                <Input
                  label="Sector"
                  value={newSupplier.sector}
                  onChange={(e) =>
                    updateNewSupplierField('sector', e.target.value)
                  }
                />

                <Input
                  label="Spend anual (€)"
                  inputMode="decimal"
                  value={newSupplier.spend}
                  onChange={(e) =>
                    updateNewSupplierField('spend', e.target.value)
                  }
                />
              </div>

              <Select
                label="Estado"
                value={newSupplier.status}
                onChange={(e) => updateNewSupplierField('status', e.target.value)}
                options={STATUS_OPTIONS}
              />

              <Button onClick={handleCreateSupplier}>
                <Plus size={16} />
                Crear proveedor
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h3>Nuevo proveedor</h3>
            <EmptyState
              title="Sin permisos de creación"
              description="Tu rol actual solo permite consultar proveedores."
            />
          </Card>
        )}

        <Card>
          <h3>Portfolio Overview</h3>

          <div className="grid-2">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Riesgo medio</div>
              <div className="kpi-value">
                {engine.portfolioRisk.averageRiskScore}/100
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Resiliencia media</div>
              <div className="kpi-value">
                {engine.portfolioResilience.averageResilienceScore}/100
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Proveedores alto riesgo</div>
              <div className="kpi-value text-danger">
                {engine.highRiskSuppliers.length}
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Cobertura evidencia</div>
              <div className="kpi-value">
                {engine.portfolioRisk.evidenceCoverage}%
              </div>
            </div>
          </div>

          <p className="muted">
            Esta vista permite controlar qué proveedores requieren revisión
            prioritaria antes de pasar al módulo de evidencias, alertas y reportes.
          </p>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Supplier List</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Selecciona un proveedor para revisar su ficha, alertas, evidencias
              y scoring.
            </p>
          </div>

          <div style={{ minWidth: 260 }}>
            <Input
              label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <EmptyState
            title="No hay proveedores"
            description="Crea un proveedor o cambia el filtro de búsqueda."
          />
        ) : (
          <div className="stack">
            {filteredSuppliers.map((supplier) => {
              const isActive = supplier.id === activeSupplierId;

              return (
                <div
                  key={supplier.id}
                  className="card"
                  style={{
                    background: isActive
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(255,255,255,0.04)'
                  }}
                >
                  <div className="section-title">
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{supplier.name}</h3>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplier.country || 'Sin país'} · {supplier.region} ·{' '}
                        {supplier.tier} · {supplier.criticality}
                      </p>
                    </div>

                    <div className="row wrap">
                      <div style={{ textAlign: 'right' }}>
                        <div
                          className={`kpi-value ${supplier.riskLevel.color}`}
                          style={{ fontSize: 22 }}
                        >
                          {supplier.riskScore}/100
                        </div>
                        <div className="kpi-label">
                          Riesgo {supplier.riskLevel.label}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          className={`kpi-value ${supplier.resilienceLevel.color}`}
                          style={{ fontSize: 22 }}
                        >
                          {supplier.resilienceScore}/100
                        </div>
                        <div className="kpi-label">
                          Resiliencia {supplier.resilienceLevel.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row wrap">
                    <Badge>{supplier.status}</Badge>
                    <Badge>{supplier.sector || 'General'}</Badge>
                    <Badge>
                      {Number(supplier.spend || 0).toLocaleString('es-ES')} € spend
                    </Badge>
                  </div>

                  <div className="row wrap" style={{ marginTop: 16 }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleSetActive(supplier.id)}
                    >
                      Activar
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleOpenSupplier(supplier.id)}
                    >
                      <Eye size={16} />
                      Ver ficha
                    </Button>

                    {canDeleteSupplier ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </Button>
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