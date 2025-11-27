import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { benhNhanAPI, dichVuAPI, benhNhanDichVuAPI, phanKhuAPI, phongNewAPI, phongAPI } from '../../services/api';

export default function BenhNhanPage() {
  const navigate = useNavigate();
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: 'nam',
    cccd: '',
    dia_chi: '',
    nhom_mau: '',
    bhyt: '',
    phong: '',
    kha_nang_sinh_hoat: 'doc_lap',
    ngay_nhap_vien: new Date().toISOString().split('T')[0],
    tinh_trang_hien_tai: '',
  });
  const [search, setSearch] = useState('');
  // Filter states
  const [filterTinhTrang, setFilterTinhTrang] = useState('');
  const [filterGioiTinh, setFilterGioiTinh] = useState('');
  const [filterPhanKhu, setFilterPhanKhu] = useState('');
  const [filterPhong, setFilterPhong] = useState('');
  const [filterDichVu, setFilterDichVu] = useState('');
  const [filterKhaNangSinhHoat, setFilterKhaNangSinhHoat] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [dichVus, setDichVus] = useState([]);
  const [selectedDichVu, setSelectedDichVu] = useState('');
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState('thang');
  const [phanKhus, setPhanKhus] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [filterPhongs, setFilterPhongs] = useState([]); // Phòng cho filter
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [selectedPhong, setSelectedPhong] = useState(null);
  const [currentPhong, setCurrentPhong] = useState(null); // Phòng hiện tại của bệnh nhân khi sửa

  useEffect(() => {
    loadDichVus();
    loadPhanKhus();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi search hoặc filters thay đổi
  }, [search, filterTinhTrang, filterGioiTinh, filterPhanKhu, filterPhong, filterDichVu, filterKhaNangSinhHoat]);

  useEffect(() => {
    loadBenhNhans();
  }, [search, currentPage, itemsPerPage, filterTinhTrang, filterGioiTinh, filterPhanKhu, filterPhong, filterDichVu, filterKhaNangSinhHoat]);

  useEffect(() => {
    // Load phòng khi chọn phân khu cho filter
    if (filterPhanKhu) {
      loadFilterPhongs(filterPhanKhu);
    } else {
      setFilterPhongs([]);
      setFilterPhong('');
    }
  }, [filterPhanKhu]);

  const loadDichVus = async () => {
    try {
      const response = await dichVuAPI.getAll();
      setDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading dich vus:', error);
    }
  };

  const loadBenhNhans = async () => {
    try {
      setLoading(true);
      // Tính index: trang 1 = index 0, trang 2 = index 8, trang 3 = index 16, ...
      const index = (currentPage - 1) * itemsPerPage;
      
      const params = {
        index: index,
        limit: itemsPerPage,
        ...(search ? { search } : {}),
        ...(filterTinhTrang ? { tinh_trang: filterTinhTrang } : {}),
        ...(filterGioiTinh ? { gioi_tinh: filterGioiTinh } : {}),
        ...(filterPhanKhu ? { id_phan_khu: filterPhanKhu } : {}),
        ...(filterPhong ? { id_phong: filterPhong } : {}),
        ...(filterDichVu ? { id_dich_vu: filterDichVu } : {}),
        ...(filterKhaNangSinhHoat ? { kha_nang_sinh_hoat: filterKhaNangSinhHoat } : {})
      };
      const response = await benhNhanAPI.getAll(params);
      
      // Xử lý response - có thể có pagination info hoặc chỉ có data
      if (response.pagination) {
        // Nếu API trả về pagination info
        setBenhNhans(response.data || []);
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.total || 0);
      } else if (response.total !== undefined || response.totalPages !== undefined) {
        // Nếu pagination info ở root level
        setBenhNhans(response.data || []);
        setTotalPages(response.totalPages || Math.ceil((response.total || 0) / itemsPerPage) || 1);
        setTotalItems(response.total || response.data?.length || 0);
      } else {
        // Nếu không có pagination info, tính toán từ data
        const data = response.data || [];
        setBenhNhans(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error loading benh nhans:', error);
      alert('Lỗi khi tải danh sách bệnh nhân: ' + error.message);
      setBenhNhans([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let benhNhanId;
      if (editing) {
        // Loại bỏ trường phong khỏi formData khi update
        const { phong, ...updateData } = formData;
        await benhNhanAPI.update(editing.id, updateData);
        benhNhanId = editing.id;
        
        // Xử lý cập nhật phòng nếu có chọn phòng mới
        if (selectedPhong && currentPhong) {
          // Nếu đổi phòng (id_phong khác với phòng hiện tại)
          if (selectedPhong !== currentPhong.id_phong) {
            try {
              await phongAPI.update(currentPhong.id, {
                id_phong: selectedPhong
              });
            } catch (error) {
              console.error('Error updating phong:', error);
              alert('Đã cập nhật bệnh nhân nhưng có lỗi khi cập nhật phòng: ' + error.message);
            }
          }
        } else if (selectedPhong && !currentPhong) {
          // Nếu chưa có phòng, tạo phòng mới
          try {
            await phongAPI.create({
              id_benh_nhan: benhNhanId,
              id_phong: selectedPhong,
              ngay_bat_dau_o: new Date().toISOString().split('T')[0],
              ngay_ket_thuc_o: null
            });
          } catch (error) {
            console.error('Error creating phong:', error);
            alert('Đã cập nhật bệnh nhân nhưng có lỗi khi tạo phòng: ' + error.message);
          }
        }
        
        // Nếu có dịch vụ hiện tại, cập nhật dịch vụ (SỬA DỊCH VỤ)
        // Lưu ý: Chỉ cập nhật bản ghi hiện tại, KHÔNG tạo mới, KHÔNG kết thúc dịch vụ
        if (currentDichVu && selectedDichVu) {
          try {
            // CẬP NHẬT bản ghi hiện tại (KHÔNG tạo mới)
            await benhNhanDichVuAPI.update(currentDichVu.id, {
              id_dich_vu: selectedDichVu,
              hinh_thuc_thanh_toan: hinhThucThanhToan
              // KHÔNG cập nhật ngay_ket_thuc, KHÔNG cập nhật trang_thai
              // Giữ nguyên ngày bắt đầu, ngày kết thúc (nếu có), trạng thái
            });
          } catch (error) {
            console.error('Error updating dich vu:', error);
            alert('Đã cập nhật bệnh nhân nhưng có lỗi khi cập nhật dịch vụ: ' + error.message);
          }
        }
        
        alert('Cập nhật bệnh nhân thành công');
      } else {
        // Loại bỏ trường phong khỏi formData khi tạo mới
        const { phong, ...createData } = formData;
        const result = await benhNhanAPI.create(createData);
        benhNhanId = result.data?.id;
        alert('Thêm bệnh nhân thành công');
      }

      // Nếu có chọn dịch vụ, tạo dịch vụ cho bệnh nhân
      // CHỈ tạo mới khi: (1) Tạo bệnh nhân mới, HOẶC (2) Sửa bệnh nhân nhưng KHÔNG có dịch vụ hiện tại
      if (selectedDichVu && benhNhanId && (!editing || !currentDichVu)) {
        try {
          await benhNhanDichVuAPI.create({
            id_benh_nhan: benhNhanId,
            id_dich_vu: selectedDichVu,
            ngay_bat_dau: formData.ngay_nhap_vien || new Date().toISOString().split('T')[0],
            hinh_thuc_thanh_toan: hinhThucThanhToan
          });
        } catch (error) {
          console.error('Error creating dich vu:', error);
          alert('Đã tạo bệnh nhân nhưng có lỗi khi thêm dịch vụ: ' + error.message);
        }
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      // Reload trang hiện tại sau khi thêm/sửa
      loadBenhNhans();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const [currentDichVu, setCurrentDichVu] = useState(null);

  const loadPhanKhus = async () => {
    try {
      const response = await phanKhuAPI.getAll();
      setPhanKhus(response.data || []);
    } catch (error) {
      console.error('Error loading phan khus:', error);
    }
  };

  const loadPhongs = async (idPhanKhu) => {
    try {
      if (idPhanKhu) {
        const response = await phongNewAPI.getAll({ id_phan_khu: idPhanKhu });
        setPhongs(response.data || []);
      } else {
        setPhongs([]);
      }
    } catch (error) {
      console.error('Error loading phongs:', error);
      setPhongs([]);
    }
  };

  const loadFilterPhongs = async (idPhanKhu) => {
    try {
      if (idPhanKhu) {
        const response = await phongNewAPI.getAll({ id_phan_khu: idPhanKhu });
        setFilterPhongs(response.data || []);
      } else {
        setFilterPhongs([]);
      }
    } catch (error) {
      console.error('Error loading filter phongs:', error);
      setFilterPhongs([]);
    }
  };

  const handleClearFilters = () => {
    setFilterTinhTrang('');
    setFilterGioiTinh('');
    setFilterPhanKhu('');
    setFilterPhong('');
    setFilterDichVu('');
    setFilterKhaNangSinhHoat('');
    setFilterPhongs([]);
  };

  const hasActiveFilters = filterTinhTrang || filterGioiTinh || filterPhanKhu || filterPhong || filterDichVu || filterKhaNangSinhHoat;

  const handleEdit = async (benhNhan) => {
    setEditing(benhNhan);
    setFormData({
      ho_ten: benhNhan.ho_ten || '',
      ngay_sinh: benhNhan.ngay_sinh ? benhNhan.ngay_sinh.split('T')[0] : '',
      gioi_tinh: benhNhan.gioi_tinh || 'nam',
      cccd: benhNhan.cccd || '',
      dia_chi: benhNhan.dia_chi || '',
      nhom_mau: benhNhan.nhom_mau || '',
      bhyt: benhNhan.bhyt || '',
      phong: '', // Không dùng nữa
      kha_nang_sinh_hoat: benhNhan.kha_nang_sinh_hoat || 'doc_lap',
      ngay_nhap_vien: benhNhan.ngay_nhap_vien ? benhNhan.ngay_nhap_vien.split('T')[0] : new Date().toISOString().split('T')[0],
      tinh_trang_hien_tai: benhNhan.tinh_trang_hien_tai || 'Đang điều trị',
    });
    
    // Load phòng hiện tại của bệnh nhân
    try {
      const phongResponse = await phongAPI.getByBenhNhan(benhNhan.id);
      if (phongResponse.data && phongResponse.data.id_phong) {
        setCurrentPhong(phongResponse.data);
        // Load phân khu và phòng để hiển thị dropdown
        await loadPhanKhus();
        // Tìm phân khu từ phòng
        const phongDetailResponse = await phongNewAPI.getById(phongResponse.data.id_phong);
        if (phongDetailResponse.data && phongDetailResponse.data.id_phan_khu) {
          setSelectedPhanKhu(phongDetailResponse.data.id_phan_khu);
          await loadPhongs(phongDetailResponse.data.id_phan_khu);
          setSelectedPhong(phongResponse.data.id_phong);
        }
      } else {
        setCurrentPhong(null);
        setSelectedPhanKhu('');
        setSelectedPhong(null);
        setPhongs([]);
        await loadPhanKhus();
      }
    } catch (error) {
      console.error('Error loading phong:', error);
      setCurrentPhong(null);
      await loadPhanKhus();
    }
    
    // Load dịch vụ hiện tại của bệnh nhân
    try {
      const response = await benhNhanDichVuAPI.getAll({ id_benh_nhan: benhNhan.id, trang_thai: 'dang_su_dung' });
      if (response.data && response.data.length > 0) {
        const dv = response.data[0]; // Lấy dịch vụ đang sử dụng đầu tiên
        setCurrentDichVu(dv);
        setSelectedDichVu(dv.id_dich_vu);
        setHinhThucThanhToan(dv.hinh_thuc_thanh_toan || 'thang');
      } else {
        setCurrentDichVu(null);
        setSelectedDichVu('');
        setHinhThucThanhToan('thang');
      }
    } catch (error) {
      console.error('Error loading dich vu:', error);
      setCurrentDichVu(null);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bệnh nhân này?')) return;
    try {
      await benhNhanAPI.delete(id);
      alert('Xóa bệnh nhân thành công');
      
      // Tính toán lại pagination sau khi xóa
      const remainingItems = totalItems - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage) || 1;
      
      // Nếu trang hiện tại trống sau khi xóa, quay về trang trước
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
        // loadBenhNhans sẽ được gọi tự động qua useEffect khi currentPage thay đổi
      } else {
        // Reload trang hiện tại
        loadBenhNhans();
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleTinhTrangChange = async (id, newTinhTrang) => {
    try {
      await benhNhanAPI.update(id, { tinh_trang_hien_tai: newTinhTrang });
      alert('Cập nhật tình trạng thành công');
      loadBenhNhans();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ho_ten: '',
      ngay_sinh: '',
      gioi_tinh: 'nam',
      cccd: '',
      dia_chi: '',
      nhom_mau: '',
      bhyt: '',
      phong: '',
      kha_nang_sinh_hoat: 'doc_lap',
      ngay_nhap_vien: new Date().toISOString().split('T')[0],
      tinh_trang_hien_tai: 'Đang điều trị',
    });
    setSelectedDichVu('');
    setHinhThucThanhToan('thang');
    setCurrentDichVu(null);
      setSelectedPhanKhu('');
      setSelectedPhong(null);
      setPhongs([]);
      setCurrentPhong(null);
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
      // Hiển thị logic: [1] ... [current-1] [current] [current+1] ... [total]
      if (currentPage <= 3) {
        // Gần đầu: [1] [2] [3] [4] ... [total]
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Gần cuối: [1] ... [total-3] [total-2] [total-1] [total]
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa: [1] ... [current-1] [current] [current+1] ... [total]
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
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
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Bệnh nhân</h1>
          <p className="text-gray-600 mt-2">Danh sách và thông tin bệnh nhân</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4A90E2]/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span className="truncate">Thêm bệnh nhân</span>
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
                placeholder="Tìm kiếm theo tên, CCCD..."
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
                  {[filterTinhTrang, filterGioiTinh, filterPhanKhu, filterPhong, filterDichVu, filterKhaNangSinhHoat].filter(Boolean).length}
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
              {/* Filter: Tình trạng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tình trạng
                </label>
                <select
                  value={filterTinhTrang}
                  onChange={(e) => setFilterTinhTrang(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="Đang điều trị">Đang điều trị</option>
                  <option value="Đã xuất viện">Đã xuất viện</option>
                </select>
              </div>

              {/* Filter: Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  value={filterGioiTinh}
                  onChange={(e) => setFilterGioiTinh(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              {/* Filter: Khả năng sinh hoạt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khả năng sinh hoạt
                </label>
                <select
                  value={filterKhaNangSinhHoat}
                  onChange={(e) => setFilterKhaNangSinhHoat(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="doc_lap">Độc lập</option>
                  <option value="ho_tro">Cần hỗ trợ</option>
                  <option value="phu_thuoc">Phụ thuộc hoàn toàn</option>
                </select>
              </div>

              {/* Filter: Phân khu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phân khu
                </label>
                <select
                  value={filterPhanKhu}
                  onChange={(e) => {
                    setFilterPhanKhu(e.target.value);
                    setFilterPhong(''); // Reset phòng khi đổi phân khu
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  {phanKhus.map((pk) => (
                    <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Phòng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng
                </label>
                <select
                  value={filterPhong}
                  onChange={(e) => setFilterPhong(e.target.value)}
                  disabled={!filterPhanKhu}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Tất cả</option>
                  {filterPhongs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ten_phong} {p.so_phong ? `(${p.so_phong})` : ''}
                    </option>
                  ))}
                </select>
                {!filterPhanKhu && (
                  <p className="text-xs text-gray-500 mt-1">Vui lòng chọn phân khu trước</p>
                )}
              </div>

              {/* Filter: Dịch vụ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dịch vụ
                </label>
                <select
                  value={filterDichVu}
                  onChange={(e) => setFilterDichVu(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  {dichVus.map((dv) => (
                    <option key={dv.id} value={dv.id}>{dv.ten_dich_vu}</option>
                  ))}
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
        ) : benhNhans.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_off</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có bệnh nhân nào</p>
            <p className="text-gray-400 text-sm">Bấm "Thêm bệnh nhân" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giới tính</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phòng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dịch vụ</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tình trạng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {benhNhans.map((bn) => (
                  <tr key={bn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {bn.ho_ten?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{bn.ho_ten}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                      {bn.ngay_sinh ? new Date(bn.ngay_sinh).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                        {bn.gioi_tinh}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {bn.phongs && bn.phongs.length > 0 ? (
                        <div className="space-y-1">
                          {bn.phongs.map((phong, idx) => (
                            <div key={phong.id || idx} className="text-sm">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#4A90E2] rounded-lg font-medium">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                                {phong.display || `${phong.khu}-${phong.phong}${phong.giuong ? `-G${phong.giuong}` : ''}`}
                              </span>
                              {phong.ten_phong && phong.ten_phong !== phong.phong && (
                                <span className="text-gray-500 ml-1 text-xs">({phong.ten_phong})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {bn.dich_vu_dang_su_dung ? (
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">{bn.dich_vu_dang_su_dung.ten_dich_vu}</div>
                          <div className="text-xs text-gray-500 capitalize mt-1">
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              {bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'thang' ? 'Tháng' :
                               bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'quy' ? 'Quý' :
                               bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'nam' ? 'Năm' : ''}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <select
                        value={bn.tinh_trang_hien_tai || 'Đang điều trị'}
                        onChange={(e) => handleTinhTrangChange(bn.id, e.target.value)}
                        className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          bn.tinh_trang_hien_tai === 'Đã xuất viện' 
                            ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'
                        }`}
                      >
                        <option value="Đang điều trị">Đang điều trị</option>
                        <option value="Đã xuất viện">Đã xuất viện</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/benh-nhan/${bn.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                          <span>Chi tiết</span>
                        </button>
                        <button
                          onClick={() => handleEdit(bn)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(bn.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                          title="Xóa"
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

      {/* Pagination */}
      {!loading && benhNhans.length > 0 && (
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
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">
                / {totalItems} bệnh nhân
              </span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
              Trang <span className="font-semibold text-gray-800">{currentPage}</span> / <span className="font-semibold text-gray-800">{totalPages}</span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#4A90E2] hover:text-[#4A90E2]'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                <span className="hidden sm:inline">Trước</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-[#4A90E2] text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#4A90E2] hover:text-[#4A90E2]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#4A90E2] hover:text-[#4A90E2]'
                }`}
              >
                <span className="hidden sm:inline">Sau</span>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
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
              {/* Thông tin cá nhân */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin cá nhân</h3>
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.ngay_sinh}
                      onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính *
                    </label>
                    <select
                      value={formData.gioi_tinh}
                      onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    >
                      <option value="nam">Nam</option>
                      <option value="nu">Nữ</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CCCD/CMND
                    </label>
                    <input
                      type="text"
                      value={formData.cccd}
                      onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      placeholder="Nhập số CCCD/CMND"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <textarea
                      value={formData.dia_chi}
                      onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      rows="2"
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin y tế */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin y tế</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm máu
                    </label>
                    <select
                      value={formData.nhom_mau}
                      onChange={(e) => setFormData({ ...formData, nhom_mau: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    >
                      <option value="">Chọn nhóm máu</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số BHYT
                    </label>
                    <input
                      type="text"
                      value={formData.bhyt}
                      onChange={(e) => setFormData({ ...formData, bhyt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      placeholder="Nhập số thẻ BHYT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày nhập viện *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.ngay_nhap_vien}
                      onChange={(e) => setFormData({ ...formData, ngay_nhap_vien: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    />
                  </div>
                  {/* Chỉ hiển thị khi sửa bệnh nhân */}
                  {editing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phòng
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedPhanKhu}
                          onChange={(e) => {
                            setSelectedPhanKhu(e.target.value);
                            setSelectedPhong(null);
                            loadPhongs(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                        >
                          <option value="">Chọn phân khu</option>
                          {phanKhus.map((pk) => (
                            <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                          ))}
                        </select>
                        <select
                          value={selectedPhong || ''}
                          onChange={(e) => setSelectedPhong(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                          disabled={!selectedPhanKhu}
                        >
                          <option value="">Chọn phòng</option>
                          {phongs.map((p) => {
                            const currentCount = p.benh_nhans?.length || 0;
                            const maxCapacity = p.so_nguoi_toi_da || 1;
                            const availableSlots = maxCapacity - currentCount;
                            return (
                              <option key={p.id} value={p.id}>
                                {p.ten_phong} {p.so_phong ? `(${p.so_phong})` : ''} - Còn {availableSlots}/{maxCapacity} chỗ
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {currentPhong && (
                        <p className="text-xs text-gray-500 mt-1">
                          Phòng hiện tại: {currentPhong.khu}-{currentPhong.phong}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khả năng sinh hoạt *
                    </label>
                    <select
                      value={formData.kha_nang_sinh_hoat}
                      onChange={(e) => setFormData({ ...formData, kha_nang_sinh_hoat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    >
                      <option value="doc_lap">Độc lập</option>
                      <option value="ho_tro">Cần hỗ trợ</option>
                      <option value="phu_thuoc">Phụ thuộc hoàn toàn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tình trạng *
                    </label>
                    <select
                      value={formData.tinh_trang_hien_tai}
                      onChange={(e) => setFormData({ ...formData, tinh_trang_hien_tai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      required
                    >
                      <option value="Đang điều trị">Đang điều trị</option>
                      <option value="Đã xuất viện">Đã xuất viện</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dịch vụ */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Dịch vụ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn dịch vụ
                    </label>
                    <select
                      value={selectedDichVu}
                      onChange={(e) => setSelectedDichVu(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    >
                      <option value="">Không chọn dịch vụ</option>
                      {dichVus.map((dv) => (
                        <option key={dv.id} value={dv.id}>{dv.ten_dich_vu}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {editing ? 'Sửa dịch vụ hiện tại của bệnh nhân (có thể thay đổi dịch vụ, hình thức thanh toán)' : 'Chọn dịch vụ cho bệnh nhân (tùy chọn)'}
                    </p>
                  </div>
                  {selectedDichVu && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình thức thanh toán *
                      </label>
                      <select
                        required
                        value={hinhThucThanhToan}
                        onChange={(e) => setHinhThucThanhToan(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      >
                        <option value="thang">Theo tháng</option>
                        <option value="quy">Theo quý</option>
                        <option value="nam">Theo năm</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú tình trạng
                </label>
                <textarea
                  value={formData.ghi_chu_tinh_trang || ''}
                  onChange={(e) => setFormData({ ...formData, ghi_chu_tinh_trang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Mô tả tình trạng sức khỏe, bệnh lý hiện tại..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 text-gray-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 transition-colors"
                >
                  <span className="truncate">Hủy</span>
                </button>
                <button
                  type="submit"
                  className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4A90E2]/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{editing ? 'save' : 'add'}</span>
                  <span className="truncate">{editing ? 'Cập nhật' : 'Thêm bệnh nhân'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

