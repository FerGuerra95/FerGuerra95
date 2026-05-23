// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  BridgeMarketplacePage,
  isBridgeMarketplaceEnabled
} from '../../../src/modules/ecosystem/pages/BridgeMarketplacePage.jsx';
import { bridgeApi } from '../../../src/modules/ecosystem/services/bridgeApi.js';

vi.mock('../../../src/app/providers/AuthProvider.jsx', () => ({
  useAuth: () => ({
    PERMISSIONS: { MANAGE_ECOSYSTEM_BRANCH: 'manage:ecosystem_branch' },
    can: () => false
  })
}));

vi.mock('../../../src/modules/ecosystem/services/bridgeApi.js', () => ({
  bridgeApi: {
    listOpportunities: vi.fn().mockResolvedValue([]),
    listCounterparties: vi.fn().mockResolvedValue([]),
    listDocuments: vi.fn().mockResolvedValue([]),
    listReports: vi.fn().mockResolvedValue([]),
    createOpportunity: vi.fn(),
    createCounterparty: vi.fn(),
    createIntroduction: vi.fn(),
    createDocument: vi.fn(),
    generateReport: vi.fn(),
    updateOpportunity: vi.fn(),
    deleteOpportunity: vi.fn()
  }
}));

vi.mock('../../../src/modules/ma/services/maDealsApi.js', () => ({
  maDealsApi: {
    list: vi.fn().mockResolvedValue([])
  }
}));

vi.mock('../../../src/modules/funding/services/fundingEnterpriseApi.js', () => ({
  fundingEnterpriseApi: {
    listFundingRounds: vi.fn().mockResolvedValue([])
  }
}));

function renderMarketplacePage() {
  return render(
    React.createElement(MemoryRouter, null, React.createElement(BridgeMarketplacePage))
  );
}

describe('BridgeMarketplacePage quarantine guard', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENABLE_BRIDGE_MARKETPLACE', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('isBridgeMarketplaceEnabled is false without flag in non-development mode', () => {
    expect(isBridgeMarketplaceEnabled()).toBe(import.meta.env.MODE === 'development');
  });

  it('shows quarantine state when marketplace flag is disabled', () => {
    renderMarketplacePage();

    expect(screen.getByText(/Bridge Marketplace is quarantined/i)).toBeTruthy();
    expect(screen.getByText(/Back to Bridge dashboard/i)).toBeTruthy();
    expect(screen.queryByText(/Bridge Marketplace Preview/i)).toBeNull();
    expect(bridgeApi.listOpportunities).not.toHaveBeenCalled();
    expect(bridgeApi.listCounterparties).not.toHaveBeenCalled();
  });

  it('isBridgeMarketplaceEnabled is true when VITE_ENABLE_BRIDGE_MARKETPLACE is true', () => {
    vi.stubEnv('VITE_ENABLE_BRIDGE_MARKETPLACE', 'true');
    expect(isBridgeMarketplaceEnabled()).toBe(true);
  });
});
