-- Migration: Thêm bảng phan_khu và phong
-- Mỗi phòng có 3 ảnh

-- Bảng phân khu
CREATE TABLE IF NOT EXISTS `phan_khu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ten_khu` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `so_tang` int(11) DEFAULT NULL,
  `so_phong` int(11) DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ten_khu` (`ten_khu`),
  KEY `idx_da_xoa` (`da_xoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng phòng
CREATE TABLE IF NOT EXISTS `phong` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_phan_khu` bigint(20) NOT NULL,
  `ten_phong` varchar(255) NOT NULL,
  `so_phong` varchar(50) DEFAULT NULL,
  `so_giuong` int(11) DEFAULT NULL,
  `so_nguoi_toi_da` int(11) DEFAULT 1,
  `dien_tich` decimal(10,2) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('trong','co_nguoi','bao_tri') DEFAULT 'trong',
  `anh_1` text DEFAULT NULL,
  `anh_2` text DEFAULT NULL,
  `anh_3` text DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_phan_khu` (`id_phan_khu`),
  KEY `idx_ten_phong` (`ten_phong`),
  KEY `idx_so_phong` (`so_phong`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_da_xoa` (`da_xoa`),
  CONSTRAINT `fk_phong_phan_khu` FOREIGN KEY (`id_phan_khu`) REFERENCES `phan_khu` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

