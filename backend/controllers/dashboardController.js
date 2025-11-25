import pool from '../config/database.js';

export const getDashboard = async (req, res, next) => {
  try {
    // Total patients
    const [totalPatients] = await pool.execute(
      'SELECT COUNT(*) as total FROM benh_nhan WHERE da_xoa = 0'
    );

    // Patients by service type
    const [patientsByService] = await pool.execute(
      `SELECT loai_dich_vu, COUNT(*) as so_luong 
       FROM benh_nhan 
       WHERE da_xoa = 0 
       GROUP BY loai_dich_vu`
    );

    // Active staff
    const [activeStaff] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM tai_khoan 
       WHERE vai_tro IN ('dieu_duong', 'dieu_duong_truong') 
       AND trang_thai = 'active' AND da_xoa = 0`
    );

    // Today's appointments
    const [todayAppointments] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM lich_kham 
       WHERE DATE(thoi_gian) = CURDATE()`
    );

    // Today's consultations
    const [todayConsultations] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM lich_hen_tu_van 
       WHERE DATE(ngay_mong_muon) = CURDATE() 
       AND trang_thai IN ('cho_xac_nhan', 'da_xac_nhan')`
    );

    // Recent vital signs alerts (abnormal values)
    const [vitalSignsAlerts] = await pool.execute(
      `SELECT css.*, bn.ho_ten
       FROM chi_so_sinh_ton css
       JOIN benh_nhan bn ON css.id_benh_nhan = bn.id
       WHERE DATE(css.thoi_gian) = CURDATE()
       AND (
         (huyet_ap_tam_thu < 90 OR huyet_ap_tam_thu > 140 OR huyet_ap_tam_truong < 60 OR huyet_ap_tam_truong > 90)
         OR (nhip_tim < 60 OR nhip_tim > 100)
         OR (spo2 < 95)
         OR (nhiet_do < 36 OR nhiet_do > 37.5)
       )
       ORDER BY css.thoi_gian DESC
       LIMIT 10`
    );

    // Upcoming events
    const [upcomingEvents] = await pool.execute(
      `SELECT * FROM su_kien 
       WHERE ngay >= CURDATE() AND da_xoa = 0 
       ORDER BY ngay ASC 
       LIMIT 5`
    );

    // Staff on duty today
    const [staffOnDuty] = await pool.execute(
      `SELECT COUNT(DISTINCT id_tai_khoan) as total 
       FROM lich_phan_ca 
       WHERE ngay = CURDATE() 
       AND trang_thai IN ('du_kien', 'dang_truc')`
    );

    // Recent activities - Get recent patients and appointments separately then combine
    const [recentBenhNhans] = await pool.execute(
      `SELECT 'benh_nhan' as type, ho_ten as title, ngay_tao as time 
       FROM benh_nhan 
       WHERE da_xoa = 0 
       ORDER BY ngay_tao DESC LIMIT 5`
    );

    const [recentLichKhams] = await pool.execute(
      `SELECT 'lich_kham' as type, CONCAT('Lịch khám - ', bn.ho_ten) as title, lk.ngay_tao as time
       FROM lich_kham lk
       JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
       ORDER BY lk.ngay_tao DESC LIMIT 5`
    );

    // Combine and sort
    const recentActivities = [...recentBenhNhans, ...recentLichKhams]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        tong_so_benh_nhan: totalPatients[0].total,
        benh_nhan_theo_dich_vu: patientsByService,
        nhan_vien_dang_lam: activeStaff[0].total,
        nhan_vien_truc_hom_nay: staffOnDuty[0].total,
        lich_kham_hom_nay: todayAppointments[0].total,
        lich_hen_tu_van_hom_nay: todayConsultations[0].total,
        canh_bao_chi_so: vitalSignsAlerts,
        su_kien_sap_toi: upcomingEvents,
        hoat_dong_gan_day: recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBaoCao = async (req, res, next) => {
  try {
    const { type, start_date, end_date } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn loại báo cáo'
      });
    }

    switch (type) {
      case 'benh_nhan':
        const [benhNhanReport] = await pool.execute(
          `SELECT 
            COUNT(*) as tong_so,
            COUNT(CASE WHEN loai_dich_vu = 'noi_tru' THEN 1 END) as noi_tru,
            COUNT(CASE WHEN loai_dich_vu = 'ban_ngay' THEN 1 END) as ban_ngay,
            COUNT(CASE WHEN loai_dich_vu = 'tai_nha' THEN 1 END) as tai_nha,
            COUNT(CASE WHEN kha_nang_sinh_hoat = 'doc_lap' THEN 1 END) as doc_lap,
            COUNT(CASE WHEN kha_nang_sinh_hoat = 'ho_tro' THEN 1 END) as ho_tro,
            COUNT(CASE WHEN kha_nang_sinh_hoat = 'phu_thuoc' THEN 1 END) as phu_thuoc
           FROM benh_nhan 
           WHERE da_xoa = 0
           ${start_date && end_date ? 'AND DATE(ngay_nhap_vien) BETWEEN ? AND ?' : ''}`,
          start_date && end_date ? [start_date, end_date] : []
        );
        return res.json({
          success: true,
          data: benhNhanReport[0]
        });

      case 'nhan_vien':
        const [nhanVienReport] = await pool.execute(
          `SELECT 
            COUNT(*) as tong_so,
            COUNT(CASE WHEN vai_tro = 'dieu_duong' THEN 1 END) as dieu_duong,
            COUNT(CASE WHEN vai_tro = 'dieu_duong_truong' THEN 1 END) as dieu_duong_truong,
            COUNT(CASE WHEN trang_thai = 'active' THEN 1 END) as dang_lam,
            COUNT(CASE WHEN trang_thai = 'inactive' THEN 1 END) as nghi_viec
           FROM tai_khoan 
           WHERE vai_tro IN ('dieu_duong', 'dieu_duong_truong') AND da_xoa = 0`
        );
        return res.json({
          success: true,
          data: nhanVienReport[0]
        });

      case 'lich_kham':
        const [lichKhamReport] = await pool.execute(
          `SELECT 
            COUNT(*) as tong_so,
            COUNT(CASE WHEN loai_kham = 'tong_quat' THEN 1 END) as tong_quat,
            COUNT(CASE WHEN loai_kham = 'chuyen_khoa' THEN 1 END) as chuyen_khoa,
            COUNT(CASE WHEN loai_kham = 'xet_nghiem' THEN 1 END) as xet_nghiem,
            COUNT(CASE WHEN trang_thai = 'da_kham' THEN 1 END) as da_kham,
            COUNT(CASE WHEN trang_thai = 'cho_kham' THEN 1 END) as cho_kham
           FROM lich_kham
           ${start_date && end_date ? 'WHERE DATE(thoi_gian) BETWEEN ? AND ?' : ''}`,
          start_date && end_date ? [start_date, end_date] : []
        );
        return res.json({
          success: true,
          data: lichKhamReport[0]
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Loại báo cáo không hợp lệ'
        });
    }
  } catch (error) {
    next(error);
  }
};

