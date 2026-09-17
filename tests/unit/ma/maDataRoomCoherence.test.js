import { describe, expect, it } from 'vitest';

import {
  countActiveSharesForDocument,
  isMaSecureShareActive,
  isShareLinkedToDocument,
  summarizeDataRoomShares
} from '../../../src/modules/ma/engine/maDataRoomCoherence.js';

describe('M&A data room share coherence', () => {
  it('counts org-wide active shares without expired or revoked records', () => {
    const shares = [
      {
        id: 'share-active',
        reportId: 'report-a',
        status: 'active',
        isActive: true,
        expiresAt: '2099-01-01T00:00:00.000Z'
      },
      {
        id: 'share-expired',
        reportId: 'report-a',
        status: 'expired',
        isActive: false,
        expiresAt: '2020-01-01T00:00:00.000Z'
      },
      {
        id: 'share-revoked',
        reportId: 'report-b',
        status: 'revoked',
        isActive: false,
        revokedAt: '2026-01-01T00:00:00.000Z'
      }
    ];

    expect(summarizeDataRoomShares(shares)).toEqual({
      totalShares: 3,
      activeShares: 1,
      revokedShares: 2
    });
  });

  it('counts document active links by shareId or reportId, not by title', () => {
    const shares = [
      {
        id: 'share-linked',
        reportId: 'report-doc',
        status: 'active',
        isActive: true
      },
      {
        id: 'share-other',
        reportId: 'report-other',
        status: 'active',
        isActive: true
      }
    ];
    const sameNameUnlinked = {
      id: 'doc-unlinked',
      title: 'Industrial Systems S.A.',
      reportId: '',
      shareId: ''
    };

    expect(
      countActiveSharesForDocument(
        {
          id: 'doc-report',
          title: 'Industrial Systems S.A.',
          reportId: 'report-doc'
        },
        shares
      )
    ).toBe(1);
    expect(
      countActiveSharesForDocument(
        {
          id: 'doc-share',
          title: 'Other title',
          shareId: 'share-linked'
        },
        shares
      )
    ).toBe(1);
    expect(countActiveSharesForDocument(sameNameUnlinked, shares)).toBe(0);
    expect(
      isShareLinkedToDocument(sameNameUnlinked, shares[0])
    ).toBe(false);
  });

  it('treats a persisted expired timestamp as inactive even without isActive', () => {
    expect(
      isMaSecureShareActive({
        id: 'legacy-expired',
        status: 'active',
        expiresAt: '2020-05-10T00:00:00.000Z'
      })
    ).toBe(false);
  });
});
