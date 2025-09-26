import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
  <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop" 
          alt="Party lights" 
          className="w-full h-full object-cover opacity-50"
        />
  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-orange-800/70"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Nightlife?
        </h2>
  <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Join thousands already using LockMyTicket
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 justify-center">
            <span>Find Events</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300">
            List Your Venue
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
