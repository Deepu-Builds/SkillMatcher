import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import RoadmapDetail from './pages/RoadmapDetail'
import Profile from './pages/Profile'
import Saved from './pages/Saved'
import QuizHistory from './pages/QuizHistory'
import Explore from './pages/Explore'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

const App = () => {
  const { isAuthenticated, refreshUser } = useAuthStore()

  // Sync fresh user data from server on every app load
  // This ensures avatar/profile changes show everywhere (other browsers, devices)
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />

        {/* Auth pages — redirect if already logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* Protected pages — must be logged in */}
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/path/:id" element={<ProtectedRoute><RoadmapDetail /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
