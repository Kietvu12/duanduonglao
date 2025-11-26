const AboutUsSession3 = () => {
  const timelineEvents = [
    {
      year: '1990',
      title: 'New Beginning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    },
    {
      year: '2000',
      title: 'Residence Expand',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    },
    {
      year: '2010',
      title: 'Home Care Service Started',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    },
    {
      year: '2020',
      title: 'Country Wide Coverage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 leading-tight">
          HÀNH TRÌNH CỦA CHÚNG TÔI
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Events */}
          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative pl-20 md:pl-32">
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-10 top-2 w-4 h-4 bg-primary rounded-full z-10"></div>

                {/* Connecting Line - starts below the dot, ends before next dot */}
                {index < timelineEvents.length - 1 && (
                  <>
                    {/* Line for mobile - centered on circle: left-6 (24px) + w-4/2 (8px) - w-0.5/2 (1px) = 31px */}
                    <div 
                      className="absolute left-[31px] top-6 w-0.5 bg-gray-300 z-0 md:hidden"
                      style={{ 
                        height: 'calc(100% + 2rem)'
                      }}
                    ></div>
                    {/* Line for desktop - centered on circle: left-10 (40px) + w-4/2 (8px) - w-0.5/2 (1px) = 47px */}
                    <div 
                      className="absolute left-[47px] top-6 w-0.5 bg-gray-300 z-0 hidden md:block"
                      style={{ 
                        height: 'calc(100% + 3rem)'
                      }}
                    ></div>
                  </>
                )}

                {/* Content */}
                <div className="space-y-2 md:space-y-3">
                  {/* Year */}
                  <div className="text-xl md:text-2xl font-raleway-bold text-gray-800">
                    {event.year}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-raleway-bold text-gray-800 leading-tight">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed max-w-3xl">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession3;
