import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const handleProductsClick = () => {
    if (location.pathname === '/products') {
      window.location.reload();
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo_inteiro.png" 
                alt="Qualiden Logo" 
                className="h-36 mt-2 object-contain sm:h-20" // Added responsive styling
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;