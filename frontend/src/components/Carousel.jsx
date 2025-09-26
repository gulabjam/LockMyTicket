import React from 'react';

const images = [
  {
    src: 'https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&w=800',
    alt: 'Smiling man standing and dancing near smiling woman surrounded with people',
  },
  {
    src: 'https://images.pexels.com/photos/11993794/pexels-photo-11993794.jpeg?auto=compress&w=800',
    alt: 'Young men smoking shisha',
  },
  {
    src: 'https://images.pexels.com/photos/8448535/pexels-photo-8448535.jpeg?auto=compress&w=800',
    alt: 'People having fun at the concert',
  },
  {
    src: 'https://images.pexels.com/photos/5086619/pexels-photo-5086619.jpeg?auto=compress&w=800',
    alt: 'Couple in a restaurant having a date',
  },
];

const Carousel = ({ background = false, interval = 4000 }) => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!background) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [background, interval]);

  return background ? (
    <div className="absolute inset-0 w-full h-full z-0">
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="w-full h-full object-cover opacity-40 transition-all duration-1000"
        style={{ position: 'absolute', inset: 0, background: '#111' }}
      />
    </div>
  ) : (
    <div className="relative w-full max-w-2xl mx-auto my-8">
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="rounded-lg w-full h-64 object-cover shadow-lg"
      />
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white px-3 py-1 rounded-full hover:bg-gray-700"
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white px-3 py-1 rounded-full hover:bg-gray-700"
        aria-label="Next Slide"
      >
        &#8594;
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
