import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Building, MapPin, Map, BusFront, Navigation, User, LogOut, ChevronDown, Plus, Home, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, authFetch, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await authFetch('http://127.0.0.1:3001/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.response || []);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
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

  const handleNotifClick = (notif) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif._id);
    }
    setIsNotifOpen(false);

    if (notif.bookingId?._id) {
      const isProvider = user?.role !== 'tourist';
      const targetPath = isProvider ? '/provider-bookings' : '/my-bookings';
      navigate(`${targetPath}?bookingId=${notif.bookingId._id}`);
    } else {
      const isProvider = user?.role !== 'tourist';
      navigate(isProvider ? '/provider-bookings' : '/my-bookings');
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={16} /> },
    { id: 'hotels', label: 'Hotels', icon: <Building size={16} /> },
    { id: 'transport', label: 'Vehicle', icon: <BusFront size={16} /> },
    { id: 'destinations', label: 'Destination', icon: <MapPin size={16} /> },
  ];

  const getFilteredNavItems = () => {
    if (!user || user.role === 'tourist') return navItems;
    if (user.role === 'admin') return [];
    if (user.role === 'hotel_owner') return navItems.filter(item => ['home', 'hotels'].includes(item.id));
    if (user.role === 'vehicle_owner') return navItems.filter(item => ['home', 'transport'].includes(item.id));
    if (user.role === 'tour_guide') return navItems.filter(item => ['home', 'routes', 'destinations'].includes(item.id));
    return navItems;
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <nav className={`fixed w-[calc(100%-2rem)] max-w-7xl left-1/2 -translate-x-1/2 top-4 z-50 transition-all duration-300 rounded-full border ${scrolled ? 'bg-[#0f0f11]/70 backdrop-blur-xl border-white/10 shadow-2xl py-3' : 'bg-transparent border-transparent py-4'}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-sunset-gold to-sunset-orange rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
              <Navigation className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight hidden lg:block">Pearl<span className="text-sunset-gold">Path</span></span>
          </Link>

          {/* Desktop Nav Items (Center) */}
          <div className="hidden md:flex items-center gap-8">
            {filteredNavItems.map((item) => {
              const path = item.id === 'transport' ? '/vehicles' : item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = location.pathname === path || (item.id === 'home' && location.pathname === '/');
              return (
                <Link
                  key={item.id}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:scale-105 group font-medium text-sm border ${isActive
                    ? 'bg-sunset-orange/20 border-sunset-orange/30 text-sunset-orange shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5 hover:border-white/10'
                    }`}
                >
                  <span className={`transition-transform transform group-hover:scale-110 ${isActive ? 'text-sunset-orange' : 'text-gray-400 group-hover:text-sunset-orange'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Nav Actions (Right) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <div className="flex gap-4">
              <button className="text-gray-300 hover:text-sunset-orange font-medium text-sm transition-colors">LKR</button>
              <button className="text-gray-300 hover:text-sunset-orange font-medium text-sm transition-colors">EN</button>
            </div>

            <div className="h-6 w-px bg-gray-700"></div>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 text-gray-300 hover:text-sunset-orange hover:bg-gray-800 rounded-full transition-all focus:outline-none cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-[#1a1a1f] border border-gray-805 rounded-xl shadow-2xl overflow-hidden z-50 transform origin-top-right transition-all animate-slide-up">
                      <div className="px-4 py-3 border-b border-gray-800 bg-[#141418] flex justify-between items-center">
                        <span className="text-sm font-bold text-white">Notifications</span>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-sunset-orange hover:text-sunset-orange/80 font-medium cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-800/60 hide-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotifClick(notif)}
                              className={`px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors relative flex gap-3 items-start ${!notif.isRead ? 'bg-sunset-orange/5' : ''}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full bg-sunset-orange mt-1.5 shrink-0 ${notif.isRead ? 'opacity-0' : 'opacity-100'}`} />
                              <div className="flex-1">
                                <p className="text-xs text-gray-300 font-medium leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-gray-500 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 py-2 border-t border-gray-805 bg-[#141418] text-center">
                        <Link
                          to="/profile"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs text-gray-450 hover:text-sunset-orange font-medium"
                        >
                          View all in Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-sunset-orange/50"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sunset-orange to-sunset-gold flex items-center justify-center shadow-inner">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm hidden sm:block">{user.firstName || user.name || user.username || 'User'}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#1a1a1f] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 transform origin-top-right transition-all animate-slide-up">
                      <div className="px-4 py-3 border-b border-gray-800 bg-[#141418]">
                        <p className="text-sm font-bold text-white truncate">
                          {user.firstName || user.name || user.username || 'User'} {user.lastName || ''}
                        </p>
                        {user.email && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                        )}
                        <p className="text-xs font-medium text-sunset-orange mt-1">
                          {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                          >
                            <Building size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        {(!user.role || user.role === 'tourist') && (
                          <Link
                            to="/my-bookings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                          >
                            <Calendar size={16} />
                            My Bookings
                          </Link>
                        )}
                        {(user.role === 'hotel_owner' || user.role === 'vehicle_owner' || user.role === 'tour_guide') && (
                          <Link
                            to="/provider-bookings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                          >
                            <Building size={16} />
                            Provider Dashboard
                          </Link>
                        )}
                        {user.role === 'hotel_owner' && (
                          <Link
                            to="/add-property"
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                          >
                            <Plus size={16} />
                            Add Property
                          </Link>
                        )}
                        <Link
                          to="/register"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-sunset-orange flex items-center gap-2 transition-colors"
                        >
                          <Plus size={16} />
                          Add Account
                        </Link>
                      </div>

                      <hr className="border-gray-800 my-1" />

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2 transition-colors font-medium"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 font-medium hover:text-sunset-orange transition-colors text-sm">Sign in</Link>
                <Link to="/register" className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-sunset-orange/25 transition-all transform hover:-translate-y-0.5 text-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0f0f11] border-t border-gray-800 shadow-2xl">
          <div className="px-4 py-4 flex flex-col gap-2">
            {filteredNavItems.map((item) => {
              const path = item.id === 'transport' ? '/vehicles' : item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = location.pathname === path || (item.id === 'home' && location.pathname === '/');
              return (
                <Link
                  key={item.id}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive ? 'bg-gray-800 text-sunset-orange' : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-sunset-orange'}`}
                >
                  <span className={isActive ? 'text-sunset-orange' : 'text-gray-500 group-hover:text-sunset-orange'}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            {filteredNavItems.length > 0 && <div className="h-px bg-gray-800 my-2"></div>}
            {user ? (
              <>
                <div className="flex items-center justify-center gap-4 py-3 bg-gray-800/30 rounded-xl border border-gray-800 px-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset-orange to-sunset-gold flex items-center justify-center shrink-0 shadow-inner">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-white font-bold truncate">
                      {user.firstName || user.name || user.username || 'User'} {user.lastName || ''}
                    </span>
                    {user.email && (
                      <span className="text-gray-400 text-xs truncate mt-0.5">{user.email}</span>
                    )}
                    <span className="text-sunset-orange text-xs font-medium mt-0.5">
                      {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                    </span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Building size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                {(!user.role || user.role === 'tourist') && (
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    <span>My Bookings</span>
                  </Link>
                )}
                {(user.role === 'hotel_owner' || user.role === 'vehicle_owner' || user.role === 'tour_guide') && (
                  <Link
                    to="/provider-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Building size={18} />
                    <span>Provider Dashboard</span>
                  </Link>
                )}
                {user.role === 'hotel_owner' && (
                  <Link
                    to="/add-property"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add Property</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 font-medium py-3 rounded-xl transition-colors">Sign in</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-gradient-to-r from-sunset-orange to-sunset-gold text-white py-3 rounded-xl font-semibold shadow-lg">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;