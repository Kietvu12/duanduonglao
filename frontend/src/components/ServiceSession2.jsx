const ServiceSession2 = ({ onServiceClick }) => {
  const services = [
    {
      id: 1,
      title: 'Resident Care',
      shortDescription: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.',
      serviceDetails: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      offerings: [
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings'
      ]
    },
    {
      id: 2,
      title: 'Elderly Nutrition',
      shortDescription: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.',
      serviceDetails: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      offerings: [
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings'
      ]
    },
    {
      id: 3,
      title: 'Skilled Nursing',
      shortDescription: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.',
      serviceDetails: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      offerings: [
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings'
      ]
    },
    {
      id: 4,
      title: 'Caring Staff',
      shortDescription: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.',
      serviceDetails: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      offerings: [
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings',
        'Name of the Service Offerings'
      ]
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16 md:space-y-20">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onServiceClick && onServiceClick(service)}
            >
              {/* Left Column - Service Description (wider) */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Main Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-gray-800 leading-tight">
                  {service.title}
                </h2>

                {/* Short Description */}
                <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Subtitle */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mt-6 md:mt-8">
                  Service Details
                </h3>

                {/* Long Description */}
                <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
                  {service.serviceDetails}
                </p>
              </div>

              {/* Right Column - Service Offerings (narrower) */}
              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800">
                  Service Offerings
                </h3>

                {/* List */}
                <ul className="space-y-3">
                  {service.offerings.map((offering, index) => (
                    <li
                      key={index}
                      className="text-sm md:text-base text-gray-500 font-raleway-regular"
                    >
                      {offering}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession2;
