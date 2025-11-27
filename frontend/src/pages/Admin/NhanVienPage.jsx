import { useEffect, useState } from 'react';
import { nhanVienAPI } from '../../services/api';

export default function NhanVienPage() {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showPhanCaModal, setShowPhanCaModal] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [lichPhanCa, setLichPhanCa] = useState([]);
  const [showPhanCaForm, setShowPhanCaForm] = useState(false);
  const [editingPhanCa, setEditingPhanCa] = useState(null);
  const [phanCaForm, setPhanCaForm] = useState({
    id_tai_khoan: '',
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
  // Filter states for phan ca modal
  const [filterPhanCaNgay, setFilterPhanCaNgay] = useState('');
  const [filterPhanCaCa, setFilterPhanCaCa] = useState('');
  const [filterPhanCaTrangThai, setFilterPhanCaTrangThai] = useState('');
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
  // Filter states
  const [search, setSearch] = useState('');
  const [filterVaiTro, setFilterVaiTro] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi search hoặc filters thay đổi
  }, [search, filterVaiTro]);

  useEffect(() => {
    loadNhanViens();
  }, [currentPage, itemsPerPage, search, filterVaiTro]);

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
      // Tính index từ currentPage: index = (currentPage - 1) * itemsPerPage
      const index = (currentPage - 1) * itemsPerPage;
      const params = {
        index: index,
        limit: itemsPerPage,
        ...(search ? { search } : {}),
        ...(filterVaiTro ? { vai_tro: filterVaiTro } : {})
      };
      const response = await nhanVienAPI.getAll(params);
      
      // Xử lý response với pagination info
      if (response.pagination) {
        setNhanViens(response.data || []);
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.total || 0);
      } else {
        // Fallback nếu API không trả về pagination
        setNhanViens(response.data || []);
        setTotalPages(1);
        setTotalItems(response.data?.length || 0);
      }
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
      // Reload trang hiện tại sau khi thêm/sửa
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
        id_tai_khoan: ca.id_tai_khoan || '',
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
        id_tai_khoan: selectedNhanVien?.id || '',
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
        // Nếu không có selectedNhanVien (tạo từ calendar view), cần id_tai_khoan từ form
        const idTaiKhoan = selectedNhanVien?.id || phanCaForm.id_tai_khoan;
        if (!idTaiKhoan) {
          alert('Vui lòng chọn nhân viên');
          return;
        }
        await nhanVienAPI.createLichPhanCa({
          id_tai_khoan: idTaiKhoan,
          ...phanCaForm
        });
        alert('Tạo phân ca thành công');
      }
      setShowPhanCaForm(false);
      setEditingPhanCa(null);
      if (selectedNhanVien) {
        await loadLichPhanCa(selectedNhanVien.id);
      }
      // Reload calendar nếu đang mở
      if (showCalendarModal) {
        await loadAllLichPhanCa();
        if (selectedDate) {
          handleDateClick(selectedDate);
        }
      }
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

  // Filter lich phan ca
  const getFilteredLichPhanCa = () => {
    let filtered = [...lichPhanCa];

    if (filterPhanCaNgay) {
      const filterDate = new Date(filterPhanCaNgay).toISOString().split('T')[0];
      filtered = filtered.filter(ca => {
        const caDate = new Date(ca.ngay).toISOString().split('T')[0];
        return caDate === filterDate;
      });
    }

    if (filterPhanCaCa) {
      filtered = filtered.filter(ca => ca.ca === filterPhanCaCa);
    }

    if (filterPhanCaTrangThai) {
      filtered = filtered.filter(ca => ca.trang_thai === filterPhanCaTrangThai);
    }

    return filtered;
  };

  const handleClearPhanCaFilters = () => {
    setFilterPhanCaNgay('');
    setFilterPhanCaCa('');
    setFilterPhanCaTrangThai('');
  };

  const hasActivePhanCaFilters = filterPhanCaNgay || filterPhanCaCa || filterPhanCaTrangThai;

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

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top khi đổi trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi số items per page
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterVaiTro('');
  };

  const hasActiveFilters = search || filterVaiTro;

  // Tính toán số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang > 5, hiển thị một phần
      if (currentPage <= 3) {
        // Ở đầu danh sách: 1, 2, 3, 4, ... last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Ở cuối danh sách: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa danh sách: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Nhân viên</h1>
          <p className="text-gray-600 mt-2">Danh sách và thông tin nhân viên</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const today = new Date();
              setShowCalendarModal(true);
              setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(today);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calendar_month</span>
            <span>Xem lịch phân ca</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditing(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
            <span>Thêm nhân viên</span>
          </button>
        </div>
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
                placeholder="Tìm kiếm theo tên, số điện thoại, email..."
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
                  {[search, filterVaiTro].filter(Boolean).length}
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
              {/* Filter: Vai trò */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={filterVaiTro}
                  onChange={(e) => setFilterVaiTro(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="dieu_duong">Điều dưỡng</option>
                  <option value="dieu_duong_truong">Điều dưỡng trưởng</option>
                  <option value="quan_ly_y_te">Quản lý Y tế</option>
                  <option value="quan_ly_nhan_su">Quản lý Nhân sự</option>
                </select>
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
        ) : nhanViens.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_off</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có nhân viên nào</p>
            <p className="text-gray-400 text-sm">Bấm "Thêm nhân viên" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chức vụ</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nhanViens.map((nv) => (
                  <tr key={nv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {nv.ho_ten?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{nv.ho_ten}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.so_dien_thoai}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.email}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#4A90E2]/20 text-[#4A90E2] capitalize">
                        {nv.vai_tro?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.chuc_vu || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(nv)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleOpenPhanCa(nv)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                          <span>Phân ca</span>
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

      {/* Pagination */}
      {!loading && nhanViens.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">
                / Tổng: {totalItems} nhân viên
              </span>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                    page === '...'
                      ? 'bg-transparent text-gray-400 cursor-default'
                      : page === currentPage
                      ? 'bg-[#4A90E2] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
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
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                {!editing && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      required={!editing}
                      value={formData.mat_khau}
                      onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <select
                    value={formData.vai_tro}
                    onChange={(e) => setFormData({ ...formData, vai_tro: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="dieu_duong">Điều dưỡng</option>
                    <option value="dieu_duong_truong">Điều dưỡng trưởng</option>
                    <option value="quan_ly_y_te">Quản lý Y tế</option>
                    <option value="quan_ly_nhan_su">Quản lý Nhân sự</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    value={formData.chuc_vu}
                    onChange={(e) => setFormData({ ...formData, chuc_vu: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bằng cấp
                  </label>
                  <input
                    type="text"
                    value={formData.bang_cap}
                    onChange={(e) => setFormData({ ...formData, bang_cap: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lương cơ bản
                  </label>
                  <input
                    type="number"
                    value={formData.luong_co_ban}
                    onChange={(e) => setFormData({ ...formData, luong_co_ban: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
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
                  <span>{editing ? 'Cập nhật' : 'Thêm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Phân ca */}
      {showPhanCaModal && selectedNhanVien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  Lịch phân ca
                </h2>
                <p className="text-gray-600 mt-1">{selectedNhanVien.ho_ten}</p>
              </div>
              <button
                onClick={() => {
                  setShowPhanCaModal(false);
                  setSelectedNhanVien(null);
                  setLichPhanCa([]);
                  handleClearPhanCaFilters();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleOpenPhanCaForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm phân ca</span>
                </button>
              </div>

              {/* Filters for phan ca */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Bộ lọc</h3>
                  {hasActivePhanCaFilters && (
                    <button
                      onClick={handleClearPhanCaFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                      <span>Xóa bộ lọc</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Filter: Ngày */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ngày
                    </label>
                    <input
                      type="date"
                      value={filterPhanCaNgay}
                      onChange={(e) => setFilterPhanCaNgay(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    />
                  </div>

                  {/* Filter: Ca */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ca
                    </label>
                    <select
                      value={filterPhanCaCa}
                      onChange={(e) => setFilterPhanCaCa(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="sang">Ca sáng</option>
                      <option value="chieu">Ca chiều</option>
                      <option value="dem">Ca đêm</option>
                    </select>
                  </div>

                  {/* Filter: Trạng thái */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={filterPhanCaTrangThai}
                      onChange={(e) => setFilterPhanCaTrangThai(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="du_kien">Dự kiến</option>
                      <option value="dang_truc">Đang trực</option>
                      <option value="hoan_thanh">Hoàn thành</option>
                      <option value="vang">Vắng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {lichPhanCa.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                <p className="text-gray-500 text-lg mb-2">Chưa có lịch phân ca</p>
                <p className="text-gray-400 text-sm">Bấm "Thêm phân ca" để bắt đầu</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ca</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giờ bắt đầu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giờ kết thúc</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredLichPhanCa().length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search_off</span>
                            <p className="text-gray-500 text-sm">Không tìm thấy ca nào phù hợp với bộ lọc</p>
                          </td>
                        </tr>
                      ) : (
                        getFilteredLichPhanCa().map((ca) => (
                        <tr key={ca.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {new Date(ca.ngay).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{getCaLabel(ca.ca)}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{ca.gio_bat_dau}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{ca.gio_ket_thuc}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                              {getTrangThaiLabel(ca.trang_thai)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenPhanCaForm(ca)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeletePhanCa(ca.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Form phân ca */}
      {showPhanCaForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">
                {editingPhanCa ? 'Sửa phân ca' : 'Thêm phân ca mới'}
              </h2>
              <button
                onClick={() => {
                  setShowPhanCaForm(false);
                  setEditingPhanCa(null);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handlePhanCaSubmit} className="space-y-5">
              {/* Chọn nhân viên - chỉ hiển thị khi không có selectedNhanVien (tạo từ calendar view) */}
              {!selectedNhanVien && !editingPhanCa && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nhân viên *</label>
                  <select
                    required
                    value={phanCaForm.id_tai_khoan || ''}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, id_tai_khoan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="">Chọn nhân viên</option>
                    {nhanViens.map((nv) => (
                      <option key={nv.id} value={nv.id}>
                        {nv.ho_ten} - {nv.vai_tro?.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày *</label>
                <input
                  type="date"
                  required
                  value={phanCaForm.ngay}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, ngay: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ca *</label>
                <select
                  required
                  value={phanCaForm.ca}
                  onChange={(e) => handleCaChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="sang">Ca sáng (06:00 - 14:00)</option>
                  <option value="chieu">Ca chiều (14:00 - 22:00)</option>
                  <option value="dem">Ca đêm (22:00 - 06:00)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_bat_dau}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_bat_dau: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giờ kết thúc *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_ket_thuc}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_ket_thuc: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={phanCaForm.trang_thai}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, trang_thai: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="du_kien">Dự kiến</option>
                  <option value="dang_truc">Đang trực</option>
                  <option value="hoan_thanh">Hoàn thành</option>
                  <option value="vang">Vắng</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanCaForm(false);
                    setEditingPhanCa(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{editingPhanCa ? 'save' : 'add'}</span>
                  <span>{editingPhanCa ? 'Cập nhật' : 'Thêm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calendar View */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Lịch phân ca</h2>
              <button
                onClick={() => {
                  setShowCalendarModal(false);
                  setSelectedDate(null);
                  setPhanCaByDate([]);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={previousMonth}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                    <span>Tháng trước</span>
                  </button>
                  <h3 className="text-xl font-bold text-gray-800 capitalize">
                    {formatMonthYear(currentMonth)}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <span>Tháng sau</span>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-3 bg-gray-50 rounded-lg p-2">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
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
                        className={`aspect-square border-2 rounded-lg p-2 text-sm hover:shadow-md transition-all ${
                          isSelected ? 'bg-[#4A90E2] border-[#4A90E2] text-white' : 
                          isToday ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' :
                          hasCa ? 'bg-green-50 border-green-300 hover:bg-green-100' :
                          'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center h-full justify-between">
                          <span className={`font-semibold ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {date.getDate()}
                          </span>
                          {hasCa && (
                            <span className={`text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold ${
                              isSelected ? 'bg-white text-[#4A90E2]' : 'bg-green-500 text-white'
                            }`}>
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
              <div className="col-span-1 border-l border-gray-200 pl-6">
                {selectedDate && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {selectedDate.toLocaleDateString('vi-VN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                    </div>
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const defaultCa = 'sang';
                          const defaultTime = getCaTime(defaultCa);
                          const selectedDateStr = formatDateForComparison(selectedDate);
                          setPhanCaForm({
                            ca: defaultCa,
                            ngay: selectedDateStr,
                            gio_bat_dau: defaultTime.gio_bat_dau,
                            gio_ket_thuc: defaultTime.gio_ket_thuc,
                            trang_thai: 'du_kien'
                          });
                          setEditingPhanCa(null);
                          setSelectedNhanVien(null); // Không cần chọn nhân viên cụ thể trong calendar view
                          setShowCalendarModal(false);
                          setShowPhanCaForm(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                        <span>Tạo lịch phân ca</span>
                      </button>
                    </div>
                    {phanCaByDate.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>event_busy</span>
                        <p className="text-gray-500 text-sm">Không có phân ca trong ngày này</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {phanCaByDate.map((ca) => (
                          <div
                            key={ca.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {ca.ho_ten?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm text-gray-900">{ca.ho_ten}</div>
                                <div className="text-xs text-gray-600 mt-0.5">
                                  {getCaLabel(ca.ca)}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                              <span>{ca.gio_bat_dau} - {ca.gio_ket_thuc}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                                {getTrangThaiLabel(ca.trang_thai)}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const nv = nhanViens.find(n => n.id === ca.id_tai_khoan);
                                    if (nv) {
                                      setSelectedNhanVien(nv);
                                      handleOpenPhanCaForm(ca);
                                      setShowCalendarModal(false);
                                      setShowPhanCaModal(true);
                                    }
                                  }}
                                  className="flex items-center justify-center w-7 h-7 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors"
                                  title="Sửa"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Bạn có chắc muốn xóa phân ca này?')) {
                                      try {
                                        await nhanVienAPI.deleteLichPhanCa(ca.id);
                                        alert('Xóa phân ca thành công');
                                        await loadAllLichPhanCa();
                                        if (selectedDate) {
                                          handleDateClick(selectedDate);
                                        }
                                      } catch (error) {
                                        alert('Lỗi: ' + error.message);
                                      }
                                    }
                                  }}
                                  className="flex items-center justify-center w-7 h-7 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Xóa"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">Chuyển ca</h2>
              <button
                onClick={() => {
                  setShowChuyenCaModal(false);
                  setCaCanChuyen(null);
                  setSelectedNhanVienMoi('');
                  setShowPhanCaForm(true);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Ca cần chuyển:
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {new Date(caCanChuyen.ngay).toLocaleDateString('vi-VN')} - {getCaLabel(caCanChuyen.ca)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {caCanChuyen.gio_bat_dau} - {caCanChuyen.gio_ket_thuc}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chọn nhân viên để chuyển ca *
              </label>
              <select
                value={selectedNhanVienMoi}
                onChange={(e) => setSelectedNhanVienMoi(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
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
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowChuyenCaModal(false);
                  setCaCanChuyen(null);
                  setSelectedNhanVienMoi('');
                  setShowPhanCaForm(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleChuyenCa}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                <span>Chuyển ca</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

