import express from 'express';
import {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  getLichPhanCa,
  createLichPhanCa,
  updateLichPhanCa,
  createKPI
} from '../controllers/nhanVienController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Nhân viên
router.get('/', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getAllNhanVien);
router.get('/:id', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getNhanVienById);
router.post('/', authorize('super_admin', 'quan_ly_nhan_su'), createNhanVien);
router.put('/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateNhanVien);

// Lịch phân ca
router.get('/lich-phan-ca/all', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getLichPhanCa);
router.post('/lich-phan-ca', authorize('super_admin', 'quan_ly_nhan_su'), createLichPhanCa);
router.put('/lich-phan-ca/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateLichPhanCa);

// KPI
router.post('/kpi', authorize('super_admin', 'quan_ly_nhan_su'), createKPI);

export default router;

