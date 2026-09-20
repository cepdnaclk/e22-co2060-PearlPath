import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Car, Users, Settings, Wind, User, MapPin } from 'lucide-react';
import ReviewSection from '../Reviews/ReviewSection';
import { useCurrency } from '../../context/CurrencyContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../ProviderCalendar/ProviderCalendar.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const { convertPrice, getCurrencySymbol } = useCurrency();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [disabledDates, setDisabledDates] = useState([]);
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

    const fetchAvailability = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3001/api/vehicles/${id}/availability`);
            if (res.ok) {
                const data = await res.json();
                setDisabledDates(data.disabledDates || []);
            }
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    fetchVehicleDetails();
    fetchAvailability();
  }, [id]);



  const handleDateChange = (range) => {
    setDateRange(range);
    if (range && range.length === 2) {
        const start = new Date(range[0].getTime() - (range[0].getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const end = new Date(range[1].getTime() - (range[1].getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        setBookingData(prev => ({ ...prev, startDate: start, endDate: end }));
    } else {
        setBookingData(prev => ({ ...prev, startDate: '', endDate: '' }));
    }
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

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    let curr = new Date(start);
    let hasDisabled = false;
    while (curr <= end) {
        const dStr = curr.toISOString().split('T')[0];
        if (disabledDates.includes(dStr)) {
            hasDisabled = true;
            break;
        }
        curr.setDate(curr.getDate() + 1);
    }

    if (hasDisabled) {
        setBookingMessage('Your selected range includes unavailable dates. Please choose different dates.');
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

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Owner</h2>
              {vehicle.ownerId ? (
                <div className="space-y-3 text-gray-600 font-medium">
                  <p><strong>Owner:</strong> {vehicle.ownerId.firstName} {vehicle.ownerId.lastName}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${vehicle.ownerId.email}`} className="text-sunset-teal hover:underline">{vehicle.ownerId.email}</a></p>
                  {vehicle.ownerId.phone && (
                    <p><strong>Phone:</strong> <a href={`tel:${vehicle.ownerId.phone}`} className="text-sunset-teal hover:underline">{vehicle.ownerId.phone}</a></p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Contact information not available.</p>
              )}
            </div>

            {/* Reviews Section */}
            <ReviewSection targetId={vehicle._id} targetModel="Vehicle" />
          </div>

          {/* Booking Section */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-sunset-teal">{getCurrencySymbol()} {vehicle.pricePerDay ? convertPrice(vehicle.pricePerDay).toLocaleString() : 'N/A'}</span>
                  <span className="text-gray-500 font-medium"> / day</span>
                </div>
              </div>

              {(!user || user.role === 'tourist') ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Select Rental Dates</label>
                      <Calendar 
                        selectRange={true}
                        minDate={new Date()}
                        onChange={handleDateChange}
                        value={dateRange}
                        tileDisabled={({ date, view }) => {
                            if (view === 'month') {
                                const dStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                                return disabledDates.includes(dStr);
                            }
                            return false;
                        }}
                        className="custom-calendar w-full border-gray-200 rounded-xl tourist-calendar"
                      />
                      {bookingData.startDate && bookingData.endDate && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1 text-sm shadow-inner">
                           <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Selected Dates</span>
                           <span className="font-bold text-sunset-teal text-base">
                               {new Date(bookingData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(bookingData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {calculateTotalPrice() > 0 && (
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-800">Total Price</span>
                      <span className="text-sunset-teal">{getCurrencySymbol()} {convertPrice(calculateTotalPrice()).toLocaleString()}</span>
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
