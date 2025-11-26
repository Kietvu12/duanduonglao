import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

  // Chuẩn bị dữ liệu cho biểu đồ số người sử dụng dịch vụ theo tháng
  const prepareServiceUsageData = () => {
    if (!dashboardData.su_dung_dich_vu_theo_thang || dashboardData.su_dung_dich_vu_theo_thang.length === 0) {
      return {};
    }

    const services = {};
    dashboardData.su_dung_dich_vu_theo_thang.forEach(item => {
      if (!services[item.ten_dich_vu]) {
        services[item.ten_dich_vu] = [];
      }
      services[item.ten_dich_vu].push({
        thang: item.thang,
        so_nguoi: item.so_nguoi
      });
    });

    // Tạo đầy đủ 12 tháng gần nhất cho mỗi dịch vụ
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    const result = {};
    Object.keys(services).forEach(serviceName => {
      result[serviceName] = months.map(month => {
        const existing = services[serviceName].find(item => item.thang === month);
        return {
          thang: month,
          so_nguoi: existing ? existing.so_nguoi : 0
        };
      });
    });

    return result;
  };

  const serviceUsageData = prepareServiceUsageData();

  // Chuẩn bị dữ liệu cho biểu đồ doanh thu theo tháng
  const prepareRevenueData = () => {
    if (!dashboardData.doanh_thu_theo_thang || dashboardData.doanh_thu_theo_thang.length === 0) {
      return [];
    }

    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    return months.map(month => {
      const existing = dashboardData.doanh_thu_theo_thang.find(item => item.thang === month);
      return {
        thang: month,
        doanh_thu: existing ? existing.doanh_thu : 0
      };
    });
  };

  const revenueData = prepareRevenueData();

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

      {/* Sự kiện sắp tới */}


      {/* Biểu đồ số người sử dụng dịch vụ theo tháng */}
      {Object.keys(serviceUsageData).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Số người sử dụng dịch vụ theo tháng</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(serviceUsageData).map((serviceName) => (
              <div key={serviceName}>
                <h3 className="text-lg font-medium mb-3 text-gray-700">{serviceName}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={serviceUsageData[serviceName]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="thang" 
                      tickFormatter={(value) => {
                        const date = new Date(value + '-01');
                        return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value + '-01');
                        return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="so_nguoi" fill="#0088FE" name="Số người" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biểu đồ tổng doanh thu theo tháng */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Tổng doanh thu theo tháng</h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="thang" 
                tickFormatter={(value) => {
                  const date = new Date(value + '-01');
                  return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
                }}
              />
              <YAxis 
                tickFormatter={(value) => {
                  return new Intl.NumberFormat('vi-VN', { 
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value);
                }}
              />
              <Tooltip 
                labelFormatter={(value) => {
                  const date = new Date(value + '-01');
                  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
                }}
                formatter={(value) => {
                  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="doanh_thu" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">Chưa có dữ liệu doanh thu</p>
        )}
      </div>

      {/* Danh sách công nợ của bệnh nhân */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách công nợ của bệnh nhân</h2>
        {dashboardData.cong_no_benh_nhan?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Còn nợ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày thanh toán cuối
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.cong_no_benh_nhan.map((debt) => (
                  <tr key={debt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {debt.ho_ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debt.so_dien_thoai || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debt.ten_dich_vu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('vi-VN').format(debt.thanh_tien || 0)} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('vi-VN').format(debt.da_thanh_toan || 0)} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      {new Intl.NumberFormat('vi-VN').format(debt.cong_no_con_lai || 0)} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debt.ngay_thanh_toan_lan_cuoi 
                        ? new Date(debt.ngay_thanh_toan_lan_cuoi).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Không có công nợ</p>
        )}
      </div>

      {/* Danh sách nhân viên trực ca tại viện hôm nay */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách nhân viên trực ca tại viện hôm nay</h2>
        {dashboardData.nhan_vien_truc_ca_hom_nay?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.nhan_vien_truc_ca_hom_nay.map((staff) => (
              <div
                key={staff.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{staff.ho_ten}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    staff.trang_thai === 'dang_truc' 
                      ? 'bg-green-100 text-green-800' 
                      : staff.trang_thai === 'hoan_thanh'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {staff.trang_thai === 'dang_truc' 
                      ? 'Đang trực' 
                      : staff.trang_thai === 'hoan_thanh'
                      ? 'Hoàn thành'
                      : 'Dự kiến'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ca:</span> {staff.ca ? staff.ca.charAt(0).toUpperCase() + staff.ca.slice(1) : '-'}
                </p>
                {staff.gio_bat_dau && staff.gio_ket_thuc && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Giờ:</span> {staff.gio_bat_dau} - {staff.gio_ket_thuc}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">SĐT:</span> {staff.so_dien_thoai || '-'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Không có nhân viên trực ca hôm nay</p>
        )}
      </div>
    </div>
  );
}

