export const buildEvidence = (payload = {}) => ({
  id: payload.id || null,
  title: payload.title || '',
  sourceType: payload.sourceType || 'document',
  ...payload
});
