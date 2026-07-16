import { Router } from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getServices);
router.post('/', auth, requireRole('staff', 'admin'), createService);
router.put('/:id', auth, requireRole('staff', 'admin'), updateService);
router.delete('/:id', auth, requireRole('admin'), deleteService);

export default router;
