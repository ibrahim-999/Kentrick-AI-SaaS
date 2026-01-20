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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(authenticate);

router.post('/', upload.single('file'), uploadFile);

router.get('/', listUploads);

router.get('/:id', getUpload);

router.delete('/:id', deleteUpload);

export default router;
