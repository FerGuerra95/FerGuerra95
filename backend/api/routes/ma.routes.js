import { Router } from 'express';
import * as controller from '../controllers/ma.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/cases',
  requirePermission(PERMISSIONS.READ),
  controller.listCases
);

router.post(
  '/cases',
  requirePermission(PERMISSIONS.CREATE_MA_CASE),
  controller.createCase
);

router.get(
  '/cases/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getCaseById
);

router.patch(
  '/cases/:id',
  requirePermission(PERMISSIONS.UPDATE_MA_CASE),
  controller.updateCase
);

router.delete(
  '/cases/:id',
  requirePermission(PERMISSIONS.DELETE_MA_CASE),
  controller.deleteCase
);

router.post(
  '/cases/:id/snapshots',
  requirePermission(PERMISSIONS.UPDATE_MA_CASE),
  (req, res, next) => {
    req.body = {
      ...(req.body || {}),
      caseId: req.params.id
    };

    return controller.runValuation(req, res, next);
  }
);

router.post(
  '/valuation/run',
  requirePermission(PERMISSIONS.CREATE_MA_CASE),
  controller.runValuation
);

router.get(
  '/reports',
  requirePermission(PERMISSIONS.READ),
  controller.listReports
);

router.post(
  '/reports/export',
  requirePermission(PERMISSIONS.CREATE_MA_REPORT),
  controller.exportReport
);

export default router;