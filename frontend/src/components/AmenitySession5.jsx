const AmenitySession5 = () => {
  const features = [
    {
      id: 1,
      title: 'Accessibility Features #1',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 2,
      title: 'Accessibility Features #2',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 3,
      title: 'Accessibility Features #3',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-[#FFF9FB] rounded-lg shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-[#FDE7F2] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitySession5;
