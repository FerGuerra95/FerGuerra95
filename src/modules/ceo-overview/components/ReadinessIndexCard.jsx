import React from 'react';

export function ReadinessIndexCard({ readiness = {} }) {
  const score = Number.isFinite(Number(readiness.score)) ? Math.round(Number(readiness.score)) : 0;
  return (
    <article className="executive-command-card executive-readiness-card">
      <div>
        <span className="executive-eyebrow">Executive Readiness Index</span>
        <h3>{score}/100</h3>
      </div>
      <p>
        Trend {readiness.trend || 'stable'} · Confidence {readiness.confidence ?? 0}% · Human review required.
      </p>
      <div className="executive-progress">
        <span style={{ width: `${score}%` }} />
      </div>
      <small>
        {(readiness.missingData || []).length
          ? `Missing data: ${(readiness.missingData || []).join(', ')}`
          : 'Data completeness sufficient for executive review.'}
      </small>
    </article>
  );
}

export default ReadinessIndexCard;
