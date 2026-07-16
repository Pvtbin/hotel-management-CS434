import { Router } from 'express';
import {
  createBooking, getMyBookings, getBookingById, cancelBooking,
  getAllBookings, updateBookingStatus, checkIn, checkOut, getRevenueStats
} from '../controllers/bookingController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, requireRole('customer', 'staff', 'admin'), createBooking);
router.get('/my', auth, getMyBookings);
router.get('/', auth, requireRole('staff', 'admin'), getAllBookings);
router.get('/stats/revenue', auth, requireRole('staff', 'admin'), getRevenueStats);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, requireRole('customer', 'staff', 'admin'), cancelBooking);

router.put('/:id/status', auth, requireRole('staff', 'admin'), updateBookingStatus);
router.put('/:id/check-in', auth, requireRole('staff', 'admin'), checkIn);
router.put('/:id/check-out', auth, requireRole('staff', 'admin'), checkOut);

export default router;
