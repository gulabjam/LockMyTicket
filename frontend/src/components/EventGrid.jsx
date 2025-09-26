import React from 'react';
import EventCard from './EventCard';

const EventGrid = () => {
  // Example events data
  const events = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&w=800',
      title: 'Summer Beach Party'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&w=800',
      title: 'Bollywood Night'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&w=800',
      title: 'EDM Festival'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            image={event.image}
            title={event.title}
            onClick={() => console.log(`Clicked event: ${event.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
