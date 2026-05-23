import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

import {
  DEFAULT_FUNDING_SETTINGS,
  FUNDING_STORAGE_KEYS
} from '../../../src/modules/funding/engine/fundingFormulas.js';
import { fundingApi } from '../../../src/modules/funding/services/fundingApi.js';

const FUNDING_ORG_STORAGE_PREFIX = 'funding_draft_by_org_v1';
const FUNDING_STORE_PATH = path.join(
  process.cwd(),
  'src/modules/funding/store/fundingStore.jsx'
);
const FUNDING_DASHBOARD_PATH = path.join(
  process.cwd(),
  'src/modules/funding/pages/FundingDashboardPage.jsx'
);

let authUser = { id: 'u_test', organizationId: 'org_test' };

vi.mock('../../../src/app/providers/AuthProvider.jsx', () => ({
  useAuth: () => ({ user: authUser })
}));

import {
  FundingStoreProvider,
  useFundingStore
} from '../../../src/modules/funding/store/fundingStore.jsx';

function getOrganizationStorageKey(organizationId) {
  return `${FUNDING_ORG_STORAGE_PREFIX}_${organizationId}`;
}

function StoreProbe() {
  const { fundingInputs, organizationId } = useFundingStore();

  return React.createElement(
    'div',
    null,
    React.createElement('span', { 'data-testid': 'org-id' }, organizationId),
    React.createElement(
      'span',
      { 'data-testid': 'company-name' },
      fundingInputs.companyName
    )
  );
}

function renderFundingStoreProbe() {
  return render(
    React.createElement(
      FundingStoreProvider,
      null,
      React.createElement(StoreProbe, null)
    )
  );
}

describe('funding draft localStorage conventions (C.13.3H)', () => {
  beforeEach(() => {
    localStorage.clear();
    authUser = { id: 'u_test', organizationId: 'org_test' };
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('uses org-scoped storage key pattern funding_draft_by_org_v1_{organizationId}', () => {
    const orgA = 'org_alpha';
    const orgB = 'org_beta';

    expect(getOrganizationStorageKey(orgA)).toBe('funding_draft_by_org_v1_org_alpha');
    expect(getOrganizationStorageKey(orgB)).toBe('funding_draft_by_org_v1_org_beta');
    expect(getOrganizationStorageKey(orgA)).not.toBe(getOrganizationStorageKey(orgB));
  });

  it('keeps fundingStore org prefix aligned with documented convention', () => {
    const source = fs.readFileSync(FUNDING_STORE_PATH, 'utf8');

    expect(source).toContain(`const FUNDING_ORG_STORAGE_PREFIX = '${FUNDING_ORG_STORAGE_PREFIX}'`);
    expect(source).toContain('getOrganizationStorageKey(organizationId)');
    expect(source).toContain('fundingApi.loadDraft');
  });

  it('documents legacy global keys separate from org-scoped draft', () => {
    expect(FUNDING_STORAGE_KEYS.DRAFT).toBe('funding_workspace_draft_v1');
    expect(FUNDING_STORAGE_KEYS.SETTINGS).toBe('funding_workspace_settings_v1');
    expect(FUNDING_STORAGE_KEYS.DRAFT).not.toContain('funding_draft_by_org_v1');
  });

  it('fundingApi legacy save/load uses global keys only (fallback path)', () => {
    fundingApi.saveDraft(
      { companyName: 'Legacy Draft Co', targetRaise: '1000000' },
      { reportCurrency: 'USD', scenarioMode: 'balanced' }
    );

    expect(localStorage.getItem(FUNDING_STORAGE_KEYS.DRAFT)).toContain('Legacy Draft Co');
    expect(localStorage.getItem(FUNDING_STORAGE_KEYS.SETTINGS)).toContain('USD');

    const loaded = fundingApi.loadDraft();
    expect(loaded.fundingInputs.companyName).toBe('Legacy Draft Co');
    expect(loaded.fundingSettings.reportCurrency).toBe('USD');
  });

  it('org-scoped draft payload is distinct from legacy global keys', () => {
    const orgKey = getOrganizationStorageKey('org_test');
    const draftPayload = {
      fundingInputs: { companyName: 'Org Scoped Co' },
      fundingSettings: { reportCurrency: 'EUR', scenarioMode: 'balanced' },
      organizationId: 'org_test',
      updatedAt: '2026-05-23T00:00:00.000Z'
    };

    localStorage.setItem(orgKey, JSON.stringify(draftPayload));

    expect(localStorage.getItem(orgKey)).toContain('Org Scoped Co');
    expect(localStorage.getItem(FUNDING_STORAGE_KEYS.DRAFT)).toBeNull();
  });

  it('draft workspace localStorage is not the enterprise rounds table', () => {
    const source = fs.readFileSync(FUNDING_STORE_PATH, 'utf8');

    expect(source).not.toContain('funding_rounds');
    expect(source).toContain('localStorage');
    expect(source).toContain('safeWriteOrganizationDraft');
  });
});

describe('funding store legacy migration and org isolation (C.13.3I)', () => {
  beforeEach(() => {
    localStorage.clear();
    authUser = { id: 'u_a', organizationId: 'org_a' };
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('hydrates org-scoped draft from legacy global when org key is missing', async () => {
    fundingApi.saveDraft(
      { companyName: 'Shared Legacy Workspace' },
      { reportCurrency: 'GBP', scenarioMode: 'balanced' }
    );

    authUser = { id: 'u_first', organizationId: 'org_first_login' };

    renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Shared Legacy Workspace');
    });

    const orgKey = getOrganizationStorageKey('org_first_login');
    expect(localStorage.getItem(orgKey)).toContain('Shared Legacy Workspace');
  });

  it('documents cross-org risk: legacy global keys remain after org hydration', async () => {
    fundingApi.saveDraft({ companyName: 'Still In Global Bucket' }, DEFAULT_FUNDING_SETTINGS);

    authUser = { id: 'u_hydrate', organizationId: 'org_hydrate' };

    renderFundingStoreProbe();

    await waitFor(() => {
      expect(localStorage.getItem(getOrganizationStorageKey('org_hydrate'))).toBeTruthy();
    });

    expect(localStorage.getItem(FUNDING_STORAGE_KEYS.DRAFT)).toContain('Still In Global Bucket');
  });

  it('second org without org key can still read the same legacy global draft', async () => {
    fundingApi.saveDraft({ companyName: 'Cross Org Legacy Seed' }, DEFAULT_FUNDING_SETTINGS);

    authUser = { id: 'u_one', organizationId: 'org_one' };
    const { unmount } = renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Cross Org Legacy Seed');
    });
    unmount();

    authUser = { id: 'u_two', organizationId: 'org_two' };
    renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Cross Org Legacy Seed');
    });
  });

  it('prefers org-scoped key over legacy global when both exist', async () => {
    fundingApi.saveDraft({ companyName: 'Legacy Should Not Win' }, DEFAULT_FUNDING_SETTINGS);

    localStorage.setItem(
      getOrganizationStorageKey('org_priority'),
      JSON.stringify({
        fundingInputs: { companyName: 'Org Scoped Wins' },
        fundingSettings: DEFAULT_FUNDING_SETTINGS,
        organizationId: 'org_priority',
        updatedAt: '2026-05-23T00:00:00.000Z'
      })
    );

    authUser = { id: 'u_priority', organizationId: 'org_priority' };

    renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Org Scoped Wins');
    });
  });

  it('isolates drafts per organization when org-scoped keys are populated', async () => {
    localStorage.setItem(
      getOrganizationStorageKey('org_a'),
      JSON.stringify({
        fundingInputs: { companyName: 'Org A Draft Only' },
        fundingSettings: DEFAULT_FUNDING_SETTINGS,
        organizationId: 'org_a',
        updatedAt: '2026-05-23T00:00:00.000Z'
      })
    );
    localStorage.setItem(
      getOrganizationStorageKey('org_b'),
      JSON.stringify({
        fundingInputs: { companyName: 'Org B Draft Only' },
        fundingSettings: DEFAULT_FUNDING_SETTINGS,
        organizationId: 'org_b',
        updatedAt: '2026-05-23T00:00:00.000Z'
      })
    );

    authUser = { id: 'u_a', organizationId: 'org_a' };
    const { unmount } = renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Org A Draft Only');
    });
    unmount();

    authUser = { id: 'u_b', organizationId: 'org_b' };
    renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('company-name').textContent).toBe('Org B Draft Only');
    });
  });

  it('exposes organizationId from auth session, not as client authority over tenancy', async () => {
    localStorage.setItem(
      getOrganizationStorageKey('org_auth'),
      JSON.stringify({
        fundingInputs: { companyName: 'From Org Key' },
        fundingSettings: DEFAULT_FUNDING_SETTINGS,
        organizationId: 'org_stale_metadata_in_json',
        updatedAt: '2026-05-23T00:00:00.000Z'
      })
    );

    authUser = { id: 'u_auth', organizationId: 'org_auth' };

    renderFundingStoreProbe();

    await waitFor(() => {
      expect(screen.getByTestId('org-id').textContent).toBe('org_auth');
      expect(screen.getByTestId('company-name').textContent).toBe('From Org Key');
    });
  });

  it('does not call enterprise funding API from the draft store module', () => {
    const source = fs.readFileSync(FUNDING_STORE_PATH, 'utf8');

    expect(source).not.toContain('fundingEnterpriseApi');
    expect(source).not.toContain('/funding/rounds');
    expect(source).not.toContain('getFundingSummary');
  });
});

describe('funding draft vs persisted product copy (C.13.3I)', () => {
  it('dashboard documents scenario draft vs enterprise summary labels', () => {
    const dashboard = fs.readFileSync(FUNDING_DASHBOARD_PATH, 'utf8');

    expect(dashboard).toContain('Scenario draft workspace');
    expect(dashboard).toContain('Enterprise rounds summary');
    expect(dashboard).toContain('Not persisted as an official funding round');
    expect(dashboard).toContain('From backend summary and stored funding rounds');
  });

  it('legacy fallback is explicitly documented in fundingStore source', () => {
    const source = fs.readFileSync(FUNDING_STORE_PATH, 'utf8');

    expect(source).toContain('Compatibilidad con drafts antiguos');
    expect(source).toContain('fundingApi.loadDraft');
  });
});
