import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { benhNhanAPI, dichVuAPI, benhNhanDichVuAPI, phanKhuAPI, phongNewAPI, phongAPI } from '../../services/api';

export default function BenhNhanPage() {
  const navigate = useNavigate();
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
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
  const [dichVus, setDichVus] = useState([]);
  const [selectedDichVu, setSelectedDichVu] = useState('');
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState('thang');
  const [thanhToanType, setThanhToanType] = useState('chua_thanh_toan'); // 'chua_thanh_toan', 'thanh_toan_truoc', 'thanh_toan_du'
  const [soTienThanhToan, setSoTienThanhToan] = useState('');
  const [phanKhus, setPhanKhus] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [selectedPhong, setSelectedPhong] = useState(null);
  const [currentPhong, setCurrentPhong] = useState(null); // Phòng hiện tại của bệnh nhân khi sửa

  useEffect(() => {
    loadBenhNhans();
    loadDichVus();
  }, [search]);

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
      const params = search ? { search } : {};
      const response = await benhNhanAPI.getAll(params);
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
      alert('Lỗi khi tải danh sách bệnh nhân: ' + error.message);
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
            const dichVuInfo = dichVus.find(dv => dv.id === parseInt(selectedDichVu));
            if (dichVuInfo) {
              let thanhTien = currentDichVu.thanh_tien || 0;
              
              // Nếu thay đổi dịch vụ HOẶC thay đổi hình thức thanh toán, tính lại giá
              const dichVuChanged = parseInt(selectedDichVu) !== currentDichVu.id_dich_vu;
              const hinhThucChanged = hinhThucThanhToan !== currentDichVu.hinh_thuc_thanh_toan;
              
              if (dichVuChanged || hinhThucChanged) {
                // Tính lại giá từ dịch vụ mới (hoặc dịch vụ hiện tại nếu chỉ đổi hình thức)
                if (hinhThucThanhToan === 'thang') {
                  thanhTien = dichVuInfo.gia_thang || 0;
                } else if (hinhThucThanhToan === 'quy') {
                  thanhTien = dichVuInfo.gia_quy || 0;
                } else if (hinhThucThanhToan === 'nam') {
                  thanhTien = dichVuInfo.gia_nam || 0;
                }
              }
              
              let daThanhToan = currentDichVu.da_thanh_toan || 0;
              let congNo = 0;
              
              // Tính lại công nợ dựa trên loại thanh toán
              if (thanhToanType === 'thanh_toan_du') {
                daThanhToan = thanhTien;
                congNo = 0;
              } else if (thanhToanType === 'thanh_toan_truoc') {
                daThanhToan = parseFloat(soTienThanhToan) || currentDichVu.da_thanh_toan || 0;
                congNo = thanhTien - daThanhToan;
              } else {
                // Chưa thanh toán: giữ nguyên đã thanh toán, tính lại công nợ
                congNo = thanhTien - daThanhToan;
              }
              
              // CẬP NHẬT bản ghi hiện tại (KHÔNG tạo mới)
              await benhNhanDichVuAPI.update(currentDichVu.id, {
                id_dich_vu: selectedDichVu,
                hinh_thuc_thanh_toan: hinhThucThanhToan,
                thanh_tien: thanhTien,
                da_thanh_toan: daThanhToan,
                cong_no_con_lai: congNo
                // KHÔNG cập nhật ngay_ket_thuc, KHÔNG cập nhật trang_thai
                // Giữ nguyên ngày bắt đầu, ngày kết thúc (nếu có), trạng thái
              });
            }
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
          // Tính toán thanh toán
          let daThanhToan = 0;
          let congNo = 0;
          
          // Lấy giá từ dichVus state (đã có gia_thang, gia_quy, gia_nam)
          const dichVuInfo = dichVus.find(dv => dv.id === parseInt(selectedDichVu));
          if (dichVuInfo) {
            let thanhTien = 0;
            if (hinhThucThanhToan === 'thang') {
              thanhTien = dichVuInfo.gia_thang || 0;
            } else if (hinhThucThanhToan === 'quy') {
              thanhTien = dichVuInfo.gia_quy || 0;
            } else if (hinhThucThanhToan === 'nam') {
              thanhTien = dichVuInfo.gia_nam || 0;
            }
            
            // Tính toán dựa trên loại thanh toán
            if (thanhToanType === 'thanh_toan_du') {
              daThanhToan = thanhTien;
              congNo = 0;
            } else if (thanhToanType === 'thanh_toan_truoc') {
              daThanhToan = parseFloat(soTienThanhToan) || 0;
              congNo = thanhTien - daThanhToan;
            } else {
              daThanhToan = 0;
              congNo = thanhTien;
            }
            
            await benhNhanDichVuAPI.create({
              id_benh_nhan: benhNhanId,
              id_dich_vu: selectedDichVu,
              ngay_bat_dau: formData.ngay_nhap_vien || new Date().toISOString().split('T')[0],
              hinh_thuc_thanh_toan: hinhThucThanhToan,
              thanh_tien: thanhTien,
              da_thanh_toan: daThanhToan,
              cong_no_con_lai: congNo
            });
          }
        } catch (error) {
          console.error('Error creating dich vu:', error);
          alert('Đã tạo bệnh nhân nhưng có lỗi khi thêm dịch vụ: ' + error.message);
        }
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
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
        
        // Xác định loại thanh toán
        if (dv.cong_no_con_lai === 0 || dv.cong_no_con_lai === null) {
          setThanhToanType('thanh_toan_du');
          setSoTienThanhToan('');
        } else if (dv.da_thanh_toan > 0) {
          setThanhToanType('thanh_toan_truoc');
          setSoTienThanhToan(dv.da_thanh_toan.toString());
        } else {
          setThanhToanType('chua_thanh_toan');
          setSoTienThanhToan('');
        }
      } else {
        setCurrentDichVu(null);
        setSelectedDichVu('');
        setHinhThucThanhToan('thang');
        setThanhToanType('chua_thanh_toan');
        setSoTienThanhToan('');
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
      loadBenhNhans();
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
    setThanhToanType('chua_thanh_toan');
    setSoTienThanhToan('');
    setCurrentDichVu(null);
    setSelectedPhanKhu('');
    setSelectedPhong(null);
    setPhongs([]);
    setCurrentPhong(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin bệnh nhân</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Thêm bệnh nhân
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, CCCD..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tình trạng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {benhNhans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                benhNhans.map((bn) => (
                  <tr key={bn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{bn.ho_ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bn.ngay_sinh ? new Date(bn.ngay_sinh).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{bn.gioi_tinh}</td>
                    <td className="px-6 py-4">
                      {bn.phongs && bn.phongs.length > 0 ? (
                        <div className="space-y-1">
                          {bn.phongs.map((phong, idx) => (
                            <div key={phong.id || idx} className="text-sm">
                              <span className="font-medium text-gray-700">
                                {phong.display || `${phong.khu}-${phong.phong}${phong.giuong ? `-G${phong.giuong}` : ''}`}
                              </span>
                              {phong.ten_phong && phong.ten_phong !== phong.phong && (
                                <span className="text-gray-500 ml-1">({phong.ten_phong})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bn.dich_vu_dang_su_dung ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{bn.dich_vu_dang_su_dung.ten_dich_vu}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'thang' ? 'Tháng' :
                             bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'quy' ? 'Quý' :
                             bn.dich_vu_dang_su_dung.hinh_thuc_thanh_toan === 'nam' ? 'Năm' : ''}
                            {bn.dich_vu_dang_su_dung.cong_no_con_lai > 0 && (
                              <span className="ml-2 text-red-600">
                                (Còn nợ: {new Intl.NumberFormat('vi-VN').format(bn.dich_vu_dang_su_dung.cong_no_con_lai)} đ)
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={bn.tinh_trang_hien_tai || 'Đang điều trị'}
                        onChange={(e) => handleTinhTrangChange(bn.id, e.target.value)}
                        className={`text-sm px-2 py-1 rounded border ${
                          bn.tinh_trang_hien_tai === 'Đã xuất viện' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="Đang điều trị">Đang điều trị</option>
                        <option value="Đã xuất viện">Đã xuất viện</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/admin/benh-nhan/${bn.id}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleEdit(bn)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(bn.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editing ? 'Sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cá nhân */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Thông tin cá nhân</h3>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính *
                    </label>
                    <select
                      value={formData.gioi_tinh}
                      onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin y tế */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Thông tin y tế</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm máu
                    </label>
                    <select
                      value={formData.nhom_mau}
                      onChange={(e) => setFormData({ ...formData, nhom_mau: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn phân khu</option>
                          {phanKhus.map((pk) => (
                            <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                          ))}
                        </select>
                        <select
                          value={selectedPhong || ''}
                          onChange={(e) => setSelectedPhong(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Đang điều trị">Đang điều trị</option>
                      <option value="Đã xuất viện">Đã xuất viện</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dịch vụ */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Dịch vụ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn dịch vụ
                    </label>
                    <select
                      value={selectedDichVu}
                      onChange={(e) => setSelectedDichVu(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Không chọn dịch vụ</option>
                      {dichVus.map((dv) => (
                        <option key={dv.id} value={dv.id}>{dv.ten_dich_vu}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {editing ? 'Sửa dịch vụ hiện tại của bệnh nhân (có thể thay đổi dịch vụ, hình thức thanh toán, tình trạng thanh toán)' : 'Chọn dịch vụ cho bệnh nhân (tùy chọn)'}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="thang">Theo tháng</option>
                        <option value="quy">Theo quý</option>
                        <option value="nam">Theo năm</option>
                      </select>
                      {(() => {
                        const dichVuInfo = dichVus.find(dv => dv.id === parseInt(selectedDichVu));
                        if (dichVuInfo) {
                          let gia = 0;
                          if (hinhThucThanhToan === 'thang') {
                            gia = dichVuInfo.gia_thang || 0;
                          } else if (hinhThucThanhToan === 'quy') {
                            gia = dichVuInfo.gia_quy || 0;
                          } else if (hinhThucThanhToan === 'nam') {
                            gia = dichVuInfo.gia_nam || 0;
                          }
                          if (gia > 0) {
                            return (
                              <p className="text-xs text-green-600 mt-1 font-medium">
                                Giá: {new Intl.NumberFormat('vi-VN').format(gia)} đ
                              </p>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
                
                {/* Checkbox thanh toán */}
                {selectedDichVu && (
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng thanh toán *</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="thanhToanType"
                          value="chua_thanh_toan"
                          checked={thanhToanType === 'chua_thanh_toan'}
                          onChange={(e) => {
                            setThanhToanType(e.target.value);
                            setSoTienThanhToan('');
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">Chưa thanh toán (Công nợ = Thành tiền)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="thanhToanType"
                          value="thanh_toan_truoc"
                          checked={thanhToanType === 'thanh_toan_truoc'}
                          onChange={(e) => setThanhToanType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Thanh toán trước</span>
                      </label>
                      {thanhToanType === 'thanh_toan_truoc' && (
                        <div className="ml-6">
                          <input
                            type="number"
                            min="0"
                            value={soTienThanhToan}
                            onChange={(e) => setSoTienThanhToan(e.target.value)}
                            placeholder="Nhập số tiền đã thanh toán"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Công nợ = Thành tiền - Số tiền đã thanh toán</p>
                        </div>
                      )}
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="thanhToanType"
                          value="thanh_toan_du"
                          checked={thanhToanType === 'thanh_toan_du'}
                          onChange={(e) => {
                            setThanhToanType(e.target.value);
                            setSoTienThanhToan('');
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">Thanh toán đủ (Công nợ = 0)</span>
                      </label>
                    </div>
                  </div>
                )}
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

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editing ? 'Cập nhật' : 'Thêm bệnh nhân'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

