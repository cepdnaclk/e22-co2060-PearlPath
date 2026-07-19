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

const mockExperiences = [
  {
    _id: 'mock1',
    title: 'Minneriya Elephant Gathering Safari',
    category: 'Wildlife',
    location: 'Minneriya National Park',
    description: 'Witness the largest gathering of Asian elephants in the wild. Watch hundreds of elephants feed, play and bathe in the Minneriya tank.',
    pricePerPerson: 15000,
    duration: '4 Hours',
    images: ['/experiences/minneriya.jpg'],
    providedBy: { firstName: 'PearlPath', lastName: 'Guide' },
    providerType: 'tour_guide',
    organizerName: 'Minneriya Wild Safari Tours',
    organizerPhone: '+94 77 345 6789',
    organizerEmail: 'safari@minneriya.lk'
  },
  {
    _id: 'mock2',
    title: 'Kitulgala White-Water Rafting',
    category: 'Adventure',
    location: 'Kitulgala',
    description: 'Get your adrenaline pumping with a thrilling white-water rafting session on the Kelani River in Kitulgala, tackling major rapids.',
    pricePerPerson: 8000,
    duration: '3 Hours',
    images: ['/experiences/kitulgala.jpg'],
    providedBy: { firstName: 'Adventure', lastName: 'Lanka' },
    providerType: 'vehicle_owner',
    organizerName: 'Kitulgala River Rafting Center',
    organizerPhone: '+94 71 890 1234',
    organizerEmail: 'info@kitulgalarafting.lk'
  },
  {
    _id: 'mock3',
    title: 'Ella Traditional Clay-pot Cooking Class',
    category: 'Culinary',
    location: 'Ella',
    description: 'Learn to cook authentic Sri Lankan rice and curry using traditional clay pots, wood-fired hearths, and local fresh herbs.',
    pricePerPerson: 6000,
    duration: '2.5 Hours',
    images: ['/experiences/ella.jpg'],
    providedBy: { firstName: 'Grandma\'s', lastName: 'Kitchen' },
    providerType: 'hotel',
    organizerName: 'Amma\'s Secret Spice Kitchen',
    organizerPhone: '+94 76 543 2109',
    organizerEmail: 'cook@ellaspices.com'
  },
  {
    _id: 'mock4',
    title: 'Kandy Temple & Cultural Heritage Tour',
    category: 'Cultural',
    location: 'Kandy',
    description: 'Explore the sacred Temple of the Tooth Relic, stroll through historic streets, and witness a traditional Kandyan dance performance.',
    pricePerPerson: 9500,
    duration: 'Half Day',
    images: ['/experiences/kandy.jpg'],
    providedBy: { firstName: 'Culture', lastName: 'Heritage' },
    providerType: 'tour_guide',
    organizerName: 'Kandyan Heritage Cultural Association',
    organizerPhone: '+94 81 223 4567',
    organizerEmail: 'contact@kandydance.lk'
  }
];

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
    organizerName: '',
    organizerPhone: '',
    organizerEmail: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Contact Modal State (for Tourists)
  const [contactModalExperience, setContactModalExperience] = useState(null);

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
      organizerName: experience.organizerName || '',
      organizerPhone: experience.organizerPhone || '',
      organizerEmail: experience.organizerEmail || ''
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
      organizerName: '',
      organizerPhone: '',
      organizerEmail: ''
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
      organizerName: formData.organizerName,
      organizerPhone: formData.organizerPhone,
      organizerEmail: formData.organizerEmail
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

  // Combine static mock experiences and DB experiences
  const allExperiences = [...dbExperiences, ...mockExperiences];

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
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        {experience.description}
                      </p>

                      {/* Experience Owner / Organizer Contact Section */}
                      <div className="bg-[#141418]/80 border border-white/10 rounded-2xl p-3.5 mb-5 space-y-2 text-xs">
                        <div className="text-[10px] uppercase font-extrabold text-[#FF8C00] tracking-wider flex items-center gap-1.5">
                          <UserCheck size={13} />
                          <span>Experience Owner / Organizer</span>
                        </div>
                        <div className="font-bold text-gray-200 text-sm truncate">
                          {experience.organizerName || `${experience.providedBy?.firstName || 'Local'} ${experience.providedBy?.lastName || 'Organizer'}`}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {(experience.organizerPhone || experience.providedBy?.phone) && (
                            <a 
                              href={`tel:${experience.organizerPhone || experience.providedBy?.phone}`}
                              className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs"
                              title="Call Organizer"
                            >
                              <Phone size={12} />
                              <span>{experience.organizerPhone || experience.providedBy?.phone}</span>
                            </a>
                          )}
                          
                          {(experience.organizerEmail || experience.providedBy?.email) && (
                            <a 
                              href={`mailto:${experience.organizerEmail || experience.providedBy?.email}`}
                              className="flex items-center gap-1.5 bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs truncate max-w-full"
                              title="Email Organizer"
                            >
                              <Mail size={12} />
                              <span className="truncate">{experience.organizerEmail || experience.providedBy?.email}</span>
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
                          <span>Contact Owner</span>
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

              {/* Experience Owner / Organizer Contact Details */}
              <div className="bg-[#0f0f11]/60 border border-white/10 p-4 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-[#FF8C00] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <UserCheck size={14} />
                  <span>Experience Owner / Organizer Contact (For Tourists)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organizer / Business Name</label>
                  <input
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleInputChange}
                    placeholder="e.g., Minneriya Wild Safari Tours / Kitulgala Rafting Team"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Phone / WhatsApp</label>
                    <input
                      type="text"
                      name="organizerPhone"
                      value={formData.organizerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., +94 77 123 4567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email (Optional)</label>
                    <input
                      type="email"
                      name="organizerEmail"
                      value={formData.organizerEmail}
                      onChange={handleInputChange}
                      placeholder="e.g., contact@organizer.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF8C00]/80 transition-all font-medium"
                    />
                  </div>
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

      {/* Contact Organizer Modal Popup */}
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
                  <h3 className="text-lg font-bold text-white leading-tight">Contact Experience Owner</h3>
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
                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider block mb-1">Organizer / Business Name</span>
                <span className="text-base font-bold text-white">
                  {contactModalExperience.organizerName || `${contactModalExperience.providedBy?.firstName || 'Local'} ${contactModalExperience.providedBy?.lastName || 'Organizer'}`}
                </span>
              </div>

              {(contactModalExperience.organizerPhone || contactModalExperience.providedBy?.phone) && (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Phone / WhatsApp</span>
                    <span className="text-sm font-bold text-white">{contactModalExperience.organizerPhone || contactModalExperience.providedBy?.phone}</span>
                  </div>
                  <a
                    href={`tel:${contactModalExperience.organizerPhone || contactModalExperience.providedBy?.phone}`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                  >
                    <Phone size={14} />
                    <span>Call Now</span>
                  </a>
                </div>
              )}

              {(contactModalExperience.organizerEmail || contactModalExperience.providedBy?.email) && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl">
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-bold text-white truncate block">{contactModalExperience.organizerEmail || contactModalExperience.providedBy?.email}</span>
                  </div>
                  <a
                    href={`mailto:${contactModalExperience.organizerEmail || contactModalExperience.providedBy?.email}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all shrink-0"
                  >
                    <Mail size={14} />
                    <span>Send Email</span>
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
    </div>
  );
};

export default Experiences;
