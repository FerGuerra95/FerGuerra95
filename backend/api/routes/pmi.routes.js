import { Router } from 'express';

import * as controller from '../controllers/pmi.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pmiValidator } from '../validators/pmi.validator.js';

const router = Router();

router.get(
  '/hub-overview',
  requirePermission(PERMISSIONS.READ),
  controller.getExecutiveHubBrief
);

router.get(
  '/audit-logs',
  requirePermission(PERMISSIONS.READ_PMI_AUDIT),
  validate(pmiValidator.auditQuery),
  controller.listAuditLogs
);

router.get(
  '/cases',
  requirePermission(PERMISSIONS.READ),
  controller.listCases
);

router.post(
  '/cases/from-ma-deal/:dealId',
  requirePermission(PERMISSIONS.CREATE_PMI_FROM_MA_DEAL),
  validate(pmiValidator.dealParams),
  controller.createCaseFromMaDeal
);

router.post(
  '/cases',
  requirePermission(PERMISSIONS.MANAGE_PMI_CASE),
  validate(pmiValidator.create),
  controller.createCase
);

router.get(
  '/cases/:id',
  requirePermission(PERMISSIONS.READ),
  validate(pmiValidator.params),
  controller.getCaseById
);

router.patch(
  '/cases/:id',
  requirePermission(PERMISSIONS.UPDATE_PMI_WORKSTREAM),
  validate(pmiValidator.update),
  controller.updateCase
);

router.post(
  '/cases/:id/duplicate',
  requirePermission(PERMISSIONS.DUPLICATE_PMI_CASE),
  validate(pmiValidator.params),
  controller.duplicateCase
);

router.delete(
  '/cases/:id',
  requirePermission(PERMISSIONS.MANAGE_PMI_CASE),
  validate(pmiValidator.params),
  controller.deleteCase
);

export default router;
