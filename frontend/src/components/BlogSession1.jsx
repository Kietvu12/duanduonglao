import blogImage from '../assets/BlogSession1.png';

const BlogSession1 = () => {
  return (
    <section className="w-full relative">
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        <img
          src={blogImage}
          alt="Blog"
          className="w-full h-full object-cover"
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Overlay Content - Text ở góc dưới bên trái */}
        <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-12">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-raleway-bold">
            BLOG
          </h1>
        </div>
      </div>
    </section>
  );
};

export default BlogSession1;
