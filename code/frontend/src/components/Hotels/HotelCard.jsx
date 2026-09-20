import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Wind, Waves } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const HotelCard = ({ hotel, isOwnerView, theme = 'light' }) => {
  const { convertPrice, getCurrencySymbol } = useCurrency();
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
    <div className={`rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row ${theme === 'dark' ? 'bg-[#1a1a1f] border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="sm:w-1/3 relative h-48 sm:h-auto overflow-hidden">
        <img 
          src={hotel.imageUrl || (hotel.images && hotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop"} 
          alt={hotel.propertyName || hotel.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className={`text-xl font-bold leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{hotel.propertyName}</h3>
              <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin size={14} className="mr-1" />
                {hotel.city}
              </div>
            </div>
            <div className="flex items-center bg-sunset-gold/10 px-2 py-1 rounded text-sunset-orange font-bold text-sm">
              {hotel.starRating} <Star size={14} className="ml-1 fill-current" />
            </div>
          </div>
          
          <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{hotel.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className={`flex items-center text-xs font-medium px-2 py-1 rounded border ${theme === 'dark' ? 'text-gray-300 bg-white/5 border-white/10' : 'text-gray-600 bg-gray-50 border-gray-100'}`}>
                {renderAmenityIcon(amenity)}
                <span className={renderAmenityIcon(amenity) ? "ml-1" : ""}>{amenity}</span>
              </span>
            ))}
            {hotel.amenities && hotel.amenities.length > 3 && (
              <span className={`text-xs font-medium px-2 py-1 rounded border ${theme === 'dark' ? 'text-gray-400 bg-white/5 border-white/10' : 'text-gray-500 bg-gray-50 border-gray-100'}`}>
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className={`flex justify-between items-end mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <div>
            <span className={`text-xs uppercase tracking-wider font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Price per night</span>
            <div className="text-2xl font-extrabold text-sunset-teal">
              {getCurrencySymbol()} {hotel.pricePerNight ? convertPrice(hotel.pricePerNight).toLocaleString() : 'N/A'}
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
              to={`/hotel/${hotel._id || hotel.id}`}
              className={`${theme === 'dark' ? 'bg-white/10 hover:bg-sunset-teal text-white' : 'bg-gray-900 hover:bg-sunset-teal text-white'} px-5 py-2.5 rounded-xl font-bold transition-colors text-sm`}
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
