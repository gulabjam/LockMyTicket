import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-20 pb-16 bg-gray-900 min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Carousel background />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Parties.
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> Book Tickets.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover events near you and secure tickets instantly. Venues can list events and reach party-goers effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={()=>navigate('/signIn')} className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1">
              Find Parties
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {/* MapPin icon removed */}
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {/* Calendar icon removed */}
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {/* Users icon removed */}
              </div>
            </div>
            {/* Statistics section removed for simplicity */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
