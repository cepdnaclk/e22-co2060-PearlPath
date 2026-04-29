import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';

const ProviderBookings = () => {
    const { authFetch } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

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
            const res = await authFetch(`http://127.0.0.1:3001/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingStatus: status })
            });
            if (res.ok) {
                setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: status } : b));
            }
        } catch (error) {
            console.error("Error updating booking", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-outfit">
            <Navbar />
            <div className="max-w-6xl mx-auto pt-32 px-4 pb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Booking Requests</h1>
                
                {loading ? <p>Loading...</p> : bookings.length === 0 ? <p>No booking requests found.</p> : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-sunset-dark">
                                        {booking.hotelId ? `Hotel: ${booking.hotelId.name}` : booking.vehicleId ? `Vehicle: ${booking.vehicleId.makeAndModel}` : 'Listing Booking'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Dates: {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Guest: {booking.userId?.firstName} {booking.userId?.lastName} ({booking.userId?.email})
                                    </p>
                                    <p className="font-semibold text-sunset-orange mt-2">Total: LKR {booking.totalPrice}</p>
                                    <p className="text-sm font-bold mt-2">
                                        Status: <span className={`uppercase ${booking.bookingStatus === 'pending' ? 'text-yellow-500' : booking.bookingStatus === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>{booking.bookingStatus}</span>
                                    </p>
                                </div>

                                {booking.bookingStatus === 'pending' && (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-semibold"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
