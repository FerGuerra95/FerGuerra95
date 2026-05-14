import { Router } from 'express';
import * as controller from '../controllers/bridge.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { bridgeValidator } from '../validators/bridge.validator.js';

const router = Router();

router.get('/hub-overview', requirePermission(PERMISSIONS.READ), controller.getHubOverview);

router.get('/opportunities', requirePermission(PERMISSIONS.READ), controller.listOpportunities);
router.post(
  '/opportunities',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.opportunityCreate),
  controller.createOpportunity
);
router.patch(
  '/opportunities/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.opportunityUpdate),
  controller.updateOpportunity
);
router.delete(
  '/opportunities/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.idParams),
  controller.deleteOpportunity
);
router.get(
  '/opportunities/:id/matches',
  requirePermission(PERMISSIONS.READ),
  validate(bridgeValidator.idParams),
  controller.getMatches
);

router.post(
  '/opportunities/from-ma-deal/:dealId',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.dealParams),
  controller.createFromMaDeal
);
router.post(
  '/opportunities/from-funding-round/:roundId',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.roundParams),
  controller.createFromFundingRound
);

router.get('/counterparties', requirePermission(PERMISSIONS.READ), controller.listCounterparties);
router.post(
  '/counterparties',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.counterpartyCreate),
  controller.createCounterparty
);
router.patch(
  '/counterparties/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.counterpartyUpdate),
  controller.updateCounterparty
);
router.delete(
  '/counterparties/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.idParams),
  controller.deleteCounterparty
);

router.get('/introductions', requirePermission(PERMISSIONS.READ), controller.listIntroductions);
router.post(
  '/introductions',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.introductionCreate),
  controller.createIntroduction
);

router.get('/documents', requirePermission(PERMISSIONS.READ), controller.listDocuments);
router.post(
  '/documents',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.documentCreate),
  controller.createDocument
);
router.patch(
  '/documents/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.documentUpdate),
  controller.updateDocument
);

router.get('/reports', requirePermission(PERMISSIONS.READ), controller.listReports);
router.post(
  '/reports',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.reportCreate),
  controller.createReport
);
router.post(
  '/reports/generate',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.reportCreate),
  controller.generateReport
);

router.get('/audit-logs', requirePermission(PERMISSIONS.READ_AUDIT_LOG), controller.listAuditTrail);

export default router;
