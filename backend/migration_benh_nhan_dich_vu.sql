-- Migration: Tạo bảng benh_nhan_dich_vu và loại bỏ loai_dich_vu từ benh_nhan

-- Tạo bảng benh_nhan_dich_vu (bảng trung gian)
CREATE TABLE IF NOT EXISTS `benh_nhan_dich_vu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint(20) NOT NULL,
  `id_dich_vu` bigint(20) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `hinh_thuc_thanh_toan` enum('thang','quy','nam') DEFAULT 'thang',
  `thanh_tien` int(11) DEFAULT 0,
  `da_thanh_toan` int(11) DEFAULT 0,
  `cong_no_con_lai` int(11) DEFAULT 0,
  `ngay_thanh_toan_lan_cuoi` date DEFAULT NULL,
  `trang_thai` enum('dang_su_dung','tam_dung','ket_thuc') DEFAULT 'dang_su_dung',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_id_dich_vu` (`id_dich_vu`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_bat_dau` (`ngay_bat_dau`),
  CONSTRAINT `fk_benh_nhan_dich_vu_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_benh_nhan_dich_vu_dich_vu` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Loại bỏ cột loai_dich_vu khỏi bảng benh_nhan (nếu cần)
-- ALTER TABLE `benh_nhan` DROP COLUMN IF EXISTS `loai_dich_vu`;

-- Note: Nếu muốn giữ lại dữ liệu cũ, có thể chuyển dữ liệu từ loai_dich_vu sang benh_nhan_dich_vu trước khi xóa cột

