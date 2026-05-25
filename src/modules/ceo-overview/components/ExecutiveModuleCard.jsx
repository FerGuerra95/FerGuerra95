import React from 'react';
import { Link } from 'react-router-dom';

export function ExecutiveModuleCard({ card = {} }) {
  return (
    <article className="executive-module-card">
      <div>
        <span className={`executive-badge executive-${card.status || 'insufficient_data'}`}>
          {card.status || 'insufficient_data'}
        </span>
        <h4>{card.title}</h4>
      </div>
      <strong>{card.score === null || card.score === undefined ? 'N/A' : `${card.score}/100`}</strong>
      <p>{card.keyMetric || 'Insufficient data'} · {card.humanReviewRequired ? 'Human review required' : 'Review complete'}</p>
      <Link to={card.route || '/dashboard'}>{card.cta || 'Open module'}</Link>
    </article>
  );
}

export default ExecutiveModuleCard;
