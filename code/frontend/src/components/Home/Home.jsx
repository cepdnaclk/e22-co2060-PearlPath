import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import QuickViewModal from '../QuickView/QuickViewModal';
import { VehicleContext } from '../../context/VehicleContext';
import { Calendar, User, Search, MapPin, Map, Navigation, Star, Compass, Wind, CarFront, Plus, Building, Car, ClipboardList } from 'lucide-react';

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { selectedVehicle } = useContext(VehicleContext);
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
    const beautifulPlaces = [
      {
        _id: 'place1',
        name: 'Sigiriya Rock Fortress',
        location: 'Sigiriya',
        image: 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        description: 'An ancient rock fortress and palace ruin situated in the central Matale District of Sri Lanka. It is a UNESCO World Heritage Site.',
        amenities: ['Historical Site', 'Hiking', 'Photography', 'Viewpoint'],
        price: 'Ticketed'
      },
      {
        _id: 'place2',
        name: 'Nine Arches Bridge',
        location: 'Ella',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.8',
        description: 'The Nine Arches Bridge also called the Bridge in the Sky, is a viaduct bridge in Sri Lanka. It is one of the best examples of colonial-era railway construction in the country.',
        amenities: ['Sightseeing', 'Photography', 'Nature Walk'],
        price: 'Free'
      },
      {
        _id: 'place3',
        name: 'Yala National Park',
        location: 'Yala',
        image: 'https://images.unsplash.com/photo-1544839848-1db253457a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1544839848-1db253457a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.7',
        description: 'Yala is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. Known for its high density of leopards.',
        amenities: ['Safari', 'Wildlife', 'Photography', 'Nature Tour'],
        price: 'Ticketed'
      },
      {
        _id: 'place4',
        name: 'Galle Dutch Fort',
        location: 'Galle',
        image: 'https://images.unsplash.com/photo-1586514781444-24e03b4dcb62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1586514781444-24e03b4dcb62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.8',
        description: 'Galle Fort, in the Bay of Galle on the south west coast of Sri Lanka, was built first in 1588 by the Portuguese.',
        amenities: ['Historical Site', 'Shopping', 'Dining', 'Sunset View'],
        price: 'Free'
      },
      {
        _id: 'place5',
        name: 'Temple of the Tooth',
        location: 'Kandy',
        image: 'https://images.unsplash.com/photo-1625732152203-b0e6fb36c0a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1625732152203-b0e6fb36c0a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        description: 'Sri Dalada Maligawa or the Temple of the Sacred Tooth Relic is a Buddhist temple in the city of Kandy, Sri Lanka.',
        amenities: ['Religious Site', 'Cultural', 'Museum'],
        price: 'Ticketed'
      },
      {
        _id: 'place6',
        name: 'Mirissa Beach',
        location: 'Mirissa',
        image: 'https://images.unsplash.com/photo-1578330756770-b88a75e0df79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1578330756770-b88a75e0df79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: '4.7',
        description: 'Mirissa and its breathtaking sandy beach pretty much transforms your dreams and visions of a tropical paradise into an everyday reality.',
        amenities: ['Beach', 'Surfing', 'Whale Watching', 'Nightlife'],
        price: 'Free'
      }
    ];
    setProperties(beautifulPlaces);
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

          {/* Floating Search Widget - Only for Tourists */}
          {(!user || user.role === 'tourist') && (
            <div className="bg-white/95 backdrop-blur-xl p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto border border-white/40 transform hover:scale-[1.01] transition-transform">
              <div className="flex-1 w-full flex items-center bg-transparent rounded-full px-4 py-2">
                <MapPin className="text-sunset-teal mr-3" size={24} />
                <input type="text" placeholder="Where do you want to go?" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-lg" />
              </div>
              <button className="w-full md:w-auto bg-gradient-to-r from-sunset-orange to-sunset-gold text-white p-4 rounded-full shadow-lg hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all">
                <Search size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-30">

        {/* Provider Portal View */}
        {user && ['hotel_owner', 'vehicle_owner', 'tour_guide'].includes(user.role) ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 animate-slide-up">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back, {user.firstName || 'Partner'}!</h2>
            <p className="text-gray-500 mb-8 font-medium">Manage your {user.role.replace('_', ' ')} business efficiently on PearlPath.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard Link */}
              <Link to="/provider-bookings" className="bg-gradient-to-br from-sunset-dark to-[#1a2f3a] p-8 rounded-2xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Provider Dashboard</h3>
                  <p className="text-sm text-gray-400">View and manage all your incoming booking requests.</p>
                </div>
              </Link>

              {/* Add Property/Vehicle Link */}
              {user.role === 'hotel_owner' && (
                <Link to="/add-property" className="bg-gradient-to-br from-sunset-gold to-sunset-orange p-8 rounded-2xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Add New Hotel</h3>
                    <p className="text-sm text-white/80">List a new property to attract more tourists.</p>
                  </div>
                </Link>
              )}
              {user.role === 'vehicle_owner' && (
                <Link to="/add-vehicle" className="bg-gradient-to-br from-sunset-orange to-red-500 p-8 rounded-2xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Add New Vehicle</h3>
                    <p className="text-sm text-white/80">List a new vehicle for tourists to rent.</p>
                  </div>
                </Link>
              )}

              {/* My Properties/Vehicles Link */}
              {user.role === 'hotel_owner' && (
                <Link to="/hotels" className="bg-gradient-to-br from-sunset-teal to-emerald-500 p-8 rounded-2xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">My Hotels</h3>
                    <p className="text-sm text-white/80">View and manage your current hotel listings.</p>
                  </div>
                </Link>
              )}
              {user.role === 'vehicle_owner' && (
                <Link to="/vehicles" className="bg-gradient-to-br from-sunset-teal to-emerald-500 p-8 rounded-2xl text-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CarFront size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">My Vehicles</h3>
                    <p className="text-sm text-white/80">View and manage your current vehicle fleet.</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => {
                  return (
                    <div
                      key={property._id || property.id}
                      className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="h-80 w-full bg-gray-200 relative overflow-hidden">
                        <img
                          src={property.imageUrl || (property.images && property.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop"}
                          alt={property.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/90 via-sunset-dark/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-6 text-white text-left">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <div className="flex items-center gap-1 text-sunset-gold mb-1">
                              <MapPin size={14} />
                              <span className="text-xs uppercase tracking-wider font-bold">{property.location}</span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight">{property.name}</h3>
                          </div>
                          <div className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-1 shrink-0">
                            {property.starRating || property.rating || "4.5"} <Star size={12} className="text-sunset-gold fill-current" />
                          </div>
                        </div>

                        <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 flex items-center mt-2">
                          {property.pricePerNight && <span className="text-sm text-gray-300 mr-2">from</span>}
                          <span className="text-lg font-bold text-sunset-gold">{property.pricePerNight ? `LKR ${property.pricePerNight.toLocaleString()}` : property.price}</span>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all text-sunset-orange shadow-lg">
                        <Navigation size={20} className="transform rotate-45" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Join Our Platform CTA Section */}
            {!user && (
              <div className="mb-12 mt-20 bg-gradient-to-br from-sunset-dark to-[#1a2f3a] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
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
                      <h3 className="text-xl font-bold text-white mb-2">List Your Hotel</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-grow">Connect with thousands of travelers seeking their ideal stay and grow your bookings through our platform.</p>
                      <Link to="/register?role=hotel_owner" className="w-full py-3 px-4 bg-sunset-gold text-sunset-dark font-bold rounded-xl hover:bg-white transition-colors">
                        Register Hotel
                      </Link>
                    </div>

                    {/* Add Guide */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-sunset-teal/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin size={32} className="text-sunset-teal" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Join as a Guide</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-grow">Share your local expertise and guide tourists through unforgettable, authentic experiences.</p>
                      <Link to="/register?role=tour_guide" className="w-full py-3 px-4 bg-sunset-teal text-white font-bold rounded-xl hover:bg-white hover:text-sunset-teal transition-colors">
                        Register Guide
                      </Link>
                    </div>

                    {/* Add Vehicle */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-sunset-orange/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Car size={32} className="text-sunset-orange" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Register Your Vehicle</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-grow">Provide transportation services and help travelers navigate the island comfortably and safely.</p>
                      <Link to="/register?role=vehicle_owner" className="w-full py-3 px-4 bg-sunset-orange text-white font-bold rounded-xl hover:bg-white hover:text-sunset-orange transition-colors">
                        Register Vehicle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Home;