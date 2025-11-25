-- Migration: Thêm bảng lưu trữ ảnh/video cho bài viết
-- Date: 2025-11-24

-- --------------------------------------------------------

--
-- Table structure for table `media_bai_viet`
--

CREATE TABLE `media_bai_viet` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`),
  ADD KEY `idx_media_bai_viet_thu_tu` (`thu_tu`);

--
-- AUTO_INCREMENT for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD CONSTRAINT `media_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`) ON DELETE CASCADE;


