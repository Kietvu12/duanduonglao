import pool from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';

export const getAllNhanVien = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, vai_tro } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT tk.*, hsnv.chuc_vu, hsnv.bang_cap, hsnv.luong_co_ban
      FROM tai_khoan tk
      LEFT JOIN ho_so_nhan_vien hsnv ON tk.id = hsnv.id_tai_khoan
      WHERE tk.da_xoa = 0 AND tk.vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su')
    `;
    const params = [];

    if (search) {
      query += ' AND (tk.ho_ten LIKE ? OR tk.so_dien_thoai LIKE ? OR tk.email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (vai_tro) {
      query += ' AND tk.vai_tro = ?';
      params.push(vai_tro);
    }

    query += ' ORDER BY tk.ngay_tao DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [nhanViens] = await pool.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM tai_khoan 
      WHERE da_xoa = 0 AND vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su')
    `;
    const countParams = [];

    if (search) {
      countQuery += ' AND (ho_ten LIKE ? OR so_dien_thoai LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    if (vai_tro) {
      countQuery += ' AND vai_tro = ?';
      countParams.push(vai_tro);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: nhanViens,
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

export const getNhanVienById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [nhanViens] = await pool.execute(
      `SELECT tk.*, hsnv.* 
       FROM tai_khoan tk
       LEFT JOIN ho_so_nhan_vien hsnv ON tk.id = hsnv.id_tai_khoan
       WHERE tk.id = ? AND tk.da_xoa = 0`,
      [id]
    );

    if (nhanViens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    // Get KPI
    const [kpis] = await pool.execute(
      'SELECT * FROM kpi_nhan_vien WHERE id_tai_khoan = ? ORDER BY nam DESC, thang DESC LIMIT 12',
      [id]
    );

    // Get lịch phân ca
    const [lichPhanCa] = await pool.execute(
      'SELECT * FROM lich_phan_ca WHERE id_tai_khoan = ? AND ngay >= CURDATE() ORDER BY ngay ASC LIMIT 30',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...nhanViens[0],
        kpi: kpis,
        lich_phan_ca: lichPhanCa
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNhanVien = async (req, res, next) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, chuc_vu, bang_cap, luong_co_ban } = req.body;

    if (!ho_ten || !so_dien_thoai || !email || !mat_khau || !vai_tro) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if phone or email exists
    const [existing] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE so_dien_thoai = ? OR email = ?',
      [so_dien_thoai, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc email đã được sử dụng'
      });
    }

    const hashedPassword = await hashPassword(mat_khau);

    // Create account
    const [result] = await pool.execute(
      `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro)
       VALUES (?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, email, hashedPassword, vai_tro]
    );

    // Create employee profile
    // Sanitize values - convert empty strings to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    if (chuc_vu || bang_cap || luong_co_ban) {
      await pool.execute(
        `INSERT INTO ho_so_nhan_vien (id_tai_khoan, chuc_vu, bang_cap, luong_co_ban, ngay_bat_dau)
         VALUES (?, ?, ?, ?, CURDATE())`,
        [result.insertId, sanitizeValue(chuc_vu), sanitizeValue(bang_cap), sanitizeValue(luong_co_ban)]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateNhanVien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ho_ten, email, chuc_vu, bang_cap, luong_co_ban, trang_thai } = req.body;

    // Update account
    const updateFields = [];
    const updateValues = [];

    if (ho_ten) {
      updateFields.push('ho_ten = ?');
      updateValues.push(ho_ten);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await pool.execute(
        `UPDATE tai_khoan SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update employee profile
    const [existingProfile] = await pool.execute(
      'SELECT id FROM ho_so_nhan_vien WHERE id_tai_khoan = ?',
      [id]
    );

    const profileFields = [];
    const profileValues = [];

    if (chuc_vu !== undefined) {
      profileFields.push('chuc_vu = ?');
      profileValues.push(chuc_vu);
    }
    if (bang_cap !== undefined) {
      profileFields.push('bang_cap = ?');
      profileValues.push(bang_cap);
    }
    if (luong_co_ban !== undefined) {
      profileFields.push('luong_co_ban = ?');
      profileValues.push(luong_co_ban);
    }

    if (profileFields.length > 0) {
      if (existingProfile.length > 0) {
        profileValues.push(id);
        await pool.execute(
          `UPDATE ho_so_nhan_vien SET ${profileFields.join(', ')} WHERE id_tai_khoan = ?`,
          profileValues
        );
      } else {
        profileValues.unshift(id);
        await pool.execute(
          `INSERT INTO ho_so_nhan_vien (id_tai_khoan, ${profileFields.map(f => f.split(' = ')[0]).join(', ')}, ngay_bat_dau)
           VALUES (?, ${profileFields.map(() => '?').join(', ')}, CURDATE())`,
          profileValues
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Phân ca làm việc
export const getLichPhanCa = async (req, res, next) => {
  try {
    const { start_date, end_date, ca, id_tai_khoan } = req.query;

    let query = `
      SELECT lpc.*, tk.ho_ten, tk.vai_tro
      FROM lich_phan_ca lpc
      JOIN tai_khoan tk ON lpc.id_tai_khoan = tk.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(lpc.ngay) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (ca) {
      query += ' AND lpc.ca = ?';
      params.push(ca);
    }

    if (id_tai_khoan) {
      query += ' AND lpc.id_tai_khoan = ?';
      params.push(id_tai_khoan);
    }

    query += ' ORDER BY lpc.ngay ASC, lpc.gio_bat_dau ASC';

    const [lichPhanCas] = await pool.execute(query, params);

    // Format dates to ensure YYYY-MM-DD format (avoid timezone issues)
    const formattedLichPhanCas = lichPhanCas.map(ca => {
      let formattedDate = ca.ngay;
      
      if (ca.ngay instanceof Date) {
        // Use local date components to avoid timezone issues
        const year = ca.ngay.getFullYear();
        const month = String(ca.ngay.getMonth() + 1).padStart(2, '0');
        const day = String(ca.ngay.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else if (typeof ca.ngay === 'string') {
        // Remove time part if exists (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
        formattedDate = ca.ngay.split(' ')[0].split('T')[0];
      }
      
      return {
        ...ca,
        ngay: formattedDate
      };
    });

    res.json({
      success: true,
      data: formattedLichPhanCas
    });
  } catch (error) {
    next(error);
  }
};

export const createLichPhanCa = async (req, res, next) => {
  try {
    const { id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai } = req.body;

    if (!id_tai_khoan || !ca || !ngay || !gio_bat_dau || !gio_ket_thuc) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Validate id_tai_khoan exists
    const [taiKhoan] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE id = ?',
      [id_tai_khoan]
    );

    if (taiKhoan.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ID nhân viên không tồn tại'
      });
    }

    // Format ngay to YYYY-MM-DD if needed
    let formattedNgay = ngay;
    if (ngay instanceof Date) {
      const year = ngay.getFullYear();
      const month = String(ngay.getMonth() + 1).padStart(2, '0');
      const day = String(ngay.getDate()).padStart(2, '0');
      formattedNgay = `${year}-${month}-${day}`;
    } else if (typeof ngay === 'string') {
      // Remove time part if exists
      formattedNgay = ngay.split(' ')[0].split('T')[0];
    }

    // Format time to HH:mm:ss if needed
    // Input type="time" returns HH:mm (24h format), MySQL TIME needs HH:mm:ss
    let formattedGioBatDau = gio_bat_dau;
    let formattedGioKetThuc = gio_ket_thuc;
    
    // Ensure time format is HH:mm:ss
    if (formattedGioBatDau) {
      // Remove any AM/PM if present (shouldn't happen with type="time" but just in case)
      formattedGioBatDau = formattedGioBatDau.replace(/\s*(AM|PM)/i, '').trim();
      // If format is HH:mm, add :00
      if (formattedGioBatDau.length === 5 && formattedGioBatDau.match(/^\d{2}:\d{2}$/)) {
        formattedGioBatDau = `${formattedGioBatDau}:00`;
      }
      // If format is already HH:mm:ss, keep it
      if (formattedGioBatDau.length === 8 && formattedGioBatDau.match(/^\d{2}:\d{2}:\d{2}$/)) {
        // Already correct format
      }
    }
    
    if (formattedGioKetThuc) {
      // Remove any AM/PM if present
      formattedGioKetThuc = formattedGioKetThuc.replace(/\s*(AM|PM)/i, '').trim();
      // If format is HH:mm, add :00
      if (formattedGioKetThuc.length === 5 && formattedGioKetThuc.match(/^\d{2}:\d{2}$/)) {
        formattedGioKetThuc = `${formattedGioKetThuc}:00`;
      }
      // If format is already HH:mm:ss, keep it
      if (formattedGioKetThuc.length === 8 && formattedGioKetThuc.match(/^\d{2}:\d{2}:\d{2}$/)) {
        // Already correct format
      }
    }
    
    console.log('Time formatting:', { 
      original: { gio_bat_dau, gio_ket_thuc },
      formatted: { formattedGioBatDau, formattedGioKetThuc }
    });

    // Default trang_thai is 'du_kien' if not provided
    const finalTrangThai = trang_thai || 'du_kien';

    const [result] = await pool.execute(
      `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_tai_khoan, ca, formattedNgay, formattedGioBatDau, formattedGioKetThuc, finalTrangThai]
    );

    res.status(201).json({
      success: true,
      message: 'Phân ca thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating lich phan ca:', error);
    next(error);
  }
};

export const updateLichPhanCa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ca !== undefined) {
      updateFields.push('ca = ?');
      updateValues.push(ca);
    }
    if (ngay !== undefined) {
      updateFields.push('ngay = ?');
      updateValues.push(ngay);
    }
    if (gio_bat_dau !== undefined) {
      updateFields.push('gio_bat_dau = ?');
      updateValues.push(gio_bat_dau);
    }
    if (gio_ket_thuc !== undefined) {
      updateFields.push('gio_ket_thuc = ?');
      updateValues.push(gio_ket_thuc);
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
      `UPDATE lich_phan_ca SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch phân ca thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Chuyển ca sang người khác
export const chuyenCa = async (req, res, next) => {
  try {
    const { id } = req.params; // ID của phân ca cần chuyển
    const { id_tai_khoan_moi } = req.body; // ID nhân viên mới

    if (!id_tai_khoan_moi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn nhân viên để chuyển ca'
      });
    }

    // Lấy thông tin ca cũ
    const [oldCa] = await pool.execute(
      'SELECT * FROM lich_phan_ca WHERE id = ?',
      [id]
    );

    if (oldCa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân ca'
      });
    }

    const caInfo = oldCa[0];

    // Tạo phân ca mới cho nhân viên mới
    const [result] = await pool.execute(
      `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai)
       VALUES (?, ?, ?, ?, ?, 'du_kien')`,
      [id_tai_khoan_moi, caInfo.ca, caInfo.ngay, caInfo.gio_bat_dau, caInfo.gio_ket_thuc]
    );

    // Cập nhật ca cũ thành "vang"
    await pool.execute(
      'UPDATE lich_phan_ca SET trang_thai = ? WHERE id = ?',
      ['vang', id]
    );

    res.json({
      success: true,
      message: 'Chuyển ca thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLichPhanCa = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM lich_phan_ca WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch phân ca'
      });
    }

    res.json({
      success: true,
      message: 'Xóa lịch phân ca thành công'
    });
  } catch (error) {
    next(error);
  }
};

// KPI
export const createKPI = async (req, res, next) => {
  try {
    const { id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep, 
            so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu } = req.body;

    if (!id_tai_khoan || !thang || !nam) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if KPI already exists
    const [existing] = await pool.execute(
      'SELECT id FROM kpi_nhan_vien WHERE id_tai_khoan = ? AND thang = ? AND nam = ?',
      [id_tai_khoan, thang, nam]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'KPI cho tháng này đã tồn tại'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO kpi_nhan_vien 
       (id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep, 
        so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep,
       so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm KPI thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

