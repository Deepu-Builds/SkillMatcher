import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/authApi'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setAuth, logout: storeLogout, isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.login({ email, password })
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.register({ name, email, password })
      setAuth(data.user, data.token)
      navigate('/quiz')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    storeLogout()
    navigate('/')
  }

  return { login, register, logout, loading, error, isAuthenticated, user }
}
