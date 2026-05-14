import { Router } from 'express';

import * as controller from '../controllers/risk.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { riskValidator } from '../validators/risk.validator.js';

const router = Router();

const readRisk = requirePermission(PERMISSIONS.READ_RISK);
const createRisk = requirePermission(PERMISSIONS.CREATE_RISK);
const updateRisk = requirePermission(PERMISSIONS.UPDATE_RISK);
const manageControl = requirePermission(PERMISSIONS.MANAGE_RISK_CONTROL);
const manageMitigation = requirePermission(PERMISSIONS.MANAGE_RISK_MITIGATION);
const manageIncident = requirePermission(PERMISSIONS.MANAGE_RISK_INCIDENT);
const manageKri = requirePermission(PERMISSIONS.MANAGE_RISK_KRI);
const manageAppetite = requirePermission(PERMISSIONS.MANAGE_RISK_APPETITE);
const exportRisk = requirePermission(PERMISSIONS.EXPORT_RISK_REPORT);

router.get('/dashboard', readRisk, controller.getDashboard);
router.get('/summary', readRisk, controller.getSummary);
router.get('/bridge-signals', readRisk, controller.getBridgeSignals);
router.get('/audit-trail', readRisk, controller.listAuditTrail);

router.get('/register', readRisk, controller.listRegister);
router.post('/register', createRisk, validate(riskValidator.body), controller.createRegister);
router.patch('/register/:id', updateRisk, validate(riskValidator.update), controller.updateRegister);

router.get('/controls', readRisk, controller.listControlLibrary);
router.post('/controls', manageControl, validate(riskValidator.body), controller.createControl);
router.patch('/controls/:id', manageControl, validate(riskValidator.update), controller.updateControl);

router.get('/mitigations', readRisk, controller.listMitigationPlans);
router.post('/mitigations', manageMitigation, validate(riskValidator.body), controller.createMitigation);
router.patch('/mitigations/:id', manageMitigation, validate(riskValidator.update), controller.updateMitigation);

router.get('/incidents', readRisk, controller.listIncidentLog);
router.post('/incidents', manageIncident, validate(riskValidator.body), controller.createIncident);
router.patch('/incidents/:id', manageIncident, validate(riskValidator.update), controller.updateIncident);

router.get('/kri', readRisk, controller.listKri);
router.post('/kri', manageKri, validate(riskValidator.body), controller.createKri);
router.patch('/kri/:id', manageKri, validate(riskValidator.update), controller.updateKri);

router.get('/appetite', readRisk, controller.listAppetite);
router.post('/appetite', manageAppetite, validate(riskValidator.body), controller.createAppetite);
router.patch('/appetite/:id', manageAppetite, validate(riskValidator.update), controller.updateAppetite);

router.get('/reports', readRisk, controller.listReports);
router.post('/reports', exportRisk, validate(riskValidator.body), controller.createReport);

router.get('/committee-reviews', readRisk, controller.listCommitteeReviews);
router.post('/committee-reviews', updateRisk, validate(riskValidator.body), controller.createCommitteeReview);
router.patch('/committee-reviews/:id', updateRisk, validate(riskValidator.update), controller.updateCommitteeReview);

router.get('/evidence-links', readRisk, controller.listEvidenceLinks);
router.post('/evidence-links', updateRisk, validate(riskValidator.body), controller.createEvidenceLink);
router.patch('/evidence-links/:id', updateRisk, validate(riskValidator.update), controller.updateEvidenceLink);

router.get('/notifications', readRisk, controller.listNotifications);
router.post('/notifications', updateRisk, validate(riskValidator.body), controller.createNotification);

export default router;
