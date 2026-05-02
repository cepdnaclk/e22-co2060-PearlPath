import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';



const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.status === 'pending') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Account Pending',
            text: 'Your account is pending admin approval.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          return;
        }
        if (data.user.status === 'rejected') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Account Rejected',
            text: 'Your account has been rejected by the admin.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          return;
        }

        console.log('Login successful:', data);
        
        login(data.user, data.token);
        
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${data.user.firstName}!`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'super_admin') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Login failed.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Connection Error',
        text: 'An error occurred during login. Is the server running?',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
      setError('An error occurred during login. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-200 font-outfit">

      {/* Brand Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-gradient-to-br from-sunset-gold to-sunset-orange rounded-xl flex items-center justify-center shadow-lg">
            <Navigation className="text-white" size={28} />
          </div>
          <span className="text-sunset-dark font-bold text-3xl tracking-tight">Pearl<span className="text-sunset-orange">Path</span></span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in or create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your personalized Pearl Path experience
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">

          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-teal"></div>

          <form className="space-y-6" onSubmit={handleSignIn}>

            {/* Hidden iframe and form to force password save prompt */}
            <iframe name="dummyframe" id="dummyframe" style={{ display: 'none' }}></iframe>
            <form
              id="hidden-login-form"
              action="/dummy-login"
              method="post"
              target="dummyframe"
              style={{ display: 'none' }}
            >
              <input type="text" name="username" value={email} readOnly />
              <input type="password" name="password" value={password} readOnly />
            </form>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="username"
                  autoComplete="username"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-sunset-orange hover:text-sunset-teal transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-sunset-orange hover:text-sunset-teal transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info snippet matching standard clean forms */}
        <div className="mt-8 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p>By signing in or creating an account, you agree with our <a href="#" className="text-sunset-orange hover:underline">Terms & Conditions</a> and <a href="#" className="text-sunset-orange hover:underline">Privacy Statement</a>.</p>
          <p>All rights reserved. Copyright © {new Date().getFullYear()} – PearlPath™</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
