import { Router } from 'express';
import multer from 'multer';
import {
  uploadFile,
  listUploads,
  getUpload,
  deleteUpload,
} from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// All routes require authentication
router.use(authenticate);

// POST /api/upload - Upload a file
router.post('/', upload.single('file'), uploadFile);

// GET /api/uploads - List all uploads for the user
router.get('/', listUploads);

// GET /api/uploads/:id - Get a specific upload
router.get('/:id', getUpload);

// DELETE /api/uploads/:id - Delete an upload
router.delete('/:id', deleteUpload);

export default router;
