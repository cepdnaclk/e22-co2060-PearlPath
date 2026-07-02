import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import VehicleCard from './VehicleCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

const Vehicles = () => {
  const { user, authFetch } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    type: 'All',
    maxPrice: 40000,
    autoOnly: false,
    acOnly: false
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let response;
        if (user && user.role === 'vehicle_owner') {
          response = await authFetch('http://127.0.0.1:3001/api/vehicles/owner');
        } else {
          response = await fetch('http://127.0.0.1:3001/api/vehicles');
        }
        
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    
    fetchVehicles();
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.type !== 'All' && vehicle.vehicleType !== filters.type) return false;
    if (vehicle.pricePerDay > filters.maxPrice) return false;
    if (filters.autoOnly && vehicle.transmission !== 'Auto') return false;
    if (filters.acOnly && !vehicle.hasAC) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sunset-orange to-sunset-gold pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {user?.role === 'vehicle_owner' ? 'My Fleet' : 'Find Your Perfect Ride'}
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            {user?.role === 'vehicle_owner' ? 'Manage your registered vehicles and rentals.' : 'From affordable TukTuks to luxury vans, explore our wide range of vehicles for your Sri Lankan adventure.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar (Filters) - 25% */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <SlidersHorizontal size={20} className="text-sunset-orange" />
                <h2 className="text-xl font-bold text-slate-900">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Vehicle Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange text-slate-700 font-medium"
                  >
                    <option value="All">All Types</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="TukTuk">TukTuk</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Max Price / Day
                    </label>
                    <span className="text-sm font-bold text-sunset-orange">
                      LKR {filters.maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="maxPrice"
                    min="1000"
                    max="50000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full accent-sunset-orange"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>LKR 1,000</span>
                    <span>LKR 50,000+</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {/* Auto Transmission Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="autoOnly"
                        checked={filters.autoOnly}
                        onChange={handleFilterChange}
                        className="w-5 h-5 text-sunset-orange rounded border-slate-300 focus:ring-sunset-orange"
                      />
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-sunset-orange transition-colors">
                      Automatic Transmission
                    </span>
                  </label>

                  {/* Air Conditioning Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="acOnly"
                        checked={filters.acOnly}
                        onChange={handleFilterChange}
                        className="w-5 h-5 text-sunset-orange rounded border-slate-300 focus:ring-sunset-orange"
                      />
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-sunset-orange transition-colors">
                      Air Conditioning
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content (Vehicles Grid) - 75% */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Available Vehicles
              </h2>
              <span className="bg-orange-50 text-sunset-orange px-3 py-1 rounded-full text-sm font-bold">
                {filteredVehicles.length} Results
              </span>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No vehicles found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We couldn't find any vehicles matching your current filters. Try adjusting your price range or removing some requirements.
                </p>
                <button 
                  onClick={() => setFilters({ type: 'All', maxPrice: 40000, autoOnly: false, acOnly: false })}
                  className="mt-6 px-6 py-2 bg-orange-50 text-sunset-orange hover:bg-orange-100 rounded-xl font-bold transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Vehicles;
