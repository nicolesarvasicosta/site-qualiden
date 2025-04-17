import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProductsClick = () => {
    if (location.pathname === '/products') {
      window.location.reload();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo_inteiro.png" 
                alt="Qualiden Logo" 
                className="h-36 mt-2 object-contain sm:h-20" // Responsive styling
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={handleProductsClick}
              className="text-white hover:text-blue-200 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:text-blue-200 transition-colors font-medium"
            >
              Contact
            </Link>
            <a 
              href="#about-us" // Anchor link to the About Us section
              className="text-white hover:text-blue-200 transition-colors font-medium"
            >
              About Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu} 
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2">
            <div className="flex flex-col space-y-4 p-4">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={() => {
                  handleProductsClick();
                  toggleMobileMenu();
                }}
                className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
              <a 
                href="#about-us" 
                className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                About Us
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;