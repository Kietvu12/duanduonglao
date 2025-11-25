import pool from '../config/database.js';

export const getAllPhong = async (req, res, next) => {
  try {
    const { khu, phong } = req.query;

    let query = `
      SELECT po.*, bn.ho_ten, bn.loai_dich_vu
      FROM phong_o_benh_nhan po
      JOIN benh_nhan bn ON po.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (khu) {
      query += ' AND po.khu = ?';
      params.push(khu);
    }

    if (phong) {
      query += ' AND po.phong = ?';
      params.push(phong);
    }

    query += ' ORDER BY po.khu, po.phong, po.giuong';

    const [phongs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: phongs
    });
  } catch (error) {
    next(error);
  }
};

export const getPhongByBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [phongs] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id_benh_nhan = ?',
      [id]
    );

    res.json({
      success: true,
      data: phongs[0] || null
    });
  } catch (error) {
    next(error);
  }
};

export const createPhong = async (req, res, next) => {
  try {
    const { id_benh_nhan, khu, phong, giuong } = req.body;

    if (!id_benh_nhan || !khu || !phong) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if patient already has a room
    const [existing] = await pool.execute(
      'SELECT id FROM phong_o_benh_nhan WHERE id_benh_nhan = ?',
      [id_benh_nhan]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bệnh nhân đã có phòng được phân bổ'
      });
    }

    // Kiểm tra số người tối đa trong phòng
    // Tìm phòng trong bảng phong dựa trên khu và phong
    const [phongInfo] = await pool.execute(
      `SELECT p.*, pk.ten_khu 
       FROM phong p
       JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pk.ten_khu = ? 
         AND (p.so_phong = ? OR p.ten_phong = ?)
         AND p.da_xoa = 0`,
      [khu, phong, phong]
    );

    if (phongInfo.length > 0) {
      const phongData = phongInfo[0];
      // Đếm số bệnh nhân hiện tại trong phòng
      const [currentPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.khu = ? 
           AND (pobn.phong = ? OR pobn.phong = ?)`,
        [khu, phong, phong]
      );

      const currentCount = currentPatients[0]?.count || 0;
      const maxCapacity = phongData.so_nguoi_toi_da || 1;

      if (currentCount >= maxCapacity) {
        return res.status(400).json({
          success: false,
          message: `Phòng đã đầy. Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể thêm bệnh nhân vào phòng này.`
        });
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO phong_o_benh_nhan (id_benh_nhan, khu, phong, giuong) VALUES (?, ?, ?, ?)',
      [id_benh_nhan, khu, phong, giuong]
    );

    // Cập nhật trạng thái phòng nếu có
    if (phongInfo.length > 0) {
      const phongData = phongInfo[0];
      const [currentPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.khu = ? 
           AND (pobn.phong = ? OR pobn.phong = ?)`,
        [khu, phong, phong]
      );
      const newCount = currentPatients[0]?.count || 0;
      const newStatus = newCount > 0 ? 'co_nguoi' : 'trong';
      
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, phongData.id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Phân phòng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { khu, phong, giuong } = req.body;

    // Lấy thông tin phòng hiện tại
    const [currentRoom] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id = ?',
      [id]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân phòng'
      });
    }

    const oldKhu = currentRoom[0].khu;
    const oldPhong = currentRoom[0].phong;
    const newKhu = khu !== undefined ? khu : oldKhu;
    const newPhong = phong !== undefined ? phong : oldPhong;

    // Nếu đổi phòng, kiểm tra số người tối đa
    if ((khu !== undefined && khu !== oldKhu) || (phong !== undefined && phong !== oldPhong)) {
      const [phongInfo] = await pool.execute(
        `SELECT p.*, pk.ten_khu 
         FROM phong p
         JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pk.ten_khu = ? 
           AND (p.so_phong = ? OR p.ten_phong = ?)
           AND p.da_xoa = 0`,
        [newKhu, newPhong, newPhong]
      );

      if (phongInfo.length > 0) {
        const phongData = phongInfo[0];
        // Đếm số bệnh nhân hiện tại trong phòng mới (không tính bệnh nhân đang đổi)
        const [currentPatients] = await pool.execute(
          `SELECT COUNT(*) as count 
           FROM phong_o_benh_nhan pobn
           JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
           WHERE bn.da_xoa = 0 
             AND pobn.id != ?
             AND pobn.khu = ? 
             AND (pobn.phong = ? OR pobn.phong = ?)`,
          [id, newKhu, newPhong, newPhong]
        );

        const currentCount = currentPatients[0]?.count || 0;
        const maxCapacity = phongData.so_nguoi_toi_da || 1;

        if (currentCount >= maxCapacity) {
          return res.status(400).json({
            success: false,
            message: `Phòng đã đầy. Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể chuyển bệnh nhân vào phòng này.`
          });
        }
      }
    }

    const updateFields = [];
    const updateValues = [];

    if (khu !== undefined) {
      updateFields.push('khu = ?');
      updateValues.push(khu);
    }
    if (phong !== undefined) {
      updateFields.push('phong = ?');
      updateValues.push(phong);
    }
    if (giuong !== undefined) {
      updateFields.push('giuong = ?');
      updateValues.push(giuong);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE phong_o_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Cập nhật trạng thái phòng cũ và mới
    if ((khu !== undefined && khu !== oldKhu) || (phong !== undefined && phong !== oldPhong)) {
      // Cập nhật phòng cũ
      const [oldPhongInfo] = await pool.execute(
        `SELECT p.*, pk.ten_khu 
         FROM phong p
         JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pk.ten_khu = ? 
           AND (p.so_phong = ? OR p.ten_phong = ?)
           AND p.da_xoa = 0`,
        [oldKhu, oldPhong, oldPhong]
      );

      if (oldPhongInfo.length > 0) {
        const [oldPatients] = await pool.execute(
          `SELECT COUNT(*) as count 
           FROM phong_o_benh_nhan pobn
           JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
           WHERE bn.da_xoa = 0 
             AND pobn.khu = ? 
             AND (pobn.phong = ? OR pobn.phong = ?)`,
          [oldKhu, oldPhong, oldPhong]
        );
        const oldCount = oldPatients[0]?.count || 0;
        const oldStatus = oldCount > 0 ? 'co_nguoi' : 'trong';
        await pool.execute(
          'UPDATE phong SET trang_thai = ? WHERE id = ?',
          [oldStatus, oldPhongInfo[0].id]
        );
      }

      // Cập nhật phòng mới
      const [newPhongInfo] = await pool.execute(
        `SELECT p.*, pk.ten_khu 
         FROM phong p
         JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pk.ten_khu = ? 
           AND (p.so_phong = ? OR p.ten_phong = ?)
           AND p.da_xoa = 0`,
        [newKhu, newPhong, newPhong]
      );

      if (newPhongInfo.length > 0) {
        const [newPatients] = await pool.execute(
          `SELECT COUNT(*) as count 
           FROM phong_o_benh_nhan pobn
           JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
           WHERE bn.da_xoa = 0 
             AND pobn.khu = ? 
             AND (pobn.phong = ? OR pobn.phong = ?)`,
          [newKhu, newPhong, newPhong]
        );
        const newCount = newPatients[0]?.count || 0;
        const newStatus = newCount > 0 ? 'co_nguoi' : 'trong';
        await pool.execute(
          'UPDATE phong SET trang_thai = ? WHERE id = ?',
          [newStatus, newPhongInfo[0].id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhong = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy thông tin phòng trước khi xóa
    const [currentRoom] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id = ?',
      [id]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân phòng'
      });
    }

    const { khu, phong } = currentRoom[0];

    // Xóa phân phòng
    await pool.execute('DELETE FROM phong_o_benh_nhan WHERE id = ?', [id]);

    // Cập nhật trạng thái phòng
    const [phongInfo] = await pool.execute(
      `SELECT p.*, pk.ten_khu 
       FROM phong p
       JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pk.ten_khu = ? 
         AND (p.so_phong = ? OR p.ten_phong = ?)
         AND p.da_xoa = 0`,
      [khu, phong, phong]
    );

    if (phongInfo.length > 0) {
      const [remainingPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.khu = ? 
           AND (pobn.phong = ? OR pobn.phong = ?)`,
        [khu, phong, phong]
      );
      const remainingCount = remainingPatients[0]?.count || 0;
      const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
      
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, phongInfo[0].id]
      );
    }

    res.json({
      success: true,
      message: 'Xóa bệnh nhân khỏi phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bệnh nhân khỏi phòng theo id_benh_nhan
export const deletePhongByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;

    // Lấy thông tin phòng trước khi xóa
    const [currentRoom] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id_benh_nhan = ?',
      [id_benh_nhan]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bệnh nhân chưa có phòng được phân bổ'
      });
    }

    const { khu, phong } = currentRoom[0];

    // Xóa phân phòng
    await pool.execute('DELETE FROM phong_o_benh_nhan WHERE id_benh_nhan = ?', [id_benh_nhan]);

    // Cập nhật trạng thái phòng
    const [phongInfo] = await pool.execute(
      `SELECT p.*, pk.ten_khu 
       FROM phong p
       JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pk.ten_khu = ? 
         AND (p.so_phong = ? OR p.ten_phong = ?)
         AND p.da_xoa = 0`,
      [khu, phong, phong]
    );

    if (phongInfo.length > 0) {
      const [remainingPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.khu = ? 
           AND (pobn.phong = ? OR pobn.phong = ?)`,
        [khu, phong, phong]
      );
      const remainingCount = remainingPatients[0]?.count || 0;
      const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
      
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, phongInfo[0].id]
      );
    }

    res.json({
      success: true,
      message: 'Xóa bệnh nhân khỏi phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

