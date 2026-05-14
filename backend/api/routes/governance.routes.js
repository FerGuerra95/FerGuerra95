import { Router } from 'express';
import * as controller from '../controllers/governance.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { governanceValidator } from '../validators/governance.validator.js';

const router = Router();

const readGovernance = requirePermission(PERMISSIONS.READ_GOVERNANCE);
const createGovernance = requirePermission(PERMISSIONS.CREATE_GOVERNANCE);
const updateGovernance = requirePermission(PERMISSIONS.UPDATE_GOVERNANCE);
const approveGovernance = requirePermission(PERMISSIONS.APPROVE_GOVERNANCE_DECISION);
const managePolicy = requirePermission(PERMISSIONS.MANAGE_GOVERNANCE_POLICY);
const manageCommittee = requirePermission(PERMISSIONS.MANAGE_GOVERNANCE_COMMITTEE);
const exportGovernance = requirePermission(PERMISSIONS.EXPORT_GOVERNANCE_REPORT);

router.get('/dashboard', readGovernance, controller.getDashboard);
router.get('/summary', readGovernance, controller.getSummary);
router.get('/hub-overview', readGovernance, controller.getHubOverview);
router.get('/bridge-signals', readGovernance, controller.getBridgeSignals);

router.get('/decisions', readGovernance, controller.listDecisions);
router.post('/decisions', createGovernance, validate(governanceValidator.decisionCreate), controller.createDecision);
router.get('/decisions/:id', readGovernance, validate(governanceValidator.idParams), controller.getDecision);
router.patch('/decisions/:id', updateGovernance, validate(governanceValidator.decisionUpdate), controller.updateDecision);
router.post('/decisions/:id/submit', updateGovernance, validate(governanceValidator.workflow), controller.submitDecision);
router.post('/decisions/:id/approve', approveGovernance, validate(governanceValidator.workflow), controller.approveDecision);
router.post('/decisions/:id/reject', approveGovernance, validate(governanceValidator.workflow), controller.rejectDecision);
router.post('/decisions/:id/request-changes', approveGovernance, validate(governanceValidator.workflow), controller.requestDecisionChanges);
router.post('/decisions/:id/defer', updateGovernance, validate(governanceValidator.workflow), controller.deferDecision);
router.post('/decisions/:id/escalate', updateGovernance, validate(governanceValidator.workflow), controller.escalateDecision);
router.post('/decisions/:id/implement', updateGovernance, validate(governanceValidator.workflow), controller.implementDecision);

router.get('/board-packs', readGovernance, controller.listBoardPacks);
router.post('/board-packs', createGovernance, validate(governanceValidator.boardPackCreate), controller.createBoardPack);
router.patch('/board-packs/:id', updateGovernance, validate(governanceValidator.boardPackUpdate), controller.updateBoardPack);
router.post('/board-packs/:id/finalize', updateGovernance, validate(governanceValidator.idParams), controller.finalizeBoardPack);

router.get('/committees', readGovernance, controller.listCommittees);
router.post('/committees', manageCommittee, validate(governanceValidator.committeeCreate), controller.createCommittee);
router.patch('/committees/:id', manageCommittee, validate(governanceValidator.committeeUpdate), controller.updateCommittee);

router.get('/policies', readGovernance, controller.listPolicies);
router.post('/policies', managePolicy, validate(governanceValidator.policyCreate), controller.createPolicy);
router.patch('/policies/:id', managePolicy, validate(governanceValidator.policyUpdate), controller.updatePolicy);

router.get('/actions', readGovernance, controller.listActions);
router.post('/actions', createGovernance, validate(governanceValidator.actionCreate), controller.createAction);
router.patch('/actions/:id', updateGovernance, validate(governanceValidator.actionUpdate), controller.updateAction);
router.post('/actions/:id/complete', updateGovernance, validate(governanceValidator.actionUpdate), controller.completeAction);

router.get('/meetings', readGovernance, controller.listMeetings);
router.post('/meetings', createGovernance, validate(governanceValidator.meetingCreate), controller.createMeeting);
router.patch('/meetings/:id', updateGovernance, validate(governanceValidator.meetingUpdate), controller.updateMeeting);
router.post('/meetings/:id/finalize', updateGovernance, validate(governanceValidator.idParams), controller.finalizeMeetingMinutes);

router.get('/reports', readGovernance, controller.listReports);
router.post('/reports', exportGovernance, validate(governanceValidator.reportCreate), controller.createReport);
router.post('/reports/generate', exportGovernance, validate(governanceValidator.reportCreate), controller.createReport);
router.get('/audit-trail', requirePermission(PERMISSIONS.READ_AUDIT_LOG), controller.listAuditTrail);

router.get('/controls', readGovernance, controller.listControls);
router.post('/controls', updateGovernance, validate(governanceValidator.controlCreate), controller.createControl);
router.patch('/controls/:id', updateGovernance, validate(governanceValidator.controlUpdate), controller.updateControl);

router.get('/esg-metrics', readGovernance, controller.listEsgMetrics);
router.post('/esg-metrics', updateGovernance, validate(governanceValidator.esgMetricCreate), controller.createEsgMetric);
router.patch('/esg-metrics/:id', updateGovernance, validate(governanceValidator.esgMetricUpdate), controller.updateEsgMetric);

export default router;
