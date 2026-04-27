import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

export function ComparablesGrid({ comparables }) {
  return (
    <div className="grid-3">
      {comparables.map((item) => (
        <Card key={item.name}>
          <div className="kpi-label">Comparable</div>
          <h3>{item.name}</h3>
          <div className="kpi-value text-success" style={{ fontSize: 30 }}>x{item.multiple.toFixed(2)}</div>
          <p className="muted">{item.note}</p>
        </Card>
      ))}
    </div>
  );
}
