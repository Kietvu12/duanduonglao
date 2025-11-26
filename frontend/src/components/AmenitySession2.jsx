import bed1 from '../assets/Bed1.png';
import bed2 from '../assets/Bed2.png';

const AmenitySession2 = ({ onRoomClick }) => {
  const rooms = [
    {
      id: 1,
      image: bed1,
      title: 'Private Rooms',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 2,
      image: bed2,
      title: 'Semi- Private Rooms',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 leading-tight">
          PHÒNG NỘI TRÚ
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
              onClick={() => onRoomClick && onRoomClick(room)}
            >
              {/* Image */}
              <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                  {room.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                  {room.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitySession2;
