import bgSession6 from '../assets/bg_session6.png';
import session6Img from '../assets/session6_img.png';

const Session6 = () => {
  return (
    <section className="w-full bg-white pt-0 pb-0 relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bgSession6}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay - On mobile, tablet, and small desktop, hidden on large desktop */}
      <div className="absolute inset-0 bg-black/30 xl:hidden z-[5]"></div>
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6">
        {/* Title Section - Top Left */}
        <div className="pb-0">
          {/* Subtitle */}
          <div className="text-primary font-raleway-regular text-sm md:text-base mb-3 md:mb-4">
            ĐẶT LỊCH
          </div>
          
          {/* Main Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-raleway-bold text-white leading-tight mb-4 md:mb-6">
            DỄ DÀNG HƠN,<br />
            TIỆN LỢI HƠN
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl text-white font-raleway-regular leading-relaxed max-w-2xl mb-6 md:mb-8">
            Các bước để trở thành người nhà của chúng tôi. Đăng kí ngay.
          </p>
          
          {/* Image */}
          <div className="mt-6 md:mt-8 mb-6 md:mb-8">
            <img
              src={session6Img}
              alt="Steps"
              className="w-full max-w-4xl"
            />
          </div>
          
          {/* Text below image */}
          <div className="text-white mt-32 md:mt-40 lg:mt-48 xl:mt-56 font-raleway-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
            VÀ CHÚNG TÔI SẼ SỚM<br />
            LIÊN HỆ LẠI VỚI BẠN
          </div>
        </div>
      </div>

      {/* Button - Bottom Right */}
      <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 right-4 md:right-6 lg:right-8 z-20">
        <button className="bg-primary text-white font-raleway-bold text-sm md:text-base lg:text-lg px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg">
          BẮT ĐẦU NGAY
        </button>
      </div>
    </section>
  );
};

export default Session6;

