import act1 from '../assets/act1.png';
import act2 from '../assets/act2.png';
import act3 from '../assets/act3.png';
import act4 from '../assets/act4.png';

const ServiceSession4 = () => {
  const activities = [
    {
      id: 1,
      image: act1,
      title: 'Yoga',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 2,
      image: act2,
      title: 'Board Games',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 3,
      image: act3,
      title: 'Gardenning',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 4,
      image: act4,
      title: 'Indoor Games',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
            ĐỒNG HÀNH - THẤU HIỂU
          </h2>
        </div>

        {/* Activity Cards Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                  {activity.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession4;
