import aboutUsDoctor1 from '../assets/Aboutus_Doctor1.png';

const AboutUsSession4 = () => {
  const staffMembers = [
    {
      id: 1,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 2,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 3,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 4,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 5,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 6,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 7,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    },
    {
      id: 8,
      name: 'John Doe',
      designation: 'Staff Designation',
      description: 'Lorem ipsum dolor sit amet consectetur. Augue non malesuada placerat faucibus nam purus sem. Urna pulvinar porttitor dignissim congue pellentesque ac hac. Viverra donec nulla id enim posuere donec morbi dolor.',
      image: aboutUsDoctor1
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 text-center leading-tight">
          ĐẶT NIỀM TIN - TRAO AN BÌNH
        </h2>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Name */}
                <h3 className="text-lg md:text-xl font-raleway-bold text-gray-800 mb-1">
                  {member.name}
                </h3>

                {/* Designation */}
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular mb-3">
                  {member.designation}
                </p>

                {/* Description */}
                <p className="text-xs md:text-sm text-gray-500 font-raleway-regular leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession4;
