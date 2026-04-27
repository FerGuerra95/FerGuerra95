import { Router } from 'express';
import * as controller from '../controllers/reports.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requirePermission(PERMISSIONS.READ),
  controller.listReports
);

router.post(
  '/ma',
  requirePermission(PERMISSIONS.CREATE_MA_REPORT),
  controller.generateMaReport
);

router.post(
  '/compliance',
  requirePermission(PERMISSIONS.CREATE_REPORT),
  controller.generateComplianceReport
);

router.get(
  '/compliance/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getComplianceReportById
);

router.patch(
  '/compliance/:id',
  requirePermission(PERMISSIONS.UPDATE_REPORT),
  controller.updateComplianceReport
);

router.delete(
  '/compliance/:id',
  requirePermission(PERMISSIONS.DELETE_REPORT),
  controller.deleteComplianceReport
);

export default router;