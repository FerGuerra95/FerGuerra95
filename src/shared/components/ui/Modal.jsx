import React from 'react';
import { Button } from './Button.jsx';

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="section-title">
          <h3>{title}</h3>
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </div>
  );
}
