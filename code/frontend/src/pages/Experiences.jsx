import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  UserCheck,
  MessageSquare
} from 'lucide-react';

const Experiences = () => {
  const { user, authFetch } = useAuth();
  const { selectedCurrency, convertPrice, getCurrencySymbol } = useCurrency();
  const [searchParams] = useSearchParams();

  const [dbExperiences, setDbExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Full Details Modal State (for viewing complete experience details)
  const [selectedExperienceDetails, setSelectedExperienceDetails] = useState(null);

  // Contact Modal State (for Tourists)
  const [contactModalExperience, setContactModalExperience] = useState(null);

  // Check if current user is an experience provider
  const isProvider = user && ['hotel', 'hotel_owner', 'vehicle_owner', 'tour_guide'].includes(user.role);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Adventure',
    location: '',
    duration: '',
    pricePerPerson: '',
    description: '',
    imageUrl: '',
    realOwnerName: '',
    realOwnerPhone: '',
    realOwnerEmail: '',
    realOwnerAddress: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:3001/api/experiences');
      if (!res.ok) throw new Error('Failed to load experiences');
      const data = await res.json();
      setDbExperiences(data.response || []);
    } catch (err) {
      console.error("Fetch experiences error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
    if (searchParams.get('openAddModal') === 'true') {
      setModalOpen(true);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (experience) => {
    setEditingExperienceId(experience._id);
    setFormData({
      title: experience.title || '',
      category: experience.category || 'Adventure',
      location: experience.location || '',
      duration: experience.duration || '',
      pricePerPerson: experience.pricePerPerson ? experience.pricePerPerson.toString() : '',
      description: experience.description || '',
      imageUrl: experience.images?.[0] || '',
      realOwnerName: experience.realOwnerName || experience.organizerName || '',
      realOwnerPhone: experience.realOwnerPhone || experience.organizerPhone || '',
      realOwnerEmail: experience.realOwnerEmail || experience.organizerEmail || '',
      realOwnerAddress: experience.realOwnerAddress || ''
    });
    setModalOpen(true);
  };

  const handleDeleteClick = async (experience) => {
    if (!window.confirm(`Are you sure you want to delete "${experience.title}"?`)) {
      return;
    }
    try {
      const response = await authFetch(`http://127.0.0.1:3001/api/experiences/${experience._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete experience');
      }
      setDbExperiences(prev => prev.filter(e => e._id !== experience._id));
    } catch (err) {
      console.error(err);
      alert(`Error deleting experience: ${err.message}`);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      title: '',
      category: 'Adventure',
      location: '',
      duration: '',
      pricePerPerson: '',
      description: '',
      imageUrl: '',
      realOwnerName: '',
      realOwnerPhone: '',
      realOwnerEmail: '',
      realOwnerAddress: ''
    });
    setEditingExperienceId(null);
    setFormError(null);
    setModalOpen(false);
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
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'],
      realOwnerName: formData.realOwnerName,
      realOwnerPhone: formData.realOwnerPhone,
      realOwnerEmail: formData.realOwnerEmail,
      realOwnerAddress: formData.realOwnerAddress,
      organizerName: formData.realOwnerName,
      organizerPhone: formData.realOwnerPhone,
      organizerEmail: formData.realOwnerEmail
    };

    try {
      let response;
      if (editingExperienceId) {
        response = await authFetch(`http://127.0.0.1:3001/api/experiences/${editingExperienceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
      } else {
        response = await authFetch('http://127.0.0.1:3001/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit experience');
      }

      if (editingExperienceId) {
        setDbExperiences(prev => prev.map(e => e._id === editingExperienceId ? data.experience : e));
      } else {
        setDbExperiences(prev => [data.experience, ...prev]);
      }
      
      handleCloseModal();
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

  // Category list definitions
  const categories = [
    { id: 'All', label: 'All Experiences', icon: SlidersHorizontal },
    { id: 'Wildlife', label: 'Wildlife', icon: Sparkles },
    { id: 'Adventure', label: 'Adventure', icon: Compass },
    { id: 'Culinary', label: 'Culinary', icon: Utensils },
    { id: 'Cultural', label: 'Cultural', icon: Waves },
  ];

  // Experiences loaded from database
  const allExperiences = dbExperiences;

  // Filter experiences by category and search keyword
  const filteredExperiences = allExperiences.filter(exp => {
    const matchesCategory = selectedCategory === 'All' || exp.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm.trim() || 
      exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-sunset-dark text-white font-outfit flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        {/* Header section with optional add button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-8">
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

        {/* Search & Category Filter Section */}
        <div className="mb-10 space-y-5 text-left">
          {/* Search Bar & Result Counter */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search experiences by title, location, or description..."
                className="w-full bg-[#1a1a1f]/80 border border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-white placeholder-gray-500 text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="text-xs text-gray-400 font-semibold px-4 py-3 bg-white/5 rounded-2xl border border-white/10 shrink-0 self-start sm:self-auto">
              Showing <span className="text-[#FF8C00] font-bold">{filteredExperiences.length}</span> of {allExperiences.length} experiences
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'All' 
                ? allExperiences.length 
                : allExperiences.filter(e => e.category?.toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#FF8C00] to-amber-500 text-white border-transparent shadow-lg shadow-[#FF8C00]/25 scale-[1.02]' 
                      : 'bg-[#1a1a1f]/80 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#FF8C00]'} />
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white/5 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
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
        ) : filteredExperiences.length === 0 ? (
          <div className="bg-[#1a1a1f]/40 border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-[#FF8C00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF8C00]/20">
              <Compass size={32} className="text-[#FF8C00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Experiences Found</h3>
            <p className="text-gray-400 text-sm mb-6 font-light">
              No experiences matched your selected category or search query. Try choosing another category or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="bg-gradient-to-r from-[#FF8C00] to-amber-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#FF8C00]/20 transition-all hover:scale-105 cursor-pointer text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filteredExperiences.map(experience => {
              // Convert LKR price to active currency
              const convertedPrice = convertPrice(experience.pricePerPerson);
              const symbol = getCurrencySymbol();

              // Safe check if logged-in user is the provider who created this experience
              const canEdit = user && experience.providedBy && (
                experience.providedBy._id === user._id || 
                experience.providedBy === user._id
              );

              return (
                <div 
                  key={experience._id} 
                  className="bg-[#1a1a1f]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:shadow-[#FF8C00]/10 hover:shadow-2xl hover:border-white/20 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div 
                    onClick={() => setSelectedExperienceDetails(experience)}
                    className="h-56 w-full overflow-hidden relative bg-gray-900 cursor-pointer"
                  >
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
                      <h3 
                        onClick={() => setSelectedExperienceDetails(experience)}
                        className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#FF8C00] transition-colors cursor-pointer hover:underline"
                        title="Click to view full experience details"
                      >
                        {experience.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        {experience.description}
                      </p>

                      {/* Contact Activity Operator Section */}
                      <div className="bg-[#141418]/80 border border-white/10 rounded-2xl p-3.5 mb-5 space-y-2 text-xs">
                        <div className="text-[10px] uppercase font-extrabold text-[#FF8C00] tracking-wider flex items-center gap-1.5">
                          <UserCheck size={13} />
                          <span>Contact Activity Operator</span>
                        </div>
                        
                        <div className="font-bold text-gray-200 text-sm truncate">
                          {experience.realOwnerName || experience.organizerName || "Activity Operator"}
                        </div>

                        {experience.realOwnerAddress && (
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin size={11} className="text-gray-500 shrink-0" />
                            <span className="truncate">{experience.realOwnerAddress}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {(experience.realOwnerPhone || experience.organizerPhone) && (
                            <a 
                              href={`tel:${experience.realOwnerPhone || experience.organizerPhone}`}
                              className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs"
                              title="Call Operator"
                            >
                              <Phone size={12} />
                              <span>Call Operator</span>
                            </a>
                          )}
                          
                          {(experience.realOwnerEmail || experience.organizerEmail) && (
                            <a 
                              href={`mailto:${experience.realOwnerEmail || experience.organizerEmail}`}
                              className="flex items-center gap-1.5 bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs truncate max-w-full"
                              title="Email Operator"
                            >
                              <Mail size={12} />
                              <span>Email Operator</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA / Actions */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">Price / Person</span>
                        <span className="text-lg font-extrabold text-[#FF8C00]">
                          {symbol} {convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-gray-400 font-normal">{selectedCurrency}</span>
                        </span>
                      </div>
                      
                      {canEdit ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(experience)}
                            className="bg-white/5 border border-white/10 hover:bg-[#FF8C00] hover:text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer text-gray-300 hover:shadow-lg"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(experience)}
                            className="bg-white/5 border border-white/10 hover:bg-red-600 hover:text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer text-gray-300 hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setContactModalExperience(experience)}
                          className="bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg shadow-[#FF8C00]/20 flex items-center gap-1.5"
                        >
                          <Phone size={13} />
                          <span>Book Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Styled Experience Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-[#141418] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up text-left">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f0f11]/60">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-[#FF8C00]" size={22} />
                <h2 className="text-xl font-extrabold text-white">
                  {editingExperienceId ? 'Edit Experience' : 'Create New Experience'}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal}
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
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the experience, what is included, and key highlights..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium resize-none"
                ></textarea>
              </div>

              {/* Real Activity Owner / Contact Info Section */}
              <div className="bg-[#0f0f11]/80 border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="text-xs font-extrabold text-[#FF8C00] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <UserCheck size={14} />
                  <span>Real Activity Owner / Contact Info (For Tourists)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Real Owner / Operator Name <span className="text-[#FF8C00]">*</span>
                  </label>
                  <input
                    type="text"
                    name="realOwnerName"
                    required
                    value={formData.realOwnerName}
                    onChange={handleInputChange}
                    placeholder="e.g., Saman Rafting Guides / Minneriya Wild Safari Operators"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Direct Phone Number for Tourists <span className="text-[#FF8C00]">*</span>
                    </label>
                    <input
                      type="text"
                      name="realOwnerPhone"
                      required
                      value={formData.realOwnerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., +94 77 123 4567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Direct Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="realOwnerEmail"
                      value={formData.realOwnerEmail}
                      onChange={handleInputChange}
                      placeholder="e.g., contact@activityoperator.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Meeting Point / Office Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="realOwnerAddress"
                    value={formData.realOwnerAddress}
                    onChange={handleInputChange}
                    placeholder="e.g., Main Rafting Office, Kelani River Bank, Kitulgala"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF8C00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:shadow-lg hover:shadow-[#FF8C00]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (editingExperienceId ? 'Saving...' : 'Creating...') : (editingExperienceId ? 'Save Changes' : 'Create Experience')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Activity Operator Modal Popup */}
      {contactModalExperience && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setContactModalExperience(null)}
          ></div>

          <div className="relative bg-[#141418] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-up text-left p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="text-[#FF8C00]" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Contact Activity Operator</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{contactModalExperience.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setContactModalExperience(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider block mb-1">Real Activity Owner / Business Name</span>
                <span className="text-base font-bold text-white block">
                  {contactModalExperience.realOwnerName || contactModalExperience.organizerName || "Activity Operator"}
                </span>
                {contactModalExperience.realOwnerAddress && (
                  <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#FF8C00]" />
                    {contactModalExperience.realOwnerAddress}
                  </span>
                )}
              </div>

              {(contactModalExperience.realOwnerPhone || contactModalExperience.organizerPhone) && (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Direct Phone Number</span>
                    <span className="text-sm font-bold text-white">{contactModalExperience.realOwnerPhone || contactModalExperience.organizerPhone}</span>
                  </div>
                  <a
                    href={`tel:${contactModalExperience.realOwnerPhone || contactModalExperience.organizerPhone}`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                  >
                    <Phone size={14} />
                    <span>Call Operator</span>
                  </a>
                </div>
              )}

              {(contactModalExperience.realOwnerEmail || contactModalExperience.organizerEmail) && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl">
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider block">Direct Email Address</span>
                    <span className="text-sm font-bold text-white truncate block">{contactModalExperience.realOwnerEmail || contactModalExperience.organizerEmail}</span>
                  </div>
                  <a
                    href={`mailto:${contactModalExperience.realOwnerEmail || contactModalExperience.organizerEmail}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all shrink-0"
                  >
                    <Mail size={14} />
                    <span>Email Operator</span>
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setContactModalExperience(null)}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl border border-white/10 transition-all text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full Experience Details Modal (when touching/clicking experience title or card) */}
      {selectedExperienceDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedExperienceDetails(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-[#141418] border border-white/15 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh] animate-slide-up text-left z-10">
            {/* Header Image */}
            <div className="h-64 sm:h-72 w-full relative bg-gray-900 shrink-0">
              <img 
                src={selectedExperienceDetails.images?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"} 
                alt={selectedExperienceDetails.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/30 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedExperienceDetails(null)}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur text-gray-300 hover:text-white p-2 rounded-full border border-white/20 hover:bg-black/80 transition-all cursor-pointer z-10"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6 flex items-center gap-3 flex-wrap">
                {getCategoryBadge(selectedExperienceDetails.category)}
                <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-1.5">
                  <Clock size={12} className="text-[#FF8C00]" />
                  {selectedExperienceDetails.duration}
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 hide-scrollbar">
              {/* Location & Title */}
              <div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <MapPin size={14} className="text-[#FF8C00]" />
                  {selectedExperienceDetails.location}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {selectedExperienceDetails.title}
                </h2>
              </div>

              {/* Complete Description */}
              <div>
                <h4 className="text-xs font-extrabold text-[#FF8C00] uppercase tracking-wider mb-2">About This Experience</h4>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line font-light">
                  {selectedExperienceDetails.description}
                </p>
              </div>

              {/* Price Details */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Price per Person</span>
                  <span className="text-2xl font-extrabold text-[#FF8C00]">
                    {getCurrencySymbol()} {convertPrice(selectedExperienceDetails.pricePerPerson).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gray-400 font-normal">{selectedCurrency}</span>
                  </span>
                </div>
              </div>

              {/* Real Activity Owner / Operator Contact Section */}
              <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-extrabold text-[#FF8C00] uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                  <UserCheck size={16} />
                  <span>Real Activity Operator Contact Information</span>
                </div>

                <div className="text-base font-bold text-white">
                  {selectedExperienceDetails.realOwnerName || selectedExperienceDetails.organizerName || "Activity Operator"}
                </div>

                {selectedExperienceDetails.realOwnerAddress && (
                  <div className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FF8C00]" />
                    <span>{selectedExperienceDetails.realOwnerAddress}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {(selectedExperienceDetails.realOwnerPhone || selectedExperienceDetails.organizerPhone) && (
                    <a 
                      href={`tel:${selectedExperienceDetails.realOwnerPhone || selectedExperienceDetails.organizerPhone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      <Phone size={16} />
                      <span>Call Operator ({selectedExperienceDetails.realOwnerPhone || selectedExperienceDetails.organizerPhone})</span>
                    </a>
                  )}

                  {(selectedExperienceDetails.realOwnerEmail || selectedExperienceDetails.organizerEmail) && (
                    <a 
                      href={`mailto:${selectedExperienceDetails.realOwnerEmail || selectedExperienceDetails.organizerEmail}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/40 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      <Mail size={16} />
                      <span>Email Operator</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0f0f11]/60 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedExperienceDetails(null)}
                className="bg-gradient-to-r from-[#FF8C00] to-amber-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#FF8C00]/20 transition-all hover:scale-105 cursor-pointer text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experiences;
