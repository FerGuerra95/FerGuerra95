export const buildMaCase = (payload = {}) => ({
  id: payload.id || null,
  name: payload.name || '',
  sector: payload.sector || '',
  createdAt: payload.createdAt || new Date().toISOString(),
  ...payload
});
