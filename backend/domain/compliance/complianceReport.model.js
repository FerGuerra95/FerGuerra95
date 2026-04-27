export const buildComplianceReport = (payload = {}) => ({
  id: payload.id || null,
  type: 'compliance',
  generatedAt: new Date().toISOString(),
  ...payload
});
