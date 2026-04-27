import { logger } from './logger.js';

export function requestLogger(req, _res, next) {
  logger.info('Incoming request', {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  next();
}
