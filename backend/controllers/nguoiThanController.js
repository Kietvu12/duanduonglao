import pool from '../config/database.js';

export const getAllNguoiThan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.query;

    let query = 'SELECT * FROM nguoi_than_benh_nhan WHERE 1=1';
    const params = [];

    if (id_benh_nhan) {
      query += ' AND id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    query += ' ORDER BY la_nguoi_lien_he_chinh DESC, ngay_tao DESC';

    const [nguoiThans] = await pool.execute(query, params);

    res.json({
      success: true,
      data: nguoiThans
    });
  } catch (error) {
    next(error);
  }
};

export const getNguoiThanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [nguoiThans] = await pool.execute(
      'SELECT * FROM nguoi_than_benh_nhan WHERE id = ?',
      [id]
    );

    if (nguoiThans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thân'
      });
    }

    res.json({
      success: true,
      data: nguoiThans[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createNguoiThan = async (req, res, next) => {
  try {
    const {
      id_benh_nhan, ho_ten, moi_quan_he, so_dien_thoai, email,
      la_nguoi_lien_he_chinh, avatar
    } = req.body;

    if (!id_benh_nhan || !ho_ten || !so_dien_thoai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // If this is set as main contact, unset others
    if (la_nguoi_lien_he_chinh) {
      await pool.execute(
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ?',
        [id_benh_nhan]
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO nguoi_than_benh_nhan 
       (id_benh_nhan, ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_benh_nhan, ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh || 0, avatar]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm người thân thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateNguoiThan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh, avatar
    } = req.body;

    // Get current patient ID
    const [current] = await pool.execute(
      'SELECT id_benh_nhan FROM nguoi_than_benh_nhan WHERE id = ?',
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thân'
      });
    }

    // If this is set as main contact, unset others
    if (la_nguoi_lien_he_chinh) {
      await pool.execute(
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ? AND id != ?',
        [current[0].id_benh_nhan, id]
      );
    }

    const updateFields = [];
    const updateValues = [];

    if (ho_ten !== undefined) {
      updateFields.push('ho_ten = ?');
      updateValues.push(ho_ten);
    }
    if (moi_quan_he !== undefined) {
      updateFields.push('moi_quan_he = ?');
      updateValues.push(moi_quan_he);
    }
    if (so_dien_thoai !== undefined) {
      updateFields.push('so_dien_thoai = ?');
      updateValues.push(so_dien_thoai);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (la_nguoi_lien_he_chinh !== undefined) {
      updateFields.push('la_nguoi_lien_he_chinh = ?');
      updateValues.push(la_nguoi_lien_he_chinh);
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE nguoi_than_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật người thân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNguoiThan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM nguoi_than_benh_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa người thân thành công'
    });
  } catch (error) {
    next(error);
  }
};

