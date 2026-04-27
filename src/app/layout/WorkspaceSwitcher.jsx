import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const workspace = pathname.startsWith('/compliance')
    ? 'compliance'
    : pathname.startsWith('/funding')
      ? 'funding'
      : 'ma';

  return (
    <div className="pill-switch">
      <button type="button" className={workspace === 'ma' ? 'active' : ''} onClick={() => navigate('/ma/dashboard')}>M&A</button>
      <button type="button" className={workspace === 'compliance' ? 'active' : ''} onClick={() => navigate('/compliance/dashboard')}>Compliance</button>
      <button type="button" className={workspace === 'funding' ? 'active' : ''} onClick={() => navigate('/funding/dashboard')}>Funding</button>
    </div>
  );
}
