import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders.jsx';
import { AppRoutes } from './app/router/routes.jsx';
import { AppErrorBoundary } from './app/layout/AppErrorBoundary.jsx';
import './styles.css';
import './modules/ma/styles/maExecutiveTheme.css';
import './styles/executivePolish.css';
import './styles/workspaceAccent.css';
import './modules/ma/styles/maValuationMaterial.css';
import './modules/ma/styles/maDashboardMaterial.css';
import './modules/ma/styles/maReferenceSurfaces.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppErrorBoundary>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </AppErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
