import React from 'react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

export function Topbar({ title, description, actions = null }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="row wrap" style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
        <WorkspaceSwitcher />
        {actions}
        <div className="badge">Hola, {user.name}</div>
      </div>
    </header>
  );
}
