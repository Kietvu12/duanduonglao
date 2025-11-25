import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminHomePage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-red-500">Không thể tải dữ liệu dashboard</div>;
  }

  const benhNhanChartData = dashboardData.benh_nhan_theo_dich_vu?.map(item => ({
    name: item.loai_dich_vu?.replace('_', ' ') || 'Khác',
    value: item.so_luong || 0,
  })) || [];

  const stats = [
    {
      title: 'Tổng số bệnh nhân',
      value: dashboardData.tong_so_benh_nhan || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Nhân viên đang làm',
      value: dashboardData.nhan_vien_dang_lam || 0,
      icon: '👨‍⚕️',
      color: 'bg-green-500',
    },
    {
      title: 'Nhân viên trực hôm nay',
      value: dashboardData.nhan_vien_truc_hom_nay || 0,
      icon: '🕐',
      color: 'bg-yellow-500',
    },
    {
      title: 'Lịch khám hôm nay',
      value: dashboardData.lich_kham_hom_nay || 0,
      icon: '📅',
      color: 'bg-purple-500',
    },
    {
      title: 'Lịch hẹn tư vấn',
      value: dashboardData.lich_hen_tu_van_hom_nay || 0,
      icon: '📞',
      color: 'bg-pink-500',
    },
    {
      title: 'Cảnh báo chỉ số',
      value: dashboardData.canh_bao_chi_so?.length || 0,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bệnh nhân theo dịch vụ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Bệnh nhân theo dịch vụ</h2>
          {benhNhanChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={benhNhanChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {benhNhanChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Cảnh báo chỉ số */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cảnh báo chỉ số sinh tồn</h2>
          {dashboardData.canh_bao_chi_so?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.canh_bao_chi_so.slice(0, 5).map((alert, index) => (
                <div
                  key={index}
                  className="bg-red-50 border-l-4 border-red-500 p-3 rounded"
                >
                  <p className="font-semibold text-red-800">{alert.ho_ten}</p>
                  <p className="text-sm text-red-600">
                    {new Date(alert.thoi_gian).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Không có cảnh báo</p>
          )}
        </div>
      </div>

      {/* Sự kiện sắp tới */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Sự kiện sắp tới</h2>
        {dashboardData.su_kien_sap_toi?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.su_kien_sap_toi.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{event.tieu_de}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.ngay).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm text-gray-500 mt-1">{event.dia_diem}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Không có sự kiện sắp tới</p>
        )}
      </div>
    </div>
  );
}

