import React from 'react';

export function ExecutiveCalendarPanel({ items = [] }) {
  const rows = items.length ? items : [{ title: 'Pending enterprise calendar signal', module: 'Executive', priority: 'insufficient_data', itemType: 'critical_deadline' }];
  return (
    <article className="executive-command-card">
      <span className="executive-eyebrow">Executive Calendar</span>
      <h3>Critical deadlines.</h3>
      <div className="executive-list">
        {rows.slice(0, 6).map((item) => (
          <div key={`${item.module}-${item.title}`} className="executive-row">
            <div>
              <strong>{item.title}</strong>
              <p>{item.module} · {item.itemType || 'critical_deadline'}</p>
            </div>
            <span className={`executive-badge executive-${item.priority || 'watch'}`}>{item.dueDate || 'Human review'}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ExecutiveCalendarPanel;
