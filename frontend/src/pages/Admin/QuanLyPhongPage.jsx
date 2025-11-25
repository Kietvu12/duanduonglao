import { useEffect, useState } from 'react';
import { phanKhuAPI, phongNewAPI, uploadAPI, phongAPI } from '../../services/api';

export default function QuanLyPhongPage() {
  const [activeTab, setActiveTab] = useState('phan-khu'); // 'phan-khu' or 'phong'
  
  // Phân khu state
  const [phanKhus, setPhanKhus] = useState([]);
  const [loadingPhanKhu, setLoadingPhanKhu] = useState(true);
  const [showPhanKhuModal, setShowPhanKhuModal] = useState(false);
  const [editingPhanKhu, setEditingPhanKhu] = useState(null);
  const [phanKhuForm, setPhanKhuForm] = useState({
    ten_khu: '',
    mo_ta: '',
    so_tang: '',
    so_phong: '',
  });

  // Phòng state
  const [phongs, setPhongs] = useState([]);
  const [loadingPhong, setLoadingPhong] = useState(true);
  const [showPhongModal, setShowPhongModal] = useState(false);
  const [editingPhong, setEditingPhong] = useState(null);
  const [phongForm, setPhongForm] = useState({
    id_phan_khu: '',
    ten_phong: '',
    so_phong: '',
    so_giuong: '',
    so_nguoi_toi_da: 1,
    dien_tich: '',
    mo_ta: '',
    trang_thai: 'trong',
    anh_1: '',
    anh_2: '',
    anh_3: '',
  });
  const [uploadingImages, setUploadingImages] = useState({ anh_1: false, anh_2: false, anh_3: false });
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [phongTrangThaiFilter, setPhongTrangThaiFilter] = useState('');
  const [phongSearch, setPhongSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'phan-khu') {
      loadPhanKhus();
    } else {
      loadPhanKhus(); // Load phân khu để có thể chọn khi tạo/sửa phòng và filter
      loadPhongs();
    }
  }, [activeTab]);

  // Load phân khu
  const loadPhanKhus = async () => {
    try {
      setLoadingPhanKhu(true);
      const response = await phanKhuAPI.getAll();
      setPhanKhus(response.data || []);
    } catch (error) {
      console.error('Error loading phan khus:', error);
      alert('Lỗi khi tải danh sách phân khu: ' + error.message);
    } finally {
      setLoadingPhanKhu(false);
    }
  };

  // Load phòng
  const loadPhongs = async (idPhanKhu = null, trangThai = null, search = null) => {
    try {
      setLoadingPhong(true);
      const params = {};
      if (idPhanKhu) params.id_phan_khu = idPhanKhu;
      if (trangThai) params.trang_thai = trangThai;
      if (search) params.search = search;
      const response = await phongNewAPI.getAll(params);
      setPhongs(response.data || []);
    } catch (error) {
      console.error('Error loading phongs:', error);
      alert('Lỗi khi tải danh sách phòng: ' + error.message);
    } finally {
      setLoadingPhong(false);
    }
  };

  // Phân khu handlers
  const handleSubmitPhanKhu = async (e) => {
    e.preventDefault();
    try {
      if (editingPhanKhu) {
        await phanKhuAPI.update(editingPhanKhu.id, phanKhuForm);
        alert('Cập nhật phân khu thành công');
      } else {
        await phanKhuAPI.create(phanKhuForm);
        alert('Tạo phân khu thành công');
      }
      setShowPhanKhuModal(false);
      setEditingPhanKhu(null);
      resetPhanKhuForm();
      loadPhanKhus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditPhanKhu = (pk) => {
    setEditingPhanKhu(pk);
    setPhanKhuForm({
      ten_khu: pk.ten_khu || '',
      mo_ta: pk.mo_ta || '',
      so_tang: pk.so_tang || '',
      so_phong: pk.so_phong || '',
    });
    setShowPhanKhuModal(true);
  };

  const handleDeletePhanKhu = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phân khu này?')) return;
    try {
      await phanKhuAPI.delete(id);
      alert('Xóa phân khu thành công');
      loadPhanKhus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetPhanKhuForm = () => {
    setPhanKhuForm({
      ten_khu: '',
      mo_ta: '',
      so_tang: '',
      so_phong: '',
    });
  };

  // Phòng handlers
  const handleSubmitPhong = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...phongForm,
        so_giuong: phongForm.so_giuong ? parseInt(phongForm.so_giuong) : null,
        dien_tich: phongForm.dien_tich ? parseFloat(phongForm.dien_tich) : null,
        anh_1: phongForm.anh_1 || null,
        anh_2: phongForm.anh_2 || null,
        anh_3: phongForm.anh_3 || null,
      };

      if (editingPhong) {
        await phongNewAPI.update(editingPhong.id, submitData);
        alert('Cập nhật phòng thành công');
      } else {
        await phongNewAPI.create(submitData);
        alert('Tạo phòng thành công');
      }
      setShowPhongModal(false);
      setEditingPhong(null);
      resetPhongForm();
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditPhong = async (p) => {
    try {
      const fullPhong = await phongNewAPI.getById(p.id);
      const phongData = fullPhong.data;
      setEditingPhong(phongData);
      setPhongForm({
        id_phan_khu: phongData.id_phan_khu || '',
        ten_phong: phongData.ten_phong || '',
        so_phong: phongData.so_phong || '',
        so_giuong: phongData.so_giuong || '',
        so_nguoi_toi_da: phongData.so_nguoi_toi_da || 1,
        dien_tich: phongData.dien_tich || '',
        mo_ta: phongData.mo_ta || '',
        trang_thai: phongData.trang_thai || 'trong',
        anh_1: phongData.anh_1 || '',
        anh_2: phongData.anh_2 || '',
        anh_3: phongData.anh_3 || '',
      });
      setShowPhongModal(true);
    } catch (error) {
      console.error('Error loading phong:', error);
      alert('Lỗi khi tải dữ liệu phòng: ' + error.message);
    }
  };

  const handleDeletePhong = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
    try {
      await phongNewAPI.delete(id);
      alert('Xóa phòng thành công');
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetPhongForm = () => {
    setPhongForm({
      id_phan_khu: '',
      ten_phong: '',
      so_phong: '',
      so_giuong: '',
      so_nguoi_toi_da: 1,
      dien_tich: '',
      mo_ta: '',
      trang_thai: 'trong',
      anh_1: '',
      anh_2: '',
      anh_3: '',
    });
  };

  // Upload ảnh
  const handleUploadImage = async (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!imageTypes.includes(file.type)) {
      alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 20MB');
      return;
    }

    try {
      setUploadingImages({ ...uploadingImages, [imageField]: true });
      const response = await uploadAPI.uploadMedia(file);
      setPhongForm({ ...phongForm, [imageField]: response.data.url });
      e.target.value = ''; // Reset input
    } catch (error) {
      alert('Lỗi khi upload ảnh: ' + error.message);
    } finally {
      setUploadingImages({ ...uploadingImages, [imageField]: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Phân khu & Phòng</h1>
          <p className="text-gray-600 mt-1">Quản lý phân khu và phòng với hình ảnh</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('phan-khu')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'phan-khu'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Phân khu
          </button>
          <button
            onClick={() => setActiveTab('phong')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'phong'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Phòng
          </button>
        </nav>
      </div>

      {/* Phân khu Tab */}
      {activeTab === 'phan-khu' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetPhanKhuForm();
                setEditingPhanKhu(null);
                setShowPhanKhuModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Tạo phân khu
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingPhanKhu ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên khu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tầng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số phòng (dự kiến)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số phòng (thực tế)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {phanKhus.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    phanKhus.map((pk) => (
                      <tr key={pk.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{pk.ten_khu}</td>
                        <td className="px-6 py-4">{pk.mo_ta || '-'}</td>
                        <td className="px-6 py-4">{pk.so_tang || '-'}</td>
                        <td className="px-6 py-4">{pk.so_phong || '-'}</td>
                        <td className="px-6 py-4">{pk.so_phong_thuc_te || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditPhanKhu(pk)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeletePhanKhu(pk.id)}
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
        </div>
      )}

      {/* Phòng Tab */}
      {activeTab === 'phong' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo Phân khu</label>
                <select
                  value={selectedPhanKhu || ''}
                  onChange={(e) => {
                    const newPhanKhu = e.target.value || '';
                    setSelectedPhanKhu(newPhanKhu);
                    loadPhongs(newPhanKhu, phongTrangThaiFilter, phongSearch);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tất cả phân khu</option>
                  {phanKhus.map((pk) => (
                    <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo Trạng thái</label>
                <select
                  value={phongTrangThaiFilter || ''}
                  onChange={(e) => {
                    const newTrangThai = e.target.value || '';
                    setPhongTrangThaiFilter(newTrangThai);
                    loadPhongs(selectedPhanKhu, newTrangThai, phongSearch);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tất cả</option>
                  <option value="trong">Trống</option>
                  <option value="co_nguoi">Có người</option>
                  <option value="bao_tri">Bảo trì</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <input
                  type="text"
                  value={phongSearch || ''}
                  onChange={(e) => {
                    const newSearch = e.target.value || '';
                    setPhongSearch(newSearch);
                    loadPhongs(selectedPhanKhu, phongTrangThaiFilter, newSearch);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tên phòng, số phòng..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={async () => {
                await loadPhanKhus(); // Đảm bảo có danh sách phân khu
                resetPhongForm();
                setEditingPhong(null);
                setShowPhongModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Tạo phòng
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingPhong ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phân khu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên phòng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số phòng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số giường</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diện tích</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số người</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {phongs.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      phongs.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{p.ten_khu}</td>
                          <td className="px-6 py-4 font-medium">{p.ten_phong}</td>
                          <td className="px-6 py-4">{p.so_phong || '-'}</td>
                          <td className="px-6 py-4">{p.so_giuong || '-'}</td>
                          <td className="px-6 py-4">{p.dien_tich ? `${p.dien_tich} m²` : '-'}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <span className="font-medium">
                                {p.benh_nhans?.length || 0}
                              </span>
                              <span className="text-gray-500"> / </span>
                              <span className="text-gray-600">
                                {p.so_nguoi_toi_da || 1}
                              </span>
                              {p.benh_nhans?.length >= (p.so_nguoi_toi_da || 1) && (
                                <span className="ml-2 text-xs text-red-600 font-medium">(Đầy)</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              p.trang_thai === 'trong' ? 'bg-green-100 text-green-800' :
                              p.trang_thai === 'co_nguoi' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {p.trang_thai?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {p.benh_nhans && p.benh_nhans.length > 0 ? (
                              <div className="space-y-2">
                                {p.benh_nhans.map((bn) => (
                                  <div key={bn.id} className="text-sm flex items-center gap-2 flex-wrap">
                                    <a
                                      href={`/admin/benh-nhan/${bn.id_benh_nhan}`}
                                      className="text-blue-600 hover:text-blue-900 hover:underline font-medium"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {bn.ho_ten}
                                    </a>
                                    {bn.giuong && (
                                      <span className="text-gray-500 text-xs">(G{bn.giuong})</span>
                                    )}
                                    {bn.loai_dich_vu && (
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                        {bn.loai_dich_vu.replace('_', ' ')}
                                      </span>
                                    )}
                                    <div className="flex gap-1 ml-auto">
                                      <button
                                        onClick={() => handleDoiPhong(bn, p)}
                                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                        title="Đổi phòng"
                                      >
                                        Đổi
                                      </button>
                                      <button
                                        onClick={() => handleXoaBenhNhanKhoiPhong(bn.id, p.id)}
                                        className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                        title="Xóa khỏi phòng"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-xs text-gray-500 mt-1">
                                  Tổng: {p.benh_nhans.length} bệnh nhân
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Trống</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditPhong(p)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeletePhong(p.id)}
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Phân khu */}
      {showPhanKhuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPhanKhu ? 'Sửa phân khu' : 'Tạo phân khu mới'}
            </h2>
            <form onSubmit={handleSubmitPhanKhu} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khu *
                </label>
                <input
                  type="text"
                  required
                  value={phanKhuForm.ten_khu}
                  onChange={(e) => setPhanKhuForm({ ...phanKhuForm, ten_khu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={phanKhuForm.mo_ta}
                  onChange={(e) => setPhanKhuForm({ ...phanKhuForm, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tầng
                  </label>
                  <input
                    type="number"
                    value={phanKhuForm.so_tang}
                    onChange={(e) => setPhanKhuForm({ ...phanKhuForm, so_tang: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng (dự kiến)
                  </label>
                  <input
                    type="number"
                    value={phanKhuForm.so_phong}
                    onChange={(e) => setPhanKhuForm({ ...phanKhuForm, so_phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanKhuModal(false);
                    setEditingPhanKhu(null);
                    resetPhanKhuForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPhanKhu ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Phòng */}
      {showPhongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPhong ? 'Sửa phòng' : 'Tạo phòng mới'}
            </h2>
            <form onSubmit={handleSubmitPhong} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phân khu *
                </label>
                <select
                  required
                  value={phongForm.id_phan_khu}
                  onChange={(e) => setPhongForm({ ...phongForm, id_phan_khu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn phân khu</option>
                  {phanKhus.map((pk) => (
                    <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng *
                  </label>
                  <input
                    type="text"
                    required
                    value={phongForm.ten_phong}
                    onChange={(e) => setPhongForm({ ...phongForm, ten_phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng
                  </label>
                  <input
                    type="text"
                    value={phongForm.so_phong}
                    onChange={(e) => setPhongForm({ ...phongForm, so_phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số giường
                  </label>
                  <input
                    type="number"
                    value={phongForm.so_giuong}
                    onChange={(e) => setPhongForm({ ...phongForm, so_giuong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số người tối đa *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={phongForm.so_nguoi_toi_da}
                    onChange={(e) => setPhongForm({ ...phongForm, so_nguoi_toi_da: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Số lượng tối đa bệnh nhân có thể ở trong phòng"
                  />
                  <p className="text-xs text-gray-500 mt-1">Số lượng tối đa bệnh nhân có thể ở trong phòng này</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={phongForm.dien_tich}
                    onChange={(e) => setPhongForm({ ...phongForm, dien_tich: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={phongForm.trang_thai}
                    onChange={(e) => setPhongForm({ ...phongForm, trang_thai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="trong">Trống</option>
                    <option value="co_nguoi">Có người</option>
                    <option value="bao_tri">Bảo trì</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={phongForm.mo_ta}
                  onChange={(e) => setPhongForm({ ...phongForm, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>

              {/* Upload 3 ảnh */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh phòng (3 ảnh)</h3>
                {[1, 2, 3].map((num) => {
                  const imageField = `anh_${num}`;
                  return (
                    <div key={num}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh {num}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, imageField)}
                          disabled={uploadingImages[imageField]}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        />
                        {uploadingImages[imageField] && (
                          <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
                        )}
                        {phongForm[imageField] && (
                          <div className="mt-2">
                            <img
                              src={phongForm[imageField]}
                              alt={`Ảnh ${num}`}
                              className="max-w-xs h-auto rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setPhongForm({ ...phongForm, [imageField]: '' })}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Xóa ảnh {num}
                            </button>
                          </div>
                        )}
                        <input
                          type="text"
                          value={phongForm[imageField]}
                          onChange={(e) => setPhongForm({ ...phongForm, [imageField]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Hoặc nhập URL ảnh"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhongModal(false);
                    setEditingPhong(null);
                    resetPhongForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPhong ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

