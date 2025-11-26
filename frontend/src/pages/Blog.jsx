import { useState } from 'react';
import BlogSession1 from '../components/BlogSession1';
import BlogSession2 from '../components/BlogSession2';
import BlogDetail from '../components/BlogDetail';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen">
      <BlogSession1 />
      {selectedPost ? (
        <BlogDetail post={selectedPost} onBack={handleBack} />
      ) : (
        <BlogSession2 onPostClick={handlePostClick} />
      )}
    </div>
  );
};

export default Blog;
