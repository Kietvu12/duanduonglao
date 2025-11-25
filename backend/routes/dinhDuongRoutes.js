import express from 'express';
import {
  getThucDon,
  createThucDon,
  updateThucDon,
  deleteThucDon,
  getDinhDuongHangNgay,
  createDinhDuongHangNgay,
  updateDinhDuongHangNgay,
  deleteDinhDuongHangNgay
} from '../controllers/dinhDuongController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/thuc-don', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getThucDon);
router.post('/thuc-don', authorize('super_admin', 'quan_ly_y_te'), createThucDon);
router.put('/thuc-don/:id', authorize('super_admin', 'quan_ly_y_te'), updateThucDon);
router.delete('/thuc-don/:id', authorize('super_admin', 'quan_ly_y_te'), deleteThucDon);
router.get('/hang-ngay', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getDinhDuongHangNgay);
router.post('/hang-ngay', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createDinhDuongHangNgay);
router.put('/hang-ngay/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateDinhDuongHangNgay);
router.delete('/hang-ngay/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteDinhDuongHangNgay);

export default router;

