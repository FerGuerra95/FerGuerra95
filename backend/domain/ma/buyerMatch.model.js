export const buildBuyerMatch = (payload = {}) => ({
  type: payload.type || 'unknown',
  fit: payload.fit || 0,
  ...payload
});
