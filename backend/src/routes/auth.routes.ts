import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  registerValidation,
  loginValidation,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, register);

// POST /api/auth/login - Login user
router.post('/login', loginValidation, login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, getCurrentUser);

export default router;
