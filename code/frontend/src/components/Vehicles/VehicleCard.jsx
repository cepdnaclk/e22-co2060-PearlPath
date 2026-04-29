import React from 'react';
import { Users, Settings, Wind } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col h-full font-outfit">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : "https://images.unsplash.com/photo-1590362891991-f776e747a58f?q=80&w=800&auto=format&fit=crop"}
          alt={vehicle.makeAndModel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sunset-teal shadow-sm">
          {vehicle.vehicleType}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{vehicle.makeAndModel}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-100">
            <Users size={14} className="text-slate-400" />
            {vehicle.seats} Seats
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-100">
            <Settings size={14} className="text-slate-400" />
            {vehicle.transmission}
          </div>
          {vehicle.hasAC && (
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-100">
              <Wind size={14} className="text-slate-400" />
              A/C
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">Price per day</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-sunset-teal">LKR</span>
                <span className="text-2xl font-black text-sunset-teal">
                  {vehicle.pricePerDay ? vehicle.pricePerDay.toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-teal-50 hover:bg-sunset-teal text-sunset-teal hover:text-white rounded-xl font-bold transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
