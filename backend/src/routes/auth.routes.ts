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

router.post('/register', registerValidation, register);

router.post('/login', loginValidation, login);

router.get('/me', authenticate, getCurrentUser);

export default router;
