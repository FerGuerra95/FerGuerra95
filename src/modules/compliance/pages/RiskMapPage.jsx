import React, { useMemo, useState } from 'react';
import { AlertTriangle, Eye, Globe2, Map, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

function formatCurrency(value) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return `${safeValue.toLocaleString('es-ES', {
    maximumFractionDigits: 0
  })} €`;
}

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

function getRegionLevel(avgRisk) {
  if (avgRisk >= 75) {
    return {
      label: 'Crítico',
      color: 'text-danger',
      description: 'Exposición alta. Requiere revisión prioritaria.'
    };
  }

  if (avgRisk >= 55) {
    return {
      label: 'Alto',
      color: 'text-warning',
      description: 'Riesgo relevante. Conviene reforzar seguimiento.'
    };
  }

  if (avgRisk >= 35) {
    return {
      label: 'Medio',
      color: 'text-info',
      description: 'Riesgo controlable con revisión periódica.'
    };
  }

  return {
    label: 'Bajo',
    color: 'text-success',
    description: 'Exposición limitada según señales actuales.'
  };
}

function buildRegionStats({ suppliers = [], alerts = [] }) {
  const regions = {};

  suppliers.forEach((supplier) => {
    const region = supplier.region || 'Sin región';

    if (!regions[region]) {
      regions[region] = {
        region,
        suppliers: [],
        alerts: [],
        totalSpend: 0,
        avgRisk: 0,
        avgResilience: 0,
        highRiskSuppliers: 0,
        criticalSuppliers: 0
      };
    }

    regions[region].suppliers.push(supplier);
    regions[region].totalSpend += Number(supplier.spend || 0);
  });

  alerts.forEach((alert) => {
    const supplier = suppliers.find((item) => item.id === alert.supplierId);
    const region = supplier?.region || 'Sin región';

    if (!regions[region]) {
      regions[region] = {
        region,
        suppliers: [],
        alerts: [],
        totalSpend: 0,
        avgRisk: 0,
        avgResilience: 0,
        highRiskSuppliers: 0,
        criticalSuppliers: 0
      };
    }

    regions[region].alerts.push(alert);
  });

  return Object.values(regions)
    .map((item) => {
      const totalSuppliers = item.suppliers.length;

      const avgRisk =
        totalSuppliers > 0
          ? Math.round(
              item.suppliers.reduce(
                (sum, supplier) => sum + Number(supplier.riskScore || 0),
                0
              ) / totalSuppliers
            )
          : 0;

      const avgResilience =
        totalSuppliers > 0
          ? Math.round(
              item.suppliers.reduce(
                (sum, supplier) => sum + Number(supplier.resilienceScore || 0),
                0
              ) / totalSuppliers
            )
          : 0;

      const highRiskSuppliers = item.suppliers.filter(
        (supplier) => Number(supplier.riskScore || 0) >= 55
      ).length;

      const criticalSuppliers = item.suppliers.filter(
        (supplier) => Number(supplier.riskScore || 0) >= 75
      ).length;

      return {
        ...item,
        avgRisk,
        avgResilience,
        highRiskSuppliers,
        criticalSuppliers,
        level: getRegionLevel(avgRisk)
      };
    })
    .sort((a, b) => b.avgRisk - a.avgRisk);
}

export function RiskMapPage() {
  const navigate = useNavigate();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId
  } = useComplianceStore();

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  const regionStats = useMemo(() => {
    return buildRegionStats({
      suppliers: engine.suppliers,
      alerts
    });
  }, [engine.suppliers, alerts]);

  const [selectedRegion, setSelectedRegion] = useState('all');

  const regionOptions = ['all', ...regionStats.map((item) => item.region)];

  const selectedRegionStats =
    selectedRegion === 'all'
      ? null
      : regionStats.find((item) => item.region === selectedRegion) || null;

  const visibleSuppliers = useMemo(() => {
    if (selectedRegion === 'all') {
      return engine.suppliers;
    }

    return engine.suppliers.filter(
      (supplier) => supplier.region === selectedRegion
    );
  }, [engine.suppliers, selectedRegion]);

  const visibleAlerts = useMemo(() => {
    if (selectedRegion === 'all') {
      return alerts;
    }

    const supplierIds = new Set(visibleSuppliers.map((supplier) => supplier.id));
    return alerts.filter((alert) => supplierIds.has(alert.supplierId));
  }, [alerts, selectedRegion, visibleSuppliers]);

  const topRegionSuppliers = [...visibleSuppliers]
    .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0))
    .slice(0, 6);

  const highSeverityRegionAlerts = visibleAlerts.filter((alert) =>
    ['high', 'critical'].includes(String(alert.severity).toLowerCase())
  );

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Supply Chain Risk Map</h2>
            <p className="muted">
              Mapa ejecutivo de exposición por región, proveedores críticos,
              alertas severas, spend expuesto y resiliencia de la cartera.
            </p>
          </div>

          <Badge>{regionStats.length} regiones</Badge>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Riesgo medio cartera</div>
          <div className="kpi-value">
            {engine.portfolioRisk.averageRiskScore}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Score agregado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Resiliencia media</div>
          <div className="kpi-value">
            {engine.portfolioResilience.averageResilienceScore}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Capacidad de continuidad
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Proveedores alto riesgo</div>
          <div className="kpi-value text-danger">
            {engine.highRiskSuppliers.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Score superior a 55
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Alertas severas</div>
          <div className="kpi-value text-warning">
            {engine.highSeverityAlerts.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            High + critical
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <h3>Regional Exposure</h3>

          <div className="stack">
            <Select
              label="Región"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              options={regionOptions}
            />

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="row">
                <Globe2 size={18} />
                <div>
                  <strong>
                    {selectedRegion === 'all'
                      ? 'Vista global de cartera'
                      : `Región: ${selectedRegion}`}
                  </strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {selectedRegionStats
                      ? selectedRegionStats.level.description
                      : 'Visión agregada de todas las regiones monitorizadas.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Selected Exposure</h3>

          <div className="grid-2">
            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Proveedores</div>
              <div className="kpi-value">{visibleSuppliers.length}</div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Alertas</div>
              <div className="kpi-value">{visibleAlerts.length}</div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Alertas severas</div>
              <div className="kpi-value text-warning">
                {highSeverityRegionAlerts.length}
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Spend expuesto</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>
                {formatCurrency(
                  visibleSuppliers.reduce(
                    (sum, supplier) => sum + Number(supplier.spend || 0),
                    0
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Risk Distribution</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Ranking regional por exposición, riesgo medio, resiliencia y
              alertas asociadas.
            </p>
          </div>

          <Map size={20} />
        </div>

        {regionStats.length === 0 ? (
          <EmptyState
            title="No hay regiones"
            description="Crea proveedores para construir el mapa de riesgo."
          />
        ) : (
          <div className="stack">
            {regionStats.map((region) => (
              <div
                key={region.region}
                className="card"
                style={{
                  background:
                    selectedRegion === region.region
                      ? 'rgba(239,68,68,0.12)'
                      : 'rgba(255,255,255,0.04)'
                }}
              >
                <div className="section-title">
                  <div>
                    <h3 style={{ marginBottom: 6 }}>{region.region}</h3>
                    <p className="muted" style={{ marginBottom: 0 }}>
                      {region.suppliers.length} proveedores ·{' '}
                      {region.alerts.length} alertas ·{' '}
                      {formatCurrency(region.totalSpend)} expuesto
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      className={`kpi-value ${region.level.color}`}
                      style={{ fontSize: 24 }}
                    >
                      {region.avgRisk}/100
                    </div>
                    <div className="kpi-label">Riesgo {region.level.label}</div>
                  </div>
                </div>

                <div className="grid-4">
                  <div
                    className="card"
                    style={{ background: 'rgba(255,255,255,0.035)' }}
                  >
                    <div className="kpi-label">Resiliencia</div>
                    <div className="kpi-value" style={{ fontSize: 20 }}>
                      {region.avgResilience}/100
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{ background: 'rgba(255,255,255,0.035)' }}
                  >
                    <div className="kpi-label">Alto riesgo</div>
                    <div className="kpi-value text-warning" style={{ fontSize: 20 }}>
                      {region.highRiskSuppliers}
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{ background: 'rgba(255,255,255,0.035)' }}
                  >
                    <div className="kpi-label">Críticos</div>
                    <div className="kpi-value text-danger" style={{ fontSize: 20 }}>
                      {region.criticalSuppliers}
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{ background: 'rgba(255,255,255,0.035)' }}
                  >
                    <div className="kpi-label">Alertas</div>
                    <div className="kpi-value" style={{ fontSize: 20 }}>
                      {region.alerts.length}
                    </div>
                  </div>
                </div>

                <div className="row wrap" style={{ marginTop: 16 }}>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedRegion(region.region)}
                  >
                    <Eye size={16} />
                    Ver región
                  </Button>

                  <Badge>{region.level.label}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Critical Suppliers</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Proveedores de mayor riesgo según la región seleccionada.
              </p>
            </div>

            <ShieldAlert size={20} />
          </div>

          {topRegionSuppliers.length === 0 ? (
            <EmptyState
              title="No hay proveedores"
              description="No hay proveedores para la región seleccionada."
            />
          ) : (
            <div className="stack">
              {topRegionSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <strong>{supplier.name}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplier.country || 'Sin país'} · {supplier.region} ·{' '}
                        {supplier.tier}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        className={`kpi-value ${supplier.riskLevel.color}`}
                        style={{ fontSize: 22 }}
                      >
                        {supplier.riskScore}/100
                      </div>
                      <div className="kpi-label">{supplier.riskLevel.label}</div>
                    </div>
                  </div>

                  <div className="row wrap">
                    <Badge>{supplier.criticality}</Badge>
                    <Badge>{supplier.status}</Badge>
                    <Badge>{formatCurrency(supplier.spend)}</Badge>
                  </div>

                  <div className="row wrap" style={{ marginTop: 16 }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenSupplier(supplier.id)}
                    >
                      <Eye size={16} />
                      Ver proveedor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Geographic Risk Alerts</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Alertas high / critical de la región seleccionada.
              </p>
            </div>

            <AlertTriangle size={20} />
          </div>

          {highSeverityRegionAlerts.length === 0 ? (
            <p className="muted">
              No hay alertas severas en la región seleccionada.
            </p>
          ) : (
            <div className="stack">
              {highSeverityRegionAlerts.map((alert) => {
                const supplier = suppliers.find(
                  (item) => item.id === alert.supplierId
                );

                return (
                  <div
                    key={alert.id}
                    className="card"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="section-title">
                      <div>
                        <strong>{alert.title}</strong>
                        <p className="muted" style={{ marginBottom: 0 }}>
                          {supplier?.name || 'Proveedor no identificado'} ·{' '}
                          {supplier?.region || 'Sin región'} ·{' '}
                          {formatDate(alert.createdAt)}
                        </p>
                      </div>

                      <Badge>{alert.severity}</Badge>
                    </div>

                    <p className="muted" style={{ marginBottom: 0 }}>
                      {alert.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}