import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Calendar, Home, Car, User, MapPin, CreditCard, ChevronRight } from 'lucide-react';

const MyBookings = () => {
  const { authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await authFetch('http://127.0.0.1:3001/api/bookings/user');
        const data = await response.json();
        
        if (response.ok) {
          // Sort bookings by createdAt descending
          const sortedBookings = (data.response || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBookings(sortedBookings);
        } else {
          setError(data.message || 'Failed to fetch bookings.');
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authFetch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pending': 
      default: 
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">My Bookings</h1>
          <p className="text-lg text-gray-600">View and manage all your upcoming and past reservations.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sunset-teal mb-4"></div>
            <p className="text-gray-500 font-medium text-lg">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex flex-col items-center justify-center py-12">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Yet</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">It looks like you haven't made any reservations yet. Start exploring properties, vehicles, or tours for your next adventure!</p>
            <div className="flex gap-4 justify-center">
              <Link to="/hotels" className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transform transition hover:-translate-y-1">
                Explore Hotels
              </Link>
              <Link to="/vehicles" className="bg-white border-2 border-sunset-teal text-sunset-teal font-bold py-3 px-8 rounded-xl hover:bg-sunset-teal/5 transform transition hover:-translate-y-1">
                Find Vehicles
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isHotel = !!booking.hotelId;
              const isVehicle = !!booking.vehicleId;
              const isTour = !!booking.tourId;
              
              let title = 'Booking';
              let Icon = Calendar;
              let image = null;
              let location = null;
              let targetLink = '#';
              
              if (isHotel && booking.hotelId) {
                title = booking.hotelId.name;
                Icon = Home;
                image = booking.hotelId.imageUrl;
                location = booking.hotelId.location;
                targetLink = `/hotel/${booking.hotelId._id}`;
              } else if (isVehicle && booking.vehicleId) {
                title = `${booking.vehicleId.make} ${booking.vehicleId.model}`;
                Icon = Car;
                image = booking.vehicleId.images?.[0] || booking.vehicleId.imageUrl;
                location = booking.vehicleId.location;
                targetLink = `/vehicle/${booking.vehicleId._id}`;
              } else if (isTour && booking.tourId) {
                title = booking.tourId.name || 'Tour Booking';
                Icon = User;
                // Add tour specifics if applicable
              }

              return (
                <div key={booking._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-200 relative">
                      {image ? (
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <Icon size={48} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-sunset-teal">
                        <Icon size={20} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${getStatusStyle(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                        
                        {location && (
                          <div className="flex items-center gap-1.5 text-gray-500 mb-4 font-medium">
                            <MapPin size={16} className="text-sunset-teal" />
                            {location}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dates</span>
                            <span className="font-semibold text-gray-800">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Details</span>
                            <span className="font-semibold text-gray-800">
                              {isHotel ? `${booking.rooms} Room(s), ${booking.guests} Guest(s)` : 
                               isVehicle ? `${booking.guests || 1} Day(s)` : 'Booking Info'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-sunset-teal/10 flex items-center justify-center text-sunset-teal">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-500">Total Price</span>
                            <span className="text-lg font-bold text-gray-900">LKR {booking.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Link to={targetLink} className="flex items-center gap-1 text-sunset-teal font-bold hover:text-sunset-teal/80 transition-colors">
                          View Details <ChevronRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
