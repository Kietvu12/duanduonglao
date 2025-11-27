import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/a52b4807ebf467aa3ee5.jpg';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/ve-chung-toi', label: 'Về chúng tôi' },
    { path: '/dich-vu', label: 'Dịch vụ' },
    { path: '/tien-ich', label: 'Tiện ích cho bạn' },
    { path: '/blog', label: 'Blog' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logoImage}
                alt="XUÂN HOA Logo"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain"
                loading="eager"
                decoding="async"
                style={{ 
                  width: 'auto',
                  height: '100%',
                  maxHeight: '64px',
                  display: 'block'
                }}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('Failed to load logo image');
                }}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm lg:text-base font-raleway-regular transition-colors duration-200 whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Button - Desktop Only */}
          <div className="hidden md:flex items-center">
            <Link
              to="/lien-he"
              className="px-6 py-2.5 bg-primary text-white rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-sm shadow-md hover:bg-primary-light transition-colors duration-200 whitespace-nowrap"
            >
              Liên lạc với chúng tôi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-4">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`text-sm font-raleway-regular transition-colors duration-200 px-4 py-2 ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Contact Button - Mobile */}
              <Link
                to="/lien-he"
                onClick={closeMobileMenu}
                className="mx-4 px-6 py-2.5 bg-primary text-white rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-sm shadow-md hover:bg-primary-light transition-colors duration-200 text-center"
              >
                Liên lạc với chúng tôi
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

