import crypto from 'node:crypto';

function getClientIp(req) {
  return (
    req.ip ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function requestIdMiddleware(req, res, next) {
  const incomingRequestId = String(req.headers['x-request-id'] || '').trim();
  const requestId =
    incomingRequestId && incomingRequestId.length <= 128
      ? incomingRequestId
      : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  return next();
}

export function securityHeadersMiddleware(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:4000 http://127.0.0.1:4000",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'"
    ].join('; ')
  );

  if (isProduction()) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  return next();
}

export function createRateLimiter({
  windowMs = 60_000,
  max = 120,
  code = 'RATE_LIMITED',
  message = 'Demasiadas solicitudes. Intentalo de nuevo en unos minutos.',
  keyGenerator = getClientIp
} = {}) {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = keyGenerator(req);
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs
      });

      return next();
    }

    current.count += 1;

    if (current.count <= max) {
      return next();
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    );

    res.setHeader('Retry-After', String(retryAfterSeconds));

    return res.status(429).json({
      data: null,
      meta: {
        requestId: req.requestId,
        retryAfterSeconds,
        timestamp: new Date().toISOString()
      },
      error: {
        code,
        message
      }
    });
  };
}
