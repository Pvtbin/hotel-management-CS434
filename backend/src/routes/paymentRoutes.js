import { Router } from 'express';
import { processPayment, getPayment, getAllPayments, refundPayment } from '../controllers/paymentController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, requireRole('customer', 'staff', 'admin'), processPayment);
router.get('/booking/:bookingId', auth, getPayment);
router.get('/', auth, requireRole('staff', 'admin'), getAllPayments);
router.put('/:id/refund', auth, requireRole('admin'), refundPayment);

export default router;
