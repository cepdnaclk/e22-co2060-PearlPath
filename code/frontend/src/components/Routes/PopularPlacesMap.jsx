import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { popularPlaces } from '../../data/popularPlaces';
import { Compass, MapPin } from 'lucide-react';

const SRI_LANKA_CENTER = [7.8731, 80.7718];
const SRI_LANKA_BOUNDS = [
  [5.8, 79.5], // South West
  [9.9, 81.9]  // North East
];

// Reusing the same default marker setup from RoutesPage for consistency
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PopularPlacesMap = ({ onPlanRoute }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Historical', 'Beach', 'Wildlife', 'Hill Country', 'Cultural'];

  const filteredPlaces = activeCategory === 'All' 
    ? popularPlaces 
    : popularPlaces.filter(place => place.category === activeCategory);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Filters */}
      <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5 shadow-md">
        <h2 className="text-lg font-bold mb-3 text-sunset-gold flex items-center gap-2">
          <Compass size={20} /> Discover Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 px-4 rounded-xl border text-sm font-bold transition-all ${
                activeCategory === category
                  ? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange shadow-lg'
                  : 'bg-[#27272a] border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[500px] lg:h-[680px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
        <MapContainer 
          center={SRI_LANKA_CENTER} 
          zoom={7} 
          minZoom={7}
          maxBounds={SRI_LANKA_BOUNDS}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          style={{ background: '#1c1c1f' }}
        >
          {/* Custom Dark Theme Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Place Markers */}
          {filteredPlaces.map((place) => (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]}
              icon={customIcon}
            >
              <Popup className="premium-popup">
                <div className="p-0 font-outfit text-slate-800 w-56 rounded-xl overflow-hidden shadow-sm">
                  <div className="h-28 w-full relative">
                    <img 
                      src={place.imageUrl} 
                      alt={place.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] uppercase font-bold text-sunset-orange shadow-sm">
                      {place.category}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-extrabold text-sm text-sunset-orange leading-tight">{place.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 mb-3 font-medium leading-normal">
                      {place.description}
                    </p>
                    <button
                      onClick={() => onPlanRoute(place.name)}
                      className="w-full py-1.5 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-1"
                    >
                      <MapPin size={12} /> Plan a route here
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
};

export default PopularPlacesMap;
