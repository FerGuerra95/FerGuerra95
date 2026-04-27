import React from 'react';

export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className={`field ${className}`.trim()}>
      {label ? <label>{label}</label> : null}
      <select className="select" {...props}>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const text = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
