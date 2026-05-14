/**
 * Log estructurado por petición (activar con LOG_HTTP=1 o LOG_HTTP=true).
 * Incluye requestId para correlación con errores y soporte.
 */
export function requestLogMiddleware(req, res, next) {
  const enabled =
    process.env.LOG_HTTP === '1' || process.env.LOG_HTTP === 'true';

  if (!enabled) {
    return next();
  }

  const started = Date.now();

  res.on('finish', () => {
    const line = {
      requestId: req.requestId,
      method: req.method,
      path: String(req.originalUrl || req.url || '').split('?')[0],
      status: res.statusCode,
      ms: Date.now() - started
    };
    console.log(JSON.stringify(line));
  });

  return next();
}
