import { Router } from 'express';
import * as controller from '../controllers/heritage.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { heritageValidator } from '../validators/heritage.validator.js';

const router = Router();

const readHeritage = requirePermission(PERMISSIONS.READ_HERITAGE);
const createHeritage = requirePermission(PERMISSIONS.CREATE_HERITAGE);
const updateHeritage = requirePermission(PERMISSIONS.UPDATE_HERITAGE);
const deleteHeritage = requirePermission(PERMISSIONS.DELETE_HERITAGE);
const manageProtection = requirePermission(PERMISSIONS.MANAGE_HERITAGE_PROTECTION);
const manageSuccession = requirePermission(PERMISSIONS.MANAGE_HERITAGE_SUCCESSION);
const exportHeritage = requirePermission(PERMISSIONS.EXPORT_HERITAGE_REPORT);

router.get('/dashboard', readHeritage, controller.getDashboard);
router.get('/summary', readHeritage, controller.getSummary);
router.get('/bridge-signals', readHeritage, controller.getBridgeSignals);
router.get('/hub-overview', readHeritage, controller.getHubOverview);

router.get('/assets', readHeritage, controller.listAssets);
router.post(
  '/assets',
  createHeritage,
  validate(heritageValidator.assetCreate),
  controller.createAsset
);
router.patch(
  '/assets/:id',
  updateHeritage,
  validate(heritageValidator.assetUpdate),
  controller.updateAsset
);
router.delete(
  '/assets/:id',
  deleteHeritage,
  validate(heritageValidator.idParams),
  controller.deleteAsset
);

router.get('/successions', readHeritage, controller.listSuccessions);
router.post(
  '/successions',
  manageSuccession,
  validate(heritageValidator.successionCreate),
  controller.createSuccession
);
router.patch(
  '/successions/:id',
  manageSuccession,
  validate(heritageValidator.successionUpdate),
  controller.updateSuccession
);
router.delete(
  '/successions/:id',
  deleteHeritage,
  validate(heritageValidator.idParams),
  controller.deleteSuccession
);

router.get('/protections', readHeritage, controller.listProtections);
router.post(
  '/protections',
  manageProtection,
  validate(heritageValidator.protectionCreate),
  controller.createProtection
);
router.patch(
  '/protections/:id',
  manageProtection,
  validate(heritageValidator.protectionUpdate),
  controller.updateProtection
);
router.delete(
  '/protections/:id',
  deleteHeritage,
  validate(heritageValidator.idParams),
  controller.deleteProtection
);

router.get('/documents', readHeritage, controller.listDocuments);
router.post(
  '/documents',
  createHeritage,
  validate(heritageValidator.documentCreate),
  controller.createDocument
);
router.patch(
  '/documents/:id',
  updateHeritage,
  validate(heritageValidator.documentUpdate),
  controller.updateDocument
);

router.get('/reports', readHeritage, controller.listReports);
router.post(
  '/reports',
  exportHeritage,
  validate(heritageValidator.reportCreate),
  controller.createReport
);
router.post(
  '/reports/generate',
  exportHeritage,
  validate(heritageValidator.reportCreate),
  controller.generateReport
);

router.get('/audit-logs', requirePermission(PERMISSIONS.READ_AUDIT_LOG), controller.listAuditTrail);

export default router;
