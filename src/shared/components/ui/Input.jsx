import React from 'react';

export function Input({ label, className = '', ...props }) {
  return (
    <div className={`field ${className}`.trim()}>
      {label ? <label>{label}</label> : null}
      <input className="input" {...props} />
    </div>
  );
}
