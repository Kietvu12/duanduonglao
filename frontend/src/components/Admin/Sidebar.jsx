import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/benh-nhan', icon: '👥', label: 'Bệnh nhân' },
  { path: '/admin/nhan-vien', icon: '👨‍⚕️', label: 'Nhân viên' },
  { path: '/admin/lich-kham', icon: '📅', label: 'Lịch khám' },
  { path: '/admin/lich-hen-tu-van', icon: '📞', label: 'Lịch hẹn tư vấn' },
  { path: '/admin/quan-ly-phong', icon: '🏠', label: 'Quản lý Phòng' },
  { path: '/admin/dich-vu', icon: '🏥', label: 'Dịch vụ' },
  { path: '/admin/su-kien', icon: '🎉', label: 'Sự kiện' },
  { path: '/admin/bai-viet', icon: '📝', label: 'Bài viết' },
  { path: '/admin/tuyen-dung', icon: '💼', label: 'Tuyển dụng' },
  { path: '/admin/thuoc', icon: '💊', label: 'Thuốc' },
  { path: '/admin/dinh-duong', icon: '🍽️', label: 'Dinh dưỡng' },
  { path: '/admin/cong-viec', icon: '✅', label: 'Công việc' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Quản lý Viện DL</h1>
        <p className="text-sm text-gray-400 mt-1">Super Admin</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

