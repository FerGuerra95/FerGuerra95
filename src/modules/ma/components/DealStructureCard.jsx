import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

function DealRow({ label, value, color }) {
  return (
    <div className="deal-row">
      <div className="deal-row-head"><span>{label}</span><span>{value}%</span></div>
      <div className="deal-row-bar"><span style={{ width: `${value}%`, background: color }} /></div>
    </div>
  );
}

export function DealStructureCard({ derived }) {
  return (
    <Card>
      <h3>Estructura de cierre</h3>
      <div className="stack">
        <DealRow label="Upfront Cash" value={derived.cashAtClosing} color="#10b981" />
        <DealRow label="Earn-out" value={derived.earnOut} color="#3b82f6" />
        <DealRow label="Escrow Legal" value={derived.escrow} color="#64748b" />
      </div>
    </Card>
  );
}
