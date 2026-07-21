import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, ArrowRight, Compass, Filter } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import { destinations } from '../../data/destinations';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-sunset-orange/10 blur-[120px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-sunset-teal/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm animate-fade-in-up">
              <Compass className="text-sunset-gold" size={18} />
              <span className="text-sm font-medium tracking-wider text-sunset-gold uppercase">Explore The Pearl</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up animation-delay-100">
              Discover Sri Lanka's <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-orange to-sunset-gold">
                Hidden Treasures
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 animate-fade-in-up animation-delay-200">
              From ancient rock fortresses to pristine golden beaches, explore the most breathtaking destinations the island has to offer.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group animate-fade-in-up animation-delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-orange to-sunset-gold rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-[#1a1a1f] border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-all focus-within:border-sunset-orange/50 focus-within:bg-[#1f1f25]">
                <div className="pl-4 pr-2 text-gray-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search destinations, cities, or categories..." 
                  className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-sunset-orange/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 shrink-0">
                  <span>Explore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories / Filter Bar Mockup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {['All', 'Beaches', 'Historic', 'Nature & Wildlife', 'Landmarks', 'Temples'].map((cat, idx) => (
              <button 
                key={idx} 
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${idx === 0 ? 'bg-white/10 text-white border border-white/20' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5">
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, index) => (
              <div 
                key={dest.id} 
                className="group bg-[#1a1a1f] rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sunset-orange/10 flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                      {dest.category}
                    </span>
                  </div>

                  {/* Popular Badge */}
                  {dest.popular && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-sunset-orange to-sunset-gold rounded-full text-xs font-bold text-white shadow-lg">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow relative">
                  {/* Rating Float */}
                  <div className="absolute -top-6 right-6 bg-[#222228] border border-white/10 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1 z-20">
                    <Star size={14} className="text-sunset-gold fill-sunset-gold" />
                    <span className="font-bold text-white text-sm">{dest.rating}</span>
                    <span className="text-gray-500 text-xs">({dest.reviews})</span>
                  </div>

                  <div className="flex items-start justify-between mb-3 mt-2">
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-sunset-orange transition-colors">
                      {dest.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 mb-4">
                    <MapPin size={16} className="text-sunset-teal" />
                    <span className="text-sm font-medium">{dest.location}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {dest.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <button onClick={() => navigate(`/destinations/${dest.id}`)} className="text-white font-bold text-sm flex items-center gap-2 group/btn">
                      Explore Place 
                      <ArrowRight size={16} className="text-sunset-orange transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Destinations;
