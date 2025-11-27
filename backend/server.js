import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import benhNhanRoutes from './routes/benhNhanRoutes.js';
import lichKhamRoutes from './routes/lichKhamRoutes.js';
import lichThamBenhRoutes from './routes/lichThamBenhRoutes.js';
import nhanVienRoutes from './routes/nhanVienRoutes.js';
import dichVuRoutes from './routes/dichVuRoutes.js';
import suKienRoutes from './routes/suKienRoutes.js';
import baiVietRoutes from './routes/baiVietRoutes.js';
import tuyenDungRoutes from './routes/tuyenDungRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import thuocRoutes from './routes/thuocRoutes.js';
import dinhDuongRoutes from './routes/dinhDuongRoutes.js';
import congViecRoutes from './routes/congViecRoutes.js';
import phongRoutes from './routes/phongRoutes.js';
import phanKhuRoutes from './routes/phanKhuRoutes.js';
import phongNewRoutes from './routes/phongNewRoutes.js';
import nguoiThanRoutes from './routes/nguoiThanRoutes.js';
import doDungRoutes from './routes/doDungRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import benhNhanDichVuRoutes from './routes/benhNhanDichVuRoutes.js';
import loaiBenhLyRoutes from './routes/loaiBenhLyRoutes.js';
import thongTinBenhRoutes from './routes/thongTinBenhRoutes.js';
import { startPhanCaScheduler } from './services/phanCaScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/benh-nhan', benhNhanRoutes);
app.use('/api/lich-kham', lichKhamRoutes);
app.use('/api/lich-tham-benh', lichThamBenhRoutes);
app.use('/api/nhan-vien', nhanVienRoutes);
app.use('/api/dich-vu', dichVuRoutes);
app.use('/api/su-kien', suKienRoutes);
app.use('/api/bai-viet', baiVietRoutes);
app.use('/api/tuyen-dung', tuyenDungRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/thuoc', thuocRoutes);
app.use('/api/dinh-duong', dinhDuongRoutes);
app.use('/api/cong-viec', congViecRoutes);
app.use('/api/phong', phongRoutes);
app.use('/api/phan-khu', phanKhuRoutes);
app.use('/api/phong-moi', phongNewRoutes);
app.use('/api/nguoi-than', nguoiThanRoutes);
app.use('/api/do-dung', doDungRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/benh-nhan-dich-vu', benhNhanDichVuRoutes);
app.use('/api/loai-benh-ly', loaiBenhLyRoutes);
app.use('/api/thong-tin-benh', thongTinBenhRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Start phân ca scheduler
  startPhanCaScheduler();
});

