import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import session1Image from '../assets/session1.jpg';

const Session1 = () => {
  const fullText = 'CHĂM SÓC BẰNG CẢ TRÁI TIM';
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Typing speed: 100ms per character

    return () => clearInterval(typingInterval);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="w-full relative">
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        {/* Background Image */}
        <img
          src={session1Image}
          alt="Chăm sóc người cao tuổi"
          className="w-full h-full object-cover"
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-white mb-6 leading-tight">
                {displayedText}
                {showCursor && <span className="animate-pulse">|</span>}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-raleway-regular text-white/90 mb-8 leading-relaxed">
                Nơi tôn vinh giá trị tuổi già bằng sự chăm sóc chu đáo và tấm lòng yêu thương. Mỗi ngày tại viện dưỡng lão là một hành trình mới của niềm vui, sự kết nối và bình yên
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dich-vu"
                  className="px-8 py-3 bg-primary text-white rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-base shadow-lg hover:bg-primary-light transition-colors duration-200 text-center"
                >
                  Xem dịch vụ
                </Link>
                <Link
                  to="/lien-he"
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-base hover:bg-white/20 transition-colors duration-200 text-center"
                >
                  Liên hệ ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session1;

