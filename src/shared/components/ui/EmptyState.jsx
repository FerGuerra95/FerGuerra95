import React from 'react';

export function EmptyState({ title, description }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
