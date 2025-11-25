import pool from '../config/database.js';

export const getAllSuKien = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, trang_thai, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM su_kien WHERE da_xoa = 0';
    const params = [];

    if (search) {
      query += ' AND tieu_de LIKE ?';
      params.push(`%${search}%`);
    }

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    if (start_date && end_date) {
      query += ' AND DATE(ngay) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY ngay DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [suKiens] = await pool.execute(query, params);

    // Get media for each event
    for (let suKien of suKiens) {
      const [media] = await pool.execute(
        'SELECT * FROM media_su_kien WHERE id_su_kien = ?',
        [suKien.id]
      );
      suKien.media = media;
    }

    res.json({
      success: true,
      data: suKiens
    });
  } catch (error) {
    next(error);
  }
};

export const getSuKienById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [suKiens] = await pool.execute(
      'SELECT * FROM su_kien WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (suKiens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sự kiện'
      });
    }

    const suKien = suKiens[0];

    // Get media
    const [media] = await pool.execute(
      'SELECT * FROM media_su_kien WHERE id_su_kien = ?',
      [id]
    );
    suKien.media = media;

    // Get participants
    const [participants] = await pool.execute(
      `SELECT ntsk.*, 
              COALESCE(bn.ho_ten, nt.ho_ten) as ten_nguoi_tham_gia,
              CASE WHEN ntsk.id_benh_nhan IS NOT NULL THEN 'benh_nhan' ELSE 'nguoi_than' END as loai
       FROM nguoi_tham_gia_su_kien ntsk
       LEFT JOIN benh_nhan bn ON ntsk.id_benh_nhan = bn.id
       LEFT JOIN nguoi_than_benh_nhan nt ON ntsk.id_nguoi_than = nt.id
       WHERE ntsk.id_su_kien = ?`,
      [id]
    );
    suKien.nguoi_tham_gia = participants;

    // Get assignments
    const [assignments] = await pool.execute(
      `SELECT pcs.*, tk.ho_ten
       FROM phan_cong_su_kien pcs
       JOIN tai_khoan tk ON pcs.id_nhan_vien = tk.id
       WHERE pcs.id_su_kien = ?`,
      [id]
    );
    suKien.phan_cong = assignments;

    res.json({
      success: true,
      data: suKien
    });
  } catch (error) {
    next(error);
  }
};

export const createSuKien = async (req, res, next) => {
  try {
    const { tieu_de, mo_ta, ngay, dia_diem, ngan_sach, anh_dai_dien, video } = req.body;

    if (!tieu_de || !ngay) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO su_kien (tieu_de, mo_ta, ngay, dia_diem, ngan_sach, anh_dai_dien, video)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tieu_de || null,
        mo_ta || null,
        ngay || null,
        dia_diem || null,
        ngan_sach || null,
        anh_dai_dien || null,
        video || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo sự kiện thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tieu_de, mo_ta, ngay, dia_diem, ngan_sach, anh_dai_dien, video, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    const allowedFields = ['tieu_de', 'mo_ta', 'ngay', 'dia_diem', 'ngan_sach', 'anh_dai_dien', 'video', 'trang_thai'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // Convert undefined to null for SQL
        const value = req.body[field];
        updateValues.push(value !== undefined ? (value || null) : null);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE su_kien SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật sự kiện thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE su_kien SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa sự kiện thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ========== Quản lý người tham gia sự kiện ==========

// Thêm người tham gia sự kiện
export const addNguoiThamGia = async (req, res, next) => {
  try {
    const { id } = req.params; // id_su_kien
    const { id_benh_nhan, id_nguoi_than } = req.body;

    if (!id_benh_nhan && !id_nguoi_than) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn bệnh nhân hoặc người thân'
      });
    }

    if (id_benh_nhan && id_nguoi_than) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể chọn bệnh nhân hoặc người thân, không thể chọn cả hai'
      });
    }

    // Kiểm tra xem đã tham gia chưa
    let checkQuery = '';
    let checkParams = [];
    if (id_benh_nhan) {
      checkQuery = 'SELECT id FROM nguoi_tham_gia_su_kien WHERE id_su_kien = ? AND id_benh_nhan = ?';
      checkParams = [id, id_benh_nhan];
    } else {
      checkQuery = 'SELECT id FROM nguoi_tham_gia_su_kien WHERE id_su_kien = ? AND id_nguoi_than = ?';
      checkParams = [id, id_nguoi_than];
    }

    const [existing] = await pool.execute(checkQuery, checkParams);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Người này đã tham gia sự kiện'
      });
    }

    await pool.execute(
      `INSERT INTO nguoi_tham_gia_su_kien (id_su_kien, id_benh_nhan, id_nguoi_than, xac_nhan)
       VALUES (?, ?, ?, 0)`,
      [id, id_benh_nhan || null, id_nguoi_than || null]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm người tham gia thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa người tham gia sự kiện
export const removeNguoiThamGia = async (req, res, next) => {
  try {
    const { id, participantId } = req.params; // id_su_kien, participantId

    await pool.execute(
      'DELETE FROM nguoi_tham_gia_su_kien WHERE id = ? AND id_su_kien = ?',
      [participantId, id]
    );

    res.json({
      success: true,
      message: 'Xóa người tham gia thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xác nhận tham gia sự kiện
export const xacNhanThamGia = async (req, res, next) => {
  try {
    const { id, participantId } = req.params; // id_su_kien, participantId
    const { xac_nhan } = req.body;

    await pool.execute(
      'UPDATE nguoi_tham_gia_su_kien SET xac_nhan = ? WHERE id = ? AND id_su_kien = ?',
      [xac_nhan ? 1 : 0, participantId, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái xác nhận thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách người tham gia sự kiện
export const getNguoiThamGia = async (req, res, next) => {
  try {
    const { id } = req.params; // id_su_kien

    const [participants] = await pool.execute(
      `SELECT ntsk.*, 
              COALESCE(bn.ho_ten, nt.ho_ten) as ten_nguoi_tham_gia,
              nt.so_dien_thoai as so_dien_thoai,
              CASE WHEN ntsk.id_benh_nhan IS NOT NULL THEN 'benh_nhan' ELSE 'nguoi_than' END as loai
       FROM nguoi_tham_gia_su_kien ntsk
       LEFT JOIN benh_nhan bn ON ntsk.id_benh_nhan = bn.id
       LEFT JOIN nguoi_than_benh_nhan nt ON ntsk.id_nguoi_than = nt.id
       WHERE ntsk.id_su_kien = ?
       ORDER BY ntsk.ngay_tao DESC`,
      [id]
    );

    res.json({
      success: true,
      data: participants
    });
  } catch (error) {
    next(error);
  }
};

// ========== Quản lý phân công sự kiện ==========

// Phân công nhân viên cho sự kiện
export const phanCongNhanVien = async (req, res, next) => {
  try {
    const { id } = req.params; // id_su_kien
    const { id_nhan_vien, vai_tro } = req.body;

    if (!id_nhan_vien) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn nhân viên'
      });
    }

    // Kiểm tra xem đã được phân công chưa
    const [existing] = await pool.execute(
      'SELECT id FROM phan_cong_su_kien WHERE id_su_kien = ? AND id_nhan_vien = ?',
      [id, id_nhan_vien]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Nhân viên này đã được phân công cho sự kiện'
      });
    }

    await pool.execute(
      `INSERT INTO phan_cong_su_kien (id_su_kien, id_nhan_vien, vai_tro)
       VALUES (?, ?, ?)`,
      [id, id_nhan_vien, vai_tro || null]
    );

    res.status(201).json({
      success: true,
      message: 'Phân công nhân viên thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa phân công nhân viên
export const removePhanCong = async (req, res, next) => {
  try {
    const { id, assignmentId } = req.params; // id_su_kien, assignmentId

    await pool.execute(
      'DELETE FROM phan_cong_su_kien WHERE id = ? AND id_su_kien = ?',
      [assignmentId, id]
    );

    res.json({
      success: true,
      message: 'Xóa phân công thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật vai trò phân công
export const updatePhanCong = async (req, res, next) => {
  try {
    const { id, assignmentId } = req.params; // id_su_kien, assignmentId
    const { vai_tro } = req.body;

    await pool.execute(
      'UPDATE phan_cong_su_kien SET vai_tro = ? WHERE id = ? AND id_su_kien = ?',
      [vai_tro || null, assignmentId, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật phân công thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách phân công sự kiện
export const getPhanCong = async (req, res, next) => {
  try {
    const { id } = req.params; // id_su_kien

    const [assignments] = await pool.execute(
      `SELECT pcs.*, tk.ho_ten, tk.email, tk.so_dien_thoai, tk.vai_tro as vai_tro_nhan_vien
       FROM phan_cong_su_kien pcs
       JOIN tai_khoan tk ON pcs.id_nhan_vien = tk.id
       WHERE pcs.id_su_kien = ?
       ORDER BY pcs.ngay_tao DESC`,
      [id]
    );

    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

