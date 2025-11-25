import { useEffect, useState } from 'react';
import { lichKhamAPI, benhNhanAPI } from '../../services/api';

export default function LichKhamPage() {
  const [lichKhams, setLichKhams] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_benh_nhan: '',
    loai_kham: 'tong_quat',
    bac_si: '',
    thoi_gian: '',
    ket_qua: '',
  });

  useEffect(() => {
    loadLichKhams();
    loadBenhNhans();
  }, []);

  const loadLichKhams = async () => {
    try {
      setLoading(true);
      const response = await lichKhamAPI.getAll();
      setLichKhams(response.data || []);
    } catch (error) {
      console.error('Error loading lich khams:', error);
      alert('Lỗi khi tải danh sách lịch khám: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll();
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await lichKhamAPI.update(editing.id, formData);
        alert('Cập nhật lịch khám thành công');
      } else {
        await lichKhamAPI.create(formData);
        alert('Tạo lịch khám thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadLichKhams();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (lk) => {
    setEditing(lk);
    setFormData({
      id_benh_nhan: lk.id_benh_nhan || '',
      loai_kham: lk.loai_kham || 'tong_quat',
      bac_si: lk.bac_si || '',
      thoi_gian: lk.thoi_gian ? lk.thoi_gian.slice(0, 16) : '',
      ket_qua: lk.ket_qua || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa lịch khám này?')) return;
    try {
      await lichKhamAPI.delete(id);
      alert('Xóa lịch khám thành công');
      loadLichKhams();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_benh_nhan: '',
      loai_kham: 'tong_quat',
      bac_si: '',
      thoi_gian: '',
      ket_qua: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Lịch khám</h1>
          <p className="text-gray-600 mt-1">Lịch khám và thăm khám bệnh nhân</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo lịch khám
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại khám</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lichKhams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                lichKhams.map((lk) => (
                  <tr key={lk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{lk.ten_benh_nhan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {lk.loai_kham?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lk.bac_si || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lk.thoi_gian ? new Date(lk.thoi_gian).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lk.trang_thai === 'da_kham' ? 'bg-green-100 text-green-800' :
                        lk.trang_thai === 'dang_kham' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lk.trang_thai?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(lk)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(lk.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa lịch khám' : 'Tạo lịch khám mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân *
                </label>
                <select
                  required
                  value={formData.id_benh_nhan}
                  onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn bệnh nhân</option>
                  {benhNhans.map((bn) => (
                    <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại khám
                  </label>
                  <select
                    value={formData.loai_kham}
                    onChange={(e) => setFormData({ ...formData, loai_kham: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="tong_quat">Tổng quát</option>
                    <option value="chuyen_khoa">Chuyên khoa</option>
                    <option value="xet_nghiem">Xét nghiệm</option>
                    <option value="phuc_hoi">Phục hồi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bác sĩ
                  </label>
                  <input
                    type="text"
                    value={formData.bac_si}
                    onChange={(e) => setFormData({ ...formData, bac_si: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.thoi_gian}
                    onChange={(e) => setFormData({ ...formData, thoi_gian: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kết quả
                  </label>
                  <textarea
                    value={formData.ket_qua}
                    onChange={(e) => setFormData({ ...formData, ket_qua: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                </div>
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
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editing ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

