import React from 'react';

const QuickViewModal = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sunset-dark/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur text-gray-800 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-sm font-bold text-sunset-orange shadow-md">
            {property.rating} ★ Excellent
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="flex items-center gap-2 text-sunset-teal text-sm font-semibold mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {property.location}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h2>
          <p className="text-gray-500 mb-6">{property.description}</p>
          
          {/* Amenities Grid */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Amenities</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {property.amenities.map(amenity => (
              <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1 border border-gray-200">
                ✔️ {amenity}
              </span>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-100 pt-6 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-sm">Price from</span>
              <div className="text-2xl font-bold tracking-tight text-gray-900">LKR {property.price} <span className="text-sm font-normal text-gray-500">/night</span></div>
            </div>
            <button className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-sunset-orange/30 hover:shadow-sunset-orange/50 transform hover:-translate-y-1 transition-all">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
