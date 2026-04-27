export const buildMaReport = (payload = {}) => ({
  id: payload.id || null,
  type: 'ma',
  generatedAt: new Date().toISOString(),
  ...payload
});
