import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  Compass, 
  Waves, 
  Mountain, 
  Coffee, 
  Camera, 
  Heart, 
  Building, 
  Lock, 
  Music,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { beautifulPlaces } from '../data/destinations';

const DestinationDetails = () => {
  const { id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotelsError, setHotelsError] = useState(null);

  // Helper to map icon names from data to Lucide-React components
  const renderActivityIcon = (iconName) => {
    switch (iconName) {
      case 'Mountain': return <Mountain className="text-sunset-orange shrink-0" size={24} />;
      case 'Compass': return <Compass className="text-sunset-teal shrink-0" size={24} />;
      case 'Waves': return <Waves className="text-sky-500 shrink-0" size={24} />;
      case 'Camera': return <Camera className="text-sunset-gold shrink-0" size={24} />;
      case 'Coffee': return <Coffee className="text-sunset-orange shrink-0" size={24} />;
      case 'Heart': return <Heart className="text-rose-500 fill-current shrink-0" size={24} />;
      case 'Building': return <Building className="text-sunset-gold shrink-0" size={24} />;
      case 'Lock': return <Lock className="text-amber-500 shrink-0" size={24} />;
      case 'Music': return <Music className="text-violet-500 shrink-0" size={24} />;
      default: return <Compass className="text-sunset-teal shrink-0" size={24} />;
    }
  };

  useEffect(() => {
    // 1. Resolve destination details
    // Check if passed via state
    if (locationState.state?.destination) {
      setDestination(locationState.state.destination);
    } else {
      // Fallback: look up by ID from static list
      const found = beautifulPlaces.find(place => place._id === id || place.name.toLowerCase().replace(/\s+/g, '-') === id);
      if (found) {
        setDestination(found);
      }
    }
  }, [id, locationState.state]);

  useEffect(() => {
    if (!destination) return;

    // 2. Fetch nearby hotels based on the location name
    const fetchNearbyHotels = async () => {
      setHotelsLoading(true);
      setHotelsError(null);
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/hotels?location=${encodeURIComponent(destination.location)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch nearby stays.');
        }
        const data = await response.json();
        
        // Map backend response schema
        const mappedHotels = (data.response || []).map(h => ({
          id: h._id,
          name: h.name,
          description: h.description,
          pricePerNight: h.pricePerNight,
          location: h.location,
          starRating: h.starRating || 3,
          imageUrl: h.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
          amenities: h.amenities || []
        }));
        
        setHotels(mappedHotels);
      } catch (err) {
        console.error("Error fetching nearby hotels:", err);
        setHotelsError(err.message);
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchNearbyHotels();
  }, [destination]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-sunset-dark text-white font-outfit flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle size={48} className="text-sunset-orange mb-4" />
          <h2 className="text-3xl font-extrabold mb-2">Destination Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md">We couldn't find the destination you are looking for. Please check the URL or return home.</p>
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold rounded-xl shadow-lg">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-outfit flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[65vh] overflow-hidden bg-sunset-dark">
        <img 
          src={destination.imageUrl || destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover opacity-60 transform scale-102 animate-float"
          style={{ animationDuration: '20s' }}
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-sunset-dark/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent"></div>

        {/* Back navigation */}
        <div className="absolute top-28 left-4 sm:left-8 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/95 backdrop-blur text-gray-800 px-4 py-2.5 rounded-full hover:bg-white transition-all shadow-lg hover:scale-105"
          >
            <ArrowLeft size={18} />
            <span className="font-bold text-sm">Go Back</span>
          </button>
        </div>

        {/* Hero Meta Info */}
        <div className="absolute bottom-16 left-4 sm:left-8 right-4 z-20 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
                <MapPin size={12} className="text-sunset-gold fill-current" />
                {destination.location}
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                destination.price === 'Free' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                  : 'bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30'
              }`}>
                {destination.price}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
              {destination.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur px-5 py-3 rounded-2xl shadow-xl shrink-0 self-start md:self-auto border border-gray-100">
            <span className="text-2xl font-extrabold text-gray-900">{destination.rating}</span>
            <div className="flex flex-col">
              <div className="flex text-sunset-gold">
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
              </div>
              <span className="text-xs text-gray-500 font-bold">Recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left / Main Column: Overview & Activities */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-5 relative inline-block">
                Overview
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-sunset-teal rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {destination.description}
              </p>
              
              {/* Popular Amenities / Features */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">Features & Tags</h3>
              <div className="flex flex-wrap gap-2.5">
                {destination.amenities.map(amenity => (
                  <span 
                    key={amenity} 
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-2xl text-sm font-semibold border border-gray-100 flex items-center gap-1.5"
                  >
                    <CheckCircle size={15} className="text-sunset-teal" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Local Experiences */}
            {destination.activities && destination.activities.length > 0 && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 text-left">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 relative inline-block">
                  Local Experiences
                  <span className="absolute bottom-0 left-0 w-12 h-1 bg-sunset-teal rounded-full"></span>
                </h2>
                <p className="text-gray-500 font-medium mb-8">Curated activities to get the best out of {destination.location}.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {destination.activities.map((activity, idx) => (
                    <div 
                      key={idx} 
                      className="p-6 rounded-2xl border border-gray-100 hover:border-sunset-teal/20 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 group flex gap-4"
                    >
                      <div className="p-3.5 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform h-fit">
                        {renderActivityIcon(activity.icon)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-sunset-teal transition-colors mb-1">{activity.name}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{activity.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Destination Quick Guide */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-sunset-dark to-[#1e2f3b] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden text-left">
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sunset-teal/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sunset-orange/15 rounded-full blur-2xl"></div>

              <h3 className="text-2xl font-extrabold mb-6 relative z-10">Destination Guide</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg text-sunset-gold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Region / Location</h5>
                    <p className="text-sm font-semibold text-white">{destination.location}, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg text-sunset-teal">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Best Time to Visit</h5>
                    <p className="text-sm font-semibold text-white">
                      {destination.location === 'Yala' || destination.location === 'Ella' || destination.location === 'Kandy'
                        ? 'December to April'
                        : 'November to April (Dry Season)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg text-sunset-orange">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Entrance Fee</h5>
                    <p className="text-sm font-semibold text-white">{destination.price === 'Free' ? 'No Entry Fee' : 'Approx. $15 - $35 USD'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Need transport to {destination.location}? Rent a certified vehicle with a verified driver on PearlPath.
                </p>
                <Link 
                  to="/vehicles" 
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold rounded-xl shadow-lg hover:shadow-sunset-orange/40 hover:-translate-y-0.5 transition-all text-sm"
                >
                  Browse Vehicles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Hotels Section - Full Width Bottom Grid */}
        <section className="mt-16 text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Stays Nearby {destination.location}
          </h2>
          <p className="text-gray-500 font-medium mb-8">Handpicked approved accommodation options located close to {destination.name}.</p>

          {hotelsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse h-96 flex flex-col">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hotelsError ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
              <AlertCircle size={24} />
              <span>Failed to load nearby accommodations: {hotelsError}</span>
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
              <Building size={48} className="text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-1">No Stays Found</h4>
              <p className="text-gray-500 text-sm mb-6">No properties listed in this area yet. Are you a hotel owner? Be the first to list your property!</p>
              <Link to="/register?role=hotel_owner" className="inline-flex px-5 py-2.5 bg-sunset-teal text-white font-bold rounded-xl text-sm hover:bg-opacity-90 transition-all">
                Become a Hotel Owner
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div 
                  key={hotel.id} 
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 shadow-sm"
                >
                  <div className="h-48 w-full overflow-hidden relative bg-gray-100">
                    <img 
                      src={hotel.imageUrl} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-extrabold text-sunset-orange shadow-md flex items-center gap-1 border border-gray-100">
                      {hotel.starRating} <Star size={12} className="fill-current text-sunset-gold" />
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-sunset-teal text-xs font-bold uppercase tracking-wider mb-2">
                        <MapPin size={12} />
                        {hotel.location}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-sunset-teal transition-colors">{hotel.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">{hotel.description}</p>
                      
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                              +{hotel.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Price/Night</span>
                        <span className="text-lg font-extrabold text-sunset-teal">LKR {hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : 'N/A'}</span>
                      </div>
                      <Link 
                        to={`/hotel/${hotel.id}`}
                        className="bg-gray-900 text-white hover:bg-sunset-teal px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                      >
                        View Room / Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DestinationDetails;
