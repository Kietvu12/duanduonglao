import pool from '../config/database.js';

// Tự động cập nhật trạng thái phân ca
export const updatePhanCaStatus = async () => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

    // Cập nhật các ca đã đến giờ bắt đầu → chuyển sang "dang_truc"
    // Chỉ cập nhật các ca trong ngày hôm nay và chưa kết thúc
    await pool.execute(
      `UPDATE lich_phan_ca 
       SET trang_thai = 'dang_truc'
       WHERE ngay = ? 
         AND TIME(gio_bat_dau) <= TIME(?)
         AND TIME(gio_ket_thuc) > TIME(?)
         AND trang_thai = 'du_kien'`,
      [currentDate, currentTime, currentTime]
    );

    // Cập nhật các ca đã qua giờ kết thúc → chuyển sang "hoan_thanh"
    // Các ca trong quá khứ hoặc đã qua giờ kết thúc hôm nay
    await pool.execute(
      `UPDATE lich_phan_ca 
       SET trang_thai = 'hoan_thanh'
       WHERE (ngay < ? OR (ngay = ? AND TIME(gio_ket_thuc) < TIME(?)))
         AND trang_thai IN ('du_kien', 'dang_truc')
         AND trang_thai != 'vang'`,
      [currentDate, currentDate, currentTime]
    );

    console.log(`[${new Date().toISOString()}] Đã cập nhật trạng thái phân ca`);
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái phân ca:', error);
  }
};

// Chạy scheduler mỗi phút
export const startPhanCaScheduler = () => {
  // Chạy ngay lập tức
  updatePhanCaStatus();
  
  // Sau đó chạy mỗi phút
  setInterval(() => {
    updatePhanCaStatus();
  }, 60000); // 60000ms = 1 phút

  console.log('✅ Phân ca scheduler đã khởi động (chạy mỗi phút)');
};

