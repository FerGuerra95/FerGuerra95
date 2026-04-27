export const metrics = {
  requestsTotal: 0,
  reportsGenerated: 0,
  complianceScans: 0,
  exportReports: 0
};

export function incrementMetric(name, value = 1) {
  if (!(name in metrics)) metrics[name] = 0;
  metrics[name] += value;
}
