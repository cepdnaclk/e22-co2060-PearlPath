import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { MapPin, Star, Check, Wifi, Wind, Waves, Coffee, Car, Utensils, Accessibility, Dumbbell, Wine, Share, Heart, Image as ImageIcon } from 'lucide-react';

// Single Mock Hotel Data (Matches the schema of MOCK_HOTELS)
const MOCK_HOTEL_DETAIL = {
  id: 1,
  propertyName: "Grand Galle Fort Hotel",
  city: "Galle",
  address: "123 Church Street, Galle Fort, Sri Lanka",
  starRating: 5,
  pricePerNight: 45000,
  amenities: ["Free WiFi", "Pool", "Breakfast Included", "Spa", "Ocean View", "A/C", "Parking", "Restaurant", "Bar"],
  description: "Experience the ultimate luxury in the heart of the historic Galle Fort. Our restored Dutch-colonial villa offers world-class amenities and breathtaking views of the Indian Ocean. Wake up to the sound of waves, enjoy a curated high-tea in our tropical courtyard, and explore the ancient cobblestone streets right outside your door. Perfect for couples seeking a romantic getaway or families wanting a premium cultural experience.",
  images: [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop", // Hero
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560980993-4a165fc364d2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop"
  ]
};

// Map string amenities to icons
const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case 'Free WiFi': return <Wifi size={18} />;
    case 'A/C': return <Wind size={18} />;
    case 'Pool': return <Waves size={18} />;
    case 'Breakfast Included': return <Coffee size={18} />;
    case 'Parking': return <Car size={18} />;
    case 'Restaurant': return <Utensils size={18} />;
    case 'Spa': return <Accessibility size={18} />;
    case 'Gym': return <Dumbbell size={18} />;
    case 'Bar': return <Wine size={18} />;
    case 'Ocean View': return <Waves size={18} className="text-blue-500" />;
    default: return <Check size={18} />;
  }
};

const HotelDetails = () => {
  const [hotel, setHotel] = useState(MOCK_HOTEL_DETAIL);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id && id.length > 10) {
      // It's a MongoDB ID, fetch from backend
      const fetchHotel = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:3001/api/hotels/${id}`);
          const data = await response.json();
          const h = data.response;
          if (h) {
            setHotel({
              id: h._id,
              propertyName: h.name,
              city: h.location,
              address: h.location,
              starRating: h.starRating || 5,
              pricePerNight: h.pricePerNight,
              amenities: h.amenities?.length ? h.amenities : ["Free WiFi"],
              description: h.description,
              images: h.images?.length > 4 ? h.images : [
                h.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80',
                'https://images.unsplash.com/photo-1560980993-4a165fc364d2?q=80',
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80'
              ]
            });
          }
        } catch (error) {
          console.error("Error fetching hotel details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHotel();
    } else {
      // It's a mock hotel ID or the preview route, we either filter MOCK_HOTELS or just use the MOCK_HOTEL_DETAIL
      setLoading(false);
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunset-teal"></div>
    </div>
  );

  // Dynamic calculations
  let nights = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end > start) {
       nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
  }
  const displayNights = nights > 0 ? nights : 1; // Default to 1 for display if no dates selected
  const totalPrice = hotel.pricePerNight * displayNights * rooms;

  const handleBooking = async () => {
    setBookingError('');
    
    // Validations
    if (!startDate || !endDate) {
       setBookingError('Please select check-in and check-out dates.');
       return;
    }
    if (nights <= 0) {
       setBookingError('Check-out date must be after check-in date.');
       return;
    }
    
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
       window.location.href = '/login';
       return;
    }
    
    const user = JSON.parse(storedUser);
    
    // Safety check: if hotelId is a mock integer (like '1'), MongoDB throws a CastError (500)
    // We generate a valid mock ObjectId for testing purposes if it's not a real DB ID string
    const finalHotelId = (typeof hotel.id === 'string' && hotel.id.length === 24) 
        ? hotel.id 
        : '000000000000000000000001';
        
    setBookingLoading(true);
    try {
        const response = await fetch('http://127.0.0.1:3001/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user._id,
                hotelId: finalHotelId,
                startDate,
                endDate,
                rooms: parseInt(rooms),
                guests: parseInt(guests),
                totalPrice,
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Booking successful!');
            window.location.href = '/my-bookings';
        } else {
            setBookingError(data.message || 'Booking failed. Please try again.');
        }
    } catch (err) {
        console.error("Booking error:", err);
        setBookingError('Network error. Is the server running?');
    } finally {
        setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <Navbar />

      {/* Dark background strip behind the fixed transparent Navbar */}
      <div className="h-32 md:h-40 bg-sunset-dark w-full relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pt-8 pb-24 w-full relative z-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sunset-teal text-sm font-bold tracking-wide uppercase mb-2">
              <MapPin size={16} />
              <span>{hotel.city} - {hotel.address}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {hotel.propertyName}
            </h1>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < hotel.starRating ? "text-sunset-gold fill-current" : "text-gray-200"} 
                />
              ))}
              <span className="ml-2 text-sm text-gray-500 font-medium">({hotel.starRating} Star Property)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-gray-700">
              <Share size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm font-medium text-gray-700">
              <Heart size={18} />
              Save
            </button>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12 rounded-3xl overflow-hidden shadow-lg h-[500px]">
          {/* Left Hero Image (50%) */}
          <div className="h-full relative group">
            <img 
              src={hotel.images[0]} 
              alt={`${hotel.propertyName} main view`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Right 2x2 Grid (50%) */}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-3 h-full">
            {hotel.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden">
                <img 
                  src={img} 
                  alt={`${hotel.propertyName} view ${idx + 2}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* View All Photos Button Overlay (on the last image) */}
                {idx === 3 && (
                  <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md transition-colors z-10">
                    <ImageIcon size={18} />
                    View all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Main Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column (70%) */}
          <div className="lg:w-2/3">
            
            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this property</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-sunset-teal/10 text-sunset-teal flex items-center justify-center shrink-0">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (30%) - Sticky Booking Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">LKR {hotel.pricePerNight.toLocaleString()}</span>
                  <span className="text-gray-500 font-medium ml-1">/ night</span>
                </div>
              </div>

              {bookingError && (
                 <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                    {bookingError}
                 </div>
              )}

              {/* Date Pickers */}
              <div className="border border-gray-300 rounded-xl overflow-hidden mb-4 flex divide-x divide-gray-300 focus-within:ring-2 focus-within:ring-sunset-orange focus-within:border-transparent transition-all">
                <div className="p-3 w-1/2 bg-gray-50/50 hover:bg-white transition-colors">
                  <label htmlFor="startDate" className="block text-xs font-bold uppercase text-gray-500 mb-1 cursor-pointer">Check-in</label>
                  <input 
                    type="date" 
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none" 
                  />
                </div>
                <div className="p-3 w-1/2 bg-gray-50/50 hover:bg-white transition-colors">
                  <label htmlFor="endDate" className="block text-xs font-bold uppercase text-gray-500 mb-1 cursor-pointer">Check-out</label>
                  <input 
                    type="date" 
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none" 
                  />
                </div>
              </div>

              {/* Guests & Rooms Picker */}
              <div className="border border-gray-300 rounded-xl overflow-hidden mb-6 flex divide-x divide-gray-300 focus-within:ring-2 focus-within:ring-sunset-orange focus-within:border-transparent transition-all">
                <div className="p-3 w-1/2 bg-gray-50/50 hover:bg-white transition-colors">
                  <label htmlFor="guests" className="block text-xs font-bold uppercase text-gray-500 mb-1 cursor-pointer">Guests</label>
                  <input 
                    type="number" 
                    id="guests"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none" 
                  />
                </div>
                <div className="p-3 w-1/2 bg-gray-50/50 hover:bg-white transition-colors">
                  <label htmlFor="rooms" className="block text-xs font-bold uppercase text-gray-500 mb-1 cursor-pointer">Rooms</label>
                  <input 
                    type="number" 
                    id="rooms"
                    min="1"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none" 
                  />
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform transition-all hover:-translate-y-0.5 focus:ring-4 focus:ring-orange-500/50 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Reserve'}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-500">You won't be charged yet</p>
                {nights > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-gray-600 border-b border-gray-100 pb-2 mt-4">
                    <span className="underline decoration-gray-300 underline-offset-4">
                        LKR {hotel.pricePerNight.toLocaleString()} x {rooms} room(s) x {nights} night(s)
                    </span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-extrabold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>LKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
