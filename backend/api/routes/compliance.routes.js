import { Router } from 'express';
import * as controller from '../controllers/compliance.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { complianceValidator } from '../validators/compliance.validator.js';

const router = Router();

router.get(
  '/audit-runs',
  requirePermission(PERMISSIONS.READ),
  controller.listAuditRuns
);

router.post(
  '/audit-runs',
  requirePermission(PERMISSIONS.RUN_COMPLIANCE_AUDIT),
  validate(complianceValidator.runAudit),
  controller.createAuditRun
);

router.get(
  '/audit-runs/:id',
  requirePermission(PERMISSIONS.READ),
  validate(complianceValidator.auditRunParams),
  controller.getAuditRunById
);

router.get(
  '/audit-runs/:id/ledger-export',
  requirePermission(PERMISSIONS.READ),
  validate(complianceValidator.auditRunParams),
  controller.exportAuditRunLedger
);

router.get(
  '/ma-risk-impacts',
  requirePermission(PERMISSIONS.READ),
  validate(complianceValidator.auditRunQuery),
  controller.listMaRiskImpacts
);

router.get(
  '/hub-overview',
  requirePermission(PERMISSIONS.READ),
  controller.getExecutiveHubBrief
);

export default router;
