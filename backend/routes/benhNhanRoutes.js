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
import {
  getHoSoYTeByBenhNhan,
  createOrUpdateHoSoYTe,
  deleteHoSoYTe
} from '../controllers/hoSoYTeController.js';
import {
  getBenhHienTaiByBenhNhan,
  createBenhHienTai,
  updateBenhHienTai,
  deleteBenhHienTai
} from '../controllers/benhHienTaiController.js';
import {
  getTamLyGiaoTiepByBenhNhan,
  createTamLyGiaoTiep,
  updateTamLyGiaoTiep,
  deleteTamLyGiaoTiep
} from '../controllers/tamLyGiaoTiepController.js';
import {
  getVanDongPhucHoiByBenhNhan,
  createVanDongPhucHoi,
  updateVanDongPhucHoi,
  deleteVanDongPhucHoi
} from '../controllers/vanDongPhucHoiController.js';
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

// Ho so y te
router.get('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getHoSoYTeByBenhNhan);
router.post('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createOrUpdateHoSoYTe);
router.put('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createOrUpdateHoSoYTe);
router.delete('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te'), deleteHoSoYTe);

// Benh hien tai
router.get('/:id_benh_nhan/benh-hien-tai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getBenhHienTaiByBenhNhan);
router.post('/:id_benh_nhan/benh-hien-tai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createBenhHienTai);
router.put('/benh-hien-tai/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateBenhHienTai);
router.delete('/benh-hien-tai/:id', authorize('super_admin', 'quan_ly_y_te'), deleteBenhHienTai);

// Tam ly giao tiep
router.get('/:id_benh_nhan/tam-ly-giao-tiep', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getTamLyGiaoTiepByBenhNhan);
router.post('/:id_benh_nhan/tam-ly-giao-tiep', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createTamLyGiaoTiep);
router.put('/tam-ly-giao-tiep/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateTamLyGiaoTiep);
router.delete('/tam-ly-giao-tiep/:id', authorize('super_admin', 'quan_ly_y_te'), deleteTamLyGiaoTiep);

// Van dong phuc hoi
router.get('/:id_benh_nhan/van-dong-phuc-hoi', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getVanDongPhucHoiByBenhNhan);
router.post('/:id_benh_nhan/van-dong-phuc-hoi', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createVanDongPhucHoi);
router.put('/van-dong-phuc-hoi/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateVanDongPhucHoi);
router.delete('/van-dong-phuc-hoi/:id', authorize('super_admin', 'quan_ly_y_te'), deleteVanDongPhucHoi);

export default router;

