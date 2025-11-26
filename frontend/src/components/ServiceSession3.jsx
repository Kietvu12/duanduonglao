import meal1 from '../assets/meal1.png';
import meal2 from '../assets/meal2.png';
import meal3 from '../assets/meal3.png';

const ServiceSession3 = () => {
  const mealPlans = [
    {
      id: 1,
      image: meal1,
      title: 'Meal Plan #1',
      description: 'Lorem ipsum dolor sit amet consectetur Augue non malesuada placerat faucibus nam purus sem. Uma pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 2,
      image: meal2,
      title: 'Meal Plan #2',
      description: 'Lorem ipsum dolor sit amet consectetur Augue non malesuada placerat faucibus nam purus sem. Uma pulvinar porttitor dignissim congue pellentesque ac hac.'
    },
    {
      id: 3,
      image: meal3,
      title: 'Meal Plan',
      description: 'Lorem ipsum dolor sit amet consectetur Augue non malesuada placerat faucibus nam purus sem. Uma pulvinar porttitor dignissim congue pellentesque ac hac.'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-4 leading-tight">
            CHẾ ĐỘ DINH DƯỠNG
          </h2>
          {/* Underline */}
          <div className="w-32 md:w-40 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Meal Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {mealPlans.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content with pink background */}
              <div className="p-6 bg-[#FFF9FB] flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                  {meal.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                  {meal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession3;
