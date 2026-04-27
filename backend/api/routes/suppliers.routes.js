import { Router } from 'express';
import * as controller from '../controllers/suppliers.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requirePermission(PERMISSIONS.READ),
  controller.listSuppliers
);

router.post(
  '/',
  requirePermission(PERMISSIONS.CREATE_SUPPLIER),
  controller.createSupplier
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getSupplierById
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.UPDATE_SUPPLIER),
  controller.updateSupplier
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.DELETE_SUPPLIER),
  controller.deleteSupplier
);

export default router;