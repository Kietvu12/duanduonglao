import pool from '../config/database.js';

export const getAllCongViec = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, id_dieu_duong, id_benh_nhan, trang_thai, muc_uu_tien } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT cv.*, 
             tk.ho_ten as ten_dieu_duong,
             bn.ho_ten as ten_benh_nhan,
             pc.trang_thai, pc.thoi_gian_hoan_thanh
      FROM cong_viec cv
      LEFT JOIN phan_cong_cong_viec pc ON cv.id = pc.id_cong_viec
      LEFT JOIN tai_khoan tk ON pc.id_dieu_duong = tk.id
      LEFT JOIN benh_nhan bn ON pc.id_benh_nhan = bn.id
      WHERE 1=1
    `;
    const params = [];

    if (id_dieu_duong) {
      query += ' AND pc.id_dieu_duong = ?';
      params.push(id_dieu_duong);
    }

    if (id_benh_nhan) {
      query += ' AND pc.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (trang_thai) {
      query += ' AND pc.trang_thai = ?';
      params.push(trang_thai);
    }

    if (muc_uu_tien) {
      query += ' AND cv.muc_uu_tien = ?';
      params.push(muc_uu_tien);
    }

    query += ' ORDER BY cv.thoi_gian_du_kien DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [congViecs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: congViecs
    });
  } catch (error) {
    next(error);
  }
};

export const createCongViec = async (req, res, next) => {
  try {
    const { ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_dieu_duong, id_benh_nhan } = req.body;

    if (!ten_cong_viec) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên công việc'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO cong_viec (ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_nguoi_tao) VALUES (?, ?, ?, ?, ?)',
      [ten_cong_viec, mo_ta, muc_uu_tien || 'trung_binh', thoi_gian_du_kien, req.user.id]
    );

    // Assign if provided
    if (id_dieu_duong && id_benh_nhan) {
      await pool.execute(
        'INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan) VALUES (?, ?, ?)',
        [result.insertId, id_dieu_duong, id_benh_nhan]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Tạo công việc thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const phanCongCongViec = async (req, res, next) => {
  try {
    const { id_cong_viec, id_dieu_duong, id_benh_nhan } = req.body;

    if (!id_cong_viec || !id_dieu_duong || !id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Check if already assigned
    const [existing] = await pool.execute(
      'SELECT id FROM phan_cong_cong_viec WHERE id_cong_viec = ? AND id_dieu_duong = ? AND id_benh_nhan = ?',
      [id_cong_viec, id_dieu_duong, id_benh_nhan]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Công việc đã được phân công'
      });
    }

    await pool.execute(
      'INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan) VALUES (?, ?, ?)',
      [id_cong_viec, id_dieu_duong, id_benh_nhan]
    );

    res.status(201).json({
      success: true,
      message: 'Phân công công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrangThaiCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!trang_thai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn trạng thái'
      });
    }

    const updateData = { trang_thai };
    if (trang_thai === 'hoan_thanh') {
      updateData.thoi_gian_hoan_thanh = new Date();
    }

    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updateData)) {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE phan_cong_cong_viec SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_cong_viec !== undefined) {
      updateFields.push('ten_cong_viec = ?');
      updateValues.push(ten_cong_viec);
    }
    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta);
    }
    if (muc_uu_tien !== undefined) {
      updateFields.push('muc_uu_tien = ?');
      updateValues.push(muc_uu_tien);
    }
    if (thoi_gian_du_kien !== undefined) {
      updateFields.push('thoi_gian_du_kien = ?');
      updateValues.push(thoi_gian_du_kien);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE cong_viec SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete assignments first
    await pool.execute('DELETE FROM phan_cong_cong_viec WHERE id_cong_viec = ?', [id]);
    // Delete the job
    await pool.execute('DELETE FROM cong_viec WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

