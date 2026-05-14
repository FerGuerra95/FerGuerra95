import { Router } from 'express';

import * as controller from '../controllers/pmi.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pmiValidator } from '../validators/pmi.validator.js';

const router = Router();
const readPmi = requirePermission(PERMISSIONS.READ_PMI);
const createPmi = requirePermission(PERMISSIONS.CREATE_PMI);
const updatePmi = requirePermission(PERMISSIONS.UPDATE_PMI);
const deletePmi = requirePermission(PERMISSIONS.DELETE_PMI);
const manageSynergy = requirePermission(PERMISSIONS.MANAGE_PMI_SYNERGY);
const manageRisk = requirePermission(PERMISSIONS.MANAGE_PMI_RISK);
const manageDayOne = requirePermission(PERMISSIONS.MANAGE_PMI_DAY1);
const exportPmi = requirePermission(PERMISSIONS.EXPORT_PMI_REPORT);

router.get('/dashboard', readPmi, controller.getDashboard);
router.get('/summary', readPmi, controller.getSummary);
router.get('/bridge-signals', readPmi, controller.getBridgeSignals);

router.get(
  '/hub-overview',
  readPmi,
  controller.getExecutiveHubBrief
);

router.get(
  '/audit-logs',
  readPmi,
  validate(pmiValidator.auditQuery),
  controller.listAuditLogs
);

router.get(
  '/cases',
  readPmi,
  controller.listCases
);

router.post(
  '/cases/from-ma-deal/:dealId',
  createPmi,
  validate(pmiValidator.dealParams),
  controller.createCaseFromMaDeal
);

router.post(
  '/cases',
  createPmi,
  validate(pmiValidator.create),
  controller.createCase
);

router.get(
  '/cases/:id',
  readPmi,
  validate(pmiValidator.params),
  controller.getCaseById
);

router.patch(
  '/cases/:id',
  updatePmi,
  validate(pmiValidator.update),
  controller.updateCase
);

router.post(
  '/cases/:id/duplicate',
  createPmi,
  validate(pmiValidator.params),
  controller.duplicateCase
);

router.delete(
  '/cases/:id',
  deletePmi,
  validate(pmiValidator.params),
  controller.deleteCase
);

router.get('/programs', readPmi, controller.listPrograms);
router.post('/programs', createPmi, validate(pmiValidator.enterpriseBody), controller.createProgram);
router.get('/programs/:id', readPmi, validate(pmiValidator.params), controller.getProgramById);
router.patch('/programs/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateProgram);

router.get('/synergies', readPmi, controller.listSynergies);
router.post('/synergies', manageSynergy, validate(pmiValidator.enterpriseBody), controller.createSynergy);
router.patch('/synergies/:id', manageSynergy, validate(pmiValidator.enterpriseUpdate), controller.updateSynergy);

router.get('/milestones', readPmi, controller.listMilestones);
router.post('/milestones', createPmi, validate(pmiValidator.enterpriseBody), controller.createMilestone);
router.patch('/milestones/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateMilestone);

router.get('/risks', readPmi, controller.listRisks);
router.post('/risks', manageRisk, validate(pmiValidator.enterpriseBody), controller.createRisk);
router.patch('/risks/:id', manageRisk, validate(pmiValidator.enterpriseUpdate), controller.updateRisk);

router.get('/day1', readPmi, controller.listDayOne);
router.post('/day1', manageDayOne, validate(pmiValidator.enterpriseBody), controller.createDayOne);
router.patch('/day1/:id', manageDayOne, validate(pmiValidator.enterpriseUpdate), controller.updateDayOne);

router.get('/day-100', readPmi, controller.listHundredDay);
router.post('/day-100', updatePmi, validate(pmiValidator.enterpriseBody), controller.createHundredDay);
router.patch('/day-100/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateHundredDay);

router.get('/transition-services', readPmi, controller.listTransitionServices);
router.post('/transition-services', updatePmi, validate(pmiValidator.enterpriseBody), controller.createTransitionService);
router.patch('/transition-services/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateTransitionService);

router.get('/operating-model', readPmi, controller.listOperatingModel);
router.post('/operating-model', updatePmi, validate(pmiValidator.enterpriseBody), controller.createOperatingModel);
router.patch('/operating-model/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateOperatingModel);

router.get('/people-culture', readPmi, controller.listPeopleCulture);
router.post('/people-culture', updatePmi, validate(pmiValidator.enterpriseBody), controller.createPeopleCulture);
router.patch('/people-culture/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updatePeopleCulture);

router.get('/technology', readPmi, controller.listTechnology);
router.post('/technology', updatePmi, validate(pmiValidator.enterpriseBody), controller.createTechnology);
router.patch('/technology/:id', updatePmi, validate(pmiValidator.enterpriseUpdate), controller.updateTechnology);

router.get('/reports', readPmi, controller.listReports);
router.post('/reports', exportPmi, validate(pmiValidator.enterpriseBody), controller.createReport);

export default router;
