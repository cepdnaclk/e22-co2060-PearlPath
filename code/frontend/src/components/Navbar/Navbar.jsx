import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Building, MapPin, Footprints, BusFront, UserCheck, DollarSign, Navigation, User, LogOut, ChevronDown, Plus } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse user', e);
        return null;
      }
    }
    return null;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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

  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSolid = scrolled || !isHome;

  const navItems = [
    { id: 'hotels', label: 'Hotels', icon: <Building size={18} fill="currentColor" className="text-sunset-gold" />, path: '/hotels' },
    { id: 'tour-guides', label: 'Tour Guides', icon: <UserCheck size={18} fill="currentColor" className="text-sunset-orange" />, path: '#' },
    { id: 'transport', label: 'Transport', icon: <BusFront size={18} fill="currentColor" className="text-slate-800" />, path: '/vehicles' },
    { id: 'destinations', label: 'Destinations', icon: <MapPin size={18} fill="currentColor" className="text-sunset-teal" />, path: '#' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isSolid ? 'bg-sunset-dark/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sunset-gold to-sunset-orange rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
              <Navigation className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Pearl<span className="text-sunset-gold">Path</span></span>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-4">
              <button className="text-gray-200 hover:text-white font-medium text-sm transition-colors">LKR</button>
              <button className="text-gray-200 hover:text-white font-medium text-sm transition-colors">EN</button>
            </div>
            
            <div className="h-6 w-px bg-white/20"></div>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-sunset-orange/50"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sunset-orange to-sunset-gold flex items-center justify-center shadow-inner">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-white font-medium text-sm hidden sm:block">{user.firstName || user.name || user.username || 'User'}</span>
                  <ChevronDown size={16} className={`text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 transform origin-top-right transition-all animate-slide-up">
                    <div className="px-4 py-3 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.firstName || user.name || user.username || 'User'} {user.lastName || ''}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      )}
                        <p className="text-xs font-medium text-sunset-gold mt-1">
                        {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sunset-teal flex items-center gap-2 transition-colors"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link 
                        to="/my-bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sunset-teal flex items-center gap-2 transition-colors"
                      >
                        <Building size={16} />
                        My Bookings
                      </Link>
                      <Link 
                        to="/register"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sunset-teal flex items-center gap-2 transition-colors border-t border-gray-50"
                      >
                        <Plus size={16} />
                        Add Account
                      </Link>
                    </div>
                    
                    <hr className="border-gray-100 my-1" />
                    
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white font-medium hover:text-sunset-gold transition-colors">Sign in</Link>
                <Link to="/register" className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-sunset-orange/50 transition-all transform hover:-translate-y-0.5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="hidden md:flex mt-4 gap-2 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link to={item.path} key={item.id} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition-all hover:scale-105 group">
              <span className="transform group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-sunset-dark/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link to={item.path} key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            {user ? (
              <>
                <div className="flex items-center justify-center gap-4 py-3 bg-white/5 rounded-xl border border-white/10 px-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset-orange to-sunset-gold flex items-center justify-center shrink-0 shadow-inner">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-white font-bold truncate">
                      {user.firstName || user.name || user.username || 'User'} {user.lastName || ''}
                    </span>
                    {user.email && (
                      <span className="text-gray-300 text-xs truncate mt-0.5">{user.email}</span>
                    )}
                    <span className="text-sunset-gold text-xs font-medium mt-0.5">
                      {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-center text-white font-medium py-2">Sign in</Link>
                <Link to="/register" className="text-center bg-gradient-to-r from-sunset-orange to-sunset-gold text-white py-2 rounded-xl font-semibold">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
