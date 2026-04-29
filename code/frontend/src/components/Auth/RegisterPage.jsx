import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, User, Building, MapPin } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tourist'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        alert('Registration successful! Please sign in.');
        window.location.href = '/login';
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-200 font-outfit">

      {/* Brand Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-gradient-to-br from-sunset-gold to-sunset-orange rounded-xl flex items-center justify-center shadow-lg">
            <Navigation className="text-white" size={28} />
          </div>
          <span className="text-sunset-dark font-bold text-3xl tracking-tight">Pearl<span className="text-sunset-orange">Path</span></span>
        </Link>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the Pearl Path community today
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">

          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-teal"></div>

          <form className="space-y-5" onSubmit={handleRegister}>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am signing up as a...
              </label>
              <div className="flex flex-wrap gap-3">
                {/* Tourist Role */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tourist' })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                    formData.role === 'tourist'
                      ? 'border-sunset-orange bg-orange-50/50 shadow-sm text-sunset-orange font-bold'
                      : 'border-gray-200 hover:border-sunset-orange/50 hover:bg-gray-50 text-gray-600 font-medium'
                  }`}
                >
                  <User size={18} />
                  <span>Tourist</span>
                </button>

                {/* Hotel Owner Role */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'hotel_owner' })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                    formData.role === 'hotel_owner'
                      ? 'border-sunset-gold bg-yellow-50/50 shadow-sm text-sunset-gold font-bold'
                      : 'border-gray-200 hover:border-sunset-gold/50 hover:bg-gray-50 text-gray-600 font-medium'
                  }`}
                >
                  <Building size={18} />
                  <span>Hotel Owner</span>
                </button>

                {/* Tour Guide Role */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tour_guide' })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                    formData.role === 'tour_guide'
                      ? 'border-sunset-teal bg-teal-50/50 shadow-sm text-sunset-teal font-bold'
                      : 'border-gray-200 hover:border-sunset-teal/50 hover:bg-gray-50 text-gray-600 font-medium'
                  }`}
                >
                  <MapPin size={18} />
                  <span>Tour Guide</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="John"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                placeholder="name@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                placeholder="+94 77 123 4567"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Create Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Create Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-sunset-orange hover:text-sunset-teal transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
