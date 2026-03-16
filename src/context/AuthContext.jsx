import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('qvslv_token')
        sessionStorage.removeItem('qvslv_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const saveSession = (token, userData, remember) => {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem('qvslv_token', token)
    storage.setItem('qvslv_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('qvslv_token')
    localStorage.removeItem('qvslv_user')
    sessionStorage.removeItem('qvslv_token')
    sessionStorage.removeItem('qvslv_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
