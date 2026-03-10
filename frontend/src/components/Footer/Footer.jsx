import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sunset-dark text-white relative z-30 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center pb-12 border-b border-white/10 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Ready for your next adventure?</h3>
            <p className="text-gray-400">Discover handpicked stays across the island.</p>
          </div>
          <button className="bg-transparent border-2 border-sunset-gold text-sunset-gold hover:bg-sunset-gold hover:text-white px-8 py-3 rounded-xl font-bold transition-all w-full md:w-auto">
            List your property
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-300 mb-2">Destinations</h4>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Colombo</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Kandy</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Galle</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Ella</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Mirissa</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-300 mb-2">Property Types</h4>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Luxury Villas</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Jungle Resorts</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Beach Cabanas</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Heritage Homes</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-300 mb-2">Experiences</h4>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Wildlife Safari</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Surfing</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Tea Trails</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Cultural Tours</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-300 mb-2">Support</h4>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Help Center</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Safety Information</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Cancellation Options</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-300 mb-2">About</h4>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Our Story</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Careers</a>
            <a href="#" className="text-gray-500 hover:text-sunset-gold text-sm transition-colors">Investors</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Pearl Path. Redesigned with ❤️ for Sri Lanka.</p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset-orange cursor-pointer transition-colors">
              <span className="text-xs">FB</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset-orange cursor-pointer transition-colors">
              <span className="text-xs">IG</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset-orange cursor-pointer transition-colors">
              <span className="text-xs">X</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
