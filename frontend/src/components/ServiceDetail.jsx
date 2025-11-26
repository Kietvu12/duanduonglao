import { useState } from 'react';
import detailServiceImage from '../assets/DetailService.png';

const ServiceDetail = ({ service, onBack }) => {
  const [selectedOffering, setSelectedOffering] = useState(0);
  const [selectedCareOption, setSelectedCareOption] = useState('8h');

  const careOptions = [
    { id: '8h', label: 'Chăm sóc 8h', price: '200.000' },
    { id: '4h', label: 'Chăm sóc 4h', price: '200.000' },
    { id: '2h', label: 'Chăm sóc 2h', price: '200.000' }
  ];

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <span className="hover:text-primary cursor-pointer" onClick={onBack}>
              Dịch vụ
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{service.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Service Offerings */}
            <div>
              <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-4">
                Service Offerings
              </h3>
              <ul className="space-y-2">
                {service.offerings.map((offering, index) => (
                  <li
                    key={index}
                    className={`text-sm md:text-base font-raleway-regular p-2 rounded cursor-pointer transition-colors ${
                      selectedOffering === index
                        ? 'bg-[#FFF9FB] text-gray-800'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOffering(index)}
                  >
                    {offering}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Box */}
            <div className="border-2 border-primary rounded-lg p-6 space-y-4">
              {/* BẢNG GIÁ Button */}
              <button className="w-full py-2 bg-gray-200 text-gray-800 font-raleway-bold text-sm rounded hover:bg-gray-300 transition-colors">
                BẢNG GIÁ
              </button>

              {/* Price */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-raleway-bold text-gray-800 mb-2">
                  1.000.000
                </div>
                <div className="text-sm text-gray-600 font-raleway-regular">
                  Dịch vụ chăm sóc 24/7
                </div>
              </div>

              {/* Care Options */}
              <div className="space-y-3">
                {careOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="careOption"
                        value={option.id}
                        checked={selectedCareOption === option.id}
                        onChange={(e) => setSelectedCareOption(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm md:text-base font-raleway-regular text-gray-800">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-raleway-bold text-gray-800">
                      {option.price}
                    </span>
                  </label>
                ))}
              </div>

              {/* Book Button */}
              <button className="w-full py-3 bg-gray-900 text-white font-raleway-bold text-sm md:text-base rounded hover:bg-gray-800 transition-colors">
                ĐẶT LỊCH NGAY VỚI DỊCH VỤ NÀY
              </button>

              {/* No credit card required */}
              <p className="text-xs text-gray-500 text-center">
                No credit card required
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
              CHĂM SÓC NỘI TRÚ
            </h1>

            {/* Description */}
            <div className="space-y-4 text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
              <p>
                Đội ngũ điều dưỡng viên của chúng tôi sẽ hỗ trợ người cao tuổi trong các hoạt động sinh hoạt hàng ngày, theo dõi sức khỏe, và thực hiện các bài tập vận động tại nhà.
              </p>
              <p>
                Gia đình có người cao tuổi nằm liệt giường thường gặp nhiều khó khăn trong việc chăm sóc, từ việc vệ sinh cá nhân, cho ăn uống, đến việc theo dõi sức khỏe và phòng ngừa các biến chứng.
              </p>
              <p>
                Ori Home hiểu được những lo lắng này và cung cấp dịch vụ chăm sóc đa dạng, linh hoạt và phù hợp với nhu cầu của từng gia đình, đặc biệt là những người muốn chăm sóc người thân tại nhà thay vì đưa vào viện dưỡng lão.
              </p>
            </div>

            {/* Image */}
            <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
              <img
                src={detailServiceImage}
                alt="Chăm sóc nội trú"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetail;
