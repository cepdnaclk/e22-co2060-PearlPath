import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import { Building, Car, Map, User, Mail, Phone, Calendar, Users, Home, CheckCircle2, XCircle, Clock, BedDouble, TrendingUp, FileText } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import ProviderPayments from './ProviderPayments';

const ProviderBookings = () => {
    const { authFetch } = useAuth();
    const { convertPrice, getCurrencySymbol } = useCurrency();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchBookingId = searchParams.get('bookingId');
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (!loading && searchBookingId) {
            const element = document.getElementById(`booking-${searchBookingId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [loading, searchBookingId]);

    const fetchBookings = async () => {
        try {
            const res = await authFetch('http://127.0.0.1:3001/api/bookings/provider');
            if (res.ok) {
                const data = await res.json();
                setBookings(data.response);
            }
        } catch (error) {
            console.error("Error fetching provider bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const endpoint = status === 'accepted' ? 'accept' : status === 'rejected' ? 'reject' : null;
            if (!endpoint) return;

            const res = await authFetch(`http://127.0.0.1:3001/api/bookings/${id}/${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: status } : b));
            } else {
                const data = await res.json();
                Swal.fire('Error', data.message || `Failed to ${endpoint} booking`, 'error');
            }
        } catch (error) {
            console.error("Error updating booking", error);
            Swal.fire('Error', 'Network error', 'error');
        }
    };

    const getBookingTypeInfo = (booking) => {
        if (booking.hotelId) return { type: 'Hotel', name: booking.hotelId.name, icon: Building, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
        if (booking.vehicleId) return { type: 'Vehicle', name: booking.vehicleId.makeAndModel, icon: Car, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' };
        if (booking.tourId) return { type: 'Tour', name: booking.tourId.title, icon: Map, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' };
        return { type: 'Listing', name: 'Unknown Listing', icon: Home, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' };
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
            case 'accepted': return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'confirmed': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
            case 'rejected': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
            default: return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
        }
    };

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;
    const totalRevenue = bookings.filter(b => b.bookingStatus === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const filteredBookings = filterStatus === 'all' ? bookings : bookings.filter(b => b.bookingStatus === filterStatus);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
            <Navbar />

            {/* Top Hero Banner */}
            <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">Manage Booking Requests</h1>
                        <p className="text-xl text-gray-300 font-light">Review and respond to booking requests from your guests.</p>
                    </div>
                    {/* Summary Stats & Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[120px]">
                                <p className="text-gray-300 text-sm font-semibold mb-1">Pending</p>
                                <p className="text-3xl font-black text-yellow-400">{pendingBookings}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[120px]">
                                <p className="text-gray-300 text-sm font-semibold mb-1">Confirmed Rev.</p>
                                <p className="text-xl font-black text-green-400 mt-1">{getCurrencySymbol()}{convertPrice(totalRevenue).toLocaleString()}</p>
                            </div>
                        </div>
                        <Link to="/provider-revenue" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-5 py-3.5 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all self-stretch sm:self-auto">
                            <TrendingUp size={20} />
                            View Financial Report
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                
                {/* Main Tabs */}
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'bookings' 
                                ? 'bg-sunset-orange text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <Calendar size={20} />
                        Booking Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('payments')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'payments' 
                                ? 'bg-sunset-orange text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <FileText size={20} />
                        Payment Verifications
                    </button>
                </div>

                {activeTab === 'payments' ? (
                    <ProviderPayments />
                ) : (
                    <>
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-px">
                            {['all', 'pending', 'accepted', 'confirmed', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 ${
                                filterStatus === status 
                                    ? 'border-sunset-orange text-sunset-orange' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-orange"></div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings found</h3>
                        <p className="text-gray-500">You don't have any {filterStatus !== 'all' ? filterStatus : ''} booking requests yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map(booking => {
                            const typeInfo = getBookingTypeInfo(booking);
                            const TypeIcon = typeInfo.icon;
                            const statusStyle = getStatusStyle(booking.bookingStatus);
                            const StatusIcon = statusStyle.icon;

                            return (
                                <div 
                                    key={booking._id} 
                                    id={`booking-${booking._id}`}
                                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-500 overflow-hidden ${
                                        searchBookingId === booking._id 
                                            ? 'border-sunset-orange ring-2 ring-sunset-orange/20 shadow-md scale-[1.01]' 
                                            : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        
                                        {/* Left Col: Type & Core Details */}
                                        <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl ${typeInfo.bg} ${typeInfo.color} shrink-0`}>
                                                    <TypeIcon size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{typeInfo.type} Booking</div>
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-3">
                                                        {typeInfo.name}
                                                    </h3>
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
                                                        <StatusIcon size={14} />
                                                        <span className="uppercase tracking-wide">{booking.bookingStatus}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle Col: Guest Details */}
                                        <div className="p-6 lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Guest Information</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2.5 text-gray-700">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="font-semibold">{booking.userId?.firstName} {booking.userId?.lastName}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-gray-600 text-sm">
                                                    <Mail size={16} className="text-gray-400" />
                                                    <span className="truncate">{booking.userId?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-gray-600 text-sm">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <span>{booking.userId?.phone || 'Not provided'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle Col: Booking Details */}
                                        <div className="p-6 lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Booking Details</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2.5 text-gray-700 text-sm">
                                                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold block">{new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                                        <span className="text-gray-500 text-xs">to</span>
                                                        <span className="font-semibold block">{new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-md">
                                                        <Users size={14} /> {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                                                    </div>
                                                    {booking.rooms && (
                                                        <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-md">
                                                            <BedDouble size={14} /> {booking.rooms} {booking.rooms === 1 ? 'Room' : 'Rooms'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Col: Price & Actions */}
                                        <div className="p-6 lg:w-1/6 flex flex-col justify-between items-end lg:items-start bg-orange-50/30">
                                            <div className="text-right lg:text-left w-full mb-4 lg:mb-0">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</h4>
                                                <div className="text-2xl font-black text-sunset-orange">
                                                    {getCurrencySymbol()}{convertPrice(booking.totalPrice || 0).toLocaleString()}
                                                </div>
                                            </div>

                                            {booking.bookingStatus === 'pending' && (
                                                <div className="flex lg:flex-col gap-2 w-full">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                                                        className="flex-1 lg:w-full bg-sunset-teal text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                                                        className="flex-1 lg:w-full bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 font-bold transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle size={18} />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                </>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
