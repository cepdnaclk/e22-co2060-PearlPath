import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Car, Users, Settings, Wind, Calendar, User, MapPin } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/vehicles/${id}`);
        const data = await response.json();
        if (response.ok) {
          setVehicle(data.response);
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !vehicle) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Minimum 1 day rental
    const rentalDays = days > 0 ? days : 1; 
    
    // If end date is before start date, return 0
    if (days < 0) return 0;
    
    return rentalDays * vehicle.pricePerDay;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingMessage('');
    const totalPrice = calculateTotalPrice();
    
    if (totalPrice <= 0) {
      setBookingMessage('Please select valid dates.');
      return;
    }

    setBookingLoading(true);
    
    try {
      const response = await authFetch('http://127.0.0.1:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          providerId: vehicle.ownerId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: vehicle.seats, // vehicles don't use 'guests' the same way as hotels, but we can pass seats
          totalPrice
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setBookingMessage('Booking request sent successfully!');
        setTimeout(() => navigate('/my-bookings'), 2000);
      } else {
        setBookingMessage(data.message || 'Booking failed.');
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingMessage('An error occurred. Please try again later.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-outfit"><p>Loading vehicle details...</p></div>;
  if (!vehicle) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-outfit"><p>Vehicle not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{vehicle.makeAndModel}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1 font-medium"><Car size={18} className="text-sunset-teal" /> {vehicle.vehicleType}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {vehicle.isAvailable ? 'Available Now' : 'Currently Unavailable'}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 h-96">
          <div className="lg:col-span-2 h-full rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : "https://images.unsplash.com/photo-1590362891991-f776e747a58f?q=80&w=800&auto=format&fit=crop"} 
              alt={vehicle.makeAndModel} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="hidden lg:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
              {vehicle.images && vehicle.images[1] ? (
                <img src={vehicle.images[1]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-sunset-teal/10 flex items-center justify-center text-sunset-teal font-medium">More Photos Coming Soon</div>
              )}
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
              {vehicle.images && vehicle.images[2] ? (
                <img src={vehicle.images[2]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-sunset-orange/10 flex items-center justify-center text-sunset-orange font-medium">More Photos Coming Soon</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Details Section */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this vehicle</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Explore the journey in comfort and style with this {vehicle.makeAndModel}. 
                Perfect for your travel needs across Sri Lanka, offering reliability and a smooth ride.
                Contact the owner for more specific details or special requests regarding pickup locations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-sunset-teal border border-slate-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Capacity</p>
                    <p className="font-bold text-lg">{vehicle.seats} Seats</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-sunset-teal border border-slate-100">
                    <Settings size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Transmission</p>
                    <p className="font-bold text-lg">{vehicle.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-sunset-teal border border-slate-100">
                    <Wind size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Air Conditioning</p>
                    <p className="font-bold text-lg">{vehicle.hasAC ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-sunset-teal border border-slate-100">
                    <Car size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Type</p>
                    <p className="font-bold text-lg">{vehicle.vehicleType}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-sunset-teal">LKR {vehicle.pricePerDay?.toLocaleString()}</span>
                  <span className="text-gray-500 font-medium"> / day</span>
                </div>
              </div>

              {(!user || user.role === 'tourist') ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" name="startDate" value={bookingData.startDate} onChange={handleBookingChange} required min={new Date().toISOString().split('T')[0]} className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Return Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" name="endDate" value={bookingData.endDate} onChange={handleBookingChange} required min={bookingData.startDate || new Date().toISOString().split('T')[0]} className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
                      </div>
                    </div>
                  </div>

                  {calculateTotalPrice() > 0 && (
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-800">Total Price</span>
                      <span className="text-sunset-teal">LKR {calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  )}

                  {bookingMessage && (
                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${bookingMessage.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {bookingMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={bookingLoading || !vehicle.isAvailable}
                    className="w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {!vehicle.isAvailable ? 'Not Available' : bookingLoading ? 'Processing...' : (user ? 'Request Booking' : 'Sign In to Book')}
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Tourist Feature Only</h3>
                  <p className="text-blue-700 text-sm font-medium">As a {user.role.replace('_', ' ')}, you cannot book vehicles. Only tourists can make bookings.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetails;
