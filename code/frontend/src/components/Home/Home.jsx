import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import QuickViewModal from '../QuickView/QuickViewModal';
<<<<<<< HEAD
import { VehicleContext } from '../../context/VehicleContext';
import { Calendar, User, Search, MapPin, Map, Navigation, Star, Compass, Wind, CarFront } from 'lucide-react';

// Sample Property Data
const properties = [
  {
    id: 1,
    name: "Cinnamon Lodge Authentic Resort",
    location: "Habarana",
    price: "45,000",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1588610580916-2deac38cf945?q=80&w=600&auto=format&fit=crop",
    description: "Spread over 27 acres of lush forested land, this 5-star resort offers air-conditioned comfort with sweeping views of the Habarana Lake.",
    amenities: ["Pool", "Spa", "Wild Safari", "Free WiFi"],
    height: "h-96", // For masonry layout variation
  },
  {
    id: 2,
    name: "Galle Fort Heritage Villa",
    location: "Galle",
    price: "32,000",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
    description: "Experience the Dutch colonial era in this beautifully restored villa located right in the heart of the historic Galle Fort.",
    amenities: ["Ocean View", "Historical", "Breakfast"],
    height: "h-64",
  },
  {
    id: 3,
    name: "Ella Jungle Resort",
    location: "Ella",
    price: "28,000",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1625736300986-628d09ca0818?q=80&w=600&auto=format&fit=crop",
    description: "Surrounded by wild jungles, bubbling streams and waterfalls. Perfect for the ultimate nature retreat and digital detox.",
    amenities: ["Nature Walks", "Vegan Food", "Yoga"],
    height: "h-80",
  },
  {
    id: 4,
    name: "Shangri-La Colombo",
    location: "Colombo",
    price: "65,000",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1587397750796-039cff28bc63?q=80&w=800&auto=format&fit=crop",
    description: "Experience the pinnacle of luxury at the heart of the capital with panoramic views of the Indian Ocean.",
    amenities: ["Infinity Pool", "Gym", "Fine Dining"],
    height: "h-72",
  },
  {
    id: 5,
    name: "Kandy View Hotel",
    location: "Kandy",
    price: "15,000",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1580971597148-9b882eb75bce?q=80&w=800&auto=format&fit=crop",
    description: "A cozy retreat overlooking the ancient city and the Temple of the Sacred Tooth Relic.",
    amenities: ["City View", "Restaurant"],
    height: "h-80",
  },
  {
    id: 6,
    name: "Mirissa Beach Cabanas",
    location: "Mirissa",
    price: "22,000",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    description: "Wake up to the sound of crashing waves in these rustic yet comfortable beachfront cabanas.",
    amenities: ["Beachfront", "Surfing", "Bar"],
    height: "h-64",
  }
];
=======
import { Calendar, User, Search, MapPin, Map, Navigation, Star, Compass, Wind, Plus, Building, Car } from 'lucide-react';
>>>>>>> origin/update-backend1

// Removed mock properties
const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
<<<<<<< HEAD
  const { selectedVehicle } = useContext(VehicleContext);
=======
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
>>>>>>> origin/update-backend1

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

        {/* Selected Vehicle Banner */}
        <div className="mb-8">
          {selectedVehicle ? (
            <div className="bg-white rounded-2xl shadow-lg border border-sunset-gold/30 p-4 flex flex-col sm:flex-row items-center gap-6 animate-slide-up">
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sunset-orange font-bold text-sm mb-1 uppercase tracking-wider">
                  <CarFront size={16} />
                  <span>Your Selected Ride</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedVehicle.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{selectedVehicle.type} • {selectedVehicle.capacity}</p>
              </div>
              <div className="shrink-0">
                <Link to="/vehicles" className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold transition-colors">
                  Change Vehicle
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-sunset-orange shrink-0">
                  <CarFront size={24} />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">Need a ride?</h3>
                  <p className="text-gray-500 text-sm">Please select a vehicle for your journey.</p>
                </div>
              </div>
              <Link to="/vehicles" className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all whitespace-nowrap">
                Browse Vehicles
              </Link>
            </div>
          )}
        </div>

        {/* Category Pills (Interactive Map / Guides / etc) */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 mb-4">
<<<<<<< HEAD
=======
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

>>>>>>> origin/update-backend1
          <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-teal/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
            <Compass className="text-sunset-teal group-hover:rotate-45 transition-transform" />
            <span className="font-semibold">Interactive Map</span>
          </button>
          
          {!user && (
            <>
              <Link to="/register?role=hotel_owner" className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-gold/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
                <Building className="text-sunset-gold group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Become a Hotel Owner</span>
              </Link>
              <Link to="/register?role=tour_guide" className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-teal/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
                <MapPin className="text-sunset-teal group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Become a Tour Guide</span>
              </Link>
              <Link to="/register?role=vehicle_owner" className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 hover:border-sunset-orange/30 hover:shadow-lg transition-all text-gray-800 whitespace-nowrap group">
                <Car className="text-sunset-orange group-hover:scale-110 transition-transform" />
                <span className="font-semibold">List Your Vehicle</span>
              </Link>
            </>
          )}

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

        {/* Join Our Platform CTA Section */}
        {!user && (
          <div className="mb-12 mt-20 bg-gradient-to-br from-sunset-dark to-[#1a2f3a] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sunset-orange/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sunset-teal/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Partner with Pearl Path</h2>
              <p className="text-gray-300 text-lg mb-10">Expand your reach and grow your business by listing your services on Sri Lanka's premier travel platform.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add Hotel */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-sunset-gold/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Building size={32} className="text-sunset-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Can you add a Hotel?</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">List your property and reach thousands of travelers looking for the perfect stay.</p>
                  <Link to="/register?role=hotel_owner" className="w-full py-3 px-4 bg-sunset-gold text-sunset-dark font-bold rounded-xl hover:bg-white transition-colors">
                    Register Hotel
                  </Link>
                </div>

                {/* Add Guide */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-sunset-teal/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin size={32} className="text-sunset-teal" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Can you add a Guide?</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">Share your local expertise and guide tourists through unforgettable experiences.</p>
                  <Link to="/register?role=tour_guide" className="w-full py-3 px-4 bg-sunset-teal text-white font-bold rounded-xl hover:bg-white hover:text-sunset-teal transition-colors">
                    Register Guide
                  </Link>
                </div>

                {/* Add Vehicle */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-sunset-orange/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Car size={32} className="text-sunset-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Can you add a Vehicle?</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">Provide transportation services and help travelers navigate the island comfortably.</p>
                  <Link to="/register?role=vehicle_owner" className="w-full py-3 px-4 bg-sunset-orange text-white font-bold rounded-xl hover:bg-white hover:text-sunset-orange transition-colors">
                    Register Vehicle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Home;
