-- Migration: Thay đổi cấu trúc bảng phong_o_benh_nhan
-- Từ: id, id_benh_nhan, khu, phong, giuong, ngay_tao, ngay_cap_nhat
-- Thành: id, id_benh_nhan, id_phong, ngay_bat_dau_o, ngay_ket_thuc_o

-- Bước 1: Tạo bảng tạm để lưu dữ liệu cũ
CREATE TABLE IF NOT EXISTS `phong_o_benh_nhan_backup` AS 
SELECT * FROM `phong_o_benh_nhan`;

-- Bước 2: Xóa foreign key constraint cũ (nếu có)
-- Lưu ý: Cần kiểm tra tên constraint trước khi xóa
-- Có thể chạy: SHOW CREATE TABLE phong_o_benh_nhan; để xem tên constraint
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND REFERENCED_TABLE_NAME = 'benh_nhan'
    LIMIT 1
);

SET @sql = IF(@constraint_name IS NOT NULL, 
    CONCAT('ALTER TABLE `phong_o_benh_nhan` DROP FOREIGN KEY `', @constraint_name, '`'),
    'SELECT "No foreign key to drop"'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bước 3: Thêm các cột mới
-- Lưu ý: Cần migrate dữ liệu từ khu, phong sang id_phong trước
-- Tạm thời giữ lại các cột cũ để migrate dữ liệu

-- Kiểm tra và thêm cột id_phong nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'id_phong'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `phong_o_benh_nhan` ADD COLUMN `id_phong` bigint(20) DEFAULT NULL AFTER `id_benh_nhan`',
    'SELECT "Column id_phong already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra và thêm cột ngay_bat_dau_o nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'ngay_bat_dau_o'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `phong_o_benh_nhan` ADD COLUMN `ngay_bat_dau_o` date DEFAULT NULL AFTER `id_phong`',
    'SELECT "Column ngay_bat_dau_o already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra và thêm cột ngay_ket_thuc_o nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'ngay_ket_thuc_o'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `phong_o_benh_nhan` ADD COLUMN `ngay_ket_thuc_o` date DEFAULT NULL AFTER `ngay_bat_dau_o`',
    'SELECT "Column ngay_ket_thuc_o already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bước 4: Migrate dữ liệu từ khu, phong sang id_phong
-- Tìm id_phong dựa trên khu và phong
UPDATE `phong_o_benh_nhan` pobn
INNER JOIN `phan_khu` pk ON pk.ten_khu = pobn.khu
INNER JOIN `phong` p ON p.id_phan_khu = pk.id
  AND (p.so_phong = pobn.phong OR p.ten_phong = pobn.phong)
  AND p.da_xoa = 0
SET pobn.id_phong = p.id,
    pobn.ngay_bat_dau_o = COALESCE(DATE(pobn.ngay_tao), CURDATE())
WHERE pobn.id_phong IS NULL 
  AND pobn.khu IS NOT NULL 
  AND pobn.phong IS NOT NULL;

-- Bước 5: Xóa các cột cũ (chỉ xóa nếu đã migrate xong)
-- Lưu ý: Chỉ xóa nếu đã chắc chắn dữ liệu đã được migrate
-- Có thể comment lại nếu muốn giữ dữ liệu cũ để kiểm tra

-- Xóa cột khu
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'khu'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `phong_o_benh_nhan` DROP COLUMN `khu`',
    'SELECT "Column khu does not exist"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Xóa cột phong
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'phong'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `phong_o_benh_nhan` DROP COLUMN `phong`',
    'SELECT "Column phong does not exist"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Xóa cột giuong
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'phong_o_benh_nhan' 
      AND COLUMN_NAME = 'giuong'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `phong_o_benh_nhan` DROP COLUMN `giuong`',
    'SELECT "Column giuong does not exist"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bước 6: Thêm foreign key constraint mới
ALTER TABLE `phong_o_benh_nhan`
ADD CONSTRAINT `fk_phong_o_benh_nhan_phong` 
FOREIGN KEY (`id_phong`) REFERENCES `phong` (`id`) ON DELETE RESTRICT,
ADD CONSTRAINT `fk_phong_o_benh_nhan_benh_nhan` 
FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- Bước 7: Thêm index
ALTER TABLE `phong_o_benh_nhan`
ADD INDEX `idx_id_phong` (`id_phong`),
ADD INDEX `idx_ngay_bat_dau_o` (`ngay_bat_dau_o`),
ADD INDEX `idx_ngay_ket_thuc_o` (`ngay_ket_thuc_o`);

-- Bước 8: Xóa bảng backup sau khi đã kiểm tra (tùy chọn)
-- DROP TABLE IF EXISTS `phong_o_benh_nhan_backup`;

