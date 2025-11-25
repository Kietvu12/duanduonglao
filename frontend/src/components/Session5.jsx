import event1 from '../assets/event_1.jpg';
import event2 from '../assets/event_2.jpg';
import event3 from '../assets/event_3.jpg';
import event4 from '../assets/event_4.jpg';
import event5 from '../assets/event_5.jpg';

const Session5 = () => {
  const events = [
    {
      id: 1,
      image: event1,
      category: 'EVENT',
      title: 'Annual Summer Garden Party',
      description: 'Join us for a day of sun, music, and laughter in our beautiful gardens. Family and friends are welcome!'
    },
    {
      id: 2,
      image: event2,
      category: 'NEWS',
      title: 'New Therapy Program Launch',
      description: 'We are excited to introduce our new pet therapy program, proven to boost mood and reduce stress.'
    },
    {
      id: 3,
      image: event3,
      category: 'ANNOUNCEMENT',
      title: 'Celebrating 20 Years of Care',
      description: 'Golden Years Care is proud to celebrate two decades of providing exceptional care to our community.'
    },
    {
      id: 4,
      image: event4,
      category: 'EVENT',
      title: 'Health & Wellness Workshop',
      description: 'Join our monthly workshop focusing on nutrition, exercise, and mental wellness for seniors.'
    },
    {
      id: 5,
      image: event5,
      category: 'NEWS',
      title: 'Community Outreach Program',
      description: 'Our new community outreach program aims to support elderly care in underserved areas.'
    }
  ];

  return (
    <section className="w-full py-16 mt-20 md:mt-20 lg:mt-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Subtitle */}
          <div className="text-primary font-raleway-regular text-sm md:text-base mb-2 uppercase">
            STAY UPDATED
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-gray-800 leading-tight">
            Latest News & Events
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-64 md:h-72 overflow-hidden flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-6 bg-[#FFF9FB] flex-1 rounded-b-xl">
                {/* Category */}
                <div className="text-primary font-raleway-regular text-xs md:text-sm uppercase mb-2">
                  {event.category}
                </div>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-3">
                  {event.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular mb-4 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Read More Link */}
                <a
                  href="#"
                  className="inline-flex items-center text-primary font-raleway-regular text-sm md:text-base hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Session5;

