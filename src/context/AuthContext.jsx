import { createContext, useState, useEffect, useContext } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('imani_token')
    if (token) {
      authAPI.verify()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('imani_token')
          setIsAuthenticated(false)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login(email, password)
    localStorage.setItem('imani_token', res.data.token)
    setIsAuthenticated(true)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('imani_token')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
