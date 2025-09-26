import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-orange-500">
              LockMyTicket
            </span>
          </div>
          
          <div className="flex space-x-6 text-sm">
            {/* Privacy link removed */}
            {/* Terms link removed */}
            {/* Support link removed */}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-4 mt-4 text-center">
                  <p className="text-gray-400 text-sm">
                    © 2025 LockMyTicket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
