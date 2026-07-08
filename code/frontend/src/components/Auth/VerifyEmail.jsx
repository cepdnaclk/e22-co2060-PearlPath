import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navigation, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || 'tourist';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const otpRefs = useRef([]);

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

  // Handle Resend Code
  const handleResendCode = async () => {
    setError('');
    setResendLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Verification Sent',
          text: 'A new 6-digit code has been sent to your email.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        setError(data.message || 'Failed to resend verification code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while resending the code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle Submit Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpValue })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user.role === 'tourist') {
          // Log tourist in automatically
          login(data.user, data.token);
          await Swal.fire({
            icon: 'success',
            title: 'Email Verified!',
            text: 'Your account is verified and you are now logged in.',
            confirmButtonColor: '#ff7c3b'
          });
          navigate('/');
        } else {
          // Provider must wait for admin approval
          await Swal.fire({
            icon: 'success',
            title: 'Email Verified!',
            text: 'Your email has been verified. Your account is pending admin approval. You will be able to log in once approved.',
            confirmButtonColor: '#ff7c3b'
          });
          navigate('/login');
        }
      } else {
        setError(data.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
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
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We sent a verification code to <span className="font-semibold text-slate-800">{email}</span>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-teal"></div>

          <form className="space-y-6" onSubmit={handleVerifySubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

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
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sunset-orange to-sunset-gold hover:from-sunset-orange/90 hover:to-sunset-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunset-orange disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {loading ? 'Verifying...' : 'Verify Account'} <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 text-xs font-semibold">
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="flex items-center gap-1.5 text-sunset-orange hover:text-sunset-orange/80 disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={14} /> {resendLoading ? 'Resending...' : 'Resend Verification Code'}
            </button>
            
            <Link to="/login" className="text-gray-500 hover:text-gray-700 transition-colors">
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
