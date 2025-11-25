import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AdminLayout from './components/Admin/Layout'
import AdminHomePage from './pages/Admin/HomePage'
import Login from './pages/Admin/Login'
import BenhNhanPage from './pages/Admin/BenhNhanPage'
import BenhNhanDetailPage from './pages/Admin/BenhNhanDetailPage'
import NhanVienPage from './pages/Admin/NhanVienPage'
import LichKhamPage from './pages/Admin/LichKhamPage'
import DichVuPage from './pages/Admin/DichVuPage'
import SuKienPage from './pages/Admin/SuKienPage'
import BaiVietPage from './pages/Admin/BaiVietPage'
import TuyenDungPage from './pages/Admin/TuyenDungPage'
import ThuocPage from './pages/Admin/ThuocPage'
import DinhDuongPage from './pages/Admin/DinhDuongPage'
import CongViecPage from './pages/Admin/CongViecPage'
import PhongPage from './pages/Admin/PhongPage'
import QuanLyPhongPage from './pages/Admin/QuanLyPhongPage'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
            </>
          } />
          <Route path="/ve-chung-toi" element={
            <>
              <Navbar />
              <div className="min-h-screen p-8"><h1 className="text-2xl font-bold">Về chúng tôi</h1></div>
              <Footer />
            </>
          } />
          <Route path="/dich-vu" element={
            <>
              <Navbar />
              <div className="min-h-screen p-8"><h1 className="text-2xl font-bold">Dịch vụ</h1></div>
              <Footer />
            </>
          } />
          <Route path="/tien-ich" element={
            <>
              <Navbar />
              <div className="min-h-screen p-8"><h1 className="text-2xl font-bold">Tiện ích cho bạn</h1></div>
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navbar />
              <div className="min-h-screen p-8"><h1 className="text-2xl font-bold">Blog</h1></div>
              <Footer />
            </>
          } />
          <Route path="/lien-he" element={
            <>
              <Navbar />
              <div className="min-h-screen p-8"><h1 className="text-2xl font-bold">Liên hệ</h1></div>
              <Footer />
            </>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="benh-nhan" element={<BenhNhanPage />} />
            <Route path="benh-nhan/:id" element={<BenhNhanDetailPage />} />
            <Route path="nhan-vien" element={<NhanVienPage />} />
            <Route path="lich-kham" element={<LichKhamPage />} />
            <Route path="quan-ly-phong" element={<QuanLyPhongPage />} />
            <Route path="dich-vu" element={<DichVuPage />} />
            <Route path="su-kien" element={<SuKienPage />} />
            <Route path="bai-viet" element={<BaiVietPage />} />
            <Route path="tuyen-dung" element={<TuyenDungPage />} />
            <Route path="thuoc" element={<ThuocPage />} />
            <Route path="dinh-duong" element={<DinhDuongPage />} />
            <Route path="cong-viec" element={<CongViecPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
