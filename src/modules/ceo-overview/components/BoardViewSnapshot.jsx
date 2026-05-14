import React from 'react';

export function BoardViewSnapshot({ boardView = {} }) {
  return (
    <article className="executive-command-card">
      <span className="executive-eyebrow">Board View Snapshot</span>
      <h3>Board-ready posture.</h3>
      <div className="executive-snapshot-grid">
        <div><span>Top risks</span><strong>{(boardView.topRisks || []).length}</strong></div>
        <div><span>Top decisions</span><strong>{(boardView.topDecisions || []).length}</strong></div>
        <div><span>Capital/runway</span><strong>{boardView.capitalRunway ?? 'Insufficient data'}</strong></div>
        <div><span>Compliance</span><strong>{boardView.compliancePosture ?? 'Insufficient data'}</strong></div>
        <div><span>PMI value capture</span><strong>{boardView.pmiValueCapture ?? 'Insufficient data'}</strong></div>
        <div><span>Reporting</span><strong>{boardView.reportingReadiness ?? 'Insufficient data'}</strong></div>
      </div>
    </article>
  );
}

export default BoardViewSnapshot;
