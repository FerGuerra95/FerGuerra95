import { describe, expect, it } from 'vitest';

import {
  buildTenantSafeCreateFields,
  omitClientTenantFields
} from '../../../backend/utils/tenantPayload.js';

describe('tenantPayload', () => {
  it('strips client tenant fields without mutating input', () => {
    const input = {
      organizationId: 'org_evil',
      orgId: 'org_evil_2',
      organization_id: 'org_evil_3',
      tenantId: 'tenant_evil',
      tenant_id: 'tenant_evil_2',
      title: 'Legit field'
    };

    const safe = omitClientTenantFields(input);

    expect(safe).toEqual({ title: 'Legit field' });
    expect(input.organizationId).toBe('org_evil');
  });

  it('buildTenantSafeCreateFields forces session organizationId', () => {
    const fields = buildTenantSafeCreateFields(
      { organizationId: 'org_b', title: 'Test' },
      'org_a',
      { userId: 'u_1' }
    );

    expect(fields.organizationId).toBe('org_a');
    expect(fields.title).toBe('Test');
    expect(fields.userId).toBe('u_1');
    expect(fields.createdBy).toBe('u_1');
  });
});
