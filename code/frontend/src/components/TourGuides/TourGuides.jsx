import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Lock } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import TourGuideCard from './TourGuideCard';

const MOCK_GUIDES = [
  {
    id: 'mock1',
    name: "Kamal Perera",
    location: "Kandy",
    pricePerDay: 5000,
    experienceYears: 8,
    languages: ["English", "Sinhala", "German"],
    bio: "Certified local tour guide in the Kandy and central province region. I specialize in historical temple tours, trekking in the Knuckles range, and providing an authentic local culinary experience.",
    profilePictureUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'mock2',
    name: "Samanthi Silva",
    location: "Galle",
    pricePerDay: 4000,
    experienceYears: 5,
    languages: ["English", "Sinhala", "French"],
    bio: "Passionate about the southern coast! I offer guided walking tours through the UNESCO World Heritage Galle Fort, pointing out secret spots and sharing the rich colonial history.",
    profilePictureUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
  }
];

const LANGUAGE_FILTERS = ["English", "Sinhala", "Tamil", "French", "German", "Spanish", "Russian"];

const TourGuides = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [guides, setGuides] = useState(MOCK_GUIDES);
  const [filteredGuides, setFilteredGuides] = useState(MOCK_GUIDES);

  const [searchLocation, setSearchLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchGuides = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/tour-guides');
        const data = await response.json();
        
        let backendGuides = [];
        if (Array.isArray(data)) {
           backendGuides = data.map(g => ({
            id: g._id,
            name: g.name,
            location: g.location,
            pricePerDay: g.pricePerDay || 0,
            experienceYears: g.experienceYears || 0,
            languages: g.languages && g.languages.length > 0 ? g.languages : ["English"],
            bio: g.bio,
            profilePictureUrl: g.profilePictureUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
          }));
        }
        
        setGuides([...MOCK_GUIDES, ...backendGuides]);
        setFilteredGuides([...MOCK_GUIDES, ...backendGuides]);
      } catch (error) {
        console.error("Failed to fetch tour guides:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = guides;

    if (searchLocation) {
      result = result.filter(g => g.location.toLowerCase().includes(searchLocation.toLowerCase()));
    }

    if (maxPrice) {
      result = result.filter(g => g.pricePerDay <= parseInt(maxPrice));
    }

    if (selectedLanguages.length > 0) {
      result = result.filter(g => 
        selectedLanguages.some(lang => g.languages.includes(lang))
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'experience') {
      result.sort((a, b) => b.experienceYears - a.experienceYears);
    }

    setFilteredGuides([...result]);
  }, [guides, searchLocation, maxPrice, selectedLanguages, sortBy]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-20">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-sunset-orange" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Discover Local Guides</h2>
            <p className="text-gray-600 mb-8 font-medium">Please sign in to view and contact experienced local tour guides.</p>
            <Link 
              to="/login"
              className="block w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />
      
      {/* Top Banner */}
      <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Find a Local Expert</h1>
          <p className="text-xl text-gray-300 font-light">Explore Sri Lanka with experienced and passionate tour guides.</p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="lg:w-1/4 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="text-sunset-teal" />
                <h2 className="text-lg font-extrabold">Filters</h2>
              </div>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="E.g. Ella, Kandy" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 focus:border-sunset-teal transition-all text-sm"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Price Per Day (LKR)</label>
                <input 
                  type="number" 
                  placeholder="Max Price" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal/50 transition-all text-sm"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Languages Spoken</label>
                <div className="space-y-3">
                  {LANGUAGE_FILTERS.map(lang => (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => handleLanguageChange(lang)}
                          className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-sunset-orange checked:border-sunset-orange transition-colors cursor-pointer"
                        />
                        {selectedLanguages.includes(lang) && (
                          <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-600 text-sm font-medium group-hover:text-sunset-orange transition-colors">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 sm:mb-0 space-x-1">
                <span>{filteredGuides.length}</span>
                <span className="text-gray-500 font-medium">guides found</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold rounded-xl focus:ring-sunset-teal focus:border-sunset-teal block p-2.5 cursor-pointer outline-none"
                >
                  <option value="recommended">Our Recommendations</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredGuides.length > 0 ? (
                filteredGuides.map(guide => (
                  <TourGuideCard key={guide.id} guide={guide} />
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
                  <Filter size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No guides found</h3>
                  <p className="text-gray-500">Try adjusting your search filters to find more options.</p>
                  <button 
                    onClick={() => {
                      setSearchLocation('');
                      setMaxPrice('');
                      setSelectedLanguages([]);
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

export default TourGuides;
