export const buildSupplier = (payload = {}) => ({
  id: payload.id || null,
  name: payload.name || '',
  country: payload.country || '',
  tier: payload.tier || 'tier_1',
  ...payload
});
