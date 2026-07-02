import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { MapPin, Star, Wifi, Coffee, Wind, Waves, Calendar, Users, Home, User } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    rooms: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/hotels/${id}`);
        const data = await response.json();
        if (response.ok) {
          setHotel(data.response);
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !hotel) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (nights <= 0) return 0;
    return nights * hotel.pricePerNight * bookingData.rooms;
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
          hotelId: hotel._id,
          providerId: hotel.ownerId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: bookingData.guests,
          rooms: bookingData.rooms,
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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-outfit"><p>Loading hotel details...</p></div>;
  if (!hotel) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-outfit"><p>Hotel not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{hotel.name}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1 font-medium"><MapPin size={18} className="text-sunset-teal" /> {hotel.location}</span>
            <span className="flex items-center gap-1 font-bold text-sunset-gold"><Star size={18} className="fill-current" /> {hotel.starRating} Stars</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 h-96">
          <div className="lg:col-span-2 h-full rounded-2xl overflow-hidden shadow-sm">
            <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="hidden lg:flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
              {hotel.images && hotel.images[0] ? (
                <img src={hotel.images[0]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-sunset-teal/10 flex items-center justify-center text-sunset-teal font-medium">More Photos Coming Soon</div>
              )}
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-gray-200">
              {hotel.images && hotel.images[1] ? (
                <img src={hotel.images[1]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{hotel.description}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {hotel.amenities && hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-sunset-teal border border-gray-100">
                      {amenity === 'Free WiFi' ? <Wifi size={18} /> :
                       amenity === 'Pool' || amenity === 'Swimming Pool' ? <Waves size={18} /> :
                       amenity === 'Breakfast Included' ? <Coffee size={18} /> :
                       amenity === 'A/C' ? <Wind size={18} /> :
                       <Star size={18} />}
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-sunset-teal">LKR {hotel.pricePerNight?.toLocaleString()}</span>
                  <span className="text-gray-500 font-medium"> / night</span>
                </div>
              </div>

              {(!user || user.role === 'tourist') ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Check-In</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" name="startDate" value={bookingData.startDate} onChange={handleBookingChange} required min={new Date().toISOString().split('T')[0]} className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Check-Out</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" name="endDate" value={bookingData.endDate} onChange={handleBookingChange} required min={bookingData.startDate || new Date().toISOString().split('T')[0]} className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Guests</label>
                      <div className="relative">
                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" name="guests" value={bookingData.guests} onChange={handleBookingChange} required min="1" className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Rooms</label>
                      <div className="relative">
                        <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" name="rooms" value={bookingData.rooms} onChange={handleBookingChange} required min="1" className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm font-medium" />
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
                    disabled={bookingLoading}
                    className="w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {bookingLoading ? 'Processing...' : (user ? 'Request Booking' : 'Sign In to Book')}
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Tourist Feature Only</h3>
                  <p className="text-blue-700 text-sm font-medium">As a {user.role.replace('_', ' ')}, you cannot book properties. Only tourists can make bookings.</p>
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

export default HotelDetails;
