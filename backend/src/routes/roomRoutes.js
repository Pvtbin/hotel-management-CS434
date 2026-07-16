import { Router } from 'express';
import {
  getRooms, getRoomById, getRoomReviews, getRoomTypes,
  createRoom, updateRoom, deleteRoom, checkAvailability
} from '../controllers/roomController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getRooms);
router.get('/types', getRoomTypes);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);
router.get('/:id/reviews', getRoomReviews);

router.post('/', auth, requireRole('staff', 'admin'), createRoom);
router.put('/:id', auth, requireRole('staff', 'admin'), updateRoom);
router.delete('/:id', auth, requireRole('admin'), deleteRoom);

export default router;
