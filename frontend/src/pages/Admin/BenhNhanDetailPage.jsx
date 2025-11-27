import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  benhNhanAPI, thuocAPI, dinhDuongAPI, congViecAPI, 
  phongAPI, phanKhuAPI, phongNewAPI, nguoiThanAPI, doDungAPI, nhanVienAPI,
  benhNhanDichVuAPI, dichVuAPI, loaiBenhLyAPI, thongTinBenhAPI
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
  const [allPhongs, setAllPhongs] = useState([]);
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
  const [hoSoYTe, setHoSoYTe] = useState(null);
  const [benhHienTai, setBenhHienTai] = useState([]);
  const [tamLyGiaoTiep, setTamLyGiaoTiep] = useState([]);
  const [vanDongPhucHoi, setVanDongPhucHoi] = useState([]);
  const [loaiBenhLys, setLoaiBenhLys] = useState([]);
  const [thongTinBenhs, setThongTinBenhs] = useState([]);
  const [showCreateLoaiBenhLy, setShowCreateLoaiBenhLy] = useState(false);
  const [showCreateThongTinBenh, setShowCreateThongTinBenh] = useState(false);
  const [newLoaiBenhLy, setNewLoaiBenhLy] = useState({ ten_loai_benh_ly: '', mo_ta: '' });
  const [newThongTinBenh, setNewThongTinBenh] = useState({ ten_benh: '', mo_ta: '' });
  
  // Modal states
  const [showChiSoModal, setShowChiSoModal] = useState(false);
  const [showThuocModal, setShowThuocModal] = useState(false);
  const [showThucDonModal, setShowThucDonModal] = useState(false);
  const [showCongViecModal, setShowCongViecModal] = useState(false);
  const [showNguoiThanModal, setShowNguoiThanModal] = useState(false);
  const [showDoDungModal, setShowDoDungModal] = useState(false);
  const [showPhongModal, setShowPhongModal] = useState(false);
  const [showDichVuModal, setShowDichVuModal] = useState(false);
  const [showHoSoYTeModal, setShowHoSoYTeModal] = useState(false);
  const [showBenhHienTaiModal, setShowBenhHienTaiModal] = useState(false);
  const [showTamLyGiaoTiepModal, setShowTamLyGiaoTiepModal] = useState(false);
  const [showVanDongPhucHoiModal, setShowVanDongPhucHoiModal] = useState(false);
  
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
  const [editingBenhHienTai, setEditingBenhHienTai] = useState(null);
  const [editingTamLyGiaoTiep, setEditingTamLyGiaoTiep] = useState(null);
  const [editingVanDongPhucHoi, setEditingVanDongPhucHoi] = useState(null);
  const [dichVuForm, setDichVuForm] = useState({
    id_dich_vu: '',
    ngay_bat_dau: new Date().toISOString().split('T')[0],
    ngay_ket_thuc: '',
    hinh_thuc_thanh_toan: 'thang',
    trang_thai: 'dang_su_dung'
  });
  const [isDoiDichVu, setIsDoiDichVu] = useState(false);
  const [dichVuCuId, setDichVuCuId] = useState(null);
  
  // Form states for new features
  const [hoSoYTeForm, setHoSoYTeForm] = useState({
    id_loai_benh_ly: '',
    tien_su_benh: '',
    di_ung_thuoc: '',
    lich_su_phau_thuat: '',
    benh_ly_hien_tai: '',
    ghi_chu_dac_biet: '',
  });
  const [benhHienTaiForm, setBenhHienTaiForm] = useState({
    id_thong_tin_benh: '',
    ngay_phat_hien: new Date().toISOString().split('T')[0],
    tinh_trang: 'dang_dieu_tri',
    ghi_chu: '',
  });
  const [tamLyGiaoTiepForm, setTamLyGiaoTiepForm] = useState({
    trang_thai_tinh_than: 'binh_thuong',
    nhan_thuc_nguoi_than: false,
    nhan_thuc_dieu_duong: false,
    biet_thoi_gian: false,
    muc_do_tuong_tac: 'phan_hoi',
    ghi_chu: '',
    thoi_gian: new Date().toISOString(),
  });
  const [vanDongPhucHoiForm, setVanDongPhucHoiForm] = useState({
    kha_nang_van_dong: 'doc_lap',
    loai_bai_tap: '',
    thoi_gian_bat_dau: new Date().toISOString(),
    thoi_luong_phut: '',
    cuong_do: 'trung_binh',
    calo_tieu_hao: '',
    ghi_chu: '',
  });

  useEffect(() => {
    if (id) {
      loadBenhNhanDetail();
      loadChiSoSinhTon();
      loadDonThuocs();
      loadThucDons();
      loadCongViecs();
      loadPhong();
      loadAllPhongs();
      loadNguoiThans();
      loadDoDungs();
      loadNhanViens();
      loadBenhNhanDichVus();
      loadAllDichVus();
      loadHoSoYTe();
      loadBenhHienTai();
      loadTamLyGiaoTiep();
      loadVanDongPhucHoi();
      loadLoaiBenhLys();
      loadThongTinBenhs();
    }
  }, [id]);

  const loadBenhNhanDetail = async () => {
    try {
      const response = await benhNhanAPI.getById(id);
      setBenhNhan(response.data);
      // Nếu có phongs trong response, cập nhật allPhongs
      if (response.data && response.data.phongs) {
        setAllPhongs(response.data.phongs);
      }
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

  const loadAllPhongs = async () => {
    try {
      // Lấy từ benhNhan.phongs nếu đã có
      if (benhNhan && benhNhan.phongs && Array.isArray(benhNhan.phongs)) {
        setAllPhongs(benhNhan.phongs);
        return;
      }
      
      // Thử lấy từ API getAll với filter
      try {
        const response = await phongAPI.getAll({ id_benh_nhan: id });
        if (response.data && Array.isArray(response.data)) {
          setAllPhongs(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API getAll not available, trying alternative method');
      }
      
      // Fallback: lấy từ benhNhan detail nếu chưa có
      if (!benhNhan || !benhNhan.phongs) {
        const detailResponse = await benhNhanAPI.getById(id);
        if (detailResponse.data && detailResponse.data.phongs) {
          setAllPhongs(detailResponse.data.phongs);
        }
      }
    } catch (error) {
      console.error('Error loading all phongs:', error);
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

  const loadHoSoYTe = async () => {
    try {
      const response = await benhNhanAPI.getHoSoYTe(id);
      setHoSoYTe(response.data);
      if (response.data) {
        setHoSoYTeForm({
          id_loai_benh_ly: response.data.id_loai_benh_ly || '',
          tien_su_benh: response.data.tien_su_benh || '',
          di_ung_thuoc: response.data.di_ung_thuoc || '',
          lich_su_phau_thuat: response.data.lich_su_phau_thuat || '',
          benh_ly_hien_tai: response.data.benh_ly_hien_tai || '',
          ghi_chu_dac_biet: response.data.ghi_chu_dac_biet || '',
        });
      }
    } catch (error) {
      console.error('Error loading ho so y te:', error);
    }
  };

  const loadBenhHienTai = async () => {
    try {
      const response = await benhNhanAPI.getBenhHienTai(id);
      setBenhHienTai(response.data || []);
    } catch (error) {
      console.error('Error loading benh hien tai:', error);
    }
  };

  const loadTamLyGiaoTiep = async () => {
    try {
      const response = await benhNhanAPI.getTamLyGiaoTiep(id, { limit: 30 });
      setTamLyGiaoTiep(response.data || []);
    } catch (error) {
      console.error('Error loading tam ly giao tiep:', error);
    }
  };

  const loadVanDongPhucHoi = async () => {
    try {
      const response = await benhNhanAPI.getVanDongPhucHoi(id, { limit: 30 });
      setVanDongPhucHoi(response.data || []);
    } catch (error) {
      console.error('Error loading van dong phuc hoi:', error);
    }
  };

  const loadLoaiBenhLys = async () => {
    try {
      const response = await loaiBenhLyAPI.getAll();
      setLoaiBenhLys(response.data || []);
    } catch (error) {
      console.error('Error loading loai benh lys:', error);
    }
  };

  const loadThongTinBenhs = async () => {
    try {
      const response = await thongTinBenhAPI.getAll();
      setThongTinBenhs(response.data || []);
    } catch (error) {
      console.error('Error loading thong tin benhs:', error);
    }
  };

  // Tạo mới loại bệnh lý
  const handleCreateLoaiBenhLy = async (e) => {
    e.preventDefault();
    try {
      const response = await loaiBenhLyAPI.create(newLoaiBenhLy);
      alert('Tạo loại bệnh lý thành công');
      setShowCreateLoaiBenhLy(false);
      setNewLoaiBenhLy({ ten_loai_benh_ly: '', mo_ta: '' });
      await loadLoaiBenhLys();
      // Tự động chọn loại bệnh lý vừa tạo
      setHoSoYTeForm({ ...hoSoYTeForm, id_loai_benh_ly: String(response.data.id) });
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Tạo mới thông tin bệnh
  const handleCreateThongTinBenh = async (e) => {
    e.preventDefault();
    try {
      const response = await thongTinBenhAPI.create(newThongTinBenh);
      alert('Tạo thông tin bệnh thành công');
      setShowCreateThongTinBenh(false);
      setNewThongTinBenh({ ten_benh: '', mo_ta: '' });
      await loadThongTinBenhs();
      // Tự động chọn thông tin bệnh vừa tạo
      setBenhHienTaiForm({ ...benhHienTaiForm, id_thong_tin_benh: String(response.data.id) });
    } catch (error) {
      alert('Lỗi: ' + error.message);
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
      const data = {
        id_benh_nhan: id,
        id_dich_vu: dichVuForm.id_dich_vu,
        ngay_bat_dau: dichVuForm.ngay_bat_dau,
        ngay_ket_thuc: dichVuForm.ngay_ket_thuc || null,
        hinh_thuc_thanh_toan: dichVuForm.hinh_thuc_thanh_toan,
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
      trang_thai: dv.trang_thai || 'dang_su_dung'
    });
    
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
      trang_thai: 'dang_su_dung'
    });
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


  const resetDichVuForm = () => {
    setDichVuForm({
      id_dich_vu: '',
      ngay_bat_dau: new Date().toISOString().split('T')[0],
      ngay_ket_thuc: '',
      hinh_thuc_thanh_toan: 'thang',
      trang_thai: 'dang_su_dung'
    });
    setEditingDichVu(null);
    setIsDoiDichVu(false);
    setDichVuCuId(null);
  };

  // Ho so y te handlers
  const handleHoSoYTeSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...hoSoYTeForm,
        id_loai_benh_ly: hoSoYTeForm.id_loai_benh_ly ? parseInt(hoSoYTeForm.id_loai_benh_ly) : null,
      };
      await benhNhanAPI.createOrUpdateHoSoYTe(id, data);
      alert('Lưu hồ sơ y tế thành công');
      setShowHoSoYTeModal(false);
      loadHoSoYTe();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetHoSoYTeForm = () => {
    setHoSoYTeForm({
      id_loai_benh_ly: '',
      tien_su_benh: '',
      di_ung_thuoc: '',
      lich_su_phau_thuat: '',
      benh_ly_hien_tai: '',
      ghi_chu_dac_biet: '',
    });
  };

  // Benh hien tai handlers
  const handleBenhHienTaiSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...benhHienTaiForm,
        id_thong_tin_benh: benhHienTaiForm.id_thong_tin_benh ? parseInt(benhHienTaiForm.id_thong_tin_benh) : null,
      };
      if (editingBenhHienTai) {
        await benhNhanAPI.updateBenhHienTai(editingBenhHienTai.id, data);
        alert('Cập nhật bệnh hiện tại thành công');
      } else {
        await benhNhanAPI.createBenhHienTai(id, data);
        alert('Thêm bệnh hiện tại thành công');
      }
      setShowBenhHienTaiModal(false);
      resetBenhHienTaiForm();
      loadBenhHienTai();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditBenhHienTai = (bh) => {
    setEditingBenhHienTai(bh);
    setBenhHienTaiForm({
      id_thong_tin_benh: bh.id_thong_tin_benh ? String(bh.id_thong_tin_benh) : '',
      ngay_phat_hien: bh.ngay_phat_hien ? (bh.ngay_phat_hien.includes('T') ? bh.ngay_phat_hien.split('T')[0] : bh.ngay_phat_hien) : new Date().toISOString().split('T')[0],
      tinh_trang: bh.tinh_trang || 'dang_dieu_tri',
      ghi_chu: bh.ghi_chu || '',
    });
    setShowBenhHienTaiModal(true);
  };

  const handleDeleteBenhHienTai = async (bhId) => {
    if (!confirm('Bạn có chắc muốn xóa bệnh hiện tại này?')) return;
    try {
      await benhNhanAPI.deleteBenhHienTai(bhId);
      alert('Xóa bệnh hiện tại thành công');
      loadBenhHienTai();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetBenhHienTaiForm = () => {
    setBenhHienTaiForm({
      id_thong_tin_benh: '',
      ngay_phat_hien: new Date().toISOString().split('T')[0],
      tinh_trang: 'dang_dieu_tri',
      ghi_chu: '',
    });
    setEditingBenhHienTai(null);
  };

  // Tam ly giao tiep handlers
  const handleTamLyGiaoTiepSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTamLyGiaoTiep) {
        await benhNhanAPI.updateTamLyGiaoTiep(editingTamLyGiaoTiep.id, tamLyGiaoTiepForm);
        alert('Cập nhật tâm lý giao tiếp thành công');
      } else {
        await benhNhanAPI.createTamLyGiaoTiep(id, tamLyGiaoTiepForm);
        alert('Thêm tâm lý giao tiếp thành công');
      }
      setShowTamLyGiaoTiepModal(false);
      resetTamLyGiaoTiepForm();
      loadTamLyGiaoTiep();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditTamLyGiaoTiep = (tlg) => {
    setEditingTamLyGiaoTiep(tlg);
    setTamLyGiaoTiepForm({
      trang_thai_tinh_than: tlg.trang_thai_tinh_than || 'binh_thuong',
      nhan_thuc_nguoi_than: tlg.nhan_thuc_nguoi_than || false,
      nhan_thuc_dieu_duong: tlg.nhan_thuc_dieu_duong || false,
      biet_thoi_gian: tlg.biet_thoi_gian || false,
      muc_do_tuong_tac: tlg.muc_do_tuong_tac || 'phan_hoi',
      ghi_chu: tlg.ghi_chu || '',
      thoi_gian: tlg.thoi_gian ? new Date(tlg.thoi_gian).toISOString() : new Date().toISOString(),
    });
    setShowTamLyGiaoTiepModal(true);
  };

  const handleDeleteTamLyGiaoTiep = async (tlgId) => {
    if (!confirm('Bạn có chắc muốn xóa ghi chú tâm lý này?')) return;
    try {
      await benhNhanAPI.deleteTamLyGiaoTiep(tlgId);
      alert('Xóa tâm lý giao tiếp thành công');
      loadTamLyGiaoTiep();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetTamLyGiaoTiepForm = () => {
    setTamLyGiaoTiepForm({
      trang_thai_tinh_than: 'binh_thuong',
      nhan_thuc_nguoi_than: false,
      nhan_thuc_dieu_duong: false,
      biet_thoi_gian: false,
      muc_do_tuong_tac: 'phan_hoi',
      ghi_chu: '',
      thoi_gian: new Date().toISOString(),
    });
    setEditingTamLyGiaoTiep(null);
  };

  // Van dong phuc hoi handlers
  const handleEditVanDongPhucHoi = (vdph) => {
    setEditingVanDongPhucHoi(vdph);
    setVanDongPhucHoiForm({
      kha_nang_van_dong: vdph.kha_nang_van_dong || 'doc_lap',
      loai_bai_tap: vdph.loai_bai_tap || '',
      thoi_gian_bat_dau: vdph.thoi_gian_bat_dau ? new Date(vdph.thoi_gian_bat_dau).toISOString() : new Date().toISOString(),
      thoi_luong_phut: vdph.thoi_luong_phut ? String(vdph.thoi_luong_phut) : '',
      cuong_do: vdph.cuong_do || 'trung_binh',
      calo_tieu_hao: vdph.calo_tieu_hao ? String(vdph.calo_tieu_hao) : '',
      ghi_chu: vdph.ghi_chu || '',
    });
    setShowVanDongPhucHoiModal(true);
  };

  const handleDeleteVanDongPhucHoi = async (vdphId) => {
    if (!confirm('Bạn có chắc muốn xóa vận động phục hồi này?')) return;
    try {
      await benhNhanAPI.deleteVanDongPhucHoi(vdphId);
      alert('Xóa vận động phục hồi thành công');
      loadVanDongPhucHoi();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetVanDongPhucHoiForm = () => {
    setVanDongPhucHoiForm({
      kha_nang_van_dong: 'doc_lap',
      loai_bai_tap: '',
      thoi_gian_bat_dau: new Date().toISOString(),
      thoi_luong_phut: '',
      cuong_do: 'trung_binh',
      calo_tieu_hao: '',
      ghi_chu: '',
    });
    setEditingVanDongPhucHoi(null);
  };

  const handleVanDongPhucHoiSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...vanDongPhucHoiForm,
        thoi_luong_phut: vanDongPhucHoiForm.thoi_luong_phut ? parseInt(vanDongPhucHoiForm.thoi_luong_phut) : null,
        calo_tieu_hao: vanDongPhucHoiForm.calo_tieu_hao ? parseInt(vanDongPhucHoiForm.calo_tieu_hao) : null,
      };
      if (editingVanDongPhucHoi) {
        await benhNhanAPI.updateVanDongPhucHoi(editingVanDongPhucHoi.id, data);
        alert('Cập nhật vận động phục hồi thành công');
      } else {
        await benhNhanAPI.createVanDongPhucHoi(id, data);
        alert('Thêm vận động phục hồi thành công');
      }
      setShowVanDongPhucHoiModal(false);
      resetVanDongPhucHoiForm();
      loadVanDongPhucHoi();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
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

      // Tạo phòng mới với id_phong (backend sẽ tự động kết thúc phòng cũ nếu có)
      if (selectedPhong) {
        const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
        const createData = {
          id_benh_nhan: id,
          id_phong: phongId,
          ngay_bat_dau_o: new Date().toISOString().split('T')[0],
          ngay_ket_thuc_o: null
        };
        
        try {
          await phongAPI.create(createData);
          alert(phong ? 'Đổi phòng thành công' : 'Phân phòng thành công');
        } catch (error) {
          console.error('Error creating new room:', error);
          alert('Lỗi: ' + error.message);
          return;
        }
      } else {
        // Fallback: sử dụng cách cũ nếu không có selectedPhong
        data.id_benh_nhan = id;
        delete data.id_phan_khu;
        delete data.id_phong;
        
        if (phong && phong.id) {
          await phongAPI.update(phong.id, data);
          alert('Cập nhật phòng thành công');
        } else {
          await phongAPI.create(data);
          alert('Phân phòng thành công');
        }
      }
      setShowPhongModal(false);
      resetPhongForm();
      loadPhong();
      loadAllPhongs();
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
      loadAllPhongs();
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
    { id: 'thong-tin', label: 'Thông tin', icon: 'info' },
    { id: 'chi-so', label: 'Chỉ số sinh tồn', icon: 'monitor_heart' },
    { id: 'thuoc', label: 'Đơn thuốc', icon: 'medication' },
    { id: 'dinh-duong', label: 'Dinh dưỡng', icon: 'restaurant' },
    { id: 'cong-viec', label: 'Công việc', icon: 'task' },
    { id: 'phong', label: 'Phòng', icon: 'bed' },
    { id: 'dich-vu', label: 'Dịch vụ', icon: 'medical_services' },
    { id: 'nguoi-than', label: 'Người thân', icon: 'group' },
    { id: 'do-dung', label: 'Vật dụng', icon: 'inventory_2' },
    { id: 'ho-so-y-te', label: 'Hồ sơ y tế', icon: 'folder' },
    { id: 'benh-hien-tai', label: 'Bệnh hiện tại', icon: 'medical_information' },
    { id: 'tam-ly', label: 'Tâm lý giao tiếp', icon: 'psychology' },
    { id: 'van-dong', label: 'Vận động phục hồi', icon: 'fitness_center' },
  ];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border font-raleway" style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
      <div className="space-y-6 p-6 lg:p-8 max-w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate('/admin/benh-nhan')}
              className="flex items-center gap-2 text-[#4A90E2] hover:text-[#4A90E2]/80 mb-3 font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
              <span>Quay lại</span>
            </button>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {benhNhan.ho_ten?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">{benhNhan.ho_ten}</h1>
                <p className="text-gray-600 text-sm mt-1">Mã BN: {benhNhan.id}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {phong ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#4A90E2] rounded-lg font-medium text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                    Phòng: {phong.khu}-{phong.phong}-{phong.giuong}
                  </span>
                  <button
                    onClick={handleOpenPhongModal}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                    <span>Đổi phòng</span>
                  </button>
                  <button
                    onClick={handleXoaPhong}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                    <span>Xóa phòng</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenPhongModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Phân phòng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="border-b border-gray-200 w-full overflow-hidden bg-gray-50" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <nav 
              className="flex -mb-px overflow-x-auto scroll-smooth" 
              style={{ 
                scrollbarWidth: 'thin', 
                WebkitOverflowScrolling: 'touch',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                      : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.length > 6 ? tab.label.substring(0, 6) + '...' : tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

        <div className="p-6 lg:p-8">
          {/* Tab: Thông tin */}
          {activeTab === 'thong-tin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin cá nhân</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Họ tên</dt>
                    <dd className="text-gray-900 font-semibold">{benhNhan.ho_ten}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Ngày sinh</dt>
                    <dd className="text-gray-900">
                      {benhNhan.ngay_sinh ? new Date(benhNhan.ngay_sinh).toLocaleDateString('vi-VN') : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Giới tính</dt>
                    <dd className="text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                        {benhNhan.gioi_tinh}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">CCCD</dt>
                    <dd className="text-gray-900">{benhNhan.cccd || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Địa chỉ</dt>
                    <dd className="text-gray-900">{benhNhan.dia_chi || '-'}</dd>
                  </div>
                </dl>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin y tế</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Nhóm máu</dt>
                    <dd className="text-gray-900">{benhNhan.nhom_mau || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">BHYT</dt>
                    <dd className="text-gray-900">{benhNhan.bhyt || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Khả năng sinh hoạt</dt>
                    <dd className="text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {benhNhan.kha_nang_sinh_hoat?.replace('_', ' ')}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Ngày nhập viện</dt>
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Chỉ số sinh tồn</h3>
                <button
                  onClick={() => {
                    resetChiSoForm();
                    setShowChiSoModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm chỉ số</span>
                </button>
              </div>
              {chiSoSinhTon.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>monitor_heart</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu chỉ số sinh tồn</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm chỉ số" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Huyết áp</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhịp tim</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SpO2</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhiệt độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhịp thở</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {chiSoSinhTon.map((cs) => (
                          <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(cs.thoi_gian).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {cs.huyet_ap_tam_thu}/{cs.huyet_ap_tam_truong} mmHg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cs.nhip_tim} bpm</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cs.spo2}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cs.nhiet_do}°C</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cs.nhip_tho || '-'} lần/phút</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{cs.ghi_chu || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Đơn thuốc */}
          {activeTab === 'thuoc' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Đơn thuốc</h3>
                <button
                  onClick={() => {
                    resetThuocForm();
                    setShowThuocModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm đơn thuốc</span>
                </button>
              </div>
              {donThuocs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medication</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có đơn thuốc</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm đơn thuốc" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donThuocs.map((don) => (
                    <div key={don.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">Ngày kê: {new Date(don.ngay_ke).toLocaleDateString('vi-VN')}</p>
                          {don.mo_ta && <p className="text-sm text-gray-600 mt-1">{don.mo_ta}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteDonThuoc(don.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                      {don.thuoc && don.thuoc.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {don.thuoc.map((thuoc, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                              <span className="font-semibold text-gray-900">{thuoc.ten_thuoc}</span> - <span className="text-gray-700">{thuoc.lieu_luong}</span> - <span className="text-gray-700">{thuoc.thoi_diem_uong}</span>
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Thực đơn</h3>
                <button
                  onClick={() => {
                    resetThucDonForm();
                    setShowThucDonModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm thực đơn</span>
                </button>
              </div>
              {thucDons.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>restaurant</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có thực đơn</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm thực đơn" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {thucDons.map((td) => (
                    <div key={td.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            Ngày: {new Date(td.ngay).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Tổng calo: <span className="font-semibold text-[#4A90E2]">{td.tong_calo || 0} kcal</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteThucDon(td.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Bữa sáng</p>
                          <p className="text-sm text-gray-900">{td.bua_sang || '-'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Bữa trưa</p>
                          <p className="text-sm text-gray-900">{td.bua_trua || '-'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Bữa tối</p>
                          <p className="text-sm text-gray-900">{td.bua_toi || '-'}</p>
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
                <h3 className="text-xl font-bold text-gray-800">Công việc chăm sóc</h3>
                <button
                  onClick={() => {
                    resetCongViecForm();
                    setShowCongViecModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm công việc
                </button>
              </div>
              {congViecs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>task</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có công việc</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm công việc" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {congViecs.map((cv) => (
                    <div key={cv.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{cv.ten_cong_viec}</p>
                          {cv.mo_ta && <p className="text-sm text-gray-600 mt-2">{cv.mo_ta}</p>}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person</span>
                              Điều dưỡng: {cv.ten_dieu_duong || '-'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                              {cv.thoi_gian_du_kien ? new Date(cv.thoi_gian_du_kien).toLocaleString('vi-VN') : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={cv.trang_thai || 'chua_lam'}
                            onChange={(e) => {
                              const phanCongId = cv.id;
                              alert('Chức năng cập nhật trạng thái sẽ được cải thiện');
                            }}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50"
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

          {/* Tab: Phòng */}
          {activeTab === 'phong' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Lịch sử phòng</h3>
                <button
                  onClick={handleOpenPhongModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Phân phòng mới
                </button>
              </div>
              {allPhongs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có phòng nào được phân bổ</p>
                  <p className="text-gray-400 text-sm">Bấm "Phân phòng mới" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Khu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên phòng</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số phòng</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày bắt đầu ở</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kết thúc ở</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPhongs.map((p) => {
                        // Xác định phòng đang ở: không có ngày kết thúc hoặc ngày kết thúc > hôm nay (không bao gồm hôm nay)
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const ngayKetThuc = p.ngay_ket_thuc_o ? new Date(p.ngay_ket_thuc_o) : null;
                        if (ngayKetThuc) {
                          ngayKetThuc.setHours(0, 0, 0, 0);
                        }
                        // Chỉ coi là "đang ở" nếu không có ngày kết thúc hoặc ngày kết thúc > hôm nay
                        const isCurrent = !p.ngay_ket_thuc_o || (ngayKetThuc && ngayKetThuc > today);
                        
                        return (
                          <tr key={p.id} className={isCurrent ? 'bg-[#4A90E2]/5' : 'hover:bg-gray-50 transition-colors'}>
                            <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {p.khu || p.ten_khu_phan_khu || '-'}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {p.ten_phong || p.phong || '-'}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {p.so_phong || p.so_phong_thuc_te || '-'}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {p.ngay_bat_dau_o ? new Date(p.ngay_bat_dau_o).toLocaleDateString('vi-VN') : '-'}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {p.ngay_ket_thuc_o ? new Date(p.ngay_ket_thuc_o).toLocaleDateString('vi-VN') : (
                                <span className="text-green-600 font-semibold">Đang ở</span>
                              )}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                isCurrent 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isCurrent ? 'Đang ở' : 'Đã kết thúc'}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              {isCurrent && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleOpenPhongModal}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                                  >
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                                    <span>Đổi</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!confirm('Bạn có chắc muốn kết thúc phòng này?')) return;
                                      try {
                                        await phongAPI.update(p.id, { 
                                          ngay_ket_thuc_o: new Date().toISOString().split('T')[0] 
                                        });
                                        alert('Kết thúc phòng thành công');
                                        loadPhong();
                                        loadAllPhongs();
                                      } catch (error) {
                                        alert('Lỗi: ' + error.message);
                                      }
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold"
                                  >
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                                    <span>Kết thúc</span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Người thân */}
          {activeTab === 'nguoi-than' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Người thân</h3>
                <button
                  onClick={() => {
                    resetNguoiThanForm();
                    setShowNguoiThanModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm người thân
                </button>
              </div>
              {nguoiThans.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có người thân</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm người thân" để bắt đầu</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nguoiThans.map((nt) => (
                    <div key={nt.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {nt.ho_ten?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{nt.ho_ten}</p>
                              {nt.la_nguoi_lien_he_chinh && (
                                <span className="text-xs bg-[#4A90E2]/20 text-[#4A90E2] px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                                  Liên hệ chính
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNguoiThan(nt)}
                            className="flex items-center gap-1 px-2 py-1 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNguoiThan(nt.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Quan hệ:</span> {nt.moi_quan_he || '-'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">SĐT:</span> {nt.so_dien_thoai || '-'}
                        </p>
                        {nt.email && (
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {nt.email}
                          </p>
                        )}
                      </div>
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
                <h3 className="text-xl font-bold text-gray-800">Dịch vụ</h3>
                <button
                  onClick={() => {
                    resetDichVuForm();
                    setShowDichVuModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm dịch vụ
                </button>
              </div>
              {benhNhanDichVus.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medical_services</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dịch vụ nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm dịch vụ" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dịch vụ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày bắt đầu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kết thúc</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Hình thức</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {benhNhanDichVus.map((dv) => (
                        <tr key={dv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{dv.ten_dich_vu}</div>
                            {dv.mo_ta_ngan && (
                              <div className="text-xs text-gray-500 mt-1">{dv.mo_ta_ngan}</div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {dv.ngay_bat_dau ? new Date(dv.ngay_bat_dau).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {dv.ngay_ket_thuc ? new Date(dv.ngay_ket_thuc).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                              {dv.hinh_thuc_thanh_toan?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              dv.trang_thai === 'dang_su_dung' ? 'bg-green-100 text-green-800' :
                              dv.trang_thai === 'tam_dung' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dv.trang_thai === 'dang_su_dung' ? 'Đang sử dụng' :
                               dv.trang_thai === 'tam_dung' ? 'Tạm dừng' : 'Kết thúc'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex gap-2 flex-wrap">
                              {dv.trang_thai === 'dang_su_dung' && (
                                <button
                                  onClick={() => handleDoiDichVu(dv)}
                                  className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-semibold"
                                  title="Đổi dịch vụ"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                                  <span>Đổi</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDichVu(dv.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                                title="Xóa"
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
                </div>
              )}
            </div>
          )}

          {/* Tab: Vật dụng */}
          {activeTab === 'do-dung' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Vật dụng cá nhân</h3>
                <button
                  onClick={() => {
                    resetDoDungForm();
                    setShowDoDungModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm vật dụng
                </button>
              </div>
              {doDungs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>inventory_2</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có vật dụng</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm vật dụng" để bắt đầu</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doDungs.map((dd) => (
                    <div key={dd.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{dd.ten_vat_dung}</p>
                          <p className="text-sm text-gray-600 mt-1">Số lượng: <span className="font-semibold">{dd.so_luong}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDoDung(dd)}
                            className="flex items-center gap-1 px-2 py-1 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDoDung(dd.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Tình trạng:</p>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          dd.tinh_trang === 'tot' ? 'bg-green-100 text-green-800' :
                          dd.tinh_trang === 'hu_hong' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dd.tinh_trang === 'tot' ? 'Tốt' : dd.tinh_trang === 'hu_hong' ? 'Hư hỏng' : 'Mất'}
                        </span>
                      </div>
                      {dd.ghi_chu && <p className="text-sm text-gray-600 mt-3">{dd.ghi_chu}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Ho so y te */}
          {activeTab === 'ho-so-y-te' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Hồ sơ y tế</h3>
                <button
                  onClick={() => {
                    if (hoSoYTe) {
                      setHoSoYTeForm({
                        id_loai_benh_ly: hoSoYTe.id_loai_benh_ly || '',
                        tien_su_benh: hoSoYTe.tien_su_benh || '',
                        di_ung_thuoc: hoSoYTe.di_ung_thuoc || '',
                        lich_su_phau_thuat: hoSoYTe.lich_su_phau_thuat || '',
                        benh_ly_hien_tai: hoSoYTe.benh_ly_hien_tai || '',
                        ghi_chu_dac_biet: hoSoYTe.ghi_chu_dac_biet || '',
                      });
                    }
                    setShowHoSoYTeModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {hoSoYTe ? 'Sửa hồ sơ y tế' : '+ Tạo hồ sơ y tế'}
                </button>
              </div>
              {hoSoYTe ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại bệnh lý</label>
                      <p className="text-gray-900">{hoSoYTe.ten_loai_benh_ly || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.tien_su_benh || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng thuốc</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.di_ung_thuoc || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lịch sử phẫu thuật</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.lich_su_phau_thuat || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh lý hiện tại</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.benh_ly_hien_tai || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.ghi_chu_dac_biet || '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>folder</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có hồ sơ y tế</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo hồ sơ y tế" để bắt đầu</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Benh hien tai */}
          {activeTab === 'benh-hien-tai' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Bệnh hiện tại</h3>
                <button
                  onClick={() => {
                    resetBenhHienTaiForm();
                    setShowBenhHienTaiModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm bệnh hiện tại
                </button>
              </div>
              {benhHienTai.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medical_services</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có bệnh hiện tại</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm bệnh hiện tại" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {benhHienTai.map((bh) => (
                    <div key={bh.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{bh.ten_benh || 'Chưa có tên bệnh'}</p>
                          <p className="text-sm text-gray-600">
                            Ngày phát hiện: {bh.ngay_phat_hien ? new Date(bh.ngay_phat_hien).toLocaleDateString('vi-VN') : '-'}
                          </p>
                          <p className="text-sm">
                            Tình trạng: 
                            <span className={`ml-1 px-2 py-1 text-xs rounded ${
                              bh.tinh_trang === 'dang_dieu_tri' ? 'bg-yellow-100 text-yellow-800' :
                              bh.tinh_trang === 'on_dinh' ? 'bg-green-100 text-green-800' :
                              bh.tinh_trang === 'khoi' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {bh.tinh_trang === 'dang_dieu_tri' ? 'Đang điều trị' :
                               bh.tinh_trang === 'on_dinh' ? 'Ổn định' :
                               bh.tinh_trang === 'khoi' ? 'Khỏi' : 'Tái phát'}
                            </span>
                          </p>
                          {bh.ghi_chu && <p className="text-sm text-gray-600 mt-2">{bh.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBenhHienTai(bh)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteBenhHienTai(bh.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
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

          {/* Tab: Tam ly giao tiep */}
          {activeTab === 'tam-ly' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tâm lý giao tiếp</h3>
                <button
                  onClick={() => {
                    resetTamLyGiaoTiepForm();
                    setShowTamLyGiaoTiepModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm ghi chú tâm lý
                </button>
              </div>
              {tamLyGiaoTiep.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>psychology</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có ghi chú tâm lý</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm ghi chú tâm lý" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tamLyGiaoTiep.map((tlg) => (
                    <div key={tlg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            Thời gian: {tlg.thoi_gian ? new Date(tlg.thoi_gian).toLocaleString('vi-VN') : '-'}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Trạng thái tinh thần: </span>
                              <span className="capitalize">{tlg.trang_thai_tinh_than?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Mức độ tương tác: </span>
                              <span className="capitalize">{tlg.muc_do_tuong_tac?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Nhận thức người thân: </span>
                              <span>{tlg.nhan_thuc_nguoi_than ? 'Có' : 'Không'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Nhận thức điều dưỡng: </span>
                              <span>{tlg.nhan_thuc_dieu_duong ? 'Có' : 'Không'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Biết thời gian: </span>
                              <span>{tlg.biet_thoi_gian ? 'Có' : 'Không'}</span>
                            </div>
                          </div>
                          {tlg.ghi_chu && <p className="text-sm text-gray-600 mt-2">{tlg.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTamLyGiaoTiep(tlg)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteTamLyGiaoTiep(tlg.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
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

          {/* Tab: Van dong phuc hoi */}
          {activeTab === 'van-dong' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Vận động phục hồi</h3>
                <button
                  onClick={() => {
                    resetVanDongPhucHoiForm();
                    setShowVanDongPhucHoiModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  + Thêm vận động phục hồi
                </button>
              </div>
              {vanDongPhucHoi.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>fitness_center</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có vận động phục hồi</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm vận động phục hồi" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vanDongPhucHoi.map((vdph) => (
                    <div key={vdph.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{vdph.loai_bai_tap || 'Chưa có tên bài tập'}</p>
                          <p className="text-sm text-gray-600">
                            Thời gian: {vdph.thoi_gian_bat_dau ? new Date(vdph.thoi_gian_bat_dau).toLocaleString('vi-VN') : '-'}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                            <div>
                              <span className="font-medium">Khả năng vận động: </span>
                              <span className="capitalize">{vdph.kha_nang_van_dong?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Cường độ: </span>
                              <span className="capitalize">{vdph.cuong_do || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Thời lượng: </span>
                              <span>{vdph.thoi_luong_phut ? `${vdph.thoi_luong_phut} phút` : '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Calo tiêu hao: </span>
                              <span>{vdph.calo_tieu_hao || '-'}</span>
                            </div>
                          </div>
                          {vdph.ghi_chu && <p className="text-sm text-gray-600 mt-2">{vdph.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVanDongPhucHoi(vdph)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteVanDongPhucHoi(vdph.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
                  onChange={(e) => setDichVuForm({ ...dichVuForm, id_dich_vu: e.target.value })}
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
                  onChange={(e) => setDichVuForm({ ...dichVuForm, hinh_thuc_thanh_toan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thang">Theo tháng</option>
                    <option value="quy">Theo quý</option>
                    <option value="nam">Theo năm</option>
                  </select>
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingDichVu ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ho so y te */}
      {showHoSoYTeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {hoSoYTe ? 'Sửa hồ sơ y tế' : 'Tạo hồ sơ y tế'}
            </h2>
            <form onSubmit={handleHoSoYTeSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Loại bệnh lý (tùy chọn)</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateLoaiBenhLy(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Tạo mới
                  </button>
                </div>
                <select
                  value={hoSoYTeForm.id_loai_benh_ly}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, id_loai_benh_ly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn loại bệnh lý (tùy chọn)</option>
                  {loaiBenhLys.map((lb) => (
                    <option key={lb.id} value={lb.id}>{lb.ten_loai_benh_ly}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Để trống nếu không có loại bệnh lý cụ thể</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                <textarea
                  value={hoSoYTeForm.tien_su_benh}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, tien_su_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập tiền sử bệnh..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng thuốc</label>
                <textarea
                  value={hoSoYTeForm.di_ung_thuoc}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, di_ung_thuoc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập các loại thuốc dị ứng..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lịch sử phẫu thuật</label>
                <textarea
                  value={hoSoYTeForm.lich_su_phau_thuat}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, lich_su_phau_thuat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập lịch sử phẫu thuật..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh lý hiện tại</label>
                <textarea
                  value={hoSoYTeForm.benh_ly_hien_tai}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, benh_ly_hien_tai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập bệnh lý hiện tại..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
                <textarea
                  value={hoSoYTeForm.ghi_chu_dac_biet}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, ghi_chu_dac_biet: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú đặc biệt..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowHoSoYTeModal(false);
                    resetHoSoYTeForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {hoSoYTe ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Benh hien tai */}
      {showBenhHienTaiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBenhHienTai ? 'Sửa bệnh hiện tại' : 'Thêm bệnh hiện tại'}
            </h2>
            <form onSubmit={handleBenhHienTaiSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Thông tin bệnh *</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateThongTinBenh(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Tạo mới
                  </button>
                </div>
                <select
                  required
                  value={benhHienTaiForm.id_thong_tin_benh}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, id_thong_tin_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn thông tin bệnh *</option>
                  {thongTinBenhs.map((tb) => (
                    <option key={tb.id} value={tb.id}>{tb.ten_benh}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Chọn bệnh từ danh sách hoặc tạo mới</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày phát hiện</label>
                <input
                  type="date"
                  value={benhHienTaiForm.ngay_phat_hien}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, ngay_phat_hien: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                <select
                  value={benhHienTaiForm.tinh_trang}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, tinh_trang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="dang_dieu_tri">Đang điều trị</option>
                  <option value="on_dinh">Ổn định</option>
                  <option value="khoi">Khỏi</option>
                  <option value="tai_phat">Tái phát</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={benhHienTaiForm.ghi_chu}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBenhHienTaiModal(false);
                    resetBenhHienTaiForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingBenhHienTai ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tam ly giao tiep */}
      {showTamLyGiaoTiepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingTamLyGiaoTiep ? 'Sửa tâm lý giao tiếp' : 'Thêm tâm lý giao tiếp'}
            </h2>
            <form onSubmit={handleTamLyGiaoTiepSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                <input
                  type="datetime-local"
                  value={tamLyGiaoTiepForm.thoi_gian ? new Date(tamLyGiaoTiepForm.thoi_gian).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, thoi_gian: new Date(e.target.value).toISOString() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái tinh thần</label>
                <select
                  value={tamLyGiaoTiepForm.trang_thai_tinh_than}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, trang_thai_tinh_than: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="vui_ve">Vui vẻ</option>
                  <option value="binh_thuong">Bình thường</option>
                  <option value="buon_ba">Buồn bã</option>
                  <option value="lo_lang">Lo lắng</option>
                  <option value="cau_gat">Cáu gắt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ tương tác</label>
                <select
                  value={tamLyGiaoTiepForm.muc_do_tuong_tac}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, muc_do_tuong_tac: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="chu_dong">Chủ động</option>
                  <option value="phan_hoi">Phản hồi</option>
                  <option value="it_phan_hoi">Ít phản hồi</option>
                  <option value="khong_giao_tiep">Không giao tiếp</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.nhan_thuc_nguoi_than}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, nhan_thuc_nguoi_than: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Nhận thức người thân</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.nhan_thuc_dieu_duong}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, nhan_thuc_dieu_duong: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Nhận thức điều dưỡng</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.biet_thoi_gian}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, biet_thoi_gian: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Biết thời gian</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={tamLyGiaoTiepForm.ghi_chu}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTamLyGiaoTiepModal(false);
                    resetTamLyGiaoTiepForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingTamLyGiaoTiep ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Van dong phuc hoi */}
      {showVanDongPhucHoiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingVanDongPhucHoi ? 'Sửa vận động phục hồi' : 'Thêm vận động phục hồi'}
            </h2>
            <form onSubmit={handleVanDongPhucHoiSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài tập</label>
                <input
                  type="text"
                  value={vanDongPhucHoiForm.loai_bai_tap}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, loai_bai_tap: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Đi bộ, Tập tay, Tập chân..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khả năng vận động</label>
                  <select
                    value={vanDongPhucHoiForm.kha_nang_van_dong}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, kha_nang_van_dong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="doc_lap">Độc lập</option>
                    <option value="tro_giup">Trợ giúp</option>
                    <option value="nam_lien">Nằm liệt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cường độ</label>
                  <select
                    value={vanDongPhucHoiForm.cuong_do}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, cuong_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="nhe">Nhẹ</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="manh">Mạnh</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={vanDongPhucHoiForm.thoi_gian_bat_dau ? new Date(vanDongPhucHoiForm.thoi_gian_bat_dau).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, thoi_gian_bat_dau: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="0"
                    value={vanDongPhucHoiForm.thoi_luong_phut}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, thoi_luong_phut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calo tiêu hao</label>
                <input
                  type="number"
                  min="0"
                  value={vanDongPhucHoiForm.calo_tieu_hao}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, calo_tieu_hao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={vanDongPhucHoiForm.ghi_chu}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVanDongPhucHoiModal(false);
                    resetVanDongPhucHoiForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingVanDongPhucHoi ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tạo mới loại bệnh lý */}
      {showCreateLoaiBenhLy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo mới loại bệnh lý</h2>
            <form onSubmit={handleCreateLoaiBenhLy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại bệnh lý *</label>
                <input
                  type="text"
                  required
                  value={newLoaiBenhLy.ten_loai_benh_ly}
                  onChange={(e) => setNewLoaiBenhLy({ ...newLoaiBenhLy, ten_loai_benh_ly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Tim mạch, Hô hấp, Tiêu hóa..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newLoaiBenhLy.mo_ta}
                  onChange={(e) => setNewLoaiBenhLy({ ...newLoaiBenhLy, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Mô tả về loại bệnh lý..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateLoaiBenhLy(false);
                    setNewLoaiBenhLy({ ten_loai_benh_ly: '', mo_ta: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tạo mới thông tin bệnh */}
      {showCreateThongTinBenh && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo mới thông tin bệnh</h2>
            <form onSubmit={handleCreateThongTinBenh} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bệnh *</label>
                <input
                  type="text"
                  required
                  value={newThongTinBenh.ten_benh}
                  onChange={(e) => setNewThongTinBenh({ ...newThongTinBenh, ten_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Cao huyết áp, Tiểu đường, Viêm phổi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newThongTinBenh.mo_ta}
                  onChange={(e) => setNewThongTinBenh({ ...newThongTinBenh, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Mô tả về bệnh..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateThongTinBenh(false);
                    setNewThongTinBenh({ ten_benh: '', mo_ta: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
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
