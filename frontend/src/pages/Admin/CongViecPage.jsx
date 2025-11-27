import { useEffect, useState } from 'react';
import { congViecAPI, benhNhanAPI, nhanVienAPI } from '../../services/api';

export default function CongViecPage() {
  const [congViecs, setCongViecs] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPhanCongModal, setShowPhanCongModal] = useState(false);
  const [selectedCongViec, setSelectedCongViec] = useState(null);
  const [editing, setEditing] = useState(null);
  const [phanCongForm, setPhanCongForm] = useState({
    id_dieu_duong: '',
    id_benh_nhan: '',
  });
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
      if (editing) {
        await congViecAPI.update(editing.id, formData);
        alert('Cập nhật công việc thành công');
      } else {
        await congViecAPI.create(formData);
        alert('Tạo công việc thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePhanCong = async () => {
    if (!selectedCongViec) return;
    try {
      await congViecAPI.phanCong({
        id_cong_viec: selectedCongViec.id,
        id_dieu_duong: phanCongForm.id_dieu_duong,
        id_benh_nhan: phanCongForm.id_benh_nhan,
      });
      alert('Phân công thành công');
      setShowPhanCongModal(false);
      setSelectedCongViec(null);
      setPhanCongForm({ id_dieu_duong: '', id_benh_nhan: '' });
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleOpenPhanCongModal = (cv) => {
    setSelectedCongViec(cv);
    setPhanCongForm({ id_dieu_duong: '', id_benh_nhan: '' });
    setShowPhanCongModal(true);
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

  const handleEdit = (cv) => {
    setFormData({
      ten_cong_viec: cv.ten_cong_viec || '',
      mo_ta: cv.mo_ta || '',
      muc_uu_tien: cv.muc_uu_tien || 'trung_binh',
      thoi_gian_du_kien: cv.thoi_gian_du_kien ? (cv.thoi_gian_du_kien.includes('T') ? cv.thoi_gian_du_kien.slice(0, 16) : cv.thoi_gian_du_kien) : '',
      id_dieu_duong: cv.id_dieu_duong ? String(cv.id_dieu_duong) : '',
      id_benh_nhan: cv.id_benh_nhan ? String(cv.id_benh_nhan) : '',
    });
    setEditing(cv);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    try {
      await congViecAPI.delete(id);
      alert('Xóa công việc thành công');
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
    setEditing(null);
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Công việc</h1>
          <p className="text-gray-600 mt-2">Phân công và theo dõi công việc chăm sóc</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span>Tạo công việc</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">Đang tải...</div>
        ) : congViecs.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>task</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có công việc nào</p>
            <p className="text-gray-400 text-sm">Bấm "Tạo công việc" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên công việc</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Điều dưỡng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức ưu tiên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {congViecs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-gray-900">{cv.ten_cong_viec}</p>
                        {cv.mo_ta && <p className="text-sm text-gray-600 mt-1">{cv.mo_ta}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {cv.ten_dieu_duong ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {cv.ten_dieu_duong.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-900">{cv.ten_dieu_duong}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {cv.ten_benh_nhan ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {cv.ten_benh_nhan.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-900">{cv.ten_benh_nhan}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        cv.muc_uu_tien === 'cao' ? 'bg-red-100 text-red-800' :
                        cv.muc_uu_tien === 'trung_binh' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cv.muc_uu_tien?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <select
                        value={cv.trang_thai || 'chua_lam'}
                        onChange={(e) => handleUpdateTrangThai(cv.id, e.target.value)}
                        className={`px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800 ${
                          cv.trang_thai === 'hoan_thanh' ? 'bg-green-50 text-green-800 border-green-200' :
                          cv.trang_thai === 'dang_lam' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                          'bg-gray-50 text-gray-800'
                        }`}
                      >
                        <option value="chua_lam">Chưa làm</option>
                        <option value="dang_lam">Đang làm</option>
                        <option value="hoan_thanh">Hoàn thành</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!cv.ten_dieu_duong && (
                          <button
                            onClick={() => handleOpenPhanCongModal(cv)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>assignment</span>
                            <span>Phân công</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(cv)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cv.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tạo công việc */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa công việc' : 'Tạo công việc mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên công việc *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten_cong_viec}
                  onChange={(e) => setFormData({ ...formData, ten_cong_viec: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Nhập tên công việc..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                  placeholder="Mô tả chi tiết về công việc..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mức ưu tiên
                  </label>
                  <select
                    value={formData.muc_uu_tien}
                    onChange={(e) => setFormData({ ...formData, muc_uu_tien: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="thap">Thấp</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="cao">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thời gian dự kiến
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.thoi_gian_du_kien}
                    onChange={(e) => setFormData({ ...formData, thoi_gian_du_kien: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điều dưỡng (tùy chọn)
                  </label>
                  <select
                    value={formData.id_dieu_duong}
                    onChange={(e) => setFormData({ ...formData, id_dieu_duong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bệnh nhân (tùy chọn)
                  </label>
                  <select
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
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                  <span>Tạo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Phân công */}
      {showPhanCongModal && selectedCongViec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">Phân công công việc</h2>
              <button
                onClick={() => {
                  setShowPhanCongModal(false);
                  setSelectedCongViec(null);
                  setPhanCongForm({ id_dieu_duong: '', id_benh_nhan: '' });
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">Công việc:</p>
              <p className="text-gray-900 font-bold">{selectedCongViec.ten_cong_viec}</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Điều dưỡng *
                </label>
                <select
                  required
                  value={phanCongForm.id_dieu_duong}
                  onChange={(e) => setPhanCongForm({ ...phanCongForm, id_dieu_duong: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bệnh nhân *
                </label>
                <select
                  required
                  value={phanCongForm.id_benh_nhan}
                  onChange={(e) => setPhanCongForm({ ...phanCongForm, id_benh_nhan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="">Chọn bệnh nhân</option>
                  {benhNhans.map((bn) => (
                    <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanCongModal(false);
                    setSelectedCongViec(null);
                    setPhanCongForm({ id_dieu_duong: '', id_benh_nhan: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePhanCong}
                  disabled={!phanCongForm.id_dieu_duong || !phanCongForm.id_benh_nhan}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>assignment</span>
                  <span>Phân công</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

