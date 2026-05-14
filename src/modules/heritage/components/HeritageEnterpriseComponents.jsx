import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

export const heritageEnterpriseCss = `
  .heritage-enterprise-page { width: min(1500px, 100%); margin: 0 auto; display: grid; gap: 24px; }
  .heritage-enterprise-hero { display: grid; gap: 14px; padding: 28px; border: 1px solid rgba(212,175,55,0.16); border-radius: 24px; background: linear-gradient(135deg, rgba(15,23,42,0.94), rgba(10,10,12,0.98)); }
  .heritage-enterprise-title { margin: 0; font-size: clamp(30px, 4vw, 52px); line-height: 1; letter-spacing: 0; }
  .heritage-enterprise-copy { max-width: 860px; margin: 0; color: rgba(203,213,225,0.82); line-height: 1.7; }
  .heritage-enterprise-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .heritage-enterprise-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .heritage-enterprise-panel { padding: 18px; border: 1px solid rgba(212,175,55,0.14); border-radius: 18px; background: rgba(15,23,42,0.68); }
  .heritage-enterprise-kpi { display: grid; gap: 8px; }
  .heritage-enterprise-kpi strong { font-size: 30px; line-height: 1; color: #fff; }
  .heritage-enterprise-row { display: grid; grid-template-columns: minmax(160px, 1fr) 120px 120px 120px; gap: 12px; align-items: center; padding: 12px 0; border-top: 1px solid rgba(148,163,184,0.14); }
  .heritage-enterprise-toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
  .heritage-enterprise-field { display: grid; gap: 6px; min-width: 170px; color: rgba(203,213,225,0.78); font-size: 0.78rem; font-weight: 800; text-transform: uppercase; }
  .heritage-enterprise-input, .heritage-enterprise-select { min-height: 40px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.2); background: rgba(15,23,42,0.78); color: rgba(226,232,240,0.94); padding: 8px 10px; }
  .heritage-enterprise-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .heritage-enterprise-button { min-height: 40px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.34); background: rgba(212,175,55,0.14); color: rgba(226,232,240,0.96); font-weight: 850; padding: 8px 12px; cursor: pointer; }
  .heritage-enterprise-button:disabled { opacity: 0.55; cursor: not-allowed; }
  .heritage-enterprise-empty { padding: 22px; border: 1px dashed rgba(148,163,184,0.2); border-radius: 16px; color: rgba(203,213,225,0.78); }
  @media (max-width: 1100px) { .heritage-enterprise-grid, .heritage-enterprise-grid-two { grid-template-columns: 1fr; } .heritage-enterprise-row { grid-template-columns: 1fr; } }
`;

export function HeritageMetricCard({ label, value, detail }) {
  return (
    <Card className="heritage-enterprise-panel heritage-enterprise-kpi">
      <span className="kpi-label">{label}</span>
      <strong>{value}</strong>
      <span className="muted">{detail}</span>
    </Card>
  );
}

export function HeritageStatusBadge({ status }) {
  return <Badge>{String(status || 'watch').replace(/_/g, ' ')}</Badge>;
}

export function HeritageAssetTable({ items = [] }) {
  if (items.length === 0) return <div className="heritage-enterprise-empty">No heritage assets registered.</div>;
  return (
    <Card className="heritage-enterprise-panel">
      {items.map((item) => (
        <div className="heritage-enterprise-row" key={item.id}>
          <strong>{item.name || 'Heritage asset'}</strong>
          <span>{item.assetType || 'Asset'}</span>
          <span>{formatCurrency(item.estimatedValue || 0, 'EUR')}</span>
          <HeritageStatusBadge status={item.riskLevel || item.protectionStatus} />
        </div>
      ))}
    </Card>
  );
}

export function HeritageListPanel({ title, items = [], primary = 'title', secondary = 'status' }) {
  return (
    <Card className="heritage-enterprise-panel">
      <h3>{title}</h3>
      {items.length === 0 ? <div className="heritage-enterprise-empty">No records available.</div> : null}
      {items.map((item) => (
        <div className="heritage-enterprise-row" key={item.id}>
          <strong>{item[primary] || item.name || item.id}</strong>
          <span>{item.owner || 'Owner pending'}</span>
          <span>{item[secondary] || 'active'}</span>
          <HeritageStatusBadge status={item.evidenceStatus || item.status || item.riskLevel} />
        </div>
      ))}
    </Card>
  );
}
