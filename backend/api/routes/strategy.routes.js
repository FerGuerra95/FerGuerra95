import { Router } from 'express';

import * as controller from '../controllers/strategy.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { strategyValidator } from '../validators/strategy.validator.js';

const router = Router();
const readStrategy = requirePermission(PERMISSIONS.READ_STRATEGY);
const createStrategy = requirePermission(PERMISSIONS.CREATE_STRATEGY);
const updateStrategy = requirePermission(PERMISSIONS.UPDATE_STRATEGY);
const exportStrategy = requirePermission(PERMISSIONS.EXPORT_STRATEGY);

router.get('/dashboard', readStrategy, controller.getDashboard);
router.get('/summary', readStrategy, controller.getSummary);
router.get('/audit-trail', readStrategy, controller.listAuditTrail);
router.get('/objectives', readStrategy, controller.listObjectives);
router.post('/objectives', createStrategy, validate(strategyValidator.body), controller.createObjective);
router.patch('/objectives/:id', updateStrategy, validate(strategyValidator.update), controller.updateObjective);
router.get('/initiatives', readStrategy, controller.listInitiatives);
router.post('/initiatives', createStrategy, validate(strategyValidator.body), controller.createInitiative);
router.patch('/initiatives/:id', updateStrategy, validate(strategyValidator.update), controller.updateInitiative);
router.get('/scenarios', readStrategy, controller.listScenarios);
router.post('/scenarios', createStrategy, validate(strategyValidator.body), controller.createScenario);
router.get('/market-notes', readStrategy, controller.listMarketNotes);
router.post('/market-notes', createStrategy, validate(strategyValidator.body), controller.createMarketNote);
router.get('/risks', readStrategy, controller.listRisks);
router.post('/risks', createStrategy, validate(strategyValidator.body), controller.createRisk);
router.get('/reports', readStrategy, controller.listReports);
router.post('/reports', exportStrategy, validate(strategyValidator.body), controller.createReport);

export default router;
