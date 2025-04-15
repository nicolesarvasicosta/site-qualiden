import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const phoneNumber = '+55 (11) 98100-1712'; 
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Column */}
          <div className="flex justify-center md:justify-start">
            <img 
              src="/logo_inteiro.png" 
              alt="Qualiden Logo" 
              className="h-36 -mt-4" // Moved the logo up with negative top margin
            />
          </div>

          {/* About Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-playfair font-semibold mb-4">Qualiden do Brasil</h3>
            <p className="text-gray-400 text-center md:text-left">Your trusted partner in international trade</p>
          </div>

          {/* Quick Links Column */}
          <div className="ml-4">
            <h3 className="text-lg font-playfair font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-white">Products</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" /> 
                {phoneNumber}
              </a>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> 
                info@qualiden.com.br
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Qualiden do Brasil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;