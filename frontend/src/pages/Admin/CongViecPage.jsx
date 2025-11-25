import { useEffect, useState } from 'react';
import { congViecAPI, benhNhanAPI, nhanVienAPI } from '../../services/api';

export default function CongViecPage() {
  const [congViecs, setCongViecs] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ten_cong_viec: '',
    mo_ta: '',
    muc_uu_tien: 'trung_binh',
    thoi_gian_du_kien: '',
    id_dieu_duong: '',
    id_benh_nhan: '',
  });

  useEffect(() => {
    loadCongViecs();
    loadBenhNhans();
    loadNhanViens();
  }, []);

  const loadCongViecs = async () => {
    try {
      setLoading(true);
      const response = await congViecAPI.getAll();
      setCongViecs(response.data || []);
    } catch (error) {
      console.error('Error loading cong viecs:', error);
      alert('Lỗi khi tải danh sách công việc: ' + error.message);
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

  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll();
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await congViecAPI.create(formData);
      alert('Tạo công việc thành công');
      setShowModal(false);
      resetForm();
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePhanCong = async (id, id_dieu_duong, id_benh_nhan) => {
    try {
      await congViecAPI.phanCong({
        id_cong_viec: id,
        id_dieu_duong,
        id_benh_nhan,
      });
      alert('Phân công thành công');
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleUpdateTrangThai = async (id, trang_thai) => {
    try {
      await congViecAPI.updateTrangThai(id, { trang_thai });
      alert('Cập nhật trạng thái thành công');
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ten_cong_viec: '',
      mo_ta: '',
      muc_uu_tien: 'trung_binh',
      thoi_gian_du_kien: '',
      id_dieu_duong: '',
      id_benh_nhan: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Công việc</h1>
          <p className="text-gray-600 mt-1">Phân công và theo dõi công việc chăm sóc</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo công việc
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên công việc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điều dưỡng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mức ưu tiên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {congViecs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                congViecs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{cv.ten_cong_viec}</p>
                        {cv.mo_ta && <p className="text-sm text-gray-600">{cv.mo_ta}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">{cv.ten_dieu_duong || '-'}</td>
                    <td className="px-6 py-4">{cv.ten_benh_nhan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        cv.muc_uu_tien === 'cao' ? 'bg-red-100 text-red-800' :
                        cv.muc_uu_tien === 'trung_binh' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cv.muc_uu_tien?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={cv.trang_thai || 'chua_lam'}
                        onChange={(e) => handleUpdateTrangThai(cv.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="chua_lam">Chưa làm</option>
                        <option value="dang_lam">Đang làm</option>
                        <option value="hoan_thanh">Hoàn thành</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!cv.ten_dieu_duong && (
                        <button
                          onClick={() => {
                            const id_dieu_duong = prompt('Nhập ID điều dưỡng:');
                            const id_benh_nhan = prompt('Nhập ID bệnh nhân:');
                            if (id_dieu_duong && id_benh_nhan) {
                              handlePhanCong(cv.id, id_dieu_duong, id_benh_nhan);
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Phân công
                        </button>
                      )}
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
            <h2 className="text-2xl font-bold mb-4">Tạo công việc mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công việc *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten_cong_viec}
                  onChange={(e) => setFormData({ ...formData, ten_cong_viec: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức ưu tiên
                  </label>
                  <select
                    value={formData.muc_uu_tien}
                    onChange={(e) => setFormData({ ...formData, muc_uu_tien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thap">Thấp</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="cao">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian dự kiến
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.thoi_gian_du_kien}
                    onChange={(e) => setFormData({ ...formData, thoi_gian_du_kien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điều dưỡng (tùy chọn)
                  </label>
                  <select
                    value={formData.id_dieu_duong}
                    onChange={(e) => setFormData({ ...formData, id_dieu_duong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn điều dưỡng</option>
                    {nhanViens
                      .filter(nv => nv.vai_tro === 'dieu_duong' || nv.vai_tro === 'dieu_duong_truong')
                      .map((nv) => (
                        <option key={nv.id} value={nv.id}>{nv.ho_ten}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân (tùy chọn)
                  </label>
                  <select
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
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

