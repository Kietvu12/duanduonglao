import { useEffect, useState } from 'react';
import { lichKhamAPI } from '../../services/api';

export default function LichHenTuVanPage() {
  const [lichHens, setLichHens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    trang_thai: 'cho_xac_nhan',
    ghi_chu: ''
  });
  const [filters, setFilters] = useState({
    trang_thai: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadLichHens();
  }, [filters]);

  const loadLichHens = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        ...filters
      };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      const response = await lichKhamAPI.getAllLichHenTuVan(params);
      setLichHens(response.data || []);
    } catch (error) {
      console.error('Error loading lich hen tu van:', error);
      alert('Lỗi khi tải danh sách lịch hẹn tư vấn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lichHen) => {
    setEditing(lichHen);
    setFormData({
      trang_thai: lichHen.trang_thai || 'cho_xac_nhan',
      ghi_chu: lichHen.ghi_chu || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lichKhamAPI.updateLichHenTuVan(editing.id, formData);
      alert('Cập nhật lịch hẹn thành công');
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadLichHens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      trang_thai: 'cho_xac_nhan',
      ghi_chu: ''
    });
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      'cho_xac_nhan': 'Chờ xác nhận',
      'da_xac_nhan': 'Đã xác nhận',
      'da_den': 'Đã đến',
      'huy': 'Hủy'
    };
    return labels[trangThai] || trangThai;
  };

  const getTrangThaiColor = (trangThai) => {
    const colors = {
      'cho_xac_nhan': 'bg-yellow-100 text-yellow-800',
      'da_xac_nhan': 'bg-blue-100 text-blue-800',
      'da_den': 'bg-green-100 text-green-800',
      'huy': 'bg-red-100 text-red-800'
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Lịch hẹn tư vấn</h1>
          <p className="text-gray-600 mt-1">Danh sách và quản lý lịch hẹn tư vấn</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={filters.trang_thai}
              onChange={(e) => setFilters({ ...filters, trang_thai: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tất cả</option>
              <option value="cho_xac_nhan">Chờ xác nhận</option>
              <option value="da_xac_nhan">Đã xác nhận</option>
              <option value="da_den">Đã đến</option>
              <option value="huy">Hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ trang_thai: '', start_date: '', end_date: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại dịch vụ quan tâm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hẹn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ hẹn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lichHens.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  lichHens.map((lh) => (
                    <tr key={lh.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{lh.ho_ten}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lh.so_dien_thoai}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lh.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lh.loai_dich_vu_quan_tam || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(lh.ngay_mong_muon).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{lh.gio_mong_muon}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTrangThaiColor(lh.trang_thai)}`}>
                          {getTrangThaiLabel(lh.trang_thai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(lh)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Xem/Sửa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Chi tiết lịch hẹn tư vấn</h2>
            
            {/* Thông tin khách hàng */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <p className="mt-1 text-gray-900">{editing.ho_ten}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <p className="mt-1 text-gray-900">{editing.so_dien_thoai}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{editing.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại dịch vụ quan tâm</label>
                  <p className="mt-1 text-gray-900">{editing.loai_dich_vu_quan_tam || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày hẹn</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(editing.ngay_mong_muon).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giờ hẹn</label>
                  <p className="mt-1 text-gray-900">{editing.gio_mong_muon}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái *
                </label>
                <select
                  required
                  value={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="cho_xac_nhan">Chờ xác nhận</option>
                  <option value="da_xac_nhan">Đã xác nhận</option>
                  <option value="da_den">Đã đến</option>
                  <option value="huy">Hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.ghi_chu}
                  onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

