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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Dinh dưỡng</h1>
          <p className="text-gray-600 mt-1">Thực đơn và dinh dưỡng hàng ngày</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo thực đơn
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('thuc-don')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'thuc-don'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Thực đơn
            </button>
            <button
              onClick={() => setActiveTab('hang-ngay')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'hang-ngay'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dinh dưỡng hàng ngày
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Thực đơn */}
          {activeTab === 'thuc-don' && (
            <div>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : thucDons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
              ) : (
                <div className="space-y-4">
                  {thucDons.map((td) => (
                    <div key={td.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">
                            {benhNhans.find(bn => bn.id === td.id_benh_nhan)?.ho_ten || 'Bệnh nhân #' + td.id_benh_nhan}
                          </p>
                          <p className="text-sm text-gray-600">
                            Ngày: {new Date(td.ngay).toLocaleDateString('vi-VN')} - 
                            Tổng calo: {td.tong_calo || 0} kcal
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Bữa sáng</p>
                          <p className="text-sm">{td.bua_sang || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Bữa trưa</p>
                          <p className="text-sm">{td.bua_trua || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Bữa tối</p>
                          <p className="text-sm">{td.bua_toi || '-'}</p>
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
                <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bữa ăn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Món ăn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỷ lệ ăn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dinhDuongHangNgay.map((dd) => (
                        <tr key={dd.id}>
                          <td className="px-4 py-3 text-sm">
                            {benhNhans.find(bn => bn.id === dd.id_benh_nhan)?.ho_ten || 'BN #' + dd.id_benh_nhan}
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{dd.bua_an?.replace('_', ' ')}</td>
                          <td className="px-4 py-3 text-sm">{dd.mon_an || '-'}</td>
                          <td className="px-4 py-3 text-sm">{dd.luong_calo || 0} kcal</td>
                          <td className="px-4 py-3 text-sm">{dd.ti_le_an || 0}%</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            {dd.thoi_gian ? new Date(dd.thoi_gian).toLocaleString('vi-VN') : '-'}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo thực đơn mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân *
                  </label>
                  <select
                    required
                    value={formData.id_benh_nhan}
                    onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map((bn) => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bữa sáng
                </label>
                <textarea
                  value={formData.bua_sang}
                  onChange={(e) => setFormData({ ...formData, bua_sang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bữa trưa
                </label>
                <textarea
                  value={formData.bua_trua}
                  onChange={(e) => setFormData({ ...formData, bua_trua: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bữa tối
                </label>
                <textarea
                  value={formData.bua_toi}
                  onChange={(e) => setFormData({ ...formData, bua_toi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tổng calo (kcal)
                </label>
                <input
                  type="number"
                  value={formData.tong_calo}
                  onChange={(e) => setFormData({ ...formData, tong_calo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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

