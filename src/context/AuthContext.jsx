import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, setUnauthorizedHandler } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Branche l'intercepteur 401 sur le logout React — fait une seule fois
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token invalide : on purge tout, pas de session fantôme
        localStorage.removeItem('qvslv_token')
        localStorage.removeItem('qvslv_user')
        sessionStorage.removeItem('qvslv_token')
        sessionStorage.removeItem('qvslv_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const saveSession = (token, userData, remember) => {
    // On vide l'autre storage avant de sauvegarder pour éviter un token fantôme
    if (remember) {
      sessionStorage.removeItem('qvslv_token')
      sessionStorage.removeItem('qvslv_user')
      localStorage.setItem('qvslv_token', token)
      localStorage.setItem('qvslv_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('qvslv_token')
      localStorage.removeItem('qvslv_user')
      sessionStorage.setItem('qvslv_token', token)
      sessionStorage.setItem('qvslv_user', JSON.stringify(userData))
    }
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
