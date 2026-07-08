import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckCircle, XCircle, Activity, Building, Car, Compass, Edit, Trash2, MapPin, Calendar, Menu, Eye } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const { authFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');
    const [roleData, setRoleData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setRoleData([]);
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/roles/${role}`);
            if (res.ok) {
                const data = await res.json();
                setRoleData(data);
            } else {
                const errData = await res.json().catch(() => ({}));
                setError(`API Error ${res.status}: ${errData.message || 'Could not load data.'}`);
            }
        } catch (error) {
            console.error('Error fetching role data', error);
            setError('Network error: Could not reach the server.');
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
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Status updated!', showConfirmButton: false, timer: 3000 });
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
                        return { ...user, listings: user.listings.map(l => l._id === id ? { ...l, status } : l) };
                    }
                    return user;
                }));
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Listing status updated!', showConfirmButton: false, timer: 3000 });
            }
        } catch (error) {
            console.error('Error updating listing', error);
        }
    };

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await authFetch(`http://127.0.0.1:3001/api/admin/users/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        setRoleData(roleData.filter(u => u._id !== id));
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'User deleted!', showConfirmButton: false, timer: 3000 });
                    } else {
                        Swal.fire('Error', 'Failed to delete user.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Connection error.', 'error');
                }
            }
        });
    };

    const handleEditUser = (user) => {
        Swal.fire({
            title: 'Edit User Details',
            html: `
                <div class="flex flex-col gap-4 text-left">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                        <input id="swal-fname" class="swal2-input !m-0 w-full" value="${user.firstName}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                        <input id="swal-lname" class="swal2-input !m-0 w-full" value="${user.lastName}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input id="swal-email" type="email" class="swal2-input !m-0 w-full" value="${user.email}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                        <input id="swal-phone" class="swal2-input !m-0 w-full" value="${user.phone || ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Role</label>
                        <select id="swal-role" class="swal2-select !m-0 w-full">
                            <option value="tourist" ${user.role === 'tourist' ? 'selected' : ''}>Tourist</option>
                            <option value="hotel_owner" ${user.role === 'hotel_owner' ? 'selected' : ''}>Hotel Owner</option>
                            <option value="vehicle_owner" ${user.role === 'vehicle_owner' ? 'selected' : ''}>Vehicle Owner</option>
                            <option value="tour_guide" ${user.role === 'tour_guide' ? 'selected' : ''}>Tour Guide</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            confirmButtonColor: '#f97316',
            preConfirm: () => {
                const fname = document.getElementById('swal-fname').value;
                const lname = document.getElementById('swal-lname').value;
                const email = document.getElementById('swal-email').value;
                const phone = document.getElementById('swal-phone').value;
                const role = document.getElementById('swal-role').value;
                if (!fname || !lname || !email) {
                    Swal.showValidationMessage('Name and email are required');
                    return false;
                }
                return { firstName: fname, lastName: lname, email, phone, role };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await authFetch(`http://127.0.0.1:3001/api/admin/users/${user._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...result.value, status: user.status })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setRoleData(roleData.map(u => u._id === user._id ? data.user : u));
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'User updated!', showConfirmButton: false, timer: 3000 });
                    } else {
                        Swal.fire('Error', 'Failed to update user.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Connection error.', 'error');
                }
            }
        });
    };

    const handleViewDetails = (user) => {
        let contentHtml = '';

        if (activeTab === 'tourist') {
            if (!user.bookings || user.bookings.length === 0) {
                contentHtml = '<p class="text-gray-500 italic">No bookings found for this user.</p>';
            } else {
                contentHtml = `<div class="space-y-3 text-left">
                    ${user.bookings.map(b => `
                        <div class="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                            <p class="font-bold text-gray-800">${b.hotelId?.name || b.vehicleId?.name || b.tourId?.name || 'Unknown Booking'}</p>
                            <p class="text-xs text-gray-500">Dates: ${new Date(b.startDate).toLocaleDateString()} - ${new Date(b.endDate).toLocaleDateString()}</p>
                            <p class="text-xs font-bold text-sunset-orange mt-1">Total: LKR ${b.totalPrice?.toLocaleString()}</p>
                            <span class="text-xs font-bold uppercase mt-1 inline-block ${b.bookingStatus === 'confirmed' ? 'text-emerald-600' : 'text-orange-600'}">${b.bookingStatus}</span>
                        </div>
                    `).join('')}
                </div>`;
            }
        } else {
            if (!user.listings || user.listings.length === 0) {
                contentHtml = '<p class="text-gray-500 italic">No listings found for this user.</p>';
            } else {
                contentHtml = `<div class="space-y-4 text-left max-h-96 overflow-y-auto pr-2">
                    ${user.listings.map(l => `
                        <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                            <h4 class="font-extrabold text-lg text-gray-900 mb-1">${l.name || l.title || l.makeAndModel || 'Unnamed Service'}</h4>
                            <p class="text-sm font-bold text-sunset-orange mb-2">${l.status.toUpperCase()}</p>
                            
                            <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                ${l.location ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Location</span>${l.location}</div>` : ''}
                                ${l.price || l.pricePerDay || l.pricePerNight ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Price</span>LKR ${l.price || l.pricePerDay || l.pricePerNight}</div>` : ''}
                                ${l.vehicleType ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Type</span>${l.vehicleType}</div>` : ''}
                                ${l.capacity ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Capacity</span>${l.capacity}</div>` : ''}
                            </div>
                            
                            ${l.description ? `<div class="mt-3 text-sm text-gray-600"><span class="font-bold text-gray-400 block text-xs uppercase mb-1">Description</span>${l.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>`;
            }
        }

        Swal.fire({
            title: `<span class="text-xl font-extrabold text-gray-900">${user.firstName}'s ${activeTab === 'tourist' ? 'Bookings' : 'Listings'}</span>`,
            html: contentHtml,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl',
                htmlContainer: 'text-left'
            }
        });
    };

    const handleViewSingleListing = (listing) => {
        const contentHtml = `
            <div class="text-left space-y-4">
                <p class="text-sm font-bold text-sunset-orange mb-2">${listing.status.toUpperCase()}</p>
                <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    ${listing.location ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Location</span>${listing.location}</div>` : ''}
                    ${listing.price || listing.pricePerDay || listing.pricePerNight ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Price</span>LKR ${listing.price || listing.pricePerDay || listing.pricePerNight}</div>` : ''}
                    ${listing.vehicleType ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Type</span>${listing.vehicleType}</div>` : ''}
                    ${listing.capacity ? `<div><span class="font-bold text-gray-400 block text-xs uppercase">Capacity</span>${listing.capacity}</div>` : ''}
                </div>
                ${listing.description ? `<div class="mt-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100"><span class="font-bold text-gray-400 block text-xs uppercase mb-1">Description</span>${listing.description}</div>` : ''}
                <div class="mt-3 text-sm text-gray-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <span class="font-bold text-blue-400 block text-xs uppercase mb-1">Owner</span>
                    ${listing.owner.firstName} ${listing.owner.lastName} (${listing.owner.email})
                </div>
            </div>
        `;

        Swal.fire({
            title: `<span class="text-xl font-extrabold text-gray-900">${listing.name || listing.title || listing.makeAndModel || 'Unnamed Service'}</span>`,
            html: contentHtml,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl',
                htmlContainer: 'text-left'
            }
        });
    };

    const tabs = [
        { id: 'stats', label: 'Platform Stats', icon: Activity },
        { id: 'tourist', label: 'Tourists', icon: Users },
        { id: 'hotel_owner', label: 'Hotel Owners', icon: Building },
        { id: 'vehicle_owner', label: 'Vehicle Owners', icon: Car },
        { id: 'tour_guide', label: 'Tour Guides', icon: Compass }
    ];

    const getListingType = () => {
        if (activeTab === 'hotel_owner') return 'hotel';
        if (activeTab === 'vehicle_owner') return 'vehicle';
        if (activeTab === 'tour_guide') return 'tour';
        return '';
    };

    const renderRoleContent = () => {
        const pendingUsers = roleData.filter(u => u.status === 'pending');
        const approvedUsers = roleData.filter(u => u.status === 'approved');

        let pendingListings = [];
        if (['hotel_owner', 'vehicle_owner', 'tour_guide'].includes(activeTab)) {
            roleData.forEach(user => {
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
            <div className="space-y-8 animate-slide-up w-full overflow-hidden">
                {/* Pending Approvals */}
                {activeTab !== 'tourist' && pendingUsers.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900">Pending Approvals</h2>
                            <span className="bg-sunset-orange text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{pendingUsers.length}</span>
                        </div>
                        <div className="space-y-4">
                            {pendingUsers.map(user => (
                                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-xl bg-gray-50/50">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="font-extrabold text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm font-medium text-gray-500">{user.email} • {user.phone}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleUserAction(user._id, 'approved')} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold">
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button onClick={() => handleUserAction(user._id, 'rejected')} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold">
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Listings */}
                {pendingListings.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900">Pending Service Publications</h2>
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{pendingListings.length}</span>
                        </div>
                        <div className="space-y-4">
                            {pendingListings.map(listing => (
                                <div key={listing._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-xl bg-blue-50/20">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="font-extrabold text-lg text-gray-900">{listing.name || listing.title || listing.makeAndModel || 'Unnamed Service'}</p>
                                        <p className="text-sm font-medium text-gray-500">Owner: {listing.owner.firstName} {listing.owner.lastName}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 justify-end">
                                        <button onClick={() => handleViewSingleListing(listing)} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold">
                                            <Eye size={18} /> Details
                                        </button>
                                        <button onClick={() => handleListingAction(getListingType(), listing._id, 'approved', listing.owner._id)} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold">
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button onClick={() => handleListingAction(getListingType(), listing._id, 'rejected', listing.owner._id)} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold">
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Approved Users Table */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-900 capitalize">
                            Registered {activeTab.replace('_', ' ')}s
                        </h2>
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-auto">{approvedUsers.length}</span>
                    </div>

                    {approvedUsers.length === 0 ? (
                        <p className="text-gray-500 font-medium">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto w-full max-w-full block">
                            <table className="w-full text-left border-collapse min-w-max">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm font-bold uppercase tracking-wider">
                                        <th className="p-4 rounded-tl-xl border-b border-gray-200">Name</th>
                                        <th className="p-4 border-b border-gray-200">Contact</th>
                                        <th className="p-4 border-b border-gray-200">Status</th>
                                        <th className="p-4 border-b border-gray-200">Details</th>
                                        <th className="p-4 rounded-tr-xl border-b border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {approvedUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-extrabold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm text-gray-700">{user.email}</p>
                                                <p className="text-sm text-gray-500">{user.phone}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {activeTab === 'tourist' ? (
                                                    <button onClick={() => handleViewDetails(user)} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        {user.bookings?.length || 0} Bookings <Calendar size={14} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleViewDetails(user)} className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        {user.listings?.length || 0} Listings <Building size={14} />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleEditUser(user)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(user._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
            <Navbar />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col lg:flex-row gap-8">
                
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Left Sidebar */}
                <div className={`lg:w-1/4 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Dashboard</h2>
                        <nav className="space-y-2">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-left ${activeTab === tab.id ? 'bg-gradient-to-r from-sunset-orange to-sunset-gold text-white shadow-md transform hover:-translate-y-0.5' : 'text-gray-600 hover:bg-orange-50 hover:text-sunset-orange'}`}
                                    >
                                        <Icon size={20} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-3/4 flex-1 overflow-hidden">
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center justify-between font-medium">
                            <div className="flex items-center gap-3">
                                <XCircle size={20} className="text-red-500 shrink-0" />
                                <div>
                                    <p className="font-bold">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                            <button onClick={() => activeTab !== 'stats' ? fetchRoleData(activeTab) : fetchStats()} className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-bold">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading Spinner */}
                    {loadingData ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sunset-orange mb-4"></div>
                            <p className="text-gray-500 font-medium text-lg">Loading data...</p>
                        </div>
                    ) : activeTab === 'stats' && stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Users by Role</h2>
                                <ul className="space-y-4">
                                    {stats.userStats.map(stat => (
                                        <li key={stat._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-bold text-gray-700 capitalize">{stat._id ? stat._id.replace('_', ' ') : 'Unknown Role'}</span>
                                            <span className="bg-white text-sunset-orange px-4 py-1.5 rounded-lg text-sm font-extrabold shadow-sm">{stat.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Pending Actions</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-3xl font-extrabold text-sunset-orange mb-1">{stats.pendingRequests.users}</span>
                                        <span className="text-sm font-bold text-orange-800">Users</span>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-3xl font-extrabold text-emerald-600 mb-1">{stats.pendingRequests.hotels}</span>
                                        <span className="text-sm font-bold text-emerald-800">Hotels</span>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-3xl font-extrabold text-blue-600 mb-1">{stats.pendingRequests.vehicles}</span>
                                        <span className="text-sm font-bold text-blue-800">Vehicles</span>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center text-center">
                                        <span className="text-3xl font-extrabold text-purple-600 mb-1">{stats.pendingRequests.tours}</span>
                                        <span className="text-sm font-bold text-purple-800">Tours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        renderRoleContent()
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
