import React from 'react';

export function Input({ label, className = '', ...props }) {
  const isNumericCapsule = className
    .split(/\s+/)
    .filter(Boolean)
    .includes('ma-fb-numeric-capsule');

  return (
    <div className={`field ${className}`.trim()}>
      {label ? <label>{label}</label> : null}
      {isNumericCapsule ? (
        <div className="ma-fb-numeric-capsule-surface">
          <input className="input" {...props} />
        </div>
      ) : (
        <input className="input" {...props} />
      )}
    </div>
  );
}
