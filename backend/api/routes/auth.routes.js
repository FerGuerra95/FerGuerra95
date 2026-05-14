import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate(authValidator.login), controller.login);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);

router.post(
  '/password-reset/request',
  validate(authValidator.passwordResetRequest),
  controller.passwordResetRequest
);
router.post(
  '/password-reset/confirm',
  validate(authValidator.passwordResetConfirm),
  controller.passwordResetConfirm
);

router.get('/oidc/start', controller.oidcStart);
router.get('/oidc/callback', controller.oidcCallback);

export default router;
