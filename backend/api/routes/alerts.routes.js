import { Router } from 'express';
import * as controller from '../controllers/alerts.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requirePermission(PERMISSIONS.READ),
  controller.listAlerts
);

router.post(
  '/',
  requirePermission(PERMISSIONS.CREATE_ALERT),
  controller.createAlert
);

router.post(
  '/scan',
  requirePermission(PERMISSIONS.CREATE_ALERT),
  controller.scanAlerts
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getAlertById
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.UPDATE_ALERT),
  controller.updateAlert
);

router.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.UPDATE_ALERT),
  controller.updateAlertStatus
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.DELETE_ALERT),
  controller.deleteAlert
);

export default router;