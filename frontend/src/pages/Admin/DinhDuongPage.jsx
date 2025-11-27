import { useEffect, useState } from 'react';
import { dinhDuongAPI, benhNhanAPI } from '../../services/api';

export default function DinhDuongPage() {
  const [thucDons, setThucDons] = useState([]);
  const [dinhDuongHangNgay, setDinhDuongHangNgay] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('thuc-don');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_benh_nhan: '',
    ngay: new Date().toISOString().split('T')[0],
    bua_sang: '',
    bua_trua: '',
    bua_toi: '',
    tong_calo: '',
  });

  useEffect(() => {
    loadThucDons();
    loadDinhDuongHangNgay();
    loadBenhNhans();
  }, []);

  const loadThucDons = async () => {
    try {
      setLoading(true);
      const response = await dinhDuongAPI.getThucDon();
      setThucDons(response.data || []);
    } catch (error) {
      console.error('Error loading thuc dons:', error);
      alert('Lỗi khi tải danh sách thực đơn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDinhDuongHangNgay = async () => {
    try {
      const response = await dinhDuongAPI.getDinhDuongHangNgay();
      setDinhDuongHangNgay(response.data || []);
    } catch (error) {
      console.error('Error loading dinh duong hang ngay:', error);
    }
  };

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll();
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dinhDuongAPI.createThucDon(formData);
      alert('Tạo thực đơn thành công');
      setShowModal(false);
      resetForm();
      loadThucDons();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_benh_nhan: '',
      ngay: new Date().toISOString().split('T')[0],
      bua_sang: '',
      bua_trua: '',
      bua_toi: '',
      tong_calo: '',
    });
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Dinh dưỡng</h1>
          <p className="text-gray-600 mt-2">Thực đơn và dinh dưỡng hàng ngày</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span>Tạo thực đơn</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('thuc-don')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'thuc-don'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Thực đơn
            </button>
            <button
              onClick={() => setActiveTab('hang-ngay')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'hang-ngay'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Dinh dưỡng hàng ngày
            </button>
          </nav>
        </div>

        <div className="p-6 lg:p-8">
          {/* Tab: Thực đơn */}
          {activeTab === 'thuc-don' && (
            <div>
              {loading ? (
                <div className="p-16 text-center text-gray-500">Đang tải...</div>
              ) : thucDons.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-16 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>restaurant</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có thực đơn nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo thực đơn" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {thucDons.map((td) => (
                    <div key={td.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {(benhNhans.find(bn => bn.id === td.id_benh_nhan)?.ho_ten || 'BN').charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {benhNhans.find(bn => bn.id === td.id_benh_nhan)?.ho_ten || 'Bệnh nhân #' + td.id_benh_nhan}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calendar_today</span>
                                <span>Ngày: {new Date(td.ngay).toLocaleDateString('vi-VN')}</span>
                                <span className="mx-2">•</span>
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>local_fire_department</span>
                                <span className="font-semibold text-[#4A90E2]">{td.tong_calo || 0} kcal</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>breakfast_dining</span>
                            Bữa sáng
                          </p>
                          <p className="text-sm text-gray-900">{td.bua_sang || '-'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>lunch_dining</span>
                            Bữa trưa
                          </p>
                          <p className="text-sm text-gray-900">{td.bua_trua || '-'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>dinner_dining</span>
                            Bữa tối
                          </p>
                          <p className="text-sm text-gray-900">{td.bua_toi || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Dinh dưỡng hàng ngày */}
          {activeTab === 'hang-ngay' && (
            <div>
              {dinhDuongHangNgay.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-16 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>nutrition</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu dinh dưỡng hàng ngày</p>
                  <p className="text-gray-400 text-sm">Dữ liệu sẽ được cập nhật tự động</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bệnh nhân</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bữa ăn</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Món ăn</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Calo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tỷ lệ ăn</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dinhDuongHangNgay.map((dd) => (
                          <tr key={dd.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {(benhNhans.find(bn => bn.id === dd.id_benh_nhan)?.ho_ten || 'BN').charAt(0)?.toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {benhNhans.find(bn => bn.id === dd.id_benh_nhan)?.ho_ten || 'BN #' + dd.id_benh_nhan}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#4A90E2]/20 text-[#4A90E2] capitalize">
                                {dd.bua_an?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-900">{dd.mon_an || '-'}</td>
                            <td className="px-6 py-5 text-sm text-gray-900 font-medium">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base text-orange-500" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>local_fire_department</span>
                                {dd.luong_calo || 0} kcal
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                  <div 
                                    className="bg-[#4A90E2] h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min(dd.ti_le_an || 0, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="font-semibold text-gray-700">{dd.ti_le_an || 0}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-900 whitespace-nowrap">
                              {dd.thoi_gian ? new Date(dd.thoi_gian).toLocaleString('vi-VN') : '-'}
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
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Tạo thực đơn mới</h2>
              <button
                onClick={() => {
                  setShowModal(false);
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
                    onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
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
                    Ngày *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>breakfast_dining</span>
                  Bữa sáng
                </label>
                <textarea
                  value={formData.bua_sang}
                  onChange={(e) => setFormData({ ...formData, bua_sang: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                  placeholder="Nhập món ăn cho bữa sáng..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>lunch_dining</span>
                  Bữa trưa
                </label>
                <textarea
                  value={formData.bua_trua}
                  onChange={(e) => setFormData({ ...formData, bua_trua: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                  placeholder="Nhập món ăn cho bữa trưa..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>dinner_dining</span>
                  Bữa tối
                </label>
                <textarea
                  value={formData.bua_toi}
                  onChange={(e) => setFormData({ ...formData, bua_toi: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                  placeholder="Nhập món ăn cho bữa tối..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>local_fire_department</span>
                  Tổng calo (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.tong_calo}
                  onChange={(e) => setFormData({ ...formData, tong_calo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Nhập tổng số calo..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>Tạo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

