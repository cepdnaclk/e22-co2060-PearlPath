import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Swal from 'sweetalert2';
import { User, Mail, Phone, Shield, Bell } from 'lucide-react';

const Profile = () => {
    const { user, authFetch, login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await authFetch('http://127.0.0.1:3001/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.response || []);
            }
        } catch (error) {
            console.error("Error fetching profile notifications", error);
        } finally {
            setNotifLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'tourist'
            });
            fetchNotifications();
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/notifications/${id}/read`, {
                method: 'PUT'
            });
            if (res.ok) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res = await authFetch('http://127.0.0.1:3001/api/notifications/read-all', {
                method: 'PUT'
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Error marking all notifications as read", error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            const res = await authFetch(`http://127.0.0.1:3001/api/notifications/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setNotifications(notifications.filter(n => n._id !== id));
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Notification Deleted',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authFetch(`http://127.0.0.1:3001/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                const token = localStorage.getItem('token');
                login(data.user, token);

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your details have been saved successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Update Failed',
                    text: data.message || 'Could not update profile.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Connection Error',
                text: 'An error occurred while communicating with the server.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
            <Navbar />

            {/* Top Hero Banner */}
            <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 className="text-4xl font-extrabold mb-2">My Profile</h1>
                <p className="text-xl text-gray-300 font-light">Manage your personal information and account settings.</p>
              </div>
            </div>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Form Column */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative self-start">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-dark"></div>
                        
                        <div className="p-8 sm:p-12">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sunset-gold to-sunset-orange flex items-center justify-center shadow-lg text-white text-3xl font-bold">
                                    {formData.firstName.charAt(0) || ''}{formData.lastName.charAt(0) || ''}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                                    <p className="text-sunset-orange font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-2 capitalize bg-orange-50 px-3 py-1 rounded-full inline-flex">
                                        <Shield size={16} />
                                        {formData.role.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read Only) */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                disabled
                                                className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm text-gray-500 bg-gray-100 cursor-not-allowed sm:text-sm font-medium"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-gray-400">Email addresses cannot be changed.</p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 mt-10 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex justify-center items-center py-3.5 px-10 border border-transparent rounded-full shadow-lg text-sm font-extrabold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed tracking-wide cursor-pointer"
                                    >
                                        {loading ? 'Saving...' : 'Save Details'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Notifications Sidebar Column */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative p-6 sm:p-8 self-start">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sunset-dark to-sunset-teal"></div>
                        
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="text-sunset-orange" size={20} />
                                Notifications
                            </h3>
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-sunset-orange hover:text-sunset-orange/80 font-bold cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {notifLoading ? (
                            <p className="text-sm text-gray-500 py-4 text-center">Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Bell className="mx-auto mb-2 opacity-30" size={36} />
                                <p className="text-sm">No notifications yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 hide-scrollbar">
                                {notifications.map(notif => (
                                    <div 
                                        key={notif._id} 
                                        className={`p-4 rounded-xl border transition-all flex flex-col gap-2 relative ${notif.isRead ? 'bg-gray-50 border-gray-100 text-gray-600' : 'bg-sunset-orange/5 border-sunset-orange/10 text-gray-900 font-medium'}`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <p className="text-xs leading-relaxed">{notif.message}</p>
                                            <button 
                                                onClick={() => handleDeleteNotification(notif._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-0.5 text-sm font-bold cursor-pointer"
                                                title="Delete Notification"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-100/10">
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            {!notif.isRead && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notif._id)}
                                                    className="text-[10px] text-sunset-orange hover:text-sunset-orange/80 font-bold cursor-pointer"
                                                >
                                                    Mark read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
