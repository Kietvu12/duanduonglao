import { useState } from 'react';
import bed1 from '../assets/Bed1.png';
import bed2 from '../assets/Bed2.png';
import VRView from './VRView';

const RoomDetail = ({ room, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState('basic');
  const [showVRView, setShowVRView] = useState(false);

  const images = [bed1, bed2];
  const roomTypes = [
    { id: 'basic', label: 'Basic Room' },
    { id: 'deluxe', label: 'Deluxe Room' },
    { id: 'service1', label: 'Name of the Service Offerings' },
    { id: 'service2', label: 'Name of the Service Offerings' },
    { id: 'service3', label: 'Name of the Service Offerings' }
  ];

  return (
    <>
      {showVRView && <VRView onClose={() => setShowVRView(false)} />}
      <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span className="hover:text-primary cursor-pointer" onClick={onBack}>
              Tiện ích
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">PHÒNG NỘI TRÚ</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-raleway-bold text-gray-800">
            PHÒNG NỘI TRÚ
          </h1>
        </div>

        {/* Images Section - Full Width at Top */}
        <div className="mb-8 md:mb-12 space-y-4">
          {/* Main Image */}
          <div className="relative w-full rounded-lg flex justify-center items-center bg-gray-100">
            <img
              src={images[selectedImage]}
              alt={room.title}
              className="w-full h-auto object-contain rounded-lg"
            />
            {/* 3D View Icon Overlay */}
            <button
              onClick={() => setShowVRView(true)}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-black/70 transition-colors"
              aria-label="Xem VR 360 độ"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex-1 h-24 md:h-32 overflow-hidden rounded-lg cursor-pointer border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section - Description and Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-raleway-bold text-gray-800">
              {room.title}
            </h2>

            {/* Description */}
            <div className="space-y-4 text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
              <p>
                Đội ngũ điều dưỡng viên của chúng tôi sẽ hỗ trợ người cao tuổi trong các hoạt động sinh hoạt hàng ngày, theo dõi sức khỏe, và thực hiện các bài tập vận động tại nhà.
              </p>
              <p>
                Chăm sóc người cao tuổi tại nhà là một dịch vụ quan trọng, đặc biệt đối với những người cao tuổi mắc bệnh mãn tính, khó khăn trong việc di chuyển, hoặc cần sự chăm sóc đặc biệt.
              </p>
              <p>
                Trong cuộc sống hiện đại bận rộn, nhiều gia đình gặp khó khăn trong việc chăm sóc người cao tuổi do công việc và các trách nhiệm khác. Việc chăm sóc người cao tuổi đòi hỏi thời gian, kiến thức và sự kiên nhẫn.
              </p>
              <p>
                Người cao tuổi có hệ miễn dịch yếu hơn và dễ mắc các bệnh nhiễm trùng. Việc chăm sóc đúng cách giúp họ phục hồi nhanh hơn và giảm nguy cơ biến chứng.
              </p>
              <p>
                Trung tâm chăm sóc sức khỏe người cao tuổi OriHome hiểu được những lo lắng của gia đình và cung cấp dịch vụ chăm sóc đa dạng, linh hoạt và phù hợp với nhu cầu của từng gia đình. Dịch vụ của chúng tôi phù hợp với những người cao tuổi không muốn hoặc không thể đến trung tâm hoặc bệnh viện, cung cấp dịch vụ chăm sóc y tế liên tục hoặc theo từng đợt.
              </p>
            </div>
          </div>

          {/* Right Column - Pricing Box */}
          <div className="lg:col-span-1">
            <div className="border-2 border-primary rounded-lg p-6 space-y-4">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800">
                BẢNG GIÁ
              </h3>

              {/* Price */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-raleway-bold text-gray-800 mb-2">
                  $1999
                </div>
                <div className="text-sm text-gray-600 font-raleway-regular">
                  Một đêm
                </div>
              </div>

              {/* Room Type Options */}
              <div className="space-y-2">
                {roomTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="roomType"
                      value={type.id}
                      checked={selectedRoomType === type.id}
                      onChange={(e) => setSelectedRoomType(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm md:text-base font-raleway-regular text-gray-800 flex-1">
                      {type.label}
                    </span>
                    {type.id === 'deluxe' && (
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </label>
                ))}
              </div>

              {/* Book Button */}
              <button className="w-full py-3 bg-gray-900 text-white font-raleway-bold text-sm md:text-base rounded hover:bg-gray-800 transition-colors">
                LIÊN HỆ SỚM ĐỂ ĐẶT PHÒNG
              </button>

              {/* No credit card required */}
              <p className="text-xs text-gray-500 text-center">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default RoomDetail;
