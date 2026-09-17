export function isMaSecureShareActive(share = {}) {
  if (!share) return false;
  if (share.isActive === true) return true;
  if (share.isActive === false) return false;
  if (share.status === 'revoked' || share.revokedAt) return false;
  if (share.status === 'expired') return false;

  if (share.expiresAt) {
    const expiresAt = Date.parse(share.expiresAt);
    if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) return false;
  }

  return share.status === 'active';
}

export function isShareLinkedToDocument(documentItem, share) {
  if (!documentItem || !share) return false;

  if (documentItem.shareId && share.id === documentItem.shareId) return true;
  if (documentItem.reportId && share.reportId === documentItem.reportId) {
    return true;
  }

  return false;
}

export function countActiveSharesForDocument(documentItem, shares) {
  return (Array.isArray(shares) ? shares : []).filter(
    (share) =>
      isMaSecureShareActive(share) && isShareLinkedToDocument(documentItem, share)
  ).length;
}

export function summarizeDataRoomShares(shares) {
  const list = Array.isArray(shares) ? shares : [];
  const activeShares = list.filter(isMaSecureShareActive).length;

  return {
    totalShares: list.length,
    activeShares,
    revokedShares: list.length - activeShares
  };
}
