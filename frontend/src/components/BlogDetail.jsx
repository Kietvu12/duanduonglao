import outside1 from '../assets/Outside1.png';
import outside2 from '../assets/Outside2.png';

const BlogDetail = ({ post, onBack }) => {
  // Default post data if not provided
  const postData = post || {
    id: 1,
    title: 'Outdoor Spaces',
    date: '07/11/2025',
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Dịch vụ',
    mainImage: outside1,
    thumbnail1: outside2,
    thumbnail2: outside2
  };

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028] hover:text-primary cursor-pointer" onClick={onBack}>
            {postData.category || 'Dịch vụ'}
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028]">{postData.title}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Title, Date, Short Description */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title - Very Large */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-raleway-bold text-[#242525] leading-tight">
              {postData.title}
            </h1>

            {/* Date */}
            <p className="text-lg md:text-xl font-raleway-light text-black">
              {postData.date}
            </p>

            {/* Short Description */}
            <p className="text-base md:text-lg lg:text-xl text-[#606060] font-raleway-regular leading-relaxed">
              {postData.shortDescription}
            </p>
          </div>

          {/* Right Column - Images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Main Large Image - Vertical (2/3 width) */}
              <div className="md:col-span-3 w-full h-[400px] md:h-[500px] lg:h-[685px] rounded-lg overflow-hidden">
                <img
                  src={postData.mainImage || outside1}
                  alt={postData.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Two Small Images Stacked (1/3 width) */}
              <div className="md:col-span-2 flex flex-col gap-4 h-[400px] md:h-[500px] lg:h-[685px]">
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={postData.thumbnail1 || outside2}
                    alt={`${postData.title} thumbnail 1`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={postData.thumbnail2 || outside2}
                    alt={`${postData.title} thumbnail 2`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section with Image */}
        <div className="mt-12 md:mt-16 lg:mt-20">
          {/* Top Text Content - Full Width */}
          <div className="max-w-7xl space-y-4 text-base md:text-lg lg:text-xl text-black font-raleway-regular leading-[58px] mb-8 md:mb-12">
            <p>
              Điều dưỡng viên chăm sóc hỗ trợ sinh hoạt, theo dõi tình trạng sức khỏe, luyện tập ở nhà của người cao tuổi theo giờ hoặc công việc cụ thể Chăm sóc người cao tuổi tại nhà bị bệnh nhất là những người bị bệnh tai biến nằm một chỗ, mất khả năng tự phục vụ khiến cho cả bệnh nhân lẫn người nhà đều hoang mang không biết phải làm thế nào cho hợp lý. Khi mà cuộc sống hiện đại ngày càng quay cuồng chiếm đi gần hết quỹ thời gian, khiến con người không thể chăm lo cho chu đáo cho ông bà - cha mẹ. Phải làm sao để chăm sóc cho người thân được tốt nhất ? làm sao có thể yên tâm với sức khỏe người thân bị bệnh ?...
            </p>
            <p>
              Người cao tuổi các hệ miễn dịch ngày càng suy yếu đi rất dễ mắc các căn bệnh khác nếu sức khỏe không được đảm bảo. Việc chăm sóc đúng cách sẽ giúp người bệnh nhanh khỏe, mau lành bệnh, giảm thiểu đi những nguy cơ bị biến chứng…Trung tâm chăm sóc sức khỏe người cao tuổi OriHome hiểu được những mối lo ngại của bạn và sẽ giúp bạn điều này. Dịch vụ đa dạng, linh hoạt phong phú, giá cả hợp lý, phù hợp với Người cao tuổi không muốn hoặc không thể đến Trung tâm hay Bệnh viện, có những nhu cầu chăm sóc về Y tế liên tục hoặc ngắt quãng theo đ
            </p>
          </div>

          {/* Center Image - Full Width */}
          <div className="w-full mb-8 md:mb-12">
            <div className="w-full h-64 md:h-80 lg:h-[426px] overflow-hidden rounded-lg">
              <img
                src={outside2}
                alt="Chăm sóc người cao tuổi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Text Content - Full Width */}
          <div className="max-w-7xl space-y-4 text-base md:text-lg lg:text-xl text-black font-raleway-regular leading-[58px] mb-8 md:mb-12">
            <p>
              Điều dưỡng viên chăm sóc hỗ trợ sinh hoạt, theo dõi tình trạng sức khỏe, luyện tập ở nhà của người cao tuổi theo giờ hoặc công việc cụ thể Chăm sóc người cao tuổi tại nhà bị bệnh nhất là những người bị bệnh tai biến nằm một chỗ, mất khả năng tự phục vụ khiến cho cả bệnh nhân lẫn người nhà đều hoang mang không biết phải làm thế nào cho hợp lý. Khi mà cuộc sống hiện đại ngày càng quay cuồng chiếm đi gần hết quỹ thời gian, khiến con người không thể chăm lo cho chu đáo cho ông bà - cha mẹ. Phải làm sao để chăm sóc cho người thân được tốt nhất ? làm sao có thể yên tâm với sức khỏe người thân bị bệnh ?...
            </p>
            <p>
              Người cao tuổi các hệ miễn dịch ngày càng suy yếu đi rất dễ mắc các căn bệnh khác nếu sức khỏe không được đảm bảo. Việc chăm sóc đúng cách sẽ giúp người bệnh nhanh khỏe, mau lành bệnh, giảm thiểu đi những nguy cơ bị biến chứng…Trung tâm chăm sóc sức khỏe người cao tuổi OriHome hiểu được những mối lo ngại của bạn và sẽ giúp bạn điều này. Dịch vụ đa dạng, linh hoạt phong phú, giá cả hợp lý, phù hợp với Người cao tuổi không muốn hoặc không thể đến Trung tâm hay Bệnh viện, có những nhu cầu chăm sóc về Y tế liên tục hoặc ngắt quãng theo đ
            </p>
          </div>

          {/* Bottom Image - Full Width */}
          <div className="w-full">
            <div className="w-full h-64 md:h-80 lg:h-[426px] overflow-hidden rounded-lg">
              <img
                src={outside2}
                alt="Chăm sóc người cao tuổi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;

