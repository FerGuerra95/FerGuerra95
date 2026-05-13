import { Router } from 'express';
import * as controller from '../controllers/ma.controller.js';
import { createRateLimiter } from '../middlewares/security.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { maValidator } from '../validators/ma.validator.js';

const IS_E2E = process.env.CEOS_E2E === 'true';

const secureSharePublicLimiter = createRateLimiter({
  windowMs: 60_000,
  max: IS_E2E ? 2000 : 90,
  code: 'SECURE_SHARE_PUBLIC_RATE_LIMITED',
  message:
    'Demasiadas consultas a enlaces seguros compartidos. Intentalo de nuevo en breve.',
  keyGenerator(req) {
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';
    const id = String(req.params?.id || '').trim() || '_';
    return `${ip}:${id}`;
  }
});

const router = Router();

router.get(
  '/secure-shares/:id',
  secureSharePublicLimiter,
  validate(maValidator.secureShareParams),
  controller.getSecureSharePublic
);

export default router;
