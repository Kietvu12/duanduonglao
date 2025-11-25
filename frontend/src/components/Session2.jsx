import { Link } from 'react-router-dom';
import session2ContentImage from '../assets/session2_content.png';
import session2BgImage from '../assets/bg_session2.png';
import checkboxIcon from '../assets/checkbox.png';

const Session2 = () => {
  const features = [
    'Đội ngũ y bác sĩ giàu kinh nghiệm và tận tâm',
    'Cơ sở vật chất hiện đại, tiện nghi',
    'Chế độ dinh dưỡng khoa học, phù hợp từng cá nhân',
    'Hoạt động giải trí đa dạng, phong phú'
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 relative">
      {/* Background Image with low opacity */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={session2BgImage}
          alt="Background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      
      <div className="max-w-8xl mx-auto px-10 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            {/* Label - visible on mobile, positioned above image */}
            <div className="text-primary font-raleway-bold text-base md:text-lg uppercase tracking-wider mb-4 lg:hidden">
              GÓC NHÌN
            </div>
            <img
              src={session2ContentImage}
              alt="Chăm sóc người cao tuổi"
              className="w-full h-auto rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none"
            />
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 text-right">
            {/* Label - hidden on mobile, visible on desktop */}
            <div className="text-primary font-raleway-bold text-base md:text-lg uppercase tracking-wider hidden lg:block">
              GÓC NHÌN
            </div>

            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
              CÁI CHẠM NHỎ,<br />
              HẠNH PHÚC LỚN.
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 font-raleway-regular leading-relaxed">
              Nơi tôn vinh giá trị tuổi già bằng sự chăm sóc chu đáo và tấm lòng yêu thương. Mỗi ngày tại viện dưỡng lão là một hành trình mới của niềm vui, sự kết nối và bình yên.
            </p>

            {/* Features List */}
            <ul className="space-y-4 pt-8 mt-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 justify-end">
                  <span className="text-lg md:text-xl text-gray-700 font-raleway-regular text-right">
                    {feature}
                  </span>
                  <img
                    src={checkboxIcon}
                    alt="Check"
                    className="w-6 h-6 mt-0.5 flex-shrink-0"
                  />
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="pt-8">
              <Link
                to="/dich-vu"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session2;
