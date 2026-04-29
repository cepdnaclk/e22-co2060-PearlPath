import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckCircle, XCircle, Activity, Building, Car, MapPin } from 'lucide-react';

const AdminDashboard = () => {
    const { authFetch } = useAuth();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingListings, setPendingListings] = useState({ hotels: [], vehicles: [], tours: [] });
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'listings', 'stats'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersRes = await authFetch('http://127.0.0.1:3001/api/admin/users/pending');
            const listingsRes = await authFetch('http://127.0.0.1:3001/api/admin/listings/pending');
            const statsRes = await authFetch('http://127.0.0.1:3001/api/admin/stats');
            
            if (usersRes.ok) setPendingUsers(await usersRes.json());
            if (listingsRes.ok) setPendingListings(await listingsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error('Error fetching admin data', error);
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
                setPendingUsers(pendingUsers.filter(u => u._id !== id));
            }
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    const handleListingAction = async (type, id, status) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/listings/${type}/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setPendingListings({
                    ...pendingListings,
                    [type + 's']: pendingListings[type + 's'].filter(l => l._id !== id)
                });
            }
        } catch (error) {
            console.error('Error updating listing', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-outfit">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
            
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-sunset-orange text-white' : 'bg-white text-gray-600 shadow'}`}
                >
                    <Users className="inline mr-2" size={18}/> Pending Users
                </button>
                <button 
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'listings' ? 'bg-sunset-orange text-white' : 'bg-white text-gray-600 shadow'}`}
                >
                    <Building className="inline mr-2" size={18}/> Pending Listings
                </button>
                <button 
                    onClick={() => setActiveTab('stats')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'stats' ? 'bg-sunset-orange text-white' : 'bg-white text-gray-600 shadow'}`}
                >
                    <Activity className="inline mr-2" size={18}/> Platform Stats
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending User Approvals</h2>
                    {pendingUsers.length === 0 ? <p className="text-gray-500">No pending users.</p> : (
                        <div className="space-y-4">
                            {pendingUsers.map(user => (
                                <div key={user._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-500">{user.email} | Role: <span className="uppercase text-sunset-orange font-semibold">{user.role.replace('_', ' ')}</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUserAction(user._id, 'approved')} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200">
                                            <CheckCircle size={20} />
                                        </button>
                                        <button onClick={() => handleUserAction(user._id, 'rejected')} className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'listings' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending Hotels</h2>
                        {pendingListings.hotels?.length === 0 ? <p className="text-gray-500">No pending hotels.</p> : (
                            <div className="space-y-4">
                                {pendingListings.hotels?.map(hotel => (
                                    <div key={hotel._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold">{hotel.name}</p>
                                            <p className="text-sm text-gray-500">Owner: {hotel.ownerId?.email} | Location: {hotel.location}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleListingAction('hotel', hotel._id, 'approved')} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 text-sm font-bold">Approve</button>
                                            <button onClick={() => handleListingAction('hotel', hotel._id, 'rejected')} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 text-sm font-bold">Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Extend this for Vehicles and Tours similarly */}
                </div>
            )}

            {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Users by Role</h2>
                        <ul className="space-y-3">
                            {stats.userStats.map(stat => (
                                <li key={stat._id} className="flex justify-between font-medium">
                                    <span className="capitalize">{stat._id.replace('_', ' ')}</span>
                                    <span className="bg-sunset-orange text-white px-3 py-1 rounded-full text-sm">{stat.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending Requests</h2>
                        <ul className="space-y-3">
                            <li className="flex justify-between font-medium">Users <span>{stats.pendingRequests.users}</span></li>
                            <li className="flex justify-between font-medium">Hotels <span>{stats.pendingRequests.hotels}</span></li>
                            <li className="flex justify-between font-medium">Vehicles <span>{stats.pendingRequests.vehicles}</span></li>
                            <li className="flex justify-between font-medium">Tours <span>{stats.pendingRequests.tours}</span></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
