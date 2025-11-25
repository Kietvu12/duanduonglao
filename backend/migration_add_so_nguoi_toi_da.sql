-- Migration: Thêm cột so_nguoi_toi_da vào bảng phong
-- Cho phép một phòng chứa nhiều bệnh nhân cùng lúc

ALTER TABLE `phong` 
ADD COLUMN IF NOT EXISTS `so_nguoi_toi_da` int(11) DEFAULT 1 AFTER `so_giuong`;

-- Cập nhật giá trị mặc định cho các phòng hiện có (nếu chưa có giá trị)
UPDATE `phong` 
SET `so_nguoi_toi_da` = 1 
WHERE `so_nguoi_toi_da` IS NULL OR `so_nguoi_toi_da` = 0;

