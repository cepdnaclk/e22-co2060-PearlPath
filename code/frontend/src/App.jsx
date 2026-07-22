import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignInPage from './components/Auth/SignInPage'
import RegisterPage from './components/Auth/RegisterPage'

import AddProperty from './components/OwnerDashboard/AddProperty'
import Hotels from './components/Hotels/Hotels'
import HotelDetails from './components/Hotels/HotelDetails'
import Profile from './components/UserDashboard/Profile'
import MyBookings from './components/UserDashboard/MyBookings'

import ForgotPassword from './components/Auth/ForgotPassword'
import TravelChatWidget from './components/TravelChatWidget'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const handleSendMessage = async (message, history) => {
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          conversationHistory: history,
          userId: user ? user._id : null
        })
      });
      const data = await response.json();
      return { reply: data.reply, context: data.context };
    } catch (error) {
      console.error('Error connecting to chat:', error);
      return { reply: "I'm sorry, I'm having trouble connecting right now.", context: null };
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/hotel/preview" element={<HotelDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <TravelChatWidget onSendMessage={handleSendMessage} user={user} />
    </Router>
  )
}

export default App
