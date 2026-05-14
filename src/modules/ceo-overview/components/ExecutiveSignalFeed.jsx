import React from 'react';

export function ExecutiveSignalFeed({ signals = [] }) {
  const items = signals.length ? signals : [{ module: 'Executive', severity: 'insufficient_data', title: 'Pending enterprise signal', recommendedAction: 'Refresh executive overview.', status: 'open', humanReviewRequired: true }];
  return (
    <article className="executive-command-card">
      <span className="executive-eyebrow">Executive Signal Feed</span>
      <h3>Signals requiring judgment.</h3>
      <div className="executive-list">
        {items.slice(0, 6).map((signal) => (
          <div key={`${signal.module}-${signal.title}`} className="executive-row">
            <div>
              <strong>{signal.title}</strong>
              <p>{signal.module} · {signal.recommendedAction}</p>
            </div>
            <span className={`executive-badge executive-${signal.severity || 'watch'}`}>{signal.severity || 'watch'}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ExecutiveSignalFeed;
