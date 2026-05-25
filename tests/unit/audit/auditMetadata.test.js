import { describe, expect, it } from 'vitest';

import {
  emailAuditHint,
  pickChangedFieldNames,
  sanitizeAuditMetadata
} from '../../../backend/utils/auditMetadata.js';

describe('auditMetadata', () => {
  it('strips forbidden secret and sensitive payload keys', () => {
    const safe = sanitizeAuditMetadata({
      entityId: 'sup_1',
      password: 'secret',
      token: 'jwt-token',
      excerpt: 'long sensitive text',
      notes: 'internal notes'
    });

    expect(safe).toEqual({ entityId: 'sup_1' });
    expect(safe.password).toBeUndefined();
    expect(safe.token).toBeUndefined();
  });

  it('redacts email into domain and local prefix hints only', () => {
    const hint = emailAuditHint('Admin.User@Example.COM');

    expect(hint.emailPresent).toBe(true);
    expect(hint.emailDomain).toBe('example.com');
    expect(hint.emailLocalPrefix).toMatch(/^\w{2}\*\*\*$/);
    expect(hint.email).toBeUndefined();
  });

  it('pickChangedFieldNames returns only keys present in patch with different values', () => {
    const changed = pickChangedFieldNames(
      { status: 'active', tier: 'Tier 1' },
      { status: 'watchlist', tier: 'Tier 1' },
      ['status', 'tier', 'name']
    );

    expect(changed).toEqual(['status']);
  });
});
