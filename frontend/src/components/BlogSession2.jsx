import outside1 from '../assets/Outside1.png';
import outside2 from '../assets/Outside2.png';

const BlogSession2 = ({ onPostClick }) => {
  const contentBlocks = [
    {
      id: 1,
      image: outside1,
      title: 'Outdoor Spaces',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '07/11/2025',
      category: 'Dịch vụ',
      mainImage: outside1,
      thumbnail1: outside2,
      thumbnail2: outside2
    },
    {
      id: 2,
      image: outside2,
      title: 'Gardens',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '07/11/2025',
      category: 'Đời sống',
      mainImage: outside1,
      thumbnail1: outside2,
      thumbnail2: outside2
    }
  ];

  const sections = [
    {
      id: 1,
      title: 'DỊCH VỤ'
    },
    {
      id: 2,
      title: 'ĐỜI SỐNG'
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className={sectionIndex > 0 ? 'mt-20 md:mt-24' : ''}>
            {/* Section Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 leading-tight">
              {section.title}
            </h2>

            {/* Two Rows - Each row has 2 content blocks */}
            <div className="space-y-12 md:space-y-16">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {contentBlocks.map((block) => (
                  <div 
                    key={block.id} 
                    className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onPostClick && onPostClick(block)}
                  >
                    {/* Image */}
                    <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden mb-4">
                      <img
                        src={block.image}
                        alt={block.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                      {block.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Row 2 - Same content as Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {contentBlocks.map((block) => (
                  <div 
                    key={`${block.id}-row2`} 
                    className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onPostClick && onPostClick(block)}
                  >
                    {/* Image */}
                    <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden mb-4">
                      <img
                        src={block.image}
                        alt={block.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-3">
                      {block.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSession2;
