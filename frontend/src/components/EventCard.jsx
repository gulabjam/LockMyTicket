import React from 'react';

const EventCard = ({ 
  image, 
  title,
  onClick,
  compact = false,
  icon = false,
  transparent = false
}) => {
  const containerHeight = compact ? 'h-36' : 'h-64';
  const titlePadding = compact ? 'p-3' : 'p-6';
  const titleSize = compact ? 'text-sm' : 'text-2xl';
  const iconSize = compact ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-24 h-24 sm:w-28 sm:h-28';

  const iconBg = transparent ? 'bg-transparent' : 'bg-gray-800/60';
  const cardBg = 'bg-gradient-to-b from-gray-800/10 to-gray-800/5 border border-gray-600/40 hover:from-gray-800/20 hover:border-orange-400/30';

  return (
    <div 
      onClick={onClick}
      className={`relative ${containerHeight} ${cardBg} rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer group`}
    >
      {/* Background Image with Overlay or Icon */}
      {icon ? (
        <div className="flex items-center justify-center h-full">
          <div className={`${iconBg} rounded-full flex items-center justify-center ${iconSize} transition-transform duration-200 group-hover:scale-110`}> 
            <img src={image} alt={title} className="w-11/12 h-11/12 object-contain" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
        </div>
      )}

      {/* Title Container */}
      <div className={`absolute bottom-0 left-0 right-0 ${titlePadding}`}>
        <h3 className={`${titleSize} font-bold text-white line-clamp-2`}>{title}</h3>
      </div>
    </div>
  );
};

export default EventCard;
