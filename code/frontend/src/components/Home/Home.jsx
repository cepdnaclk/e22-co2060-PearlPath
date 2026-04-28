import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import QuickViewModal from '../QuickView/QuickViewModal';
import { Calendar, User, Search, MapPin, Map, Navigation, Star, Compass, Wind, Plus } from 'lucide-react';

// Removed mock properties
const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse user', e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    fetch('http://127.0.0.1:3001/api/hotels')
      .then(res => res.json())
      .then(data => {
        if (data && data.response) {
          setProperties(data.response);
        }
      })
      .catch(err => console.error("Error fetching hotels:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit">
      <Navbar />

      {/* Quick View Modal */}
      {selectedProperty && (
        <QuickViewModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* HERO SECTION with Full Screen Video Background */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Abstract Video Background via YouTube iframe overlay */}
        <div className="absolute inset-0 z-0 bg-sunset-dark pointer-events-none">
          <video
            className="w-full h-full object-cover opacity-70"
            src="/sri-lanka.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-sunset-dark/60 via-transparent to-[#FDFBF7]"></div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20 animate-slide-up">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-sm font-medium">
            ✨ Discover the Pearl of the Indian Ocean
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-xl">
            Where your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-gold to-sunset-orange">Adventure</span> Begins.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 font-light max-w-3xl mx-auto drop-shadow-md">
            Experience the vibrant sunsets, ancient cities, and untamed wildlife of Sri Lanka. Handpicked stays for the modern explorer.
          </p>

          {/* Floating Search Widget */}
          <div className="bg-white/95 backdrop-blur-xl p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto border border-white/40 transform hover:scale-[1.01] transition-transform">

            <div className="flex-1 w-full flex items-center bg-transparent rounded-full px-4 py-2">
              <MapPin className="text-sunset-teal mr-3" size={24} />
              <input type="text" placeholder="Where do you want to go?" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-lg" />
            </div>

            <button className="w-full md:w-auto bg-gradient-to-r from-sunset-orange to-sunset-gold text-white p-4 rounded-full shadow-lg hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-30">

        {/* Category Pills (Interactive Map / Guides / etc) */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 mb-4">
          {user?.role === 'hotel_owner' && (
            <Link to="/add-property" className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sunset-gold to-sunset-orange rounded-full shadow-md hover:shadow-lg transition-all text-white whitespace-nowrap group">
              <Plus className="text-white group-hover:scale-125 transition-transform" />
              <span className="font-bold">Add Hotels</span>
            </Link>
          )}

          {user?.role === 'vehicle_owner' && (
            <Link to="/add-vehicle" className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sunset-orange to-sunset-gold rounded-full shadow-md hover:shadow-lg transition-all text-white whitespace-nowrap group">
              <Plus className="text-white group-hover:scale-125 transition-transform" />
              <span className="font-bold">Add Vehicles</span>
            </Link>
          )}

          <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-teal/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
            <Compass className="text-sunset-teal group-hover:rotate-45 transition-transform" />
            <span className="font-semibold">Interactive Map</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-orange/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
            <Star className="text-sunset-orange group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Top Rated</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-gold/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
            <Wind className="text-sunset-gold group-hover:animate-spin transition-transform" />
            <span className="font-semibold">Experiences</span>
          </button>
        </div>

        {/* EXPLORATION GRID (Masonry Layout) */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">The Exploration Grid</h2>
          <p className="text-gray-500 mb-8 font-medium">Curated stays matching the Pearl Path standard.</p>

          <div className="masonry-grid">
            {properties.map((property, index) => {
              const heights = ["h-96", "h-64", "h-80", "h-72", "h-80", "h-64"];
              const propertyHeight = property.height || heights[index % heights.length];
              
              return (
              <div
                key={property._id || property.id}
                className="masonry-item relative group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedProperty(property)}
              >
                {/* Image */}
                <div className={`${propertyHeight} w-full bg-gray-200 relative overflow-hidden`}>
                  <img
                    src={property.imageUrl || (property.images && property.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop"}
                    alt={property.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/90 via-sunset-dark/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white text-left">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="flex items-center gap-1 text-sunset-gold mb-1">
                        <MapPin size={14} />
                        <span className="text-xs uppercase tracking-wider font-bold">{property.location}</span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight">{property.name}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-1">
                      {property.starRating || property.rating || "4.5"} <Star size={12} className="text-sunset-gold fill-current" />
                    </div>
                  </div>

                  {/* Hover Reveal Price */}
                  <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 flex items-center mt-2">
                    <span className="text-sm text-gray-300">from</span>
                    <span className="text-lg font-bold text-sunset-gold ml-2">LKR {property.pricePerNight ? property.pricePerNight.toLocaleString() : property.price}</span>
                  </div>
                </div>

                {/* Quick View Button Hover State */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all text-sunset-orange shadow-lg">
                  <Navigation size={20} className="transform rotate-45" />
                </div>
              </div>
            )})}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
