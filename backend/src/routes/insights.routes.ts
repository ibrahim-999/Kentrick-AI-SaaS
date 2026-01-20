import { Router } from 'express';
import {
  analyzeUpload,
  getInsights,
  getAIStatus,
} from '../controllers/insights.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/insights/status - Get AI service status
router.get('/status', getAIStatus);

// POST /api/insights/analyze - Analyze an uploaded file
router.post('/analyze', analyzeUpload);

// GET /api/insights/:uploadId - Get insights for an upload
router.get('/:uploadId', getInsights);

export default router;
