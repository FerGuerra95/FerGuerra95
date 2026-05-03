import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../layout/AppShell.jsx';
import { ProtectedRoute } from '../layout/ProtectedRoute.jsx';
import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';

import { MAStoreProvider } from '../../modules/ma/store/maStore.jsx';
import { ComplianceStoreProvider } from '../../modules/compliance/store/complianceStore.js';
import { FundingStoreProvider } from '../../modules/funding/store/fundingStore.jsx';
import { PMIStoreProvider } from '../../modules/pmi/store/pmiStore.jsx';

import { CEOOverviewPage } from '../../modules/ceo-overview/pages/CEOOverviewPage.jsx';

import { MADashboardPage } from '../../modules/ma/pages/MADashboardPage.jsx';
import { ValuationPage } from '../../modules/ma/pages/ValuationPage.jsx';
import { DealPipelinePage } from '../../modules/ma/pages/DealPipelinePage.jsx';
import { DealDetailPage } from '../../modules/ma/pages/DealDetailPage.jsx';
import { WaterfallPage } from '../../modules/ma/pages/WaterfallPage.jsx';
import { BuyerMatchingPage } from '../../modules/ma/pages/BuyerMatchingPage.jsx';
import { CIMPage } from '../../modules/ma/pages/CIMPage.jsx';
import { DealsRepositoryPage } from '../../modules/ma/pages/DealsRepositoryPage.jsx';

import { ComplianceDashboardPage } from '../../modules/compliance/pages/ComplianceDashboardPage.jsx';
import { SuppliersPage } from '../../modules/compliance/pages/SuppliersPage.jsx';
import { SupplierDetailPage } from '../../modules/compliance/pages/SupplierDetailPage.jsx';
import { RiskMapPage } from '../../modules/compliance/pages/RiskMapPage.jsx';
import { AlertsPage } from '../../modules/compliance/pages/AlertsPage.jsx';
import { EvidencePage } from '../../modules/compliance/pages/EvidencePage.jsx';
import { ReviewsPage } from '../../modules/compliance/pages/ReviewsPage.jsx';
import { ComplianceReportPage } from '../../modules/compliance/pages/ComplianceReportPage.jsx';

import { FundingDashboardPage } from '../../modules/funding/pages/FundingDashboardPage.jsx';
import { InvestorReadinessPage } from '../../modules/funding/pages/InvestorReadinessPage.jsx';
import { CapitalStructurePage } from '../../modules/funding/pages/CapitalStructurePage.jsx';
import { FundraisingScenariosPage } from '../../modules/funding/pages/FundraisingScenariosPage.jsx';
import { DataRoomPage } from '../../modules/funding/pages/DataRoomPage.jsx';
import { PMIDashboardPage } from '../../modules/pmi/pages/PMIDashboardPage.jsx';

function ProtectedAppShell() {
  return (
    <ProtectedRoute>
      <MAStoreProvider>
        <ComplianceStoreProvider>
          <FundingStoreProvider>
            <PMIStoreProvider>
              <AppShell />
            </PMIStoreProvider>
          </FundingStoreProvider>
        </ComplianceStoreProvider>
      </MAStoreProvider>
    </ProtectedRoute>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedAppShell />}>
        <Route path="/overview" element={<CEOOverviewPage />} />
        <Route path="/ceo/overview" element={<CEOOverviewPage />} />`r`n        <Route path="/pmi/dashboard" element={<PMIDashboardPage />} />

        <Route path="/ma/dashboard" element={<MADashboardPage />} />
        <Route path="/ma/valuation" element={<ValuationPage />} />
        <Route path="/ma/pipeline" element={<DealPipelinePage />} />
        <Route path="/ma/deal/:dealId" element={<DealDetailPage />} />
        <Route path="/ma/waterfall" element={<WaterfallPage />} />
        <Route path="/ma/matching" element={<BuyerMatchingPage />} />
        <Route path="/ma/cim" element={<CIMPage />} />
        <Route path="/ma/deals" element={<DealsRepositoryPage />} />

        <Route
          path="/compliance/dashboard"
          element={<ComplianceDashboardPage />}
        />
        <Route
          path="/compliance/suppliers"
          element={<SuppliersPage />}
        />
        <Route
          path="/compliance/suppliers/:id"
          element={<SupplierDetailPage />}
        />
        <Route
          path="/compliance/risk-map"
          element={<RiskMapPage />}
        />
        <Route
          path="/compliance/alerts"
          element={<AlertsPage />}
        />
        <Route
          path="/compliance/evidence"
          element={<EvidencePage />}
        />
        <Route
          path="/compliance/reviews"
          element={<ReviewsPage />}
        />
        <Route
          path="/compliance/reports"
          element={<ComplianceReportPage />}
        />

        <Route
          path="/funding/dashboard"
          element={<FundingDashboardPage />}
        />
        <Route
          path="/funding/readiness"
          element={<InvestorReadinessPage />}
        />
        <Route
          path="/funding/capital-structure"
          element={<CapitalStructurePage />}
        />
        <Route
          path="/funding/scenarios"
          element={<FundraisingScenariosPage />}
        />
        <Route
          path="/funding/data-room"
          element={<DataRoomPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

