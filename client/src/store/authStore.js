import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      // Fetches fresh user data from server and syncs the store
      refreshUser: async () => {
        const { token } = get()
        if (!token) return
        try {
          const { data } = await axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data?.user) {
            set((state) => ({ user: { ...state.user, ...data.user } }))
          }
        } catch (err) {
          // If 401, log out
          if (err.response?.status === 401) {
            set({ user: null, token: null, isAuthenticated: false })
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
