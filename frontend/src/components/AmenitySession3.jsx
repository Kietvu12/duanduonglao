import outside1 from '../assets/Outside1.png';
import outside2 from '../assets/Outside2.png';

const AmenitySession3 = () => {
  const outdoorSpaces = [
    {
      id: 1,
      image: outside1,
      title: 'Outdoor Spaces',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 2,
      image: outside2,
      title: 'Gardens',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 leading-tight">
          DU LỊCH
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {outdoorSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                  {space.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitySession3;
