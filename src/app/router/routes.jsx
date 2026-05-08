import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../layout/AppShell.jsx';
import { ProtectedRoute } from '../layout/ProtectedRoute.jsx';

import { MAStoreProvider } from '../../modules/ma/store/maStore.jsx';
import { ComplianceStoreProvider } from '../../modules/compliance/store/complianceStore.js';
import { FundingStoreProvider } from '../../modules/funding/store/fundingStore.jsx';
import { PMIStoreProvider } from '../../modules/pmi/store/pmiStore.jsx';

function lazyNamed(importer, exportName) {
  return lazy(() =>
    importer().then((module) => ({
      default: module[exportName]
    }))
  );
}

const LandingPage = lazyNamed(() => import('../pages/LandingPage.jsx'), 'LandingPage');
const LoginPage = lazyNamed(() => import('../pages/LoginPage.jsx'), 'LoginPage');

const ExecutiveOverviewer = lazyNamed(
  () => import('../../modules/ceo-overview/pages/ExecutiveOverviewer.jsx'),
  'ExecutiveOverviewer'
);

const MADashboardPage = lazyNamed(
  () => import('../../modules/ma/pages/MADashboardPage.jsx'),
  'MADashboardPage'
);
const ValuationPage = lazyNamed(
  () => import('../../modules/ma/pages/ValuationPage.jsx'),
  'ValuationPage'
);
const DealPipelinePage = lazyNamed(
  () => import('../../modules/ma/pages/DealPipelinePage.jsx'),
  'DealPipelinePage'
);
const DealDetailPage = lazyNamed(
  () => import('../../modules/ma/pages/DealDetailPage.jsx'),
  'DealDetailPage'
);
const WaterfallPage = lazyNamed(
  () => import('../../modules/ma/pages/WaterfallPage.jsx'),
  'WaterfallPage'
);
const BuyerMatchingPage = lazyNamed(
  () => import('../../modules/ma/pages/BuyerMatchingPage.jsx'),
  'BuyerMatchingPage'
);
const CIMPage = lazyNamed(
  () => import('../../modules/ma/pages/CIMPage.jsx'),
  'CIMPage'
);
const DealsRepositoryPage = lazyNamed(
  () => import('../../modules/ma/pages/DealsRepositoryPage.jsx'),
  'DealsRepositoryPage'
);
const MADataRoomPage = lazyNamed(
  () => import('../../modules/ma/pages/MADataRoomPage.jsx'),
  'MADataRoomPage'
);
const SecureShareViewerPage = lazyNamed(
  () => import('../../modules/ma/pages/SecureShareViewerPage.jsx'),
  'SecureShareViewerPage'
);

const ComplianceDashboardPage = lazyNamed(
  () => import('../../modules/compliance/pages/ComplianceDashboardPage.jsx'),
  'ComplianceDashboardPage'
);
const ComplianceAuditDetail = lazyNamed(
  () => import('../../modules/compliance/pages/ComplianceAuditDetail.jsx'),
  'ComplianceAuditDetail'
);
const SuppliersPage = lazyNamed(
  () => import('../../modules/compliance/pages/SuppliersPage.jsx'),
  'SuppliersPage'
);
const SupplierDetailPage = lazyNamed(
  () => import('../../modules/compliance/pages/SupplierDetailPage.jsx'),
  'SupplierDetailPage'
);
const RiskMapPage = lazyNamed(
  () => import('../../modules/compliance/pages/RiskMapPage.jsx'),
  'RiskMapPage'
);
const AlertsPage = lazyNamed(
  () => import('../../modules/compliance/pages/AlertsPage.jsx'),
  'AlertsPage'
);
const EvidencePage = lazyNamed(
  () => import('../../modules/compliance/pages/EvidencePage.jsx'),
  'EvidencePage'
);
const ReviewsPage = lazyNamed(
  () => import('../../modules/compliance/pages/ReviewsPage.jsx'),
  'ReviewsPage'
);
const ComplianceReportPage = lazyNamed(
  () => import('../../modules/compliance/pages/ComplianceReportPage.jsx'),
  'ComplianceReportPage'
);

const FundingDashboardPage = lazyNamed(
  () => import('../../modules/funding/pages/FundingDashboardPage.jsx'),
  'FundingDashboardPage'
);
const InvestorReadinessPage = lazyNamed(
  () => import('../../modules/funding/pages/InvestorReadinessPage.jsx'),
  'InvestorReadinessPage'
);
const CapitalStructurePage = lazyNamed(
  () => import('../../modules/funding/pages/CapitalStructurePage.jsx'),
  'CapitalStructurePage'
);
const FundraisingScenariosPage = lazyNamed(
  () => import('../../modules/funding/pages/FundraisingScenariosPage.jsx'),
  'FundraisingScenariosPage'
);
const DataRoomPage = lazyNamed(
  () => import('../../modules/funding/pages/DataRoomPage.jsx'),
  'DataRoomPage'
);

const PMIDashboardPage = lazyNamed(
  () => import('../../modules/pmi/pages/PMIDashboardPage.jsx'),
  'PMIDashboardPage'
);
const GovernanceESGPage = lazyNamed(
  () => import('../../modules/ecosystem/pages/GovernanceESGPage.jsx'),
  'GovernanceESGPage'
);
const HeritageLegacyPage = lazyNamed(
  () => import('../../modules/ecosystem/pages/HeritageLegacyPage.jsx'),
  'HeritageLegacyPage'
);
const BridgeMarketplacePage = lazyNamed(
  () => import('../../modules/ecosystem/pages/BridgeMarketplacePage.jsx'),
  'BridgeMarketplacePage'
);

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f8fafc',
        color: '#334155',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0,
        textTransform: 'uppercase'
      }}
    >
      Loading executive workspace
    </div>
  );
}

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
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedAppShell />}>
          <Route path="/dashboard" element={<ExecutiveOverviewer />} />
          <Route path="/overview" element={<ExecutiveOverviewer />} />
          <Route path="/ceo/overview" element={<ExecutiveOverviewer />} />

          <Route path="/ma/dashboard" element={<MADashboardPage />} />
          <Route path="/ma/valuation" element={<ValuationPage />} />
          <Route path="/ma/pipeline" element={<DealPipelinePage />} />
          <Route path="/ma/deal/:dealId" element={<DealDetailPage />} />
          <Route path="/ma/waterfall" element={<WaterfallPage />} />
          <Route path="/ma/matching" element={<BuyerMatchingPage />} />
          <Route path="/ma/cim" element={<CIMPage />} />
          <Route path="/ma/deals" element={<DealsRepositoryPage />} />
          <Route path="/ma/data-room" element={<MADataRoomPage />} />
          <Route path="/ma/secure-share" element={<SecureShareViewerPage />} />

          <Route
            path="/compliance/dashboard"
            element={<ComplianceDashboardPage />}
          />
          <Route
            path="/compliance/audit-runs"
            element={<ComplianceAuditDetail />}
          />
          <Route
            path="/compliance/audit-runs/:id"
            element={<ComplianceAuditDetail />}
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

          <Route
            path="/pmi/dashboard"
            element={<PMIDashboardPage />}
          />

          <Route
            path="/governance/dashboard"
            element={<GovernanceESGPage />}
          />

          <Route
            path="/heritage/dashboard"
            element={<HeritageLegacyPage />}
          />

          <Route
            path="/bridge/dashboard"
            element={<BridgeMarketplacePage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
