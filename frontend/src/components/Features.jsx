import React from 'react';
import { Search, Ticket, Clock, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Discover Events",
      description: "Find parties and events happening near you with smart location-based search."
    },
    {
      icon: Ticket,
      title: "Instant Booking",
      description: "Secure your spot with instant ticket booking and mobile QR codes."
    },
    {
      icon: Clock,
      title: "Easy Management",
      description: "Venues can create and manage events with our intuitive dashboard."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe payment processing with integrated fraud protection."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> Party Smart</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group relative overflow-hidden">
                {index === 0 && (
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                      alt="DJ mixing" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                      alt="Concert tickets" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.pexels.com/photos/6962993/pexels-photo-6962993.jpeg?auto=compress&w=400&h=300&fit=crop" 
                      alt="Person calculating on a notebook" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {index === 3 && (
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&w=400&h=300&fit=crop" 
                      alt="Black payment terminal" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-3 rounded-lg w-fit mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 relative z-10">{feature.title}</h4>
                <p className="text-gray-400 text-sm relative z-10">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
