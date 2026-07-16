import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, toggleUserActive } from '../controllers/userController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, requireRole('staff', 'admin'), getUsers);
router.get('/:id', auth, requireRole('staff', 'admin'), getUserById);
router.post('/', auth, requireRole('admin'), createUser);
router.put('/:id', auth, requireRole('admin'), updateUser);
router.delete('/:id', auth, requireRole('admin'), deleteUser);
router.put('/:id/toggle-active', auth, requireRole('admin'), toggleUserActive);

export default router;
