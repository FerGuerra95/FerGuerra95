import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

export function DataRoomChecklist({ items = [] }) {
  return (
    <Card>
      <h3>Data room checklist</h3>
      <div className="stack">
        {items.map((section) => (
          <div key={section.category} className="card" style={{ padding: 14, background: 'rgba(255,255,255,0.04)' }}>
            <div className="section-title">
              <strong>{section.category}</strong>
              <span className={section.status === 'ready' ? 'text-success' : 'text-warning'}>{section.status === 'ready' ? 'READY' : 'MISSING'}</span>
            </div>
            <ul className="list-compact">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
