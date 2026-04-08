import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignInPage from './components/Auth/SignInPage'
import RegisterPage from './components/Auth/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} /> 
      </Routes>
    </Router>
  )
}

export default App
