import pool from '../config/database.js';

export const getAllTinTuyenDung = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, trang_thai } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM tin_tuyen_dung WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (tieu_de LIKE ? OR vi_tri LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY ngay_dang DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [tinTuyenDungs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: tinTuyenDungs
    });
  } catch (error) {
    next(error);
  }
};

export const getTinTuyenDungById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [tinTuyenDungs] = await pool.execute(
      'SELECT * FROM tin_tuyen_dung WHERE id = ?',
      [id]
    );

    if (tinTuyenDungs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tuyển dụng'
      });
    }

    // Get applications
    const [applications] = await pool.execute(
      'SELECT * FROM ho_so_ung_tuyen WHERE id_tin_tuyen_dung = ? ORDER BY ngay_nop DESC',
      [id]
    );
    tinTuyenDungs[0].ho_so_ung_tuyen = applications;

    res.json({
      success: true,
      data: tinTuyenDungs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createTinTuyenDung = async (req, res, next) => {
  try {
    const { tieu_de, mo_ta, vi_tri, yeu_cau, so_luong, ngay_het_han, trang_thai } = req.body;

    if (!tieu_de || !vi_tri) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO tin_tuyen_dung (tieu_de, mo_ta, vi_tri, yeu_cau, so_luong, ngay_het_han, trang_thai)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tieu_de, mo_ta, vi_tri, yeu_cau, so_luong || 1, ngay_het_han, trang_thai || 'dang_tuyen']
    );

    res.status(201).json({
      success: true,
      message: 'Tạo tin tuyển dụng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTinTuyenDung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = ['tieu_de', 'mo_ta', 'vi_tri', 'yeu_cau', 'so_luong', 'ngay_het_han', 'trang_thai'];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
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
      `UPDATE tin_tuyen_dung SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật tin tuyển dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTinTuyenDung = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM tin_tuyen_dung WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa tin tuyển dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Ho so ung tuyen
export const getAllHoSoUngTuyen = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, id_tin_tuyen_dung, trang_thai } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT hs.*, tt.tieu_de as ten_tin_tuyen_dung, tt.vi_tri
      FROM ho_so_ung_tuyen hs
      JOIN tin_tuyen_dung tt ON hs.id_tin_tuyen_dung = tt.id
      WHERE 1=1
    `;
    const params = [];

    if (id_tin_tuyen_dung) {
      query += ' AND hs.id_tin_tuyen_dung = ?';
      params.push(id_tin_tuyen_dung);
    }

    if (trang_thai) {
      query += ' AND hs.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY hs.ngay_nop DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [hoSos] = await pool.execute(query, params);

    res.json({
      success: true,
      data: hoSos
    });
  } catch (error) {
    next(error);
  }
};

export const updateHoSoUngTuyen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai, diem_ai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }
    if (diem_ai !== undefined) {
      updateFields.push('diem_ai = ?');
      updateValues.push(diem_ai);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE ho_so_ung_tuyen SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật hồ sơ ứng tuyển thành công'
    });
  } catch (error) {
    next(error);
  }
};

