import express from 'express';
import { uploadFile, uploadMultipleFiles } from '../controllers/uploadController.js';
import { uploadMedia } from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Upload single file (image or video)
router.post('/media', authorize('super_admin', 'marketing'), uploadMedia.single('file'), uploadFile);

// Upload multiple files
router.post('/media/multiple', authorize('super_admin', 'marketing'), uploadMedia.array('files', 10), uploadMultipleFiles);

export default router;

