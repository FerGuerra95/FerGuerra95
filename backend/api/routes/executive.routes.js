import { Router } from 'express';

import * as controller from '../controllers/executive.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { executiveValidator } from '../validators/executive.validator.js';

const router = Router();
const readExecutive = requirePermission(PERMISSIONS.READ_EXECUTIVE);
const createSignal = requirePermission(PERMISSIONS.CREATE_EXECUTIVE_SIGNAL);
const updateSignal = requirePermission(PERMISSIONS.UPDATE_EXECUTIVE_SIGNAL);
const manageQueue = requirePermission(PERMISSIONS.MANAGE_EXECUTIVE_QUEUE);
const exportReport = requirePermission(PERMISSIONS.EXPORT_EXECUTIVE_REPORT);

router.get('/overview', readExecutive, controller.getOverview);
router.get('/summary', readExecutive, controller.getSummary);
router.get('/signals', readExecutive, controller.getSignals);
router.get('/signals/persisted', readExecutive, controller.listPersistedSignals);
router.post('/signals', createSignal, validate(executiveValidator.body), controller.createSignal);
router.patch('/signals/:id', updateSignal, validate(executiveValidator.updateSignal), controller.updateSignal);
router.get('/decision-queue', readExecutive, controller.getDecisionQueue);
router.post('/decision-queue/viewed', manageQueue, controller.getDecisionQueue);
router.get('/board-view', readExecutive, controller.getBoardView);
router.post('/board-view', exportReport, validate(executiveValidator.body), controller.createBoardView);
router.get('/readiness', readExecutive, controller.getReadiness);
router.get('/reports', readExecutive, controller.listReports);
router.post('/reports', exportReport, validate(executiveValidator.body), controller.createReport);
router.get('/snapshot', readExecutive, controller.getOverview);
router.post('/snapshot', exportReport, validate(executiveValidator.body), controller.createSnapshot);
router.get('/calendar', readExecutive, controller.getCalendar);

export default router;
