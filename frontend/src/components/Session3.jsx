import session3Image from '../assets/session3.png';

const Session3 = () => {
  const services = [
    {
      id: 1,
      title: 'Chăm sóc cư dân',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem.',
      numberPosition: 'right'
    },
    {
      id: 2,
      title: 'Điều dưỡng chuyên nghiệp',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem.',
      numberPosition: 'right'
    },
    {
      id: 3,
      title: 'Đội ngũ chăm sóc',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem.',
      numberPosition: 'left'
    },
    {
      id: 4,
      title: 'Dinh dưỡng người cao tuổi',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem.',
      numberPosition: 'left'
    }
  ];

  return (
    <section className="w-full bg-white pt-20 md:pt-20 lg:pt-20 min-h-screen flex flex-col">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Label */}
          <div className="text-primary font-raleway-bold text-base md:text-lg uppercase tracking-wider mb-4">
            DỊCH VỤ
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-gray-800 leading-tight mb-2">
            TRẢI NGHIỆM TỐT NHẤT
          </h2>
          
          {/* Subtitle */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-gray-800 leading-tight">
            Ở MỌI DỊCH VỤ
          </h3>
        </div>

        {/* Image Section with Overlay Cards - Large Desktop (2xl+) */}
        <div className="hidden 2xl:flex mt-auto justify-center items-center relative">
          <div className="relative w-full max-w-6xl">
            <img
              src={session3Image}
              alt="Chăm sóc người cao tuổi"
              className="w-full h-auto"
            />

            {/* Top Left Card */}
            <div className="absolute top-32 -left-40 md:top-40 md:-left-48 lg:top-48 lg:-left-56 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 w-[400px] md:w-[480px] h-[160px] md:h-[180px]">
              <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1 md:mb-1.5">
                {services[0].title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[0].description}
              </p>
              <div className="absolute bottom-3 right-3 text-primary font-raleway-bold text-3xl md:text-4xl">
                {String(services[0].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="absolute bottom-8 -left-40 md:bottom-12 md:-left-48 lg:bottom-16 lg:-left-56 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 w-[400px] md:w-[480px] h-[160px] md:h-[180px]">
              <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1 md:mb-1.5">
                {services[1].title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[1].description}
              </p>
              <div className="absolute bottom-3 right-3 text-primary font-raleway-bold text-3xl md:text-4xl">
                {String(services[1].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-32 -right-40 md:bottom-40 md:-right-48 lg:bottom-48 lg:-right-56 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 w-[400px] md:w-[480px] h-[160px] md:h-[180px]">
              <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1 md:mb-1.5">
                {services[2].title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[2].description}
              </p>
              <div className="absolute bottom-3 left-3 text-primary font-raleway-bold text-3xl md:text-4xl">
                {String(services[2].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute top-8 -right-40 md:top-12 md:-right-48 lg:top-16 lg:-right-56 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 w-[400px] md:w-[480px] h-[160px] md:h-[180px]">
              <div className="absolute top-3 left-3 text-primary font-raleway-bold text-3xl md:text-4xl">
                {String(services[3].id).padStart(2, '0')}.
              </div>
              <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1 md:mb-1.5 mt-10 md:mt-12">
                {services[3].title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[3].description}
              </p>
            </div>
          </div>
        </div>

        {/* Medium Desktop (lg to 2xl): Smaller overlay cards */}
        <div className="hidden lg:flex 2xl:hidden mt-auto justify-center items-center relative">
          <div className="relative w-full max-w-4xl">
            <img
              src={session3Image}
              alt="Chăm sóc người cao tuổi"
              className="w-full h-auto"
            />

            {/* Top Left Card */}
            <div className="absolute top-16 -left-20 xl:top-20 xl:-left-24 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[280px] xl:w-[320px] h-[140px] xl:h-[160px]">
              <h3 className="text-base xl:text-lg font-raleway-bold text-gray-800 mb-1">
                {services[0].title}
              </h3>
              <p className="text-xs xl:text-sm text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[0].description}
              </p>
              <div className="absolute bottom-2 right-2 text-primary font-raleway-bold text-2xl xl:text-3xl">
                {String(services[0].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="absolute bottom-4 -left-20 xl:bottom-6 xl:-left-24 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[280px] xl:w-[320px] h-[140px] xl:h-[160px]">
              <h3 className="text-base xl:text-lg font-raleway-bold text-gray-800 mb-1">
                {services[1].title}
              </h3>
              <p className="text-xs xl:text-sm text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[1].description}
              </p>
              <div className="absolute bottom-2 right-2 text-primary font-raleway-bold text-2xl xl:text-3xl">
                {String(services[1].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-16 -right-20 xl:bottom-20 xl:-right-24 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[280px] xl:w-[320px] h-[140px] xl:h-[160px]">
              <h3 className="text-base xl:text-lg font-raleway-bold text-gray-800 mb-1">
                {services[2].title}
              </h3>
              <p className="text-xs xl:text-sm text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[2].description}
              </p>
              <div className="absolute bottom-2 left-2 text-primary font-raleway-bold text-2xl xl:text-3xl">
                {String(services[2].id).padStart(2, '0')}.
              </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute top-4 -right-20 xl:top-6 xl:-right-24 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[280px] xl:w-[320px] h-[140px] xl:h-[160px]">
              <div className="absolute top-2 left-2 text-primary font-raleway-bold text-2xl xl:text-3xl">
                {String(services[3].id).padStart(2, '0')}.
              </div>
              <h3 className="text-base xl:text-lg font-raleway-bold text-gray-800 mb-1 mt-8 xl:mt-10">
                {services[3].title}
              </h3>
              <p className="text-xs xl:text-sm text-gray-600 font-raleway-regular leading-relaxed mb-2">
                {services[3].description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet: Services List First, Then Image */}
        <div className="lg:hidden mt-auto">
          {/* Services List */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 relative w-full"
                >
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-primary font-raleway-bold text-xl sm:text-2xl">
                    {String(service.id).padStart(2, '0')}.
                  </div>
                  <h3 className="text-base sm:text-lg font-raleway-bold text-gray-800 mb-2 ml-10 sm:ml-12">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-raleway-regular leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className="flex justify-center items-center">
            <img
              src={session3Image}
              alt="Chăm sóc người cao tuổi"
              className="w-full max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session3;

