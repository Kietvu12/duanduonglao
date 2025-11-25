import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

export const register = async (req, res, next) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro } = req.body;

    // Validate required fields
    if (!ho_ten || !so_dien_thoai || !email || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Check if phone or email already exists
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

    // Hash password
    const hashedPassword = await hashPassword(mat_khau);

    // Insert user
    const [result] = await pool.execute(
      `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro) 
       VALUES (?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, email, hashedPassword, vai_tro || 'nguoi_nha']
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        token,
        user: {
          id: result.insertId,
          ho_ten,
          email,
          vai_tro: vai_tro || 'nguoi_nha'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { so_dien_thoai, email, mat_khau } = req.body;

    if ((!so_dien_thoai && !email) || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập số điện thoại/email và mật khẩu'
      });
    }

    // Find user by phone or email
    const query = so_dien_thoai 
      ? 'SELECT * FROM tai_khoan WHERE so_dien_thoai = ? AND da_xoa = 0'
      : 'SELECT * FROM tai_khoan WHERE email = ? AND da_xoa = 0';
    
    const [users] = await pool.execute(query, [so_dien_thoai || email]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại/email hoặc mật khẩu không đúng'
      });
    }

    const user = users[0];

    if (user.trang_thai !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(mat_khau, user.mat_khau);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại/email hoặc mật khẩu không đúng'
      });
    }

    const token = generateToken(user.id);

    // Remove password from response
    delete user.mat_khau;

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, ho_ten, so_dien_thoai, email, avatar, vai_tro, trang_thai, ngay_tao 
       FROM tai_khoan WHERE id = ? AND da_xoa = 0`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { ho_ten, email, avatar } = req.body;
    const userId = req.user.id;

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
    if (avatar) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(userId);

    await pool.execute(
      `UPDATE tai_khoan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { mat_khau_cu, mat_khau_moi } = req.body;

    if (!mat_khau_cu || !mat_khau_moi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới'
      });
    }

    const [users] = await pool.execute(
      'SELECT mat_khau FROM tai_khoan WHERE id = ?',
      [req.user.id]
    );

    const isValidPassword = await comparePassword(mat_khau_cu, users[0].mat_khau);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    const hashedPassword = await hashPassword(mat_khau_moi);

    await pool.execute(
      'UPDATE tai_khoan SET mat_khau = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
};

