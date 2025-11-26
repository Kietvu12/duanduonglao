import { useEffect, useState } from 'react';
import { nhanVienAPI } from '../../services/api';

export default function NhanVienPage() {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showPhanCaModal, setShowPhanCaModal] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [lichPhanCa, setLichPhanCa] = useState([]);
  const [showPhanCaForm, setShowPhanCaForm] = useState(false);
  const [editingPhanCa, setEditingPhanCa] = useState(null);
  const [phanCaForm, setPhanCaForm] = useState({
    ca: 'sang',
    ngay: '',
    gio_bat_dau: '',
    gio_ket_thuc: '',
    trang_thai: 'du_kien'
  });
  const [showChuyenCaModal, setShowChuyenCaModal] = useState(false);
  const [caCanChuyen, setCaCanChuyen] = useState(null);
  const [selectedNhanVienMoi, setSelectedNhanVienMoi] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allLichPhanCa, setAllLichPhanCa] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [phanCaByDate, setPhanCaByDate] = useState([]);
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: '',
    vai_tro: 'dieu_duong',
    chuc_vu: '',
    bang_cap: '',
    luong_co_ban: '',
  });

  useEffect(() => {
    loadNhanViens();
  }, []);

  useEffect(() => {
    if (showCalendarModal) {
      // Mặc định chọn ngày hôm nay khi mở modal
      const today = new Date();
      setSelectedDate(today);
      loadAllLichPhanCa();
    }
  }, [showCalendarModal, currentMonth]);

  useEffect(() => {
    if (showCalendarModal && allLichPhanCa.length >= 0 && selectedDate) {
      const dateStr = formatDateForComparison(selectedDate);
      const phanCaOfDate = allLichPhanCa.filter(ca => {
        const caDate = normalizeDateFromDB(ca.ngay);
        return caDate === dateStr;
      });
      setPhanCaByDate(phanCaOfDate);
    }
  }, [allLichPhanCa, selectedDate, showCalendarModal]);

  const loadNhanViens = async () => {
    try {
      setLoading(true);
      const response = await nhanVienAPI.getAll();
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
      alert('Lỗi khi tải danh sách nhân viên: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { mat_khau, ...updateData } = formData;
        await nhanVienAPI.update(editing.id, updateData);
        alert('Cập nhật nhân viên thành công');
      } else {
        await nhanVienAPI.create(formData);
        alert('Thêm nhân viên thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadNhanViens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (nv) => {
    setEditing(nv);
    setFormData({
      ho_ten: nv.ho_ten || '',
      so_dien_thoai: nv.so_dien_thoai || '',
      email: nv.email || '',
      mat_khau: '',
      vai_tro: nv.vai_tro || 'dieu_duong',
      chuc_vu: nv.chuc_vu || '',
      bang_cap: nv.bang_cap || '',
      luong_co_ban: nv.luong_co_ban || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      ho_ten: '',
      so_dien_thoai: '',
      email: '',
      mat_khau: '',
      vai_tro: 'dieu_duong',
      chuc_vu: '',
      bang_cap: '',
      luong_co_ban: '',
    });
  };

  // Phân ca functions
  const handleOpenPhanCa = async (nv) => {
    setSelectedNhanVien(nv);
    setShowPhanCaModal(true);
    await loadLichPhanCa(nv.id);
  };

  const loadLichPhanCa = async (idTaiKhoan) => {
    try {
      const response = await nhanVienAPI.getLichPhanCa({ id_tai_khoan: idTaiKhoan });
      setLichPhanCa(response.data || []);
    } catch (error) {
      console.error('Error loading lich phan ca:', error);
      alert('Lỗi khi tải lịch phân ca: ' + error.message);
    }
  };

  // Hàm lấy thời gian cố định cho từng ca
  const getCaTime = (ca) => {
    const caTimes = {
      'sang': { gio_bat_dau: '06:00', gio_ket_thuc: '14:00' },
      'chieu': { gio_bat_dau: '14:00', gio_ket_thuc: '22:00' },
      'dem': { gio_bat_dau: '22:00', gio_ket_thuc: '06:00' }
    };
    return caTimes[ca] || { gio_bat_dau: '', gio_ket_thuc: '' };
  };

  // Hàm xử lý khi thay đổi ca
  const handleCaChange = (caValue) => {
    const caTime = getCaTime(caValue);
    setPhanCaForm({
      ...phanCaForm,
      ca: caValue,
      gio_bat_dau: caTime.gio_bat_dau,
      gio_ket_thuc: caTime.gio_ket_thuc
    });
  };

  const handleOpenPhanCaForm = (ca = null) => {
    if (ca) {
      setEditingPhanCa(ca);
      setPhanCaForm({
        ca: ca.ca || 'sang',
        ngay: ca.ngay || '',
        gio_bat_dau: ca.gio_bat_dau || '',
        gio_ket_thuc: ca.gio_ket_thuc || '',
        trang_thai: ca.trang_thai || 'du_kien'
      });
    } else {
      setEditingPhanCa(null);
      const defaultCa = 'sang';
      const defaultTime = getCaTime(defaultCa);
      setPhanCaForm({
        ca: defaultCa,
        ngay: '',
        gio_bat_dau: defaultTime.gio_bat_dau,
        gio_ket_thuc: defaultTime.gio_ket_thuc,
        trang_thai: 'du_kien'
      });
    }
    setShowPhanCaForm(true);
  };

  const handlePhanCaSubmit = async (e) => {
    e.preventDefault();
    try {
      // Debug: Log giá trị trước khi gửi
      console.log('Form data before submit:', {
        gio_bat_dau: phanCaForm.gio_bat_dau,
        gio_ket_thuc: phanCaForm.gio_ket_thuc,
        fullForm: phanCaForm
      });
      
      // Nếu chọn trạng thái "vang", hiển thị popup chuyển ca
      if (phanCaForm.trang_thai === 'vang' && editingPhanCa) {
        setCaCanChuyen(editingPhanCa);
        setShowPhanCaForm(false);
        setShowChuyenCaModal(true);
        return;
      }

      if (editingPhanCa) {
        await nhanVienAPI.updateLichPhanCa(editingPhanCa.id, phanCaForm);
        alert('Cập nhật phân ca thành công');
      } else {
        await nhanVienAPI.createLichPhanCa({
          id_tai_khoan: selectedNhanVien.id,
          ...phanCaForm
        });
        alert('Tạo phân ca thành công');
      }
      setShowPhanCaForm(false);
      setEditingPhanCa(null);
      await loadLichPhanCa(selectedNhanVien.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleChuyenCa = async () => {
    if (!selectedNhanVienMoi) {
      alert('Vui lòng chọn nhân viên để chuyển ca');
      return;
    }

    try {
      await nhanVienAPI.chuyenCa(caCanChuyen.id, {
        id_tai_khoan_moi: selectedNhanVienMoi
      });
      alert('Chuyển ca thành công');
      setShowChuyenCaModal(false);
      setCaCanChuyen(null);
      setSelectedNhanVienMoi('');
      
      // Reload danh sách phân ca của nhân viên nếu đang mở modal
      if (selectedNhanVien) {
        await loadLichPhanCa(selectedNhanVien.id);
      }
      
      // Reload calendar nếu đang mở
      if (showCalendarModal) {
        await loadAllLichPhanCa();
        // Reload danh sách của ngày được chọn
        if (selectedDate) {
          handleDateClick(selectedDate);
        }
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeletePhanCa = async (caId) => {
    if (!confirm('Bạn có chắc muốn xóa phân ca này?')) return;
    try {
      await nhanVienAPI.deleteLichPhanCa(caId);
      alert('Xóa phân ca thành công');
      await loadLichPhanCa(selectedNhanVien.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getCaLabel = (ca) => {
    const labels = {
      'sang': 'Ca sáng',
      'chieu': 'Ca chiều',
      'dem': 'Ca đêm'
    };
    return labels[ca] || ca;
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      'du_kien': 'Dự kiến',
      'dang_truc': 'Đang trực',
      'hoan_thanh': 'Hoàn thành',
      'vang': 'Vắng'
    };
    return labels[trangThai] || trangThai;
  };

  const getTrangThaiColor = (trangThai) => {
    const colors = {
      'du_kien': 'bg-blue-100 text-blue-800',
      'dang_truc': 'bg-yellow-100 text-yellow-800',
      'hoan_thanh': 'bg-green-100 text-green-800',
      'vang': 'bg-red-100 text-red-800'
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  // Calendar functions
  const loadAllLichPhanCa = async () => {
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      // Use formatDateForComparison to avoid timezone issues
      const startDateStr = formatDateForComparison(startDate);
      const endDateStr = formatDateForComparison(endDate);
      
      const response = await nhanVienAPI.getLichPhanCa({
        start_date: startDateStr,
        end_date: endDateStr
      });
      
      console.log('Loaded lich phan ca:', response.data);
      console.log('Date range:', startDateStr, 'to', endDateStr);
      setAllLichPhanCa(response.data || []);
    } catch (error) {
      console.error('Error loading all lich phan ca:', error);
      alert('Lỗi khi tải lịch phân ca: ' + error.message);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateForComparison(date);
    const phanCaOfDate = allLichPhanCa.filter(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      return caDate === dateStr;
    });
    setPhanCaByDate(phanCaOfDate);
    setSelectedDate(date);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Thêm các ngày trống ở đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateForComparison = (date) => {
    if (!date) return '';
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const normalizeDateFromDB = (dateValue) => {
    if (!dateValue) return '';
    // If it's already a string in YYYY-MM-DD format, use it directly
    if (typeof dateValue === 'string') {
      // Remove time part if exists (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
      // Also handle ISO string (YYYY-MM-DDTHH:mm:ss.sssZ -> YYYY-MM-DD)
      return dateValue.split(' ')[0].split('T')[0];
    }
    // If it's a Date object, format it using local timezone (not UTC)
    if (dateValue instanceof Date) {
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const day = String(dateValue.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  const hasPhanCa = (date) => {
    if (!date || allLichPhanCa.length === 0) return false;
    const dateStr = formatDateForComparison(date);
    
    return allLichPhanCa.some(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      // Debug log
      if (dateStr.includes('26') || caDate.includes('26')) {
        console.log('hasPhanCa check:', { 
          dateStr, 
          caDate, 
          caNgay: ca.ngay, 
          caNgayType: typeof ca.ngay,
          match: caDate === dateStr 
        });
      }
      return caDate === dateStr;
    });
  };

  const getPhanCaCount = (date) => {
    if (!date || allLichPhanCa.length === 0) return 0;
    const dateStr = formatDateForComparison(date);
    return allLichPhanCa.filter(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      return caDate === dateStr;
    }).length;
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhân viên</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin nhân viên</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const today = new Date();
              setShowCalendarModal(true);
              setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(today);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📅 Xem lịch phân ca
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditing(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chức vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nhanViens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                nhanViens.map((nv) => (
                  <tr key={nv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{nv.ho_ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{nv.so_dien_thoai}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{nv.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 capitalize">
                        {nv.vai_tro?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{nv.chuc_vu || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(nv)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleOpenPhanCa(nv)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Phân ca
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
              {editing ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      required={!editing}
                      value={formData.mat_khau}
                      onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={formData.vai_tro}
                    onChange={(e) => setFormData({ ...formData, vai_tro: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dieu_duong">Điều dưỡng</option>
                    <option value="dieu_duong_truong">Điều dưỡng trưởng</option>
                    <option value="quan_ly_y_te">Quản lý Y tế</option>
                    <option value="quan_ly_nhan_su">Quản lý Nhân sự</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    value={formData.chuc_vu}
                    onChange={(e) => setFormData({ ...formData, chuc_vu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bằng cấp
                  </label>
                  <input
                    type="text"
                    value={formData.bang_cap}
                    onChange={(e) => setFormData({ ...formData, bang_cap: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lương cơ bản
                  </label>
                  <input
                    type="number"
                    value={formData.luong_co_ban}
                    onChange={(e) => setFormData({ ...formData, luong_co_ban: e.target.value })}
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

      {/* Modal: Phân ca */}
      {showPhanCaModal && selectedNhanVien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Lịch phân ca - {selectedNhanVien.ho_ten}
              </h2>
              <button
                onClick={() => {
                  setShowPhanCaModal(false);
                  setSelectedNhanVien(null);
                  setLichPhanCa([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => handleOpenPhanCaForm()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Thêm phân ca
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ca</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ bắt đầu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ kết thúc</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lichPhanCa.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                        Chưa có lịch phân ca
                      </td>
                    </tr>
                  ) : (
                    lichPhanCa.map((ca) => (
                      <tr key={ca.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          {new Date(ca.ngay).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{getCaLabel(ca.ca)}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{ca.gio_bat_dau}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{ca.gio_ket_thuc}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                            {getTrangThaiLabel(ca.trang_thai)}
                          </span>
                        </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenPhanCaForm(ca)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeletePhanCa(ca.id)}
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
          </div>
        </div>
      )}

      {/* Modal: Form phân ca */}
      {showPhanCaForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPhanCa ? 'Sửa phân ca' : 'Thêm phân ca mới'}
            </h2>
            <form onSubmit={handlePhanCaSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                <input
                  type="date"
                  required
                  value={phanCaForm.ngay}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, ngay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ca *</label>
                <select
                  required
                  value={phanCaForm.ca}
                  onChange={(e) => handleCaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="sang">Ca sáng (06:00 - 14:00)</option>
                  <option value="chieu">Ca chiều (14:00 - 22:00)</option>
                  <option value="dem">Ca đêm (22:00 - 06:00)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_bat_dau}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_bat_dau: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_ket_thuc}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_ket_thuc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={phanCaForm.trang_thai}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, trang_thai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="du_kien">Dự kiến</option>
                  <option value="dang_truc">Đang trực</option>
                  <option value="hoan_thanh">Hoàn thành</option>
                  <option value="vang">Vắng</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanCaForm(false);
                    setEditingPhanCa(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPhanCa ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calendar View */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lịch phân ca</h2>
              <button
                onClick={() => {
                  setShowCalendarModal(false);
                  setSelectedDate(null);
                  setPhanCaByDate([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={previousMonth}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    ← Tháng trước
                  </button>
                  <h3 className="text-lg font-semibold capitalize">
                    {formatMonthYear(currentMonth)}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Tháng sau →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }
                    const hasCa = hasPhanCa(date);
                    const caCount = getPhanCaCount(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <button
                        key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square border border-gray-200 rounded p-1 text-sm hover:bg-blue-50 transition-colors ${
                          isSelected ? 'bg-blue-200 border-blue-500' : ''
                        } ${isToday ? 'ring-2 ring-blue-400' : ''} ${
                          hasCa ? 'bg-green-50 border-green-300' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className={`${isToday ? 'font-bold text-blue-600' : ''}`}>
                            {date.getDate()}
                          </span>
                          {hasCa && (
                            <span className="text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mt-1">
                              {caCount}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danh sách phân ca của ngày được chọn */}
              <div className="col-span-1 border-l pl-4">
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {selectedDate.toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    {phanCaByDate.length === 0 ? (
                      <p className="text-gray-500 text-sm">Không có phân ca trong ngày này</p>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {phanCaByDate.map((ca) => (
                          <div
                            key={ca.id}
                            className="border border-gray-200 rounded p-3 hover:bg-gray-50"
                          >
                            <div className="font-medium text-sm">{ca.ho_ten}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {getCaLabel(ca.ca)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {ca.gio_bat_dau} - {ca.gio_ket_thuc}
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className={`px-2 py-1 text-xs rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                                {getTrangThaiLabel(ca.trang_thai)}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    // Tìm nhân viên từ ca để mở form sửa
                                    const nv = nhanViens.find(n => n.id === ca.id_tai_khoan);
                                    if (nv) {
                                      setSelectedNhanVien(nv);
                                      handleOpenPhanCaForm(ca);
                                      setShowCalendarModal(false);
                                      setShowPhanCaModal(true);
                                    }
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-900"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Bạn có chắc muốn xóa phân ca này?')) {
                                      try {
                                        await nhanVienAPI.deleteLichPhanCa(ca.id);
                                        alert('Xóa phân ca thành công');
                                        await loadAllLichPhanCa();
                                        // Reload danh sách của ngày được chọn
                                        if (selectedDate) {
                                          handleDateClick(selectedDate);
                                        }
                                      } catch (error) {
                                        alert('Lỗi: ' + error.message);
                                      }
                                    }
                                  }}
                                  className="text-xs text-red-600 hover:text-red-900"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Chuyển ca */}
      {showChuyenCaModal && caCanChuyen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chuyển ca</h2>
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Ca cần chuyển:</strong>
              </p>
              <p className="text-sm">
                {new Date(caCanChuyen.ngay).toLocaleDateString('vi-VN')} - {getCaLabel(caCanChuyen.ca)}
              </p>
              <p className="text-sm text-gray-600">
                {caCanChuyen.gio_bat_dau} - {caCanChuyen.gio_ket_thuc}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn nhân viên để chuyển ca *
              </label>
              <select
                value={selectedNhanVienMoi}
                onChange={(e) => setSelectedNhanVienMoi(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Chọn nhân viên</option>
                {nhanViens
                  .filter(nv => nv.id !== caCanChuyen.id_tai_khoan)
                  .map((nv) => (
                    <option key={nv.id} value={nv.id}>
                      {nv.ho_ten} - {nv.vai_tro?.replace('_', ' ')}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowChuyenCaModal(false);
                  setCaCanChuyen(null);
                  setSelectedNhanVienMoi('');
                  // Quay lại form sửa
                  setShowPhanCaForm(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleChuyenCa}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Chuyển ca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

