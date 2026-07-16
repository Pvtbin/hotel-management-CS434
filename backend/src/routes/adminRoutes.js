import { Router } from 'express';
import { getDashboard, getReports } from '../controllers/adminController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', auth, requireRole('staff', 'admin'), getDashboard);
router.get('/reports', auth, requireRole('admin'), getReports);

export default router;
