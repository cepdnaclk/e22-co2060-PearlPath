import React from 'react'
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
import Vehicles from './components/Vehicles/Vehicles'
import AddVehicle from './components/OwnerDashboard/AddVehicle'


function App() {
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
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </Router>
  )
}

export default App
