import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const SuperAdminDashboard = () => {
    const { authFetch, user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [currentView, setCurrentView] = useState('home'); // 'home', 'users', 'hotels', 'vehicles', 'tours', 'bookings'
    const [modelData, setModelData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentView === 'home') {
            fetchStats();
        } else {
            fetchModelData(currentView);
        }
    }, [currentView]);

    const fetchStats = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const statsRes = await authFetch('http://127.0.0.1:3001/api/admin/stats');
            if (statsRes.ok) {
                setStats(await statsRes.json());
            } else {
                setError(`Stats Error ${statsRes.status}`);
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchModelData = async (modelName) => {
        setLoadingData(true);
        setError(null);
        setModelData([]);
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/models/${modelName}`);
            if (res.ok) {
                setModelData(await res.json());
            } else {
                setError(`API Error ${res.status}`);
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setLoadingData(false);
        }
    };

    const handleAction = async (id, actionType) => {
        try {
            let url = '';
            let method = 'PUT';
            let body = {};

            if (actionType === 'delete') {
                if (!window.confirm(`Are you sure you want to delete this ${currentView.slice(0, -1)}?`)) return;
                url = `http://127.0.0.1:3001/api/admin/models/${currentView}/${id}`;
                method = 'DELETE';
            } else if (actionType === 'approve') {
                if (currentView === 'users') {
                    url = `http://127.0.0.1:3001/api/admin/users/${id}/status`;
                } else if (['hotels', 'vehicles', 'tours'].includes(currentView)) {
                    // Singularize currentView for the API
                    const type = currentView.slice(0, -1);
                    url = `http://127.0.0.1:3001/api/admin/listings/${type}/${id}/status`;
                }
                body = { status: 'approved' };
            }

            if (!url) return;

            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(method !== 'DELETE' && { body: JSON.stringify(body) })
            });

            if (res.ok) {
                if (actionType === 'delete') {
                    setModelData(modelData.filter(item => item._id !== id));
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Deleted successfully', showConfirmButton: false, timer: 3000 });
                } else if (actionType === 'approve') {
                    setModelData(modelData.map(item => item._id === id ? { ...item, status: 'approved' } : item));
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Approved successfully', showConfirmButton: false, timer: 3000 });
                }
            } else {
                Swal.fire('Error', 'Action failed', 'error');
            }
        } catch (error) {
            console.error('Action error', error);
            Swal.fire('Error', 'Network error', 'error');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                setModelData(modelData.map(item => item._id === id ? { ...item, role: newRole } : item));
                Swal.fire({
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
                    icon: 'success', title: 'Role updated successfully'
                });
            } else {
                Swal.fire('Error', 'Failed to update role', 'error');
            }
        } catch (error) {
            console.error('Role update error', error);
            Swal.fire('Error', 'Network error', 'error');
        }
    };

    // Helper to get formatted name for view
    const getViewName = (view) => {
        const names = {
            'users': 'Users',
            'hotels': 'Hotels',
            'vehicles': 'Vehicles',
            'tours': 'Tours',
            'bookings': 'Bookings'
        };
        return names[view] || view;
    };

    // UI Styles (Django Classic)
    const headerColor = '#417690';
    const linkColor = '#447e9b';
    const actionBg = '#79aec8';

    // Dynamic Columns per model
    const renderTableHeaders = () => {
        if (currentView === 'users') {
            return (
                <>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Email</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">First Name</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Role</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Status</th>
                </>
            );
        } else if (['hotels', 'vehicles', 'tours'].includes(currentView)) {
            return (
                <>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Name</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Owner</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Location/City</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Status</th>
                </>
            );
        } else if (currentView === 'bookings') {
            return (
                <>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">User</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Details</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Date</th>
                    <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px]">Status</th>
                </>
            );
        }
    };

    const renderTableRow = (item) => {
        if (currentView === 'users') {
            return (
                <>
                    <td className="p-2 border-b border-[#eee] font-bold">
                        <a href="#" style={{ color: linkColor }} className="hover:underline hover:text-[#036]">{item.email}</a>
                    </td>
                    <td className="p-2 border-b border-[#eee]">{item.firstName} {item.lastName}</td>
                    <td className="p-2 border-b border-[#eee] capitalize">
                        <select 
                            value={item.role} 
                            onChange={(e) => handleRoleChange(item._id, e.target.value)}
                            className="border border-[#ccc] p-1 text-xs bg-white rounded"
                        >
                            <option value="tourist">Tourist</option>
                            <option value="hotel_owner">Hotel Owner</option>
                            <option value="vehicle_owner">Vehicle Owner</option>
                            <option value="tour_guide">Tour Guide</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </td>
                    <td className="p-2 border-b border-[#eee]">{renderStatus(item.status)}</td>
                </>
            );
        } else if (['hotels', 'vehicles', 'tours'].includes(currentView)) {
            return (
                <>
                    <td className="p-2 border-b border-[#eee] font-bold">
                        <a href="#" style={{ color: linkColor }} className="hover:underline hover:text-[#036]">{item.name || item.title || item.vehicleType}</a>
                    </td>
                    <td className="p-2 border-b border-[#eee]">{item.ownerId?.email || 'N/A'}</td>
                    <td className="p-2 border-b border-[#eee]">{item.city || item.location || 'N/A'}</td>
                    <td className="p-2 border-b border-[#eee]">{renderStatus(item.status)}</td>
                </>
            );
        } else if (currentView === 'bookings') {
            return (
                <>
                    <td className="p-2 border-b border-[#eee] font-bold">
                        <a href="#" style={{ color: linkColor }} className="hover:underline hover:text-[#036]">{item.userId?.email || 'N/A'}</a>
                    </td>
                    <td className="p-2 border-b border-[#eee]">
                        {item.hotelId?.name || item.vehicleId?.name || item.tourId?.name || 'Item'}
                    </td>
                    <td className="p-2 border-b border-[#eee]">
                        {new Date(item.createdAt || item.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border-b border-[#eee]">{renderStatus(item.status)}</td>
                </>
            );
        }
    };

    const renderStatus = (status) => {
        if (status === 'approved' || status === 'confirmed') {
            return <span className="text-[#008000] font-bold uppercase text-[10px]">✔ {status}</span>;
        } else if (status === 'pending') {
            return <span className="text-[#ba2121] font-bold uppercase text-[10px]">⚠ {status}</span>;
        }
        return <span className="text-gray-500 uppercase text-[10px]">{status || 'N/A'}</span>;
    };

    const renderAppRow = (modelKey, label) => {
        const count = stats?.modelTotals?.[modelKey] || 0;
        return (
            <tr key={modelKey} className="bg-white border-b border-[#eee] hover:bg-[#f9f9f9]">
                <td className="p-2 font-bold w-1/2">
                    <button 
                        style={{ color: linkColor }} 
                        className="hover:text-[#036] hover:underline"
                        onClick={() => setCurrentView(modelKey)}
                    >
                        {label}
                    </button>
                </td>
                <td className="p-2 text-right">
                    <span className="text-gray-500 text-xs">Total: {count}</span>
                </td>
                <td className="p-2 text-right w-24">
                    <button onClick={() => setCurrentView(modelKey)} className="text-[#999] hover:text-[#036] text-xl font-bold align-middle leading-none px-2 rounded transition-colors">
                        ✎
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[13px] text-[#333]">
            {/* Header */}
            <div style={{ backgroundColor: headerColor }} className="px-10 py-3 flex justify-between items-center text-white">
                <h1 className="text-2xl font-normal m-0 tracking-tight" style={{ color: '#f5dd5d' }}>
                    PearlPath administration
                </h1>
                <div className="text-xs uppercase font-bold flex items-center gap-4">
                    <span>WELCOME, {user?.firstName?.toUpperCase() || 'ADMIN'}.</span>
                    <a href="/" className="text-white hover:text-gray-200">View site</a> / 
                    <button onClick={logout} className="text-white hover:text-gray-200 font-bold">Log out</button>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div style={{ backgroundColor: actionBg }} className="px-10 py-2.5 text-white text-[13px] mb-4">
                <button onClick={() => setCurrentView('home')} className="hover:underline">Home</button>
                {currentView !== 'home' && (
                    <span> &rsaquo; {getViewName(currentView)}</span>
                )}
            </div>

            <div className="px-10 py-2 max-w-[1200px] flex gap-8">
                <div className="flex-1">
                    <h1 className="text-2xl font-normal text-[#666] mb-5">
                        {currentView === 'home' ? 'Site administration' : `Select ${getViewName(currentView).toLowerCase()} to change`}
                    </h1>

                    {error && (
                        <div className="bg-[#ffc] border border-[#ff0] p-2 mb-4 text-[#cc0000] font-bold">
                            {error}
                        </div>
                    )}

                    {loadingData ? (
                        <p className="text-gray-500 italic">Loading data...</p>
                    ) : currentView === 'home' && stats ? (
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2">
                                {/* Auth App */}
                                <table className="w-full border border-[#eee] text-left border-collapse mb-8 shadow-sm">
                                    <thead>
                                        <tr>
                                            <th colSpan="3" style={{ backgroundColor: actionBg }} className="text-white font-bold p-2 text-[14px]">
                                                Authentication and Authorization
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderAppRow('users', 'Users')}
                                    </tbody>
                                </table>

                                {/* PearlPath Platform App */}
                                <table className="w-full border border-[#eee] text-left border-collapse mb-8 shadow-sm">
                                    <thead>
                                        <tr>
                                            <th colSpan="3" style={{ backgroundColor: actionBg }} className="text-white font-bold p-2 text-[14px]">
                                                PearlPath Platform
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderAppRow('hotels', 'Hotels')}
                                        {renderAppRow('vehicles', 'Vehicles')}
                                        {renderAppRow('tours', 'Tours')}
                                        {renderAppRow('bookings', 'Bookings')}
                                    </tbody>
                                </table>
                            </div>

                            {/* Recent Actions Sidebar */}
                            <div className="col-span-1 bg-[#f8f8f8] border border-[#eee] p-4 shadow-sm h-fit">
                                <h2 className="font-bold text-[#333] border-b border-[#ddd] pb-1 mb-2 uppercase text-xs">Recent actions</h2>
                                <h3 className="text-xs text-[#666] mb-3">Pending Tasks</h3>
                                
                                <ul className="text-xs space-y-2 text-[#666]">
                                    <li className="flex gap-2 items-start">
                                        <span className="text-[#ba2121] font-bold">!</span>
                                        <span>{stats.pendingRequests?.users || 0} Pending Users</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-[#ba2121] font-bold">!</span>
                                        <span>{stats.pendingRequests?.hotels || 0} Pending Hotels</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-[#ba2121] font-bold">!</span>
                                        <span>{stats.pendingRequests?.vehicles || 0} Pending Vehicles</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-[#ba2121] font-bold">!</span>
                                        <span>{stats.pendingRequests?.tours || 0} Pending Tours</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : currentView !== 'home' ? (
                        <div className="flex gap-6">
                            {/* Change List */}
                            <div className="flex-1">
                                <div className="bg-[#f8f8f8] border border-[#eee] p-2 mb-4 flex items-center gap-2 shadow-sm">
                                    <label className="text-[#333] font-bold text-xs">Action: </label>
                                    <select className="border border-[#ccc] p-1 text-xs bg-white">
                                        <option>---------</option>
                                        <option>Delete selected</option>
                                        <option>Approve selected</option>
                                    </select>
                                    <button className="bg-white border border-[#ccc] px-2 py-1 text-xs hover:bg-[#eee]">Go</button>
                                    <span className="text-xs text-[#666] ml-2">0 of {modelData.length} selected</span>
                                </div>

                                <table className="w-full border-t border-b border-[#eee] text-left border-collapse shadow-sm">
                                    <thead>
                                        <tr className="bg-[#f8f8f8]">
                                            <th className="p-2 border-b border-[#ddd] w-8 text-center"><input type="checkbox" /></th>
                                            {renderTableHeaders()}
                                            <th className="p-2 border-b border-[#ddd] font-bold text-[#666] uppercase text-[11px] text-right">Admin Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modelData.length === 0 ? (
                                            <tr><td colSpan="6" className="p-3 text-center text-gray-500 italic">No {currentView} found.</td></tr>
                                        ) : modelData.map((item, idx) => (
                                            <tr key={item._id} className={idx % 2 === 0 ? "bg-white hover:bg-[#f5f5f5]" : "bg-[#f9f9f9] hover:bg-[#f5f5f5]"}>
                                                <td className="p-2 border-b border-[#eee] text-center"><input type="checkbox" /></td>
                                                {renderTableRow(item)}
                                                <td className="p-2 border-b border-[#eee] text-right">
                                                    {item.status === 'pending' && currentView !== 'bookings' && (
                                                        <button 
                                                            onClick={() => handleAction(item._id, 'approve')}
                                                            className="text-[10px] bg-[#79aec8] text-white px-2 py-0.5 rounded mr-1 hover:bg-[#417690]"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleAction(item._id, 'delete')} className="text-[10px] text-[#ba2121] hover:underline font-bold">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-[#666] text-xs mt-2 font-bold">{modelData.length} {getViewName(currentView).toLowerCase()}</p>
                            </div>

                            {/* Filters Sidebar */}
                            <div className="w-64 bg-[#f8f8f8] border border-[#eee] shadow-sm h-fit">
                                <h2 style={{ backgroundColor: '#f8f8f8' }} className="font-bold text-[#333] border-b border-[#eee] p-2 uppercase text-xs">Filter</h2>
                                
                                <div className="p-3 border-b border-[#eee]">
                                    <h3 className="font-bold text-[#666] text-xs mb-1">By status</h3>
                                    <ul className="text-xs space-y-1">
                                        <li><a href="#" className="font-bold hover:underline" style={{ color: linkColor }}>All</a></li>
                                        <li><a href="#" className="hover:underline text-gray-600">Pending</a></li>
                                        <li><a href="#" className="hover:underline text-gray-600">Approved</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
