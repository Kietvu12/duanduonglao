import { useEffect, useState } from 'react';
import { lichThamBenhAPI, benhNhanAPI, nguoiThanAPI } from '../../services/api';

export default function LichThamBenhPage() {
  const [lichThamBenhs, setLichThamBenhs] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [nguoiThans, setNguoiThans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  // Filter states
  const [search, setSearch] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');
  const [filterBenhNhan, setFilterBenhNhan] = useState('');
  const [filterKhungGio, setFilterKhungGio] = useState('');
  const [filterNgayBatDau, setFilterNgayBatDau] = useState('');
  const [filterNgayKetThuc, setFilterNgayKetThuc] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    id_benh_nhan: '',
    id_nguoi_than: '',
    ngay: '',
    khung_gio: '8_10',
    so_nguoi_di_cung: '',
    ghi_chu: '',
    trang_thai: 'cho_duyet',
  });

  useEffect(() => {
    loadBenhNhans();
  }, []);

  useEffect(() => {
    loadLichThamBenhs();
  }, [search, filterTrangThai, filterBenhNhan, filterKhungGio, filterNgayBatDau, filterNgayKetThuc]);

  // Load danh sách người thân khi chọn bệnh nhân
  useEffect(() => {
    if (formData.id_benh_nhan) {
      loadNguoiThans(formData.id_benh_nhan);
    } else {
      setNguoiThans([]);
      setFormData(prev => ({ ...prev, id_nguoi_than: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.id_benh_nhan]);

  const loadLichThamBenhs = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 1000,
        ...(search ? { search } : {}),
        ...(filterTrangThai ? { trang_thai: filterTrangThai } : {}),
        ...(filterBenhNhan ? { id_benh_nhan: filterBenhNhan } : {}),
        ...(filterKhungGio ? { khung_gio: filterKhungGio } : {}),
        ...(filterNgayBatDau ? { start_date: filterNgayBatDau } : {}),
        ...(filterNgayKetThuc ? { end_date: filterNgayKetThuc } : {}),
      };
      const response = await lichThamBenhAPI.getAll(params);
      setLichThamBenhs(response.data || []);
    } catch (error) {
      console.error('Error loading lich tham benhs:', error);
      alert('Lỗi khi tải danh sách lịch thăm khám: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterTrangThai('');
    setFilterBenhNhan('');
    setFilterKhungGio('');
    setFilterNgayBatDau('');
    setFilterNgayKetThuc('');
  };

  const hasActiveFilters = search || filterTrangThai || filterBenhNhan || filterKhungGio || filterNgayBatDau || filterNgayKetThuc;

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll();
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const loadNguoiThans = async (benhNhanId) => {
    try {
      const response = await nguoiThanAPI.getAll({ id_benh_nhan: benhNhanId });
      setNguoiThans(response.data || []);
    } catch (error) {
      console.error('Error loading nguoi thans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        so_nguoi_di_cung: formData.so_nguoi_di_cung ? parseInt(formData.so_nguoi_di_cung) : 0,
        id_benh_nhan: parseInt(formData.id_benh_nhan),
        id_nguoi_than: formData.id_nguoi_than ? parseInt(formData.id_nguoi_than) : null,
      };
      
      if (editing) {
        await lichThamBenhAPI.update(editing.id, submitData);
        alert('Cập nhật lịch thăm khám thành công');
      } else {
        await lichThamBenhAPI.create(submitData);
        alert('Tạo lịch thăm khám thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadLichThamBenhs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (ltb) => {
    setEditing(ltb);
    
    // Load người thân của bệnh nhân này trước
    if (ltb.id_benh_nhan) {
      await loadNguoiThans(ltb.id_benh_nhan);
    }
    
    setFormData({
      id_benh_nhan: ltb.id_benh_nhan ? String(ltb.id_benh_nhan) : '',
      id_nguoi_than: ltb.id_nguoi_than ? String(ltb.id_nguoi_than) : '',
      ngay: ltb.ngay || '',
      khung_gio: ltb.khung_gio || '8_10',
      so_nguoi_di_cung: ltb.so_nguoi_di_cung ? String(ltb.so_nguoi_di_cung) : '',
      ghi_chu: ltb.ghi_chu || '',
      trang_thai: ltb.trang_thai || 'cho_duyet',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa lịch thăm khám này?')) return;
    try {
      await lichThamBenhAPI.delete(id);
      alert('Xóa lịch thăm khám thành công');
      loadLichThamBenhs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_benh_nhan: '',
      id_nguoi_than: '',
      ngay: '',
      khung_gio: '8_10',
      so_nguoi_di_cung: '',
      ghi_chu: '',
      trang_thai: 'cho_duyet',
    });
    setNguoiThans([]);
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Lịch thăm khám</h1>
          <p className="text-gray-600 mt-2">Lịch thăm khám của người nhà bệnh nhân</p>
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
          <span>Tạo lịch thăm khám</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex w-full items-center rounded-lg h-10 border border-gray-200 bg-gray-50 overflow-hidden">
              <div className="text-gray-600 flex items-center justify-center pl-3 pr-2 h-full">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bệnh nhân, người thân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-full bg-transparent border-0 outline-0 text-gray-800 placeholder:text-gray-600 pl-2 pr-4 text-sm font-normal focus:ring-0"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                {showFilters ? 'filter_alt' : 'tune'}
              </span>
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="bg-white text-[#4A90E2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {[search, filterTrangThai, filterBenhNhan, filterKhungGio, filterNgayBatDau, filterNgayKetThuc].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Bộ lọc</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filter: Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={filterTrangThai}
                  onChange={(e) => setFilterTrangThai(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="cho_duyet">Chờ duyệt</option>
                  <option value="da_duyet">Đã duyệt</option>
                  <option value="tu_choi">Từ chối</option>
                </select>
              </div>

              {/* Filter: Bệnh nhân */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân
                </label>
                <select
                  value={filterBenhNhan}
                  onChange={(e) => setFilterBenhNhan(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  {benhNhans.map((bn) => (
                    <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Khung giờ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khung giờ
                </label>
                <select
                  value={filterKhungGio}
                  onChange={(e) => setFilterKhungGio(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="8_10">8:00 - 10:00</option>
                  <option value="14_16">14:00 - 16:00</option>
                  <option value="18_20">18:00 - 20:00</option>
                </select>
              </div>

              {/* Filter: Ngày bắt đầu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filterNgayBatDau}
                  onChange={(e) => setFilterNgayBatDau(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                />
              </div>

              {/* Filter: Ngày kết thúc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={filterNgayKetThuc}
                  onChange={(e) => setFilterNgayKetThuc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="inline-block">Đang tải...</div>
          </div>
        ) : lichThamBenhs.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>event_busy</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có lịch thăm khám nào</p>
            <p className="text-gray-400 text-sm">Bấm "Tạo lịch thăm khám" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Người thân</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày thăm</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Khung giờ</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số người đi cùng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lichThamBenhs.map((ltb) => (
                  <tr key={ltb.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {ltb.ten_benh_nhan?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{ltb.ten_benh_nhan || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{ltb.ten_nguoi_than || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {ltb.ngay ? new Date(ltb.ngay).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#4A90E2]/20 text-[#4A90E2]">
                        {ltb.khung_gio === '8_10' ? '8:00 - 10:00' :
                         ltb.khung_gio === '14_16' ? '14:00 - 16:00' :
                         ltb.khung_gio === '18_20' ? '18:00 - 20:00' : ltb.khung_gio}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-gray-500" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
                        <span>{ltb.so_nguoi_di_cung || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ltb.trang_thai === 'da_duyet' ? 'bg-green-100 text-green-800' :
                        ltb.trang_thai === 'tu_choi' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ltb.trang_thai === 'cho_duyet' ? 'Chờ duyệt' :
                         ltb.trang_thai === 'da_duyet' ? 'Đã duyệt' :
                         ltb.trang_thai === 'tu_choi' ? 'Từ chối' : ltb.trang_thai}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(ltb)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ltb.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa lịch thăm khám' : 'Tạo lịch thăm khám mới'}
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
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        id_benh_nhan: e.target.value,
                        id_nguoi_than: ''
                      });
                    }}
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
                    Người thân *
                  </label>
                  <select
                    required
                    value={formData.id_nguoi_than}
                    onChange={(e) => setFormData({ ...formData, id_nguoi_than: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
                    disabled={!formData.id_benh_nhan}
                  >
                    <option value="">Chọn người thân</option>
                    {nguoiThans.map((nt) => (
                      <option key={nt.id} value={nt.id}>{nt.ho_ten} ({nt.moi_quan_he || '-'})</option>
                    ))}
                  </select>
                  {!formData.id_benh_nhan && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>info</span>
                      Vui lòng chọn bệnh nhân trước
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày thăm *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Khung giờ *
                  </label>
                  <select
                    required
                    value={formData.khung_gio}
                    onChange={(e) => setFormData({ ...formData, khung_gio: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="8_10">8:00 - 10:00</option>
                    <option value="14_16">14:00 - 16:00</option>
                    <option value="18_20">18:00 - 20:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số người đi cùng
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.so_nguoi_di_cung}
                    onChange={(e) => setFormData({ ...formData, so_nguoi_di_cung: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    required
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="cho_duyet">Chờ duyệt</option>
                    <option value="da_duyet">Đã duyệt</option>
                    <option value="tu_choi">Từ chối</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.ghi_chu}
                    onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    rows="3"
                    placeholder="Nhập ghi chú về lịch thăm khám..."
                  />
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
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{editing ? 'save' : 'add'}</span>
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

