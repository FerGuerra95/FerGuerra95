import { Router } from 'express';
import * as controller from '../controllers/bridge.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { bridgeValidator } from '../validators/bridge.validator.js';

const router = Router();
const readBridge = requirePermission(PERMISSIONS.READ_BRIDGE);
const createSignal = requirePermission(PERMISSIONS.CREATE_BRIDGE_SIGNAL);
const updateSignal = requirePermission(PERMISSIONS.UPDATE_BRIDGE_SIGNAL);
const resolveSignal = requirePermission(PERMISSIONS.RESOLVE_BRIDGE_SIGNAL);
const dismissSignal = requirePermission(PERMISSIONS.DISMISS_BRIDGE_SIGNAL);
const manageDependency = requirePermission(PERMISSIONS.MANAGE_BRIDGE_DEPENDENCY);
const exportBridge = requirePermission(PERMISSIONS.EXPORT_BRIDGE_REPORT);

router.get('/dashboard', readBridge, controller.getDashboard);
router.get('/summary', readBridge, controller.getSummary);
router.post('/recalculate', updateSignal, controller.recalculate);
router.get('/hub-overview', readBridge, controller.getHubOverview);

router.get('/signals', readBridge, controller.listSignals);
router.post('/signals', createSignal, validate(bridgeValidator.signalCreate), controller.createSignal);
router.patch('/signals/:id', updateSignal, validate(bridgeValidator.signalUpdate), controller.updateSignal);
router.post('/signals/:id/acknowledge', updateSignal, validate(bridgeValidator.workflow), controller.acknowledgeSignal);
router.post('/signals/:id/in-review', updateSignal, validate(bridgeValidator.workflow), controller.markSignalInReview);
router.post('/signals/:id/resolve', resolveSignal, validate(bridgeValidator.workflow), controller.resolveSignal);
router.post('/signals/:id/dismiss', dismissSignal, validate(bridgeValidator.workflow), controller.dismissSignal);

router.get('/dependencies', readBridge, controller.listDependencies);
router.post('/dependencies', manageDependency, validate(bridgeValidator.dependencyCreate), controller.createDependency);
router.patch('/dependencies/:id', manageDependency, validate(bridgeValidator.dependencyUpdate), controller.updateDependency);

router.get('/conflicts', readBridge, controller.listConflicts);
router.post('/conflicts', manageDependency, validate(bridgeValidator.conflictCreate), controller.createConflict);
router.patch('/conflicts/:id', manageDependency, validate(bridgeValidator.conflictUpdate), controller.updateConflict);

router.get('/attention-queue', readBridge, controller.listAttentionQueue);

router.get('/evidence-links', readBridge, controller.listEvidenceLinks);
router.post('/evidence-links', updateSignal, validate(bridgeValidator.evidenceCreate), controller.createEvidenceLink);
router.patch('/evidence-links/:id', updateSignal, validate(bridgeValidator.evidenceUpdate), controller.updateEvidenceLink);

router.get('/snapshots', readBridge, controller.listSnapshots);
router.post('/snapshots', exportBridge, validate(bridgeValidator.snapshotCreate), controller.createSnapshot);

router.get('/opportunities', readBridge, controller.listOpportunities);
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
  readBridge,
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

router.get('/counterparties', readBridge, controller.listCounterparties);
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

router.get('/introductions', readBridge, controller.listIntroductions);
router.post(
  '/introductions',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(bridgeValidator.introductionCreate),
  controller.createIntroduction
);

router.get('/documents', readBridge, controller.listDocuments);
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

router.get('/reports', readBridge, controller.listReports);
router.post(
  '/reports',
  exportBridge,
  validate(bridgeValidator.reportCreate),
  controller.createEnterpriseReport
);
router.post(
  '/reports/generate',
  exportBridge,
  validate(bridgeValidator.reportCreate),
  controller.generateReport
);

router.get('/audit-logs', requirePermission(PERMISSIONS.READ_AUDIT_LOG), controller.listAuditTrail);

export default router;
