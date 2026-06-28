/**
 * AuthContext.jsx — exports AuthContext + AuthProvider only.
 * The useAuth hook lives in useAuth.js (separate file for Fast Refresh compatibility).
 */

import { useState, useEffect, useCallback } from 'react'
import { getCurrentAccount, logoutApi } from './api'
import { saveToken, getToken, clearToken } from '../../lib/storage'
import { AuthContext } from './AuthContextValue'


export function AuthProvider({ children }) {
  const [user, setUser]                       = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      const id = setTimeout(() => setIsBootstrapping(false), 0)
      return () => clearTimeout(id)
    }

    getCurrentAccount()
      .then((res) => {
        setUser(res.data.data)
      })
      .catch(() => {
        clearToken()
      })
      .finally(() => {
        setIsBootstrapping(false)
      })
  }, [])

  const login = useCallback((token, userObj) => {
    saveToken(token)
    setUser(userObj)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // still clear locally even if API fails
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isBootstrapping,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
