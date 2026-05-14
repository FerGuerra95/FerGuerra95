import React from 'react';

export function ExecutiveAlertsPanel({ alerts = [] }) {
  const items = alerts.length ? alerts : [{ module: 'Executive', status: 'normal', title: 'No critical executive alerts', recommendedAction: 'Maintain monitoring cadence.' }];
  return (
    <article className="executive-command-card">
      <span className="executive-eyebrow">Executive Alerts</span>
      <h3>Attention classification.</h3>
      <div className="executive-list">
        {items.slice(0, 5).map((alert) => (
          <div key={`${alert.module}-${alert.title}`} className="executive-row">
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.module} · {alert.recommendedAction}</p>
            </div>
            <span className={`executive-badge executive-${alert.status || 'watch'}`}>{alert.status || 'watch'}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ExecutiveAlertsPanel;
