import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'lucide-react';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Signing in with:', username);
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
            
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your username"
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
                  <a href="#" className="font-semibold text-sunset-orange hover:text-sunset-teal transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
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
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none"
              >
                Sign In
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
