import { useState } from 'react';
import avatarImage from '../assets/avatar_session4.png';

const Session4 = () => {
  const testimonials = [
    {
      id: 0,
      quote: 'Lorem ipsum dolor sit amet consectetur. Amet sed tellus elementum mauris. Libero maecenas eget tellus morbi diam enim euismod egestas. Adipiscing fringilla quis justo adipiscing eget aenean sollicitudin. Nibh ut sed sodales magna risus tellus. Nulla ut arcu ac justo blandit tincidunt ante. Tincidunt libero urna ut aliquet vitae nunc quisque sapien cursus.',
      name: 'James Smith',
      company: 'ABC Softwares'
    },
    {
      id: 1,
      quote: 'Dịch vụ chăm sóc tại đây thực sự xuất sắc. Đội ngũ nhân viên tận tâm và chuyên nghiệp, luôn sẵn sàng hỗ trợ mọi nhu cầu của người cao tuổi. Tôi rất hài lòng với chất lượng dịch vụ và sự quan tâm chu đáo mà họ dành cho từng cư dân.',
      name: 'Nguyễn Văn An',
      company: 'Công ty TNHH ABC'
    },
    {
      id: 2,
      quote: 'Viện dưỡng lão này đã vượt quá mong đợi của tôi. Cơ sở vật chất hiện đại, môi trường sống thoải mái và an toàn. Đặc biệt là chế độ dinh dưỡng khoa học và các hoạt động giải trí đa dạng giúp người cao tuổi luôn vui vẻ và khỏe mạnh.',
      name: 'Trần Thị Bình',
      company: 'Tập đoàn XYZ'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTestimonial = testimonials[currentIndex];

  const achievements = [
    {
      number: '3000+',
      description: 'bệnh nhân điều trị'
    },
    {
      number: '2500+',
      description: 'đánh giá tích cực'
    },
    {
      number: '17+',
      description: 'giải thưởng và chứng nhận'
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 pb-32 md:pb-40 lg:pb-32 xl:pb-40 relative" style={{ backgroundColor: '#FFF9FB' }}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Subtitle */}
          <div className="text-gray-600 font-raleway-regular text-sm md:text-base mb-2">
            TẠI SAO LẠI LÀ CHÚNG TÔI
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-primary leading-tight">
            ĐÁNH GIÁ TỪ KHÁCH HÀNG
          </h2>
        </div>

        {/* Testimonial Section */}
        <div className="max-w-7xl mx-auto">
          {/* Quote Block */}
          <div className="relative mb-8 md:mb-12">
            {/* Opening Quote Mark */}
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-primary font-raleway-bold text-6xl md:text-8xl leading-none">
              "
            </div>
            
            {/* Quote Text */}
            <p className="text-base md:text-lg lg:text-xl text-gray-800 font-raleway-regular italic leading-relaxed px-8 md:px-12 pt-6 md:pt-8 pb-4 md:pb-6 text-justify">
              {currentTestimonial.quote}
            </p>
            
            {/* Closing Quote Mark */}
            <div className="absolute -bottom-2 -right-4 md:-bottom-4 md:-right-6 text-primary font-raleway-bold text-6xl md:text-8xl leading-none">
              "
            </div>
          </div>

          {/* Author Information */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <img
              src={avatarImage}
              alt={currentTestimonial.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-4"
            />
            
            {/* Name */}
            <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1">
              {currentTestimonial.name}
            </h3>
            
            {/* Company */}
            <p className="text-sm md:text-base text-gray-600 font-raleway-regular mb-6">
              {currentTestimonial.company}
            </p>

            {/* Navigation Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Cards - Mobile and Tablet: Inside section */}
        <div className="lg:hidden mt-12 md:mt-16">
          <div className="max-w-8xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center w-full max-w-sm mx-auto"
                >
                  {/* Number */}
                  <div className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm md:text-base lg:text-lg font-raleway-regular text-primary">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Cards - Desktop: Absolute positioned, overlapping */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 transform translate-y-1/2">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-16 xl:gap-20">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center w-full max-w-sm mx-auto"
              >
                {/* Number */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-primary mb-2">
                  {achievement.number}
                </div>
                
                {/* Description */}
                <div className="text-sm md:text-base lg:text-lg font-raleway-regular text-primary">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session4;

