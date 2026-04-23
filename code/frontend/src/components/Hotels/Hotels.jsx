import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Lock } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import HotelCard from './HotelCard';

// Mock Data
const MOCK_HOTELS = [
  {
    id: 1,
    propertyName: "Grand Galle Fort Hotel",
    city: "Galle",
    starRating: 5,
    pricePerNight: 45000,
    amenities: ["Free WiFi", "Pool", "Breakfast Included", "Spa", "Ocean View"],
    description: "Experience the ultimate luxury in the heart of the historic Galle Fort. Our restored Dutch-colonial villa offers world-class amenities and breathtaking views of the Indian Ocean.",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    propertyName: "Ella Jungle Resort",
    city: "Ella",
    starRating: 4,
    pricePerNight: 28000,
    amenities: ["Free WiFi", "Breakfast Included", "Nature Trails", "Restaurant"],
    description: "Nestled deep within the lush mountains of Ella, this eco-resort provides a serene escape surrounded by waterfalls, mist, and tropical flora.",
    imageUrl: "https://images.unsplash.com/photo-1625736300986-628d09ca0818?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    propertyName: "Kandy View Boutique",
    city: "Kandy",
    starRating: 4,
    pricePerNight: 22000,
    amenities: ["Free WiFi", "Pool", "City View", "Restaurant", "Room Service"],
    description: "Overlooking the majestic Kandy Lake and the Temple of the Tooth, this boutique hotel combines traditional Kandyan architecture with modern comforts.",
    imageUrl: "https://images.unsplash.com/photo-1580971597148-9b882eb75bce?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    propertyName: "Mirissa Beach Cabanas",
    city: "Mirissa",
    starRating: 3,
    pricePerNight: 15000,
    amenities: ["Free WiFi", "Beachfront", "Bar", "A/C"],
    description: "Step right out of your secluded cabana onto the golden sands of Mirissa beach. Ideal for surfers, beach lovers, and whale watchers.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    propertyName: "Sigiriya Rock Haven",
    city: "Sigiriya",
    starRating: 5,
    pricePerNight: 35000,
    amenities: ["Free WiFi", "Pool", "Spa", "Breakfast Included", "Safari Arranged"],
    description: "Located just minutes from the ancient Lion Rock, this premium resort features a sprawling pool, ayurvedic spa, and stunning views of the fortress.",
    imageUrl: "https://images.unsplash.com/photo-1588610580916-2deac38cf945?q=80&w=800&auto=format&fit=crop"
  }
];

const AMENITY_FILTERS = ["Free WiFi", "Pool", "Breakfast Included", "Spa", "Ocean View", "Beachfront", "A/C"];

const Hotels = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hotels, setHotels] = useState(MOCK_HOTELS);
  const [filteredHotels, setFilteredHotels] = useState(MOCK_HOTELS);

  const [searchCity, setSearchCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchHotels = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/hotels');
        const data = await response.json();
        
        // Map backend to frontend schema
        const backendHotels = data.response.map(h => ({
          id: h._id,
          propertyName: h.name,
          city: h.location,
          starRating: h.starRating || 4,
          pricePerNight: h.pricePerNight,
          amenities: h.amenities || ["Free WiFi", "A/C"],
          description: h.description,
          imageUrl: h.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"
        }));
        
        setHotels([...MOCK_HOTELS, ...backendHotels]);
        setFilteredHotels([...MOCK_HOTELS, ...backendHotels]);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = hotels;

    // City Filter
    if (searchCity) {
      result = result.filter(h => h.city.toLowerCase().includes(searchCity.toLowerCase()));
    }

    // Price Filter
    if (minPrice) {
      result = result.filter(h => h.pricePerNight >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(h => h.pricePerNight <= parseInt(maxPrice));
    }

    // Amenities Filter
    if (selectedAmenities.length > 0) {
      result = result.filter(h => 
        selectedAmenities.every(amenity => h.amenities.includes(amenity))
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'top_rated') {
      result.sort((a, b) => b.starRating - a.starRating);
    }

    setFilteredHotels([...result]);
  }, [hotels, searchCity, minPrice, maxPrice, selectedAmenities, sortBy]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  if (loading) return null;

  // Unauthenticated View
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-20">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-sunset-orange" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Exclusive Access</h2>
            <p className="text-gray-600 mb-8 font-medium">Please sign in to your PearlPath account to view, search, and book available accommodations across Sri Lanka.</p>
            <Link 
              to="/login"
              className="block w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Sign In to Continue
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-sunset-teal font-bold hover:underline">Register here</Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />
      
      {/* Top Banner */}
      <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Find Your Perfect Stay</h1>
          <p className="text-xl text-gray-300 font-light">Explore handpicked hotels, villas, and resorts across Sri Lanka.</p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar (25%) */}
          <aside className="lg:w-1/4 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="text-sunset-teal" />
                <h2 className="text-lg font-extrabold">Filters</h2>
              </div>

              {/* City Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search city e.g. Galle" 
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 focus:border-sunset-teal transition-all text-sm"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Price Per Night (LKR)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 transition-all text-sm"
                  />
                  <span className="text-gray-400 font-medium">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Popular Amenities</label>
                <div className="space-y-3">
                  {AMENITY_FILTERS.map(amenity => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-sunset-orange checked:border-sunset-orange transition-colors cursor-pointer"
                        />
                        {selectedAmenities.includes(amenity) && (
                          <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-600 text-sm font-medium group-hover:text-sunset-orange transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content (75%) */}
          <main className="lg:w-3/4">
            {/* Header / Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 sm:mb-0 space-x-1">
                <span>{filteredHotels.length}</span>
                <span className="text-gray-500 font-medium">properties found</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold rounded-xl focus:ring-sunset-teal focus:border-sunset-teal block p-2.5 cursor-pointer outline-none"
                >
                  <option value="recommended">Our Recommendations</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="top_rated">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Hotel List */}
            <div className="space-y-6">
              {filteredHotels.length > 0 ? (
                filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
                  <Filter size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your search filters to find more options.</p>
                  <button 
                    onClick={() => {
                      setSearchCity('');
                      setMinPrice('');
                      setMaxPrice('');
                      setSelectedAmenities([]);
                    }}
                    className="mt-6 text-sunset-teal font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
