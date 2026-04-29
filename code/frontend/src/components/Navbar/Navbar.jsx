import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Building, MapPin, Map, BusFront, Navigation, User, LogOut, ChevronDown, Plus, Home } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

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

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={16} /> },
    { id: 'hotels', label: 'Hotels', icon: <Building size={16} /> },
    { id: 'routes', label: 'Routes', icon: <Map size={16} /> },
    { id: 'transport', label: 'Vehicle', icon: <BusFront size={16} /> },
    { id: 'destinations', label: 'Destination', icon: <MapPin size={16} /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0f11]/95 backdrop-blur-md border-b border-gray-800 shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {navItems.map((item) => {
              const path = item.id === 'transport' ? '/vehicles' : item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = location.pathname === path || (item.id === 'home' && location.pathname === '/');
              return (
                <Link 
                  key={item.id} 
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:scale-105 group font-medium text-sm border ${
                    isActive 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className={`transition-transform transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Nav Actions (Right) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <div className="flex gap-4">
              <button className="text-gray-300 hover:text-emerald-400 font-medium text-sm transition-colors">LKR</button>
              <button className="text-gray-300 hover:text-emerald-400 font-medium text-sm transition-colors">EN</button>
            </div>
            
            <div className="h-6 w-px bg-gray-700"></div>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-inner">
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
                        <p className="text-xs font-medium text-emerald-400 mt-1">
                        {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/register"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400 flex items-center gap-2 transition-colors"
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
            ) : (
              <>
                <Link to="/login" className="text-gray-300 font-medium hover:text-emerald-400 transition-colors text-sm">Sign in</Link>
                <Link to="/register" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 text-sm">
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
            {navItems.map((item) => {
              const path = item.id === 'transport' ? '/vehicles' : item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = location.pathname === path || (item.id === 'home' && location.pathname === '/');
              return (
                <Link 
                  key={item.id} 
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive ? 'bg-gray-800 text-emerald-400' : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-emerald-400'}`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="h-px bg-gray-800 my-2"></div>
            {user ? (
              <>
                <div className="flex items-center justify-center gap-4 py-3 bg-gray-800/30 rounded-xl border border-gray-800 px-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-inner">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-white font-bold truncate">
                      {user.firstName || user.name || user.username || 'User'} {user.lastName || ''}
                    </span>
                    {user.email && (
                      <span className="text-gray-400 text-xs truncate mt-0.5">{user.email}</span>
                    )}
                    <span className="text-emerald-400 text-xs font-medium mt-0.5">
                      {user.role ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Tourist'}
                    </span>
                  </div>
                </div>
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
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
