import { describe, expect, it } from 'vitest';

import {
  PMI_ENTERPRISE_DSS_DISCLAIMER,
  pmiEnterpriseCopyIsTruthful
} from '../../../src/modules/pmi/components/PMIEnterpriseComponents.jsx';

describe('PMI enterprise UI copy truthfulness', () => {
  it('uses DSS disclaimer without certified language', () => {
    expect(PMI_ENTERPRISE_DSS_DISCLAIMER).toMatch(/Decision-support/i);
    expect(PMI_ENTERPRISE_DSS_DISCLAIMER).toMatch(/not certified/i);
    expect(PMI_ENTERPRISE_DSS_DISCLAIMER).toMatch(/Human review required/i);
    expect(pmiEnterpriseCopyIsTruthful(PMI_ENTERPRISE_DSS_DISCLAIMER)).toBe(true);
  });

  it('flags misleading operational copy', () => {
    expect(pmiEnterpriseCopyIsTruthful('Golden score for synergy capture')).toBe(false);
    expect(pmiEnterpriseCopyIsTruthful('Certified integration readiness')).toBe(false);
    expect(pmiEnterpriseCopyIsTruthful('Validated formula oracle')).toBe(false);
    expect(pmiEnterpriseCopyIsTruthful('Board-ready final rating')).toBe(false);
  });

  it('allows decision-support and operational labels', () => {
    expect(pmiEnterpriseCopyIsTruthful('Operational synergy capture (DSS)')).toBe(true);
    expect(pmiEnterpriseCopyIsTruthful('Board pack draft · human review required')).toBe(true);
    expect(pmiEnterpriseCopyIsTruthful('Finance reviewed ledger line')).toBe(true);
  });
});
