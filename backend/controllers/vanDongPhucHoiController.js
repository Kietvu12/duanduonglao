import pool from '../config/database.js';

// Lấy danh sách vận động phục hồi của bệnh nhân
export const getVanDongPhucHoiByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const { limit = 30 } = req.query;

    const [vanDongPhucHoi] = await pool.execute(
      `SELECT * FROM van_dong_phuc_hoi 
       WHERE id_benh_nhan = ?
       ORDER BY thoi_gian_bat_dau DESC, ngay_tao DESC
       LIMIT ?`,
      [id_benh_nhan, parseInt(limit)]
    );

    res.json({
      success: true,
      data: vanDongPhucHoi
    });
  } catch (error) {
    next(error);
  }
};

// Tạo vận động phục hồi mới
export const createVanDongPhucHoi = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const {
      kha_nang_van_dong,
      loai_bai_tap,
      thoi_gian_bat_dau,
      thoi_luong_phut,
      cuong_do,
      calo_tieu_hao,
      ghi_chu
    } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_benh_nhan'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO van_dong_phuc_hoi 
       (id_benh_nhan, kha_nang_van_dong, loai_bai_tap, thoi_gian_bat_dau, 
        thoi_luong_phut, cuong_do, calo_tieu_hao, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        kha_nang_van_dong || null,
        loai_bai_tap || null,
        thoi_gian_bat_dau || null,
        thoi_luong_phut || null,
        cuong_do || null,
        calo_tieu_hao || null,
        ghi_chu || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm vận động phục hồi thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật vận động phục hồi
export const updateVanDongPhucHoi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      kha_nang_van_dong,
      loai_bai_tap,
      thoi_gian_bat_dau,
      thoi_luong_phut,
      cuong_do,
      calo_tieu_hao,
      ghi_chu
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM van_dong_phuc_hoi WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vận động phục hồi'
      });
    }

    await pool.execute(
      `UPDATE van_dong_phuc_hoi 
       SET kha_nang_van_dong = ?, loai_bai_tap = ?, thoi_gian_bat_dau = ?, 
           thoi_luong_phut = ?, cuong_do = ?, calo_tieu_hao = ?, ghi_chu = ?
       WHERE id = ?`,
      [
        kha_nang_van_dong || null,
        loai_bai_tap || null,
        thoi_gian_bat_dau || null,
        thoi_luong_phut || null,
        cuong_do || null,
        calo_tieu_hao || null,
        ghi_chu || null,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Cập nhật vận động phục hồi thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa vận động phục hồi
export const deleteVanDongPhucHoi = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM van_dong_phuc_hoi WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa vận động phục hồi thành công'
    });
  } catch (error) {
    next(error);
  }
};

