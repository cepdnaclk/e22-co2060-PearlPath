import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Clock, ChevronRight, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          window.location.href = '/login';
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const response = await fetch(`http://127.0.0.1:3001/api/bookings/${parsedUser._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        // Sort descending by created checkInDate (or implicit creation order via _id)
        const sortedBookings = data.response.sort((a,b) => new Date(b.checkInDate) - new Date(a.checkInDate));
        
        setBookings(sortedBookings);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError("Could not load your bookings. Server might be down.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-outfit bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-orange"></div>
      </div>
    );
  }

  // Formatting helpers
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };
  
  const getStayDuration = (start, end) => {
      const diffTime = Math.abs(new Date(end) - new Date(start));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
  };

  const isUpcoming = (checkInDate) => {
      return new Date(checkInDate) > new Date();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-outfit py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <Link to="/" className="text-sm font-medium text-sunset-orange hover:text-sunset-teal mb-4 inline-block">&larr; Back to Home</Link>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Calendar className="text-sunset-gold" size={32} />
                    My Bookings
                </h1>
                <p className="text-slate-500 mt-2">Manage and view your upcoming and past reservations</p>
            </div>
            
            {/* Quick Stats Summary */}
            <div className="flex gap-4">
                 <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-lg text-sunset-orange"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming</p>
                        <p className="text-lg font-bold text-slate-900">{bookings.filter(b => isUpcoming(b.checkInDate)).length}</p>
                    </div>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-500"><HomeIcon size={20} /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Stays</p>
                        <p className="text-lg font-bold text-slate-900">{bookings.length}</p>
                    </div>
                </div>
            </div>
        </div>

        {error ? (
           <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex items-center gap-4 max-w-2xl">
              <AlertCircle size={28} className="shrink-0 text-red-500"/>
              <div>
                 <h3 className="font-bold mb-1">Error Loading Bookings</h3>
                 <p className="text-sm">{error}</p>
              </div>
           </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No bookings found</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't made any reservations yet. Start exploring properties to plan your next trip!</p>
            <Link to="/hotels" className="inline-flex font-bold items-center gap-2 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-sunset-orange/30 transition-all">
              Explore Hotels <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
                const hotel = booking.hotelId;
                const upcoming = isUpcoming(booking.checkInDate);
                const nights = getStayDuration(booking.checkInDate, booking.checkOutDate);

                return (
                 <div key={booking._id} className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
                    {/* Status Ribbon indicator */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${upcoming ? 'bg-sunset-orange' : 'bg-slate-300'}`}></div>

                    <div className="flex flex-col sm:flex-row">
                         {/* Optional Image Area - if hotel has images in future */}
                         <div className="w-full sm:w-1/4 min-h-[160px] sm:min-h-full bg-slate-100 relative overflow-hidden flex items-center justify-center p-6">
                            {hotel && hotel.images && hotel.images.length > 0 ? (
                                <img src={hotel.images[0]} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="text-center text-slate-400">
                                   <HomeIcon size={40} className="mx-auto mb-2 opacity-50" />
                                   <span className="text-xs font-semibold uppercase tracking-wider block">Property View</span>
                                </div>
                            )}
                            {upcoming && (
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-xs font-bold text-sunset-orange uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={12} /> Upcoming
                                    </span>
                                </div>
                            )}
                         </div>

                         {/* Content Details */}
                         <div className="p-6 md:p-8 flex-1">
                             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 relative">
                                  
                                  {/* Title & Location */}
                                  <div>
                                      {hotel ? (
                                          <>
                                              <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-sunset-orange transition-colors">
                                                  <Link to={`/hotel/${hotel._id}`}>{hotel.name}</Link>
                                              </h2>
                                              <p className="flex items-center text-slate-500 text-sm gap-1">
                                                  <MapPin size={16} className="shrink-0" />
                                                  {hotel.address}, {hotel.city} {hotel.country && `, ${hotel.country}`}
                                              </p>
                                          </>
                                      ) : (
                                           <h2 className="text-2xl font-bold text-slate-900 mb-2 italic">Hotel Unavailable</h2>
                                      )}
                                  </div>

                                  {/* Price Tag */}
                                  <div className="md:text-right shrink-0 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider hidden md:block">Total Price</p>
                                      <div className="flex items-center gap-2 md:justify-end">
                                        <CreditCard size={18} className="text-slate-400 md:hidden" />
                                        <p className="text-2xl font-extrabold text-slate-900">${booking.totalPrice?.toLocaleString()}</p>
                                      </div>
                                  </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                                  <div>
                                       <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Check-in</p>
                                       <p className="font-bold text-slate-800">{formatDate(booking.checkInDate)}</p>
                                  </div>
                                  <div>
                                       <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Check-out</p>
                                       <p className="font-bold text-slate-800">{formatDate(booking.checkOutDate)}</p>
                                  </div>
                                  <div>
                                       <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Duration</p>
                                       <p className="text-slate-700 font-medium flex items-center gap-1.5">
                                            <Calendar size={16} className="text-slate-400" />
                                            {nights} {nights === 1 ? 'Night' : 'Nights'}
                                       </p>
                                  </div>
                                  <div>
                                       <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Guests</p>
                                       <p className="text-slate-700 font-medium flex items-center gap-1.5">
                                           <Users size={16} className="text-slate-400" />
                                           {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                                       </p>
                                  </div>
                             </div>
                         </div>
                    </div>
                 </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
