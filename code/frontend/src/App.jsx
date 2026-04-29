import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignInPage from './components/Auth/SignInPage'
import RegisterPage from './components/Auth/RegisterPage'
import ForgotPassword from './components/Auth/ForgotPassword'
<<<<<<< HEAD
import { VehicleProvider } from './context/VehicleContext'
import VehicleSelector from './components/Vehicle/VehicleSelector'

function App() {
  return (
    <VehicleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/vehicles" element={<VehicleSelector />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </VehicleProvider>
=======
import Vehicles from './components/Vehicles/Vehicles'
import AddVehicle from './components/OwnerDashboard/AddVehicle'
import ProviderBookings from './components/OwnerDashboard/ProviderBookings'
import AdminDashboard from './components/Admin/AdminDashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        <Route path="/add-property" element={<ProtectedRoute roles={['hotel_owner']}><AddProperty /></ProtectedRoute>} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/hotel/preview" element={<HotelDetails />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/provider-bookings" element={<ProtectedRoute roles={['hotel_owner', 'vehicle_owner', 'tour_guide']}><ProviderBookings /></ProtectedRoute>} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/add-vehicle" element={<ProtectedRoute roles={['vehicle_owner']}><AddVehicle /></ProtectedRoute>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </Router>
>>>>>>> origin/update-backend1
  )
}

export default App
