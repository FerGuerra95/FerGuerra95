import React from 'react';
import { ProgressBar } from '../ui/ProgressBar.jsx';

export function LoadingScreen({ label = 'Procesando', value = 45 }) {
  return (
    <div className="empty">
      <h3>{label}</h3>
      <div style={{ maxWidth: 460, margin: '18px auto 0' }}>
        <ProgressBar label={label} value={value} />
      </div>
    </div>
  );
}
