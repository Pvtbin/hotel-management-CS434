import { Router } from 'express';
import { createReview, getMyReviews, getAllReviews, deleteReview } from '../controllers/reviewController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, requireRole('customer'), createReview);
router.get('/my', auth, getMyReviews);
router.get('/', auth, requireRole('staff', 'admin'), getAllReviews);
router.delete('/:id', auth, requireRole('admin'), deleteReview);

export default router;
