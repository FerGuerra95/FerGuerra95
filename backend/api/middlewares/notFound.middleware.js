export const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    data: null,
    meta: {
      method: req.method,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    },
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    }
  });
};