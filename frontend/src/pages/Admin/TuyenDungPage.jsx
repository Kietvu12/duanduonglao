import { useEffect, useState } from 'react';
import { tuyenDungAPI } from '../../services/api';

export default function TuyenDungPage() {
  const [tinTuyenDungs, setTinTuyenDungs] = useState([]);
  const [hoSoUngTuyens, setHoSoUngTuyens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tin-tuyen-dung');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    vi_tri: '',
    yeu_cau: '',
    so_luong: 1,
    ngay_het_han: '',
    trang_thai: 'dang_tuyen',
  });

  useEffect(() => {
    loadTinTuyenDungs();
    loadHoSoUngTuyens();
  }, []);

  const loadTinTuyenDungs = async () => {
    try {
      setLoading(true);
      const response = await tuyenDungAPI.getAllTinTuyenDung();
      setTinTuyenDungs(response.data || []);
    } catch (error) {
      console.error('Error loading tin tuyen dung:', error);
      alert('Lỗi khi tải danh sách tin tuyển dụng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHoSoUngTuyens = async () => {
    try {
      const response = await tuyenDungAPI.getAllHoSoUngTuyen();
      setHoSoUngTuyens(response.data || []);
    } catch (error) {
      console.error('Error loading ho so ung tuyen:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await tuyenDungAPI.updateTinTuyenDung(editing.id, formData);
        alert('Cập nhật tin tuyển dụng thành công');
      } else {
        await tuyenDungAPI.createTinTuyenDung(formData);
        alert('Tạo tin tuyển dụng thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadTinTuyenDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (ttd) => {
    setEditing(ttd);
    setFormData({
      tieu_de: ttd.tieu_de || '',
      mo_ta: ttd.mo_ta || '',
      vi_tri: ttd.vi_tri || '',
      yeu_cau: ttd.yeu_cau || '',
      so_luong: ttd.so_luong || 1,
      ngay_het_han: ttd.ngay_het_han ? ttd.ngay_het_han.slice(0, 16) : '',
      trang_thai: ttd.trang_thai || 'dang_tuyen',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;
    try {
      await tuyenDungAPI.deleteTinTuyenDung(id);
      alert('Xóa tin tuyển dụng thành công');
      loadTinTuyenDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleUpdateHoSo = async (id, trang_thai) => {
    try {
      await tuyenDungAPI.updateHoSoUngTuyen(id, { trang_thai });
      alert('Cập nhật trạng thái thành công');
      loadHoSoUngTuyens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      tieu_de: '',
      mo_ta: '',
      vi_tri: '',
      yeu_cau: '',
      so_luong: 1,
      ngay_het_han: '',
      trang_thai: 'dang_tuyen',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Tuyển dụng</h1>
          <p className="text-gray-600 mt-1">Tin tuyển dụng và hồ sơ ứng tuyển</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo tin tuyển dụng
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('tin-tuyen-dung')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tin-tuyen-dung'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tin tuyển dụng
            </button>
            <button
              onClick={() => setActiveTab('ho-so-ung-tuyen')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ho-so-ung-tuyen'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Hồ sơ ứng tuyển
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Tin tuyển dụng */}
          {activeTab === 'tin-tuyen-dung' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Đang tải...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tinTuyenDungs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      tinTuyenDungs.map((ttd) => (
                        <tr key={ttd.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{ttd.tieu_de}</td>
                          <td className="px-6 py-4">{ttd.vi_tri}</td>
                          <td className="px-6 py-4">{ttd.so_luong}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ttd.trang_thai === 'dang_tuyen' ? 'bg-green-100 text-green-800' :
                              ttd.trang_thai === 'tam_dung' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ttd.trang_thai?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(ttd)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(ttd.id)}
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
          )}

          {/* Tab: Hồ sơ ứng tuyển */}
          {activeTab === 'ho-so-ung-tuyen' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hoSoUngTuyens.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    hoSoUngTuyens.map((hs) => (
                      <tr key={hs.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{hs.ho_ten}</td>
                        <td className="px-6 py-4">{hs.email}</td>
                        <td className="px-6 py-4">{hs.so_dien_thoai}</td>
                        <td className="px-6 py-4">{hs.vi_tri}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            hs.trang_thai === 'trung_tuyen' ? 'bg-green-100 text-green-800' :
                            hs.trang_thai === 'tu_choi' ? 'bg-red-100 text-red-800' :
                            hs.trang_thai === 'phong_van' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {hs.trang_thai?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={hs.trang_thai}
                            onChange={(e) => handleUpdateHoSo(hs.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="moi_nop">Mới nộp</option>
                            <option value="da_xem">Đã xem</option>
                            <option value="phong_van">Phỏng vấn</option>
                            <option value="trung_tuyen">Trúng tuyển</option>
                            <option value="tu_choi">Từ chối</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tieu_de}
                  onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vi_tri}
                  onChange={(e) => setFormData({ ...formData, vi_tri: e.target.value })}
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
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu
                </label>
                <textarea
                  value={formData.yeu_cau}
                  onChange={(e) => setFormData({ ...formData, yeu_cau: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    value={formData.so_luong}
                    onChange={(e) => setFormData({ ...formData, so_luong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.ngay_het_han}
                    onChange={(e) => setFormData({ ...formData, ngay_het_han: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dang_tuyen">Đang tuyển</option>
                    <option value="tam_dung">Tạm dừng</option>
                    <option value="da_dong">Đã đóng</option>
                  </select>
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

