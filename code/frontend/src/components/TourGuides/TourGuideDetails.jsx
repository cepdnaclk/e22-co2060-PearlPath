import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Languages, Mail, Currency, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

import ReviewSection from '../Reviews/ReviewSection';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../ProviderCalendar/ProviderCalendar.css';

const TourGuideDetails = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const { user, authFetch } = useAuth();
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/tour-guides/${id}`);
        if (response.ok) {
          const data = await response.json();
            setGuide({
              id: data._id,
              userId: data.userId?._id, // Add userId to map to providerId
              name: data.name,
              location: data.location,
              pricePerDay: data.pricePerDay || 0,
              experienceYears: data.experienceYears || 0,
              languages: data.languages || ["English"],
              bio: data.bio || "No biography provided.",
              profilePictureUrl: data.profilePictureUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
              contactEmail: data.contactEmail || data.userId?.email,
              phone: data.userId?.phone
            });
        }
      } catch (error) {
        console.error("Failed to fetch tour guide:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchAvailability = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3001/api/tour-guides/${id}/availability`);
            if (res.ok) {
                const data = await res.json();
                setDisabledDates(data.disabledDates || []);
            }
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    fetchGuide();
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
    if (!bookingData.startDate || !bookingData.endDate || !guide) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const rentalDays = days > 0 ? days : 1; 
    if (days < 0) return 0;
    return rentalDays * guide.pricePerDay;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book.');
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
          tourId: guide.id,
          providerId: guide.userId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: 1,
          totalPrice
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setBookingMessage('Booking request sent successfully!');
        setTimeout(() => window.location.href = '/my-bookings', 2000);
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

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">Loading...</div>
       <Footer />
    </div>
  );

  if (!guide) return (
     <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
       <Navbar />
       <div className="flex-1 flex items-center justify-center">Guide not found.</div>
       <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-sunset-dark text-white relative overflow-hidden">
         <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10 flex items-center gap-4">
             <Link to="/tour-guides" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all text-white">
                <ArrowLeft size={20} />
             </Link>
             <h1 className="text-3xl font-extrabold">Tour Guide Profile</h1>
         </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
         <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* Left side Image */}
            <div className="w-full md:w-2/5 md:h-auto h-72 relative bg-gray-100">
               <img 
                 src={guide.profilePictureUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"} 
                 alt={guide.name} 
                 className="w-full h-full object-cover" 
                 onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"; }}
               />
               <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h2 className="text-3xl font-black text-white drop-shadow-md">{guide.name}</h2>
                  <div className="flex items-center gap-1 text-white/90 mt-1 font-medium">
                     <MapPin size={16} className="text-sunset-gold" />
                     <span>{guide.location}</span>
                  </div>
               </div>
            </div>

            {/* Right side Details */}
            <div className="w-full md:w-3/5 p-8 flex flex-col">
                
                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mb-8">
                   <div className="bg-orange-50 px-4 py-3 rounded-2xl flex-1 border border-orange-100">
                       <span className="text-xs text-orange-600 font-bold uppercase tracking-wider block mb-1">Rate</span>
                       <span className="text-xl font-black text-sunset-orange">{getCurrencySymbol()} {convertPrice(guide.pricePerDay || 0).toLocaleString()} <span className="text-sm text-gray-500 font-medium">/ day</span></span>
                   </div>
                   <div className="bg-teal-50 px-4 py-3 rounded-2xl flex-1 border border-teal-100">
                       <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block mb-1">Experience</span>
                       <span className="text-xl font-black text-sunset-teal">{guide.experienceYears} Years</span>
                   </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                       <ShieldCheck size={20} className="text-sunset-teal" />
                       About Me
                   </h3>
                   <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      {guide.bio}
                   </p>
                </div>

                <div className="mb-8">
                   <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                       <Languages size={20} className="text-sunset-teal" />
                       Languages Fluent In
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {guide.languages.map((l, i) => (
                         <span key={i} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-gray-200">
                            {l}
                         </span>
                      ))}
                   </div>
                </div>

                <div className="mt-auto space-y-3">
                   <a 
                      href={`mailto:${guide.contactEmail || ''}`}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sunset-dark to-sunset-teal text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                   >
                     <Send size={18} />
                     Email Local Expert
                   </a>
                   {guide.phone && (
                     <a 
                        href={`tel:${guide.phone}`}
                        className="w-full flex items-center justify-center gap-2 bg-white text-sunset-teal font-bold py-3.5 px-4 rounded-xl shadow-sm border border-sunset-teal/30 hover:bg-sunset-teal/5 transition-all"
                     >
                       Call Local Expert: {guide.phone}
                     </a>
                   )}
                </div>
            </div>

         </div>

         {/* Booking Section */}
         <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-8 mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book this Tour Guide</h3>
                <p className="text-gray-600 mb-6">Select your travel dates to request a booking with {guide.name}.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Dates</label>
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
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center">
                {(!user || user.role === 'tourist') ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        {calculateTotalPrice() > 0 && (
                            <div className="pb-4 border-b border-gray-200 flex justify-between items-center text-lg font-bold">
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
                            disabled={bookingLoading}
                            className="w-full bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {bookingLoading ? 'Processing...' : (user ? 'Request Booking' : 'Sign In to Book')}
                        </button>
                    </form>
                ) : (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Tourist Feature Only</h3>
                        <p className="text-blue-700 text-sm font-medium">As a {user.role.replace('_', ' ')}, you cannot book tour guides. Only tourists can make bookings.</p>
                    </div>
                )}
            </div>
         </div>
         
         <ReviewSection targetId={guide.id} targetModel="TourGuide" />
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideDetails;
