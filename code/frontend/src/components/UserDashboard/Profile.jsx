import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Save, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        phone: parsedUser.phone || '',
      });
    } else {
        window.location.href = '/login';
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token header here if implemented: 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Update local storage
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setMessage({ text: data.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({ text: 'An error occurred. Is the server running?', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center font-outfit">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-outfit py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link to="/" className="text-sm font-medium text-sunset-orange hover:text-sunset-teal mb-4 inline-block">&larr; Back to Home</Link>
            <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-2">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-teal"></div>
            
            <form onSubmit={handleSubmit} className="p-8">
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                        <div className="relative border border-slate-300 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-sunset-orange focus-within:bg-white transition-all overflow-hidden flex">
                             <div className="flex items-center justify-center pl-4 pr-3 text-slate-400 bg-slate-100 border-r border-slate-300">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-transparent outline-none focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                        <div className="relative border border-slate-300 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-sunset-orange focus-within:bg-white transition-all overflow-hidden flex">
                             <div className="flex items-center justify-center pl-4 pr-3 text-slate-400 bg-slate-100 border-r border-slate-300">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-transparent outline-none focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address (Non-editable)</label>
                     <div className="relative border border-slate-200 bg-slate-100 rounded-xl overflow-hidden flex opacity-70 cursor-not-allowed">
                        <div className="flex items-center justify-center pl-4 pr-3 text-slate-500 bg-slate-200 border-r border-slate-300 tracking-wide">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 bg-transparent outline-none cursor-not-allowed text-slate-600 font-medium"
                        />
                    </div>
                </div>

                <div className="mb-8">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                     <div className="relative border border-slate-300 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-sunset-orange focus-within:bg-white transition-all overflow-hidden flex">
                        <div className="flex items-center justify-center pl-4 pr-3 text-slate-400 bg-slate-100 border-r border-slate-300">
                            <Phone size={18} />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-transparent outline-none focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-lg hover:shadow-sunset-orange/30 text-white font-bold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
