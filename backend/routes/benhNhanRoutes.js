import express from 'express';
import {
  getAllBenhNhan,
  getBenhNhanById,
  createBenhNhan,
  updateBenhNhan,
  deleteBenhNhan,
  getChiSoSinhTon,
  createChiSoSinhTon,
  updateChiSoSinhTon,
  deleteChiSoSinhTon
} from '../controllers/benhNhanController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations - require medical or admin roles
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllBenhNhan);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getBenhNhanById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createBenhNhan);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateBenhNhan);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteBenhNhan);

// Chi so sinh ton
router.get('/:id/chi-so-sinh-ton', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getChiSoSinhTon);
router.post('/:id/chi-so-sinh-ton', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createChiSoSinhTon);
router.put('/:id/chi-so-sinh-ton/:chi_so_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateChiSoSinhTon);
router.delete('/:id/chi-so-sinh-ton/:chi_so_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteChiSoSinhTon);

export default router;

