import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { User, MapPin, DollarSign, Camera, Check } from 'lucide-react';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerDay: '',
    experienceYears: '',
    profilePictureUrl: '',
    contactEmail: '',
    bio: '',
    languages: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser._id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/tour-guides/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          location: data.location || '',
          pricePerDay: data.pricePerDay || '',
          experienceYears: data.experienceYears || '',
          profilePictureUrl: data.profilePictureUrl || '',
          contactEmail: data.contactEmail || '',
          bio: data.bio || '',
          languages: data.languages ? data.languages.join(', ') : ''
        });
      } else {
        // Doesn't exist yet, populate with user defaults
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setFormData(prev => ({
           ...prev,
           name: `${storedUser.firstName} ${storedUser.lastName}`,
           contactEmail: storedUser.email
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const payload = {
        userId: user._id,
        name: formData.name,
        location: formData.location,
        pricePerDay: Number(formData.pricePerDay),
        experienceYears: Number(formData.experienceYears),
        profilePictureUrl: formData.profilePictureUrl,
        contactEmail: formData.contactEmail,
        bio: formData.bio,
        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l)
      };

      const res = await fetch('http://127.0.0.1:3001/api/tour-guides/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('Profile saved successfully!');
      } else {
        alert('Failed to save profile. Please check required fields.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-sunset-dark text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">My Tour Guide Profile</h1>
          <p className="text-gray-300">Manage how tourists see you on PearlPath.</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm animate-pulse">
            <Check size={20} />
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Public Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. Kamal Perera" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location / Base City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. Kandy" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price Per Day (LKR)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. 5000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                <input name="experienceYears" value={formData.experienceYears} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. 5" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                <input required name="contactEmail" value={formData.contactEmail} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. contact@example.com" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Languages Spoken (comma separated)</label>
                <input name="languages" value={formData.languages} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="e.g. English, Sinhala, French" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Profile Picture Image URL</label>
                <div className="relative">
                  <Camera size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleChange} type="url" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none" placeholder="https://source.unsplash.com/your-image.jpg" />
                </div>
                {formData.profilePictureUrl && (
                  <div className="mt-4 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <img src={formData.profilePictureUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full shadow-sm" />
                    <span className="text-sm font-bold text-gray-600">Picture Preview</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Biography</label>
                <textarea required name="bio" value={formData.bio} onChange={handleChange} rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sunset-teal focus:ring-2 focus:ring-sunset-teal/20 transition-all outline-none resize-none" placeholder="Tell tourists about yourself, your specialties, and your guiding style..."></textarea>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm disabled:opacity-75"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
