import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Car, Compass, Search, MapPin, Calendar, Users, ChevronDown, Plus, Minus, ArrowRightLeft } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  "Colombo", "Kandy", "Galle", "Nuwara Eliya", "Ella", "Sigiriya", "Mirissa", "Yala"
];

const SearchWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotels');

  // Form states
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  
  // Vehicles states
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [dropoffDateTime, setDropoffDateTime] = useState('');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState('');

  // Experiences states
  const [participants, setParticipants] = useState(1);
  const [experienceDate, setExperienceDate] = useState('');

  // Popovers & Suggestions
  const [showDestinations, setShowDestinations] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const guestRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuests(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let queryParams = new URLSearchParams();

    if (activeTab === 'hotels') {
      if (destination) queryParams.append('destination', destination);
      if (checkIn) queryParams.append('checkIn', checkIn);
      if (checkOut) queryParams.append('checkOut', checkOut);
      queryParams.append('adults', guests.adults);
      queryParams.append('children', guests.children);
      queryParams.append('rooms', guests.rooms);
      navigate(`/hotels?${queryParams.toString()}`);
    } else if (activeTab === 'vehicles') {
      if (pickupLocation) queryParams.append('pickup', pickupLocation);
      if (pickupDateTime) queryParams.append('pickupDate', pickupDateTime);
      if (dropoffDateTime) queryParams.append('dropoffDate', dropoffDateTime);
      if (differentDropoff && dropoffLocation) queryParams.append('dropoff', dropoffLocation);
      navigate(`/vehicles?${queryParams.toString()}`);
    } else if (activeTab === 'experiences') {
      if (destination) queryParams.append('destination', destination);
      if (experienceDate) queryParams.append('date', experienceDate);
      queryParams.append('participants', participants);
      navigate(`/experiences?${queryParams.toString()}`);
    }
  };

  const updateGuest = (type, operation) => {
    setGuests(prev => {
      const current = prev[type];
      const newVal = operation === 'add' ? current + 1 : current - 1;
      if (type === 'adults' && newVal < 1) return prev;
      if (type === 'rooms' && newVal < 1) return prev;
      if (type === 'children' && newVal < 0) return prev;
      return { ...prev, [type]: newVal };
    });
  };

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: <Building size={18} /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Car size={18} /> },
    { id: 'experiences', label: 'Experiences', icon: <Compass size={18} /> }
  ];

  const renderHotelFields = () => (
    <>
      <div className="flex-1 min-w-[200px] relative border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination</label>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Where to?" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestinations(true)}
            onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
          />
        </div>
        {showDestinations && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-2 text-xs font-bold text-gray-400 uppercase bg-gray-50">Popular Destinations</div>
            {POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(destination.toLowerCase())).map(dest => (
              <div 
                key={dest} 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-sm font-medium text-gray-700"
                onClick={() => {
                  setDestination(dest);
                  setShowDestinations(false);
                }}
              >
                <MapPin size={16} className="text-sunset-teal" /> {dest}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-[150px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-in</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <input 
            type="date" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent cursor-pointer"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-[150px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-out</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <input 
            type="date" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent cursor-pointer"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-w-[200px] relative px-4 py-2" ref={guestRef}>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guests & Rooms</label>
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowGuests(!showGuests)}
        >
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <span className="text-gray-800 font-medium truncate">
              {guests.adults + guests.children} Guests, {guests.rooms} Room
            </span>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
        
        {showGuests && (
          <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4">
            {['adults', 'children', 'rooms'].map((type) => (
              <div key={type} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-bold capitalize text-gray-800">{type}</div>
                  {type === 'children' && <div className="text-xs text-gray-400">Ages 0-17</div>}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => updateGuest(type, 'sub')} className="w-8 h-8 rounded-full border border-sunset-orange text-sunset-orange flex items-center justify-center hover:bg-sunset-orange hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-sunset-orange" disabled={(type === 'adults' || type === 'rooms') ? guests[type] <= 1 : guests[type] <= 0}>
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-bold text-gray-800">{guests[type]}</span>
                  <button type="button" onClick={() => updateGuest(type, 'add')} className="w-8 h-8 rounded-full border border-sunset-orange text-sunset-orange flex items-center justify-center hover:bg-sunset-orange hover:text-white transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderVehicleFields = () => (
    <>
      <div className="flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pick-up Location</label>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="City or Airport" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>
      </div>
      
      {differentDropoff && (
        <div className="flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2 bg-gray-50/50">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Drop-off Location</label>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="City or Airport" 
              className="w-full outline-none text-gray-800 font-medium bg-transparent"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-[180px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pick-up Date & Time</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <input 
            type="datetime-local" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent cursor-pointer"
            value={pickupDateTime}
            onChange={(e) => setPickupDateTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-[180px] px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Drop-off Date & Time</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <input 
            type="datetime-local" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent cursor-pointer"
            value={dropoffDateTime}
            min={pickupDateTime}
            onChange={(e) => setDropoffDateTime(e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const renderExperienceFields = () => (
    <>
      <div className="flex-1 min-w-[250px] relative border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination or Activity</label>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Where do you want to explore?" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestinations(true)}
            onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
          />
        </div>
        {showDestinations && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-2 text-xs font-bold text-gray-400 uppercase bg-gray-50">Popular Destinations</div>
            {POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(destination.toLowerCase())).map(dest => (
              <div 
                key={dest} 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-sm font-medium text-gray-700"
                onClick={() => {
                  setDestination(dest);
                  setShowDestinations(false);
                }}
              >
                <MapPin size={16} className="text-sunset-teal" /> {dest}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <input 
            type="date" 
            className="w-full outline-none text-gray-800 font-medium bg-transparent cursor-pointer"
            value={experienceDate}
            onChange={(e) => setExperienceDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-w-[200px] px-4 py-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Participants</label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <span className="text-gray-800 font-medium">{participants} People</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">
              <Minus size={12} />
            </button>
            <button type="button" onClick={() => setParticipants(participants + 1)} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-sunset-orange text-white shadow-lg'
                : 'bg-white/80 backdrop-blur text-gray-700 hover:bg-white hover:text-sunset-orange'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          
          <div className="flex-1 flex flex-col md:flex-row items-stretch rounded-2xl bg-white border border-gray-100 shadow-inner overflow-visible">
            {activeTab === 'hotels' && renderHotelFields()}
            {activeTab === 'vehicles' && renderVehicleFields()}
            {activeTab === 'experiences' && renderExperienceFields()}
          </div>
          
          <button 
            type="submit" 
            className="md:w-auto h-full flex items-center justify-center gap-2 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-10 py-5 md:py-0 md:h-[72px] rounded-2xl md:rounded-[1.5rem] font-bold text-lg shadow-lg hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all flex-shrink-0"
          >
            <Search size={22} />
            <span className="md:hidden">Search</span>
          </button>

        </form>

        {activeTab === 'vehicles' && (
          <div className="mt-3 px-4 flex items-center gap-2 text-sm text-gray-600">
            <input 
              type="checkbox" 
              id="different-dropoff" 
              className="accent-sunset-orange cursor-pointer w-4 h-4"
              checked={differentDropoff}
              onChange={(e) => setDifferentDropoff(e.target.checked)}
            />
            <label htmlFor="different-dropoff" className="cursor-pointer font-medium flex items-center gap-1">
              <ArrowRightLeft size={14} className="text-gray-400" />
              Return vehicle to a different location
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWidget;
