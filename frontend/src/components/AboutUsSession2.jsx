import aboutUsSession2Image from '../assets/Aboutus_session2.png';

const AboutUsSession2 = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
              TẦM NHÌN
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <img
              src={aboutUsSession2Image}
              alt="Đội ngũ nhân viên y tế"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession2;
