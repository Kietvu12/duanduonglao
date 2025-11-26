import pool from '../config/database.js';

export const getAllBenhNhan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tinh_trang } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, 
             COUNT(DISTINCT nt.id) as so_nguoi_than,
             COUNT(DISTINCT pc.id) as so_dieu_duong
      FROM benh_nhan b
      LEFT JOIN nguoi_than_benh_nhan nt ON b.id = nt.id_benh_nhan
      LEFT JOIN phan_cong_cong_viec pc ON b.id = pc.id_benh_nhan
      WHERE b.da_xoa = 0
    `;
    const params = [];

    if (search) {
      query += ' AND (b.ho_ten LIKE ? OR b.cccd LIKE ? OR b.so_dien_thoai LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' GROUP BY b.id ORDER BY b.ngay_tao DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [benhNhans] = await pool.execute(query, params);

    // Lấy thông tin phòng chi tiết và dịch vụ đang sử dụng cho mỗi bệnh nhân
    for (let benhNhan of benhNhans) {
      const [phongInfo] = await pool.execute(
        `SELECT pobn.*, 
                p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
                pk.ten_khu as ten_khu_phan_khu
         FROM phong_o_benh_nhan pobn
         LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
         LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pobn.id_benh_nhan = ?
         ORDER BY pobn.ngay_bat_dau_o DESC`,
        [benhNhan.id]
      );
      
      // Format thông tin phòng
      benhNhan.phongs = phongInfo.map(p => ({
        id: p.id,
        id_phong: p.id_phong,
        khu: p.ten_khu_phan_khu || '',
        phong: p.so_phong_thuc_te || p.ten_phong || '',
        ten_phong: p.ten_phong || '',
        so_phong: p.so_phong_thuc_te || '',
        ngay_bat_dau_o: p.ngay_bat_dau_o,
        ngay_ket_thuc_o: p.ngay_ket_thuc_o,
        display: `${p.ten_khu_phan_khu || ''}-${p.so_phong_thuc_te || p.ten_phong || ''}`
      }));

      // Lấy dịch vụ đang sử dụng
      const [dichVuInfo] = await pool.execute(
        `SELECT bndv.*, dv.ten_dich_vu
         FROM benh_nhan_dich_vu bndv
         LEFT JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
         WHERE bndv.id_benh_nhan = ? 
           AND bndv.trang_thai = 'dang_su_dung'
         ORDER BY bndv.ngay_bat_dau DESC
         LIMIT 1`,
        [benhNhan.id]
      );

      if (dichVuInfo.length > 0) {
        benhNhan.dich_vu_dang_su_dung = {
          id: dichVuInfo[0].id,
          ten_dich_vu: dichVuInfo[0].ten_dich_vu,
          hinh_thuc_thanh_toan: dichVuInfo[0].hinh_thuc_thanh_toan,
          thanh_tien: dichVuInfo[0].thanh_tien,
          cong_no_con_lai: dichVuInfo[0].cong_no_con_lai
        };
      } else {
        benhNhan.dich_vu_dang_su_dung = null;
      }
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM benh_nhan WHERE da_xoa = 0';
    const countParams = [];

    if (search) {
      countQuery += ' AND (ho_ten LIKE ? OR cccd LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: benhNhans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBenhNhanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [benhNhans] = await pool.execute(
      'SELECT * FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Get related data
    const [nguoiThan] = await pool.execute(
      'SELECT * FROM nguoi_than_benh_nhan WHERE id_benh_nhan = ?',
      [id]
    );

    const [hoSoYTe] = await pool.execute(
      'SELECT * FROM ho_so_y_te_benh_nhan WHERE id_benh_nhan = ?',
      [id]
    );

    const [benhHienTai] = await pool.execute(
      `SELECT bh.*, tb.ten_benh 
       FROM benh_hien_tai bh
       JOIN thong_tin_benh tb ON bh.id_thong_tin_benh = tb.id
       WHERE bh.id_benh_nhan = ?`,
      [id]
    );


    const [phongInfo] = await pool.execute(
      `SELECT pobn.*, 
              p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
              pk.ten_khu as ten_khu_phan_khu
       FROM phong_o_benh_nhan pobn
       LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
       LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pobn.id_benh_nhan = ?
       ORDER BY pobn.ngay_bat_dau_o DESC`,
      [id]
    );
    
    // Format thông tin phòng
    const phongs = phongInfo.map(p => ({
      id: p.id,
      id_phong: p.id_phong,
      khu: p.ten_khu_phan_khu || '',
      phong: p.so_phong_thuc_te || p.ten_phong || '',
      ten_phong: p.ten_phong || '',
      so_phong: p.so_phong_thuc_te || '',
      so_phong_thuc_te: p.so_phong_thuc_te || '',
      ten_khu_phan_khu: p.ten_khu_phan_khu || '',
      ngay_bat_dau_o: p.ngay_bat_dau_o,
      ngay_ket_thuc_o: p.ngay_ket_thuc_o,
      display: `${p.ten_khu_phan_khu || ''}-${p.so_phong_thuc_te || p.ten_phong || ''}`
    }));

    res.json({
      success: true,
      data: {
        ...benhNhans[0],
        nguoi_than: nguoiThan,
        ho_so_y_te: hoSoYTe[0] || null,
        benh_hien_tai: benhHienTai,
        phongs: phongs
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createBenhNhan = async (req, res, next) => {
  try {
    const {
      ho_ten, ngay_sinh, gioi_tinh, cccd, dia_chi, nhom_mau, bhyt,
      phong, tinh_trang_hien_tai, kha_nang_sinh_hoat
    } = req.body;

    if (!ho_ten || !ngay_sinh || !gioi_tinh) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Convert empty strings and undefined to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // Set mặc định tinh_trang_hien_tai là "Đang điều trị" nếu không có giá trị
    const finalTinhTrang = tinh_trang_hien_tai && tinh_trang_hien_tai.trim() !== '' 
      ? tinh_trang_hien_tai 
      : 'Đang điều trị';

    const [result] = await pool.execute(
      `INSERT INTO benh_nhan 
       (ho_ten, ngay_sinh, gioi_tinh, cccd, dia_chi, nhom_mau, bhyt, phong, 
        tinh_trang_hien_tai, kha_nang_sinh_hoat, ngay_nhap_vien)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        ho_ten, 
        ngay_sinh, 
        gioi_tinh, 
        sanitizeValue(cccd), 
        sanitizeValue(dia_chi), 
        sanitizeValue(nhom_mau), 
        sanitizeValue(bhyt), 
        sanitizeValue(phong),
        finalTinhTrang, 
        sanitizeValue(kha_nang_sinh_hoat)
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm bệnh nhân thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if patient exists
    const [benhNhans] = await pool.execute(
      'SELECT id FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    const allowedFields = [
      'ho_ten', 'ngay_sinh', 'gioi_tinh', 'cccd', 'dia_chi', 'nhom_mau',
      'bhyt', 'phong', 'tinh_trang_hien_tai', 'kha_nang_sinh_hoat', 'anh_dai_dien'
    ];

    const updateFields = [];
    const updateValues = [];

    // Helper to sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(sanitizeValue(updateData[field]));
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
      `UPDATE benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật thông tin bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE benh_nhan SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const getChiSoSinhTon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30 } = req.query;

    let query = `
      SELECT * FROM chi_so_sinh_ton 
      WHERE id_benh_nhan = ?
    `;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY thoi_gian DESC LIMIT ?';
    params.push(parseInt(limit));

    const [chiSo] = await pool.execute(query, params);

    res.json({
      success: true,
      data: chiSo
    });
  } catch (error) {
    next(error);
  }
};

export const createChiSoSinhTon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, nhiet_do, nhip_tho, ghi_chu, thoi_gian
    } = req.body;

    await pool.execute(
      `INSERT INTO chi_so_sinh_ton 
       (id_benh_nhan, huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, nhiet_do, nhip_tho, ghi_chu, thoi_gian)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, nhiet_do, nhip_tho, ghi_chu, thoi_gian || new Date()]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số sinh tồn thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateChiSoSinhTon = async (req, res, next) => {
  try {
    const { id, chi_so_id } = req.params;
    const {
      huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, nhiet_do, nhip_tho, ghi_chu, thoi_gian
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (huyet_ap_tam_thu !== undefined) {
      updateFields.push('huyet_ap_tam_thu = ?');
      updateValues.push(huyet_ap_tam_thu);
    }
    if (huyet_ap_tam_truong !== undefined) {
      updateFields.push('huyet_ap_tam_truong = ?');
      updateValues.push(huyet_ap_tam_truong);
    }
    if (nhip_tim !== undefined) {
      updateFields.push('nhip_tim = ?');
      updateValues.push(nhip_tim);
    }
    if (spo2 !== undefined) {
      updateFields.push('spo2 = ?');
      updateValues.push(spo2);
    }
    if (nhiet_do !== undefined) {
      updateFields.push('nhiet_do = ?');
      updateValues.push(nhiet_do);
    }
    if (nhip_tho !== undefined) {
      updateFields.push('nhip_tho = ?');
      updateValues.push(nhip_tho);
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

    updateValues.push(chi_so_id);

    await pool.execute(
      `UPDATE chi_so_sinh_ton SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật chỉ số sinh tồn thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChiSoSinhTon = async (req, res, next) => {
  try {
    const { id, chi_so_id } = req.params;

    await pool.execute(
      'DELETE FROM chi_so_sinh_ton WHERE id = ? AND id_benh_nhan = ?',
      [chi_so_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số sinh tồn thành công'
    });
  } catch (error) {
    next(error);
  }
};

