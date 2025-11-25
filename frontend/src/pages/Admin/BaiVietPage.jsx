import { useEffect, useState } from 'react';
import { baiVietAPI, uploadAPI } from '../../services/api';
import RichTextEditor from '../../components/RichTextEditor';

export default function BaiVietPage() {
  const [baiViets, setBaiViets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    tieu_de: '',
    slug: '',
    noi_dung: '',
    anh_dai_dien: '',
    meta_title: '',
    meta_description: '',
    category: '',
    tags: '',
    trang_thai: 'nhap',
    ngay_dang: '',
  });
  const [mediaList, setMediaList] = useState([]);
  const [newMedia, setNewMedia] = useState({ url: '', loai: 'anh', mo_ta: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    loadBaiViets();
  }, []);

  const loadBaiViets = async () => {
    try {
      setLoading(true);
      const response = await baiVietAPI.getAll();
      setBaiViets(response.data || []);
    } catch (error) {
      console.error('Error loading bai viets:', error);
      alert('Lỗi khi tải danh sách bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate HTML content - check if content is empty or only contains empty tags
      const content = formData.noi_dung || '';
      console.log('Validating content:', content);
      
      // Check if content exists
      if (!content) {
        alert('Vui lòng nhập nội dung bài viết');
        return;
      }
      
      // Parse HTML to check for actual content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Get text content (removing all HTML tags)
      const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim();
      const hasImages = tempDiv.querySelector('img') !== null;
      const hasOtherContent = tempDiv.querySelector('h1, h2, h3, h4, h5, h6, ul, ol, blockquote') !== null;
      
      console.log('Content check:', { textContent, hasImages, hasOtherContent, contentLength: content.length });
      
      // Content is valid if it has text, images, or other meaningful elements
      // Also allow if content length is significant (even if just formatting)
      if (!textContent && !hasImages && !hasOtherContent && content.length < 20) {
        alert('Vui lòng nhập nội dung bài viết');
        return;
      }

      const submitData = {
        ...formData,
        // Ensure anh_dai_dien is sent (even if empty string, convert to null)
        anh_dai_dien: formData.anh_dai_dien || null,
        // Media gallery (optional, separate from embedded images in content)
        media: mediaList.length > 0 ? mediaList.map((m, index) => ({
          url: m.url,
          loai: m.loai,
          mo_ta: m.mo_ta || null,
          thu_tu: index
        })) : undefined
      };

      console.log('Submitting data:', submitData);
      console.log('Anh dai dien:', submitData.anh_dai_dien);

      if (editing) {
        await baiVietAPI.update(editing.id, submitData);
        alert('Cập nhật bài viết thành công');
      } else {
        await baiVietAPI.create(submitData);
        alert('Tạo bài viết thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      setMediaList([]);
      loadBaiViets();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (bv) => {
    // Load full article data including content
    try {
      const fullArticle = await baiVietAPI.getById(bv.id);
      const articleData = fullArticle.data;
      
      setEditing(articleData);
      setFormData({
        tieu_de: articleData.tieu_de || '',
        slug: articleData.slug || '',
        noi_dung: articleData.noi_dung || '',
        anh_dai_dien: articleData.anh_dai_dien || '',
        meta_title: articleData.meta_title || '',
        meta_description: articleData.meta_description || '',
        category: articleData.category || '',
        tags: articleData.tags || '',
        trang_thai: articleData.trang_thai || 'nhap',
        ngay_dang: articleData.ngay_dang ? articleData.ngay_dang.slice(0, 16) : '',
      });
      
      // Load media của bài viết
      if (articleData.media && Array.isArray(articleData.media)) {
        setMediaList(articleData.media);
      } else {
        try {
          const mediaResponse = await baiVietAPI.getMedia(bv.id);
          setMediaList(mediaResponse.data || []);
        } catch (error) {
          console.error('Error loading media:', error);
          setMediaList([]);
        }
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Lỗi khi tải dữ liệu bài viết: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await baiVietAPI.delete(id);
      alert('Xóa bài viết thành công');
      loadBaiViets();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      tieu_de: '',
      slug: '',
      noi_dung: '',
      anh_dai_dien: '',
      meta_title: '',
      meta_description: '',
      category: '',
      tags: '',
      trang_thai: 'nhap',
      ngay_dang: '',
    });
    setMediaList([]);
    setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm'];
    
    if (!imageTypes.includes(file.type) && !videoTypes.includes(file.type)) {
      alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp) hoặc video (mp4, mov, avi, wmv, flv, webm)');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadMedia(file);
      
      // Auto-detect loai from uploaded file
      const loai = videoTypes.includes(file.type) ? 'video' : 'anh';
      
      setMediaList([...mediaList, { 
        url: response.data.url, 
        loai: loai,
        mo_ta: newMedia.mo_ta || '',
        id: Date.now() 
      }]);
      setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
      e.target.value = ''; // Reset input
    } catch (error) {
      alert('Lỗi khi upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMedia = () => {
    if (!newMedia.url.trim()) {
      alert('Vui lòng nhập URL hoặc upload file');
      return;
    }
    setMediaList([...mediaList, { ...newMedia, id: Date.now() }]);
    setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
  };

  const handleRemoveMedia = (index) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  const handleMoveMedia = (index, direction) => {
    const newList = [...mediaList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newList.length) {
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      setMediaList(newList);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Bài viết</h1>
          <p className="text-gray-600 mt-1">Danh sách bài viết và tin tức</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setMediaList([]);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo bài viết
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {baiViets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                baiViets.map((bv) => (
                  <tr key={bv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{bv.tieu_de}</td>
                    <td className="px-6 py-4">{bv.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bv.trang_thai === 'xuat_ban' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bv.trang_thai === 'xuat_ban' ? 'Xuất bản' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{bv.luot_xem || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bv.ngay_dang ? new Date(bv.ngay_dang).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(bv)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(bv.id)}
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
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa bài viết' : 'Tạo bài viết mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tự động tạo nếu để trống"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    <option value="nhap">Nháp</option>
                    <option value="xuat_ban">Xuất bản</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung * (Click vào biểu tượng ảnh để upload ảnh trực tiếp vào bài viết)
                </label>
                <RichTextEditor
                  key={editing?.id || 'new'} // Force re-render when editing changes
                  value={formData.noi_dung || ''}
                  onChange={(content) => {
                    console.log('Editor content changed:', content);
                    setFormData({ ...formData, noi_dung: content });
                  }}
                  placeholder="Nhập nội dung bài viết. Bạn có thể format text, thêm ảnh, video..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Mẹo: Click vào biểu tượng <strong>📷</strong> trên thanh công cụ để upload và chèn ảnh trực tiếp vào vị trí con trỏ.
                  Bạn có thể tạo bố cục: Nội dung - Ảnh - Nội dung - Ảnh bằng cách chèn ảnh vào giữa các đoạn văn.
                </p>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tiêu đề SEO (tối đa 60 ký tự)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Mô tả SEO (tối đa 160 ký tự)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đăng (để trống = ngay lập tức)
                </label>
                <input
                  type="datetime-local"
                  value={formData.ngay_dang}
                  onChange={(e) => setFormData({ ...formData, ngay_dang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Media Management Section - Optional Gallery */}
              <div className="border-t pt-4">
                <details className="cursor-pointer">
                  <summary className="block text-sm font-medium text-gray-700 mb-3">
                    Media Gallery (Tùy chọn - Quản lý media riêng, không embed trong nội dung)
                  </summary>
                
                {/* Add Media Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                  {/* Upload File Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tải ảnh/video lên *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUploadFile}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                      />
                      {uploading && (
                        <span className="text-sm text-gray-500">Đang tải lên...</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ: Ảnh (jpg, png, gif, webp), Video (mp4, mov, avi, wmv, flv, webm)
                    </p>
                  </div>

                  {/* Or URL Input */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">Hoặc nhập URL</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={newMedia.url}
                        onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Loại
                      </label>
                      <select
                        value={newMedia.loai}
                        onChange={(e) => setNewMedia({ ...newMedia, loai: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="anh">Ảnh</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Mô tả (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={newMedia.mo_ta}
                      onChange={(e) => setNewMedia({ ...newMedia, mo_ta: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Mô tả cho media"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={!newMedia.url.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm Media từ URL
                  </button>
                </div>

                {/* Media List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mediaList.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Chưa có media nào. Thêm media bằng form phía trên.
                    </p>
                  ) : (
                    mediaList.map((media, index) => (
                      <div
                        key={media.id || index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {media.loai === 'video' ? (
                            <video
                              src={media.url}
                              className="w-20 h-20 object-cover rounded border border-gray-300"
                              controls={false}
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt={media.mo_ta || `Media ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EẢnh lỗi%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              {index + 1}.
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              media.loai === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {media.loai === 'video' ? 'Video' : 'Ảnh'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 truncate">{media.url}</p>
                          {media.mo_ta && (
                            <p className="text-xs text-gray-500 mt-1">{media.mo_ta}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(index, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Lên"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(index, 'down')}
                            disabled={index === mediaList.length - 1}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xuống"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Xóa"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                </details>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                    setMediaList([]);
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
    </div>
  );
}

