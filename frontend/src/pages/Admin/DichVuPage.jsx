import { useEffect, useState } from 'react';
import { dichVuAPI } from '../../services/api';

export default function DichVuPage() {
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    ten_dich_vu: '',
    mo_ta_ngan: '',
    mo_ta_day_du: '',
    gia_thang: '',
    gia_quy: '',
    gia_nam: '',
  });

  useEffect(() => {
    loadDichVus();
  }, []);

  const loadDichVus = async () => {
    try {
      setLoading(true);
      const response = await dichVuAPI.getAll();
      setDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading dich vus:', error);
      alert('Lỗi khi tải danh sách dịch vụ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await dichVuAPI.update(editing.id, formData);
        alert('Cập nhật dịch vụ thành công');
      } else {
        await dichVuAPI.create(formData);
        alert('Thêm dịch vụ thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (dv) => {
    setEditing(dv);
    setFormData({
      ten_dich_vu: dv.ten_dich_vu || '',
      mo_ta_ngan: dv.mo_ta_ngan || '',
      mo_ta_day_du: dv.mo_ta_day_du || '',
      gia_thang: dv.gia_thang || '',
      gia_quy: dv.gia_quy || '',
      gia_nam: dv.gia_nam || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await dichVuAPI.delete(id);
      alert('Xóa dịch vụ thành công');
      loadDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ten_dich_vu: '',
      mo_ta_ngan: '',
      mo_ta_day_du: '',
      gia_thang: '',
      gia_quy: '',
      gia_nam: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Dịch vụ</h1>
          <p className="text-gray-600 mt-1">Danh sách dịch vụ và bảng giá</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Đang tải...</div>
        ) : dichVus.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">Không có dữ liệu</div>
        ) : (
          dichVus.map((dv) => (
            <div key={dv.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">{dv.ten_dich_vu}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dv.mo_ta_ngan}</p>
              <div className="space-y-2 mb-4">
                {dv.gia_thang && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tháng:</span>
                    <span className="font-semibold">{parseInt(dv.gia_thang).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {dv.gia_quy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quý:</span>
                    <span className="font-semibold">{parseInt(dv.gia_quy).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {dv.gia_nam && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Năm:</span>
                    <span className="font-semibold">{parseInt(dv.gia_nam).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(dv)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(dv.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten_dich_vu}
                  onChange={(e) => setFormData({ ...formData, ten_dich_vu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.mo_ta_ngan}
                  onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả đầy đủ
                </label>
                <textarea
                  value={formData.mo_ta_day_du}
                  onChange={(e) => setFormData({ ...formData, mo_ta_day_du: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá tháng (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.gia_thang}
                    onChange={(e) => setFormData({ ...formData, gia_thang: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá quý (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.gia_quy}
                    onChange={(e) => setFormData({ ...formData, gia_quy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá năm (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.gia_nam}
                    onChange={(e) => setFormData({ ...formData, gia_nam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  {editing ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

