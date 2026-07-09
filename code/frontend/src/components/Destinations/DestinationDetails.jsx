import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import { destinations } from '../../data/destinations';
import HotelCard from '../Hotels/HotelCard';
import TourGuideCard from '../TourGuides/TourGuideCard';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = destinations.find(d => d.id === parseInt(id));

  const [hotels, setHotels] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (destination) {
      fetchData();
    }
  }, [destination]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use query parameter to filter by location
      const locationQuery = encodeURIComponent(destination.location);
      
      const hotelsResponse = await fetch(`http://localhost:3001/api/hotels?location=${locationQuery}`);
      const hotelsData = await hotelsResponse.json();
      
      const guidesResponse = await fetch(`http://localhost:3001/api/tour-guides?location=${locationQuery}`);
      const guidesData = await guidesResponse.json();
      
      if (hotelsData.response) {
        setHotels(hotelsData.response);
      }
      if (Array.isArray(guidesData)) {
        setTourGuides(guidesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center">
        <h2>Destination not found</h2>
        <button onClick={() => navigate('/destinations')} className="ml-4 text-sunset-orange">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-[#0f0f11] to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => navigate('/destinations')}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Destinations
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 rounded-full text-sm font-semibold tracking-wider uppercase">
                {destination.category}
              </span>
              <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                <Star size={14} className="text-sunset-gold fill-sunset-gold" />
                <span className="font-bold text-white text-sm">{destination.rating}</span>
                <span className="text-gray-400 text-xs">({destination.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={20} className="text-sunset-teal" />
              <span className="text-lg">{destination.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About this Destination</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-12">
              {destination.description}
            </p>

            <div className="space-y-16">
              {/* Hotels Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  Best Hotels in {destination.location}
                  <span className="text-sm font-normal text-gray-400 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    {hotels.length} found
                  </span>
                </h3>
                
                {loading ? (
                  <div className="text-gray-400">Loading hotels...</div>
                ) : hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotels.map(hotel => (
                      <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1a1a1f] p-8 rounded-2xl border border-white/5 text-center">
                    <p className="text-gray-400 mb-4">No properties listed in this area yet. Are you a hotel owner? Be the first to list your property!</p>
                    <Link to="/register?role=hotel_owner" className="inline-flex px-5 py-2.5 bg-[#FF8C00] text-white font-bold rounded-xl text-xs hover:bg-opacity-90 transition-all">
                      Become a Hotel Owner
                    </Link>
                  </div>
                )}
              </section>

              {/* Tour Guides Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  Top Tour Guides in {destination.location}
                  <span className="text-sm font-normal text-gray-400 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    {tourGuides.length} found
                  </span>
                </h3>

                {loading ? (
                  <div className="text-gray-400">Loading guides...</div>
                ) : tourGuides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tourGuides.map(guide => (
                      <TourGuideCard key={guide._id} guide={guide} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1a1a1f] p-8 rounded-2xl border border-white/5 text-center">
                    <p className="text-gray-400">No tour guides currently available in this location.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Sidebar / Extra Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1f] p-6 rounded-3xl border border-white/5 sticky top-24">
              <h3 className="font-bold text-xl mb-4">Plan Your Visit</h3>
              <p className="text-gray-400 mb-6">Discover the best experiences, accommodations, and guided tours around {destination.name}.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Popularity</span>
                  <span className="text-sunset-gold font-bold">{destination.popular ? 'High' : 'Moderate'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Category</span>
                  <span className="text-sunset-teal font-bold">{destination.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
