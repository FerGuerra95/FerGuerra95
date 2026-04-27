import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

function statusColor(status) {
  if (status === 'ok') return 'text-success';
  if (status === 'attention') return 'text-warning';
  return 'text-danger';
}

export function ReadinessChecklistCard({ readinessChecklist = [] }) {
  return (
    <Card>
      <h3>Investor readiness checklist</h3>
      <div className="stack">
        {readinessChecklist.map((item) => (
          <div key={item.label} className="card" style={{ padding: 14, background: 'rgba(255,255,255,0.04)' }}>
            <div className="section-title">
              <strong>{item.label}</strong>
              <span className={statusColor(item.status)}>{item.status.toUpperCase()}</span>
            </div>
            <p className="muted" style={{ marginBottom: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
