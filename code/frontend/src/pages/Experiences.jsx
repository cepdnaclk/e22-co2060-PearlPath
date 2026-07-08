import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { 
  Plus, 
  Clock, 
  MapPin, 
  Compass, 
  Waves, 
  Utensils, 
  Sparkles, 
  Leaf,
  Heart,
  X,
  PlusCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

const mockExperiences = [
  {
    _id: 'mock1',
    title: 'Minneriya Elephant Gathering Safari',
    category: 'Wildlife',
    location: 'Minneriya National Park',
    description: 'Witness the largest gathering of Asian elephants in the wild. Watch hundreds of elephants feed, play and bathe in the Minneriya tank.',
    pricePerPerson: 15000,
    duration: '4 Hours',
    images: ['https://images.unsplash.com/photo-1581859814481-9d75030bb4fb?q=80&w=800&auto=format&fit=crop'],
    providedBy: { firstName: 'PearlPath', lastName: 'Guide' },
    providerType: 'tour_guide'
  },
  {
    _id: 'mock2',
    title: 'Kitulgala White-Water Rafting',
    category: 'Adventure',
    location: 'Kitulgala',
    description: 'Get your adrenaline pumping with a thrilling white-water rafting session on the Kelani River in Kitulgala, tackling major rapids.',
    pricePerPerson: 8000,
    duration: '3 Hours',
    images: ['https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=80&w=800&auto=format&fit=crop'],
    providedBy: { firstName: 'Adventure', lastName: 'Lanka' },
    providerType: 'vehicle_owner'
  },
  {
    _id: 'mock3',
    title: 'Ella Traditional Clay-pot Cooking Class',
    category: 'Culinary',
    location: 'Ella',
    description: 'Learn to cook authentic Sri Lankan rice and curry using traditional clay pots, wood-fired hearths, and local fresh herbs.',
    pricePerPerson: 6000,
    duration: '2.5 Hours',
    images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'],
    providedBy: { firstName: 'Grandma\'s', lastName: 'Kitchen' },
    providerType: 'hotel'
  },
  {
    _id: 'mock4',
    title: 'Kandy Temple & Cultural Heritage Tour',
    category: 'Cultural',
    location: 'Kandy',
    description: 'Explore the sacred Temple of the Tooth Relic, stroll through historic streets, and witness a traditional Kandyan dance performance.',
    pricePerPerson: 9500,
    duration: 'Half Day',
    images: ['https://images.unsplash.com/photo-1625807971714-fa26ee366114?q=80&w=800&auto=format&fit=crop'],
    providedBy: { firstName: 'Culture', lastName: 'Heritage' },
    providerType: 'tour_guide'
  }
];

const Experiences = () => {
  const { user, authFetch } = useAuth();
  const { selectedCurrency, convertPrice, getCurrencySymbol } = useCurrency();

  const [dbExperiences, setDbExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Adventure',
    location: '',
    duration: '',
    pricePerPerson: '',
    description: '',
    imageUrl: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Check if current user is an experience provider
  const isProvider = user && ['hotel', 'hotel_owner', 'vehicle_owner', 'tour_guide'].includes(user.role);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/experiences');
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace experiences');
      }
      const data = await response.json();
      setDbExperiences(data.response || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const submissionData = {
      title: formData.title,
      category: formData.category,
      location: formData.location,
      duration: formData.duration,
      pricePerPerson: parseFloat(formData.pricePerPerson),
      description: formData.description,
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop']
    };

    try {
      const response = await authFetch('http://127.0.0.1:3001/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit experience');
      }

      // Add newly created experience to state immediately
      setDbExperiences(prev => [data.experience, ...prev]);
      
      // Reset form and close modal
      setFormData({
        title: '',
        category: 'Adventure',
        location: '',
        duration: '',
        pricePerPerson: '',
        description: '',
        imageUrl: ''
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Adventure': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"><Compass size={12} /> Adventure</span>;
      case 'Wildlife': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><Sparkles size={12} /> Wildlife</span>;
      case 'Culinary': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1"><Utensils size={12} /> Culinary</span>;
      case 'Cultural': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"><Waves size={12} /> Cultural</span>;
      case 'Wellness': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center gap-1"><Leaf size={12} /> Wellness</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">Experience</span>;
    }
  };

  // Combine static mock experiences and DB experiences
  const allExperiences = [...dbExperiences, ...mockExperiences];

  return (
    <div className="min-h-screen bg-sunset-dark text-white font-outfit flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        {/* Header section with optional add button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="text-left">
            <div className="inline-block px-4 py-1 mb-3 rounded-full bg-[#FF8C00]/20 border border-[#FF8C00]/30 text-[#FF8C00] text-xs font-bold uppercase tracking-wider">
              🏞️ Local Adventures & Tours
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
              Sri Lankan Experiences
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-2xl">
              Immerse yourself in authentic island adventures. Handpicked local safaris, clay-pot cooking classes, and historical walks.
            </p>
          </div>

          {isProvider && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-[#FF8C00]/20 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Plus size={20} />
              <span>Add Experience</span>
            </button>
          )}
        </div>

        {/* Experiences Grid */}
        {loading && dbExperiences.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-[#1a1a1f]/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[420px] animate-pulse flex flex-col">
                <div className="bg-gray-800/80 h-56 w-full"></div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-800/80 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-800/80 rounded w-3/4"></div>
                    <div className="h-12 bg-gray-800/80 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error && dbExperiences.length === 0 ? (
          <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20 max-w-lg mx-auto flex items-center gap-3">
            <AlertCircle size={24} />
            <span>Error loading experiences: {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {allExperiences.map(experience => {
              // Convert LKR price to active currency
              const convertedPrice = convertPrice(experience.pricePerPerson);
              const symbol = getCurrencySymbol();

              return (
                <div 
                  key={experience._id} 
                  className="bg-[#1a1a1f]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:shadow-[#FF8C00]/10 hover:shadow-2xl hover:border-white/20 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div className="h-56 w-full overflow-hidden relative bg-gray-900">
                    <img 
                      src={experience.images?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"} 
                      alt={experience.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4">
                      {getCategoryBadge(experience.category)}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-1.5">
                      <Clock size={12} className="text-[#FF8C00]" />
                      {experience.duration}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location details */}
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
                        <MapPin size={12} className="text-[#FF8C00]" />
                        {experience.location}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#FF8C00] transition-colors line-clamp-1">
                        {experience.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {experience.description}
                      </p>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">Price / Person</span>
                        <span className="text-lg font-extrabold text-[#FF8C00]">
                          {symbol} {convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-gray-400 font-normal">{selectedCurrency}</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => alert(`Booking flow for "${experience.title}" is coming soon!`)}
                        className="bg-white/5 border border-white/10 hover:bg-[#FF8C00] hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-gray-300 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Styled Add Experience Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-[#141418] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up text-left">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f0f11]/60">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-[#FF8C00]" size={22} />
                <h2 className="text-xl font-extrabold text-white">Create New Experience</h2>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 hide-scrollbar">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Experience Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Minneriya Elephant Gathering Safari"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium cursor-pointer"
                  >
                    <option value="Adventure" className="bg-[#141418]">Adventure</option>
                    <option value="Wildlife" className="bg-[#141418]">Wildlife</option>
                    <option value="Culinary" className="bg-[#141418]">Culinary</option>
                    <option value="Cultural" className="bg-[#141418]">Cultural</option>
                    <option value="Wellness" className="bg-[#141418]">Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 Hours, Full Day"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Location & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Ella, Habarana"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price per Person (LKR)</label>
                  <input
                    type="number"
                    name="pricePerPerson"
                    required
                    min="1"
                    value={formData.pricePerPerson}
                    onChange={handleInputChange}
                    placeholder="e.g., 6500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} /> Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="e.g., https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the experience, what is included, and key highlights..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:shadow-lg hover:shadow-[#FF8C00]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experiences;
