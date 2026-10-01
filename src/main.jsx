import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders.jsx';
import { AppRoutes } from './app/router/routes.jsx';
import { AppErrorBoundary } from './app/layout/AppErrorBoundary.jsx';
import './styles.css';
import './modules/ma/styles/maExecutiveTheme.css';
import './modules/ma/styles/maExecutivePremiumLegacy.css';
import './styles/executivePolish.css';
import './styles/workspaceAccent.css';
import './modules/ma/styles/maDashboardMaterial.css';
import './modules/ma/styles/maReferenceSurfaces.css';
import './modules/ma/styles/maButtonSystem.css';
import './modules/ma/styles/maMnaSurfaceSystem.css';
import './modules/ma/styles/maPipelineMaterial.css';
import './modules/ma/styles/maPipelineOrchestrationEffect.css';
import './modules/ma/styles/maRepositoryMaterial.css';
import './modules/ma/styles/maRepositoryArchiveEffect.css';
import './modules/ma/styles/maScoreRing.css';
import './modules/ma/styles/maDataRoomMaterial.css';
import './modules/ma/styles/maDataRoomCorridorEffect.css';
import './modules/ma/styles/maMnaBranchGeometry.css';
import './modules/ma/styles/maMnaInternalAlignment.css';
import './modules/ma/styles/maMnaHeroAlignment.css';
import './styles/ceosPageGeometry.css';
import './styles/ceosHeroGeometry.css';
/* F4.1: Valuation Material is the sole Valuation cascade owner (Parity retired). */
import './modules/ma/styles/maValuationMaterial.css';

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
