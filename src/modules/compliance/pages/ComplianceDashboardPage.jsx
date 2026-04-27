import React from 'react';
import { AlertTriangle, FileSearch, ShieldCheck, Users } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

function DashboardMetric({ icon, label, value, helper }) {
  return (
    <Card>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-value">{value}</div>
          <p className="muted" style={{ marginBottom: 0 }}>{helper}</p>
        </div>
        <div className="badge">{icon}</div>
      </div>
    </Card>
  );
}

export function ComplianceDashboardPage() {
  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  } = useComplianceStore();

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Supply Chain Compliance</h2>
            <p className="muted">
              Vista ejecutiva de proveedores, alertas, evidencias y revisiones humanas.
            </p>
          </div>
          <Badge>Compliance MVP</Badge>
        </div>
      </Card>

      <div className="grid-4">
        <DashboardMetric
          icon={<Users size={18} />}
          label="Proveedores"
          value={engine.dashboardCards[0]?.value ?? suppliers.length}
          helper="Total monitorizado"
        />
        <DashboardMetric
          icon={<ShieldCheck size={18} />}
          label="Riesgo medio"
          value={engine.dashboardCards[1]?.value ?? '0/100'}
          helper="Score agregado"
        />
        <DashboardMetric
          icon={<AlertTriangle size={18} />}
          label="Alertas abiertas"
          value={engine.dashboardCards[2]?.value ?? 0}
          helper="Open + in review"
        />
        <DashboardMetric
          icon={<FileSearch size={18} />}
          label="Evidencia"
          value={engine.dashboardCards[3]?.value ?? '0%'}
          helper="Cobertura documental"
        />
      </div>

      <div className="grid-2">
        <Card>
          <h3>Top proveedores por riesgo</h3>
          <div className="stack">
            {engine.topRiskSuppliers.length === 0 ? (
              <p className="muted">No hay proveedores registrados.</p>
            ) : (
              engine.topRiskSuppliers.map((supplier) => (
                <div key={supplier.id} className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="section-title">
                    <div>
                      <strong>{supplier.name}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplier.country} · {supplier.tier} · {supplier.criticality}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className={`kpi-value ${supplier.riskLevel.color}`} style={{ fontSize: 22 }}>
                        {supplier.riskScore}/100
                      </div>
                      <div className="kpi-label">{supplier.riskLevel.label}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3>Últimas alertas</h3>
          <div className="stack">
            {engine.latestAlerts.length === 0 ? (
              <p className="muted">No hay alertas registradas.</p>
            ) : (
              engine.latestAlerts.map((alert) => (
                <div key={alert.id} className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="section-title">
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {alert.category} · {alert.source}
                      </p>
                    </div>
                    <Badge>{alert.severity}</Badge>
                  </div>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {alert.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}