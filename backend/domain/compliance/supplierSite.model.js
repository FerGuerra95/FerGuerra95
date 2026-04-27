export const buildSupplierSite = (payload = {}) => ({
  id: payload.id || null,
  supplierId: payload.supplierId || null,
  location: payload.location || '',
  ...payload
});
