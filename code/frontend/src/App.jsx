import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignInPage from './components/Auth/SignInPage'
import RegisterPage from './components/Auth/RegisterPage'
import ForgotPassword from './components/Auth/ForgotPassword'
import VerifyEmail from './components/Auth/VerifyEmail'
import RoutesPage from './components/Routes/RoutesPage'
import { VehicleProvider } from './context/VehicleContext'
import Vehicles from './components/Vehicles/Vehicles'
import VehicleDetails from './components/Vehicles/VehicleDetails'
import AddVehicle from './components/OwnerDashboard/AddVehicle'
import ProviderBookings from './components/OwnerDashboard/ProviderBookings'
import AdminDashboard from './components/Admin/AdminDashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AddProperty from './components/OwnerDashboard/AddProperty'
import EditProperty from './components/OwnerDashboard/EditProperty'
import Hotels from './components/Hotels/Hotels'
import HotelDetails from './components/Hotels/HotelDetails'
import Profile from './components/Profile/Profile'
import MyBookings from './components/Profile/MyBookings'
import Destinations from './components/Destinations/Destinations'

import TravelChatWidget from './components/TravelChatWidget'

function App() {
  const handleSendMessage = async (message, history) => {
    try {
      const response = await fetch('http://localhost:3001/api/chat', { // using localhost port if backend is running there, but better to use relative path if there's proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // if user is logged in, you'd pass their ID. For now just passing message and history
        body: JSON.stringify({ message, conversationHistory: history })
      });
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error connecting to chat:', error);
      return "I'm sorry, I'm having trouble connecting right now.";
    }
  };

  return (
    <VehicleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/destinations" element={<Destinations />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/add-property" element={<ProtectedRoute roles={['hotel_owner']}><AddProperty /></ProtectedRoute>} />
          <Route path="/edit-property/:id" element={<ProtectedRoute roles={['hotel_owner']}><EditProperty /></ProtectedRoute>} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/hotel/preview" element={<HotelDetails />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/provider-bookings" element={<ProtectedRoute roles={['hotel_owner', 'vehicle_owner', 'tour_guide']}><ProviderBookings /></ProtectedRoute>} />
          
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/add-vehicle" element={<ProtectedRoute roles={['vehicle_owner']}><AddVehicle /></ProtectedRoute>} />

        </Routes>
        <TravelChatWidget onSendMessage={handleSendMessage} />
      </Router>
    </VehicleProvider>
  )
}

export default App

