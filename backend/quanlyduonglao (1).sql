-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 11:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlyduonglao`
--

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `trang_thai` enum('nhap','xuat_ban') DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bai_viet`
--

INSERT INTO `bai_viet` (`id`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Hà Nội', 'ha-noi', '<p><br></p><p><br></p><span style=\"display: block; margin: 10px 0px;\"><img src=\"http://localhost:3000/uploads/file-1764041144900-497202417.jpg\" alt=\"Uploaded image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><p><span style=\"white-space: pre-wrap;\">Hà Nội trời thu</span></p><p><br></p><span style=\"display: block; margin: 10px 0px;\"><img src=\"http://localhost:3000/uploads/file-1764041160851-576908118.png\" alt=\"Uploaded image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><p><br></p>', 'http://localhost:3000/uploads/file-1764042477449-264265797.png', 'ew', 'qưeqe', 'Du lịch', '#hanoi,#bunoc', 4, 'xuat_ban', NULL, 0, NULL, 2, '2025-11-25 10:27:34', '2025-11-25 10:47:59'),
(2, 'eqeq', 'qewqeqeq', '<p><span style=\"white-space: pre-wrap;\">ewqqweq</span></p><span style=\"display: block; margin: 10px 0px;\"><img src=\"http://localhost:3000/uploads/file-1764042504393-910714198.png\" alt=\"Uploaded image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><p><span style=\"white-space: pre-wrap;\">eqwewqqwq</span></p><span style=\"display: block; margin: 10px 0px;\"><img src=\"http://localhost:3000/uploads/file-1764042510429-405801153.png\" alt=\"Uploaded image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><p><span style=\"white-space: pre-wrap;\">êweqwqqewqeqw</span></p>', 'http://localhost:3000/uploads/file-1764042518512-647546192.jpg', 'eqqweqweqw', 'qeqeqew', 'qưeqqw', '#dsaadasds', 0, 'nhap', '2025-11-25 10:48:00', 0, NULL, 2, '2025-11-25 10:48:45', '2025-11-25 10:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `bang_gia_dich_vu`
--

CREATE TABLE `bang_gia_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_dich_vu` bigint(20) DEFAULT NULL,
  `gia_thang` int(11) DEFAULT NULL,
  `gia_quy` int(11) DEFAULT NULL,
  `gia_nam` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bang_gia_dich_vu`
--

INSERT INTO `bang_gia_dich_vu` (`id`, `id_dich_vu`, `gia_thang`, `gia_quy`, `gia_nam`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 120000, 500000, 20000000, '2025-11-25 16:30:57', '2025-11-25 16:30:57'),
(2, 2, 200000, 500000, 1000000, '2025-11-25 16:55:51', '2025-11-25 16:55:51');

-- --------------------------------------------------------

--
-- Table structure for table `benh_hien_tai`
--

CREATE TABLE `benh_hien_tai` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_thong_tin_benh` bigint(20) DEFAULT NULL,
  `ngay_phat_hien` date DEFAULT NULL,
  `tinh_trang` enum('dang_dieu_tri','on_dinh','khoi','tai_phat') DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `benh_nhan`
--

CREATE TABLE `benh_nhan` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('nam','nu','khac') DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `nhom_mau` varchar(10) DEFAULT NULL,
  `bhyt` varchar(50) DEFAULT NULL,
  `phong` varchar(50) DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `ngay_nhap_vien` date DEFAULT NULL,
  `tinh_trang_hien_tai` text DEFAULT NULL,
  `kha_nang_sinh_hoat` enum('doc_lap','ho_tro','phu_thuoc') DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benh_nhan`
--

INSERT INTO `benh_nhan` (`id`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `cccd`, `dia_chi`, `nhom_mau`, `bhyt`, `phong`, `anh_dai_dien`, `ngay_nhap_vien`, `tinh_trang_hien_tai`, `kha_nang_sinh_hoat`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Kiệt', '1999-05-05', 'nam', '13113123131221', '112332131', NULL, NULL, '123', NULL, '2025-11-24', NULL, 'doc_lap', 0, NULL, '2025-11-24 10:40:35', '2025-11-24 10:40:35'),
(2, 'HAHA', '2025-11-27', 'nam', '034205667890', '2212', 'AB+', '0221212', NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:07:39', '2025-11-25 15:07:39'),
(3, 'ewqeqe', '2025-10-28', 'nam', '123131', '123131313', NULL, NULL, NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:08:11', '2025-11-25 15:08:11'),
(4, '311232131', '2025-11-27', 'nam', '131311212321', '1312321321', NULL, NULL, NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:08:20', '2025-11-25 15:08:20'),
(5, '313321', '2025-11-14', 'khac', '13123131', '31233121', 'O-', '3123132131', NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:08:32', '2025-11-25 15:08:32'),
(6, '2313131', '2025-11-26', 'nam', '132131', '13221313', NULL, '3213213', NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:08:45', '2025-11-25 15:08:45'),
(7, '123131', '2025-11-13', 'nam', '31213123123', '123131321', NULL, NULL, NULL, NULL, '2025-11-25', NULL, 'doc_lap', 0, NULL, '2025-11-25 15:08:54', '2025-11-25 15:08:54'),
(8, '12332', '1950-09-19', 'nam', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-25', 'Đang điều trị', 'doc_lap', 0, NULL, '2025-11-25 15:20:17', '2025-11-25 15:39:15'),
(9, '12313213', '2025-10-26', 'nam', '321331311321', '312313213121321', 'B', '2313123112123123', NULL, NULL, '2025-11-25', 'Đang điều trị', 'doc_lap', 0, NULL, '2025-11-25 16:52:55', '2025-11-25 17:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `benh_nhan_dich_vu`
--

CREATE TABLE `benh_nhan_dich_vu` (
  `id` bigint(20) NOT NULL,
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
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benh_nhan_dich_vu`
--

INSERT INTO `benh_nhan_dich_vu` (`id`, `id_benh_nhan`, `id_dich_vu`, `ngay_bat_dau`, `ngay_ket_thuc`, `hinh_thuc_thanh_toan`, `thanh_tien`, `da_thanh_toan`, `cong_no_con_lai`, `ngay_thanh_toan_lan_cuoi`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(6, 9, 1, '2025-11-25', '2025-11-25', 'thang', 120000, 120000, 0, NULL, 'ket_thuc', '2025-11-25 17:02:12', '2025-11-25 17:02:55'),
(7, 9, 2, '2025-11-25', NULL, 'thang', 200000, 200000, 0, '2025-11-25', 'dang_su_dung', '2025-11-25 17:02:55', '2025-11-25 17:03:09');

-- --------------------------------------------------------

--
-- Table structure for table `binh_luan_bai_viet`
--

CREATE TABLE `binh_luan_bai_viet` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `ngay_binh_luan` datetime DEFAULT current_timestamp(),
  `duyet` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chi_so_sinh_ton`
--

CREATE TABLE `chi_so_sinh_ton` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `huyet_ap_tam_thu` int(11) DEFAULT NULL,
  `huyet_ap_tam_truong` int(11) DEFAULT NULL,
  `nhip_tim` int(11) DEFAULT NULL,
  `spo2` int(11) DEFAULT NULL,
  `nhiet_do` float DEFAULT NULL,
  `nhip_tho` int(11) DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chi_so_sinh_ton`
--

INSERT INTO `chi_so_sinh_ton` (`id`, `id_benh_nhan`, `huyet_ap_tam_thu`, `huyet_ap_tam_truong`, `nhip_tim`, `spo2`, `nhiet_do`, `nhip_tho`, `thoi_gian`, `ghi_chu`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 9, 121, 21, 21, 21, 12, 21, '2025-11-25 17:07:00', '212', '2025-11-25 17:07:00', '2025-11-25 17:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `cong_viec`
--

CREATE TABLE `cong_viec` (
  `id` bigint(20) NOT NULL,
  `ten_cong_viec` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `muc_uu_tien` enum('thap','trung_binh','cao') DEFAULT NULL,
  `thoi_gian_du_kien` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_nguoi_tao` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cong_viec`
--

INSERT INTO `cong_viec` (`id`, `ten_cong_viec`, `mo_ta`, `muc_uu_tien`, `thoi_gian_du_kien`, `ngay_tao`, `ngay_cap_nhat`, `id_nguoi_tao`) VALUES
(1, 'Thay tã', '', 'trung_binh', '0000-00-00 00:00:00', '2025-11-24 16:26:54', '2025-11-24 16:26:54', 2);

-- --------------------------------------------------------

--
-- Table structure for table `dich_vu`
--

CREATE TABLE `dich_vu` (
  `id` bigint(20) NOT NULL,
  `ten_dich_vu` varchar(255) DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `mo_ta_day_du` text DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dich_vu`
--

INSERT INTO `dich_vu` (`id`, `ten_dich_vu`, `mo_ta_ngan`, `mo_ta_day_du`, `anh_dai_dien`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Nội trú', 'Nội trú', 'Nội trú', NULL, 0, NULL, '2025-11-25 16:30:57', '2025-11-25 16:30:57'),
(2, 'Tại nhà', 'Tại nhà', 'Tại nhà', NULL, 0, NULL, '2025-11-25 16:55:51', '2025-11-25 16:55:51');

-- --------------------------------------------------------

--
-- Table structure for table `diem_rui_ro_ai`
--

CREATE TABLE `diem_rui_ro_ai` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `loai_rui_ro` enum('nga','dot_quy','suy_tim','nhiem_trung') DEFAULT NULL,
  `diem` int(11) DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dinh_duong_hang_ngay`
--

CREATE TABLE `dinh_duong_hang_ngay` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `bua_an` enum('sang','trua','phu_chieu','toi') DEFAULT NULL,
  `mon_an` text DEFAULT NULL,
  `luong_calo` int(11) DEFAULT NULL,
  `ti_le_an` int(11) DEFAULT NULL,
  `nuoc_uong_ml` int(11) DEFAULT NULL,
  `danh_gia_nhai_nuot` enum('tot','trung_binh','kho_khan') DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `don_thuoc`
--

CREATE TABLE `don_thuoc` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_ke` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `don_thuoc`
--

INSERT INTO `don_thuoc` (`id`, `id_benh_nhan`, `mo_ta`, `ngay_ke`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 9, '312313', '2025-11-25', '2025-11-25 17:07:18', '2025-11-25 17:07:18');

-- --------------------------------------------------------

--
-- Table structure for table `do_dung_ca_nhan`
--

CREATE TABLE `do_dung_ca_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `ten_vat_dung` varchar(255) NOT NULL,
  `so_luong` int(11) DEFAULT 1,
  `tinh_trang` enum('tot','hu_hong','mat') DEFAULT 'tot',
  `ghi_chu` text DEFAULT NULL,
  `ngay_them` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoat_dong_sinh_hoat`
--

CREATE TABLE `hoat_dong_sinh_hoat` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gio_di_ngu` time DEFAULT NULL,
  `gio_thuc_day` time DEFAULT NULL,
  `so_lan_thuc_giac` int(11) DEFAULT NULL,
  `chat_luong_giac_ngu` enum('tot','trung_binh','kem') DEFAULT NULL,
  `tam` tinyint(1) DEFAULT NULL,
  `danh_rang` tinyint(1) DEFAULT NULL,
  `thay_quan_ao` tinyint(1) DEFAULT NULL,
  `dai_tien_so_lan` int(11) DEFAULT NULL,
  `dai_tien_tinh_chat` enum('binh_thuong','tao_bon','tieu_chay') DEFAULT NULL,
  `tieu_tien_so_lan` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_nhan_vien`
--

CREATE TABLE `ho_so_nhan_vien` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL,
  `bang_cap` text DEFAULT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `luong_co_ban` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ho_so_nhan_vien`
--

INSERT INTO `ho_so_nhan_vien` (`id`, `id_tai_khoan`, `chuc_vu`, `bang_cap`, `ngay_bat_dau`, `luong_co_ban`, `ngay_tao`, `ngay_cap_nhat`, `avatar`) VALUES
(1, 3, 'Điều Dưỡng', '', '2025-11-24', 0, '2025-11-24 16:25:42', '2025-11-24 16:25:42', NULL),
(2, 4, 'Y tá', NULL, '2025-11-24', NULL, '2025-11-24 16:26:10', '2025-11-24 16:26:10', NULL),
(3, 5, 'Y tá', 'ĐH', '2025-11-24', 4000000, '2025-11-24 16:26:34', '2025-11-25 17:04:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_ung_tuyen`
--

CREATE TABLE `ho_so_ung_tuyen` (
  `id` bigint(20) NOT NULL,
  `id_tin_tuyen_dung` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `file_cv` text DEFAULT NULL,
  `trang_thai` enum('moi_nop','da_xem','phong_van','trung_tuyen','tu_choi') DEFAULT 'moi_nop',
  `ngay_nop` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `diem_ai` int(11) DEFAULT NULL CHECK (`diem_ai` >= 0 and `diem_ai` <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_y_te_benh_nhan`
--

CREATE TABLE `ho_so_y_te_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_loai_benh_ly` bigint(20) DEFAULT NULL,
  `tien_su_benh` text DEFAULT NULL,
  `di_ung_thuoc` text DEFAULT NULL,
  `lich_su_phau_thuat` text DEFAULT NULL,
  `benh_ly_hien_tai` text DEFAULT NULL,
  `ghi_chu_dac_biet` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kpi_nhan_vien`
--

CREATE TABLE `kpi_nhan_vien` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `thang` int(11) NOT NULL,
  `nam` int(11) NOT NULL,
  `ty_le_hoan_thanh_cong_viec` float DEFAULT NULL,
  `so_loi_ghi_chep` int(11) DEFAULT 0,
  `so_lan_tre_ca` int(11) DEFAULT 0,
  `diem_danh_gia_quan_ly` float DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_hen_tu_van`
--

CREATE TABLE `lich_hen_tu_van` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `loai_dich_vu_quan_tam` varchar(255) DEFAULT NULL,
  `ngay_mong_muon` date NOT NULL,
  `gio_mong_muon` time NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('cho_xac_nhan','da_xac_nhan','da_den','huy') DEFAULT 'cho_xac_nhan',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `nguoi_xac_nhan` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_kham`
--

CREATE TABLE `lich_kham` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `loai_kham` enum('tong_quat','chuyen_khoa','xet_nghiem','phuc_hoi') DEFAULT NULL,
  `bac_si` varchar(255) DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ket_qua` text DEFAULT NULL,
  `trang_thai` enum('cho_kham','dang_kham','da_kham') DEFAULT 'cho_kham',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_phan_ca`
--

CREATE TABLE `lich_phan_ca` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ca` enum('sang','chieu','dem') DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `trang_thai` enum('du_kien','dang_truc','hoan_thanh','vang') DEFAULT 'du_kien',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_phong_van`
--

CREATE TABLE `lich_phong_van` (
  `id` bigint(20) NOT NULL,
  `id_ho_so` bigint(20) DEFAULT NULL,
  `ngay_gio` datetime NOT NULL,
  `dia_diem` varchar(255) DEFAULT NULL,
  `nguoi_phong_van` text DEFAULT NULL,
  `ket_qua` text DEFAULT NULL,
  `trang_thai` enum('chua_phong_van','da_phong_van') DEFAULT 'chua_phong_van',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_tham_benh`
--

CREATE TABLE `lich_tham_benh` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_nguoi_than` bigint(20) DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `khung_gio` enum('8_10','14_16','18_20') DEFAULT NULL,
  `so_nguoi_di_cung` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','da_duyet','tu_choi') DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `chu_de` varchar(255) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `ngay_gui` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loai_benh_ly`
--

CREATE TABLE `loai_benh_ly` (
  `id` bigint(20) NOT NULL,
  `ten_loai_benh_ly` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Dumping data for table `media_bai_viet`
--

INSERT INTO `media_bai_viet` (`id`, `id_bai_viet`, `loai`, `url`, `mo_ta`, `thu_tu`, `ngay_upload`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 'anh', 'http://localhost:3000/uploads/file-1764041144900-497202417.jpg', NULL, 0, '2025-11-25 10:38:49', '2025-11-25 10:38:49', '2025-11-25 10:38:49'),
(2, 1, 'anh', 'http://localhost:3000/uploads/file-1764041160851-576908118.png', NULL, 1, '2025-11-25 10:38:49', '2025-11-25 10:38:49', '2025-11-25 10:38:49'),
(4, 2, 'anh', 'http://localhost:3000/uploads/file-1764042518512-647546192.jpg', 'Ảnh đại diện', 0, '2025-11-25 10:48:45', '2025-11-25 10:48:45', '2025-11-25 10:48:45'),
(5, 2, 'anh', 'http://localhost:3000/uploads/file-1764042504393-910714198.png', NULL, 1, '2025-11-25 10:48:45', '2025-11-25 10:48:45', '2025-11-25 10:48:45'),
(6, 2, 'anh', 'http://localhost:3000/uploads/file-1764042510429-405801153.png', NULL, 2, '2025-11-25 10:48:45', '2025-11-25 10:48:45', '2025-11-25 10:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `media_su_kien`
--

CREATE TABLE `media_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL,
  `url` text NOT NULL,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_tham_gia_su_kien`
--

CREATE TABLE `nguoi_tham_gia_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_nguoi_than` bigint(20) DEFAULT NULL,
  `xac_nhan` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_tham_gia_su_kien`
--

INSERT INTO `nguoi_tham_gia_su_kien` (`id`, `id_su_kien`, `id_benh_nhan`, `id_nguoi_than`, `xac_nhan`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 7, NULL, 0, '2025-11-25 15:17:42', '2025-11-25 15:17:42');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_than_benh_nhan`
--

CREATE TABLE `nguoi_than_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `moi_quan_he` varchar(50) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `la_nguoi_lien_he_chinh` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_xac_thuc`
--

CREATE TABLE `otp_xac_thuc` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ma_otp` varchar(10) DEFAULT NULL,
  `loai_otp` enum('dang_ky','quen_mat_khau') DEFAULT NULL,
  `het_han` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_cong_cong_viec`
--

CREATE TABLE `phan_cong_cong_viec` (
  `id` bigint(20) NOT NULL,
  `id_cong_viec` bigint(20) DEFAULT NULL,
  `id_dieu_duong` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `trang_thai` enum('chua_lam','dang_lam','hoan_thanh') DEFAULT 'chua_lam',
  `thoi_gian_hoan_thanh` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phan_cong_cong_viec`
--

INSERT INTO `phan_cong_cong_viec` (`id`, `id_cong_viec`, `id_dieu_duong`, `id_benh_nhan`, `trang_thai`, `thoi_gian_hoan_thanh`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 3, 1, 'hoan_thanh', '2025-11-25 11:34:55', '2025-11-24 16:26:54', '2025-11-25 11:34:55');

-- --------------------------------------------------------

--
-- Table structure for table `phan_cong_su_kien`
--

CREATE TABLE `phan_cong_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `id_nhan_vien` bigint(20) DEFAULT NULL,
  `vai_tro` varchar(100) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_hoi_benh_nhan`
--

CREATE TABLE `phan_hoi_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_dieu_duong` bigint(20) DEFAULT NULL,
  `diem_danh_gia` int(11) DEFAULT NULL CHECK (`diem_danh_gia` >= 1 and `diem_danh_gia` <= 5),
  `noi_dung` text DEFAULT NULL,
  `ngay_danh_gia` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_khu`
--

CREATE TABLE `phan_khu` (
  `id` bigint(20) NOT NULL,
  `ten_khu` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `so_tang` int(11) DEFAULT NULL,
  `so_phong` int(11) DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phan_khu`
--

INSERT INTO `phan_khu` (`id`, `ten_khu`, `mo_ta`, `so_tang`, `so_phong`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'A', '44', 5, 10, 0, NULL, '2025-11-25 11:46:08', '2025-11-25 11:46:08');

-- --------------------------------------------------------

--
-- Table structure for table `phong`
--

CREATE TABLE `phong` (
  `id` bigint(20) NOT NULL,
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
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phong`
--

INSERT INTO `phong` (`id`, `id_phan_khu`, `ten_phong`, `so_phong`, `so_giuong`, `so_nguoi_toi_da`, `dien_tich`, `mo_ta`, `trang_thai`, `anh_1`, `anh_2`, `anh_3`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 'A', '101', 4, 5, 4.00, '5', 'co_nguoi', 'http://localhost:3000/uploads/file-1764046172163-161650727.jpg', 'http://localhost:3000/uploads/file-1764046023999-939089755.jpg', 'http://localhost:3000/uploads/file-1764046148735-537550142.jpg', 0, NULL, '2025-11-25 11:49:14', '2025-11-25 15:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `phong_o_benh_nhan`
--

CREATE TABLE `phong_o_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `khu` varchar(50) DEFAULT NULL,
  `phong` varchar(50) DEFAULT NULL,
  `giuong` varchar(50) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phong_o_benh_nhan`
--

INSERT INTO `phong_o_benh_nhan` (`id`, `id_benh_nhan`, `khu`, `phong`, `giuong`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 2, 'A', '101', '1', '2025-11-25 15:07:55', '2025-11-25 15:07:55'),
(4, 6, 'A', '101', '1', '2025-11-25 15:09:38', '2025-11-25 15:09:38'),
(5, 5, 'A', '101', '1', '2025-11-25 15:10:00', '2025-11-25 15:10:00'),
(6, 4, 'A', '101', '1', '2025-11-25 15:10:10', '2025-11-25 15:10:10'),
(7, 1, 'A', '101', '1', '2025-11-25 15:19:35', '2025-11-25 15:19:35');

-- --------------------------------------------------------

--
-- Table structure for table `su_kien`
--

CREATE TABLE `su_kien` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay` datetime DEFAULT NULL,
  `dia_diem` varchar(255) DEFAULT NULL,
  `ngan_sach` int(11) DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `video` text DEFAULT NULL,
  `trang_thai` enum('sap_dien_ra','dang_dien_ra','ket_thuc') DEFAULT 'sap_dien_ra',
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `su_kien`
--

INSERT INTO `su_kien` (`id`, `tieu_de`, `mo_ta`, `ngay`, `dia_diem`, `ngan_sach`, `anh_dai_dien`, `video`, `trang_thai`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Hehe', 'Là như vậy đó', '2025-11-28 03:59:00', 'Hà Nội', 12121122, 'http://localhost:3000/uploads/file-1764045044233-723448405.png', NULL, 'sap_dien_ra', 0, NULL, '2025-11-25 10:57:24', '2025-11-25 11:30:56');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `mat_khau` text DEFAULT NULL,
  `vai_tro` enum('super_admin','quan_ly_y_te','quan_ly_nhan_su','dieu_duong','dieu_duong_truong','nguoi_nha','marketing') DEFAULT NULL,
  `trang_thai` enum('active','inactive','locked') DEFAULT 'active',
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`id`, `ho_ten`, `so_dien_thoai`, `email`, `avatar`, `mat_khau`, `vai_tro`, `trang_thai`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Super Admin', '0123456789', 'admin@vienduonglao.com', NULL, '$2a$10$r3gRsiCvqgi21Qp7CQEm7uGkL7m1nzq3ZFd.TmJRLtomEqWqy40Y2', 'super_admin', 'active', 0, NULL, '2025-11-24 10:32:09', '2025-11-24 10:32:09'),
(2, 'Super Admin', '01232456789', 'admin1@vienduonglao.com', NULL, '$2a$10$I0p0VBJ0NFeV5hCbBMTxcOON3nFQLFhUJAZix5mK5T8cGcrPuMfFG', 'super_admin', 'active', 0, NULL, '2025-11-24 10:35:24', '2025-11-24 10:35:24'),
(3, 'Kietvu', '0123456', 'kietvu389@gmail.com', NULL, '$2a$10$gczWblvewERWQIfVCHtMQO0WJuIr4Kh55Kic6EuI1rq3B0jURBGf.', 'dieu_duong', 'active', 0, NULL, '2025-11-24 16:25:26', '2025-11-24 16:25:26'),
(4, 'Lananh', '1231332', 'kietvu3892@gmail.com', NULL, '$2a$10$PKJRNQn7BRvUejS1XWzQG.OZQQf1J6iNlHnTWaOf6trgkQzvd5I1y', 'dieu_duong', 'active', 0, NULL, '2025-11-24 16:26:10', '2025-11-24 16:26:10'),
(5, 'HaNoi', '1212121212', 'kietvu3893@gmail.com', NULL, '$2a$10$InnM0igLC2tk9iz9L5T.aOv527pf8qEUrISKn/EO4QM8ti46gj6Fe', 'dieu_duong', 'active', 0, NULL, '2025-11-24 16:26:23', '2025-11-24 16:26:23');

-- --------------------------------------------------------

--
-- Table structure for table `tam_ly_giao_tiep`
--

CREATE TABLE `tam_ly_giao_tiep` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `trang_thai_tinh_than` enum('vui_ve','binh_thuong','buon_ba','lo_lang','cau_gat') DEFAULT NULL,
  `nhan_thuc_nguoi_than` tinyint(1) DEFAULT NULL,
  `nhan_thuc_dieu_duong` tinyint(1) DEFAULT NULL,
  `biet_thoi_gian` tinyint(1) DEFAULT NULL,
  `muc_do_tuong_tac` enum('chu_dong','phan_hoi','it_phan_hoi','khong_giao_tiep') DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_bao`
--

CREATE TABLE `thong_bao` (
  `id` bigint(20) NOT NULL,
  `id_nguoi_nhan` bigint(20) DEFAULT NULL,
  `loai` enum('cong_viec','canh_bao','tin_nhan','su_kien','he_thong') NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_benh`
--

CREATE TABLE `thong_tin_benh` (
  `id` bigint(20) NOT NULL,
  `ten_benh` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_tai_khoan`
--

CREATE TABLE `thong_tin_tai_khoan` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ten_thuoc_tinh` varchar(255) DEFAULT NULL,
  `gia_tri` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thuc_don_ca_nhan`
--

CREATE TABLE `thuc_don_ca_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `ngay` date NOT NULL,
  `bua_sang` text DEFAULT NULL,
  `bua_trua` text DEFAULT NULL,
  `bua_toi` text DEFAULT NULL,
  `tong_calo` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thuc_don_ca_nhan`
--

INSERT INTO `thuc_don_ca_nhan` (`id`, `id_benh_nhan`, `ngay`, `bua_sang`, `bua_trua`, `bua_toi`, `tong_calo`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, '2025-11-25', 'Cơm', 'Cơm', 'Cơm', 21212, '2025-11-25 14:57:34', '2025-11-25 14:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `thuc_don_mau`
--

CREATE TABLE `thuc_don_mau` (
  `id` bigint(20) NOT NULL,
  `ten_mon` varchar(255) NOT NULL,
  `calo` int(11) DEFAULT NULL,
  `protein` float DEFAULT NULL,
  `carb` float DEFAULT NULL,
  `fat` float DEFAULT NULL,
  `phu_hop_benh_ly` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thuoc_trong_don`
--

CREATE TABLE `thuoc_trong_don` (
  `id` bigint(20) NOT NULL,
  `id_don_thuoc` bigint(20) DEFAULT NULL,
  `ten_thuoc` varchar(255) DEFAULT NULL,
  `lieu_luong` varchar(255) DEFAULT NULL,
  `thoi_diem_uong` varchar(50) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thuoc_trong_don`
--

INSERT INTO `thuoc_trong_don` (`id`, `id_don_thuoc`, `ten_thuoc`, `lieu_luong`, `thoi_diem_uong`, `ghi_chu`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 'Apecilin', '121', 'Sáng', '21', '2025-11-25 17:07:18', '2025-11-25 17:07:18');

-- --------------------------------------------------------

--
-- Table structure for table `tin_tuyen_dung`
--

CREATE TABLE `tin_tuyen_dung` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `vi_tri` varchar(100) NOT NULL,
  `yeu_cau` text DEFAULT NULL,
  `so_luong` int(11) DEFAULT 1,
  `ngay_dang` datetime DEFAULT current_timestamp(),
  `ngay_het_han` datetime DEFAULT NULL,
  `trang_thai` enum('dang_tuyen','tam_dung','da_dong') DEFAULT 'dang_tuyen',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `van_dong_phuc_hoi`
--

CREATE TABLE `van_dong_phuc_hoi` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `kha_nang_van_dong` enum('doc_lap','tro_giup','nam_lien') DEFAULT NULL,
  `loai_bai_tap` varchar(255) DEFAULT NULL,
  `thoi_gian_bat_dau` datetime DEFAULT NULL,
  `thoi_luong_phut` int(11) DEFAULT NULL,
  `cuong_do` enum('nhe','trung_binh','manh') DEFAULT NULL,
  `calo_tieu_hao` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_tac_gia` (`id_tac_gia`);

--
-- Indexes for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dich_vu` (`id_dich_vu`);

--
-- Indexes for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_thong_tin_benh` (`id_thong_tin_benh`);

--
-- Indexes for table `benh_nhan`
--
ALTER TABLE `benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_benh_nhan_ngay_nhap_vien` (`ngay_nhap_vien`);

--
-- Indexes for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_id_dich_vu` (`id_dich_vu`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_ngay_bat_dau` (`ngay_bat_dau`);

--
-- Indexes for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`);

--
-- Indexes for table `chi_so_sinh_ton`
--
ALTER TABLE `chi_so_sinh_ton`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_chi_so_sinh_ton_thoi_gian` (`thoi_gian`);

--
-- Indexes for table `cong_viec`
--
ALTER TABLE `cong_viec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_tao` (`id_nguoi_tao`),
  ADD KEY `idx_cong_viec_trang_thai` (`muc_uu_tien`);

--
-- Indexes for table `dich_vu`
--
ALTER TABLE `dich_vu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `dinh_duong_hang_ngay`
--
ALTER TABLE `dinh_duong_hang_ngay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`);

--
-- Indexes for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_loai_benh_ly` (`id_loai_benh_ly`);

--
-- Indexes for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nguoi_xac_nhan` (`nguoi_xac_nhan`);

--
-- Indexes for table `lich_kham`
--
ALTER TABLE `lich_kham`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ho_so` (`id_ho_so`);

--
-- Indexes for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_nguoi_than` (`id_nguoi_than`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loai_benh_ly`
--
ALTER TABLE `loai_benh_ly`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`),
  ADD KEY `idx_media_bai_viet_thu_tu` (`thu_tu`);

--
-- Indexes for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`);

--
-- Indexes for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_nguoi_than` (`id_nguoi_than`);

--
-- Indexes for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cong_viec` (`id_cong_viec`),
  ADD KEY `id_dieu_duong` (`id_dieu_duong`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_phan_cong_cong_viec_trang_thai` (`trang_thai`);

--
-- Indexes for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Indexes for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_dieu_duong` (`id_dieu_duong`);

--
-- Indexes for table `phan_khu`
--
ALTER TABLE `phan_khu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ten_khu` (`ten_khu`),
  ADD KEY `idx_da_xoa` (`da_xoa`);

--
-- Indexes for table `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_phan_khu` (`id_phan_khu`),
  ADD KEY `idx_ten_phong` (`ten_phong`),
  ADD KEY `idx_so_phong` (`so_phong`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_da_xoa` (`da_xoa`);

--
-- Indexes for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `su_kien`
--
ALTER TABLE `su_kien`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_tai_khoan_vai_tro` (`vai_tro`);

--
-- Indexes for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_nhan` (`id_nguoi_nhan`),
  ADD KEY `idx_thong_bao_da_doc` (`da_doc`);

--
-- Indexes for table `thong_tin_benh`
--
ALTER TABLE `thong_tin_benh`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `thuc_don_ca_nhan`
--
ALTER TABLE `thuc_don_ca_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `thuc_don_mau`
--
ALTER TABLE `thuc_don_mau`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_don_thuoc` (`id_don_thuoc`);

--
-- Indexes for table `tin_tuyen_dung`
--
ALTER TABLE `tin_tuyen_dung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `benh_nhan`
--
ALTER TABLE `benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chi_so_sinh_ton`
--
ALTER TABLE `chi_so_sinh_ton`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cong_viec`
--
ALTER TABLE `cong_viec`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dich_vu`
--
ALTER TABLE `dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dinh_duong_hang_ngay`
--
ALTER TABLE `dinh_duong_hang_ngay`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_kham`
--
ALTER TABLE `lich_kham`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loai_benh_ly`
--
ALTER TABLE `loai_benh_ly`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_khu`
--
ALTER TABLE `phan_khu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `phong`
--
ALTER TABLE `phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `su_kien`
--
ALTER TABLE `su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_bao`
--
ALTER TABLE `thong_bao`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_tin_benh`
--
ALTER TABLE `thong_tin_benh`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thuc_don_ca_nhan`
--
ALTER TABLE `thuc_don_ca_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `thuc_don_mau`
--
ALTER TABLE `thuc_don_mau`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tin_tuyen_dung`
--
ALTER TABLE `tin_tuyen_dung`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  ADD CONSTRAINT `bang_gia_dich_vu_ibfk_1` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`);

--
-- Constraints for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  ADD CONSTRAINT `benh_hien_tai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `benh_hien_tai_ibfk_2` FOREIGN KEY (`id_thong_tin_benh`) REFERENCES `thong_tin_benh` (`id`);

--
-- Constraints for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  ADD CONSTRAINT `fk_benh_nhan_dich_vu_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_benh_nhan_dich_vu_dich_vu` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`);

--
-- Constraints for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD CONSTRAINT `binh_luan_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`);

--
-- Constraints for table `chi_so_sinh_ton`
--
ALTER TABLE `chi_so_sinh_ton`
  ADD CONSTRAINT `chi_so_sinh_ton_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `cong_viec`
--
ALTER TABLE `cong_viec`
  ADD CONSTRAINT `cong_viec_ibfk_1` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  ADD CONSTRAINT `diem_rui_ro_ai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `dinh_duong_hang_ngay`
--
ALTER TABLE `dinh_duong_hang_ngay`
  ADD CONSTRAINT `dinh_duong_hang_ngay_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  ADD CONSTRAINT `don_thuoc_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  ADD CONSTRAINT `do_dung_ca_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  ADD CONSTRAINT `hoat_dong_sinh_hoat_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  ADD CONSTRAINT `ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  ADD CONSTRAINT `ho_so_ung_tuyen_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`);

--
-- Constraints for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  ADD CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_2` FOREIGN KEY (`id_loai_benh_ly`) REFERENCES `loai_benh_ly` (`id`);

--
-- Constraints for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD CONSTRAINT `kpi_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  ADD CONSTRAINT `lich_hen_tu_van_ibfk_1` FOREIGN KEY (`nguoi_xac_nhan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_kham`
--
ALTER TABLE `lich_kham`
  ADD CONSTRAINT `lich_kham_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  ADD CONSTRAINT `lich_phan_ca_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  ADD CONSTRAINT `lich_phong_van_ibfk_1` FOREIGN KEY (`id_ho_so`) REFERENCES `ho_so_ung_tuyen` (`id`);

--
-- Constraints for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  ADD CONSTRAINT `lich_tham_benh_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `lich_tham_benh_ibfk_2` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`);

--
-- Constraints for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD CONSTRAINT `media_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  ADD CONSTRAINT `media_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`);

--
-- Constraints for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_3` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`);

--
-- Constraints for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  ADD CONSTRAINT `nguoi_than_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  ADD CONSTRAINT `otp_xac_thuc_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_1` FOREIGN KEY (`id_cong_viec`) REFERENCES `cong_viec` (`id`),
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`),
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_3` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  ADD CONSTRAINT `phan_cong_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  ADD CONSTRAINT `phan_cong_su_kien_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `fk_phong_phan_khu` FOREIGN KEY (`id_phan_khu`) REFERENCES `phan_khu` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  ADD CONSTRAINT `phong_o_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  ADD CONSTRAINT `tam_ly_giao_tiep_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  ADD CONSTRAINT `thong_tin_tai_khoan_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `thuc_don_ca_nhan`
--
ALTER TABLE `thuc_don_ca_nhan`
  ADD CONSTRAINT `thuc_don_ca_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  ADD CONSTRAINT `thuoc_trong_don_ibfk_1` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc` (`id`);

--
-- Constraints for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  ADD CONSTRAINT `van_dong_phuc_hoi_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
