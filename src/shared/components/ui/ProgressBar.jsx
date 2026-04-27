import React from 'react';

export function ProgressBar({ label, value }) {
  return (
    <div className="progress-wrap">
      <div className="progress-head">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
