import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Wind, Waves } from 'lucide-react';

const HotelCard = ({ hotel, isOwnerView }) => {
  // Helper to render amenity icons based on name
  const renderAmenityIcon = (amenity) => {
    switch (amenity) {
      case "Free WiFi": return <Wifi size={14} />;
      case "Pool": return <Waves size={14} />;
      case "Breakfast Included": return <Coffee size={14} />;
      case "A/C": return <Wind size={14} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
      <div className="sm:w-1/3 relative h-48 sm:h-auto overflow-hidden">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.propertyName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{hotel.propertyName}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-1" />
                {hotel.city}
              </div>
            </div>
            <div className="flex items-center bg-sunset-gold/10 px-2 py-1 rounded text-sunset-orange font-bold text-sm">
              {hotel.starRating} <Star size={14} className="ml-1 fill-current" />
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="flex items-center text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                {renderAmenityIcon(amenity)}
                <span className={renderAmenityIcon(amenity) ? "ml-1" : ""}>{amenity}</span>
              </span>
            ))}
            {hotel.amenities && hotel.amenities.length > 3 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Price per night</span>
            <div className="text-2xl font-extrabold text-sunset-teal">
              LKR {hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : 'N/A'}
            </div>
          </div>
          <div className="flex gap-2">
            {isOwnerView && (
              <Link 
                to={`/edit-property/${hotel.id}`}
                className="bg-sunset-gold text-white px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition-colors text-sm shadow-sm"
              >
                Edit
              </Link>
            )}
            <Link 
              to={`/hotel/${hotel.id}`}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sunset-teal transition-colors text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
