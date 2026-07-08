import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignInPage from './components/Auth/SignInPage'
import RegisterPage from './components/Auth/RegisterPage'
import ForgotPassword from './components/Auth/ForgotPassword'
import VerifyEmail from './components/Auth/VerifyEmail'
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
import TourGuides from './components/TourGuides/TourGuides'
import TourGuideDetails from './components/TourGuides/TourGuideDetails'
import EditProfile from './components/TourGuideDashboard/EditProfile'
import Profile from './components/Profile/Profile'
import MyBookings from './components/Profile/MyBookings'

function App() {
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

          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/tour-guides" element={<TourGuides />} />
          <Route path="/tour-guide/:id" element={<TourGuideDetails />} />
          <Route path="/tour-guide/edit-profile" element={<EditProfile />} />

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
      </Router>
    </VehicleProvider>
  )
}

export default App

