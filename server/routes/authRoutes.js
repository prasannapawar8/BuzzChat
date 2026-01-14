import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.put('/update', protect, updateProfile);
router.get('/users', protect, getAllUsers);

export default router;
