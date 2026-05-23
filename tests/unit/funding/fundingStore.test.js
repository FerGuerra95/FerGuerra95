import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FUNDING_STORAGE_KEYS } from '../../../src/modules/funding/engine/fundingFormulas.js';
import { fundingApi } from '../../../src/modules/funding/services/fundingApi.js';

const FUNDING_ORG_STORAGE_PREFIX = 'funding_draft_by_org_v1';
const FUNDING_STORE_PATH = path.join(
  process.cwd(),
  'src/modules/funding/store/fundingStore.jsx'
);

function getOrganizationStorageKey(organizationId) {
  return `${FUNDING_ORG_STORAGE_PREFIX}_${organizationId}`;
}

describe('funding draft localStorage conventions (C.13.3H)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
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
