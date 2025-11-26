const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.180:3000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => apiCall('/auth/profile'),
  updateProfile: (data) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  changePassword: (data) => apiCall('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Bệnh nhân APIs
export const benhNhanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan?${queryString}`);
  },
  getById: (id) => apiCall(`/benh-nhan/${id}`),
  create: (data) => apiCall('/benh-nhan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/benh-nhan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/benh-nhan/${id}`, {
    method: 'DELETE',
  }),
  getChiSoSinhTon: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/chi-so-sinh-ton?${queryString}`);
  },
  createChiSoSinhTon: (id, data) => apiCall(`/benh-nhan/${id}/chi-so-sinh-ton`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateChiSoSinhTon: (id, chiSoId, data) => apiCall(`/benh-nhan/${id}/chi-so-sinh-ton/${chiSoId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteChiSoSinhTon: (id, chiSoId) => apiCall(`/benh-nhan/${id}/chi-so-sinh-ton/${chiSoId}`, {
    method: 'DELETE',
  }),
  // Hoạt động sinh hoạt
  getHoatDongSinhHoat: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat?${queryString}`);
  },
  createHoatDongSinhHoat: (id, data) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHoatDongSinhHoat: (id, hoatDongId, data) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat/${hoatDongId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHoatDongSinhHoat: (id, hoatDongId) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat/${hoatDongId}`, {
    method: 'DELETE',
  }),
  // Tâm lý giao tiếp
  getTamLyGiaoTiep: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/tam-ly-giao-tiep?${queryString}`);
  },
  createTamLyGiaoTiep: (id, data) => apiCall(`/benh-nhan/${id}/tam-ly-giao-tiep`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTamLyGiaoTiep: (tamLyId, data) => apiCall(`/benh-nhan/tam-ly-giao-tiep/${tamLyId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTamLyGiaoTiep: (tamLyId) => apiCall(`/benh-nhan/tam-ly-giao-tiep/${tamLyId}`, {
    method: 'DELETE',
  }),
  // Vận động phục hồi
  getVanDongPhucHoi: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/van-dong-phuc-hoi?${queryString}`);
  },
  createVanDongPhucHoi: (id, data) => apiCall(`/benh-nhan/${id}/van-dong-phuc-hoi`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateVanDongPhucHoi: (vanDongId, data) => apiCall(`/benh-nhan/van-dong-phuc-hoi/${vanDongId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteVanDongPhucHoi: (vanDongId) => apiCall(`/benh-nhan/van-dong-phuc-hoi/${vanDongId}`, {
    method: 'DELETE',
  }),
  // Bệnh hiện tại
  getBenhHienTai: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/benh-hien-tai?${queryString}`);
  },
  createBenhHienTai: (id, data) => apiCall(`/benh-nhan/${id}/benh-hien-tai`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateBenhHienTai: (benhId, data) => apiCall(`/benh-nhan/benh-hien-tai/${benhId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteBenhHienTai: (benhId) => apiCall(`/benh-nhan/benh-hien-tai/${benhId}`, {
    method: 'DELETE',
  }),
  // Hồ sơ y tế
  getHoSoYTe: (id) => apiCall(`/benh-nhan/${id}/ho-so-y-te`),
  createOrUpdateHoSoYTe: (id, data) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHoSoYTe: (id, data) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHoSoYTe: (id) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'DELETE',
  }),
};

// Nhân viên APIs
export const nhanVienAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nhan-vien?${queryString}`);
  },
  getById: (id) => apiCall(`/nhan-vien/${id}`),
  create: (data) => apiCall('/nhan-vien', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/nhan-vien/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getLichPhanCa: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nhan-vien/lich-phan-ca/all?${queryString}`);
  },
  createLichPhanCa: (data) => apiCall('/nhan-vien/lich-phan-ca', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLichPhanCa: (id, data) => apiCall(`/nhan-vien/lich-phan-ca/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLichPhanCa: (id) => apiCall(`/nhan-vien/lich-phan-ca/${id}`, {
    method: 'DELETE',
  }),
  chuyenCa: (id, data) => apiCall(`/nhan-vien/lich-phan-ca/${id}/chuyen-ca`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createKPI: (data) => apiCall('/nhan-vien/kpi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Lịch khám APIs
export const lichKhamAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/lich-kham?${queryString}`);
  },
  getById: (id) => apiCall(`/lich-kham/${id}`),
  create: (data) => apiCall('/lich-kham', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/lich-kham/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/lich-kham/${id}`, {
    method: 'DELETE',
  }),
  getAllLichHenTuVan: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/lich-kham/tu-van/all?${queryString}`);
  },
  updateLichHenTuVan: (id, data) => apiCall(`/lich-kham/tu-van/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Dịch vụ APIs
// Bệnh nhân - Dịch vụ APIs
export const benhNhanDichVuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan-dich-vu?${queryString}`);
  },
  getById: (id) => apiCall(`/benh-nhan-dich-vu/${id}`),
  create: (data) => apiCall('/benh-nhan-dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/benh-nhan-dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/benh-nhan-dich-vu/${id}`, {
    method: 'DELETE',
  }),
  thanhToan: (id, data) => apiCall(`/benh-nhan-dich-vu/${id}/thanh-toan`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const dichVuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dich-vu?${queryString}`);
  },
  getById: (id) => apiCall(`/dich-vu/${id}`),
  create: (data) => apiCall('/dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/dich-vu/${id}`, {
    method: 'DELETE',
  }),
};

// Sự kiện APIs
export const suKienAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/su-kien?${queryString}`);
  },
  getById: (id) => apiCall(`/su-kien/${id}`),
  create: (data) => apiCall('/su-kien', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/su-kien/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/su-kien/${id}`, {
    method: 'DELETE',
  }),
  // Người tham gia
  getNguoiThamGia: (id) => apiCall(`/su-kien/${id}/nguoi-tham-gia`),
  addNguoiThamGia: (id, data) => apiCall(`/su-kien/${id}/nguoi-tham-gia`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  removeNguoiThamGia: (id, participantId) => apiCall(`/su-kien/${id}/nguoi-tham-gia/${participantId}`, {
    method: 'DELETE',
  }),
  xacNhanThamGia: (id, participantId, xacNhan) => apiCall(`/su-kien/${id}/nguoi-tham-gia/${participantId}/xac-nhan`, {
    method: 'PUT',
    body: JSON.stringify({ xac_nhan: xacNhan }),
  }),
  // Phân công
  getPhanCong: (id) => apiCall(`/su-kien/${id}/phan-cong`),
  phanCongNhanVien: (id, data) => apiCall(`/su-kien/${id}/phan-cong`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePhanCong: (id, assignmentId, data) => apiCall(`/su-kien/${id}/phan-cong/${assignmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  removePhanCong: (id, assignmentId) => apiCall(`/su-kien/${id}/phan-cong/${assignmentId}`, {
    method: 'DELETE',
  }),
};

// Bài viết APIs
export const baiVietAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet?${queryString}`);
  },
  getById: (id) => apiCall(`/bai-viet/${id}`),
  create: (data) => apiCall('/bai-viet', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/bai-viet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/bai-viet/${id}`, {
    method: 'DELETE',
  }),
  // Media APIs
  getMedia: (id) => apiCall(`/bai-viet/${id}/media`),
  addMedia: (id, data) => apiCall(`/bai-viet/${id}/media`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMedia: (id, mediaId, data) => apiCall(`/bai-viet/${id}/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMedia: (id, mediaId) => apiCall(`/bai-viet/${id}/media/${mediaId}`, {
    method: 'DELETE',
  }),
};

// Upload APIs
export const uploadAPI = {
  uploadMedia: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi upload file');
    }

    return data;
  },
  uploadMultipleMedia: async (files) => {
    const token = getToken();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/media/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi upload files');
    }

    return data;
  },
};

// Tuyển dụng APIs
export const tuyenDungAPI = {
  getAllTinTuyenDung: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tuyen-dung/tin-tuyen-dung?${queryString}`);
  },
  getTinTuyenDungById: (id) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`),
  createTinTuyenDung: (data) => apiCall('/tuyen-dung/tin-tuyen-dung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTinTuyenDung: (id, data) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTinTuyenDung: (id) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`, {
    method: 'DELETE',
  }),
  getAllHoSoUngTuyen: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tuyen-dung/ho-so-ung-tuyen?${queryString}`);
  },
  updateHoSoUngTuyen: (id, data) => apiCall(`/tuyen-dung/ho-so-ung-tuyen/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => apiCall('/dashboard'),
  getBaoCao: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dashboard/bao-cao?${queryString}`);
  },
};

// Thuốc APIs
export const thuocAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/thuoc?${queryString}`);
  },
  create: (data) => apiCall('/thuoc', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/thuoc/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/thuoc/${id}`, {
    method: 'DELETE',
  }),
};

// Phòng APIs (phong_o_benh_nhan - phân phòng cho bệnh nhân)
export const phongAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phong?${queryString}`);
  },
  getByBenhNhan: (id) => apiCall(`/phong/benh-nhan/${id}`),
  create: (data) => apiCall('/phong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phong/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phong/${id}`, {
    method: 'DELETE',
  }),
  deleteByBenhNhan: (idBenhNhan) => apiCall(`/phong/benh-nhan/${idBenhNhan}`, {
    method: 'DELETE',
  }),
};

// Phân khu APIs
export const phanKhuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phan-khu?${queryString}`);
  },
  getById: (id) => apiCall(`/phan-khu/${id}`),
  create: (data) => apiCall('/phan-khu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phan-khu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phan-khu/${id}`, {
    method: 'DELETE',
  }),
};

// Phòng mới APIs (quản lý phòng với 3 ảnh)
export const phongNewAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phong-moi?${queryString}`);
  },
  getById: (id) => apiCall(`/phong-moi/${id}`),
  create: (data) => apiCall('/phong-moi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phong-moi/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phong-moi/${id}`, {
    method: 'DELETE',
  }),
};

// Người thân APIs
export const nguoiThanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nguoi-than?${queryString}`);
  },
  getById: (id) => apiCall(`/nguoi-than/${id}`),
  create: (data) => apiCall('/nguoi-than', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/nguoi-than/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/nguoi-than/${id}`, {
    method: 'DELETE',
  }),
};

// Vật dụng APIs
export const doDungAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/do-dung?${queryString}`);
  },
  getById: (id) => apiCall(`/do-dung/${id}`),
  create: (data) => apiCall('/do-dung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/do-dung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/do-dung/${id}`, {
    method: 'DELETE',
  }),
};

// Dinh dưỡng APIs
export const dinhDuongAPI = {
  getThucDon: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dinh-duong/thuc-don?${queryString}`);
  },
  createThucDon: (data) => apiCall('/dinh-duong/thuc-don', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateThucDon: (id, data) => apiCall(`/dinh-duong/thuc-don/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteThucDon: (id) => apiCall(`/dinh-duong/thuc-don/${id}`, {
    method: 'DELETE',
  }),
  getDinhDuongHangNgay: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dinh-duong/hang-ngay?${queryString}`);
  },
  createDinhDuongHangNgay: (data) => apiCall('/dinh-duong/hang-ngay', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDinhDuongHangNgay: (id, data) => apiCall(`/dinh-duong/hang-ngay/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDinhDuongHangNgay: (id) => apiCall(`/dinh-duong/hang-ngay/${id}`, {
    method: 'DELETE',
  }),
};

// Công việc APIs
export const congViecAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/cong-viec?${queryString}`);
  },
  create: (data) => apiCall('/cong-viec', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/cong-viec/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/cong-viec/${id}`, {
    method: 'DELETE',
  }),
  phanCong: (data) => apiCall('/cong-viec/phan-cong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTrangThai: (id, data) => apiCall(`/cong-viec/${id}/trang-thai`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Loại bệnh lý APIs
export const loaiBenhLyAPI = {
  getAll: () => apiCall('/loai-benh-ly'),
  getById: (id) => apiCall(`/loai-benh-ly/${id}`),
  create: (data) => apiCall('/loai-benh-ly', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Thông tin bệnh APIs
export const thongTinBenhAPI = {
  getAll: () => apiCall('/thong-tin-benh'),
  getById: (id) => apiCall(`/thong-tin-benh/${id}`),
  create: (data) => apiCall('/thong-tin-benh', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

