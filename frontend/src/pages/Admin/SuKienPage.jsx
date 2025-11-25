import { useEffect, useState } from 'react';
import { suKienAPI, uploadAPI, benhNhanAPI, nhanVienAPI, nguoiThanAPI } from '../../services/api';

export default function SuKienPage() {
  const [suKiens, setSuKiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTab, setDetailTab] = useState('info'); // 'info', 'participants', 'assignments'
  const [editing, setEditing] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    ngay: '',
    dia_diem: '',
    ngan_sach: '',
    anh_dai_dien: '',
    video: '',
    trang_thai: 'sap_dien_ra',
  });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Quản lý người tham gia
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participantForm, setParticipantForm] = useState({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
  const [benhNhans, setBenhNhans] = useState([]);
  const [nguoiThans, setNguoiThans] = useState([]);
  
  // Quản lý phân công
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ id_nhan_vien: '', vai_tro: '' });
  const [nhanViens, setNhanViens] = useState([]);

  useEffect(() => {
    loadSuKiens();
  }, []);

  const loadSuKiens = async () => {
    try {
      setLoading(true);
      const response = await suKienAPI.getAll();
      setSuKiens(response.data || []);
    } catch (error) {
      console.error('Error loading su kiens:', error);
      alert('Lỗi khi tải danh sách sự kiện: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        // Ensure anh_dai_dien and video are sent (even if empty string, convert to null)
        anh_dai_dien: formData.anh_dai_dien || null,
        video: formData.video || null,
      };

      if (editing) {
        await suKienAPI.update(editing.id, submitData);
        alert('Cập nhật sự kiện thành công');
      } else {
        await suKienAPI.create(submitData);
        alert('Tạo sự kiện thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadSuKiens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (sk) => {
    try {
      // Load full event data
      const fullEvent = await suKienAPI.getById(sk.id);
      const eventData = fullEvent.data;
      
      setEditing(eventData);
      setFormData({
        tieu_de: eventData.tieu_de || '',
        mo_ta: eventData.mo_ta || '',
        ngay: eventData.ngay ? eventData.ngay.slice(0, 16) : '',
        dia_diem: eventData.dia_diem || '',
        ngan_sach: eventData.ngan_sach || '',
        anh_dai_dien: eventData.anh_dai_dien || '',
        video: eventData.video || '',
        trang_thai: eventData.trang_thai || 'sap_dien_ra',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error loading event:', error);
      alert('Lỗi khi tải dữ liệu sự kiện: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
    try {
      await suKienAPI.delete(id);
      alert('Xóa sự kiện thành công');
      loadSuKiens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      tieu_de: '',
      mo_ta: '',
      ngay: '',
      dia_diem: '',
      ngan_sach: '',
      anh_dai_dien: '',
      video: '',
      trang_thai: 'sap_dien_ra',
    });
  };

  // Xem chi tiết sự kiện
  const handleViewDetail = async (sk) => {
    try {
      const fullEvent = await suKienAPI.getById(sk.id);
      setCurrentEvent(fullEvent.data);
      setShowDetailModal(true);
      setDetailTab('info');
      await loadParticipants(sk.id);
      await loadAssignments(sk.id);
    } catch (error) {
      console.error('Error loading event detail:', error);
      alert('Lỗi khi tải chi tiết sự kiện: ' + error.message);
    }
  };

  // Load danh sách người tham gia
  const loadParticipants = async (eventId) => {
    try {
      setLoadingParticipants(true);
      const response = await suKienAPI.getNguoiThamGia(eventId);
      setParticipants(response.data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
      alert('Lỗi khi tải danh sách người tham gia: ' + error.message);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Load danh sách phân công
  const loadAssignments = async (eventId) => {
    try {
      setLoadingAssignments(true);
      const response = await suKienAPI.getPhanCong(eventId);
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      alert('Lỗi khi tải danh sách phân công: ' + error.message);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Load danh sách bệnh nhân và người thân
  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll({ limit: 1000 });
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const loadNguoiThans = async (benhNhanId) => {
    try {
      if (benhNhanId) {
        const response = await nguoiThanAPI.getAll({ id_benh_nhan: benhNhanId, limit: 1000 });
        setNguoiThans(response.data || []);
      } else {
        setNguoiThans([]);
      }
    } catch (error) {
      console.error('Error loading nguoi thans:', error);
    }
  };

  // Load danh sách nhân viên
  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll({ limit: 1000 });
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
    }
  };

  // Thêm người tham gia
  const handleAddParticipant = async () => {
    if (!currentEvent) return;
    
    try {
      const data = {
        id_benh_nhan: participantForm.loai === 'benh_nhan' ? participantForm.id_benh_nhan : null,
        id_nguoi_than: participantForm.loai === 'nguoi_than' ? participantForm.id_nguoi_than : null,
      };
      
      await suKienAPI.addNguoiThamGia(currentEvent.id, data);
      alert('Thêm người tham gia thành công');
      setShowAddParticipant(false);
      setParticipantForm({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xóa người tham gia
  const handleRemoveParticipant = async (participantId) => {
    if (!currentEvent) return;
    if (!confirm('Bạn có chắc muốn xóa người tham gia này?')) return;
    
    try {
      await suKienAPI.removeNguoiThamGia(currentEvent.id, participantId);
      alert('Xóa người tham gia thành công');
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xác nhận tham gia
  const handleXacNhanThamGia = async (participantId, xacNhan) => {
    if (!currentEvent) return;
    
    try {
      await suKienAPI.xacNhanThamGia(currentEvent.id, participantId, xacNhan);
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Thêm phân công
  const handleAddAssignment = async () => {
    if (!currentEvent) return;
    
    try {
      await suKienAPI.phanCongNhanVien(currentEvent.id, assignmentForm);
      alert('Phân công nhân viên thành công');
      setShowAddAssignment(false);
      setAssignmentForm({ id_nhan_vien: '', vai_tro: '' });
      await loadAssignments(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xóa phân công
  const handleRemoveAssignment = async (assignmentId) => {
    if (!currentEvent) return;
    if (!confirm('Bạn có chắc muốn xóa phân công này?')) return;
    
    try {
      await suKienAPI.removePhanCong(currentEvent.id, assignmentId);
      alert('Xóa phân công thành công');
      await loadAssignments(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Load data khi mở modal thêm người tham gia
  useEffect(() => {
    if (showAddParticipant) {
      loadBenhNhans();
    }
  }, [showAddParticipant]);

  useEffect(() => {
    if (participantForm.loai === 'nguoi_than' && participantForm.id_benh_nhan) {
      loadNguoiThans(participantForm.id_benh_nhan);
    } else {
      setNguoiThans([]);
    }
  }, [participantForm.loai, participantForm.id_benh_nhan]);

  useEffect(() => {
    if (showAddAssignment) {
      loadNhanViens();
    }
  }, [showAddAssignment]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Sự kiện</h1>
          <p className="text-gray-600 mt-1">Danh sách sự kiện và hoạt động</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo sự kiện
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa điểm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngân sách</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suKiens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                suKiens.map((sk) => (
                  <tr key={sk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{sk.tieu_de}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sk.ngay ? new Date(sk.ngay).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4">{sk.dia_diem || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sk.ngan_sach ? parseInt(sk.ngan_sach).toLocaleString('vi-VN') + ' đ' : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sk.trang_thai === 'ket_thuc' ? 'bg-gray-100 text-gray-800' :
                        sk.trang_thai === 'dang_dien_ra' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sk.trang_thai?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetail(sk)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleEdit(sk)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(sk.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa sự kiện' : 'Tạo sự kiện mới'}
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
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày giờ *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
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
                    <option value="sap_dien_ra">Sắp diễn ra</option>
                    <option value="dang_dien_ra">Đang diễn ra</option>
                    <option value="ket_thuc">Kết thúc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={formData.dia_diem}
                    onChange={(e) => setFormData({ ...formData, dia_diem: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngân sách (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.ngan_sach}
                    onChange={(e) => setFormData({ ...formData, ngan_sach: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              {/* Ảnh đại diện */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện
                </label>
                <div className="space-y-2">
                  {/* Upload ảnh */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
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
                          setUploadingThumbnail(true);
                          const response = await uploadAPI.uploadMedia(file);
                          setFormData({ ...formData, anh_dai_dien: response.data.url });
                          e.target.value = ''; // Reset input
                        } catch (error) {
                          alert('Lỗi khi upload ảnh: ' + error.message);
                        } finally {
                          setUploadingThumbnail(false);
                        }
                      }}
                      disabled={uploadingThumbnail}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {uploadingThumbnail && (
                      <p className="text-sm text-gray-500 mt-1">Đang tải ảnh lên...</p>
                    )}
                  </div>
                  
                  {/* Preview ảnh đại diện */}
                  {formData.anh_dai_dien && (
                    <div className="mt-2">
                      <img
                        src={formData.anh_dai_dien}
                        alt="Ảnh đại diện"
                        className="max-w-xs h-auto rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, anh_dai_dien: '' })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa ảnh đại diện
                      </button>
                    </div>
                  )}
                  
                  {/* Hoặc nhập URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc nhập URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.anh_dai_dien}
                    onChange={(e) => setFormData({ ...formData, anh_dai_dien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video
                </label>
                <div className="space-y-2">
                  {/* Upload video */}
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm'];
                        if (!videoTypes.includes(file.type)) {
                          alert('Chỉ cho phép upload file video (mp4, mov, avi, wmv, flv, webm)');
                          return;
                        }

                        if (file.size > 50 * 1024 * 1024) {
                          alert('Kích thước file không được vượt quá 50MB');
                          return;
                        }

                        try {
                          setUploadingVideo(true);
                          const response = await uploadAPI.uploadMedia(file);
                          setFormData({ ...formData, video: response.data.url });
                          e.target.value = ''; // Reset input
                        } catch (error) {
                          alert('Lỗi khi upload video: ' + error.message);
                        } finally {
                          setUploadingVideo(false);
                        }
                      }}
                      disabled={uploadingVideo}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {uploadingVideo && (
                      <p className="text-sm text-gray-500 mt-1">Đang tải video lên...</p>
                    )}
                  </div>
                  
                  {/* Preview video */}
                  {formData.video && (
                    <div className="mt-2">
                      <video
                        src={formData.video}
                        controls
                        className="max-w-xs h-auto rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video: '' })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa video
                      </button>
                    </div>
                  )}
                  
                  {/* Hoặc nhập URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc nhập URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/video.mp4"
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
                  {editing ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chi tiết sự kiện */}
      {showDetailModal && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{currentEvent.tieu_de}</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setCurrentEvent(null);
                  setDetailTab('info');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setDetailTab('info')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    detailTab === 'info'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Thông tin
                </button>
                <button
                  onClick={() => setDetailTab('participants')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    detailTab === 'participants'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Người tham gia ({participants.length})
                </button>
                <button
                  onClick={() => setDetailTab('assignments')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    detailTab === 'assignments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Phân công ({assignments.length})
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {detailTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <p className="mt-1 text-gray-900">{currentEvent.mo_ta || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày giờ</label>
                    <p className="mt-1 text-gray-900">
                      {currentEvent.ngay ? new Date(currentEvent.ngay).toLocaleString('vi-VN') : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                    <p className="mt-1 text-gray-900">{currentEvent.dia_diem || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngân sách</label>
                    <p className="mt-1 text-gray-900">
                      {currentEvent.ngan_sach ? parseInt(currentEvent.ngan_sach).toLocaleString('vi-VN') + ' đ' : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        currentEvent.trang_thai === 'ket_thuc' ? 'bg-gray-100 text-gray-800' :
                        currentEvent.trang_thai === 'dang_dien_ra' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {currentEvent.trang_thai?.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </div>
                {currentEvent.anh_dai_dien && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                    <img src={currentEvent.anh_dai_dien} alt="Ảnh đại diện" className="max-w-md rounded-lg" />
                  </div>
                )}
                {currentEvent.video && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
                    <video src={currentEvent.video} controls className="max-w-md rounded-lg" />
                  </div>
                )}
              </div>
            )}

            {detailTab === 'participants' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Danh sách người tham gia</h3>
                  <button
                    onClick={() => {
                      setShowAddParticipant(true);
                      loadBenhNhans();
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    + Thêm người tham gia
                  </button>
                </div>

                {loadingParticipants ? (
                  <p className="text-gray-500">Đang tải...</p>
                ) : participants.length === 0 ? (
                  <p className="text-gray-500">Chưa có người tham gia</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Xác nhận</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {participants.map((p) => (
                          <tr key={p.id}>
                            <td className="px-4 py-2">{p.ten_nguoi_tham_gia || '-'}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {p.loai === 'benh_nhan' ? 'Bệnh nhân' : 'Người thân'}
                              </span>
                            </td>
                            <td className="px-4 py-2">{p.so_dien_thoai || '-'}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleXacNhanThamGia(p.id, !p.xac_nhan)}
                                className={`px-2 py-1 text-xs rounded ${
                                  p.xac_nhan
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {p.xac_nhan ? 'Đã xác nhận' : 'Chưa xác nhận'}
                              </button>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleRemoveParticipant(p.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Danh sách phân công</h3>
                  <button
                    onClick={() => {
                      setShowAddAssignment(true);
                      loadNhanViens();
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    + Phân công nhân viên
                  </button>
                </div>

                {loadingAssignments ? (
                  <p className="text-gray-500">Đang tải...</p>
                ) : assignments.length === 0 ? (
                  <p className="text-gray-500">Chưa có phân công</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map((a) => (
                          <tr key={a.id}>
                            <td className="px-4 py-2">{a.ho_ten || '-'}</td>
                            <td className="px-4 py-2">{a.vai_tro || '-'}</td>
                            <td className="px-4 py-2">{a.email || '-'}</td>
                            <td className="px-4 py-2">{a.so_dien_thoai || '-'}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleRemoveAssignment(a.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal thêm người tham gia */}
      {showAddParticipant && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Thêm người tham gia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                <select
                  value={participantForm.loai}
                  onChange={(e) => setParticipantForm({ ...participantForm, loai: e.target.value, id_benh_nhan: '', id_nguoi_than: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="benh_nhan">Bệnh nhân</option>
                  <option value="nguoi_than">Người thân</option>
                </select>
              </div>
              
              {participantForm.loai === 'benh_nhan' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhân *</label>
                  <select
                    value={participantForm.id_benh_nhan}
                    onChange={(e) => setParticipantForm({ ...participantForm, id_benh_nhan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map((bn) => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhân (để lọc người thân)</label>
                    <select
                      value={participantForm.id_benh_nhan}
                      onChange={(e) => setParticipantForm({ ...participantForm, id_benh_nhan: e.target.value, id_nguoi_than: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Chọn bệnh nhân</option>
                      {benhNhans.map((bn) => (
                        <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người thân *</label>
                    <select
                      value={participantForm.id_nguoi_than}
                      onChange={(e) => setParticipantForm({ ...participantForm, id_nguoi_than: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                      disabled={!participantForm.id_benh_nhan}
                    >
                      <option value="">Chọn người thân</option>
                      {nguoiThans.map((nt) => (
                        <option key={nt.id} value={nt.id}>{nt.ho_ten}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddParticipant(false);
                    setParticipantForm({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddParticipant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!participantForm.id_benh_nhan && !participantForm.id_nguoi_than}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm phân công */}
      {showAddAssignment && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Phân công nhân viên</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên *</label>
                <select
                  value={assignmentForm.id_nhan_vien}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, id_nhan_vien: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Chọn nhân viên</option>
                  {nhanViens.map((nv) => (
                    <option key={nv.id} value={nv.id}>{nv.ho_ten}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <input
                  type="text"
                  value={assignmentForm.vai_tro}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, vai_tro: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ví dụ: MC, Quản lý, Hỗ trợ..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddAssignment(false);
                    setAssignmentForm({ id_nhan_vien: '', vai_tro: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!assignmentForm.id_nhan_vien}
                >
                  Phân công
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

