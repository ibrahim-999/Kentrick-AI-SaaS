import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').optional().isString().trim(),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
    });
    return;
  }

  const { email, password, name } = req.body;
  const result = await authService.register({ email, password, name });

  res.status(201).json({
    success: true,
    data: result,
    message: 'User registered successfully',
  });
});

export const login = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
    });
    return;
  }

  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.json({
    success: true,
    data: result,
    message: 'Login successful',
  });
});

export const getCurrentUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);

    res.json({
      success: true,
      data: user,
    });
  }
);
