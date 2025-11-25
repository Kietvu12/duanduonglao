import pool from '../config/database.js';

export const getThucDon = async (req, res, next) => {
  try {
    const { id_benh_nhan, ngay, start_date, end_date } = req.query;

    let query = 'SELECT * FROM thuc_don_ca_nhan WHERE 1=1';
    const params = [];

    if (id_benh_nhan) {
      query += ' AND id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (ngay) {
      query += ' AND ngay = ?';
      params.push(ngay);
    }

    if (start_date && end_date) {
      query += ' AND ngay BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY ngay DESC';

    const [thucDons] = await pool.execute(query, params);

    res.json({
      success: true,
      data: thucDons
    });
  } catch (error) {
    next(error);
  }
};

export const createThucDon = async (req, res, next) => {
  try {
    const { id_benh_nhan, ngay, bua_sang, bua_trua, bua_toi, tong_calo } = req.body;

    if (!id_benh_nhan || !ngay) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO thuc_don_ca_nhan (id_benh_nhan, ngay, bua_sang, bua_trua, bua_toi, tong_calo) VALUES (?, ?, ?, ?, ?, ?)',
      [id_benh_nhan, ngay, bua_sang, bua_trua, bua_toi, tong_calo]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo thực đơn thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const getDinhDuongHangNgay = async (req, res, next) => {
  try {
    const { id_benh_nhan, ngay, start_date, end_date } = req.query;

    let query = 'SELECT * FROM dinh_duong_hang_ngay WHERE 1=1';
    const params = [];

    if (id_benh_nhan) {
      query += ' AND id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (ngay) {
      query += ' AND DATE(thoi_gian) = ?';
      params.push(ngay);
    }

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY thoi_gian DESC';

    const [dinhDuongs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: dinhDuongs
    });
  } catch (error) {
    next(error);
  }
};

export const createDinhDuongHangNgay = async (req, res, next) => {
  try {
    const {
      id_benh_nhan, bua_an, mon_an, luong_calo, ti_le_an,
      nuoc_uong_ml, danh_gia_nhai_nuot, ghi_chu, thoi_gian
    } = req.body;

    if (!id_benh_nhan || !bua_an) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    await pool.execute(
      `INSERT INTO dinh_duong_hang_ngay 
       (id_benh_nhan, bua_an, mon_an, luong_calo, ti_le_an, nuoc_uong_ml, danh_gia_nhai_nuot, ghi_chu, thoi_gian)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_benh_nhan, bua_an, mon_an, luong_calo, ti_le_an, nuoc_uong_ml, danh_gia_nhai_nuot, ghi_chu, thoi_gian || new Date()]
    );

    res.status(201).json({
      success: true,
      message: 'Ghi nhận dinh dưỡng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateDinhDuongHangNgay = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      bua_an, mon_an, luong_calo, ti_le_an, nuoc_uong_ml, danh_gia_nhai_nuot, ghi_chu, thoi_gian
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (bua_an !== undefined) {
      updateFields.push('bua_an = ?');
      updateValues.push(bua_an);
    }
    if (mon_an !== undefined) {
      updateFields.push('mon_an = ?');
      updateValues.push(mon_an);
    }
    if (luong_calo !== undefined) {
      updateFields.push('luong_calo = ?');
      updateValues.push(luong_calo);
    }
    if (ti_le_an !== undefined) {
      updateFields.push('ti_le_an = ?');
      updateValues.push(ti_le_an);
    }
    if (nuoc_uong_ml !== undefined) {
      updateFields.push('nuoc_uong_ml = ?');
      updateValues.push(nuoc_uong_ml);
    }
    if (danh_gia_nhai_nuot !== undefined) {
      updateFields.push('danh_gia_nhai_nuot = ?');
      updateValues.push(danh_gia_nhai_nuot);
    }
    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu);
    }
    if (thoi_gian !== undefined) {
      updateFields.push('thoi_gian = ?');
      updateValues.push(thoi_gian);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE dinh_duong_hang_ngay SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật dinh dưỡng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDinhDuongHangNgay = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM dinh_duong_hang_ngay WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa dinh dưỡng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateThucDon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bua_sang, bua_trua, bua_toi, tong_calo } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (bua_sang !== undefined) {
      updateFields.push('bua_sang = ?');
      updateValues.push(bua_sang);
    }
    if (bua_trua !== undefined) {
      updateFields.push('bua_trua = ?');
      updateValues.push(bua_trua);
    }
    if (bua_toi !== undefined) {
      updateFields.push('bua_toi = ?');
      updateValues.push(bua_toi);
    }
    if (tong_calo !== undefined) {
      updateFields.push('tong_calo = ?');
      updateValues.push(tong_calo);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE thuc_don_ca_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật thực đơn thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteThucDon = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM thuc_don_ca_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa thực đơn thành công'
    });
  } catch (error) {
    next(error);
  }
};

