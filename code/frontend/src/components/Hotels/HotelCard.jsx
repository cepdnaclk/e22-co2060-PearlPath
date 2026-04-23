import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row overflow-hidden border border-gray-100 mb-6 group">
      
      {/* Left: Image */}
      <div className="sm:w-1/3 xl:w-1/4 h-56 sm:h-auto overflow-hidden shrink-0 relative">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.propertyName} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur pl-2 pr-3 py-1 rounded-full shadow flex items-center gap-1.5 text-sm font-bold">
          <Star size={14} className="text-sunset-gold fill-current" />
          <span>{hotel.starRating}</span>
        </div>
      </div>

      {/* Middle: Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sunset-teal text-sm font-bold tracking-wide uppercase mb-2">
            <MapPin size={16} />
            <span>{hotel.city}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {hotel.propertyName}
          </h3>
          
          {/* Star Rating Visualization */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < hotel.starRating ? "text-sunset-gold fill-current" : "text-gray-200"} 
              />
            ))}
          </div>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {hotel.description}
          </p>
        </div>

        {/* Amenities Snippet */}
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs text-gray-400 font-medium py-1">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Right: Pricing & CTA */}
      <div className="p-5 sm:w-48 bg-gray-50/50 border-t sm:border-t-0 sm:border-l border-gray-100 flex flex-col justify-between items-end sm:items-center text-right sm:text-center shrink-0">
        <div className="mb-4 or sm:mb-0">
          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Starting from</p>
          <p className="text-2xl font-extrabold text-sunset-orange">LKR {hotel.pricePerNight.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Per Night</p>
        </div>
        
        <Link to={`/hotel/${hotel.id}`} className="block w-full sm:w-auto bg-sunset-teal text-center hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
          View Details
        </Link>
      </div>

    </div>
  );
};

export default HotelCard;
