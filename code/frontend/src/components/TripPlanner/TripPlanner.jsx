import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { Calendar, Users, MapPin, Sparkles, Map, Loader2, Save, Building, Star } from 'lucide-react';

const INTERESTS = ['Nature', 'History', 'Culture', 'Beaches', 'Adventure', 'Food', 'Shopping', 'Wildlife', 'Photography', 'Relaxation'];
const DESTINATIONS = ['Kandy', 'Ella', 'Galle', 'Colombo', 'Nuwara Eliya', 'Sigiriya', 'Anuradhapura', 'Yala', 'Mirissa'];

const TripPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    guests: 2,
    budget: 'moderate',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');
  const [hotels, setHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [saving, setSaving] = useState(false);
  
  // Assume a simple check for user login (PearlPath often uses localStorage or contexts)
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;



  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validate = () => {
    if (!formData.destination) return 'Please select a destination.';
    if (!formData.startDate) return 'Please select a start date.';
    if (!formData.endDate) return 'Please select an end date.';
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      return 'End date must be after the start date.';
    }
    if (formData.guests < 1) return 'Number of guests must be at least 1.';
    return null;
  };

  const handleGenerate = async () => {
    const valError = validate();
    if (valError) {
      setError(valError);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/trip-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate trip');
      setItinerary(data.itinerary);
      setHotels(data.suggestedHotels || []);
      setGuides(data.suggestedGuides || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!isLoggedIn) return;
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/trip-planner/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, itinerary })
      });
      if (!response.ok) throw new Error('Failed to save trip');
      alert('Trip saved successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 font-outfit flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-sunset-orange" size={40} />
            AI Trip Planner
          </h1>
          <p className="text-xl text-gray-600">Plan your perfect Sri Lankan journey with PearlPath AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange outline-none"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                >
                  <option value="">Select a destination...</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-orange outline-none"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-orange outline-none"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="number"
                      min="1"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-orange outline-none"
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-orange outline-none"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="budget">Budget</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        formData.interests.includes(interest)
                          ? 'bg-sunset-orange text-white border-sunset-orange'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-sunset-orange'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                {loading ? 'Planning your perfect trip...' : 'Generate My Trip'}
              </button>
            </div>
          </div>

          {/* ITINERARY */}
          <div className="lg:col-span-2">
            {!itinerary && !loading && (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full min-h-[400px]">
                <Map size={64} className="text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to explore?</h3>
                <p className="text-gray-500 max-w-md">Fill out the details on the left and let our AI craft a personalized itinerary just for you.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-sunset-orange rounded-full border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto text-sunset-gold" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Crafting your journey</h3>
                <p className="text-gray-500 animate-pulse">Analyzing destinations, activities, and optimal routes...</p>
              </div>
            )}

            {itinerary && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Your {formData.destination} Itinerary</h2>
                    <p className="text-gray-500">{formData.startDate} to {formData.endDate} • {formData.guests} Guests</p>
                  </div>
                  {isLoggedIn && (
                    <button 
                      onClick={handleSaveTrip}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-sunset-teal text-sunset-teal rounded-full font-bold hover:bg-sunset-teal hover:text-white transition-colors"
                    >
                      {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                      Save Trip
                    </button>
                  )}
                </div>

                {itinerary.map((dayObj, index) => (
                  <div key={index} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-sunset-teal mb-4 pb-2 border-b border-gray-100">
                      {dayObj.day} <span className="text-sm font-normal text-gray-400 ml-2">{dayObj.date}</span>
                    </h3>
                    
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {dayObj.activities.map((activity, aIndex) => (
                        <div key={aIndex} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-sunset-orange text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <MapPin size={18} />
                          </div>
                          
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-800">{activity.name}</span>
                              <span className="text-xs font-semibold text-sunset-gold px-2 py-1 bg-orange-50 rounded-full">{activity.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                              {activity.location && <span>📍 {activity.location}</span>}
                              <span>⏱️ {activity.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Recommended Hotels */}
                {hotels.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Building className="text-sunset-teal" /> 
                      Recommended Stays in {formData.destination}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hotels.map((hotel) => (
                        <div key={hotel._id || hotel.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col group">
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={hotel.imageUrl || (hotel.images && hotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop"} 
                              alt={hotel.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                              <Star size={14} className="text-sunset-gold fill-sunset-gold" />
                              {hotel.rating || 4.5}
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                            <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                              <MapPin size={14} /> {hotel.location}
                            </p>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div className="font-bold text-lg">${hotel.price || hotel.pricePerNight}<span className="text-sm text-gray-400 font-normal">/night</span></div>
                              <button 
                                onClick={() => navigate(`/hotel/${hotel._id || hotel.id}`)}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-sunset-teal transition-colors"
                              >
                                View Hotel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Tour Guides */}
                {guides.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Users className="text-sunset-orange" /> 
                      Recommended Local Guides
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {guides.map((guide) => (
                        <div key={guide._id || guide.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col group p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <img 
                              src={guide.profilePictureUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"} 
                              alt={guide.name} 
                              className="w-16 h-16 rounded-full object-cover shadow-sm"
                            />
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{guide.name}</h4>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin size={14} /> {guide.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">{guide.bio || "Local expert ready to show you the best of Sri Lanka."}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {guide.languages && guide.languages.map((lang, idx) => (
                              <span key={idx} className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {lang}
                              </span>
                            ))}
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="font-bold text-lg text-sunset-gold">
                              ${guide.pricePerDay}<span className="text-sm text-gray-400 font-normal">/day</span>
                            </div>
                            <button 
                              onClick={() => navigate(`/tour-guide/${guide._id || guide.id}`)}
                              className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-sunset-orange transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
