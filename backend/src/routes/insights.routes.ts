import { Router } from 'express';
import {
  analyzeUpload,
  getInsights,
  getAIStatus,
} from '../controllers/insights.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/status', getAIStatus);

router.post('/analyze', analyzeUpload);

router.get('/:uploadId', getInsights);

export default router;
