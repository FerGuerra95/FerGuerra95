import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders.jsx';
import { AppRoutes } from './app/router/routes.jsx';
import './styles.css';
import './modules/ma/styles/maExecutiveTheme.css';
import './styles/executivePolish.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
