import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Search, MapPin, Navigation, Clock, Compass, Info, Locate } from 'lucide-react';

// Fix Leaflet Default Marker Icon issue in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Green marker icon for Starting Point
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SRI_LANKA_CENTER = [7.8731, 80.7718];

// Map helper to auto-fit the polyline bounds
const MapBoundsUpdater = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  return null;
};

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Travel Mode state: 'car', 'bus', 'bike', 'foot'
  const [travelMode, setTravelMode] = useState('car');

  // User starting point states
  const [startPoint, setStartPoint] = useState({
    name: 'Colombo',
    lat: 6.9271,
    lng: 79.8612
  });
  const [liveLocationActive, setLiveLocationActive] = useState(false);
  const [liveRouteCoords, setLiveRouteCoords] = useState([]);
  const [liveRouteInfo, setLiveRouteInfo] = useState({ distance: '', duration: '' });

  const majorCities = [
    { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
    { name: 'Negombo', lat: 7.2008, lng: 79.8737 },
    { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
    { name: 'Galle', lat: 6.0535, lng: 80.2117 },
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255 }
  ];

  const fetchRoutes = async (query = '') => {
    setLoading(true);
    try {
      // 1. Try fetching predefined routes from local database first
      const res = await fetch(`http://127.0.0.1:3001/api/routes?to=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success && data.response && data.response.length > 0) {
        setRoutes(data.response || []);
        setSelectedRoute(data.response[0]);
        setLoading(false);
        return;
      }

      // 2. If no predefined routes found, dynamically geocode custom location using Nominatim API (restricted to Sri Lanka)
      if (query.trim() !== '') {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=lk&format=json&limit=1`);
        const geoData = await geoRes.json();
        
        if (geoData && geoData.length > 0) {
          const locationName = geoData[0].display_name.split(',')[0];
          const lat = parseFloat(geoData[0].lat);
          const lng = parseFloat(geoData[0].lon);

          const dynamicRoute = {
            _id: `dynamic-${Date.now()}`,
            name: `Custom Route to ${locationName}`,
            description: `Dynamically calculated driving route from your start point to ${locationName}, Sri Lanka.`,
            destination: locationName,
            waypoints: [
              {
                lat,
                lng,
                name: locationName,
                description: `Geocoded custom destination coordinates.`
              }
            ]
          };

          setRoutes([dynamicRoute]);
          setSelectedRoute(dynamicRoute);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback: No predefined route and geocoding failed
      setRoutes([]);
      setSelectedRoute(null);
    } catch (err) {
      console.error("Error in routes search flow:", err);
      setRoutes([]);
      setSelectedRoute(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-world road directions from OSRM
  const getLiveRoutePath = async (start, waypoints) => {
    if (!start || !waypoints || waypoints.length === 0) return;

    // Filter out starting point from waypoints if it matches Colombo to prevent duplicate markers
    const filteredWps = waypoints.filter(wp => {
      if (wp.name.includes("Start") && start.name === "Colombo") {
        return false;
      }
      return true;
    });

    const coordsString = [
      `${start.lng},${start.lat}`,
      ...filteredWps.map(wp => `${wp.lng},${wp.lat}`)
    ].join(';');

    // Map travel mode to OSRM profile
    let profile = 'driving'; // default for car and bus
    if (travelMode === 'bike') profile = 'bicycle';
    if (travelMode === 'foot') profile = 'foot';

    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coordsString}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setLiveRouteCoords(leafletCoords);

        // Convert OSRM distance (meters) to km
        const distanceKm = (route.distance / 1000).toFixed(1) + ' km';
        
        // Adjust travel duration based on mode
        let durationSeconds = route.duration;
        if (travelMode === 'bus') {
          // Public bus in Sri Lanka takes roughly 1.4x longer than car driving due to stops
          durationSeconds = route.duration * 1.4;
        }

        // Convert duration to hours and minutes
        const hrs = Math.floor(durationSeconds / 3600);
        const mins = Math.round((durationSeconds % 3600) / 60);
        const durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;

        setLiveRouteInfo({ distance: distanceKm, duration: durationStr });
      } else {
        fallbackPath(start, filteredWps);
      }
    } catch (err) {
      console.error("Error fetching OSRM road directions:", err);
      fallbackPath(start, filteredWps);
    }
  };

  const fallbackPath = (start, wps) => {
    const fallbackCoords = [
      [start.lat, start.lng],
      ...wps.map(wp => [wp.lat, wp.lng])
    ];
    setLiveRouteCoords(fallbackCoords);
    setLiveRouteInfo({ distance: 'Calc pending', duration: 'Calc pending' });
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute && startPoint) {
      getLiveRoutePath(startPoint, selectedRoute.waypoints);
    }
  }, [selectedRoute, startPoint, travelMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRoutes(searchQuery);
  };

  // Detect user live location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setStartPoint({
          name: 'Your Live Location',
          lat,
          lng
        });
        setLiveLocationActive(true);
        setLoading(false);
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Failed to detect location. Please check your browser location permissions.");
        setLoading(false);
      }
    );
  };

  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    const city = majorCities.find(c => c.name === cityName);
    if (city) {
      setStartPoint(city);
      setLiveLocationActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-outfit flex flex-col">
      <Navbar />

      {/* Top Banner */}
      <div className="pt-28 pb-10 bg-sunset-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight flex items-center gap-3">
            <Compass className="text-sunset-orange animate-spin-slow" size={36} /> Explore Travel Routes
          </h1>
          <p className="text-lg text-gray-300 font-light max-w-2xl">
            View real-time road driving routes from your current live location or a custom starting point to your destination.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Routes Explorer Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          
          {/* Configure Starting Point Box */}
          <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5 shadow-md">
            <h2 className="text-lg font-bold mb-3 text-sunset-teal flex items-center gap-2">
              <Locate size={20} /> Select Start Point
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <select
                  value={liveLocationActive ? '' : startPoint.name}
                  onChange={handleCitySelect}
                  className="flex-1 px-3 py-2.5 bg-[#27272a] text-white border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sunset-orange text-sm font-medium"
                >
                  {liveLocationActive && <option value="">Live GPS Active</option>}
                  {majorCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      Starting City: {city.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="bg-[#27272a] hover:bg-sunset-teal/20 text-sunset-teal border border-sunset-teal/20 hover:border-sunset-teal/40 font-bold px-4 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase"
                >
                  <Locate size={14} /> Live GPS
                </button>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                Current Start: <span className="text-white font-bold">{startPoint.name}</span> {liveLocationActive && `(${startPoint.lat.toFixed(4)}, ${startPoint.lng.toFixed(4)})`}
              </div>
            </div>
          </div>

          {/* Configure Travel Mode Box */}
          <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5 shadow-md">
            <h2 className="text-lg font-bold mb-3 text-sunset-gold flex items-center gap-2">
              <Compass size={20} /> Select Travel Mode
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTravelMode('car')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  travelMode === 'car'
                    ? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange'
                    : 'bg-[#27272a] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🚗 Car / Taxi
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('bus')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  travelMode === 'bus'
                    ? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange'
                    : 'bg-[#27272a] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🚌 Public Bus
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('bike')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  travelMode === 'bike'
                    ? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange'
                    : 'bg-[#27272a] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🏍️ Bike / Cycle
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('foot')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  travelMode === 'foot'
                    ? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange'
                    : 'bg-[#27272a] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🚶 Walking
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-[#18181b] p-5 rounded-2xl border border-white/5 shadow-md">
            <h2 className="text-lg font-bold mb-3 text-sunset-orange">Find a Route</h2>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Where to? (e.g. Ella, Sigiriya)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#27272a] text-white border border-white/5 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange transition-all text-sm"
                />
              </div>
              <button 
                type="submit"
                className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold px-5 py-3 rounded-xl hover:shadow-lg transition-transform transform hover:-translate-y-0.5 text-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Routes List */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px] lg:max-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#18181b] rounded-2xl border border-white/5">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-sunset-orange mb-3"></div>
                <p className="text-gray-400 text-sm">Loading routes...</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="text-center py-16 bg-[#18181b] rounded-2xl border border-white/5 p-6">
                <Info size={36} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-300 font-bold">No Routes Found</p>
                <p className="text-gray-500 text-sm mt-1">Try entering another destination or clear your search to see all routes.</p>
              </div>
            ) : (
              routes.map((route) => (
                <div
                  key={route._id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-3 relative overflow-hidden group ${
                    selectedRoute?._id === route._id
                      ? 'bg-gradient-to-br from-sunset-orange/10 to-sunset-gold/10 border-sunset-orange/40 shadow-lg scale-[1.01]'
                      : 'bg-[#18181b] border-white/5 hover:border-white/10 hover:bg-[#202024]'
                  }`}
                >
                  {/* Selected Indicator Bar */}
                  {selectedRoute?._id === route._id && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sunset-orange to-sunset-gold"></div>
                  )}

                  <h3 className="font-bold text-lg leading-snug group-hover:text-sunset-orange transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-sunset-orange" /> 
                      {selectedRoute?._id === route._id ? liveRouteInfo.duration || route.duration : route.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-sunset-teal" /> 
                      {selectedRoute?._id === route._id ? liveRouteInfo.distance || route.distance : route.distance}
                    </span>
                    <span className="ml-auto text-sunset-gold bg-sunset-gold/10 px-2 py-0.5 rounded text-[10px] uppercase">
                      {route.waypoints.length} Stops
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Map Container */}
        <div className="lg:w-2/3 h-[500px] lg:h-[680px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
          <MapContainer 
            center={SRI_LANKA_CENTER} 
            zoom={8} 
            className="h-full w-full"
            style={{ background: '#1c1c1f' }}
          >
            {/* Custom Dark Theme Map Tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {selectedRoute && (
              <>
                {/* Auto Pan/Zoom helper */}
                <MapBoundsUpdater coordinates={liveRouteCoords} />

                {/* Draw Route Path */}
                <Polyline
                  positions={liveRouteCoords}
                  color="#ff7c3b"
                  weight={5}
                  opacity={0.85}
                  lineCap="round"
                  lineJoin="round"
                />

                {/* Green marker for Starting Point */}
                <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon}>
                  <Popup>
                    <div className="p-1 font-outfit text-slate-800">
                      <h4 className="font-extrabold text-sm text-green-600 leading-tight">Starting Location</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{startPoint.name}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Waypoint Markers */}
                {selectedRoute.waypoints
                  .filter(stop => !(stop.name.includes("Start") && startPoint.name === "Colombo"))
                  .map((stop, index, arr) => (
                    <Marker 
                      key={index} 
                      position={[stop.lat, stop.lng]}
                    >
                      <Popup className="premium-popup">
                        <div className="p-1 font-outfit text-slate-800">
                          <h4 className="font-extrabold text-sm text-sunset-orange leading-tight">{stop.name}</h4>
                          {stop.description && (
                            <p className="text-xs text-slate-600 mt-1 font-medium leading-normal">{stop.description}</p>
                          )}
                          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Stop {index + 1} of {arr.length}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </>
            )}
          </MapContainer>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default RoutesPage;
