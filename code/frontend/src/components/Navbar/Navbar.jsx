import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Building, MapPin, Footprints, BusFront, UserCheck, DollarSign, Navigation } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'stays', label: 'Stays', icon: <Building size={18} fill="currentColor" className="text-sunset-gold" /> },
    { id: 'flights', label: 'Flights', icon: <Footprints size={18} fill="currentColor" className="text-sunset-orange" /> },
    { id: 'tours', label: 'Tours', icon: <MapPin size={18} fill="currentColor" className="text-sunset-teal" /> },
    { id: 'transport', label: 'Transport', icon: <BusFront size={18} fill="currentColor" className="text-slate-800" /> },
    { id: 'experiences', label: 'Experiences', icon: <UserCheck size={18} fill="currentColor" className="text-yellow-400" /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-sunset-dark/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
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
            
            <Link to="/login" className="text-white font-medium hover:text-sunset-gold transition-colors">Sign in</Link>
            <Link to="/register" className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-sunset-orange/50 transition-all transform hover:-translate-y-0.5">
              Register
            </Link>
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
            <button key={item.id} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition-all hover:scale-105 group">
              <span className="transform group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-sunset-dark/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            <Link to="/login" className="text-center text-white font-medium py-2">Sign in</Link>
            <Link to="/register" className="text-center bg-gradient-to-r from-sunset-orange to-sunset-gold text-white py-2 rounded-xl font-semibold">Register</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
