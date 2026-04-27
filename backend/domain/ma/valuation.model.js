export const buildValuation = (payload = {}) => ({
  enterpriseValue: 0,
  equityValue: 0,
  netProceeds: 0,
  ...payload
});
