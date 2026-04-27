export const buildAlert = (payload = {}) => ({
  id: payload.id || null,
  status: payload.status || 'open',
  severity: payload.severity || 'medium',
  ...payload
});
