import { Router } from 'express';
import { createTicket, getMyTickets, getAllTickets, updateTicket, assignTicket } from '../controllers/supportController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, requireRole('customer', 'staff', 'admin'), createTicket);
router.get('/my', auth, getMyTickets);
router.get('/', auth, requireRole('staff', 'admin'), getAllTickets);
router.put('/:id', auth, requireRole('staff', 'admin'), updateTicket);
router.put('/:id/assign', auth, requireRole('staff', 'admin'), assignTicket);

export default router;
