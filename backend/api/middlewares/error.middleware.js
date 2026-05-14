export const errorMiddleware = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;

  const code =
    err.code ||
    (status === 400
      ? 'BAD_REQUEST'
      : status === 401
        ? 'UNAUTHORIZED'
        : status === 403
          ? 'FORBIDDEN'
          : status === 404
            ? 'NOT_FOUND'
            : status === 409
              ? 'CONFLICT'
              : 'INTERNAL_SERVER_ERROR');

  const message =
    status >= 500
      ? 'Error interno del servidor'
      : err.message || 'Error de solicitud';

  if (status >= 500) {
    console.error('[SERVER_ERROR]', {
      requestId: req.requestId,
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.originalUrl
    });
  } else {
    console.warn('[REQUEST_ERROR]', {
      requestId: req.requestId,
      code,
      message: err.message,
      method: req.method,
      path: req.originalUrl
    });
  }

  res.status(status).json({
    data: null,
    meta: {
      method: req.method,
      path: req.originalUrl,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    },
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {})
    }
  });
};
