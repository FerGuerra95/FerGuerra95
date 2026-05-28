import React from 'react';

export function ReadinessIndexCard({ readiness = {} }) {
  const parsed = Number(readiness.score);
  const hasScore = Number.isFinite(parsed);
  const scoreLabel = hasScore ? `${Math.round(parsed)}/100` : 'N/A';
  const progressWidth = hasScore ? Math.max(0, Math.min(100, Math.round(parsed))) : 0;

  return (
    <article className="executive-command-card executive-readiness-card">
      <div>
        <span className="executive-eyebrow">Executive Readiness Index</span>
        <h3>{scoreLabel}</h3>
      </div>
      <p>
        Trend {readiness.trend || 'stable'} · Confidence {readiness.confidence ?? 0}% · Human review required.
      </p>
      <div className="executive-progress">
        <span style={{ width: hasScore ? `${progressWidth}%` : '0%' }} />
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
