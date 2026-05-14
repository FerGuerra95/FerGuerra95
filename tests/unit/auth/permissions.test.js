import { describe, expect, it } from 'vitest';

import {
  getPermissionsForRole,
  PERMISSIONS
} from '../../../backend/api/middlewares/auth.middleware.js';

describe('enterprise permissions', () => {
  it('permite a user gestionar data room M&A y mantiene viewer en solo lectura', () => {
    expect(getPermissionsForRole('user')).toEqual(
      expect.arrayContaining([
        PERMISSIONS.CREATE_MA_SHARE,
        PERMISSIONS.REVOKE_MA_SHARE,
        PERMISSIONS.MANAGE_MA_DATA_ROOM,
        PERMISSIONS.CREATE_MA_DEAL,
        PERMISSIONS.UPDATE_MA_DEAL,
        PERMISSIONS.READ_AUDIT_LOG,
        PERMISSIONS.CREATE_FUNDING_SNAPSHOT
      ])
    );

    expect(getPermissionsForRole('viewer')).toEqual([
      PERMISSIONS.READ,
      PERMISSIONS.READ_GOVERNANCE,
      PERMISSIONS.READ_HERITAGE,
      PERMISSIONS.READ_PMI
    ]);
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.MANAGE_MA_DATA_ROOM
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.CREATE_MA_DEAL
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.CREATE_FUNDING_SNAPSHOT
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.UPDATE_GOVERNANCE
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.APPROVE_GOVERNANCE_DECISION
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.UPDATE_HERITAGE
    );
    expect(getPermissionsForRole('viewer')).not.toContain(
      PERMISSIONS.UPDATE_PMI
    );
  });
});
