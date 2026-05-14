import React from 'react';

export function DecisionQueuePanel({ decisions = [] }) {
  const items = decisions.length ? decisions : [{ title: 'Pending enterprise decision signal', module: 'Executive', severity: 'insufficient_data', status: 'open', recommendedAction: 'Insufficient data' }];
  return (
    <article className="executive-command-card">
      <span className="executive-eyebrow">Decision Queue</span>
      <h3>Prioritized executive decisions.</h3>
      <div className="executive-list">
        {items.slice(0, 6).map((decision) => (
          <div key={`${decision.module}-${decision.title}`} className="executive-row">
            <div>
              <strong>{decision.title}</strong>
              <p>{decision.module} · {decision.recommendedAction}</p>
            </div>
            <span className={`executive-badge executive-${decision.severity || 'watch'}`}>{decision.status || 'open'}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DecisionQueuePanel;
