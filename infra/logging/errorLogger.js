import { logger } from './logger.js';

export function errorLogger(err, req, _res, next) {
  logger.error('Unhandled request error', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack
  });
  next(err);
}
