import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('Tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { id: 'Tourist', icon: '🌍' },
    { id: 'Hotel Owner', icon: '🏨' },
    { id: 'Tour Guide / Vehicle', icon: '🗺️' },
    { id: 'Banker', icon: '🏦' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in as', role, 'with', email);
    // Add real authentication logic here
  };

  return (
    <div className="login-container">
      {/* Left side - Dynamic Background & Branding */}
      <div className="login-left">
        <div className="video-background" style={{ backgroundColor: '#000' }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/f-Sdk3Jjp3I?autoplay=1&mute=1&loop=1&playlist=f-Sdk3Jjp3I&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&origin=http://localhost:5174&vq=hd1080"
            title="Sri Lanka Tourism Background"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="login-overlay"></div>
        <div className="login-left-content">
          <div className="brand-name">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                <circle cx="12" cy="9" r="2.5"></circle>
              </svg>
            </div>
            Pearl Path
          </div>
        </div>
        
        <div className="welcome-text">
          <h1>Discover the beauty of Sri Lanka.</h1>
          <p>Your ultimate digital travel companion. Plan your trips, find trusted guides, and stay safe with our centralized tourism platform.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="role-selector">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  className={`role-btn ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="role-icon">{r.icon}</span>
                  {r.id === 'Tour Guide / Vehicle' ? 'Guide / Service' : r.id}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-pwd">Forgot password?</a>
            </div>

            <div className="auth-buttons">
              <button type="submit" className="submit-btn">
                Sign In
              </button>
            </div>

            <p className="signup-prompt">
              Don't have an account? <span className="signup-link" onClick={() => console.log('Navigate to Register')}>Create one</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
