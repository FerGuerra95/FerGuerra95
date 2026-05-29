import React from 'react';
import { Link } from 'react-router-dom';

function clamp(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

export function CorporateHealthRadar({ axes = [], className = '' }) {
  const safeAxes = axes.length ? axes : [];
  return (
    <div className={`executive-radar-panel ${className}`.trim()}>
      <svg viewBox="0 0 220 220" role="img" aria-label="Corporate health radar">
        <circle cx="110" cy="110" r="84" className="executive-radar-grid" />
        <circle cx="110" cy="110" r="56" className="executive-radar-grid" />
        <circle cx="110" cy="110" r="28" className="executive-radar-grid" />
        {safeAxes.map((axis, index) => {
          const angle = -Math.PI / 2 + (index / safeAxes.length) * Math.PI * 2;
          const axisX = 110 + Math.cos(angle) * 94;
          const axisY = 110 + Math.sin(angle) * 94;
          return <line key={axis.key} x1="110" y1="110" x2={axisX} y2={axisY} className="executive-radar-axis" />;
        })}
        <polygon
          className="executive-radar-fill"
          points={safeAxes
            .map((axis, index) => {
              const angle = -Math.PI / 2 + (index / safeAxes.length) * Math.PI * 2;
              const calculable = axis.isCalculable !== false && axis.value !== null && axis.value !== undefined;
              const radius = calculable ? 84 * (clamp(axis.value) / 100) : 0;
              return `${110 + Math.cos(angle) * radius},${110 + Math.sin(angle) * radius}`;
            })
            .join(' ')}
        />
      </svg>
      <div className="executive-radar-list">
        {safeAxes.map((axis) => (
          <Link key={axis.key} to={axis.route || '/dashboard'}>
            <span>{axis.label}</span>
            <strong>
              {axis.displayLabel ||
                (axis.value === null || axis.value === undefined
                  ? 'N/A'
                  : `${clamp(axis.value)}%`)}
            </strong>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CorporateHealthRadar;
