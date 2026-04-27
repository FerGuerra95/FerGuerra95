export function track(event, payload = {}) {
  const entry = {
    event,
    payload,
    timestamp: new Date().toISOString()
  };
  console.log('[analytics]', JSON.stringify(entry));
}
