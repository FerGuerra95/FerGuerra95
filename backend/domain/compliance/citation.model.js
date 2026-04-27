export const buildCitation = (payload = {}) => ({
  id: payload.id || null,
  sourceUrl: payload.sourceUrl || '',
  excerpt: payload.excerpt || '',
  ...payload
});
