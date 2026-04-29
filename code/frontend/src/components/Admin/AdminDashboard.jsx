import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckCircle, XCircle, Activity, Building, Car, Compass, ChevronDown, ChevronUp, MapPin, Calendar } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const AdminDashboard = () => {
    const { authFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');
    const [roleData, setRoleData] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeTab === 'stats') {
            fetchStats();
        } else {
            fetchRoleData(activeTab);
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const statsRes = await authFetch('http://127.0.0.1:3001/api/admin/stats');
            if (statsRes.ok) {
                setStats(await statsRes.json());
            } else {
                const errData = await statsRes.json().catch(() => ({}));
                setError(`Stats Error ${statsRes.status}: ${errData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error fetching admin stats', error);
            setError('Network error: Could not reach the server.');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchRoleData = async (role) => {
        setLoadingData(true);
        setError(null);
        setRoleData([]); // Clear old data immediately
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/roles/${role}`);
            if (res.ok) {
                const data = await res.json();
                setRoleData(data);
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('Fetch role data failed:', res.status, errData);
                setError(`API Error ${res.status}: ${errData.message || 'Could not load data. Please log out and log back in as admin.'}`);
            }
        } catch (error) {
            console.error('Error fetching role data', error);
            setError('Network error: Could not reach the server. Is the backend running?');
        } finally {
            setLoadingData(false);
        }
    };

    const handleUserAction = async (id, status) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/users/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setRoleData(roleData.map(u => u._id === id ? { ...u, status } : u));
            }
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    const handleListingAction = async (type, id, status, userId) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/listings/${type}/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setRoleData(roleData.map(user => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            listings: user.listings.map(l => l._id === id ? { ...l, status } : l)
                        };
                    }
                    return user;
                }));
            }
        } catch (error) {
            console.error('Error updating listing', error);
        }
    };

    const renderRoleTabs = () => {
        const tabs = [
            { id: 'stats', label: 'Platform Stats', icon: <Activity size={18} /> },
            { id: 'tourist', label: 'Tourists', icon: <Users size={18} /> },
            { id: 'hotel_owner', label: 'Hotel Owners', icon: <Building size={18} /> },
            { id: 'vehicle_owner', label: 'Vehicle Owners', icon: <Car size={18} /> },
            { id: 'tour_guide', label: 'Tour Guides', icon: <Compass size={18} /> }
        ];

        return (
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setExpandedUser(null); setError(null); }}
                        className={`flex flex-1 justify-center items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-gradient-to-r from-sunset-orange to-sunset-gold text-white shadow-md transform -translate-y-0.5' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
        );
    };

    const getListingType = () => {
        if (activeTab === 'hotel_owner') return 'hotel';
        if (activeTab === 'vehicle_owner') return 'vehicle';
        if (activeTab === 'tour_guide') return 'tour';
        return '';
    };

    const renderRoleContent = () => {
        const pendingUsers = roleData.filter(u => u.status === 'pending');
        const approvedUsers = roleData.filter(u => u.status === 'approved');

        // Extract all pending listings from approved users for easy approval
        let pendingListings = [];
        if (['hotel_owner', 'vehicle_owner', 'tour_guide'].includes(activeTab)) {
            approvedUsers.forEach(user => {
                if (user.listings && user.listings.length > 0) {
                    user.listings.forEach(listing => {
                        if (listing.status === 'pending') {
                            pendingListings.push({ ...listing, owner: user });
                        }
                    });
                }
            });
        }

        return (
            <div className="space-y-8 animate-slide-up">
                {/* Pending Approvals (Users) */}
                {activeTab !== 'tourist' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <Users className="text-sunset-orange" size={20} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Pending Approvals</h2>
                            <span className="bg-sunset-orange text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{pendingUsers.length}</span>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <p className="text-gray-500 font-medium">No pending requests for this role.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map(user => (
                                    <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                                        <div className="mb-4 sm:mb-0">
                                            <p className="font-extrabold text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                {user.email} <span className="w-1 h-1 rounded-full bg-gray-300"></span> {user.phone}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleUserAction(user._id, 'approved')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 font-bold transition-colors">
                                                <CheckCircle size={18} /> Approve
                                            </button>
                                            <button onClick={() => handleUserAction(user._id, 'rejected')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-bold transition-colors">
                                                <XCircle size={18} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pending Service Publications */}
                {['hotel_owner', 'vehicle_owner', 'tour_guide'].includes(activeTab) && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <Activity className="text-blue-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Pending Service Publications</h2>
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{pendingListings.length}</span>
                        </div>

                        {pendingListings.length === 0 ? (
                            <p className="text-gray-500 font-medium">No pending publications require approval.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingListings.map(listing => (
                                    <div key={listing._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-blue-50/20">
                                        <div className="mb-4 sm:mb-0">
                                            <p className="font-extrabold text-lg text-gray-900">{listing.name || listing.title || listing.makeAndModel || 'Unnamed Service'}</p>
                                            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                {listing.location ? <><MapPin size={14} /> {listing.location}</> : listing.vehicleType ? <><Car size={14}/> {listing.vehicleType}</> : 'Details not specified'} <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                                                <Users size={14} /> Owner: {listing.owner.firstName} {listing.owner.lastName}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleListingAction(getListingType(), listing._id, 'approved', listing.owner._id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 font-bold transition-colors">
                                                <CheckCircle size={18} /> Approve
                                            </button>
                                            <button onClick={() => handleListingAction(getListingType(), listing._id, 'rejected', listing.owner._id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-bold transition-colors">
                                                <XCircle size={18} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Approved Users List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle className="text-emerald-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            Registered {activeTab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}s
                        </h2>
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{approvedUsers.length}</span>
                    </div>

                    {approvedUsers.length === 0 ? (
                        <p className="text-gray-500 font-medium">No approved users found.</p>
                    ) : (
                        <div className="space-y-4">
                            {approvedUsers.map(user => (
                                <div key={user._id} className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:border-sunset-teal/30">
                                    <div 
                                        onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                        className="flex justify-between items-center p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-extrabold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm font-medium text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {activeTab === 'tourist' ? (
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">
                                                    {user.bookings?.length || 0} Bookings
                                                </span>
                                            ) : (
                                                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold">
                                                    {user.listings?.length || 0} Listings
                                                </span>
                                            )}
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                {expandedUser === user._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Section */}
                                    {expandedUser === user._id && (
                                        <div className="p-5 bg-gray-50/50 border-t border-gray-100">
                                            {activeTab === 'tourist' ? (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Calendar size={16}/> Booking History</h4>
                                                    {(!user.bookings || user.bookings.length === 0) ? (
                                                        <p className="text-sm text-gray-500 italic">No bookings found for this tourist.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {user.bookings.map(booking => (
                                                                <div key={booking._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-bold text-gray-800 text-sm">
                                                                            {booking.hotelId?.name || booking.vehicleId?.name || booking.tourId?.name || 'Unknown Booking'}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-extrabold text-sunset-teal">LKR {booking.totalPrice.toLocaleString()}</p>
                                                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                            booking.bookingStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                                            booking.bookingStatus === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                                        }`}>
                                                                            {booking.bookingStatus}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Building size={16}/> Property / Service Listings</h4>
                                                    {(!user.listings || user.listings.length === 0) ? (
                                                        <p className="text-sm text-gray-500 italic">No listings requested by this owner yet.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {user.listings.map(listing => (
                                                                <div key={listing._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                    <div>
                                                                        <p className="font-bold text-gray-800">{listing.name || listing.title || listing.makeAndModel || 'Unnamed Service'}</p>
                                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                            {listing.location ? <><MapPin size={12}/> {listing.location}</> : listing.vehicleType ? <><Car size={12}/> {listing.vehicleType}</> : 'N/A'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                                            listing.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                                            listing.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                                        }`}>
                                                                            {listing.status}
                                                                        </span>
                                                                        
                                                                        {listing.status === 'pending' && (
                                                                            <div className="flex gap-2">
                                                                                <button onClick={() => handleListingAction(getListingType(), listing._id, 'approved', user._id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="Approve">
                                                                                    <CheckCircle size={16} />
                                                                                </button>
                                                                                <button onClick={() => handleListingAction(getListingType(), listing._id, 'rejected', user._id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                                                                                    <XCircle size={16} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
            <Navbar />
            
            {/* Header Banner */}
            <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1a2f3a] to-sunset-dark"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Admin Control Center</h1>
                    <p className="text-lg text-gray-300 font-medium">Manage users, approve listings, and monitor platform activity.</p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-20 relative -mt-6">
                {renderRoleTabs()}

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium">
                        <XCircle size={20} className="text-red-500 shrink-0" />
                        <div>
                            <p className="font-bold">Error Loading Data</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button onClick={() => activeTab !== 'stats' ? fetchRoleData(activeTab) : fetchStats()} className="ml-auto bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading Spinner */}
                {loadingData && (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-10 h-10 border-4 border-sunset-orange/30 border-t-sunset-orange rounded-full animate-spin"></div>
                    </div>
                )}

                {activeTab === 'stats' && stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-12 h-12 bg-sunset-teal/10 rounded-xl flex items-center justify-center">
                                    <Users className="text-sunset-teal" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">Users by Role</h2>
                                    <p className="text-sm font-medium text-gray-500">Distribution of registered accounts</p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {stats.userStats.map(stat => (
                                    <li key={stat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="font-bold text-gray-700 capitalize">{stat._id ? stat._id.replace('_', ' ') : 'Unknown Role'}</span>
                                        <span className="bg-white border border-gray-200 text-sunset-teal px-4 py-1.5 rounded-lg text-sm font-extrabold shadow-sm">{stat.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-12 h-12 bg-sunset-orange/10 rounded-xl flex items-center justify-center">
                                    <Activity className="text-sunset-orange" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">Pending Actions</h2>
                                    <p className="text-sm font-medium text-gray-500">Items requiring administrator review</p>
                                </div>
                            </div>
                            <ul className="grid grid-cols-2 gap-4">
                                <li className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
                                    <span className="text-3xl font-extrabold text-sunset-orange mb-1">{stats.pendingRequests.users}</span>
                                    <span className="text-sm font-bold text-orange-800">Users</span>
                                </li>
                                <li className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                                    <span className="text-3xl font-extrabold text-emerald-600 mb-1">{stats.pendingRequests.hotels}</span>
                                    <span className="text-sm font-bold text-emerald-800">Hotels</span>
                                </li>
                                <li className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                                    <span className="text-3xl font-extrabold text-blue-600 mb-1">{stats.pendingRequests.vehicles}</span>
                                    <span className="text-sm font-bold text-blue-800">Vehicles</span>
                                </li>
                                <li className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
                                    <span className="text-3xl font-extrabold text-purple-600 mb-1">{stats.pendingRequests.tours}</span>
                                    <span className="text-sm font-bold text-purple-800">Tours</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : activeTab !== 'stats' && !loadingData ? (
                    renderRoleContent()
                ) : null}
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
