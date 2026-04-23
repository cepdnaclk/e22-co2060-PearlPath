import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  // Handle Password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1000);
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
          {step === 1 && 'Reset your password'}
          {step === 2 && 'Enter verification code'}
          {step === 3 && 'Create new password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 && "Enter your email and we'll send you a link to reset your password."}
          {step === 2 && `We've sent a 6-digit code to ${email}`}
          {step === 3 && 'Your new password must be different from previous used passwords.'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-teal"></div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-sm text-gray-600">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100 animate-slide-down">
                  {error}
                </div>
              )}

              {/* Step 1: Email Form */}
              {step === 1 && (
                <form className="space-y-6 animate-fade-in" onSubmit={handleEmailSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: OTP Form */}
              {step === 2 && (
                <form className="space-y-6 animate-fade-in" onSubmit={handleOtpSubmit}>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold text-slate-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange transition-colors bg-gray-50 focus:bg-white"
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </div>
                  
                  <div className="text-center text-sm">
                    <span className="text-gray-500">Didn't receive the code? </span>
                    <button type="button" className="font-semibold text-sunset-orange hover:text-sunset-teal transition-colors" onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}>
                      Resend
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password Form */}
              {step === 3 && (
                <form className="space-y-6 animate-fade-in" onSubmit={handlePasswordSubmit}>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:shadow-sunset-orange/50 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {!success && (
            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sunset-orange transition-colors">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
