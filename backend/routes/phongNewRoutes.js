import express from 'express';
import {
  getAllPhong,
  getPhongById,
  createPhong,
  updatePhong,
  deletePhong
} from '../controllers/phongControllerNew.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('super_admin', 'quan_ly_y_te'), getAllPhong);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te'), getPhongById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createPhong);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updatePhong);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deletePhong);

export default router;

