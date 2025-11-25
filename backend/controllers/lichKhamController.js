import pool from '../config/database.js';

export const getAllLichKham = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, start_date, end_date, loai_kham, trang_thai } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT lk.*, bn.ho_ten as ten_benh_nhan, bn.phong
      FROM lich_kham lk
      JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(lk.thoi_gian) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (loai_kham) {
      query += ' AND lk.loai_kham = ?';
      params.push(loai_kham);
    }

    if (trang_thai) {
      query += ' AND lk.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY lk.thoi_gian DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [lichKhams] = await pool.execute(query, params);

    res.json({
      success: true,
      data: lichKhams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLichKhamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lichKhams] = await pool.execute(
      `SELECT lk.*, bn.ho_ten as ten_benh_nhan, bn.phong
       FROM lich_kham lk
       JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
       WHERE lk.id = ?`,
      [id]
    );

    if (lichKhams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch khám'
      });
    }

    res.json({
      success: true,
      data: lichKhams[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createLichKham = async (req, res, next) => {
  try {
    const { id_benh_nhan, loai_kham, bac_si, thoi_gian, ket_qua } = req.body;

    if (!id_benh_nhan || !loai_kham || !thoi_gian) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Sanitize values - convert empty strings and undefined to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const [result] = await pool.execute(
      `INSERT INTO lich_kham (id_benh_nhan, loai_kham, bac_si, thoi_gian, ket_qua)
       VALUES (?, ?, ?, ?, ?)`,
      [id_benh_nhan, loai_kham, sanitizeValue(bac_si), thoi_gian, sanitizeValue(ket_qua)]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo lịch khám thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLichKham = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { loai_kham, bac_si, thoi_gian, ket_qua, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (loai_kham !== undefined) {
      updateFields.push('loai_kham = ?');
      updateValues.push(loai_kham);
    }
    if (bac_si !== undefined) {
      updateFields.push('bac_si = ?');
      updateValues.push(bac_si);
    }
    if (thoi_gian !== undefined) {
      updateFields.push('thoi_gian = ?');
      updateValues.push(thoi_gian);
    }
    if (ket_qua !== undefined) {
      updateFields.push('ket_qua = ?');
      updateValues.push(ket_qua);
    }
    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE lich_kham SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLichKham = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM lich_kham WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa lịch khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Lịch hẹn tư vấn
export const getAllLichHenTuVan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, trang_thai, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM lich_hen_tu_van WHERE 1=1';
    const params = [];

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    if (start_date && end_date) {
      query += ' AND DATE(ngay_mong_muon) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY ngay_mong_muon DESC, gio_mong_muon DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [lichHens] = await pool.execute(query, params);

    res.json({
      success: true,
      data: lichHens
    });
  } catch (error) {
    next(error);
  }
};

export const updateLichHenTuVan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai, ghi_chu } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }
    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu);
    }
    if (trang_thai === 'da_xac_nhan') {
      updateFields.push('nguoi_xac_nhan = ?');
      updateValues.push(req.user.id);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE lich_hen_tu_van SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch hẹn thành công'
    });
  } catch (error) {
    next(error);
  }
};

