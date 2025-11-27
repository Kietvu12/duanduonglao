import { useEffect, useState } from 'react';
import { thuocAPI, benhNhanAPI } from '../../services/api';

export default function ThuocPage() {
  const [donThuocs, setDonThuocs] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_benh_nhan: '',
    mo_ta: '',
    ngay_ke: new Date().toISOString().split('T')[0],
    thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
  });

  useEffect(() => {
    loadDonThuocs();
    loadBenhNhans();
  }, []);

  const loadDonThuocs = async () => {
    try {
      setLoading(true);
      const response = await thuocAPI.getAll();
      setDonThuocs(response.data || []);
    } catch (error) {
      console.error('Error loading don thuocs:', error);
      alert('Lỗi khi tải danh sách đơn thuốc: ' + error.message);
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
        await thuocAPI.update(editing.id, formData);
        alert('Cập nhật đơn thuốc thành công');
      } else {
        await thuocAPI.create(formData);
        alert('Tạo đơn thuốc thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleAddThuoc = () => {
    setFormData({
      ...formData,
      thuoc: [...formData.thuoc, { ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
  };

  const handleRemoveThuoc = (index) => {
    const newThuoc = formData.thuoc.filter((_, i) => i !== index);
    setFormData({ ...formData, thuoc: newThuoc });
  };

  const handleThuocChange = (index, field, value) => {
    const newThuoc = [...formData.thuoc];
    newThuoc[index][field] = value;
    setFormData({ ...formData, thuoc: newThuoc });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa đơn thuốc này?')) return;
    try {
      await thuocAPI.delete(id);
      alert('Xóa đơn thuốc thành công');
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_benh_nhan: '',
      mo_ta: '',
      ngay_ke: new Date().toISOString().split('T')[0],
      thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Thuốc</h1>
          <p className="text-gray-600 mt-2">Đơn thuốc và quản lý thuốc</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span>Tạo đơn thuốc</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">Đang tải...</div>
        ) : donThuocs.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medication</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có đơn thuốc nào</p>
            <p className="text-gray-400 text-sm">Bấm "Tạo đơn thuốc" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kê</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số loại thuốc</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donThuocs.map((don) => (
                  <tr key={don.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-900">{don.ten_benh_nhan || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {don.ngay_ke ? new Date(don.ngay_ke).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-900">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#4A90E2]/10 text-[#4A90E2] rounded-full text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medication</span>
                        {don.thuoc?.length || 0} loại
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(don.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa đơn thuốc' : 'Tạo đơn thuốc mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  resetForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bệnh nhân *
                  </label>
                  <select
                    required
                    value={formData.id_benh_nhan}
                    onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map((bn) => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày kê *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.ngay_ke}
                    onChange={(e) => setFormData({ ...formData, ngay_ke: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="2"
                  placeholder="Mô tả về đơn thuốc..."
                />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Danh sách thuốc *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddThuoc}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                    <span>Thêm thuốc</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.thuoc.map((thuoc, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#4A90E2]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medication</span>
                          Thuốc {index + 1}
                        </span>
                        {formData.thuoc.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveThuoc(index)}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                            <span>Xóa</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Tên thuốc *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.ten_thuoc}
                            onChange={(e) => handleThuocChange(index, 'ten_thuoc', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                            placeholder="Nhập tên thuốc..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Liều lượng *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.lieu_luong}
                            onChange={(e) => handleThuocChange(index, 'lieu_luong', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                            placeholder="VD: 1 viên, 2 viên..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Thời điểm uống</label>
                          <input
                            type="text"
                            value={thuoc.thoi_diem_uong}
                            onChange={(e) => handleThuocChange(index, 'thoi_diem_uong', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                            placeholder="VD: Sáng, Trưa, Tối"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Ghi chú</label>
                          <input
                            type="text"
                            value={thuoc.ghi_chu}
                            onChange={(e) => handleThuocChange(index, 'ghi_chu', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                            placeholder="Ghi chú thêm..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>{editing ? 'Cập nhật' : 'Tạo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


