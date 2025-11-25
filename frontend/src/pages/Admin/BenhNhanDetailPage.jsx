import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  benhNhanAPI, thuocAPI, dinhDuongAPI, congViecAPI, 
  phongAPI, phanKhuAPI, phongNewAPI, nguoiThanAPI, doDungAPI, nhanVienAPI,
  benhNhanDichVuAPI, dichVuAPI
} from '../../services/api';

export default function BenhNhanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [benhNhan, setBenhNhan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('thong-tin');
  const [chiSoSinhTon, setChiSoSinhTon] = useState([]);
  const [donThuocs, setDonThuocs] = useState([]);
  const [thucDons, setThucDons] = useState([]);
  const [congViecs, setCongViecs] = useState([]);
  const [phong, setPhong] = useState(null);
  const [nguoiThans, setNguoiThans] = useState([]);
  const [doDungs, setDoDungs] = useState([]);
  const [nhanViens, setNhanViens] = useState([]);
  const [phanKhus, setPhanKhus] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [selectedPhong, setSelectedPhong] = useState(null);
  const [dichVus, setDichVus] = useState([]);
  const [benhNhanDichVus, setBenhNhanDichVus] = useState([]);
  const [allDichVus, setAllDichVus] = useState([]);
  
  // Modal states
  const [showChiSoModal, setShowChiSoModal] = useState(false);
  const [showThuocModal, setShowThuocModal] = useState(false);
  const [showThucDonModal, setShowThucDonModal] = useState(false);
  const [showCongViecModal, setShowCongViecModal] = useState(false);
  const [showNguoiThanModal, setShowNguoiThanModal] = useState(false);
  const [showDoDungModal, setShowDoDungModal] = useState(false);
  const [showPhongModal, setShowPhongModal] = useState(false);
  const [showDichVuModal, setShowDichVuModal] = useState(false);
  
  // Form data states
  const [chiSoForm, setChiSoForm] = useState({
    huyet_ap_tam_thu: '',
    huyet_ap_tam_truong: '',
    nhip_tim: '',
    spo2: '',
    nhiet_do: '',
    nhip_tho: '',
    ghi_chu: '',
  });
  const [thuocForm, setThuocForm] = useState({
    mo_ta: '',
    ngay_ke: new Date().toISOString().split('T')[0],
    thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
  });
  const [thucDonForm, setThucDonForm] = useState({
    ngay: new Date().toISOString().split('T')[0],
    bua_sang: '',
    bua_trua: '',
    bua_toi: '',
    tong_calo: '',
  });
  const [congViecForm, setCongViecForm] = useState({
    ten_cong_viec: '',
    mo_ta: '',
    muc_uu_tien: 'trung_binh',
    thoi_gian_du_kien: '',
    id_dieu_duong: '',
  });
  const [nguoiThanForm, setNguoiThanForm] = useState({
    ho_ten: '',
    moi_quan_he: '',
    so_dien_thoai: '',
    email: '',
    la_nguoi_lien_he_chinh: false,
  });
  const [doDungForm, setDoDungForm] = useState({
    ten_vat_dung: '',
    so_luong: 1,
    tinh_trang: 'tot',
    ghi_chu: '',
  });
  const [phongForm, setPhongForm] = useState({
    id_phan_khu: '',
    id_phong: '',
    khu: '',
    phong: '',
    giuong: '',
  });
  
  const [editingChiSo, setEditingChiSo] = useState(null);
  const [editingThuoc, setEditingThuoc] = useState(null);
  const [editingThucDon, setEditingThucDon] = useState(null);
  const [editingNguoiThan, setEditingNguoiThan] = useState(null);
  const [editingDoDung, setEditingDoDung] = useState(null);
  const [editingDichVu, setEditingDichVu] = useState(null);
  const [dichVuForm, setDichVuForm] = useState({
    id_dich_vu: '',
    ngay_bat_dau: new Date().toISOString().split('T')[0],
    ngay_ket_thuc: '',
    hinh_thuc_thanh_toan: 'thang',
    thanh_tien: '',
    da_thanh_toan: '',
    trang_thai: 'dang_su_dung'
  });
  const [thanhToanType, setThanhToanType] = useState('chua_thanh_toan');
  const [soTienThanhToan, setSoTienThanhToan] = useState('');
  const [isDoiDichVu, setIsDoiDichVu] = useState(false);
  const [dichVuCuId, setDichVuCuId] = useState(null);

  useEffect(() => {
    if (id) {
      loadBenhNhanDetail();
      loadChiSoSinhTon();
      loadDonThuocs();
      loadThucDons();
      loadCongViecs();
      loadPhong();
      loadNguoiThans();
      loadDoDungs();
      loadNhanViens();
      loadBenhNhanDichVus();
      loadAllDichVus();
    }
  }, [id]);

  const loadBenhNhanDetail = async () => {
    try {
      const response = await benhNhanAPI.getById(id);
      setBenhNhan(response.data);
    } catch (error) {
      console.error('Error loading benh nhan:', error);
      alert('Lỗi khi tải thông tin bệnh nhân: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadChiSoSinhTon = async () => {
    try {
      const response = await benhNhanAPI.getChiSoSinhTon(id, { limit: 30 });
      setChiSoSinhTon(response.data || []);
    } catch (error) {
      console.error('Error loading chi so:', error);
    }
  };

  const loadDonThuocs = async () => {
    try {
      const response = await thuocAPI.getAll({ id_benh_nhan: id });
      setDonThuocs(response.data || []);
    } catch (error) {
      console.error('Error loading don thuoc:', error);
    }
  };

  const loadThucDons = async () => {
    try {
      const response = await dinhDuongAPI.getThucDon({ id_benh_nhan: id, limit: 30 });
      setThucDons(response.data || []);
    } catch (error) {
      console.error('Error loading thuc don:', error);
    }
  };

  const loadCongViecs = async () => {
    try {
      const response = await congViecAPI.getAll({ id_benh_nhan: id });
      setCongViecs(response.data || []);
    } catch (error) {
      console.error('Error loading cong viec:', error);
    }
  };

  const loadPhong = async () => {
    try {
      const response = await phongAPI.getByBenhNhan(id);
      setPhong(response.data);
    } catch (error) {
      console.error('Error loading phong:', error);
    }
  };

  const loadNguoiThans = async () => {
    try {
      const response = await nguoiThanAPI.getAll({ id_benh_nhan: id });
      setNguoiThans(response.data || []);
    } catch (error) {
      console.error('Error loading nguoi than:', error);
    }
  };

  const loadDoDungs = async () => {
    try {
      const response = await doDungAPI.getAll({ id_benh_nhan: id });
      setDoDungs(response.data || []);
    } catch (error) {
      console.error('Error loading do dung:', error);
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
        // Lọc chỉ các phòng còn chỗ trống (số người hiện tại < số người tối đa)
        const availablePhongs = (response.data || []).filter(p => {
          const currentCount = p.benh_nhans?.length || 0;
          const maxCapacity = p.so_nguoi_toi_da || 1;
          // Chỉ hiển thị phòng còn chỗ trống
          return currentCount < maxCapacity;
        });
        setPhongs(availablePhongs);
        console.log('Loaded available phongs:', { 
          idPhanKhu, 
          total: response.data?.length || 0,
          available: availablePhongs.length, 
          phongs: availablePhongs.map(p => ({
            id: p.id,
            ten_phong: p.ten_phong,
            current: p.benh_nhans?.length || 0,
            max: p.so_nguoi_toi_da || 1
          }))
        });
      } else {
        setPhongs([]);
      }
    } catch (error) {
      console.error('Error loading phongs:', error);
      setPhongs([]);
    }
  };

  const loadBenhNhanDichVus = async () => {
    try {
      // Load tất cả dịch vụ (không filter theo trang_thai) để hiển thị lịch sử đầy đủ
      const response = await benhNhanDichVuAPI.getAll({ id_benh_nhan: id });
      setBenhNhanDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhan dich vus:', error);
    }
  };

  const loadAllDichVus = async () => {
    try {
      const response = await dichVuAPI.getAll();
      setAllDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading all dich vus:', error);
    }
  };

  // Chi so sinh ton handlers
  const handleChiSoSubmit = async (e) => {
    e.preventDefault();
    try {
      await benhNhanAPI.createChiSoSinhTon(id, chiSoForm);
      alert('Thêm chỉ số sinh tồn thành công');
      setShowChiSoModal(false);
      resetChiSoForm();
      loadChiSoSinhTon();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetChiSoForm = () => {
    setChiSoForm({
      huyet_ap_tam_thu: '',
      huyet_ap_tam_truong: '',
      nhip_tim: '',
      spo2: '',
      nhiet_do: '',
      nhip_tho: '',
      ghi_chu: '',
    });
    setEditingChiSo(null);
  };

  // Thuoc handlers
  const handleThuocSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...thuocForm, id_benh_nhan: id };
      await thuocAPI.create(data);
      alert('Tạo đơn thuốc thành công');
      setShowThuocModal(false);
      resetThuocForm();
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleAddThuoc = () => {
    setThuocForm({
      ...thuocForm,
      thuoc: [...thuocForm.thuoc, { ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
  };

  const handleRemoveThuoc = (index) => {
    const newThuoc = thuocForm.thuoc.filter((_, i) => i !== index);
    setThuocForm({ ...thuocForm, thuoc: newThuoc });
  };

  const handleThuocChange = (index, field, value) => {
    const newThuoc = [...thuocForm.thuoc];
    newThuoc[index][field] = value;
    setThuocForm({ ...thuocForm, thuoc: newThuoc });
  };

  const resetThuocForm = () => {
    setThuocForm({
      mo_ta: '',
      ngay_ke: new Date().toISOString().split('T')[0],
      thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
    setEditingThuoc(null);
  };

  // Thuc don handlers
  const handleThucDonSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...thucDonForm, id_benh_nhan: id };
      await dinhDuongAPI.createThucDon(data);
      alert('Tạo thực đơn thành công');
      setShowThucDonModal(false);
      resetThucDonForm();
      loadThucDons();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetThucDonForm = () => {
    setThucDonForm({
      ngay: new Date().toISOString().split('T')[0],
      bua_sang: '',
      bua_trua: '',
      bua_toi: '',
      tong_calo: '',
    });
    setEditingThucDon(null);
  };

  // Cong viec handlers
  const handleCongViecSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...congViecForm, id_benh_nhan: id };
      await congViecAPI.create(data);
      alert('Tạo công việc thành công');
      setShowCongViecModal(false);
      resetCongViecForm();
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetCongViecForm = () => {
    setCongViecForm({
      ten_cong_viec: '',
      mo_ta: '',
      muc_uu_tien: 'trung_binh',
      thoi_gian_du_kien: '',
      id_dieu_duong: '',
    });
  };

  // Nguoi than handlers
  const handleNguoiThanSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...nguoiThanForm, id_benh_nhan: id };
      if (editingNguoiThan) {
        await nguoiThanAPI.update(editingNguoiThan.id, data);
        alert('Cập nhật người thân thành công');
      } else {
        await nguoiThanAPI.create(data);
        alert('Thêm người thân thành công');
      }
      setShowNguoiThanModal(false);
      resetNguoiThanForm();
      loadNguoiThans();
      loadBenhNhanDetail();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditNguoiThan = (nt) => {
    setEditingNguoiThan(nt);
    setNguoiThanForm({
      ho_ten: nt.ho_ten || '',
      moi_quan_he: nt.moi_quan_he || '',
      so_dien_thoai: nt.so_dien_thoai || '',
      email: nt.email || '',
      la_nguoi_lien_he_chinh: nt.la_nguoi_lien_he_chinh || false,
    });
    setShowNguoiThanModal(true);
  };

  const handleDeleteNguoiThan = async (ntId) => {
    if (!confirm('Bạn có chắc muốn xóa người thân này?')) return;
    try {
      await nguoiThanAPI.delete(ntId);
      alert('Xóa người thân thành công');
      loadNguoiThans();
      loadBenhNhanDetail();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetNguoiThanForm = () => {
    setNguoiThanForm({
      ho_ten: '',
      moi_quan_he: '',
      so_dien_thoai: '',
      email: '',
      la_nguoi_lien_he_chinh: false,
    });
    setEditingNguoiThan(null);
  };

  // Do dung handlers
  const handleDoDungSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...doDungForm, id_benh_nhan: id };
      if (editingDoDung) {
        await doDungAPI.update(editingDoDung.id, data);
        alert('Cập nhật vật dụng thành công');
      } else {
        await doDungAPI.create(data);
        alert('Thêm vật dụng thành công');
      }
      setShowDoDungModal(false);
      resetDoDungForm();
      loadDoDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditDoDung = (dd) => {
    setEditingDoDung(dd);
    setDoDungForm({
      ten_vat_dung: dd.ten_vat_dung || '',
      so_luong: dd.so_luong || 1,
      tinh_trang: dd.tinh_trang || 'tot',
      ghi_chu: dd.ghi_chu || '',
    });
    setShowDoDungModal(true);
  };

  const handleDeleteDoDung = async (ddId) => {
    if (!confirm('Bạn có chắc muốn xóa vật dụng này?')) return;
    try {
      await doDungAPI.delete(ddId);
      alert('Xóa vật dụng thành công');
      loadDoDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetDoDungForm = () => {
    setDoDungForm({
      ten_vat_dung: '',
      so_luong: 1,
      tinh_trang: 'tot',
      ghi_chu: '',
    });
    setEditingDoDung(null);
  };

  // Dich vu handlers
  const handleDichVuSubmit = async (e) => {
    e.preventDefault();
    try {
      const dichVuInfo = allDichVus.find(dv => dv.id === parseInt(dichVuForm.id_dich_vu));
      
      // Tính thành tiền từ bảng giá nếu chưa có
      let thanhTien = dichVuForm.thanh_tien ? parseInt(dichVuForm.thanh_tien) : 0;
      if (!thanhTien && dichVuInfo) {
        if (dichVuForm.hinh_thuc_thanh_toan === 'thang') {
          thanhTien = dichVuInfo.gia_thang || 0;
        } else if (dichVuForm.hinh_thuc_thanh_toan === 'quy') {
          thanhTien = dichVuInfo.gia_quy || 0;
        } else if (dichVuForm.hinh_thuc_thanh_toan === 'nam') {
          thanhTien = dichVuInfo.gia_nam || 0;
        }
      }
      
      // Tính toán dựa trên loại thanh toán
      let daThanhToan = 0;
      let congNo = 0;
      
      if (thanhToanType === 'thanh_toan_du') {
        daThanhToan = thanhTien;
        congNo = 0;
      } else if (thanhToanType === 'thanh_toan_truoc') {
        daThanhToan = parseFloat(soTienThanhToan) || 0;
        congNo = thanhTien - daThanhToan;
      } else {
        daThanhToan = dichVuForm.da_thanh_toan ? parseInt(dichVuForm.da_thanh_toan) : 0;
        congNo = thanhTien - daThanhToan;
      }

      const data = {
        id_benh_nhan: id,
        id_dich_vu: dichVuForm.id_dich_vu,
        ngay_bat_dau: dichVuForm.ngay_bat_dau,
        ngay_ket_thuc: dichVuForm.ngay_ket_thuc || null,
        hinh_thuc_thanh_toan: dichVuForm.hinh_thuc_thanh_toan,
        thanh_tien: thanhTien,
        da_thanh_toan: daThanhToan,
        cong_no_con_lai: congNo,
        trang_thai: dichVuForm.trang_thai
      };

      if (isDoiDichVu && dichVuCuId) {
        // Đổi dịch vụ: cập nhật ngày kết thúc của dịch vụ cũ
        const ngayDoi = new Date().toISOString().split('T')[0];
        await benhNhanDichVuAPI.update(dichVuCuId, {
          ngay_ket_thuc: ngayDoi,
          trang_thai: 'ket_thuc'
        });
        
        // Tạo dịch vụ mới
        data.ngay_bat_dau = ngayDoi;
        await benhNhanDichVuAPI.create(data);
        alert('Đổi dịch vụ thành công');
      } else if (editingDichVu) {
        // Sửa dịch vụ
        await benhNhanDichVuAPI.update(editingDichVu.id, data);
        alert('Cập nhật dịch vụ thành công');
      } else {
        // Thêm dịch vụ mới
        await benhNhanDichVuAPI.create(data);
        alert('Thêm dịch vụ thành công');
      }
      
      setShowDichVuModal(false);
      resetDichVuForm();
      loadBenhNhanDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditDichVu = (dv) => {
    setDichVuForm({
      id_dich_vu: dv.id_dich_vu,
      ngay_bat_dau: dv.ngay_bat_dau || new Date().toISOString().split('T')[0],
      ngay_ket_thuc: dv.ngay_ket_thuc || '',
      hinh_thuc_thanh_toan: dv.hinh_thuc_thanh_toan || 'thang',
      thanh_tien: dv.thanh_tien || '',
      da_thanh_toan: dv.da_thanh_toan || '',
      trang_thai: dv.trang_thai || 'dang_su_dung'
    });
    
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
    
    setEditingDichVu(dv);
    setIsDoiDichVu(false);
    setDichVuCuId(null);
    setShowDichVuModal(true);
  };

  const handleDoiDichVu = (dv) => {
    setDichVuForm({
      id_dich_vu: '',
      ngay_bat_dau: new Date().toISOString().split('T')[0],
      ngay_ket_thuc: '',
      hinh_thuc_thanh_toan: 'thang',
      thanh_tien: '',
      da_thanh_toan: '',
      trang_thai: 'dang_su_dung'
    });
    setThanhToanType('chua_thanh_toan');
    setSoTienThanhToan('');
    setEditingDichVu(null);
    setIsDoiDichVu(true);
    setDichVuCuId(dv.id);
    setShowDichVuModal(true);
  };

  const handleDeleteDichVu = async (dvId) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await benhNhanDichVuAPI.delete(dvId);
      alert('Xóa dịch vụ thành công');
      loadBenhNhanDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleThanhToanDichVu = async (dvId) => {
    const soTien = prompt('Nhập số tiền thanh toán:');
    if (!soTien || isNaN(soTien) || parseFloat(soTien) <= 0) {
      alert('Số tiền không hợp lệ');
      return;
    }
    try {
      await benhNhanDichVuAPI.thanhToan(dvId, { so_tien: parseFloat(soTien) });
      alert('Thanh toán thành công');
      loadBenhNhanDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetDichVuForm = () => {
    setDichVuForm({
      id_dich_vu: '',
      ngay_bat_dau: new Date().toISOString().split('T')[0],
      ngay_ket_thuc: '',
      hinh_thuc_thanh_toan: 'thang',
      thanh_tien: '',
      da_thanh_toan: '',
      trang_thai: 'dang_su_dung'
    });
    setThanhToanType('chua_thanh_toan');
    setSoTienThanhToan('');
    setEditingDichVu(null);
    setIsDoiDichVu(false);
    setDichVuCuId(null);
  };

  // Phong handlers
  const handlePhongSubmit = async (e) => {
    e.preventDefault();
    try {
      // Nếu chọn từ dropdown (id_phong), lấy thông tin từ phòng đó
      let data = { ...phongForm };
      
      if (selectedPhong) {
        // Lấy thông tin từ phòng đã chọn (so sánh type-safe)
        const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
        const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
        
        console.log('Finding phong:', { selectedPhong, phongId, phongs: phongs.length, phongInfo }); // Debug
        
        if (phongInfo) {
          // Lấy tên khu từ phanKhus nếu không có trong phongInfo
          const phanKhuInfo = phanKhus.find(pk => pk.id === selectedPhanKhu);
          
          // Đảm bảo có giá trị cho khu
          data.khu = phongInfo.ten_khu || phanKhuInfo?.ten_khu || '';
          if (!data.khu && selectedPhanKhu) {
            // Nếu vẫn không có, load lại từ API
            const pkInfo = phanKhus.find(pk => pk.id === selectedPhanKhu);
            data.khu = pkInfo?.ten_khu || '';
          }
          
          // Đảm bảo có giá trị cho phong
          data.phong = phongInfo.so_phong || phongInfo.ten_phong || String(phongInfo.id);
          if (!data.phong || data.phong.trim() === '') {
            data.phong = phongInfo.ten_phong || `Phòng ${phongInfo.id}`;
          }
          
          console.log('Preparing data:', { 
            phongInfo, 
            phanKhuInfo, 
            selectedPhanKhu,
            khu: data.khu, 
            phong: data.phong 
          }); // Debug
          
          // Kiểm tra số người tối đa
          const currentCount = phongInfo.benh_nhans?.length || 0;
          const maxCapacity = phongInfo.so_nguoi_toi_da || 1;
          
          if (currentCount >= maxCapacity) {
            alert(`Phòng đã đầy! Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể thêm bệnh nhân vào phòng này.`);
            return;
          }

          // Cập nhật trạng thái phòng thành 'co_nguoi'
          try {
            await phongNewAPI.update(selectedPhong, { trang_thai: 'co_nguoi' });
          } catch (error) {
            console.error('Error updating room status:', error);
          }
        } else {
          console.error('Phong not found:', selectedPhong, phongs);
          alert('Không tìm thấy thông tin phòng. Vui lòng thử lại.');
          return;
        }
      }

      // Validation: Phải có khu và phong (không được rỗng)
      if (!data.khu || data.khu.trim() === '' || !data.phong || data.phong.trim() === '') {
        console.error('Validation failed:', { 
          khu: data.khu, 
          phong: data.phong, 
          selectedPhong, 
          phongForm,
          phongs,
          phanKhus 
        }); // Debug
        alert('Vui lòng chọn phòng từ hệ thống hoặc nhập thông tin khu và phòng đầy đủ');
        return;
      }

      data.id_benh_nhan = id;
      
      // Loại bỏ các trường không cần thiết cho backend
      delete data.id_phan_khu;
      delete data.id_phong;
      
      console.log('Submitting phong data:', data); // Debug log
      
      if (phong) {
        // Nếu đổi phòng, cập nhật trạng thái phòng cũ về 'trong'
        if (phong.id_phong && phong.id_phong !== selectedPhong) {
          try {
            await phongNewAPI.update(phong.id_phong, { trang_thai: 'trong' });
          } catch (error) {
            console.error('Error updating old room status:', error);
          }
        }
        await phongAPI.update(phong.id, data);
        alert('Cập nhật phòng thành công');
      } else {
        await phongAPI.create(data);
        alert('Phân phòng thành công');
      }
      setShowPhongModal(false);
      resetPhongForm();
      loadPhong();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePhanKhuChange = (idPhanKhu) => {
    setSelectedPhanKhu(idPhanKhu);
    setPhongForm({ ...phongForm, id_phan_khu: idPhanKhu, id_phong: '' });
    setSelectedPhong(null);
    loadPhongs(idPhanKhu);
  };

  const handlePhongChange = (idPhong) => {
    const phongId = typeof idPhong === 'string' ? parseInt(idPhong) : idPhong;
    setSelectedPhong(phongId);
    
    // Tìm phòng với so sánh type-safe
    const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
    
    console.log('handlePhongChange:', { 
      idPhong, 
      phongId, 
      phongs: phongs.map(p => ({ id: p.id, ten_phong: p.ten_phong })),
      phongInfo 
    }); // Debug
    
    if (phongInfo) {
      // Lấy tên khu từ phanKhus nếu không có trong phongInfo
      const phanKhuInfo = phanKhus.find(pk => pk.id === selectedPhanKhu || pk.id === parseInt(selectedPhanKhu));
      const khuValue = phongInfo.ten_khu || phanKhuInfo?.ten_khu || '';
      const phongValue = phongInfo.so_phong || phongInfo.ten_phong || String(phongInfo.id);
      
      setPhongForm({
        ...phongForm,
        id_phong: phongId,
        id_phan_khu: selectedPhanKhu,
        khu: khuValue,
        phong: phongValue,
        giuong: phongInfo.so_giuong ? `1` : '', // Default to giuong 1 if available
      });
      
      console.log('Phong selected:', { phongInfo, khuValue, phongValue }); // Debug
    } else {
      console.error('Phong not found in phongs array:', { idPhong, phongId, phongs });
      alert('Không tìm thấy thông tin phòng. Vui lòng thử lại.');
    }
  };

  const resetPhongForm = () => {
    setPhongForm({
      id_phan_khu: '',
      id_phong: '',
      khu: '',
      phong: '',
      giuong: '',
    });
    setSelectedPhanKhu('');
    setSelectedPhong(null);
    setPhongs([]);
  };

  // Xóa phòng của bệnh nhân
  const handleXoaPhong = async () => {
    if (!phong) return;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bệnh nhân khỏi phòng này?')) {
      return;
    }

    try {
      await phongAPI.delete(phong.id);
      alert('Xóa bệnh nhân khỏi phòng thành công');
      setPhong(null);
      loadPhong();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Load phân khu và phòng khi mở modal
  const handleOpenPhongModal = () => {
    loadPhanKhus();
    if (phong) {
      // Nếu đã có phòng, tìm phân khu và phòng tương ứng
      // Note: Có thể cần cải thiện logic này nếu có id_phong trong phong_o_benh_nhan
      setPhongForm({
        id_phan_khu: '',
        id_phong: '',
        khu: phong.khu || '',
        phong: phong.phong || '',
        giuong: phong.giuong || '',
      });
    }
    setShowPhongModal(true);
  };

  // Delete handlers
  const handleDeleteDonThuoc = async (donId) => {
    if (!confirm('Bạn có chắc muốn xóa đơn thuốc này?')) return;
    try {
      await thuocAPI.delete(donId);
      alert('Xóa đơn thuốc thành công');
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeleteThucDon = async (tdId) => {
    if (!confirm('Bạn có chắc muốn xóa thực đơn này?')) return;
    try {
      // Note: API might need delete endpoint
      alert('Chức năng xóa thực đơn sẽ được thêm sau');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!benhNhan) {
    return <div className="text-center py-8 text-red-500">Không tìm thấy bệnh nhân</div>;
  }

  const tabs = [
    { id: 'thong-tin', label: 'Thông tin', icon: '📋' },
    { id: 'chi-so', label: 'Chỉ số sinh tồn', icon: '📊' },
    { id: 'thuoc', label: 'Đơn thuốc', icon: '💊' },
    { id: 'dinh-duong', label: 'Dinh dưỡng', icon: '🍽️' },
    { id: 'cong-viec', label: 'Công việc', icon: '✅' },
    { id: 'dich-vu', label: 'Dịch vụ', icon: '🏥' },
    { id: 'nguoi-than', label: 'Người thân', icon: '👨‍👩‍👧‍👦' },
    { id: 'do-dung', label: 'Vật dụng', icon: '📦' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/benh-nhan')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{benhNhan.ho_ten}</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">Mã BN: {benhNhan.id}</p>
            {phong ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Phòng: {phong.khu}-{phong.phong}-{phong.giuong}</span>
                <button
                  onClick={handleOpenPhongModal}
                  className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 bg-blue-50 rounded"
                >
                  Đổi phòng
                </button>
                <button
                  onClick={handleXoaPhong}
                  className="text-red-600 hover:text-red-800 text-sm px-2 py-1 bg-red-50 rounded"
                >
                  Xóa phòng
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenPhongModal}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Phân phòng
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Thông tin */}
          {activeTab === 'thong-tin' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
                    <dd className="text-gray-900">{benhNhan.ho_ten}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
                    <dd className="text-gray-900">
                      {benhNhan.ngay_sinh ? new Date(benhNhan.ngay_sinh).toLocaleDateString('vi-VN') : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                    <dd className="text-gray-900 capitalize">{benhNhan.gioi_tinh}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">CCCD</dt>
                    <dd className="text-gray-900">{benhNhan.cccd || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                    <dd className="text-gray-900">{benhNhan.dia_chi || '-'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin y tế</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nhóm máu</dt>
                    <dd className="text-gray-900">{benhNhan.nhom_mau || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">BHYT</dt>
                    <dd className="text-gray-900">{benhNhan.bhyt || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Khả năng sinh hoạt</dt>
                    <dd className="text-gray-900 capitalize">{benhNhan.kha_nang_sinh_hoat?.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày nhập viện</dt>
                    <dd className="text-gray-900">
                      {benhNhan.ngay_nhap_vien ? new Date(benhNhan.ngay_nhap_vien).toLocaleDateString('vi-VN') : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Tab: Chỉ số sinh tồn */}
          {activeTab === 'chi-so' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chỉ số sinh tồn</h3>
                <button
                  onClick={() => {
                    resetChiSoForm();
                    setShowChiSoModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm chỉ số
                </button>
              </div>
              {chiSoSinhTon.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có dữ liệu chỉ số sinh tồn</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Huyết áp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhịp tim</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SpO2</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhiệt độ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhịp thở</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chiSoSinhTon.map((cs) => (
                        <tr key={cs.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {new Date(cs.thoi_gian).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {cs.huyet_ap_tam_thu}/{cs.huyet_ap_tam_truong} mmHg
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{cs.nhip_tim} bpm</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{cs.spo2}%</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{cs.nhiet_do}°C</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{cs.nhip_tho || '-'} lần/phút</td>
                          <td className="px-4 py-3 text-sm">{cs.ghi_chu || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Đơn thuốc */}
          {activeTab === 'thuoc' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Đơn thuốc</h3>
                <button
                  onClick={() => {
                    resetThuocForm();
                    setShowThuocModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm đơn thuốc
                </button>
              </div>
              {donThuocs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có đơn thuốc</p>
              ) : (
                <div className="space-y-4">
                  {donThuocs.map((don) => (
                    <div key={don.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Ngày kê: {new Date(don.ngay_ke).toLocaleDateString('vi-VN')}</p>
                          {don.mo_ta && <p className="text-sm text-gray-600 mt-1">{don.mo_ta}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteDonThuoc(don.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      {don.thuoc && don.thuoc.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {don.thuoc.map((thuoc, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                              <span className="font-medium">{thuoc.ten_thuoc}</span> - {thuoc.lieu_luong} - {thuoc.thoi_diem_uong}
                              {thuoc.ghi_chu && <span className="text-gray-600 ml-2">({thuoc.ghi_chu})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Dinh dưỡng */}
          {activeTab === 'dinh-duong' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Thực đơn</h3>
                <button
                  onClick={() => {
                    resetThucDonForm();
                    setShowThucDonModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm thực đơn
                </button>
              </div>
              {thucDons.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có thực đơn</p>
              ) : (
                <div className="space-y-4">
                  {thucDons.map((td) => (
                    <div key={td.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">
                          Ngày: {new Date(td.ngay).toLocaleDateString('vi-VN')} - Tổng calo: {td.tong_calo || 0} kcal
                        </p>
                        <button
                          onClick={() => handleDeleteThucDon(td.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Bữa sáng</p>
                          <p className="text-sm">{td.bua_sang || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Bữa trưa</p>
                          <p className="text-sm">{td.bua_trua || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Bữa tối</p>
                          <p className="text-sm">{td.bua_toi || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Công việc */}
          {activeTab === 'cong-viec' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Công việc chăm sóc</h3>
                <button
                  onClick={() => {
                    resetCongViecForm();
                    setShowCongViecModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm công việc
                </button>
              </div>
              {congViecs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có công việc</p>
              ) : (
                <div className="space-y-3">
                  {congViecs.map((cv) => (
                    <div key={cv.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{cv.ten_cong_viec}</p>
                          {cv.mo_ta && <p className="text-sm text-gray-600 mt-1">{cv.mo_ta}</p>}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Điều dưỡng: {cv.ten_dieu_duong || '-'}</span>
                            <span>Thời gian: {cv.thoi_gian_du_kien ? new Date(cv.thoi_gian_du_kien).toLocaleString('vi-VN') : '-'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={cv.trang_thai || 'chua_lam'}
                            onChange={(e) => {
                              const phanCongId = cv.id; // This should be the phan_cong_cong_viec id
                              // Note: Need to get the correct ID for update
                              alert('Chức năng cập nhật trạng thái sẽ được cải thiện');
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="chua_lam">Chưa làm</option>
                            <option value="dang_lam">Đang làm</option>
                            <option value="hoan_thanh">Hoàn thành</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Người thân */}
          {activeTab === 'nguoi-than' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Người thân</h3>
                <button
                  onClick={() => {
                    resetNguoiThanForm();
                    setShowNguoiThanModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm người thân
                </button>
              </div>
              {nguoiThans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có người thân</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nguoiThans.map((nt) => (
                    <div key={nt.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{nt.ho_ten}</p>
                          {nt.la_nguoi_lien_he_chinh && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                              Liên hệ chính
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNguoiThan(nt)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteNguoiThan(nt.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Quan hệ: {nt.moi_quan_he || '-'}</p>
                      <p className="text-sm text-gray-600">SĐT: {nt.so_dien_thoai || '-'}</p>
                      {nt.email && <p className="text-sm text-gray-600">Email: {nt.email}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Dịch vụ */}
          {activeTab === 'dich-vu' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Dịch vụ</h3>
                <button
                  onClick={() => {
                    resetDichVuForm();
                    setShowDichVuModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm dịch vụ
                </button>
              </div>
              {benhNhanDichVus.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có dịch vụ nào</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình thức</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã thanh toán</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Công nợ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày thanh toán lần cuối</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {benhNhanDichVus.map((dv) => (
                        <tr key={dv.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{dv.ten_dich_vu}</div>
                            {dv.mo_ta_ngan && (
                              <div className="text-xs text-gray-500">{dv.mo_ta_ngan}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dv.ngay_bat_dau ? new Date(dv.ngay_bat_dau).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dv.ngay_ket_thuc ? new Date(dv.ngay_ket_thuc).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {dv.hinh_thuc_thanh_toan?.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dv.thanh_tien ? new Intl.NumberFormat('vi-VN').format(dv.thanh_tien) + ' đ' : '0 đ'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dv.da_thanh_toan ? new Intl.NumberFormat('vi-VN').format(dv.da_thanh_toan) + ' đ' : '0 đ'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              (dv.cong_no_con_lai || 0) > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {new Intl.NumberFormat('vi-VN').format(dv.cong_no_con_lai || 0)} đ
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dv.ngay_thanh_toan_lan_cuoi ? new Date(dv.ngay_thanh_toan_lan_cuoi).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              dv.trang_thai === 'dang_su_dung' ? 'bg-green-100 text-green-800' :
                              dv.trang_thai === 'tam_dung' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dv.trang_thai === 'dang_su_dung' ? 'Đang sử dụng' :
                               dv.trang_thai === 'tam_dung' ? 'Tạm dừng' : 'Kết thúc'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2 flex-wrap">
                              {dv.trang_thai === 'dang_su_dung' && (
                                <button
                                  onClick={() => handleDoiDichVu(dv)}
                                  className="text-purple-600 hover:text-purple-900 text-xs px-2 py-1 border border-purple-300 rounded hover:bg-purple-50"
                                  title="Đổi dịch vụ (sẽ kết thúc dịch vụ cũ và tạo dịch vụ mới)"
                                >
                                  Đổi
                                </button>
                              )}
                              {(dv.cong_no_con_lai || 0) > 0 && (
                                <button
                                  onClick={() => handleThanhToanDichVu(dv.id)}
                                  className="text-green-600 hover:text-green-900 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                                  title="Thanh toán"
                                >
                                  Thanh toán
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDichVu(dv.id)}
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                title="Xóa"
                              >
                                Xóa
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
          )}

          {/* Tab: Vật dụng */}
          {activeTab === 'do-dung' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Vật dụng cá nhân</h3>
                <button
                  onClick={() => {
                    resetDoDungForm();
                    setShowDoDungModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Thêm vật dụng
                </button>
              </div>
              {doDungs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có vật dụng</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doDungs.map((dd) => (
                    <div key={dd.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{dd.ten_vat_dung}</p>
                          <p className="text-sm text-gray-600">Số lượng: {dd.so_luong}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDoDung(dd)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteDoDung(dd.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <p className="text-sm">
                        Tình trạng: 
                        <span className={`ml-1 px-2 py-1 text-xs rounded ${
                          dd.tinh_trang === 'tot' ? 'bg-green-100 text-green-800' :
                          dd.tinh_trang === 'hu_hong' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dd.tinh_trang === 'tot' ? 'Tốt' : dd.tinh_trang === 'hu_hong' ? 'Hư hỏng' : 'Mất'}
                        </span>
                      </p>
                      {dd.ghi_chu && <p className="text-sm text-gray-600 mt-1">{dd.ghi_chu}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Chi so sinh ton */}
      {showChiSoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Thêm chỉ số sinh tồn</h2>
            <form onSubmit={handleChiSoSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Huyết áp tâm thu (mmHg)</label>
                  <input
                    type="number"
                    value={chiSoForm.huyet_ap_tam_thu}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, huyet_ap_tam_thu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Huyết áp tâm trương (mmHg)</label>
                  <input
                    type="number"
                    value={chiSoForm.huyet_ap_tam_truong}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, huyet_ap_tam_truong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhịp tim (bpm)</label>
                  <input
                    type="number"
                    value={chiSoForm.nhip_tim}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, nhip_tim: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={chiSoForm.spo2}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, spo2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhiệt độ (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={chiSoForm.nhiet_do}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, nhiet_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhịp thở (lần/phút)</label>
                  <input
                    type="number"
                    value={chiSoForm.nhip_tho}
                    onChange={(e) => setChiSoForm({ ...chiSoForm, nhip_tho: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={chiSoForm.ghi_chu}
                  onChange={(e) => setChiSoForm({ ...chiSoForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChiSoModal(false);
                    resetChiSoForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Don thuoc */}
      {showThuocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo đơn thuốc mới</h2>
            <form onSubmit={handleThuocSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kê *</label>
                  <input
                    type="date"
                    required
                    value={thuocForm.ngay_ke}
                    onChange={(e) => setThuocForm({ ...thuocForm, ngay_ke: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={thuocForm.mo_ta}
                    onChange={(e) => setThuocForm({ ...thuocForm, mo_ta: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Danh sách thuốc *</label>
                  <button
                    type="button"
                    onClick={handleAddThuoc}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    + Thêm thuốc
                  </button>
                </div>
                <div className="space-y-3">
                  {thuocForm.thuoc.map((thuoc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Thuốc {index + 1}</span>
                        {thuocForm.thuoc.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveThuoc(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Tên thuốc *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.ten_thuoc}
                            onChange={(e) => handleThuocChange(index, 'ten_thuoc', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Liều lượng *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.lieu_luong}
                            onChange={(e) => handleThuocChange(index, 'lieu_luong', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Thời điểm uống</label>
                          <input
                            type="text"
                            value={thuoc.thoi_diem_uong}
                            onChange={(e) => handleThuocChange(index, 'thoi_diem_uong', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="VD: Sáng, Trưa, Tối"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Ghi chú</label>
                          <input
                            type="text"
                            value={thuoc.ghi_chu}
                            onChange={(e) => handleThuocChange(index, 'ghi_chu', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowThuocModal(false);
                    resetThuocForm();
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

      {/* Modal: Thuc don */}
      {showThucDonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo thực đơn mới</h2>
            <form onSubmit={handleThucDonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                <input
                  type="date"
                  required
                  value={thucDonForm.ngay}
                  onChange={(e) => setThucDonForm({ ...thucDonForm, ngay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bữa sáng</label>
                <textarea
                  value={thucDonForm.bua_sang}
                  onChange={(e) => setThucDonForm({ ...thucDonForm, bua_sang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bữa trưa</label>
                <textarea
                  value={thucDonForm.bua_trua}
                  onChange={(e) => setThucDonForm({ ...thucDonForm, bua_trua: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bữa tối</label>
                <textarea
                  value={thucDonForm.bua_toi}
                  onChange={(e) => setThucDonForm({ ...thucDonForm, bua_toi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng calo (kcal)</label>
                <input
                  type="number"
                  value={thucDonForm.tong_calo}
                  onChange={(e) => setThucDonForm({ ...thucDonForm, tong_calo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowThucDonModal(false);
                    resetThucDonForm();
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

      {/* Modal: Cong viec */}
      {showCongViecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo công việc mới</h2>
            <form onSubmit={handleCongViecSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công việc *</label>
                <input
                  type="text"
                  required
                  value={congViecForm.ten_cong_viec}
                  onChange={(e) => setCongViecForm({ ...congViecForm, ten_cong_viec: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={congViecForm.mo_ta}
                  onChange={(e) => setCongViecForm({ ...congViecForm, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức ưu tiên</label>
                  <select
                    value={congViecForm.muc_uu_tien}
                    onChange={(e) => setCongViecForm({ ...congViecForm, muc_uu_tien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thap">Thấp</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="cao">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian dự kiến</label>
                  <input
                    type="datetime-local"
                    value={congViecForm.thoi_gian_du_kien}
                    onChange={(e) => setCongViecForm({ ...congViecForm, thoi_gian_du_kien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điều dưỡng (tùy chọn)</label>
                  <select
                    value={congViecForm.id_dieu_duong}
                    onChange={(e) => setCongViecForm({ ...congViecForm, id_dieu_duong: e.target.value })}
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
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCongViecModal(false);
                    resetCongViecForm();
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

      {/* Modal: Nguoi than */}
      {showNguoiThanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingNguoiThan ? 'Sửa người thân' : 'Thêm người thân'}
            </h2>
            <form onSubmit={handleNguoiThanSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={nguoiThanForm.ho_ten}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, ho_ten: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mối quan hệ</label>
                  <input
                    type="text"
                    value={nguoiThanForm.moi_quan_he}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, moi_quan_he: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: Con, Cháu, Anh/Chị..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={nguoiThanForm.so_dien_thoai}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, so_dien_thoai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={nguoiThanForm.email}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nguoiThanForm.la_nguoi_lien_he_chinh}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, la_nguoi_lien_he_chinh: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Là người liên hệ chính</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNguoiThanModal(false);
                    resetNguoiThanForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingNguoiThan ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Do dung */}
      {showDoDungModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingDoDung ? 'Sửa vật dụng' : 'Thêm vật dụng'}
            </h2>
            <form onSubmit={handleDoDungSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật dụng *</label>
                  <input
                    type="text"
                    required
                    value={doDungForm.ten_vat_dung}
                    onChange={(e) => setDoDungForm({ ...doDungForm, ten_vat_dung: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={doDungForm.so_luong}
                    onChange={(e) => setDoDungForm({ ...doDungForm, so_luong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                  <select
                    value={doDungForm.tinh_trang}
                    onChange={(e) => setDoDungForm({ ...doDungForm, tinh_trang: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="tot">Tốt</option>
                    <option value="hu_hong">Hư hỏng</option>
                    <option value="mat">Mất</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={doDungForm.ghi_chu}
                  onChange={(e) => setDoDungForm({ ...doDungForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDoDungModal(false);
                    resetDoDungForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingDoDung ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Phong */}
      {showPhongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {phong ? 'Sửa phòng' : 'Phân phòng'}
            </h2>
            <form onSubmit={handlePhongSubmit} className="space-y-4">
              {/* Chọn từ dropdown hoặc nhập tay */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Chọn phòng từ hệ thống</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phân khu</label>
                    <select
                      value={selectedPhanKhu}
                      onChange={(e) => handlePhanKhuChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Chọn phân khu</option>
                      {phanKhus.map((pk) => (
                        <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
                    <select
                      value={selectedPhong || ''}
                      onChange={(e) => handlePhongChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                </div>

                {/* Hiển thị thông tin phòng đã chọn */}
                {selectedPhong && (() => {
                  const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
                  const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
                  if (!phongInfo) {
                    console.error('Phong not found for display:', { selectedPhong, phongId, phongs });
                    return null;
                  }
                  return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Thông tin phòng:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Tên phòng:</span> {phongInfo.ten_phong}</div>
                        <div><span className="font-medium">Số phòng:</span> {phongInfo.so_phong || '-'}</div>
                        <div><span className="font-medium">Số giường:</span> {phongInfo.so_giuong || '-'}</div>
                        <div><span className="font-medium">Diện tích:</span> {phongInfo.dien_tich ? `${phongInfo.dien_tich} m²` : '-'}</div>
                        <div><span className="font-medium">Số người:</span> 
                          <span className="ml-1">
                            {phongInfo.benh_nhans?.length || 0}/{phongInfo.so_nguoi_toi_da || 1}
                            {(() => {
                              const currentCount = phongInfo.benh_nhans?.length || 0;
                              const maxCapacity = phongInfo.so_nguoi_toi_da || 1;
                              const availableSlots = maxCapacity - currentCount;
                              return availableSlots > 0 ? (
                                <span className="ml-1 text-green-600 font-medium">(Còn {availableSlots} chỗ)</span>
                              ) : (
                                <span className="ml-1 text-red-600 font-medium">(Đầy)</span>
                              );
                            })()}
                          </span>
                        </div>
                        <div><span className="font-medium">Trạng thái:</span> 
                          <span className={`ml-1 px-2 py-1 text-xs rounded ${
                            phongInfo.trang_thai === 'trong' ? 'bg-green-100 text-green-800' :
                            phongInfo.trang_thai === 'co_nguoi' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {phongInfo.trang_thai === 'trong' ? 'Trống' : phongInfo.trang_thai === 'co_nguoi' ? 'Có người' : 'Bảo trì'}
                          </span>
                        </div>
                      </div>
                      {/* Hiển thị ảnh phòng */}
                      {(phongInfo.anh_1 || phongInfo.anh_2 || phongInfo.anh_3) && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Hình ảnh:</span>
                          <div className="flex gap-2 mt-2">
                            {phongInfo.anh_1 && (
                              <img src={phongInfo.anh_1} alt="Ảnh 1" className="w-20 h-20 object-cover rounded border" />
                            )}
                            {phongInfo.anh_2 && (
                              <img src={phongInfo.anh_2} alt="Ảnh 2" className="w-20 h-20 object-cover rounded border" />
                            )}
                            {phongInfo.anh_3 && (
                              <img src={phongInfo.anh_3} alt="Ảnh 3" className="w-20 h-20 object-cover rounded border" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Hoặc nhập tay */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc nhập thông tin thủ công</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khu</label>
                  <input
                    type="text"
                    value={phongForm.khu}
                    onChange={(e) => setPhongForm({ ...phongForm, khu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: A, B, C..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
                  <input
                    type="text"
                    value={phongForm.phong}
                    onChange={(e) => setPhongForm({ ...phongForm, phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 101, 102..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giường</label>
                  <input
                    type="text"
                    value={phongForm.giuong}
                    onChange={(e) => setPhongForm({ ...phongForm, giuong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 1, 2..."
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý:</p>
                <p>Nếu chọn phòng từ hệ thống, thông tin sẽ được tự động điền. Bạn có thể chỉnh sửa giường nếu cần.</p>
                <p className="mt-1">Khi phân phòng, trạng thái phòng sẽ được cập nhật thành "Có người".</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhongModal(false);
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
                  {phong ? 'Cập nhật' : 'Phân phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dịch vụ */}
      {showDichVuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isDoiDichVu ? 'Đổi dịch vụ' : editingDichVu ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
            </h2>
            {isDoiDichVu && (
              <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-2 rounded">
                Dịch vụ cũ sẽ được cập nhật ngày kết thúc và dịch vụ mới sẽ được tạo với ngày bắt đầu là ngày đổi.
              </p>
            )}
            <form onSubmit={handleDichVuSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ *</label>
                <select
                  required
                  value={dichVuForm.id_dich_vu}
                  onChange={(e) => {
                    setDichVuForm({ ...dichVuForm, id_dich_vu: e.target.value });
                    // Tự động tính giá khi chọn dịch vụ
                    const dichVuInfo = allDichVus.find(dv => dv.id === parseInt(e.target.value));
                    if (dichVuInfo) {
                      let gia = 0;
                      if (dichVuForm.hinh_thuc_thanh_toan === 'thang') {
                        gia = dichVuInfo.gia_thang || 0;
                      } else if (dichVuForm.hinh_thuc_thanh_toan === 'quy') {
                        gia = dichVuInfo.gia_quy || 0;
                      } else if (dichVuForm.hinh_thuc_thanh_toan === 'nam') {
                        gia = dichVuInfo.gia_nam || 0;
                      }
                      if (gia > 0) {
                        setDichVuForm(prev => ({ ...prev, thanh_tien: gia.toString() }));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={!!editingDichVu && !isDoiDichVu}
                >
                  <option value="">Chọn dịch vụ</option>
                  {allDichVus.map((dv) => (
                    <option key={dv.id} value={dv.id}>{dv.ten_dich_vu}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={dichVuForm.ngay_bat_dau}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, ngay_bat_dau: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={dichVuForm.ngay_ket_thuc}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, ngay_ket_thuc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức thanh toán *</label>
                  <select
                    required
                    value={dichVuForm.hinh_thuc_thanh_toan}
                    onChange={(e) => {
                      setDichVuForm({ ...dichVuForm, hinh_thuc_thanh_toan: e.target.value });
                      // Tự động tính giá khi thay đổi hình thức thanh toán
                      const dichVuInfo = allDichVus.find(dv => dv.id === parseInt(dichVuForm.id_dich_vu));
                      if (dichVuInfo) {
                        let gia = 0;
                        if (e.target.value === 'thang') {
                          gia = dichVuInfo.gia_thang || 0;
                        } else if (e.target.value === 'quy') {
                          gia = dichVuInfo.gia_quy || 0;
                        } else if (e.target.value === 'nam') {
                          gia = dichVuInfo.gia_nam || 0;
                        }
                        if (gia > 0) {
                          setDichVuForm(prev => ({ ...prev, thanh_tien: gia.toString() }));
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thang">Theo tháng</option>
                    <option value="quy">Theo quý</option>
                    <option value="nam">Theo năm</option>
                  </select>
                  {(() => {
                    const dichVuInfo = allDichVus.find(dv => dv.id === parseInt(dichVuForm.id_dich_vu));
                    if (dichVuInfo) {
                      let gia = 0;
                      if (dichVuForm.hinh_thuc_thanh_toan === 'thang') {
                        gia = dichVuInfo.gia_thang || 0;
                      } else if (dichVuForm.hinh_thuc_thanh_toan === 'quy') {
                        gia = dichVuInfo.gia_quy || 0;
                      } else if (dichVuForm.hinh_thuc_thanh_toan === 'nam') {
                        gia = dichVuInfo.gia_nam || 0;
                      }
                      if (gia > 0 && !dichVuForm.thanh_tien) {
                        return (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            Giá tự động: {new Intl.NumberFormat('vi-VN').format(gia)} đ
                          </p>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                  <select
                    required
                    value={dichVuForm.trang_thai}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, trang_thai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dang_su_dung">Đang sử dụng</option>
                    <option value="tam_dung">Tạm dừng</option>
                    <option value="ket_thuc">Kết thúc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thành tiền (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={dichVuForm.thanh_tien}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, thanh_tien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tự động tính từ bảng giá"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống để tự động tính từ bảng giá</p>
                </div>
              </div>
              
              {/* Checkbox thanh toán */}
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
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDichVuModal(false);
                    resetDichVuForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingDichVu ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
